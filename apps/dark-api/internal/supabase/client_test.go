package supabase

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

const (
	testServiceKey = "test-service-role-key"
	testUserToken  = "user-jwt-abc"
)

// stub is a fake HTTP server that captures the last inbound request and
// returns a fixed status + JSON body.
type stub struct {
	srv    *httptest.Server
	status int
	body   string

	// Captured from the last call — inspect in assertions.
	method  string
	path    string
	query   string
	headers http.Header
	reqBody []byte
}

func newStub(t *testing.T, status int, body string) (*stub, *client) {
	t.Helper()
	s := &stub{status: status, body: body}
	s.srv = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		s.method = r.Method
		s.path = r.URL.Path
		s.query = r.URL.RawQuery
		s.headers = r.Header.Clone()
		s.reqBody, _ = io.ReadAll(r.Body)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(s.status)
		_, _ = io.WriteString(w, s.body)
	}))
	t.Cleanup(s.srv.Close)
	return s, &client{
		url:            s.srv.URL,
		serviceRoleKey: testServiceKey,
		http:           &http.Client{Timeout: 5 * time.Second},
	}
}

// assertServiceHeaders verifies that setServiceHeaders was applied.
func assertServiceHeaders(t *testing.T, h http.Header) {
	t.Helper()
	if got := h.Get("Authorization"); got != "Bearer "+testServiceKey {
		t.Errorf("Authorization: want %q, got %q", "Bearer "+testServiceKey, got)
	}
	if got := h.Get("apikey"); got != testServiceKey {
		t.Errorf("apikey: want %q, got %q", testServiceKey, got)
	}
	if got := h.Get("Content-Type"); got != "application/json" {
		t.Errorf("Content-Type: want \"application/json\", got %q", got)
	}
}

// ---- GetUser ---------------------------------------------------------------

func TestClient_GetUser(t *testing.T) {
	t.Run("returns User on 200 with valid JSON", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `{"id":"u1","email":"alice@example.com"}`)
		user, err := c.GetUser(context.Background(), testUserToken)

		if err != nil {
			t.Fatalf("want no error, got %v", err)
		}
		if user.ID != "u1" {
			t.Errorf("ID: want %q, got %q", "u1", user.ID)
		}
		if user.Email != "alice@example.com" {
			t.Errorf("Email: want %q, got %q", "alice@example.com", user.Email)
		}
		_ = s
	})

	t.Run("sends user token in Authorization header (not the service key)", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `{"id":"u1","email":"a@b.com"}`)
		_, _ = c.GetUser(context.Background(), testUserToken)

		want := "Bearer " + testUserToken
		if got := s.headers.Get("Authorization"); got != want {
			t.Errorf("Authorization: want %q, got %q", want, got)
		}
	})

	t.Run("sends service role key as apikey header", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `{"id":"u1","email":"a@b.com"}`)
		_, _ = c.GetUser(context.Background(), testUserToken)

		if got := s.headers.Get("apikey"); got != testServiceKey {
			t.Errorf("apikey: want %q, got %q", testServiceKey, got)
		}
	})

	t.Run("calls GET /auth/v1/user", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `{"id":"u1","email":"a@b.com"}`)
		_, _ = c.GetUser(context.Background(), testUserToken)

		if s.method != http.MethodGet {
			t.Errorf("method: want GET, got %s", s.method)
		}
		if s.path != "/auth/v1/user" {
			t.Errorf("path: want /auth/v1/user, got %s", s.path)
		}
	})

	t.Run("non-200 status returns error", func(t *testing.T) {
		for _, status := range []int{http.StatusUnauthorized, http.StatusForbidden, http.StatusInternalServerError} {
			_, c := newStub(t, status, `{}`)
			_, err := c.GetUser(context.Background(), testUserToken)
			if err == nil {
				t.Errorf("status %d: want error, got nil", status)
			}
		}
	})

	t.Run("returns error when ID field is empty", func(t *testing.T) {
		_, c := newStub(t, http.StatusOK, `{"id":"","email":"a@b.com"}`)
		_, err := c.GetUser(context.Background(), testUserToken)
		if err == nil {
			t.Fatal("want error for empty ID, got nil")
		}
	})

	t.Run("returns error on invalid JSON body", func(t *testing.T) {
		_, c := newStub(t, http.StatusOK, `not-json`)
		_, err := c.GetUser(context.Background(), testUserToken)
		if err == nil {
			t.Fatal("want error for invalid JSON, got nil")
		}
	})

	t.Run("returns error when server is unreachable", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `{"id":"u1"}`)
		s.srv.Close() // shut down before the call
		_, err := c.GetUser(context.Background(), testUserToken)
		if err == nil {
			t.Fatal("want error for unreachable server, got nil")
		}
	})
}

// ---- InsertEvent -----------------------------------------------------------

