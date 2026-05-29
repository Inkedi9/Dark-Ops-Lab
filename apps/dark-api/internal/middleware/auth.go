package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

type contextKey string

const userKey contextKey = "user"

// Auth validates the Supabase JWT in the Authorization header.
// Attaches the authenticated user to the request context on success.
func Auth(sb supabase.Client) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			auth := r.Header.Get("Authorization")
			if !strings.HasPrefix(auth, "Bearer ") {
				http.Error(w, `{"error":"missing authorization header"}`, http.StatusUnauthorized)
				return
			}

			token := strings.TrimPrefix(auth, "Bearer ")
			user, err := sb.GetUser(r.Context(), token)
			if err != nil {
				http.Error(w, `{"error":"invalid or expired token"}`, http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), userKey, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// UserFromContext retrieves the authenticated user from the request context.
func UserFromContext(ctx context.Context) *supabase.User {
	u, _ := ctx.Value(userKey).(*supabase.User)
	return u
}

// ContextWithUser attaches user to ctx under the package-private key.
// Use in tests to bypass the Auth middleware without duplicating the key type.
func ContextWithUser(ctx context.Context, user *supabase.User) context.Context {
	return context.WithValue(ctx, userKey, user)
}
