# 🧠 Dark Ecosystem

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
![Status](https://img.shields.io/badge/status-active%20development-blueviolet)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20React%20%7C%20Supabase-black)
![Architecture](https://img.shields.io/badge/architecture-monorepo%20%7C%20local--first-0f172a)
![Cyber OS](https://img.shields.io/badge/concept-Cyber%20Operating%20System-7c3aed)

> Learn. Practice. Attack. Defend.

Dark Ecosystem is a modern cybersecurity training platform designed to bridge the gap between theory, offensive practice, and defensive thinking — through immersive and modular experiences.

Unlike traditional platforms focused only on lessons or isolated labs, Dark Ecosystem connects learning, exploitation, simulation, and telemetry into a unified ecosystem.

---

## ⚡ What is Dark Ecosystem?

Dark Ecosystem is a collection of specialized cyber applications connected through a shared progression and telemetry architecture.

The goal is simple:

```txt
Understand → Exploit → Defend
```

Users do not simply read about vulnerabilities.

They:

- learn them
- exploit them
- analyze them
- defend against them

inside guided and simulated environments.

---

## 🧩 Product Breakdown

| Module            | Role              | Description                              |
| ----------------- | ----------------- | ---------------------------------------- |
| 📚 DarkSplaining  | Learn             | Guided vulnerability education           |
| 🎯 DarkChallenges | Practice / Attack | Interactive offensive labs & simulations |
| 🛡️ DarkDefend     | Defend            | Phishing & defensive awareness simulator |
| 🧠 DarkNexus      | Hub               | Global telemetry, sync, orchestration    |

## 🧠 Why “Cyber Operating System”?

Most cybersecurity platforms isolate:

- learning
- labs
- defensive simulations
- telemetry
- progression

Dark Ecosystem connects them.

The objective is not to create separate cyber apps.

The objective is to create:

- a persistent operator identity
- connected workflows
- shared progression
- ecosystem-wide telemetry
- modular cyber specializations

inside one immersive operational environment.

### 🧠 DarkNexus — Cyber Operating System Layer

DarkNexus acts as the orchestration and telemetry layer of the ecosystem.

Responsibilities:

- global profile
- telemetry aggregation
- sync orchestration
- Supabase authentication
- cloud synchronization
- ecosystem navigation
- cross-app visibility

DarkNexus is intentionally separated from the training apps to preserve a local-first architecture.

### 📚 DarkSplaining — Learning Platform

DarkSplaining focuses on guided cybersecurity education.

Features:

- interactive lessons
- visual learning flows
- concept library
- command basics (Linux / PowerShell)
- glossary & security concepts
- guided progression

The objective is to help users understand vulnerabilities before exploiting them.

Examples:

- SQL Injection
- XSS
- Authentication flaws
- Session security
- MFA abuse
- Input validation
- OAuth flows

### 🎯 DarkChallenges — Offensive Labs

DarkChallenges is the offensive practice layer of the ecosystem.

It provides:

- exploit-oriented missions
- interactive sandbox simulations
- dynamic scoring
- offensive progression
- challenge telemetry

Modes:

- Missions
- CTF
- Warzone

The objective is to develop attacker thinking in controlled environments.

⚔️ Warzone Engine

Warzone introduces:

- evolving attack scenarios
- risk & detection systems
- dynamic progression
- simulated incident pressure

### 🛡️ DarkDefend — Defensive Simulation

DarkDefend focuses on defensive awareness and phishing analysis.

Features:

- phishing simulations
- SOC-inspired workflows
- signal analysis
- incident generation
- analyst scoring
- defensive profiling

The objective is to build real defensive reflexes instead of passive awareness training.

---

#### 🏗️ Architecture

- Frontend
- React
- Next.js
- Vite
- TypeScript migration in progress
- Multi-app monorepo architecture

#### 🎨 Shared Design System

Shared UI components:

- PanelCard
- AppButton
- AppBadge
- SectionHeader
- ProgressBar
- EmptyState
- Status indicators
- Shared telemetry UI

The ecosystem uses a unified dark blue/slate visual language while progressively differentiating each module.

#### 🧪 Engines

Challenge Engine

Used inside DarkChallenges:

- exploit simulation
- answer validation
- dynamic scoring
- mission progression
- Telemetry Engine

Used across all apps:

- normalized progress events
- idempotent sync model
- cross-app telemetry
- local-first event queue
- Supabase-ready synchronization

#### 🔄 Local-First Sync Architecture

Dark Ecosystem uses a local-first architecture.

Each application:

- stores its own progress locally
- works independently
- can function offline
- exports telemetry explicitly to Nexus

Flow:

App local progress

→ telemetry export bridge

→ DarkNexus import

→ telemetry merge

→ optional Supabase sync

Why?

Because browser localStorage is isolated per origin/domain.

This architecture preserves:

- modularity
- autonomy
- offline capability
- resilience
- explicit sync control

#### 🧠 Progress Event Model

The ecosystem uses normalized progress events.

Example:

```json
{
  "namespace": "defend",
  "type": "phishing_analyzed",
  "entityId": "oauth-consent-01",
  "idempotencyKey": "defend:phishing_analyzed:oauth-consent-01"
}
```

Namespaces:

- splaining
- defend
- challenges
- nexus

#### ☁️ Supabase Integration

Current backend layer:

- GitHub Auth
- Profile persistence
- Telemetry sync
- Progress snapshots
- Sync queue

Important:

localStorage remains the temporary source of truth

Cloud sync is additive, not mandatory.

#### 📦 Repository Structure

```text
/apps
darknexus
darksplaining
darkchallenges
darkdefend

/packages
ui
progress
profile
routes
storage
types
supabase-client
```

Sync architecture

Le flux de synchronisation local-first entre DarkSplaining, DarkDefend, DarkChallenges, Nexus et Supabase est documenté ici :
[docs/SYNC_FLOW.md](docs/SYNC_FLOW.md)

#### 🧠 Philosophy

Learn by doing. Not by reading.

Core principles:

- active exploration
- no instant walkthrough dependency
- simulation-first learning
- modular architecture
- realistic defensive/offensive workflows

Dark Ecosystem is designed to feel closer to a training environment than a static course platform.

#### ⚠️ Current Limitations

1. Product differentiation

   Some modules still share similar visual language and navigation patterns.

Visual differentiation is actively improving.

2. UX hierarchy

   The ecosystem hub flow is improving progressively through DarkNexus.

3. Cloud sync maturity

   The synchronization system is operational but still evolving:

- local-first remains primary
- automatic cross-device sync is not fully enabled yet

#### 🚧 In Progress

- stronger module differentiation
- telemetry dashboards
- attack maps
- guided pathways
- AI-assisted feedback (long-term)
- advanced Warzone scenarios
- multi-step CTFs
- defensive analytics
- global achievements
- organization/team support

#### 🔥 Why this matters

Many cybersecurity platforms are:

- too theoretical
- overly gamified
- disconnected from realistic workflows

Dark Ecosystem aims to provide:

- credible simulations
- modular progression
- realistic offensive & defensive thinking
- ecosystem-level learning continuity

#### 🛣️ Roadmap

- global progression sync
- advanced telemetry dashboards
- cloud saves
- multi-device continuity
- AI-assisted analysis
- organization/team features
- advanced detection simulations
- attack graph visualization
- adaptive learning paths

#### 🧪 Status

🚧 Active development

⚡ Rapid iteration

🧠 Architecture evolving

#### 💥 TL;DR

Dark Ecosystem is a cybersecurity platform where users:

- understand vulnerabilities
- exploit them in simulated environments
- learn defensive reflexes
- progress through a connected ecosystem

#### 👤 Author

Built with focus on:

- UX
- realism
- modular architecture
- product thinking
- local-first engineering
- immersive cyber training