func TestClient_InsertEvent(t *testing.T) {
	sampleEvent := ProgressEvent{
		ID:             "ev-001",
		UserID:         "user-abc",
		IdempotencyKey: "dark-api:challenge_completed:challenges:ctf-xss-001",
		Namespace:      "challenges",
		Source:         "dark-api:challenge",
		Type:           "challenge_completed",
		EntityID:       "ctf-xss-001",
		Payload:        map[string]any{"xp": 200, "title": "XSS Test"},
		SchemaVersion:  1,
	}

	t.Run("non-empty response array means new insert → isNew=true", func(t *testing.T) {
		_, c := newStub(t, http.StatusCreated, `[{"id":"ev-001"}]`)
		isNew, err := c.InsertEvent(context.Background(), sampleEvent)

		if err != nil {
			t.Fatalf("want no error, got %v", err)
		}
		if !isNew {
			t.Error("want isNew=true for non-empty response")
		}
	})

	t.Run("empty response array means duplicate → isNew=false", func(t *testing.T) {
		_, c := newStub(t, http.StatusOK, `[]`)
		isNew, err := c.InsertEvent(context.Background(), sampleEvent)

		if err != nil {
			t.Fatalf("want no error, got %v", err)
		}
		if isNew {
			t.Error("want isNew=false for empty response (duplicate)")
		}
	})

	t.Run("status >= 400 returns error", func(t *testing.T) {
		for _, status := range []int{http.StatusBadRequest, http.StatusConflict, http.StatusInternalServerError} {
			_, c := newStub(t, status, `{"message":"error"}`)
			_, err := c.InsertEvent(context.Background(), sampleEvent)
			if err == nil {
				t.Errorf("status %d: want error, got nil", status)
			}
		}
	})

	t.Run("calls POST /rest/v1/progress_events", func(t *testing.T) {
		s, c := newStub(t, http.StatusCreated, `[{}]`)
		_, _ = c.InsertEvent(context.Background(), sampleEvent)

		if s.method != http.MethodPost {
			t.Errorf("method: want POST, got %s", s.method)
		}
		if s.path != "/rest/v1/progress_events" {
			t.Errorf("path: want /rest/v1/progress_events, got %s", s.path)
		}
	})

	t.Run("sends Prefer header for duplicate resolution and representation", func(t *testing.T) {
		s, c := newStub(t, http.StatusCreated, `[{}]`)
		_, _ = c.InsertEvent(context.Background(), sampleEvent)

		const wantPrefer = "resolution=ignore-duplicates,return=representation"
		if got := s.headers.Get("Prefer"); got != wantPrefer {
			t.Errorf("Prefer: want %q, got %q", wantPrefer, got)
		}
	})

	t.Run("sends service headers", func(t *testing.T) {
		s, c := newStub(t, http.StatusCreated, `[{}]`)
		_, _ = c.InsertEvent(context.Background(), sampleEvent)
		assertServiceHeaders(t, s.headers)
	})

	t.Run("request body is a JSON-serialised ProgressEvent", func(t *testing.T) {
		s, c := newStub(t, http.StatusCreated, `[{}]`)
		_, _ = c.InsertEvent(context.Background(), sampleEvent)

		var sent ProgressEvent
		if err := json.Unmarshal(s.reqBody, &sent); err != nil {
			t.Fatalf("decode request body: %v", err)
		}
		if sent.IdempotencyKey != sampleEvent.IdempotencyKey {
			t.Errorf("idempotency_key: want %q, got %q", sampleEvent.IdempotencyKey, sent.IdempotencyKey)
		}
		if sent.UserID != sampleEvent.UserID {
			t.Errorf("user_id: want %q, got %q", sampleEvent.UserID, sent.UserID)
		}
		if sent.Type != sampleEvent.Type {
			t.Errorf("type: want %q, got %q", sampleEvent.Type, sent.Type)
		}
	})
}

// ---- AddXP -----------------------------------------------------------------

