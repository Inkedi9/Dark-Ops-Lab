# Dark Ops Lab — Architecture

## Vue d'ensemble

Monorepo npm workspaces consolidant 4 applications en un seul projet Next.js déployé sur un domaine unique, avec un backend Go pour les opérations nécessitant une autorité serveur.

```
darknexus.vercel.app/            ← Hub central (Nexus)
darknexus.vercel.app/learn       ← Plateforme de learning (ex DarkSplaining)
darknexus.vercel.app/challenges  ← Défis offensifs (ex DarkChallenges)
darknexus.vercel.app/defend      ← Simulations défensives (ex DarkDefend)
```

---

## Monorepo

```
Dark Ops Lab/
├── apps/
│   ├── dark-nexus/              ← Application principale (Next.js 16 App Router)
│   ├── dark-api/                ← Backend Go (validation flags, leaderboard)
│   ├── dark-splaining.old/      ← Archivé après migration
│   ├── dark-challenges.old/     ← Archivé après migration
│   └── dark-defend.old/         ← Archivé après migration
└── packages/
    ├── ui/                      ← Composants partagés (@dark/ui)
    ├── storage/                 ← Abstraction localStorage (@dark/storage)
    ├── progress/                ← Suivi de progression (@dark/progress)
    ├── profile/                 ← Profil utilisateur (@dark/profile)
    ├── types/                   ← Types partagés (@dark/types)
    ├── supabase-client/         ← Client Supabase partagé (@dark/supabase-client)
    └── routes/                  ← Définitions de routes centralisées
```

---

## Backend Go — `dark-api`

Service HTTP minimal gérant les opérations qui nécessitent une autorité serveur. Le frontend fonctionne sans ce service (fallback en validation locale).

```
apps/dark-api/
├── cmd/server/
│   └── main.go                  ← Entrypoint — routing, démarrage serveur
├── internal/
│   ├── supabase/
│   │   └── client.go            ← Wrapper REST Supabase (GetUser, InsertEvent, GetLeaderboard)
│   ├── middleware/
│   │   ├── auth.go              ← Validation JWT Supabase, injection user dans contexte
│   │   ├── cors.go              ← CORS restreint à l'origine autorisée
│   │   └── logger.go            ← Logging structuré (slog) method/path/status/latency
│   └── handler/
│       ├── challenges.go        ← POST /v1/challenges/{id}/submit
│       ├── leaderboard.go       ← GET /v1/leaderboard
│       └── json.go              ← Helpers jsonResponse / jsonError
├── challenges.example.json      ← Template — flags serveur (challenges.json est gitignored)
├── .env.example
├── Dockerfile
└── go.mod
```

### Endpoints

| Méthode | Route                        | Auth         | Description                  |
| ------- | ---------------------------- | ------------ | ---------------------------- |
| `GET`   | `/health`                    | Non          | Healthcheck                  |
| `GET`   | `/v1/leaderboard`            | Non          | Top 50 users par XP          |
| `POST`  | `/v1/challenges/{id}/submit` | JWT Supabase | Validation flag côté serveur |

### Flux de validation

```
Frontend (CTF)
  └─► POST /v1/challenges/{id}/submit  { flag: "DARK{...}" }
        ├─ Auth middleware valide le JWT → Supabase /auth/v1/user
        ├─ Handler compare flag contre challenges.json (jamais exposé au client)
        ├─ Si correct → InsertEvent dans Supabase (service role key, idempotent)
        └─ Retourne { correct: bool, xp: number, message: string }
```

---

## Application `dark-ops` — Routes (src/app/)

