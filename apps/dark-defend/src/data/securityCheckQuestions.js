export const securityCheckQuestions = [
  {
    id: "password-manager",
    category: "Passwords",
    question: "Do you use a password manager for important accounts?",
    description:
      "A manager makes strong unique passwords practical without relying on memory or repeated patterns.",
    impact: "Account takeover resistance",
    lessonId: "password-security",
    answers: [
      {
        label: "No, I remember or reuse passwords",
        score: 0,
        risk: "high",
        recommendation:
          "Adopt a reputable password manager and move email, banking, work, and cloud accounts first.",
      },
      {
        label: "Partially, only for some accounts",
        score: 1,
        risk: "medium",
        recommendation:
          "Expand password manager coverage to every important account and remove reused credentials.",
      },
      {
        label: "Yes, unique passwords everywhere important",
        score: 2,
        risk: "low",
        recommendation:
          "Keep generating long unique passwords and review exposed or reused credentials periodically.",
      },
    ],
  },
  {
    id: "password-rotation",
    category: "Passwords",
    question: "How do you handle password changes?",
    description:
      "Modern guidance favors strong unique passwords and changing them when compromise is suspected, not arbitrary rotation.",
    impact: "Credential hygiene",
    lessonId: "password-security",
    answers: [
      {
        label: "I reuse and rotate small variations",
        score: 0,
        risk: "high",
        recommendation:
          "Stop pattern-based rotation. Replace reused passwords with unique generated ones.",
      },
      {
        label: "I rotate often but not always uniquely",
        score: 1,
        risk: "medium",
        recommendation:
          "Prioritize uniqueness and change passwords immediately when there is evidence of compromise.",
      },
      {
        label: "I use unique passwords and react to compromise",
        score: 2,
        risk: "low",
        recommendation:
          "Maintain unique credentials and monitor breach alerts for targeted password changes.",
      },
    ],
  },
  {
    id: "mfa-method",
    category: "MFA",
    question: "What MFA method protects your most important accounts?",
    description:
      "Phishing-resistant MFA such as passkeys or security keys is stronger than SMS-based codes.",
    impact: "Identity protection",
    lessonId: "mfa-hardening",
    answers: [
      {
        label: "No MFA or mostly SMS",
        score: 0,
        risk: "high",
        recommendation:
          "Enable MFA immediately and move critical accounts away from SMS when better options exist.",
      },
      {
        label: "Authenticator app on key accounts",
        score: 1,
        risk: "medium",
        recommendation:
          "Good baseline. Upgrade high-value accounts to passkeys or hardware security keys where possible.",
      },
      {
        label: "Passkeys or security keys where available",
        score: 2,
        risk: "low",
        recommendation:
          "Keep phishing-resistant MFA enabled and maintain recovery methods securely.",
      },
    ],
  },
  {
    id: "mfa-fatigue",
    category: "MFA",
    question: "What would you do if you received unexpected MFA prompts?",
    description:
      "Unexpected prompts can indicate password compromise or push-fatigue attempts.",
    impact: "MFA abuse response",
    lessonId: "mfa-fatigue",
    answers: [
      {
        label: "Approve to make it stop",
        score: 0,
        risk: "high",
        recommendation:
          "Never approve unexpected MFA prompts. Deny, change the password, and report the activity.",
      },
      {
        label: "Ignore it unless it repeats",
        score: 1,
        risk: "medium",
        recommendation:
          "Deny unexpected prompts and treat repeated prompts as a potential identity incident.",
      },
      {
        label: "Deny, secure the account, and report",
        score: 2,
        risk: "low",
        recommendation:
          "Keep this response habit and verify account activity from a trusted device.",
      },
    ],
  },
  {
    id: "phishing-reporting",
    category: "Phishing",
    question: "How do you handle suspicious emails or messages?",
    description:
      "Reporting suspicious messages helps security teams remove similar lures and warn others.",
    impact: "Human-layer detection",
    lessonId: "phishing-basics",
    answers: [
      {
        label: "Delete or click around to check",
        score: 0,
        risk: "high",
        recommendation:
          "Do not interact with suspicious links. Report the message using the approved process.",
      },
      {
        label: "Inspect manually but rarely report",
        score: 1,
        risk: "medium",
        recommendation:
          "Keep inspecting sender, domain, and intent, then report suspicious messages for team-wide defense.",
      },
      {
        label: "Inspect, avoid interaction, and report",
        score: 2,
        risk: "low",
        recommendation:
          "Maintain this workflow and include context when reporting suspicious messages.",
      },
    ],
  },
  {
    id: "phishing-verification",
    category: "Phishing",
    question: "How do you verify urgent requests for money, files, or credentials?",
    description:
      "Out-of-band verification reduces business email compromise and credential phishing risk.",
    impact: "Fraud prevention",
    lessonId: "bec-response",
    answers: [
      {
        label: "I trust the sender if the message looks familiar",
        score: 0,
        risk: "high",
        recommendation:
          "Verify urgent or sensitive requests through a trusted channel before acting.",
      },
      {
        label: "I verify only large or unusual requests",
        score: 1,
        risk: "medium",
        recommendation:
          "Broaden verification to any credential, payment, or sensitive-data request with urgency.",
      },
      {
        label: "I verify out-of-band before acting",
        score: 2,
        risk: "low",
        recommendation:
          "Keep using trusted contact paths, not phone numbers or links provided inside the message.",
      },
    ],
  },
  {
    id: "software-updates",
    category: "Device Security",
    question: "Are your OS, browser, phone, and key apps updated promptly?",
    description:
      "Software updates patch known vulnerabilities that attackers actively exploit.",
    impact: "Exploit reduction",
    lessonId: "device-hardening",
    answers: [
      {
        label: "Rarely or only when forced",
        score: 0,
        risk: "high",
        recommendation:
          "Enable automatic updates and prioritize browsers, operating systems, and security tools.",
      },
      {
        label: "Usually, but not consistently",
        score: 1,
        risk: "medium",
        recommendation:
          "Create a weekly update habit and keep auto-update enabled where available.",
      },
      {
        label: "Yes, auto-update is enabled",
        score: 2,
        risk: "low",
        recommendation:
          "Keep auto-update on and restart devices when updates require it.",
      },
    ],
  },
  {
    id: "device-lock",
    category: "Device Security",
    question: "Do your devices lock quickly and use disk encryption?",
    description:
      "Device lock and encryption reduce exposure if a laptop or phone is lost, stolen, or left unattended.",
    impact: "Local data protection",
    lessonId: "device-hardening",
    answers: [
      {
        label: "No lock or no idea about encryption",
        score: 0,
        risk: "high",
        recommendation:
          "Enable a short auto-lock timer, strong device unlock, and built-in disk encryption.",
      },
      {
        label: "Device lock yes, encryption unsure",
        score: 1,
        risk: "medium",
        recommendation:
          "Confirm BitLocker, FileVault, or platform encryption is active on devices that hold sensitive data.",
      },
      {
        label: "Short lock timer and encryption enabled",
        score: 2,
        risk: "low",
        recommendation:
          "Keep recovery keys stored safely and avoid leaving unlocked devices unattended.",
      },
    ],
  },
  {
    id: "browser-extensions",
    category: "Browser / SaaS",
    question: "How often do you review browser extensions and SaaS app permissions?",
    description:
      "Extensions and connected apps can retain access to mail, files, sessions, and sensitive browser data.",
    impact: "SaaS permission control",
    lessonId: "oauth-basics",
    answers: [
      {
        label: "Almost never",
        score: 0,
        risk: "high",
        recommendation:
          "Remove unused extensions and revoke unknown connected apps from Google, Microsoft, GitHub, and other SaaS accounts.",
      },
      {
        label: "Sometimes after something looks suspicious",
        score: 1,
        risk: "medium",
        recommendation:
          "Schedule regular reviews of browser extensions and OAuth consent grants.",
      },
      {
        label: "Regularly, with least privilege",
        score: 2,
        risk: "low",
        recommendation:
          "Continue removing unused access and prefer trusted publishers with minimal permissions.",
      },
    ],
  },
  {
    id: "saas-sharing",
    category: "Browser / SaaS",
    question: "Do you check sharing permissions before sending cloud files?",
    description:
      "Over-broad sharing creates data exposure even when accounts are not compromised.",
    impact: "Cloud data exposure",
    lessonId: "data-sharing",
    answers: [
      {
        label: "I often use public or anyone-with-link sharing",
        score: 0,
        risk: "high",
        recommendation:
          "Default to named recipients, expiration dates, and least-privilege file permissions.",
      },
      {
        label: "I check permissions on sensitive files only",
        score: 1,
        risk: "medium",
        recommendation:
          "Review sharing scope for every external share and remove old public links.",
      },
      {
        label: "I use named access and review links",
        score: 2,
        risk: "low",
        recommendation:
          "Keep reviewing external shares and use expiration or access reviews for sensitive data.",
      },
    ],
  },
  {
    id: "sensitive-data",
    category: "Data Handling",
    question: "How do you send or store sensitive personal or business data?",
    description:
      "Sensitive data should be minimized, protected, and shared only through approved channels.",
    impact: "Data loss prevention",
    lessonId: "data-handling",
    answers: [
      {
        label: "Chat, email, or personal storage when convenient",
        score: 0,
        risk: "high",
        recommendation:
          "Use approved encrypted storage and sharing tools. Avoid personal accounts for sensitive data.",
      },
      {
        label: "Mostly approved tools, with exceptions",
        score: 1,
        risk: "medium",
        recommendation:
          "Close the exceptions. Classify sensitive data and use approved retention and sharing paths.",
      },
      {
        label: "Approved tools, minimal access, limited retention",
        score: 2,
        risk: "low",
        recommendation:
          "Maintain least privilege and periodically remove data that no longer needs to be retained.",
      },
    ],
  },
  {
    id: "incident-readiness",
    category: "Incident Response",
    question: "Do you know what to do if you clicked a malicious link or exposed credentials?",
    description:
      "Fast reporting and containment can prevent a mistake from becoming a full incident.",
    impact: "Response speed",
    lessonId: "incident-response",
    answers: [
      {
        label: "No, I would probably wait and see",
        score: 0,
        risk: "high",
        recommendation:
          "Report immediately, disconnect risky sessions if instructed, and change credentials from a trusted device.",
      },
      {
        label: "I know some steps but not the full path",
        score: 1,
        risk: "medium",
        recommendation:
          "Write down the reporting path and first actions for clicked links, lost devices, and suspicious logins.",
      },
      {
        label: "Yes, I know how to report and contain quickly",
        score: 2,
        risk: "low",
        recommendation:
          "Keep the response path current and practice with realistic phishing and SOC scenarios.",
      },
    ],
  },
];