func TestClient_AddXP(t *testing.T) {
	t.Run("returns XPResult from first array element", func(t *testing.T) {
		_, c := newStub(t, http.StatusOK, `[{"xp":7700,"level":78,"rank":"GHOST"}]`)
		result, err := c.AddXP(context.Background(), "user-abc", 200)

		if err != nil {
			t.Fatalf("want no error, got %v", err)
		}
		if result.XP != 7700 {
			t.Errorf("XP: want 7700, got %d", result.XP)
		}
		if result.Level != 78 {
			t.Errorf("Level: want 78, got %d", result.Level)
		}
		if result.Rank != "GHOST" {
			t.Errorf("Rank: want %q, got %q", "GHOST", result.Rank)
		}
	})

	t.Run("empty array returns error (profile not found)", func(t *testing.T) {
		_, c := newStub(t, http.StatusOK, `[]`)
		_, err := c.AddXP(context.Background(), "unknown-user", 100)
		if err == nil {
			t.Fatal("want error for empty array, got nil")
		}
		if !strings.Contains(err.Error(), "not found") {
			t.Errorf("error should mention 'not found', got: %v", err)
		}
	})

	t.Run("status >= 400 returns error", func(t *testing.T) {
		for _, status := range []int{http.StatusBadRequest, http.StatusInternalServerError} {
			_, c := newStub(t, status, `{"message":"error"}`)
			_, err := c.AddXP(context.Background(), "user-abc", 100)
			if err == nil {
				t.Errorf("status %d: want error, got nil", status)
			}
		}
	})

	t.Run("returns error on invalid JSON", func(t *testing.T) {
		_, c := newStub(t, http.StatusOK, `not-json`)
		_, err := c.AddXP(context.Background(), "user-abc", 100)
		if err == nil {
			t.Fatal("want error for invalid JSON, got nil")
		}
	})

	t.Run("calls POST /rest/v1/rpc/add_xp", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `[{"xp":100,"level":2,"rank":"ROOKIE"}]`)
		_, _ = c.AddXP(context.Background(), "user-abc", 100)

		if s.method != http.MethodPost {
			t.Errorf("method: want POST, got %s", s.method)
		}
		if s.path != "/rest/v1/rpc/add_xp" {
			t.Errorf("path: want /rest/v1/rpc/add_xp, got %s", s.path)
		}
	})

	t.Run("request body contains p_user_id and p_amount", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `[{"xp":300,"level":4,"rank":"ROOKIE"}]`)
		_, _ = c.AddXP(context.Background(), "user-xyz", 300)

		var body map[string]any
		if err := json.Unmarshal(s.reqBody, &body); err != nil {
			t.Fatalf("decode request body: %v", err)
		}
		if got, _ := body["p_user_id"].(string); got != "user-xyz" {
			t.Errorf("p_user_id: want %q, got %q", "user-xyz", got)
		}
		// JSON numbers unmarshal as float64.
		if got, _ := body["p_amount"].(float64); int(got) != 300 {
			t.Errorf("p_amount: want 300, got %v", body["p_amount"])
		}
	})

	t.Run("sends service headers", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `[{"xp":100,"level":2,"rank":"ROOKIE"}]`)
		_, _ = c.AddXP(context.Background(), "user-abc", 100)
		assertServiceHeaders(t, s.headers)
	})
}

// ---- GetLeaderboard --------------------------------------------------------

func TestClient_GetLeaderboard(t *testing.T) {
	sampleEntries := `[
		{"id":"u1","username":"alice","xp":9000,"level":91,"rank":"GHOST"},
		{"id":"u2","username":"bob",  "xp":4000,"level":41,"rank":"OPERATOR"}
	]`

	t.Run("returns entries on 200", func(t *testing.T) {
		_, c := newStub(t, http.StatusOK, sampleEntries)
		entries, err := c.GetLeaderboard(context.Background(), 50)

		if err != nil {
			t.Fatalf("want no error, got %v", err)
		}
		if len(entries) != 2 {
			t.Fatalf("want 2 entries, got %d", len(entries))
		}
		if entries[0].Username != "alice" {
			t.Errorf("first entry username: want %q, got %q", "alice", entries[0].Username)
		}
		if entries[0].XP != 9000 {
			t.Errorf("first entry XP: want 9000, got %d", entries[0].XP)
		}
	})

	t.Run("empty JSON array returns empty slice without error", func(t *testing.T) {
		_, c := newStub(t, http.StatusOK, `[]`)
		entries, err := c.GetLeaderboard(context.Background(), 50)

		if err != nil {
			t.Fatalf("want no error, got %v", err)
		}
		if len(entries) != 0 {
			t.Errorf("want empty slice, got %d entries", len(entries))
		}
	})

	t.Run("status >= 400 returns error", func(t *testing.T) {
		for _, status := range []int{http.StatusUnauthorized, http.StatusInternalServerError} {
			_, c := newStub(t, status, `{"message":"error"}`)
			_, err := c.GetLeaderboard(context.Background(), 50)
			if err == nil {
				t.Errorf("status %d: want error, got nil", status)
			}
		}
	})

	t.Run("returns error on invalid JSON", func(t *testing.T) {
		_, c := newStub(t, http.StatusOK, `not-json`)
		_, err := c.GetLeaderboard(context.Background(), 50)
		if err == nil {
			t.Fatal("want error for invalid JSON, got nil")
		}
	})

	t.Run("calls GET /rest/v1/profiles", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `[]`)
		_, _ = c.GetLeaderboard(context.Background(), 50)

		if s.method != http.MethodGet {
			t.Errorf("method: want GET, got %s", s.method)
		}
		if s.path != "/rest/v1/profiles" {
			t.Errorf("path: want /rest/v1/profiles, got %s", s.path)
		}
	})

	t.Run("URL includes select fields, order, and limit", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `[]`)
		_, _ = c.GetLeaderboard(context.Background(), 25)

		for _, want := range []string{"select=id,username,xp,level,rank", "order=xp.desc", "limit=25"} {
			if !strings.Contains(s.query, want) {
				t.Errorf("query %q: want substring %q", s.query, want)
			}
		}
	})

	t.Run("sends service headers", func(t *testing.T) {
		s, c := newStub(t, http.StatusOK, `[]`)
		_, _ = c.GetLeaderboard(context.Background(), 50)
		assertServiceHeaders(t, s.headers)
	})
}
