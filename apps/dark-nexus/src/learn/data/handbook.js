const baseHandbookSections = [
  /* 🌐 Networking Basics */
  {
    id: "networking",
    title: "Networking Basics",
    items: [
      {
        id: "ip-address",
        title: "IP Address",
        category: "networking",
        shortDescription: "Unique identifier for a device on a network.",
        description:
          "An IP address identifies a device on a network. It allows systems to send and receive data. Public IPs are used on the internet, while private IPs are used inside local networks.",
        related: ["netmasks", "http"],
      },
      {
        id: "dns",
        title: "DNS",
        category: "networking",
        shortDescription:
          "System that translates domain names into IP addresses.",
        description:
          "DNS (Domain Name System) converts human-readable domain names into IP addresses. Without DNS, users would need to remember numeric addresses.",
        related: ["ip-address", "urls"],
      },
      {
        id: "firewall",
        title: "Firewall",
        category: "networking",
        shortDescription: "System that filters network traffic based on rules.",
        description:
          "A firewall controls incoming and outgoing network traffic. It allows or blocks connections based on security rules to protect systems.",
        related: ["ip-address", "logging"],
      },
      {
        id: "ports",
        title: "Ports",
        category: "networking",
        shortDescription: "Numbered endpoints used by network services.",
        description:
          "Ports help a device route traffic to the right service. Web servers often listen on 80 or 443, while other services use different ports that defenders can inspect during troubleshooting.",
        related: ["ip-address", "firewall"],
      },
      {
        id: "http",
        title: "HTTP",
        category: "networking",
        shortDescription: "Protocol used by browsers and APIs to exchange web data.",
        description:
          "HTTP defines how clients request resources and how servers respond. Understanding methods, headers, status codes, and bodies helps explain many web security issues.",
        related: ["dns", "api", "client-server"],
      },
    ],
  },

  /* 🔐 Authentication Basics */
  {
    id: "auth",
    title: "Authentication Basics",
    items: [
      {
        id: "authentication",
        title: "Authentication",
        category: "auth",
        shortDescription: "Process of verifying a user's identity.",
        description:
          "Authentication ensures that a user is who they claim to be. This can involve passwords, tokens, or multi-factor authentication.",
        related: ["sessions", "oauth", "hashing"],
      },
      {
        id: "authorization",
        title: "Authorization",
        category: "auth",
        shortDescription: "Determines what a user is allowed to do.",
        description:
          "Authorization defines what actions a user can perform after authentication. It controls access to resources.",
        related: ["authentication", "principle-of-least-privilege"],
      },
      {
        id: "multi-factor-authentication",
        title: "Multi-Factor Authentication",
        category: "auth",
        shortDescription:
          "Using multiple verification methods to secure access.",
        description:
          "MFA requires users to provide more than one form of verification, such as a password and a code from a phone.",
        related: ["authentication", "passkeys", "oauth"],
      },
      {
        id: "passkeys",
        title: "Passkeys",
        category: "auth",
        shortDescription: "Phishing-resistant sign-in based on public-key cryptography.",
        description:
          "Passkeys let users sign in without reusable passwords. They bind authentication to a device and origin, which makes many credential phishing attacks much harder.",
        related: ["multi-factor-authentication", "authentication"],
      },
      {
        id: "oauth",
        title: "OAuth",
        category: "auth",
        shortDescription: "Authorization framework for delegated app access.",
        description:
          "OAuth allows an application to access limited resources without receiving the user's password. Defenders review scopes, consent prompts, and suspicious third-party app grants.",
        related: ["authorization", "sessions"],
      },
      {
        id: "sessions",
        title: "Sessions",
        category: "auth",
        shortDescription: "Server-side or token-based state that keeps users signed in.",
        description:
          "A session remembers that a user has already authenticated. Secure session handling includes expiration, rotation after login, HttpOnly cookies, and invalidation after suspicious activity.",
        related: ["authentication", "oauth"],
      },
    ],
  },

  /* 🌍 Web Architecture */
  {
    id: "web",
    title: "Web Architecture",
    items: [
      {
        id: "client-server",
        title: "Client-Server Model",
        category: "web",
        shortDescription:
          "Structure where clients request resources from servers.",
        description:
          "In web architecture, the client sends requests and the server responds with data or services.",
        related: ["http", "rest"],
      },
      {
        id: "api",
        title: "API",
        category: "web",
        shortDescription: "Interface that allows applications to communicate.",
        description:
          "An API allows different systems to interact. Web APIs are commonly used to exchange data between frontend and backend.",
        related: ["rest", "http"],
      },
      {
        id: "frontend-backend",
        title: "Frontend vs Backend",
        category: "web",
        shortDescription: "Separation between user interface and server logic.",
        description:
          "Frontend handles UI, while backend processes logic and data. Security issues often happen at the boundary between both.",
        related: ["api"],
      },
      {
        id: "input-validation",
        title: "Input Validation",
        category: "web",
        shortDescription: "Checking user input before it reaches sensitive logic.",
        description:
          "Input validation makes sure data has the expected shape, length, type, and intent. It is useful for clarity and safety, but it should not replace context-aware escaping or parameterized queries.",
        related: ["api", "prepared-statements"],
      },
      {
        id: "prepared-statements",
        title: "Prepared Statements",
        category: "web",
        shortDescription: "Database queries that separate code from user input.",
        description:
          "Prepared statements keep SQL structure separate from values supplied by users. This prevents input from changing query logic and is a core defense against SQL injection.",
        related: ["input-validation", "api"],
      },
    ],
  },

  /* 🛡️ Detection Concepts */
  {
    id: "detection",
    title: "Detection Concepts",
    items: [
      {
        id: "logging",
        title: "Logging",
        category: "detection",
        shortDescription: "Recording system events for analysis.",
        description:
          "Logging stores system activity such as logins or errors. It helps detect suspicious behavior.",
        related: ["monitoring"],
      },
      {
        id: "monitoring",
        title: "Monitoring",
        category: "detection",
        shortDescription: "Observing systems to detect issues or threats.",
        description:
          "Monitoring involves tracking metrics and events in real time to identify abnormal behavior.",
        related: ["logging"],
      },
      {
        id: "alerting",
        title: "Alerting",
        category: "detection",
        shortDescription:
          "Triggering notifications when suspicious events occur.",
        description:
          "Alerting systems notify defenders when something unusual is detected, enabling quick response.",
        related: ["monitoring"],
      },
      {
        id: "triage",
        title: "Triage",
        category: "detection",
        shortDescription: "Prioritizing alerts by risk, evidence, and business impact.",
        description:
          "Triage helps analysts decide what needs attention first. Good triage compares indicators, affected users, severity, and confidence instead of reacting to every alert equally.",
        related: ["alerting", "logging"],
      },
      {
        id: "indicators-of-compromise",
        title: "Indicators of Compromise",
        category: "detection",
        shortDescription: "Observable clues that may point to malicious activity.",
        description:
          "Indicators of compromise can include suspicious domains, file hashes, IP addresses, unusual processes, or login patterns. They are useful signals but need context before action.",
        related: ["logging", "triage"],
      },
    ],
  },

  /* 💻 Command Line Basics */
  {
    id: "command-line",
    title: "Command Line Basics",
    items: [
      {
        id: "linux-shell",
        title: "Linux Shell",
        category: "command-line",
        shortDescription: "Text interface used to navigate and inspect Linux systems.",
        description:
          "The Linux shell lets users run commands, inspect files, search logs, and understand system state. In security work, it is often used for safe investigation and troubleshooting.",
        related: ["logging", "ports"],
      },
      {
        id: "powershell",
        title: "PowerShell",
        category: "command-line",
        shortDescription: "Object-aware command shell used across Windows environments.",
        description:
          "PowerShell uses readable Verb-Noun cmdlets and returns structured objects. Defenders use it to inspect processes, files, networking, and Windows activity.",
        related: ["logging", "monitoring"],
      },
      {
        id: "command-safety",
        title: "Command Safety",
        category: "command-line",
        shortDescription: "Understanding commands before running them on real systems.",
        description:
          "Command safety means reading flags, understanding scope, avoiding destructive operations, and practicing in mocked environments before touching real machines.",
        related: ["linux-shell", "powershell"],
      },
    ],
  },

  /* 🧱 Secure Coding */
  {
    id: "secure-coding",
    title: "Secure Coding",
    items: [
      {
        id: "least-privilege",
        title: "Least Privilege",
        category: "secure-coding",
        shortDescription: "Give users and services only the access they need.",
        description:
          "Least privilege reduces the impact of mistakes and compromise. Applications, users, API tokens, and databases should have scoped permissions instead of broad access.",
        related: ["authorization", "oauth"],
      },
      {
        id: "secure-defaults",
        title: "Secure Defaults",
        category: "secure-coding",
        shortDescription: "Design systems to start in a safer state.",
        description:
          "Secure defaults make the safe path the easy path. Examples include private resources by default, strict cookie settings, limited permissions, and explicit opt-in for risky features.",
        related: ["authorization", "sessions"],
      },
      {
        id: "error-handling",
        title: "Error Handling",
        category: "secure-coding",
        shortDescription: "Return useful feedback without exposing sensitive details.",
        description:
          "Good error handling helps users and developers without leaking stack traces, secrets, database internals, or account existence signals to attackers.",
        related: ["logging", "api"],
      },
    ],
  },
];

