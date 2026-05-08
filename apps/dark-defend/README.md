# DarkDefend — DarkNexus Defense Module

DarkDefend is the **Defend** module of the DarkNexus cybersecurity learning ecosystem.

It turns phishing awareness into a guided, practical training flow where beginners learn to inspect emails, identify red flags, make safe decisions, and connect their progress back to a shared DarkNexus profile.

> Learn -> Practice -> Defend

---

## Role In DarkNexus

DarkDefend focuses on real-world protection:

- phishing detection
- account security awareness
- suspicious link and attachment inspection
- beginner-friendly analyst decision training
- XP, badges, and progression through the shared DarkNexus profile

It is designed to complement:

- **DarkSplaining** for learning concepts
- **DarkChallenges** for safe attacker-style practice
- **DarkNexus Hub** for global progression

---

## Current Features

- Dark Nexus-style cyber UI
- Shared `darknexus_profile` localStorage profile
- XP, level, rank, badges, and completed defense tracking
- Profile page at `/profile`
- Defense Dashboard on the home page
- Phishing Defense Path with 5 beginner-friendly steps
- Immersive phishing simulator
- Beginner / Analyst mode toggle
- Persistent feedback after submit
- Streak and best streak tracking
- Analyst calls and perfect calls in results
- Detailed result dashboard with charts and skill breakdown

---

## Phishing Defense Path

The simulator is organized as a guided beginner path:

1. **Foundations**
   Learn the difference between normal internal emails and obvious phishing pressure.

2. **Links & Domains**
   Inspect senders, lookalike domains, and suspicious URL destinations.

3. **Attachments**
   Recognize risky file types and unexpected document workflows.

4. **Business Impersonation**
   Spot finance, supplier, HR, DocuSign, and executive pressure tactics.

5. **Account Defense**
   Handle account alerts, MFA resets, and banking/security notifications safely.

Each scenario includes:

- learning objective
- beginner tip
- realistic email content
- sender metadata
- link or attachment context
- expected red flags
- debrief feedback

---

## Simulator Modes

### Beginner Mode

Designed for first-time learners.

- shows learning objectives
- shows beginner tips
- shows operator checklist
- shows simplified intel traces
- keeps feedback visible after submission

### Analyst Mode

Designed for more confident users.

- hides learning hints
- keeps analysis more independent
- applies stricter scoring
- gives bonus XP for correct analyst calls
- unlocks analyst-focused badges

---

## Gamification

DarkDefend writes progression into the shared DarkNexus profile stored under:

```txt
darknexus_profile
```

Tracked fields include:

- `xp`
- `level`
- `rank`
- `badges`
- `completedDefend`

Current badges:

- `defend_first_analysis`
- `defend_perfect_analysis`
- `defend_phishing_path_complete`
- `defend_analyst_correct`
- `defend_streak_3`

Session-level gamification:

- current streak
- best streak
- perfect calls
- analyst calls
- XP rewards

---

## Main Routes

```txt
/           Home + Defense Dashboard
/simulator  Phishing Defense Path simulator
/results    Performance and skill breakdown
/profile    DarkNexus-compatible operator profile
/about      Project overview
```

---

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Lucide Icons
- Recharts
- localStorage profile persistence

---

## Project Structure

```txt
src/
├── components/
│   ├── DefenseDashboard.jsx
│   ├── EmailViewer.jsx
│   ├── AnalysisPanel.jsx
│   ├── ScoreSummary.jsx
│   └── ui/
├── data/
│   └── scenarios.js
├── lib/
│   ├── defend/
│   │   └── defendProgressService.js
│   └── profile/
│       ├── localProfileAdapter.js
│       └── profileService.js
├── pages/
│   ├── Home.jsx
│   ├── Simulator.jsx
│   ├── Results.jsx
│   ├── Profile.jsx
│   └── About.jsx
└── utils/
    └── scoring.js
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

---

## V1 Profile Architecture

DarkDefend follows the DarkNexus V1 profile abstraction:

```txt
profileService
-> localProfileAdapter
-> future Supabase adapter
```

Current storage is local-only and intentionally simple for MVP validation.

Future migration target:

- Supabase Auth
- shared user profile
- cross-app progression sync
- leaderboards
- global badge system

---

## Product Philosophy

DarkDefend is not a corporate compliance quiz.

It is a guided defense trainer that helps beginners build real instincts:

- inspect before clicking
- verify domains
- distrust urgency
- recognize credential theft
- understand false positives
- protect real users

DarkDefend = defense made simple, practical, and real.
