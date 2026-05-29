package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

func newChallenges(t *testing.T, mc *mockClient) *Challenges {
	t.Helper()
	h, err := NewChallenges(mc, "testdata/challenges.json")
	if err != nil {
		t.Fatalf("NewChallenges: %v", err)
	}
	return h
}

func TestChallenges_Submit(t *testing.T) {
	t.Run("unknown challenge returns 404", func(t *testing.T) {
		mc := &mockClient{}
		r, w := req(http.MethodPost, `{"flag":"anything"}`, "does-not-exist", true)
		newChallenges(t, mc).Submit(w, r)

		if w.Code != http.StatusNotFound {
			t.Fatalf("want 404, got %d", w.Code)
		}
		if len(mc.insertEventCalls) != 0 {
			t.Error("InsertEvent must not be called for unknown challenges")
		}
	})

	t.Run("malformed JSON body returns 400", func(t *testing.T) {
		mc := &mockClient{}
		r, w := req(http.MethodPost, `not-json`, "ctf-xss-001", true)
		newChallenges(t, mc).Submit(w, r)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("want 400, got %d", w.Code)
		}
	})

	t.Run("wrong flag returns correct=false without touching Supabase", func(t *testing.T) {
		mc := &mockClient{}
		r, w := req(http.MethodPost, `{"flag":"DARK{wrong}"}`, "ctf-xss-001", true)
		newChallenges(t, mc).Submit(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		var resp submitResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if resp.Correct {
			t.Error("want correct=false")
		}
		if len(mc.insertEventCalls) != 0 {
			t.Error("InsertEvent must not be called for wrong flags")
		}
	})

	t.Run("flag with surrounding whitespace is trimmed and accepted", func(t *testing.T) {
		mc := &mockClient{}
		r, w := req(http.MethodPost, `{"flag":"  DARK{xss_stored}  "}`, "ctf-xss-001", true)
		newChallenges(t, mc).Submit(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		var resp submitResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if !resp.Correct {
			t.Error("want correct=true after trimming whitespace")
		}
	})

	t.Run("correct flag first submission: records event, awards XP, returns correct=true", func(t *testing.T) {
		mc := &mockClient{}
		r, w := req(http.MethodPost, `{"flag":"DARK{xss_stored}"}`, "ctf-xss-001", true)
		newChallenges(t, mc).Submit(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}

		var resp submitResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if !resp.Correct {
			t.Error("want correct=true")
		}
		if resp.XP != 200 {
			t.Errorf("want xp=200, got %d", resp.XP)
		}

		if len(mc.insertEventCalls) != 1 {
			t.Fatalf("want 1 InsertEvent call, got %d", len(mc.insertEventCalls))
		}
		ev := mc.insertEventCalls[0]
		wantKey := "dark-api:challenge_completed:challenges:ctf-xss-001"
		if ev.IdempotencyKey != wantKey {
			t.Errorf("idempotency key: want %q, got %q", wantKey, ev.IdempotencyKey)
		}
		if ev.UserID != testUser.ID {
			t.Errorf("event user_id: want %q, got %q", testUser.ID, ev.UserID)
		}
		if ev.Namespace != "challenges" {
			t.Errorf("event namespace: want %q, got %q", "challenges", ev.Namespace)
		}

		if mc.addXPCallCount != 1 {
			t.Errorf("want AddXP called once, got %d", mc.addXPCallCount)
		}
	})

	t.Run("duplicate submission skips AddXP but still returns correct=true", func(t *testing.T) {
		mc := &mockClient{
			insertEventFn: func(_ context.Context, _ supabase.ProgressEvent) (bool, error) {
				return false, nil // duplicate — already seen
			},
		}
		r, w := req(http.MethodPost, `{"flag":"DARK{xss_stored}"}`, "ctf-xss-001", true)
		newChallenges(t, mc).Submit(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		var resp submitResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if !resp.Correct {
			t.Error("want correct=true even for duplicate")
		}
		if mc.addXPCallCount != 0 {
			t.Errorf("AddXP must not be called for duplicate, got %d calls", mc.addXPCallCount)
		}
	})

	t.Run("InsertEvent failure returns 500", func(t *testing.T) {
		mc := &mockClient{
			insertEventFn: func(_ context.Context, _ supabase.ProgressEvent) (bool, error) {
				return false, errors.New("db unreachable")
			},
		}
		r, w := req(http.MethodPost, `{"flag":"DARK{xss_stored}"}`, "ctf-xss-001", true)
		newChallenges(t, mc).Submit(w, r)

		if w.Code != http.StatusInternalServerError {
			t.Fatalf("want 500, got %d", w.Code)
		}
		if mc.addXPCallCount != 0 {
			t.Error("AddXP must not be called when InsertEvent fails")
		}
	})

	t.Run("AddXP failure is non-fatal: returns 200 correct=true", func(t *testing.T) {
		mc := &mockClient{
			addXPFn: func(_ context.Context, _ string, _ int) (*supabase.XPResult, error) {
				return nil, errors.New("rpc error")
			},
		}
		r, w := req(http.MethodPost, `{"flag":"DARK{xss_stored}"}`, "ctf-xss-001", true)
		newChallenges(t, mc).Submit(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		var resp submitResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if !resp.Correct {
			t.Error("want correct=true even when AddXP fails")
		}
	})

	t.Run("empty namespace in config defaults to 'challenges'", func(t *testing.T) {
		mc := &mockClient{}
		r, w := req(http.MethodPost, `{"flag":"DARK{no_namespace}"}`, "ctf-no-ns", true)
		newChallenges(t, mc).Submit(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		if len(mc.insertEventCalls) != 1 {
			t.Fatalf("want 1 InsertEvent call, got %d", len(mc.insertEventCalls))
		}
		ev := mc.insertEventCalls[0]
		if ev.Namespace != "challenges" {
			t.Errorf("namespace: want %q, got %q", "challenges", ev.Namespace)
		}
		wantKey := "dark-api:challenge_completed:challenges:ctf-no-ns"
		if ev.IdempotencyKey != wantKey {
			t.Errorf("idempotency key: want %q, got %q", wantKey, ev.IdempotencyKey)
		}
	})
}