const handbookEnhancements = {
  "ip-address": {
    level: "Beginner",
    whyItMatters:
      "IP addresses are the starting point for understanding connectivity, routing, exposure, and basic network investigation.",
    defenderTip:
      "When investigating a network event, identify whether the IP is internal, external, expected, and tied to a known service.",
    relatedCommands: ["linux-networking", "powershell-networking"],
  },
  dns: {
    level: "Beginner",
    attackerUse:
      "Attackers may use lookalike domains, malicious redirects, or suspicious DNS infrastructure to support phishing and malware delivery.",
    defenderTip:
      "Compare domains carefully, inspect DNS patterns, and treat newly registered or unusual domains as signals that need context.",
    relatedLessons: ["phishing-basics"],
    relatedCommands: ["linux-networking", "powershell-networking"],
  },
  firewall: {
    level: "Beginner",
    defenderTip:
      "Review rules for least privilege, exposed services, and whether logging is enabled for important allow or deny decisions.",
    relatedTracks: ["soc-basics"],
  },
  http: {
    level: "Beginner",
    relatedLessons: ["sql-injection", "xss"],
    relatedTracks: ["web-security"],
    relatedCommands: ["linux-networking", "powershell-networking"],
  },
  authentication: {
    level: "Beginner",
    whyItMatters:
      "Authentication is the front door of most applications. Weak sign-in design can expose accounts even when the rest of the app is solid.",
    relatedLessons: ["broken-auth"],
    relatedTracks: ["identity-access"],
  },
  authorization: {
    level: "Beginner",
    attackerUse:
      "Attackers often test whether changing an ID, role, or URL gives access to another user's data.",
    relatedLessons: ["access-control"],
    relatedTracks: ["access-control", "identity-access"],
  },
  oauth: {
    level: "Intermediate",
    attackerUse:
      "Attackers may abuse malicious app consent, broad scopes, weak redirects, or stolen tokens to gain delegated access.",
    relatedLessons: ["oauth-basics"],
    relatedTracks: ["identity-access"],
  },
  sessions: {
    level: "Beginner",
    relatedLessons: ["broken-auth"],
    relatedTracks: ["identity-access"],
  },
  "input-validation": {
    level: "Beginner",
    relatedLessons: ["sql-injection", "xss"],
    relatedTracks: ["web-security", "injection"],
  },
  "prepared-statements": {
    level: "Beginner",
    whyItMatters:
      "Prepared statements are one of the clearest examples of separating user data from executable logic.",
    relatedLessons: ["sql-injection"],
    relatedTracks: ["injection"],
  },
  logging: {
    level: "Beginner",
    relatedLessons: ["logging-detection-basics"],
    relatedTracks: ["soc-basics"],
    relatedCommands: ["linux-files", "linux-search", "powershell-files"],
  },
  monitoring: {
    level: "Beginner",
    relatedLessons: ["logging-detection-basics"],
    relatedTracks: ["soc-basics"],
  },
  triage: {
    level: "Intermediate",
    relatedLessons: ["logging-detection-basics", "phishing-basics"],
    relatedTracks: ["soc-basics"],
  },
  "linux-shell": {
    level: "Beginner",
    relatedCommands: ["linux-navigation", "linux-files", "linux-search"],
  },
  powershell: {
    level: "Beginner",
    relatedCommands: ["powershell-navigation", "powershell-files", "powershell-processes"],
  },
  "command-safety": {
    level: "Beginner",
    relatedCommands: ["linux-navigation", "powershell-navigation"],
  },
  "least-privilege": {
    level: "Beginner",
    relatedLessons: ["access-control"],
    relatedTracks: ["access-control", "identity-access"],
  },
  "secure-defaults": {
    level: "Intermediate",
    relatedTracks: ["web-security", "identity-access"],
  },
  "error-handling": {
    level: "Beginner",
    relatedLessons: ["sql-injection"],
    relatedTracks: ["web-security"],
  },
};

