package handler

import (
	"net/http"

	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

type Leaderboard struct {
	sb supabase.Client
}

func NewLeaderboard(sb supabase.Client) *Leaderboard {
	return &Leaderboard{sb: sb}
}

type leaderboardEntry struct {
	Position int    `json:"position"`
	ID       string `json:"id"`
	Username string `json:"username"`
	XP       int    `json:"xp"`
	Level    int    `json:"level"`
	Rank     string `json:"rank"`
}

// List returns the top 50 users by XP. Public endpoint — no auth required.
func (h *Leaderboard) List(w http.ResponseWriter, r *http.Request) {
	entries, err := h.sb.GetLeaderboard(r.Context(), 50)
	if err != nil {
		jsonError(w, "failed to fetch leaderboard", http.StatusInternalServerError)
		return
	}

	result := make([]leaderboardEntry, len(entries))
	for i, e := range entries {
		result[i] = leaderboardEntry{
			Position: i + 1,
			ID:       e.ID,
			Username: e.Username,
			XP:       e.XP,
			Level:    e.Level,
			Rank:     e.Rank,
		}
	}

	jsonResponse(w, result, http.StatusOK)
}
