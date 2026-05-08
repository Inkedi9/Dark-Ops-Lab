export const handbookSections = [
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
        related: ["ip-address"],
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
        related: ["authentication"],
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
    ],
  },
];

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
