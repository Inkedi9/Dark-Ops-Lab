# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the monorepo root unless otherwise noted.

```bash
npm install               # Install all workspace dependencies

npm run dev               # Run both Next.js (nexus) and Go API concurrently
npm run dev:nexus         # Next.js only
npm run dev:api           # Go API only

npm run build             # Build apps/dark-nexus for production

npm --workspace=apps/dark-nexus run lint  # ESLint on the Next.js app
```

Go backend (from `apps/dark-api`):

```bash
go run ./cmd/server       # Start the API server (default port 8080)
```

There are no automated tests. TypeScript type-checking runs via `next build` or can be triggered separately:

```bash
npx --prefix apps/dark-nexus tsc --noEmit
```

## Environment Setup

**Frontend** — `apps/dark-nexus/.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (required for auth)
- `NEXT_PUBLIC_DARK_API_URL` (optional — enables server-side CTF flag validation)

**Backend** — `apps/dark-api/.env`:

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (required)
- `PORT` (default: 8080), `ALLOWED_ORIGIN`, `CHALLENGES_CONFIG` (default: `challenges.json`)
- `challenges.json` — gitignored, server-side flag definitions; copy from `challenges.example.json`

## Architecture

### Monorepo structure

```
Dark Ops Lab/
├── apps/
│   ├── dark-nexus/          ← Next.js 16.2 App Router — the entire frontend
│   └── dark-api/            ← Go 1.23 (chi v5) — server-side flag validation & leaderboard
└── packages/
    ├── ui/                  ← @dark/ui — shared React component library, plus de packages/routes/ ni packages/public/
    ├── storage/             ← @dark/storage — typed localStorage abstraction
    ├── progress/            ← @dark/progress — cross-section event system & sync queue
    ├── profile/             ← @dark/profile — user profile adapter (local + Supabase)
    ├── types/               ← @dark/types — shared TypeScript types (ProgressEvent, DarkProfile…)
    └── supabase-client/     ← @dark/supabase-client — single shared Supabase client
```

The three `*.old` directories under `apps/` are archived originals; do not modify them.

All packages are consumed via npm workspaces and transpiled by Next.js (`transpilePackages` in `next.config.ts`) — they are not pre-built. Dev uses `next dev --webpack` (not Turbopack).

### Next.js app — `apps/dark-nexus/src/`

**Critical**: This is Next.js 16 with breaking API changes from earlier versions. Before writing Next.js-specific code, consult `apps/dark-nexus/node_modules/next/dist/docs/`.

**Section convention**: every section has two parallel directories:

- `src/app/<section>/` — Next.js route pages
- `src/<section>/` — components, data, hooks, utils for that section

Sections: `(nexus)` (hub, `/`), `learn` (`/learn`), `challenges` (`/challenges`), `defend` (`/defend`).

Shared cross-section code lives in `src/components/`, `src/engine/`, `src/store/`, `src/lib/`, and `src/hooks/`.

**Path aliases** (defined in `tsconfig.json`):

- `@/*` → `src/*`
- `@dark/ui/*`, `@dark/storage`, `@dark/progress`, `@dark/profile/*`, `@dark/types`, `@dark/supabase-client`

### Go backend — `apps/dark-api/`

Minimal HTTP service using chi v5. Three endpoints:

- `GET /health` — healthcheck
- `GET /v1/leaderboard` — top 50 by XP (public)
- `POST /v1/challenges/{id}/submit` — flag validation (requires Supabase JWT; rate-limited to 10/min per user)

The frontend operates fully without this service — unauthenticated users fall back to client-side validation. Flags in `challenges.json` are never exposed to the browser.

### State & progression model

localStorage is the primary source of truth. Supabase sync is additive (pull-on-login, push-on-event).

Progression is event-sourced. Every user action appends an idempotent `ProgressEvent`:

```typescript
{
  idempotencyKey: "challenges:ctf_completed:ctf-internal-breach",  // deduplication key
  namespace: "learn" | "challenges" | "defend" | "nexus",
  type: "ctf_completed",
  entityId: "ctf-internal-breach",
  payload: { xp: 2500, kind: "ctf" }
}
```

After writing to localStorage, call `notifyProgressChanged()` from `src/store/events.ts` to dispatch the `darkchallenges:local-progress` event so UI components re-render.

Store files in `src/store/`: `progress-store.ts` (standard challenges), `ctf-progress-store.ts`, `warzone-progress-store.ts`, `global-progress.ts` (total XP / level / rank).

### Supabase integration

- GitHub OAuth via `useSupabaseSession` hook (`src/hooks/useSupabaseSession.ts`)
- The hook exposes `configured` (Supabase env vars present), `loading`, `session`, `user`, `profile`, `signOut`
- All Supabase access gates on `hasSupabaseConfig()` from `@dark/supabase-client`; the app works without credentials configured
- Bootstrap sync (pull from Supabase on first login) runs once per user via `useSupabaseBootstrapSync`

Supabase tables: `profiles`, `progress_events` (unique on `user_id + idempotency_key`), `app_progress_snapshots` (unique on `user_id + namespace`).
