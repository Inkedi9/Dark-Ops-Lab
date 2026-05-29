package handler

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"

	"github.com/dark-ops-lab/dark-api/internal/middleware"
	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

// ChallengeConfig holds server-side flag data — never exposed to the client.
type ChallengeConfig struct {
	Flag      string `json:"flag"`
	XP        int    `json:"xp"`
	Title     string `json:"title"`
	Namespace string `json:"namespace"` // defaults to "challenges" if empty
}

type Challenges struct {
	sb      supabase.Client
	configs map[string]ChallengeConfig
}

func NewChallenges(sb supabase.Client, configPath string) (*Challenges, error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("read challenges config %q: %w", configPath, err)
	}

	var configs map[string]ChallengeConfig
	if err := json.Unmarshal(data, &configs); err != nil {
		return nil, fmt.Errorf("parse challenges config: %w", err)
	}

	return &Challenges{sb: sb, configs: configs}, nil
}

type submitRequest struct {
	Flag string `json:"flag"`
}

type submitResponse struct {
	Correct bool   `json:"correct"`
	XP      int    `json:"xp,omitempty"`
	Message string `json:"message"`
}

// Submit validates a challenge flag server-side and records the completion in Supabase.
// The flag is never sent back in the response — only correct/incorrect + XP.
func (h *Challenges) Submit(w http.ResponseWriter, r *http.Request) {
	challengeID := chi.URLParam(r, "id")
	user := middleware.UserFromContext(r.Context())

	cfg, ok := h.configs[challengeID]
	if !ok {
		jsonError(w, "challenge not found", http.StatusNotFound)
		return
	}

	var req submitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Flag) != cfg.Flag {
		jsonResponse(w, submitResponse{Correct: false, Message: "incorrect flag, try again"}, http.StatusOK)
		return
	}

	ns := cfg.Namespace
	if ns == "" {
		ns = "challenges"
	}

	event := supabase.ProgressEvent{
		ID:             newUUID(),
		UserID:         user.ID,
		IdempotencyKey: fmt.Sprintf("dark-api:challenge_completed:%s:%s", ns, challengeID),
		Namespace:      ns,
		Source:         "dark-api:challenge",
		Type:           "challenge_completed",
		EntityID:       challengeID,
		Payload: map[string]any{
			"xp":    cfg.XP,
			"title": cfg.Title,
		},
		SchemaVersion: 1,
	}

	isNew, err := h.sb.InsertEvent(r.Context(), event)
	if err != nil {
		jsonError(w, "failed to record completion", http.StatusInternalServerError)
		return
	}

	// Only award XP for a genuine new completion, not a duplicate submission.
	if isNew {
		if _, err := h.sb.AddXP(r.Context(), user.ID, cfg.XP); err != nil {
			slog.Warn("add_xp failed after challenge completion", "user", user.ID, "xp", cfg.XP, "err", err)
		}
	}

	jsonResponse(w, submitResponse{
		Correct: true,
		XP:      cfg.XP,
		Message: fmt.Sprintf("Flag correct! +%d XP", cfg.XP),
	}, http.StatusOK)
}

func newUUID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}
