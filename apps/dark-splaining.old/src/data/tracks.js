export const tracks = [
  {
    id: "fundamentals",
    title: "Cyber Fundamentals",
    description:
      "Build the core mental models needed to understand common web and identity security flaws.",
    level: "Beginner",
    status: "Available",
    domain: "Cyber Fundamentals",
    standard: "DarkSplaining Core",
    category: "Foundations",
    badge: {
      label: "Cyber Starter",
      icon: "◆",
      variant: "blue",
    },
    skills: [
      "Security mindset",
      "Common vulnerabilities",
      "Safe exploitation",
      "Basic remediation",
    ],
    lessonIds: [
      "sql-injection",
      "xss",
      "broken-auth",
      "access-control",
      "phishing-basics",
    ],
    certificate: {
      title: "Cyber Fundamentals Certificate",
      description:
        "Completed the foundational DarkSplaining track covering core security concepts, safe mock exploitation, and beginner remediation patterns.",
    },
  },

  {
    id: "web-security",
    title: "Web Security",
    description:
      "Learn how web applications fail through injection, client-side flaws and access control mistakes.",
    level: "Beginner",
    status: "In progress",
    domain: "Web Security",
    standard: "OWASP Top 10",
    category: "Web Security",
    badge: {
      label: "Web Security Explorer",
      icon: "⌁",
      variant: "violet",
    },
    skills: [
      "SQL Injection",
      "Cross-Site Scripting",
      "Access control testing",
      "Secure web design",
    ],
    lessonIds: ["sql-injection", "xss", "access-control"],
    certificate: {
      title: "Web Security Certificate",
      description:
        "Completed the DarkSplaining web security track focused on common OWASP-style application weaknesses and secure fixes.",
    },
  },

  {
    id: "injection",
    title: "Injection",
    description:
      "Understand how unsafe input handling can affect queries, commands and application behavior.",
    level: "Beginner",
    status: "Available",
    domain: "Injection",
    standard: "OWASP Top 10",
    category: "Web Security",
    badge: {
      label: "Injection Analyst",
      icon: "</>",
      variant: "emerald",
    },
    skills: [
      "SQL Injection",
      "Command Injection",
      "Input boundaries",
      "Parameterized execution",
    ],
    lessonIds: ["sql-injection", "command-injection"],
    certificate: {
      title: "Injection Analyst Certificate",
      description:
        "Completed the DarkSplaining injection track covering unsafe input handling, mock exploitation and safer execution patterns.",
    },
  },

  {
    id: "identity-access",
    title: "Identity & Access",
    description:
      "Learn how identity, sessions, delegated access and authorization work together.",
    level: "Beginner",
    status: "Available",
    domain: "Identity & Access",
    standard: "OWASP Top 10",
    category: "Authentication",
    badge: {
      label: "Identity Guardian",
      icon: "◎",
      variant: "blue",
    },
    skills: [
      "Authentication flows",
      "Session weaknesses",
      "Authorization logic",
      "OAuth basics",
    ],
    lessonIds: ["broken-auth", "access-control", "oauth-basics"],
    certificate: {
      title: "Identity & Access Certificate",
      description:
        "Completed the DarkSplaining identity and access track covering authentication, authorization and delegated access fundamentals.",
    },
  },

  {
    id: "access-control",
    title: "Access Control",
    description:
      "Focus on authorization mistakes, object access issues and permission boundaries.",
    level: "Beginner",
    status: "Available",
    domain: "Access Control",
    standard: "OWASP Top 10",
    category: "Authorization",
    badge: {
      label: "Access Control Scout",
      icon: "◇",
      variant: "violet",
    },
    skills: [
      "Broken Access Control",
      "Permission checks",
      "Object-level authorization",
      "Least privilege",
    ],
    lessonIds: ["access-control"],
    certificate: {
      title: "Access Control Certificate",
      description:
        "Completed the DarkSplaining access control track focused on authorization mistakes and safer permission design.",
    },
  },

  {
    id: "soc-basics",
    title: "Logging & Detection",
    description:
      "Learn beginner-friendly detection concepts and how defenders reason about suspicious activity.",
    level: "Beginner",
    status: "Available",
    domain: "Logging & Detection",
    standard: "Defensive Security",
    category: "SOC Basics",
    badge: {
      label: "Detection Rookie",
      icon: "◈",
      variant: "emerald",
    },
    skills: [
      "Security logging",
      "Suspicious activity",
      "Detection thinking",
      "Alert context",
    ],
    lessonIds: ["logging-detection-basics"],
    certificate: {
      title: "Logging & Detection Certificate",
      description:
        "Completed the DarkSplaining detection track covering beginner SOC reasoning, logging signals and suspicious activity analysis.",
    },
  },

  {
    id: "client-side",
    title: "Client-side Security",
    description:
      "Understand browser-side risks, unsafe rendering and user-controlled content.",
    level: "Beginner",
    status: "Available",
    domain: "Client-side",
    standard: "OWASP Top 10",
    category: "Web Security",
    badge: {
      label: "Client-side Analyst",
      icon: "✦",
      variant: "violet",
    },
    skills: [
      "Cross-Site Scripting",
      "Unsafe rendering",
      "User-controlled content",
      "Browser trust boundaries",
    ],
    lessonIds: ["xss"],
    certificate: {
      title: "Client-side Security Certificate",
      description:
        "Completed the DarkSplaining client-side security track focused on browser-side flaws and safer rendering patterns.",
    },
  },

  {
    id: "ai-security",
    title: "AI Security",
    description:
      "Future lessons about prompt injection, model misuse and AI application risks.",
    level: "Intermediate",
    status: "Coming soon",
    domain: "AI Security",
    standard: "Future Track",
    category: "AI Security",
    badge: {
      label: "AI Security Preview",
      icon: "✶",
      variant: "slate",
    },
    skills: [
      "Prompt injection",
      "Model misuse",
      "AI trust boundaries",
      "Future secure design",
    ],
    lessonIds: [],
    certificate: {
      title: "AI Security Certificate",
      description: "Completed the future DarkSplaining AI security track.",
    },
  },
];
