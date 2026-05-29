package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

// --- slidingWindow unit tests (unexported type, same package) ---

func TestSlidingWindow_Allow(t *testing.T) {
	t.Run("allows requests under the limit", func(t *testing.T) {
		sw := newSlidingWindow(3, time.Second)
		for i := range 3 {
			if !sw.allow("user-1") {
				t.Errorf("call %d: want allowed", i+1)
			}
		}
	})

	t.Run("blocks when limit is reached", func(t *testing.T) {
		sw := newSlidingWindow(2, time.Second)
		sw.allow("user-1")
		sw.allow("user-1")

		if sw.allow("user-1") {
			t.Error("third call must be blocked")
		}
	})

	t.Run("counters are independent per key", func(t *testing.T) {
		sw := newSlidingWindow(1, time.Second)
		sw.allow("alice")

		// alice is at limit; bob is a fresh key
		if sw.allow("alice") {
			t.Error("alice must be blocked at limit")
		}
		if !sw.allow("bob") {
			t.Error("bob must still be allowed (separate counter)")
		}
	})

	t.Run("old timestamps outside the window do not count", func(t *testing.T) {
		sw := newSlidingWindow(1, 20*time.Millisecond)
		sw.allow("user-1") // fills the window

		if sw.allow("user-1") {
			t.Fatal("must be blocked immediately after first call")
		}

		time.Sleep(30 * time.Millisecond) // wait for window to expire

		if !sw.allow("user-1") {
			t.Error("must be allowed again after window expires")
		}
	})
}

// --- RateLimit middleware HTTP tests ---

func okHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
}

func rateLimitedReq(userID string) *http.Request {
	r := httptest.NewRequest(http.MethodPost, "/", nil)
	if userID != "" {
		ctx := ContextWithUser(r.Context(), &supabase.User{ID: userID})
		r = r.WithContext(ctx)
	}
	return r
}

func TestRateLimit(t *testing.T) {
	t.Run("no user in context returns 401", func(t *testing.T) {
		mw := RateLimit(10, time.Minute)
		w := httptest.NewRecorder()
		mw(okHandler()).ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/", nil))

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("want 401, got %d", w.Code)
		}
	})

	t.Run("requests under limit are passed through", func(t *testing.T) {
		mw := RateLimit(5, time.Minute)
		for i := range 5 {
			w := httptest.NewRecorder()
			mw(okHandler()).ServeHTTP(w, rateLimitedReq("alice"))
			if w.Code != http.StatusOK {
				t.Errorf("call %d: want 200, got %d", i+1, w.Code)
			}
		}
	})

	t.Run("request exceeding limit returns 429", func(t *testing.T) {
		mw := RateLimit(2, time.Minute)

		for range 2 {
			w := httptest.NewRecorder()
			mw(okHandler()).ServeHTTP(w, rateLimitedReq("bob"))
			if w.Code != http.StatusOK {
				t.Fatalf("setup: want 200")
			}
		}

		w := httptest.NewRecorder()
		mw(okHandler()).ServeHTTP(w, rateLimitedReq("bob"))
		if w.Code != http.StatusTooManyRequests {
			t.Fatalf("want 429, got %d", w.Code)
		}
	})

	t.Run("different users have independent limits", func(t *testing.T) {
		mw := RateLimit(1, time.Minute)

		// carol hits her limit
		w1 := httptest.NewRecorder()
		mw(okHandler()).ServeHTTP(w1, rateLimitedReq("carol"))
		if w1.Code != http.StatusOK {
			t.Fatalf("setup: want 200")
		}

		w2 := httptest.NewRecorder()
		mw(okHandler()).ServeHTTP(w2, rateLimitedReq("carol"))
		if w2.Code != http.StatusTooManyRequests {
			t.Fatalf("carol must be blocked, got %d", w2.Code)
		}

		// dave is a different user — unaffected
		w3 := httptest.NewRecorder()
		mw(okHandler()).ServeHTTP(w3, rateLimitedReq("dave"))
		if w3.Code != http.StatusOK {
			t.Errorf("dave must still pass, got %d", w3.Code)
		}
	})
}