```
src/app/
├── layout.tsx                        ← Root layout (metadata globale)
├── globals.css
│
├── (nexus)/                          ← Route group Hub (pas de préfixe URL)
│   ├── layout.tsx
│   ├── page.tsx                      ← /
│   ├── auth/
│   │   ├── page.tsx                  ← /auth
│   │   └── callback/
│   │       └── page.tsx              ← /auth/callback (Supabase OAuth)
│   ├── profile/
│   │   └── page.tsx                  ← /profile
│   ├── leaderboard/
│   │   └── page.tsx                  ← /leaderboard
│   ├── telemetry/
│   │   ├── page.tsx                  ← /telemetry
│   │   └── import/
│   │       └── page.tsx              ← /telemetry/import
│   ├── data-settings/
│   │   └── page.tsx                  ← /data-settings
│   ├── operator/
│   │   └── page.tsx                  ← /operator
│   └── practice/
│       └── page.tsx                  ← /practice
│
├── challenges/                       ← Défis offensifs
│   ├── layout.tsx
│   ├── page.tsx                      ← /challenges
│   ├── [slug]/
│   │   └── page.tsx                  ← /challenges/[slug]
│   ├── missions/
│   │   └── page.tsx                  ← /challenges/missions
│   ├── ctf/
│   │   ├── page.tsx                  ← /challenges/ctf
│   │   └── [slug]/
│   │       └── page.tsx              ← /challenges/ctf/[slug]
│   └── warzone/
│       ├── page.tsx                  ← /challenges/warzone
│       └── [slug]/
│           └── page.tsx              ← /challenges/warzone/[slug]
│
├── defend/                           ← Simulations défensives
│   ├── layout.tsx
│   ├── page.tsx                      ← /defend
│   ├── simulator/
│   │   └── page.tsx                  ← /defend/simulator
│   ├── results/
│   │   └── page.tsx                  ← /defend/results
│   ├── security-check/
│   │   └── page.tsx                  ← /defend/security-check
│   ├── defense-profile/
│   │   └── page.tsx                  ← /defend/defense-profile
│   └── soc/
│       ├── page.tsx                  ← /defend/soc
│       ├── alerts/
│       │   └── page.tsx              ← /defend/soc/alerts
│       ├── intel/
│       │   └── page.tsx              ← /defend/soc/intel
│       ├── playbooks/
│       │   └── page.tsx              ← /defend/soc/playbooks
│       └── reports/
│           └── page.tsx              ← /defend/soc/reports
│
└── learn/                            ← Plateforme de learning
    ├── layout.tsx                    ← Server component — délègue à LearnProviders
    ├── learn-providers.tsx           ← Client component (CommandPalette, Toast, Onboarding)
    ├── page.tsx                      ← /learn
    ├── lessons/
    │   ├── page.tsx                  ← /learn/lessons
    │   └── [lessonId]/
    │       └── page.tsx              ← /learn/lessons/[lessonId]
    ├── tracks/
    │   ├── page.tsx                  ← /learn/tracks
    │   └── [trackId]/
    │       └── page.tsx              ← /learn/tracks/[trackId]
    ├── analytics/
    │   └── page.tsx                  ← /learn/analytics
    ├── command-basics/
    │   └── page.tsx                  ← /learn/command-basics
    ├── concepts/
    │   └── [conceptId]/
    │       └── page.tsx              ← /learn/concepts/[conceptId]
    ├── certificates/
    │   └── [trackId]/
    │       └── page.tsx              ← /learn/certificates/[trackId]
    └── resources/
        ├── page.tsx                  ← /learn/resources
        ├── glossary/
        │   ├── page.tsx              ← /learn/resources/glossary
        │   └── [termId]/
        │       └── page.tsx          ← /learn/resources/glossary/[termId]
        ├── handbook/
        │   └── [itemId]/
        │       └── page.tsx          ← /learn/resources/handbook/[itemId]
        └── pci-compliance/
            └── page.tsx              ← /learn/resources/pci-compliance
```

---

## Application `dark-ops` — Source (src/)

### Convention de nommage

Chaque section possède deux dossiers au même nom :

- `src/app/<section>/` — pages Next.js (routes)
- `src/<section>/` — code source (composants, données, hooks, utils)

