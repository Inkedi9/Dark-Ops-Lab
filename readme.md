```
/** ------------------------------------------------------------------------
**
**  ______  ___  ______ _   __  ___________  _____   _       ___  ______
**  |  _  \/ _ \ | ___ \ | / / |  _  | ___ \/  ___| | |     / _ \ | ___ \
**  | | | / /_\ \| |_/ / |/ /  | | | | |_/ /\ `--.  | |    / /_\ \| |_/ /
**  | | | |  _  ||    /|    \  | | | |  __/  `--. \ | |    |  _  || ___ \
**  | |/ /| | | || |\ \| |\  \ \ \_/ / |    /\__/ / | |____| | | || |_/ /
**  |___/ \_| |_/\_| \_\_| \_/  \___/\_|    \____/  \_____/\_| |_/\____/
**
**  -- Version 1.0.0
** ------------------------------------------------------------------------
*/
```

# Dark Ops Lab

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
![Status](https://img.shields.io/badge/status-active%20development-blueviolet)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20TypeScript%20%7C%20Go-black)
![Backend](https://img.shields.io/badge/backend-Go%20%7C%20Supabase-00ADD8)
![Architecture](https://img.shields.io/badge/architecture-monorepo%20%7C%20single--app-0f172a)

> Learn. Practice. Attack. Defend.

Dark Ops Lab is a cybersecurity training platform that unifies learning, offensive practice, and defensive simulation into a single immersive environment — one application, one profile, one progression system.

---

## What is Dark Ops Lab?

Most security platforms isolate learning from practice. Dark Ops Lab connects them through a shared operator identity, a unified progression model, and a continuous feedback loop between offense and defense.

```
Understand → Exploit → Defend
```

Users learn vulnerabilities through guided lessons, exploit them in sandboxed offensive labs, then analyze and defend against them through SOC-inspired workflows — all from the same profile and session.

---

## Sections

| Section        | Route         | Description                                                               |
| -------------- | ------------- | ------------------------------------------------------------------------- |
| **Nexus**      | `/`           | Hub — profile, XP, leaderboard, telemetry                                 |
| **Learn**      | `/learn`      | Guided vulnerability education with interactive lessons and quizzes       |
| **Challenges** | `/challenges` | Offensive labs — standalone exploits, CTF chains, and Warzone scenarios   |
| **Defend**     | `/defend`     | Defensive training — phishing simulator, SOC dashboard, incident analysis |

---

## Architecture

### Monorepo — single application

Four originally separate apps (DarkSplaining, DarkChallenges, DarkDefend, DarkNexus) were consolidated into a single Next.js application. All sections share the same origin, which means localStorage, session, and authentication are natively unified — no cross-domain synchronization.

```
Dark Ops Lab/
├── apps/
│   ├── dark-nexus/          ← Next.js 16 App Router — main application
│   └── dark-api/            ← Go backend — server-side validation & leaderboard
└── packages/
    ├── ui/                  ← Shared component library    (@dark/ui)
    ├── storage/             ← localStorage abstraction    (@dark/storage)
    ├── progress/            ← Cross-section event system  (@dark/progress)
    ├── profile/             ← User profile adapter        (@dark/profile)
    ├── types/               ← Shared TypeScript types     (@dark/types)
    └── supabase-client/     ← Shared Supabase client      (@dark/supabase-client)
```

### URL structure

```
/                              Hub — home, profile, operator dashboard
/auth                          GitHub OAuth sign-in
/leaderboard                   Global leaderboard (live, from dark-api)
/telemetry                     Operator telemetry

/learn                         Learning platform
/learn/lessons/[id]
/learn/tracks/[id]
/learn/concepts/[id]
/learn/resources/glossary
/learn/certificates/[trackId]
/learn/analytics

/challenges                    Offensive labs
/challenges/[slug]             Standalone exploit challenge
/challenges/ctf/[slug]         Multi-step CTF chain
/challenges/warzone/[slug]     Warzone scenario

/defend                        Defensive simulation
/defend/simulator              Phishing simulator
/defend/soc                    SOC dashboard
/defend/soc/alerts
/defend/soc/intel
/defend/soc/playbooks
/defend/security-check
/defend/defense-profile
```

Full source structure → [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Tech Stack

### Frontend — `apps/dark-nexus`

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Framework | Next.js 16.2 (App Router)               |
| Language  | TypeScript 5 (strict)                   |
| UI        | React 19, Tailwind CSS 4, Framer Motion |
| Icons     | Lucide React                            |
| Charts    | Recharts                                |
| Auth & DB | Supabase (GitHub OAuth, PostgreSQL)     |
| Storage   | localStorage via `@dark/storage`        |

### Backend — `apps/dark-api`

| Layer    | Technology                            |
| -------- | ------------------------------------- |
| Language | Go 1.23                               |
| Router   | chi v5                                |
| Auth     | Supabase JWT validation               |
| Database | Supabase (via REST API, service role) |

The Go backend handles operations that require server-side authority: **challenge flag validation** (flags are never sent to the client) and the **global leaderboard**. The frontend remains fully functional without the backend — unauthenticated users fall back to local validation.

---

## Getting Started

### Prerequisites

- Node.js 20+
- Go 1.23+
- A Supabase project with GitHub OAuth configured

### Frontend

```bash
# Install dependencies
npm install

# Set up environment
cp apps/dark-nexus/.env.local.example apps/dark-nexus/.env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# Start dev server
npm run dev
```

### Backend (optional)

The application works without the backend. Start it to enable server-side flag validation and the live leaderboard.

```bash
cd apps/dark-api

# Configure environment
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

# Create your challenges config (server-side flags — never committed)
cp challenges.example.json challenges.json

# Run
go run ./cmd/server
```

---

## Progress & State Model

Progression is event-sourced. Every user action appends an idempotent progress event that is stored locally first, then synced to Supabase when the user is authenticated.

```json
{
  "namespace": "challenges",
  "type": "ctf_completed",
  "entityId": "ctf-internal-breach",
  "idempotencyKey": "challenges:ctf_completed:ctf-internal-breach",
  "payload": { "xp": 2500, "kind": "ctf" }
}
```

**Namespaces:** `learn` · `challenges` · `defend` · `nexus`

localStorage is the primary source of truth. Supabase sync is additive — data is never lost when offline.

---

## Supabase Integration

- GitHub OAuth (active)
- Profile persistence (`profiles` table)
- Progress events (`progress_events` table)
- App state snapshots (`app_progress_snapshots` table)
- Server-side challenge validation via `dark-api` (service role key)

---

## Roadmap

- [ ] Server-side validation for Warzone scenarios
- [ ] Telemetry dashboards
- [ ] Attack maps & graph visualization
- [ ] Adaptive learning paths
- [ ] Verifiable completion certificates
- [ ] Global achievements
- [ ] Organization / team support
- [ ] AI-assisted exploit feedback (long-term)

---

## Philosophy

Learn by doing. Not by reading.

- Active exploration over passive content
- Simulation-first, realistic workflows
- Offense and defense in the same environment
- Local-first engineering — works without a backend or internet connection
- Modular architecture, single coherent product

---

## License

Apache 2.0 — see [LICENSE](./LICENSE).
