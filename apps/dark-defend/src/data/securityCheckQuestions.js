export const securityCheckQuestions = [
  {
    id: "password-reuse",
    category: "Account security",
    question:
      "Do you reuse the same password across multiple important accounts?",
    answers: [
      { label: "Yes, often", score: 0 },
      { label: "Sometimes", score: 1 },
      { label: "No, I use unique passwords", score: 2 },
    ],
    recommendation:
      "Use unique passwords for important accounts. A password manager helps avoid reuse.",
    lessonId: "password-security",
  },
  {
    id: "two-factor",
    category: "Account security",
    question:
      "Do you use two-factor authentication on email, banking, and main accounts?",
    answers: [
      { label: "No", score: 0 },
      { label: "Only on some accounts", score: 1 },
      { label: "Yes, on important accounts", score: 2 },
    ],
    recommendation:
      "Enable 2FA on your most important accounts first, especially email.",
    lessonId: "broken-auth",
  },
  {
    id: "phishing-links",
    category: "Phishing awareness",
    question:
      "Before clicking a suspicious link, do you check the sender and domain?",
    answers: [
      { label: "Rarely", score: 0 },
      { label: "Sometimes", score: 1 },
      { label: "Yes, I inspect it first", score: 2 },
    ],
    recommendation:
      "Slow down, inspect the sender, and visit trusted websites directly instead of using message links.",
    lessonId: "phishing-basics",
  },
  {
    id: "public-wifi",
    category: "Device habits",
    question:
      "Do you log into sensitive accounts on public Wi-Fi without thinking about it?",
    answers: [
      { label: "Yes", score: 0 },
      { label: "Sometimes", score: 1 },
      { label: "No, I avoid it or use safer networks", score: 2 },
    ],
    recommendation:
      "Avoid sensitive logins on untrusted networks when possible, especially without HTTPS.",
    lessonId: "oauth-basics",
  },
  {
    id: "updates",
    category: "Device habits",
    question: "Do you keep your browser, phone, and apps updated?",
    answers: [
      { label: "Rarely", score: 0 },
      { label: "When I remember", score: 1 },
      { label: "Yes, regularly", score: 2 },
    ],
    recommendation:
      "Updates fix known vulnerabilities. Turn on automatic updates where possible.",
    lessonId: "logging-detection-basics",
  },
];
