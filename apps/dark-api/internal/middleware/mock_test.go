package middleware

import (
	"context"

	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

// Compile-time check.
var _ supabase.Client = (*mockSB)(nil)

// mockSB is a minimal supabase.Client test double.
// Only GetUser is ever called by the middleware under test; the rest are stubs.
type mockSB struct {
	getUserFn func(context.Context, string) (*supabase.User, error)
}

func (m *mockSB) GetUser(ctx context.Context, token string) (*supabase.User, error) {
	if m.getUserFn != nil {
		return m.getUserFn(ctx, token)
	}
	return nil, nil
}

func (m *mockSB) InsertEvent(context.Context, supabase.ProgressEvent) (bool, error) {
	return false, nil
}

func (m *mockSB) AddXP(context.Context, string, int) (*supabase.XPResult, error) {
	return nil, nil
}

func (m *mockSB) GetLeaderboard(context.Context, int) ([]supabase.LeaderboardEntry, error) {
	return nil, nil
}
