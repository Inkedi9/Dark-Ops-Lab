package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/dark-ops-lab/dark-api/internal/supabase"
)

func newWarzones(t *testing.T, mc *mockClient) *Warzones {
	t.Helper()
	h, err := NewWarzones(mc, "testdata/warzones.json")
	if err != nil {
		t.Fatalf("NewWarzones: %v", err)
	}
	return h
}

// validWarzoneBody is a well-formed completion payload for warzone-production-breach.
const validWarzoneBody = `{
	"flagParts":           ["flag{prod","_access","_root","_exfil}"],
	"objectivesCompleted": ["recon","initial-access","privilege-escalation","exfiltration"],
	"bestTimeSeconds":     342,
	"actionsCount":        23
}`

func TestWarzones_Complete(t *testing.T) {
	t.Run("unknown warzone returns 404", func(t *testing.T) {
		mc := &mockClient{}
		r, w := req(http.MethodPost, validWarzoneBody, "does-not-exist", true)
		newWarzones(t, mc).Complete(w, r)

		if w.Code != http.StatusNotFound {
			t.Fatalf("want 404, got %d", w.Code)
		}
		if len(mc.insertEventCalls) != 0 {
			t.Error("InsertEvent must not be called for unknown warzones")
		}
	})

	t.Run("malformed JSON body returns 400", func(t *testing.T) {
		mc := &mockClient{}
		r, w := req(http.MethodPost, `not-json`, "warzone-production-breach", true)
		newWarzones(t, mc).Complete(w, r)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("want 400, got %d", w.Code)
		}
	})

	t.Run("wrong flag parts return valid=false without touching Supabase", func(t *testing.T) {
		mc := &mockClient{}
		body := `{"flagParts":["wrong","parts"],"objectivesCompleted":["recon","initial-access","privilege-escalation","exfiltration"]}`
		r, w := req(http.MethodPost, body, "warzone-production-breach", true)
		newWarzones(t, mc).Complete(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		var resp warzoneCompleteResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if resp.Valid {
			t.Error("want valid=false for wrong flag")
		}
		if len(mc.insertEventCalls) != 0 {
			t.Error("InsertEvent must not be called for wrong flag")
		}
	})

	t.Run("correct flag but missing objective returns valid=false", func(t *testing.T) {
		mc := &mockClient{}
		body := `{"flagParts":["flag{prod","_access","_root","_exfil}"],"objectivesCompleted":["recon","initial-access"]}`
		r, w := req(http.MethodPost, body, "warzone-production-breach", true)
		newWarzones(t, mc).Complete(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		var resp warzoneCompleteResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if resp.Valid {
			t.Error("want valid=false when objectives are incomplete")
		}
		if len(mc.insertEventCalls) != 0 {
			t.Error("InsertEvent must not be called when objectives are incomplete")
		}
	})

	t.Run("valid proof: records event, awards XP, returns valid=true", func(t *testing.T) {
		mc := &mockClient{}
		r, w := req(http.MethodPost, validWarzoneBody, "warzone-production-breach", true)
		newWarzones(t, mc).Complete(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}

		var resp warzoneCompleteResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if !resp.Valid {
			t.Error("want valid=true")
		}
		if resp.XP != 7500 {
			t.Errorf("want xp=7500, got %d", resp.XP)
		}

		if len(mc.insertEventCalls) != 1 {
			t.Fatalf("want 1 InsertEvent call, got %d", len(mc.insertEventCalls))
		}
		ev := mc.insertEventCalls[0]
		wantKey := "dark-api:warzone_completed:challenges:warzone-production-breach"
		if ev.IdempotencyKey != wantKey {
			t.Errorf("idempotency key: want %q, got %q", wantKey, ev.IdempotencyKey)
		}
		if ev.UserID != testUser.ID {
			t.Errorf("event user_id: want %q, got %q", testUser.ID, ev.UserID)
		}
		if ev.Type != "warzone_completed" {
			t.Errorf("event type: want %q, got %q", "warzone_completed", ev.Type)
		}

		if mc.addXPCallCount != 1 {
			t.Errorf("want AddXP called once, got %d", mc.addXPCallCount)
		}
	})

	t.Run("superset of required objectives is accepted", func(t *testing.T) {
		mc := &mockClient{}
		body := `{"flagParts":["flag{prod","_access","_root","_exfil}"],"objectivesCompleted":["recon","initial-access","privilege-escalation","exfiltration","bonus-objective"]}`
		r, w := req(http.MethodPost, body, "warzone-production-breach", true)
		newWarzones(t, mc).Complete(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		var resp warzoneCompleteResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if !resp.Valid {
			t.Error("want valid=true when objectives include all required plus extra")
		}
	})

	t.Run("duplicate submission skips AddXP but returns valid=true", func(t *testing.T) {
		mc := &mockClient{
			insertEventFn: func(_ context.Context, _ supabase.ProgressEvent) (bool, error) {
				return false, nil // already recorded
			},
		}
		r, w := req(http.MethodPost, validWarzoneBody, "warzone-production-breach", true)
		newWarzones(t, mc).Complete(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		var resp warzoneCompleteResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if !resp.Valid {
			t.Error("want valid=true even for duplicate")
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
		r, w := req(http.MethodPost, validWarzoneBody, "warzone-production-breach", true)
		newWarzones(t, mc).Complete(w, r)

		if w.Code != http.StatusInternalServerError {
			t.Fatalf("want 500, got %d", w.Code)
		}
		if mc.addXPCallCount != 0 {
			t.Error("AddXP must not be called when InsertEvent fails")
		}
	})

	t.Run("AddXP failure is non-fatal: returns 200 valid=true", func(t *testing.T) {
		mc := &mockClient{
			addXPFn: func(_ context.Context, _ string, _ int) (*supabase.XPResult, error) {
				return nil, errors.New("rpc error")
			},
		}
		r, w := req(http.MethodPost, validWarzoneBody, "warzone-production-breach", true)
		newWarzones(t, mc).Complete(w, r)

		if w.Code != http.StatusOK {
			t.Fatalf("want 200, got %d", w.Code)
		}
		var resp warzoneCompleteResponse
		json.NewDecoder(w.Body).Decode(&resp)
		if !resp.Valid {
			t.Error("want valid=true even when AddXP fails")
		}
	})

	t.Run("empty namespace defaults to 'challenges'", func(t *testing.T) {
		mc := &mockClient{}
		body := `{"flagParts":["flag{simple}"],"objectivesCompleted":["obj-a"]}`
		r, w := req(http.MethodPost, body, "warzone-no-ns", true)
		newWarzones(t, mc).Complete(w, r)

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
		wantKey := "dark-api:warzone_completed:challenges:warzone-no-ns"
		if ev.IdempotencyKey != wantKey {
			t.Errorf("idempotency key: want %q, got %q", wantKey, ev.IdempotencyKey)
		}
	})
}
