package middleware

import (
	"net/http"
	"sync"
	"time"
)

type slidingWindow struct {
	mu       sync.Mutex
	attempts map[string][]time.Time
	window   time.Duration
	limit    int
}

func newSlidingWindow(limit int, window time.Duration) *slidingWindow {
	sw := &slidingWindow{
		attempts: make(map[string][]time.Time),
		window:   window,
		limit:    limit,
	}
	go sw.cleanup()
	return sw
}

func (sw *slidingWindow) allow(key string) bool {
	sw.mu.Lock()
	defer sw.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-sw.window)

	prev := sw.attempts[key]
	valid := prev[:0]
	for _, t := range prev {
		if t.After(cutoff) {
			valid = append(valid, t)
		}
	}

	if len(valid) >= sw.limit {
		sw.attempts[key] = valid
		return false
	}

	sw.attempts[key] = append(valid, now)
	return true
}

// cleanup removes stale entries every 5 minutes to prevent unbounded memory growth.
func (sw *slidingWindow) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	for range ticker.C {
		sw.mu.Lock()
		cutoff := time.Now().Add(-sw.window)
		for key, attempts := range sw.attempts {
			valid := attempts[:0]
			for _, t := range attempts {
				if t.After(cutoff) {
					valid = append(valid, t)
				}
			}
			if len(valid) == 0 {
				delete(sw.attempts, key)
			} else {
				sw.attempts[key] = valid
			}
		}
		sw.mu.Unlock()
	}
}

// RateLimit limits requests by authenticated user ID using a sliding window.
// Must run after the Auth middleware so the user is available in context.
func RateLimit(limit int, window time.Duration) func(http.Handler) http.Handler {
	sw := newSlidingWindow(limit, window)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := UserFromContext(r.Context())
			if user == nil {
				http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
				return
			}

			if !sw.allow(user.ID) {
				w.Header().Set("Content-Type", "application/json")
				http.Error(w, `{"error":"too many attempts — wait before trying again"}`, http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
