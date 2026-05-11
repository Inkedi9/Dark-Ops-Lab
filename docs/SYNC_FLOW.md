# Dark Sync Flow

This document explains the current local-first sync architecture for the Dark monorepo and provides a manual QA checklist for telemetry export, Nexus import, and Supabase persistence.

## 1. Architecture

```text
DarkSplaining / DarkDefend / DarkChallenges
        |
        v
Local progress events
        |
        v
Export bridge button
        |
        v
Nexus /telemetry/import
        |
        v
Idempotent merge
        |
        v
Nexus /telemetry
        |
        v
Data & Sync
        |
        v
Supabase
```

DarkSplaining, DarkDefend, and DarkChallenges each write progress events in their own browser origin. Nexus acts as the hub for auth, telemetry import, diagnostics, and cloud sync.

## 2. Why This Model

- `localStorage` is isolated by origin, so one app cannot directly read another app's local progress.
- Each app remains autonomous, offline-capable, and local-first.
- Nexus orchestrates authentication, telemetry, and cloud persistence.
- The individual apps do not need direct Supabase auth/session logic.
- Auth and session handling stay centralized, avoiding duplicated client state across apps.

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

Each app builds a compact JSON payload containing its local progress namespace, and includes profile data when useful. The payload is encoded using the same compatibility method:

1. Serialize JSON.
2. Encode JSON as UTF-8 bytes.
3. Convert bytes to a binary string.
4. Encode with `btoa`.
5. Navigate to:

```text
/telemetry/import#payload=...
```

Nexus reads the hash payload, decodes it, and calls `importProgressDump()`.

Import behavior:

- Merges incoming progress by namespace.
- Merges events by `idempotencyKey`.
- Does not replace unrelated namespaces.
- Does not delete source app local data.
- Keeps the source apps as local-first sources of truth for now.
- Preserves the existing DarkSplaining import behavior.

## 7. Supabase Sync

Nexus is responsible for cloud sync.

Current flow:

- User signs in through Nexus GitHub auth.
- Nexus stores or updates the user profile.
- Nexus can push local progress to Supabase from Data & Sync.
- Bootstrap sync can run after login to reconcile local and remote state.

Main Supabase tables:

- `profiles`
- `progress_events`
- `app_progress_snapshots`

Important behavior:

- Row Level Security protects per-user data.
- The sync queue pushes pending events.
- `progress_events` should enforce uniqueness with `unique(user_id, idempotency_key)`.
- Bootstrap sync runs on login to pull, merge, and push pending local state.
- Local-first remains the temporary source of truth until the architecture moves to fully automatic cloud sync.

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

- [ ] Complete a challenge, CTF, or Warzone.
- [ ] Click the Database export button.
- [ ] Confirm Nexus opens `/telemetry/import`.
- [ ] Confirm the Challenges telemetry card shows events greater than `0`.
- [ ] Open Data & Sync.
- [ ] Push sync queue.
- [ ] Verify Supabase `progress_events` rows.

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

### 4. localStorage is isolated by origin

Progress created on:

```text
dark-splaining.vercel.app
dark-defend.vercel.app
dark-challes.vercel.app
```

connot automatically appaer inside:

dark-nexus.vercel.app

Each app must explicity export its local progress to Nexus throught the telemetry bridge:

```text
App localStorage
→ Database export button
→ /telemetry/import#payload=...
→ Nexus import/merge
→ Nexus telemetry
→ Supabase sync
```

If Nexus shows 0 events but the source app has local data, the bridge was not run or the source app did not create normalized progress events.

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
