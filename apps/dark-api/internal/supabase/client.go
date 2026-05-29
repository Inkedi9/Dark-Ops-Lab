package supabase

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// Client is the interface that handlers and middleware depend on.
// The concrete HTTP implementation is unexported; callers receive this
// interface from New() and can substitute a mock in tests.
type Client interface {
	GetUser(ctx context.Context, token string) (*User, error)
	InsertEvent(ctx context.Context, event ProgressEvent) (bool, error)
	AddXP(ctx context.Context, userID string, amount int) (*XPResult, error)
	GetLeaderboard(ctx context.Context, limit int) ([]LeaderboardEntry, error)
}

type client struct {
	url            string
	serviceRoleKey string
	http           *http.Client
}

// New constructs the real Supabase HTTP client and returns it as Client.
func New(url, serviceRoleKey string) Client {
	return &client{
		url:            url,
		serviceRoleKey: serviceRoleKey,
		http:           &http.Client{Timeout: 10 * time.Second},
	}
}

type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

// GetUser validates a user JWT by calling Supabase /auth/v1/user.
// The apikey header uses the service role key; the user's own JWT goes in Authorization.
func (c *client) GetUser(ctx context.Context, userToken string) (*User, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.url+"/auth/v1/user", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+userToken)
	req.Header.Set("apikey", c.serviceRoleKey)

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("invalid or expired token")
	}

	var user User
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, err
	}
	if user.ID == "" {
		return nil, fmt.Errorf("user id missing in response")
	}
	return &user, nil
}

type ProgressEvent struct {
	ID             string         `json:"id"`
	UserID         string         `json:"user_id"`
	IdempotencyKey string         `json:"idempotency_key"`
	Namespace      string         `json:"namespace"`
	Source         string         `json:"source"`
	Type           string         `json:"type"`
	EntityID       string         `json:"entity_id"`
	Payload        map[string]any `json:"payload"`
	SchemaVersion  int            `json:"schema_version"`
}

// InsertEvent writes a progress event to Supabase using the service role key.
// Duplicate idempotency keys (same user_id + idempotency_key) are silently ignored.
// Returns true if a new row was inserted, false if the event was a duplicate.
func (c *client) InsertEvent(ctx context.Context, event ProgressEvent) (bool, error) {
	body, err := json.Marshal(event)
	if err != nil {
		return false, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.url+"/rest/v1/progress_events", bytes.NewReader(body))
	if err != nil {
		return false, err
	}
	c.setServiceHeaders(req)
	// return=representation lets us detect new insert (non-empty array) vs. duplicate (empty array).
	req.Header.Set("Prefer", "resolution=ignore-duplicates,return=representation")

	resp, err := c.http.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return false, fmt.Errorf("supabase insert failed: %s", resp.Status)
	}

	// PostgREST returns [] for ON CONFLICT DO NOTHING (duplicate), [{...}] for a new insert.
	var result []json.RawMessage
	_ = json.NewDecoder(resp.Body).Decode(&result)
	return len(result) > 0, nil
}

// XPResult holds the updated profile values returned by the add_xp RPC.
type XPResult struct {
	XP    int    `json:"xp"`
	Level int    `json:"level"`
	Rank  string `json:"rank"`
}

// AddXP calls the add_xp Postgres function which atomically increments profiles.xp
// and recomputes level/rank in a single serialised UPDATE.
// Returns an error (and nil result) if the user's profile does not exist yet.
func (c *client) AddXP(ctx context.Context, userID string, amount int) (*XPResult, error) {
	body, err := json.Marshal(map[string]any{
		"p_user_id": userID,
		"p_amount":  amount,
	})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.url+"/rest/v1/rpc/add_xp", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	c.setServiceHeaders(req)

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("add_xp rpc failed: %s", resp.Status)
	}

	// add_xp returns SETOF — PostgREST wraps it in a JSON array.
	var results []XPResult
	if err := json.NewDecoder(resp.Body).Decode(&results); err != nil {
		return nil, err
	}
	if len(results) == 0 {
		return nil, fmt.Errorf("add_xp: profile for user %s not found", userID)
	}
	return &results[0], nil
}

type LeaderboardEntry struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	XP       int    `json:"xp"`
	Level    int    `json:"level"`
	Rank     string `json:"rank"`
}

// GetLeaderboard returns the top users ordered by XP descending.
func (c *client) GetLeaderboard(ctx context.Context, limit int) ([]LeaderboardEntry, error) {
	url := fmt.Sprintf(
		"%s/rest/v1/profiles?select=id,username,xp,level,rank&order=xp.desc&limit=%d",
		c.url, limit,
	)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	c.setServiceHeaders(req)

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("supabase query failed: %s", resp.Status)
	}

	var entries []LeaderboardEntry
	if err := json.NewDecoder(resp.Body).Decode(&entries); err != nil {
		return nil, err
	}
	return entries, nil
}

func (c *client) setServiceHeaders(req *http.Request) {
	req.Header.Set("Authorization", "Bearer "+c.serviceRoleKey)
	req.Header.Set("apikey", c.serviceRoleKey)
	req.Header.Set("Content-Type", "application/json")
}
