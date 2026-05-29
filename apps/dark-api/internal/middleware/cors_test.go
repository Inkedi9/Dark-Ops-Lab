package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCORS(t *testing.T) {
	const origin = "https://darknexus.example.com"

	t.Run("OPTIONS preflight returns 204 with CORS headers and does not call next", func(t *testing.T) {
		called := false
		next := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
			called = true
		})

		r := httptest.NewRequest(http.MethodOptions, "/v1/challenges/x/submit", nil)
		w := httptest.NewRecorder()
		CORS(origin)(next).ServeHTTP(w, r)

		if w.Code != http.StatusNoContent {
			t.Fatalf("want 204, got %d", w.Code)
		}
		if called {
			t.Error("next handler must not be called for OPTIONS preflight")
		}
		assertCORSHeaders(t, w, origin)
	})

	t.Run("non-OPTIONS request calls next and sets CORS headers", func(t *testing.T) {
		called := false
		next := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
			called = true
			w.WriteHeader(http.StatusOK)
		})

		r := httptest.NewRequest(http.MethodPost, "/v1/challenges/x/submit", nil)
		w := httptest.NewRecorder()
		CORS(origin)(next).ServeHTTP(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		if !called {
			t.Error("next handler must be called for non-OPTIONS request")
		}
		assertCORSHeaders(t, w, origin)
	})

	t.Run("CORS headers use the configured origin", func(t *testing.T) {
		const other = "http://localhost:3000"
		r := httptest.NewRequest(http.MethodGet, "/v1/leaderboard", nil)
		w := httptest.NewRecorder()
		CORS(other)(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
			w.WriteHeader(http.StatusOK)
		})).ServeHTTP(w, r)

		if got := w.Header().Get("Access-Control-Allow-Origin"); got != other {
			t.Errorf("want origin %q, got %q", other, got)
		}
	})
}

func assertCORSHeaders(t *testing.T, w *httptest.ResponseRecorder, wantOrigin string) {
	t.Helper()
	checks := map[string]string{
		"Access-Control-Allow-Origin":  wantOrigin,
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Authorization, Content-Type",
	}
	for header, want := range checks {
		if got := w.Header().Get(header); got != want {
			t.Errorf("%s: want %q, got %q", header, want, got)
		}
	}
}
