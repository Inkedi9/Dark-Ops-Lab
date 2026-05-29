# Dark Sync Flow

This document explains the current local-first sync architecture for the Dark monorepo and provides a manual QA checklist for telemetry export, Nexus import, and Supabase persistence.

## 1. Architecture

All sections (Learn, Challenges, Defend, Nexus) run on the same origin inside a single Next.js app. localStorage is shared. The sync model has two paths:

**Client path (local-first)**

```text
User action (lesson, challenge, phishing…)
        |
        v
localStorage write (progress-store / warzone-progress-store / global-progress…)
        |
        v
notifyProgressChanged() → React components re-render
        |
        v
appendProgressEvent() → @dark/progress queue
        |
        v
Bootstrap sync on login (pull + push) → Supabase
```

**Server path (dark-api — authenticated only)**

```text
User submits CTF flag or Warzone completion
        |
        v
POST /v1/challenges/{id}/submit  or  POST /v1/warzone/{id}/complete
        |
        v
dark-api validates (flags/objectives in server config, never sent to browser)
        |
        v
InsertEvent → progress_events (idempotent, ON CONFLICT DO NOTHING)
        |        returns isNew=true for genuine completions
        v
AddXP → add_xp() Postgres RPC
           UPDATE profiles SET xp = xp + amount  (atomic, row-locked)
           recomputes level and rank
```

## 2. Why This Model

- Single origin: all sections share the same localStorage — no export bridge needed between sections.
- Local-first: every action writes locally first. The app remains fully functional offline and without Supabase.
- Authoritative backend: flags and warzone objectives live only on the server. The browser never sees them.
- Atomic XP: concurrent completions on the server use `xp = xp + amount` (never read-modify-write from the client), eliminating race conditions.
- Additive sync: Supabase is append-only for events. A sync failure never rolls back local state.

## 3. Progress Event Model

Progress events are small, append-only records. They should be stable enough to re-import safely.

- `namespace`: official progress bucket, such as `defend`.
- `source`: app that produced the event, such as `dark-defend`.
- `type`: event name, such as `phishing_analyzed`.
- `entityId`: stable identifier for the lesson, challenge, incident, or scenario.
- `idempotencyKey`: stable unique key used to prevent duplicates.
- `payload`: event-specific details, scores, XP, metadata, and labels.
- `schemaVersion`: event schema version for future migrations.

Example:

```json
{
  "namespace": "defend",
  "source": "dark-defend",
  "type": "phishing_analyzed",
  "entityId": "oauth-consent-01",
  "idempotencyKey": "defend:phishing_analyzed:oauth-consent-01",
  "payload": {
    "scenarioId": "oauth-consent-01",
    "verdict": "suspicious"
  },
  "schemaVersion": 1
}
```

## 4. Official Namespaces

- `splaining`
- `defend`
- `challenges`
- `nexus`

## 5. Main Event Types

Splaining:

- `lesson_started`
- `lesson_completed`
- `quiz_completed`
- `exercise_completed`
- `command_module_completed`
- `concept_viewed`
- `xp_awarded`

Defend:

- `phishing_analyzed`
- `incident_generated`
- `security_check_completed`
- `soc_escalation`
- `xp_awarded`

Challenges:

- `challenge_completed`
- `ctf_completed`
- `warzone_completed`
- `xp_awarded`

Nexus:

- `profile_created`
- `sync_completed`
- `migration_completed`

## 6. Import Bridge

The import bridge (`/telemetry/import`) is still available for importing external progress payloads (e.g., from a previous installation, another device, or a data export). Within the app, all sections write to the same localStorage — no bridge is needed between sections.

Payload encoding (for external imports):

1. Serialize JSON.
2. Encode JSON as UTF-8 bytes.
3. Convert bytes to a binary string.
4. Encode with `btoa`.
5. Navigate to `telemetry/import#payload=...`

Nexus reads the hash payload, decodes it, and calls `importProgressDump()`.

Import behavior:

- Merges incoming progress by namespace.
- Merges events by `idempotencyKey`.
- Does not replace unrelated namespaces.

## 7. Supabase Sync

Nexus is responsible for cloud sync.