function getSectionCategory(sectionId) {
  if (sectionId === "auth") return "Identity & Access";
  if (sectionId === "detection") return "SOC / Detection";
  if (sectionId === "command-line") return "Command Basics";
  if (sectionId === "secure-coding") return "Secure Coding";
  if (sectionId === "web") return "Web Security";
  return "Networking";
}

function defaultWhyItMatters(item) {
  return `${item.title} matters because it helps you understand how systems connect, where trust boundaries exist, and what defenders should verify.`;
}

function defaultAttackerUse(item) {
  return `Attackers may abuse weak assumptions around ${item.title.toLowerCase()} to bypass controls, hide activity, or pressure users into unsafe decisions.`;
}

function defaultDefenderTip(item) {
  return `When you see ${item.title.toLowerCase()}, ask what is trusted, what is logged, and what the safest failure mode should be.`;
}

export const handbookSections = baseHandbookSections.map((section) => ({
  ...section,
  category: getSectionCategory(section.id),
  items: section.items.map((item) => {
    const enhancement = handbookEnhancements[item.id] || {};

    return {
      ...item,
      category: enhancement.category || getSectionCategory(section.id),
      level: enhancement.level || "Beginner",
      definition: enhancement.definition || item.description,
      whyItMatters: enhancement.whyItMatters || defaultWhyItMatters(item),
      attackerUse: enhancement.attackerUse || defaultAttackerUse(item),
      defenderTip: enhancement.defenderTip || defaultDefenderTip(item),
      commonMistakes: enhancement.commonMistakes || [
        "Treating the concept as vocabulary instead of linking it to system behavior.",
        "Assuming the default configuration is always the safest configuration.",
      ],
      relatedLessons: enhancement.relatedLessons || [],
      relatedTracks: enhancement.relatedTracks || [],
      relatedCommands: enhancement.relatedCommands || [],
      relatedConcepts: enhancement.relatedConcepts || item.related || [],
    };
  }),
}));

export function getHandbookItemById(itemId) {
  for (const section of handbookSections) {
    const item = section.items.find((sectionItem) => sectionItem.id === itemId);

    if (item) {
      return {
        ...item,
        sectionId: section.id,
        sectionTitle: section.title,
      };
    }
  }

  return null;
}

export function getRelatedHandbookItems(item) {
  if (!item?.related) return [];

  return item.related
    .map((relatedId) => getHandbookItemById(relatedId))
    .filter(Boolean);
}