```
src/
├── app/           ← Pages Next.js (voir section Routes)
│
├── challenges/    ← Source — Défis offensifs
│   ├── components/
│   │   ├── ChallengeRunner.tsx
│   │   ├── ChallengeInfoCard.tsx
│   │   ├── ExploitFeedbackPanel.tsx
│   │   ├── FailIntelligencePanel.tsx
│   │   ├── MissionStatusBar.tsx
│   │   ├── PackCard.tsx
│   │   ├── QueryPreview.tsx
│   │   ├── TargetPanel.tsx
│   │   ├── Terminal.tsx
│   │   ├── sandbox/       ← ChallengeSandbox et variantes
│   │   ├── ctf/           ← CtfRunner (validation via dark-api si connecté)
│   │   └── warzone/       ← WarzoneRunner
│   ├── ctf/               ← Données CTF (registry, types, challenges)
│   ├── warzone/           ← Données Warzone (registry, types)
│   ├── payloads/          ← Payloads d'exploitation (usage pédagogique)
│   ├── registry.ts        ← Registre des challenges
│   ├── packs.ts           ← Packs de challenges
│   └── *.ts               ← Challenges individuels (sqli, xss, etc.)
│
├── defend/        ← Source — Simulations défensives
│   ├── components/
│   │   ├── ui/            ← Composants PhishScope
│   │   ├── soc/           ← SOC dashboard
│   │   ├── mail/          ← Visualiseur email
│   │   ├── threat/        ← MitreBadge
│   │   ├── shared/        ← SectionHeader, EmptyState
│   │   ├── defend/        ← Composants défensifs génériques
│   │   └── layout/        ← Layout SOC
│   ├── data/              ← Scénarios, alertes SOC, playbooks
│   ├── lib/
│   │   ├── defend/        ← Services (incidentService, defendProgressService…)
│   │   └── profile/       ← Service profil défensif
│   ├── utils/             ← Scoring, helpers
│   └── assets/            ← Logos marques email
│
├── learn/         ← Source — Plateforme de learning
│   ├── components/
│   │   ├── layout/        ← AppShell, CommandPalette, sidebar
│   │   ├── learning/      ← Composants par catégorie OWASP (xss, sqli, phishing…)
│   │   ├── tracks/        ← Tracks de progression
│   │   ├── quiz/          ← Composants quiz
│   │   ├── analytics/     ← Dashboard analytics
│   │   ├── certificates/  ← Génération de certificats
│   │   ├── gamification/  ← XP, badges, milestones
│   │   ├── xp/            ← Système XP
│   │   ├── search/        ← Recherche de leçons
│   │   ├── onboarding/    ← Modal onboarding
│   │   ├── owasp/         ← Référentiel OWASP
│   │   ├── security/      ← Composants sécurité
│   │   ├── assistant/     ← Assistant IA
│   │   └── marketing/     ← Pages marketing
│   ├── data/              ← Leçons, tracks, glossaire, concepts
│   ├── hooks/             ← Hooks React spécifiques learn
│   ├── services/          ← Services (progression, certificats…)
│   └── utils/             ← Helpers
│
├── components/    ← Composants partagés inter-sections
│   ├── layout/    ← AppShell, Topbar, Footer, ChallengeTopbar
│   ├── home/      ← Composants page d'accueil
│   ├── assistant/ ← Assistant global
│   ├── command/   ← Command palette
│   └── dc-ui/     ← Design system interne
│
├── engine/        ← Moteur de challenge partagé
│   ├── challenge-engine.ts   ← Exécution des évaluations
│   ├── scoring.ts            ← Calcul du score (difficulté, temps, hints)
│   └── types.ts              ← Types ChallengeDefinition, ChallengeResult
│
├── store/         ← State global (localStorage via @dark/storage)
│   ├── events.ts             ← Constante PROGRESS_CHANGED_EVENT + notifyProgressChanged()
│   ├── progress-store.ts     ← Progression challenges standards
│   ├── global-progress.ts    ← XP total, level, rank
│   ├── ctf-progress-store.ts ← Progression CTF (steps, fragments)
│   └── warzone-progress-store.ts ← Progression Warzone (state, actions)
│
├── lib/           ← Utilitaires globaux
│   ├── profile/   ← Gestion profil (badges, milestones, adapters)
│   └── sync/      ← Synchronisation Supabase (bootstrapSupabaseSync)
│
└── hooks/         ← Hooks React globaux
    ├── useSupabaseSession.ts        ← Session Supabase, profil, signOut
    ├── useSubmitChallenge.ts        ← Soumission flag via dark-api (avec fallback local)
    ├── useSupabaseBootstrapSync.ts  ← Sync pull/push au login
    └── useLocalProgressSnapshots.ts ← Snapshots localStorage
```

