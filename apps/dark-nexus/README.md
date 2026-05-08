# 🌑 DarkNexus — Cyber Learning Ecosystem

DarkNexus is a **modular cybersecurity learning ecosystem** designed to take a user from **complete beginner → practical attacker → real-world defender**.

The project is built around a simple but powerful flow:

> **Learn → Practice → Defend**

---

# 🧠 Vision

Most cybersecurity platforms are either:

- too complex for beginners
- too theoretical
- or disconnected from real-world defense

DarkNexus solves this by combining:

- 📘 **Simple explanations**
- ⚔️ **Hands-on practice**
- 🛡️ **Real-world protection**

---

# 🧩 Ecosystem Overview

## 🌐 DarkNexus (Hub)

Main entry point of the ecosystem.

**Role:**

- Central navigation
- User profile (XP, level, badges)
- Learning paths
- Recommended next actions

**URL:**
/ (root app)

---

## 📘 DarkSplaining (Learn)

**Purpose:**

- Teach cybersecurity concepts in a simple, beginner-friendly way

**Content:**

- SQL Injection
- XSS
- Authentication
- OAuth
- Security basics

**Philosophy:**

> “Explain like the user has never touched cyber before.”

---

## ⚔️ DarkChallenges (Practice)

**Purpose:**

- Apply knowledge through challenges

**Features:**

- CTF-style exercises
- Warzone missions
- Mocked vulnerable environments

**Goal:**

> “Think like an attacker in a safe environment.”

---

## 🛡️ DarkDefend (Defend)

**Purpose:**

- Teach real-world protection

**Features:**

- Phishing simulator
- Security check
- Password & 2FA awareness

**Goal:**

> “Protect real users, not just learn theory.”

---

# 🔁 Core User Flow

DarkSplaining (Learn)
↓
DarkChallenges (Practice)
↓
DarkDefend (Defend)
↓
Back to Hub (XP + Progression)

---

# 🎯 Key Features

## 🔥 Continue Your Journey

Dynamic block that suggests the next action:

- start learning
- continue a mission
- try defense

---

## 📊 Global Progression

- XP system
- Levels
- Rank
- Badges

---

## 🧭 Learning Paths

Example:

- SQL Injection Path
- XSS Path
- Phishing Defense Path

---

## 🎮 Gamification

- XP rewards
- Missions
- Progress tracking

---

# 🧱 Tech Stack

- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide Icons**

---

# 🧠 Profile System (V1)

## Current Implementation

- Stored in `localStorage`
- No backend
- Fast MVP

### Data Example:

```json
{
  "username": "Ghost",
  "xp": 110,
  "level": 2,
  "rank": "ROOKIE"
}
```

Architecture (Important)

All apps use a shared abstraction:

profileService
↓
localProfileAdapter (V1)
↓
SupabaseAdapter (V2)

👉 This allows migration without refactoring the UI

## 🚀 Future Upgrade (V2)

Supabase Auth
Shared database
Cross-app profile sync
Leaderboards
Real user accounts

## 🗂️ Recommended Project Structure

### Option A — Ideal (Single App)

src/
app/
page.tsx → DarkNexus Hub
profile/ → Profile page
learn/ → DarkSplaining
practice/ → DarkChallenges
defend/ → DarkDefend

lib/
profile/
types.ts
profileService.ts
localProfileAdapter.ts
supabaseProfileAdapter.ts (future)

👉 Best for:

shared localStorage
unified experience

### Option B — Multi Apps (Current)

darknexus.vercel.app
darksplaining.vercel.app
darkchallenges.vercel.app
darkdefend.vercel.app

## ⚠️ Limitation:

localStorage is NOT shared between domains

👉 Solution:

migrate to Supabase later

## 🧪 Development Setup

npx create-next-app@latest dark-nexus
cd dark-nexus
npm install framer-motion lucide-react
npm run dev

## 🎨 UI Principles

Dark cyber aesthetic
Clear actions (no confusion)
Minimal friction
Gamified feedback
Beginner-friendly

---

## ⚡ Product Philosophy

DarkNexus is NOT:

a complex hacking lab
a corporate training platform

DarkNexus IS:

a guided cyber journey
accessible to beginners
focused on real understanding

## 🧠 Key Differentiator

Most platforms:

Learn OR Practice

DarkNexus:

Learn → Practice → Defend (full loop)

## 🚀 Next Steps

Connect XP across modules
Add real challenges
Improve phishing simulator
Deploy V1 publicly
Gather user feedback

## 👨‍💻 Author

Built as a personal cybersecurity learning ecosystem project.

## 🧠 Final Note

This project is designed to grow:

👉 Start simple (localStorage)
👉 Validate the product
👉 Scale with real backend later

DarkNexus = Cyber made simple, practical, and real.
