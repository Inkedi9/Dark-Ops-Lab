# Dark Ops Lab — Architecture

## Vue d'ensemble

Monorepo Turborepo consolidant 4 applications en un seul projet Next.js déployé sur un domaine unique.

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
│   ├── dark-nexus/              ← Application principale (Next.js App Router)
│   ├── dark-splaining.old/      ← Archivé après migration
│   ├── dark-challenges.old/     ← Archivé après migration
│   └── dark-defend.old/         ← Archivé après migration
└── packages/
    ├── ui/                      ← Composants partagés (@dark/ui)
    ├── storage/                 ← Abstraction localStorage (@dark/storage)
    ├── progress/                ← Suivi de progression (@dark/progress)
    ├── profile/                 ← Profil utilisateur (@dark/profile)
    ├── types/                   ← Types partagés (@dark/types)
    ├── supabase-client/         ← Client Supabase partagé
    ├── routes/                  ← Définitions de routes partagées
    └── public/                  ← Assets publics partagés
```

---

## Application `dark-nexus` — Routes (src/app/)

```
src/app/
├── layout.tsx                        ← Root layout (providers globaux, fonts)
├── globals.css
│
├── (nexus)/                          ← Route group — Hub central (pas de préfixe URL)
│   ├── layout.tsx                    ← Layout Nexus (navigation hub)
│   ├── page.tsx                      ← / (home)
│   ├── auth/
│   │   ├── page.tsx                  ← /auth
│   │   └── callback/
│   │       └── page.tsx              ← /auth/callback (Supabase OAuth)
│   ├── profile/
│   │   └── page.tsx                  ← /profile (profil unifié)
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
    ├── layout.tsx
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

## Application `dark-nexus` — Source (src/)

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
│   │   ├── ctf/           ← CtfRunner
│   │   └── warzone/       ← WarzoneRunner
│   ├── ctf/               ← Données CTF (registry, types, challenges)
│   ├── warzone/           ← Données Warzone (registry, types)
│   ├── payloads/          ← Payloads d'exploitation
│   ├── registry.ts        ← Registre des challenges
│   ├── packs.ts           ← Packs de challenges
│   └── *.ts               ← Challenges individuels (sqli, xss, etc.)
│
├── defend/        ← Source — Simulations défensives
│   ├── components/
│   │   ├── ui/            ← Composants PhishScope (PhishLayout, PhishHeader…)
│   │   ├── soc/           ← SOC dashboard (SocAlertDetail, SocResponseActions…)
│   │   ├── mail/          ← Visualiseur email (MailBrandIcon…)
│   │   ├── threat/        ← MitreBadge
│   │   ├── shared/        ← SectionHeader, EmptyState
│   │   ├── defend/        ← Composants défensifs génériques
│   │   └── layout/        ← Layout SOC
│   ├── data/              ← Scénarios, alertes SOC, playbooks
│   ├── lib/
│   │   ├── defend/        ← Services (incidentService, defendProgressService…)
│   │   └── profile/       ← Service profil défensif
│   ├── utils/             ← Scoring, helpers
│   └── assets/            ← Logos marques email (mail-brands)
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
│   ├── utils/             ← Helpers
│   ├── styles/            ← Styles spécifiques
│   └── pages/             ← Composants pleine page (héritage migration)
│
├── components/    ← Composants partagés inter-sections
│   ├── layout/    ← AppShell, Topbar, Footer, ChallengeTopbar
│   ├── home/      ← Composants page d'accueil
│   ├── assistant/ ← Assistant global
│   ├── command/   ← Command palette
│   └── dc-ui/    ← Design system interne (héritage)
│
├── engine/        ← Moteur de jeu partagé
│   ├── challenge-engine.ts
│   ├── scoring.ts
│   └── types.ts
│
├── store/         ← State global (Zustand)
│   ├── progress-store.ts
│   ├── global-progress.ts
│   ├── ctf-progress-store.ts
│   └── warzone-progress-store.ts
│
├── lib/           ← Utilitaires globaux
│   ├── profile/   ← Gestion profil (badges, milestones, progression)
│   └── sync/      ← Synchronisation cross-section
│
├── hooks/         ← Hooks React globaux
├── pages/         ← Héritage (à migrer si nécessaire)
└── styles/        ← Styles globaux
```

---

## Packages partagés

| Package | Alias | Rôle |
|---------|-------|------|
| `packages/ui` | `@dark/ui` | Composants UI (AppBadge, PanelCard, AppButton…) |
| `packages/storage` | `@dark/storage` | Abstraction localStorage typée |
| `packages/progress` | `@dark/progress` | Suivi de progression inter-sections |
| `packages/profile` | `@dark/profile` | Données profil utilisateur |
| `packages/types` | `@dark/types` | Types TypeScript partagés |
| `packages/supabase-client` | — | Client Supabase unique (auth, DB) |
| `packages/routes` | — | Définitions de routes centralisées |

---

## Path aliases (`tsconfig.json`)

```json
{
  "@/*":            "./src/*",
  "@dark/ui/*":     "../../packages/ui/*",
  "@dark/profile/*": "../../packages/profile/src/*",
  "@dark/storage":  "../../packages/storage/src/index.js",
  "@dark/progress": "../../packages/progress/src/index.js",
  "@dark/types":    "../../packages/types/src/index.ts"
}
```
