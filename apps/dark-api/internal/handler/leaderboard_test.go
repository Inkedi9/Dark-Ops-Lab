package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

func TestLeaderboard_List(t *testing.T) {
	t.Run("returns entries with 1-based positions", func(t *testing.T) {
		mc := &mockClient{
			getLeaderboardFn: func(_ context.Context, limit int) ([]supabase.LeaderboardEntry, error) {
				if limit != 50 {
					t.Errorf("want limit=50, got %d", limit)
				}
				return []supabase.LeaderboardEntry{
					{ID: "u1", Username: "alice", XP: 9000, Level: 91, Rank: "GHOST"},
					{ID: "u2", Username: "bob", XP: 4000, Level: 41, Rank: "OPERATOR"},
				}, nil
			},
		}

		r, w := req(http.MethodGet, "", "", false)
		NewLeaderboard(mc).List(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}

		var entries []leaderboardEntry
		if err := json.NewDecoder(w.Body).Decode(&entries); err != nil {
			t.Fatalf("decode response: %v", err)
		}
		if len(entries) != 2 {
			t.Fatalf("want 2 entries, got %d", len(entries))
		}

		// Positions are 1-based.
		if entries[0].Position != 1 {
			t.Errorf("first entry position: want 1, got %d", entries[0].Position)
		}
		if entries[1].Position != 2 {
			t.Errorf("second entry position: want 2, got %d", entries[1].Position)
		}

		// Fields are passed through unchanged.
		if entries[0].Username != "alice" {
			t.Errorf("want username %q, got %q", "alice", entries[0].Username)
		}
		if entries[0].XP != 9000 {
			t.Errorf("want xp=9000, got %d", entries[0].XP)
		}
		if entries[0].Rank != "GHOST" {
			t.Errorf("want rank %q, got %q", "GHOST", entries[0].Rank)
		}
	})

	t.Run("empty leaderboard returns empty JSON array", func(t *testing.T) {
		mc := &mockClient{
			getLeaderboardFn: func(_ context.Context, _ int) ([]supabase.LeaderboardEntry, error) {
				return []supabase.LeaderboardEntry{}, nil
			},
		}

		r, w := req(http.MethodGet, "", "", false)
		NewLeaderboard(mc).List(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}

		var entries []leaderboardEntry
		if err := json.NewDecoder(w.Body).Decode(&entries); err != nil {
			t.Fatalf("decode response: %v", err)
		}
		if len(entries) != 0 {
			t.Errorf("want empty slice, got %d entries", len(entries))
		}
	})

	t.Run("GetLeaderboard failure returns 500", func(t *testing.T) {
		mc := &mockClient{
			getLeaderboardFn: func(_ context.Context, _ int) ([]supabase.LeaderboardEntry, error) {
				return nil, errors.New("query failed")
			},
		}

		r, w := req(http.MethodGet, "", "", false)
		NewLeaderboard(mc).List(w, r)

		if w.Code != http.StatusInternalServerError {
			t.Fatalf("want 500, got %d", w.Code)
		}
	})
}