---

## Packages partagés

| Package                    | Alias                   | Rôle                                                                       |
| -------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| `packages/ui`              | `@dark/ui`              | Composants UI (AppBadge, PanelCard, AppButton, ProgressBar…)               |
| `packages/storage`         | `@dark/storage`         | Abstraction localStorage typée (safeRead, safeWrite, safeMerge, safeReset) |
| `packages/progress`        | `@dark/progress`        | Système d'events de progression inter-sections, sync queue, telemetry      |
| `packages/profile`         | `@dark/profile`         | Adapter profil (local + Supabase), XP, badges, milestones                  |
| `packages/types`           | `@dark/types`           | Types TypeScript partagés (ProgressEvent, DarkProfile, SyncQueueItem…)     |
| `packages/supabase-client` | `@dark/supabase-client` | Client Supabase unique (browser + server), détection de configuration      |
| `packages/routes`          | —                       | Définitions de routes centralisées                                         |

---

## Modèle de progression

La progression est event-sourced. Chaque action utilisateur crée un `ProgressEvent` idempotent stocké localement, puis synchronisé vers Supabase quand l'utilisateur est connecté.

```typescript
// Structure d'un event
{
  id: "uuid",
  idempotencyKey: "challenges:ctf_completed:ctf-internal-breach",  // Déduplication
  type: "ctf_completed",
  namespace: "challenges",                // "learn" | "challenges" | "defend" | "nexus"
  source: "dark-challenges",
  entityId: "ctf-internal-breach",
  payload: { xp: 2500, kind: "ctf" },
  schemaVersion: 1
}
```

### Clés localStorage

| Clé                                | Contenu                                   |
| ---------------------------------- | ----------------------------------------- |
| `darkchallenges:progress`          | Progression challenges standards          |
| `darkchallenges:ctf-progress`      | Progression CTF (steps, fragments, temps) |
| `darkchallenges:warzone-progress`  | Progression Warzone (state, actions)      |
| `dc_global_progress`               | XP total, level, rank                     |
| `dark_profile`                     | Profil utilisateur complet                |
| `dark:progress:<namespace>`        | Snapshots de progression par namespace    |
| `dark:sync:queue`                  | Queue de synchronisation Supabase         |
| `dark:supabase:bootstrap:<userId>` | Marqueur de bootstrap (1 fois par user)   |

---

## Supabase — Tables

| Table                    | Rôle                                                            |
| ------------------------ | --------------------------------------------------------------- |
| `profiles`               | Profil utilisateur (xp, level, rank, badges)                    |
| `progress_events`        | Events de progression (unique sur user_id + idempotency_key)    |
| `app_progress_snapshots` | Snapshots d'état par namespace (unique sur user_id + namespace) |

---

## Path aliases (`tsconfig.json`)

```json
{
  "@/*": "./src/*",
  "@dark/ui/*": "../../packages/ui/*",
  "@dark/profile/*": "../../packages/profile/src/*",
  "@dark/storage": "../../packages/storage/src/index.js",
  "@dark/progress": "../../packages/progress/src/index.js",
  "@dark/types": "../../packages/types/src/index.ts",
  "@dark/supabase-client": "../../packages/supabase-client/src/index.ts"
}
```
