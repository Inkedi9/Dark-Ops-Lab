package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"

	"github.com/dark-ops-lab/dark-api/internal/middleware"
	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

type WarzoneConfig struct {
	Flag               string   `json:"flag"`
	RequiredObjectives []string `json:"objectives"`
	XP                 int      `json:"xp"`
	Title              string   `json:"title"`
	Badge              string   `json:"badge"`
	Namespace          string   `json:"namespace"`
}

type Warzones struct {
	sb      *supabase.Client
	configs map[string]WarzoneConfig
}

func NewWarzones(sb *supabase.Client, configPath string) (*Warzones, error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("read warzones config %q: %w", configPath, err)
	}

	var configs map[string]WarzoneConfig
	if err := json.Unmarshal(data, &configs); err != nil {
		return nil, fmt.Errorf("parse warzones config: %w", err)
	}

	return &Warzones{sb: sb, configs: configs}, nil
}

type warzoneCompleteRequest struct {
	FlagParts           []string `json:"flagParts"`
	ObjectivesCompleted []string `json:"objectivesCompleted"`
	BestTimeSeconds     int      `json:"bestTimeSeconds"`
	ActionsCount        int      `json:"actionsCount"`
}

type warzoneCompleteResponse struct {
	Valid   bool   `json:"valid"`
	XP      int    `json:"xp,omitempty"`
	Message string `json:"message"`
}

// Complete validates warzone completion proof (reconstructed flag + required objectives)
// and records the event in Supabase. Idempotent — duplicate submissions are silently ignored.
func (h *Warzones) Complete(w http.ResponseWriter, r *http.Request) {
	warzoneID := chi.URLParam(r, "id")
	user := middleware.UserFromContext(r.Context())

	cfg, ok := h.configs[warzoneID]
	if !ok {
		jsonError(w, "warzone not found", http.StatusNotFound)
		return
	}

	var req warzoneCompleteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if strings.Join(req.FlagParts, "") != cfg.Flag {
		jsonResponse(w, warzoneCompleteResponse{Valid: false, Message: "invalid proof of state"}, http.StatusOK)
		return
	}

	completedSet := make(map[string]struct{}, len(req.ObjectivesCompleted))
	for _, obj := range req.ObjectivesCompleted {
		completedSet[obj] = struct{}{}
	}
	for _, required := range cfg.RequiredObjectives {
		if _, found := completedSet[required]; !found {
			jsonResponse(w, warzoneCompleteResponse{Valid: false, Message: "incomplete objectives"}, http.StatusOK)
			return
		}
	}

	ns := cfg.Namespace
	if ns == "" {
		ns = "challenges"
	}

	event := supabase.ProgressEvent{
		ID:             newUUID(),
		UserID:         user.ID,
		IdempotencyKey: fmt.Sprintf("dark-api:warzone_completed:%s:%s", ns, warzoneID),
		Namespace:      ns,
		Source:         "dark-api:warzone",
		Type:           "warzone_completed",
		EntityID:       warzoneID,
		Payload: map[string]any{
			"xp":              cfg.XP,
			"title":           cfg.Title,
			"badge":           cfg.Badge,
			"actionsCount":    req.ActionsCount,
			"bestTimeSeconds": req.BestTimeSeconds,
		},
		SchemaVersion: 1,
	}

	if err := h.sb.InsertEvent(r.Context(), event); err != nil {
		jsonError(w, "failed to record completion", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, warzoneCompleteResponse{
		Valid:   true,
		XP:      cfg.XP,
		Message: fmt.Sprintf("Warzone complete! +%d XP", cfg.XP),
	}, http.StatusOK)
}
