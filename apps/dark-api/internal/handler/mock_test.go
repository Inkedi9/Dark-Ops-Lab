package handler

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"

	"github.com/go-chi/chi/v5"

	"github.com/dark-ops-lab/dark-api/internal/middleware"
	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

// Compile-time check: mockClient must satisfy supabase.Client.
var _ supabase.Client = (*mockClient)(nil)

// mockClient is a test double for supabase.Client.
// Set the Fn fields to override default behaviour; inspect the Calls fields
// after the handler runs to verify what was sent to Supabase.
type mockClient struct {
	insertEventFn    func(context.Context, supabase.ProgressEvent) (bool, error)
	addXPFn          func(context.Context, string, int) (*supabase.XPResult, error)
	getLeaderboardFn func(context.Context, int) ([]supabase.LeaderboardEntry, error)

	insertEventCalls []supabase.ProgressEvent
	addXPCallCount   int
}

func (m *mockClient) GetUser(_ context.Context, _ string) (*supabase.User, error) {
	return nil, nil
}

func (m *mockClient) InsertEvent(ctx context.Context, event supabase.ProgressEvent) (bool, error) {
	m.insertEventCalls = append(m.insertEventCalls, event)
	if m.insertEventFn != nil {
		return m.insertEventFn(ctx, event)
	}
	return true, nil // default: genuine new insert
}

func (m *mockClient) AddXP(ctx context.Context, userID string, amount int) (*supabase.XPResult, error) {
	m.addXPCallCount++
	if m.addXPFn != nil {
		return m.addXPFn(ctx, userID, amount)
	}
	return &supabase.XPResult{XP: amount, Level: 1, Rank: "ROOKIE"}, nil
}

func (m *mockClient) GetLeaderboard(ctx context.Context, limit int) ([]supabase.LeaderboardEntry, error) {
	if m.getLeaderboardFn != nil {
		return m.getLeaderboardFn(ctx, limit)
	}
	return nil, nil
}

// testUser is injected into request contexts that need an authenticated user.
var testUser = &supabase.User{ID: "user-abc", Email: "test@example.com"}

// req builds a chi-wired *http.Request and a fresh ResponseRecorder.
//   - body: JSON string, or "" for no body
//   - chiID: value of the {id} URL parameter
//   - withUser: whether to inject testUser into the context
func req(method, body, chiID string, withUser bool) (*http.Request, *httptest.ResponseRecorder) {
	var r io.Reader
	if body != "" {
		r = strings.NewReader(body)
	}

	hr := httptest.NewRequest(method, "/", r)
	if body != "" {
		hr.Header.Set("Content-Type", "application/json")
	}

	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", chiID)
	ctx := context.WithValue(hr.Context(), chi.RouteCtxKey, rctx)

	if withUser {
		ctx = middleware.ContextWithUser(ctx, testUser)
	}

	return hr.WithContext(ctx), httptest.NewRecorder()
}