Current flow:

- User signs in through GitHub OAuth.
- Bootstrap sync runs once per user on login: pulls remote profile, events, and snapshots; merges into localStorage; pushes pending local state.
- Progress events live in `progress_events` and are synced via the bootstrap push queue.

**dark-api XP path (server-authoritative):**
- When a CTF flag or Warzone completion is validated by dark-api, the server calls `InsertEvent` then `add_xp()`.
- `InsertEvent` uses `ON CONFLICT DO NOTHING` — safe to retry.
- `InsertEvent` returns `isNew=true` only for genuine first inserts. `add_xp()` is only called then, preventing double XP on retry.
- `add_xp()` does `UPDATE profiles SET xp = xp + amount` — atomic, race-free.

Main Supabase tables:

- `profiles` — `xp`, `level`, `rank`, `badges`
- `progress_events` — append-only event log (`unique(user_id, idempotency_key)`)
- `app_progress_snapshots` — namespace snapshots (pulled and merged at bootstrap)

Supabase functions:

- `add_xp(p_user_id uuid, p_amount int)` — atomic XP increment + level/rank recomputation. `SECURITY DEFINER`, `service_role` only. See `supabase/migrations/20260529_add_xp_function.sql`.

Important behavior:

- Row Level Security protects per-user data.
- Bootstrap sync runs once per user per session (keyed by `dark:supabase:bootstrap:<userId>`); use `{ force: true }` to re-run.
- `ALLOWED_ORIGIN` is required on dark-api — the server refuses to start without it.

## 8. Manual QA Checklist

### A. Splaining

- [ ] Complete a lesson, quiz, exercise, or command module.
- [ ] Click the Database export button.
- [ ] Confirm Nexus opens `/telemetry/import`.
- [ ] Confirm the Splaining telemetry card shows events greater than `0`.
- [ ] Open Data & Sync.
- [ ] Push sync queue.
- [ ] Verify Supabase `progress_events` rows.

### B. Defend

- [ ] Analyze a phishing scenario.
- [ ] Generate an incident or complete a security check.
- [ ] Click the Database export button.
- [ ] Confirm Nexus opens `/telemetry/import`.
- [ ] Confirm the Defend telemetry card shows events greater than `0`.
- [ ] Open Data & Sync.
- [ ] Push sync queue.
- [ ] Verify Supabase `progress_events` rows.

### C. Challenges

- [ ] Complete a standalone challenge, CTF, or Warzone.
- [ ] Confirm the Challenges telemetry card shows events greater than `0`.
- [ ] Open Data & Sync.
- [ ] Push sync queue.
- [ ] Verify Supabase `progress_events` rows.

**With dark-api configured (`NEXT_PUBLIC_DARK_API_URL` set, user authenticated):**

- [ ] Submit a valid CTF flag → confirm `progress_events` row inserted, `profiles.xp` incremented.
- [ ] Submit the same flag again → confirm `profiles.xp` is NOT incremented a second time (idempotency).
- [ ] Complete a Warzone → confirm `POST /v1/warzone/{id}/complete` returns `valid: true`, `profiles.xp` incremented.

### D. Idempotency

- [ ] Export the same app twice.
- [ ] Confirm event count does not duplicate in Nexus telemetry.
- [ ] Push sync queue.
- [ ] Confirm Supabase does not duplicate rows because of `unique(user_id, idempotency_key)`.

### E. Auth

- [ ] Sign in with GitHub in Nexus.
- [ ] Confirm avatar/display name appears.
- [ ] Sign out.
- [ ] Confirm local data remains available.

### F. Bootstrap

- [ ] Login again.
- [ ] Confirm bootstrap sync runs.
- [ ] Confirm telemetry remains available.

## 9. Troubleshooting

`0 events but data keys exist`

The app wrote legacy `localStorage` state but did not write progress events, or the export bridge was not run yet.

`permission denied for profiles`

Check Supabase grants and RLS policies for the `profiles` table.

`Multiple GoTrueClient`

Check Supabase browser client singleton creation. The app should not create duplicate auth clients for the same storage key.

`Import payload too large`

