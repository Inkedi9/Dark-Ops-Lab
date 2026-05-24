package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"

	"github.com/dark-ops-lab/dark-api/internal/handler"
	"github.com/dark-ops-lab/dark-api/internal/middleware"
	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

func main() {
	_ = godotenv.Load()

	supabaseURL := mustEnv("SUPABASE_URL")
	serviceRoleKey := mustEnv("SUPABASE_SERVICE_ROLE_KEY")

	challengesPath := os.Getenv("CHALLENGES_CONFIG")
	if challengesPath == "" {
		challengesPath = "challenges.json"
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

	leaderboard := handler.NewLeaderboard(sb)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.CORS(os.Getenv("ALLOWED_ORIGIN")))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})

	r.Route("/v1", func(r chi.Router) {
		// Public
		r.Get("/leaderboard", leaderboard.List)

		// Authenticated
		r.Group(func(r chi.Router) {
			r.Use(middleware.Auth(sb))
			r.Post("/challenges/{id}/submit", challenges.Submit)
		})
	})

	slog.Info("dark-api started", "port", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		slog.Error("server stopped", "err", err)
		os.Exit(1)
	}
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		slog.Error("required env var not set", "key", key)
		os.Exit(1)
	}
	return v
}
