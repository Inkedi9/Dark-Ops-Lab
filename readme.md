# 🧠 Dark Ops Lab

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
![Status](https://img.shields.io/badge/status-active%20development-blueviolet)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20TypeScript%20%7C%20Supabase-black)
![Architecture](https://img.shields.io/badge/architecture-monorepo%20%7C%20single--app-0f172a)
![Cyber OS](https://img.shields.io/badge/concept-Cyber%20Operating%20System-7c3aed)

> Learn. Practice. Attack. Defend.

Dark Ops Lab is a modern cybersecurity training platform that connects learning, offensive practice, and defensive simulation into one immersive environment — deployed as a single Next.js application on a unified domain.

---

## ⚡ What is Dark Ops Lab?

Dark Ops Lab is a consolidated cyber operating system where users move fluidly between four specialized sections, sharing a single progression, profile, and localStorage state.

```
Understand → Exploit → Defend
```

Users do not simply read about vulnerabilities. They:

- learn them through guided, interactive lessons
- exploit them inside sandboxed offensive labs
- analyze them through SOC-inspired workflows
- defend against them in realistic simulations

---

## 🧩 Sections

| Section | URL prefix | Role |
|---------|-----------|------|
| 📚 Learn | `/learn` | Guided vulnerability education (ex DarkSplaining) |
| 🎯 Challenges | `/challenges` | Offensive labs, CTF, Warzone (ex DarkChallenges) |
| 🛡️ Defend | `/defend` | Phishing simulator & SOC workflows (ex DarkDefend) |
| 🧠 Nexus | `/` | Hub, profile, telemetry, leaderboard |

---

## 🏗️ Architecture

### Single-app monorepo

The ecosystem was consolidated from 4 separate apps into one Next.js App Router application. All sections share the same origin — meaning localStorage, progression, and authentication are natively unified.

```
Dark Ops Lab/
├── apps/
│   └── dark-nexus/          ← Single Next.js application
└── packages/
    ├── ui/                  ← Shared component library (@dark/ui)
    ├── storage/             ← localStorage abstraction (@dark/storage)
    ├── progress/            ← Cross-section progress tracking (@dark/progress)
    ├── profile/             ← User profile (@dark/profile)
    ├── types/               ← Shared TypeScript types (@dark/types)
    ├── supabase-client/     ← Shared Supabase client
    └── routes/              ← Centralized route definitions
```

### URL structure

```
darknexus.vercel.app/                        ← Hub home
darknexus.vercel.app/profile                 ← Unified profile (XP, badges, all sections)
darknexus.vercel.app/leaderboard
darknexus.vercel.app/telemetry

darknexus.vercel.app/learn                   ← Learning platform
darknexus.vercel.app/learn/lessons/[id]
darknexus.vercel.app/learn/tracks/[id]
darknexus.vercel.app/learn/resources/glossary
darknexus.vercel.app/learn/certificates/[trackId]
darknexus.vercel.app/learn/analytics

darknexus.vercel.app/challenges              ← Offensive labs
darknexus.vercel.app/challenges/[slug]
darknexus.vercel.app/challenges/ctf/[slug]
darknexus.vercel.app/challenges/warzone/[slug]
darknexus.vercel.app/challenges/missions

darknexus.vercel.app/defend                  ← Defensive simulation
darknexus.vercel.app/defend/simulator
darknexus.vercel.app/defend/soc
darknexus.vercel.app/defend/soc/alerts
darknexus.vercel.app/defend/soc/intel
darknexus.vercel.app/defend/soc/playbooks
darknexus.vercel.app/defend/security-check
darknexus.vercel.app/defend/defense-profile
```

Full source structure → [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🧠 Why "Cyber Operating System"?

Most cybersecurity platforms isolate learning, labs, simulations, telemetry, and progression into separate silos. Dark Ops Lab connects them through:

- a **persistent operator identity** (profile, XP, badges unified across sections)
- **connected workflows** (learn a concept → exploit it → analyze it in SOC)
- **shared localStorage** (same origin = no cross-domain sync complexity)
- **ecosystem-wide telemetry** (single progression model)
- **modular cyber specializations** under one cohesive environment

---

## 🎨 Design System

Shared UI from `@dark/ui`:

- `PanelCard` — dark panel with accent variants
- `AppButton`, `AppBadge` — consistent interactive elements
- `SectionHeader`, `EmptyState` — layout primitives
- `ProgressBar`, `StatCard` — data display

The ecosystem uses a unified dark blue/slate visual language with section-specific accents (blue for learn, red/amber for challenges, emerald for defend/SOC).

---

## 🧪 Engines

### Challenge Engine (`src/engine/`)

Used inside `/challenges`:

- exploit simulation & answer validation
- dynamic scoring
- mission progression
- CTF and Warzone modes

### Progress Model

Normalized progress events shared across sections:

```json
{
  "namespace": "learn",
  "type": "lesson_completed",
  "entityId": "sql-injection-01",
  "idempotencyKey": "learn:lesson_completed:sql-injection-01"
}
```

Namespaces: `learn` · `challenges` · `defend` · `nexus`

---

## ☁️ Supabase Integration

- GitHub OAuth
- Profile persistence
- Progress snapshots
- Sync queue

localStorage is the primary source of truth. Cloud sync is additive and optional.

---

## 🚧 In Progress

- stronger section differentiation
- telemetry dashboards
- attack maps
- guided pathways
- advanced Warzone scenarios
- multi-step CTFs
- defensive analytics
- global achievements
- organization / team support
- AI-assisted feedback (long-term)

---

## 🛣️ Roadmap

- cloud saves & multi-device continuity
- advanced telemetry dashboards
- AI-assisted analysis
- attack graph visualization
- adaptive learning paths
- organization / team features

---

## 🧠 Philosophy

Learn by doing. Not by reading.

Core principles:

- active exploration over passive content
- simulation-first learning
- realistic offensive & defensive workflows
- modular architecture, single coherent product
- local-first engineering

---

## 👤 Author

Built with focus on UX, realism, modular architecture, product thinking, and immersive cyber training.
