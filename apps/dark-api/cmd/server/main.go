package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"

	"github.com/dark-ops-lab/dark-api/internal/handler"
	"github.com/dark-ops-lab/dark-api/internal/middleware"
	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

// shutdownTimeout is the maximum time allowed to drain in-flight requests.
// Must exceed the Supabase HTTP client timeout (10 s) times the number of
// sequential RPC calls a single handler can make (InsertEvent + AddXP = 2).
const shutdownTimeout = 30 * time.Second

func main() {
	_ = godotenv.Load()

	supabaseURL := mustEnv("SUPABASE_URL")
	serviceRoleKey := mustEnv("SUPABASE_SERVICE_ROLE_KEY")

	challengesPath := os.Getenv("CHALLENGES_CONFIG")
	if challengesPath == "" {
		challengesPath = "challenges.json"
	}

	warzonesPath := os.Getenv("WARZONES_CONFIG")
	if warzonesPath == "" {
		warzonesPath = "warzones.json"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	sb := supabase.New(supabaseURL, serviceRoleKey)

	challenges, err := handler.NewChallenges(sb, challengesPath)
	if err != nil {
		slog.Error("failed to load challenges config", "err", err)
		os.Exit(1)
	}

	warzones, err := handler.NewWarzones(sb, warzonesPath)
	if err != nil {
		slog.Error("failed to load warzones config", "err", err)
		os.Exit(1)
	}

	leaderboard := handler.NewLeaderboard(sb)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.CORS(mustEnv("ALLOWED_ORIGIN")))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})

	r.Route("/v1", func(r chi.Router) {
		// Public
		r.Get("/leaderboard", leaderboard.List)

		// Authenticated — 10 flag submissions per minute per user
		r.Group(func(r chi.Router) {
			r.Use(middleware.Auth(sb))
			r.Use(middleware.RateLimit(10, time.Minute))
			r.Post("/challenges/{id}/submit", challenges.Submit)
			r.Post("/warzone/{id}/complete", warzones.Complete)
		})
	})

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	// Start serving in a background goroutine so the main goroutine can
	// block on the signal channel.
	go func() {
		slog.Info("dark-api started", "port", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("server error", "err", err)
			os.Exit(1)
		}
	}()

	// Block until SIGINT or SIGTERM arrives.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	<-ctx.Done()

	slog.Info("shutdown signal received, draining in-flight requests", "timeout", shutdownTimeout)

	// Restore default signal handling so a second signal force-kills immediately.
	stop()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Warn("graceful shutdown timed out, some requests may have been dropped", "err", err)
		os.Exit(1)
	}

	slog.Info("dark-api stopped cleanly")
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		slog.Error("required env var not set", "key", key)
		os.Exit(1)
	}
	return v
}
