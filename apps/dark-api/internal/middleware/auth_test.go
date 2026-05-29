package middleware

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

// sentinel is the handler called when Auth lets the request through.
// It records whether it was invoked and captures the user from context.
type sentinel struct {
	called bool
	user   *supabase.User
}

func (s *sentinel) handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		s.called = true
		s.user = UserFromContext(r.Context())
		w.WriteHeader(http.StatusOK)
	})
}

func applyAuth(mc *mockSB, r *http.Request, next http.Handler) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	Auth(mc)(next).ServeHTTP(w, r)
	return w
}

func TestAuth(t *testing.T) {
	aliceUser := &supabase.User{ID: "alice", Email: "alice@example.com"}

	t.Run("missing Authorization header returns 401", func(t *testing.T) {
		mc := &mockSB{}
		s := &sentinel{}
		r := httptest.NewRequest(http.MethodGet, "/", nil)

		w := applyAuth(mc, r, s.handler())

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("want 401, got %d", w.Code)
		}
		if s.called {
			t.Error("next handler must not be called")
		}
	})

	t.Run("Authorization without Bearer prefix returns 401", func(t *testing.T) {
		for _, header := range []string{"Token abc", "Basic dXNlcjpwYXNz", "abc", ""} {
			mc := &mockSB{}
			s := &sentinel{}
			r := httptest.NewRequest(http.MethodGet, "/", nil)
			r.Header.Set("Authorization", header)

			w := applyAuth(mc, r, s.handler())

			if w.Code != http.StatusUnauthorized {
				t.Errorf("header %q: want 401, got %d", header, w.Code)
			}
			if s.called {
				t.Errorf("header %q: next handler must not be called", header)
			}
		}
	})

	t.Run("GetUser failure returns 401 and next is not called", func(t *testing.T) {
		mc := &mockSB{
			getUserFn: func(_ context.Context, _ string) (*supabase.User, error) {
				return nil, errors.New("expired token")
			},
		}
		s := &sentinel{}
		r := httptest.NewRequest(http.MethodGet, "/", nil)
		r.Header.Set("Authorization", "Bearer bad-token")

		w := applyAuth(mc, r, s.handler())

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("want 401, got %d", w.Code)
		}
		if s.called {
			t.Error("next handler must not be called when token is invalid")
		}
	})

	t.Run("valid token: next is called with user in context", func(t *testing.T) {
		mc := &mockSB{
			getUserFn: func(_ context.Context, _ string) (*supabase.User, error) {
				return aliceUser, nil
			},
		}
		s := &sentinel{}
		r := httptest.NewRequest(http.MethodGet, "/", nil)
		r.Header.Set("Authorization", "Bearer valid-jwt")

		w := applyAuth(mc, r, s.handler())

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		if !s.called {
			t.Fatal("next handler must be called for valid token")
		}
		if s.user == nil {
			t.Fatal("user must be set in context")
		}
		if s.user.ID != aliceUser.ID {
			t.Errorf("user.ID: want %q, got %q", aliceUser.ID, s.user.ID)
		}
	})

	t.Run("token is extracted without Bearer prefix before passing to GetUser", func(t *testing.T) {
		const rawToken = "eyJhbGciOiJIUzI1NiJ9.payload.sig"
		var capturedToken string
		mc := &mockSB{
			getUserFn: func(_ context.Context, token string) (*supabase.User, error) {
				capturedToken = token
				return aliceUser, nil
			},
		}
		r := httptest.NewRequest(http.MethodGet, "/", nil)
		r.Header.Set("Authorization", "Bearer "+rawToken)

		applyAuth(mc, r, http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
			w.WriteHeader(http.StatusOK)
		}))

		if capturedToken != rawToken {
			t.Errorf("want token %q, got %q", rawToken, capturedToken)
		}
	})

	t.Run("empty token after Bearer space is forwarded to GetUser", func(t *testing.T) {
		var capturedToken string
		mc := &mockSB{
			getUserFn: func(_ context.Context, token string) (*supabase.User, error) {
				capturedToken = token
				return nil, errors.New("empty token rejected by Supabase")
			},
		}
		r := httptest.NewRequest(http.MethodGet, "/", nil)
		r.Header.Set("Authorization", "Bearer ")

		w := applyAuth(mc, r, http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
			w.WriteHeader(http.StatusOK)
		}))

		// Middleware forwards the empty string; Supabase rejects it → 401.
		if w.Code != http.StatusUnauthorized {
			t.Fatalf("want 401, got %d", w.Code)
		}
		if capturedToken != "" {
			t.Errorf("want empty token forwarded, got %q", capturedToken)
		}
	})
}

func TestUserFromContext(t *testing.T) {
	t.Run("returns nil when no user in context", func(t *testing.T) {
		if got := UserFromContext(context.Background()); got != nil {
			t.Errorf("want nil, got %+v", got)
		}
	})

	t.Run("returns nil for wrong value type in context", func(t *testing.T) {
		ctx := context.WithValue(context.Background(), userKey, "not-a-user")
		if got := UserFromContext(ctx); got != nil {
			t.Errorf("want nil for wrong type, got %+v", got)
		}
	})
}

func TestContextWithUser(t *testing.T) {
	t.Run("roundtrip: ContextWithUser then UserFromContext returns same pointer", func(t *testing.T) {
		user := &supabase.User{ID: "bob", Email: "bob@example.com"}
		ctx := ContextWithUser(context.Background(), user)
		got := UserFromContext(ctx)

		if got != user {
			t.Errorf("want same pointer, got %+v", got)
		}
	})

	t.Run("does not modify the original context", func(t *testing.T) {
		base := context.Background()
		user := &supabase.User{ID: "carol"}
		_ = ContextWithUser(base, user)

		if got := UserFromContext(base); got != nil {
			t.Errorf("original context must be unchanged, got %+v", got)
		}
	})
}
