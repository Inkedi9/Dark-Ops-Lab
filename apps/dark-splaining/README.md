# 🧠 DarkSplaining

> Interactive cyber security learning platform — built with React, Tailwind and a product-first mindset.

---

## 🔴🚀 Live Demo

👉 **https://darksplaining.vercel.app/**

---

## 🚀 Overview

**DarkSplaining** is a frontend-only cyber security learning platform designed to make complex security concepts easy to understand through:

- structured lessons
- interactive exercises
- guided learning tracks
- connected glossary system

The goal is to simulate a **real educational product**, not just a static portfolio project.

---

## ✨ Features

### 📚 Learning System

- Modular lessons (concept → example → exercise → quiz)
- Multiple learning tracks
- Automatic lesson completion
- Local progress tracking (no backend)

---

### 🧪 Interactive Exercises (V2)

- Multi-step exercises
- Visual feedback
- Local scoring system
- Retry system
- Completion state (✓)
- Safe mock simulations (no real attack code)

---

### 🧠 Glossary & Resources

- Dedicated `/resources` hub
- Glossary with 30+ cyber terms
- Clean documentation-style UI
- Related terms system
- Cross-linking with lessons
- Inline tooltips in content

---

### 🔎 Global Search

- Search across:
  - Lessons
  - Tracks
  - Glossary
  - Resources

- Keyboard shortcut `/`
- Grouped results
- Mobile + desktop support

---

### 📊 Progress System

- Track progress per lesson
- Track completion states
- Multi-track progression

Auto completion logic:

```
Exercise completed + Quiz correct → Lesson completed
```

---

### 🎮 UX & Product Features

- Floating topbar
- Scroll-to-top navigation
- Responsive layout
- Dark cyber UI design system
- Local analytics mock dashboard
- Gamification base (badges, progress)

---

## 🧱 Tech Stack

- **React (Vite)**
- **TailwindCSS**
- React Router
- LocalStorage (state persistence)

---

## 📂 Project Structure

```txt
src/
├─ components/
│  ├─ learning/
│  ├─ resources/
│  ├─ layout/
│  └─ ui/
├─ data/
│  ├─ lessons.js
│  ├─ tracks.js
│  └─ glossary.js
├─ hooks/
│  └─ useLessonProgress.js
├─ pages/
│  ├─ LessonPage.jsx
│  ├─ TracksPage.jsx
│  ├─ ResourcesPage.jsx
│  └─ Glossary pages
├─ lib/
│  └─ renderGlossaryText.js
```

---

## 🧩 Key Concepts Implemented

- Data-driven UI
- Reusable component architecture
- Learning UX design
- State persistence with localStorage
- Cross-linked knowledge system
- Scalable exercise engine
- Product-oriented thinking

---

## ⚠️ Disclaimer

This project is **educational only**.

- No real exploitation code
- No offensive tooling
- Focus on understanding security concepts safely

---

## 🛣️ Roadmap

### V2 (current)

- ✔ Interactive exercises system
- ✔ Glossary + cross-linking
- ✔ Global search
- ✔ Auto lesson completion
- ✔ Multi-track progression

---

### V2+

- Command palette
- Onboarding flow
- Certificate mock
- Advanced lessons
- More glossary content
- UX polish (animations, skeletons)

---

## 🧑‍💻 Author

Kevin — Cybersecurity learning & product-oriented frontend development

---

## 📌 Why this project?

DarkSplaining is designed to demonstrate:

- frontend engineering skills
- UI/UX thinking
- ability to structure complex knowledge
- product mindset in a technical project

---

## 📦 Run locally

```bash
npm install
npm run dev
```

---

## 🌐 Deployment

Deployed on **Vercel** 🚀

---

## ⭐ Final note

This is not just a project — it's a **learning platform simulation**.

Built to evolve.
