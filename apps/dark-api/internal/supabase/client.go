package supabase

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	url            string
	serviceRoleKey string
	http           *http.Client
}

func New(url, serviceRoleKey string) *Client {
	return &Client{
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
func (c *Client) GetUser(ctx context.Context, userToken string) (*User, error) {
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
func (c *Client) InsertEvent(ctx context.Context, event ProgressEvent) error {
	body, err := json.Marshal(event)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.url+"/rest/v1/progress_events", bytes.NewReader(body))
	if err != nil {
		return err
	}
	c.setServiceHeaders(req)
	req.Header.Set("Prefer", "resolution=ignore-duplicates,return=minimal")

	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("supabase insert failed: %s", resp.Status)
	}
	return nil
}

type LeaderboardEntry struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	XP       int    `json:"xp"`
	Level    int    `json:"level"`
	Rank     string `json:"rank"`
}

// GetLeaderboard returns the top users ordered by XP descending.
func (c *Client) GetLeaderboard(ctx context.Context, limit int) ([]LeaderboardEntry, error) {
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

func (c *Client) setServiceHeaders(req *http.Request) {
	req.Header.Set("Authorization", "Bearer "+c.serviceRoleKey)
	req.Header.Set("apikey", c.serviceRoleKey)
	req.Header.Set("Content-Type", "application/json")
}
