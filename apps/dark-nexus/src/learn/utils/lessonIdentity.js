export const lessonIdentity = {
  "sql-injection": {
    accent: "emerald",
    code: "INJECTION",
    symbol: "</>",
    mood: "Database query manipulation",
  },
  xss: {
    accent: "violet",
    code: "CLIENT-SIDE",
    symbol: "<>",
    mood: "Unsafe browser rendering",
  },
  "broken-auth": {
    accent: "blue",
    code: "AUTH",
    symbol: "◎",
    mood: "Identity flow weakness",
  },
  "access-control": {
    accent: "violet",
    code: "AUTHZ",
    symbol: "◇",
    mood: "Permission boundary failure",
  },
  "command-injection": {
    accent: "amber",
    code: "COMMAND",
    symbol: "$_",
    mood: "Shell boundary abuse",
  },
  "phishing-basics": {
    accent: "amber",
    code: "AWARENESS",
    symbol: "!",
    mood: "Trust manipulation",
  },
  "logging-detection-basics": {
    accent: "emerald",
    code: "DETECTION",
    symbol: "◈",
    mood: "Suspicious signal triage",
  },
  "oauth-basics": {
    accent: "blue",
    code: "OAUTH",
    symbol: "↗",
    mood: "Delegated access review",
  },
  "password-security": {
    accent: "emerald",
    code: "PASSWORD",
    symbol: "#",
    mood: "Credential storage safety",
  },
};

export function getLessonIdentity(lesson) {
  return (
    lessonIdentity[lesson?.id] || {
      accent: "blue",
      code: "LESSON",
      symbol: "◆",
      mood: "Security concept",
    }
  );
}