The hash payload has grown too large. Future fix: move import to a POST endpoint or use compressed payloads.

`Events not visible after app action`

This is expected if the action happened in another origin. Origin isolation means the Nexus import bridge must be run.

`Duplicates`

Check the generated `idempotencyKey`. It must be stable for the same logical event and distinct for different logical events.

## 10. Future Improvements

- POST-based import endpoint instead of hash payload.
- Compressed payloads.
- Automatic silent sync for authenticated same-domain deployments.
- Organization/team telemetry.
- Admin dashboard.
- Event schema migration v2.

## Known hydration pitfalls

### 1. Telemetry export links must be client-built

Do not render telemetry import URLs during SSR.

Bad pattern:

```tsx
<a href={buildNexusTelemetryImportUrl(payload)}>
  Export telemetry
</a>

<a
  href="#"
  onClick={(event) => {
    event.preventDefault();

    const url = buildNexusTelemetryImportUrl(payload);
    window.open(url, "_blank", "noopener,noreferrer");
  }}
>
  Export telemetry
</a>
```

The rendered href must be identical on server and client. Build the real URL only inside the click handler.

### 2. localStorage-derived status must wait for client mount

Next.js pages must not render localStorage-derived state during hydration.

Bad pattern:

`const [completed] = useState(() => readProgressFromLocalStorage(slug));`

This can render different text server/client:

Server: Live CTF
Client: Captured

Use a server-safe default, then hydrate after mount:

```tsx
const [mounted, setMounted] = useState(false);
const [completed, setCompleted] = useState(false);

useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    setCompleted(readProgressFromLocalStorage(slug));
    setMounted(true);
  }, 0);

  return () => window.clearTimeout(timeoutId);
}, [slug]);

const displayCompleted = mounted && completed;
const badgeLabel = displayCompleted ? "Captured" : "Live CTF";
```

If the React Compiler lint rule rejects synchronous setState in effects, schedule the hydration with window.setTimeout(..., 0).

### 3. Do not mix CTF / Warzone / Challenge completion events

Challenge telemetry must not overcount unrelated mission types.

Use separate event types:

challenge_completed
ctf_completed
warzone_completed

Recommended aggregation:

```tsx
const challengesCompleted = events.filter(
  (event) =>
    event.namespace === "challenges" && event.type === "challenge_completed",
).length;

const ctfCompleted = events.filter(
  (event) => event.namespace === "challenges" && event.type === "ctf_completed",
).length;

const warzoneCompleted = events.filter(
  (event) =>
    event.namespace === "challenges" && event.type === "warzone_completed",
).length;
```

Legacy migrations must only create completed events when the old state clearly indicates completion:

```tsx
function isLegacyCompleted(value: any) {
  return (
    value?.completed === true ||
    value?.solved === true ||
    value?.status === "completed" ||
    value?.status === "done" ||
    value?.status === "captured"
  );
}
```

Do not migrate unlocked, available, started or open missions as completed.

### 4. localStorage origin isolation (historical)

Before the monorepo consolidation, the four apps ran on separate origins (`dark-splaining.vercel.app`, `dark-defend.vercel.app`, `dark-challenges.vercel.app`, `dark-nexus.vercel.app`). localStorage is isolated by origin, so each app had its own storage silo and required a manual export bridge to share progress with Nexus.

**This no longer applies.** All sections now run on the same origin inside a single Next.js app. localStorage is unified — no bridge is needed between sections.

The import bridge (`/telemetry/import`) remains available for importing data from external sources (old devices, data exports, migration from the legacy multi-app setup).

### 5. Duplicate exports must be idempotent

Exporting the same app twice must not duplicate telemetry.

Every event must have a stable idempotencyKey:

`{namespace}:{type}:{entityId}`

Examples:

```text
splaining:lesson_completed:sql-injection
defend:phishing_analyzed:oauth-consent-01
challenges:challenge_completed:sqli-001
challenges:ctf_completed:ctf-internal-breach
challenges:warzone_completed:warzone-production-breach
```

Nexus import must merge events by idempotencyKey, not replace whole namespaces.

Supabase also enforces uniqueness with:

```sql
unique(user_id, idempotency_key)
```
