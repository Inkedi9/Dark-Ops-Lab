export const trackAssistantTips = {
  fundamentals: {
    title: "Need help with Cyber Fundamentals?",
    prompts: [
      {
        label: "Where should I start?",
        answer:
          "Start with SQL Injection, then XSS, then Broken Authentication, and finish with Access Control. This order helps you move from unsafe input to identity and authorization concepts.",
      },
      {
        label: "What is the goal?",
        answer:
          "The goal of this track is not to memorize attacks. It is to understand why common security flaws happen and how safer design reduces risk.",
      },
      {
        label: "Study advice",
        answer:
          "Take one lesson at a time. Read the concept, complete the mocked exercise, then mark the lesson as completed before moving on.",
      },
    ],
  },

  "web-security": {
    title: "Need help with Web Security?",
    prompts: [
      {
        label: "What should I focus on?",
        answer:
          "Focus on how user input moves through a web application: forms, rendering, access checks and backend logic.",
      },
      {
        label: "Beginner mindset",
        answer:
          "Do not think only about payloads. Think about trust boundaries: what comes from users, what the app trusts, and where checks should happen.",
      },
      {
        label: "Study advice",
        answer:
          "Compare each lesson with a real web feature: login forms, comments, account pages and admin panels.",
      },
    ],
  },

  "advanced-topics": {
    title: "Advanced topics are coming soon",
    prompts: [
      {
        label: "What comes next?",
        answer:
          "Advanced topics will introduce more technical scenarios. Finish the fundamentals first so the later lessons feel easier.",
      },
    ],
  },
};
