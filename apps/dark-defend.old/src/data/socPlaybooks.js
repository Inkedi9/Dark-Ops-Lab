export const socPlaybooks = [
  {
    id: "pb-phishing-triage",
    title: "Phishing Triage",
    category: "Email",
    severity: "Medium",
    difficulty: "Beginner",
    description:
      "Validate suspicious email artifacts, preserve evidence, classify the message, and decide whether user or mailbox containment is required.",
    recommendedFor: [
      "phishing",
      "suspicious sender",
      "credential link",
      "external onboarding link",
      "shared document lure",
    ],
    mitreTechniques: ["T1566.002"],
    steps: [
      {
        title: "Preserve artifact",
        description:
          "Capture headers, sender, subject, links, attachments, and recipient context before interacting with the message.",
        action: "Create evidence snapshot",
      },
      {
        title: "Validate sender and domain",
        description:
          "Compare display name, envelope sender, reply-to, domain age, and brand impersonation signals.",
        action: "Enrich sender",
      },
      {
        title: "Inspect links and attachments",
        description:
          "Detonate safely or inspect URL redirects, attachment type, and document intent without opening on an analyst workstation.",
        action: "Analyze artifact",
      },
      {
        title: "Classify and contain",
        description:
          "Classify as benign, suspicious, or malicious, then search for similar messages across the environment.",
        action: "Hunt related messages",
      },
    ],
    containmentActions: [
      "Quarantine matching messages",
      "Block sender/domain if malicious",
      "Reset credentials if user submitted them",
      "Notify targeted users with clear guidance",
    ],
    escalationCriteria: [
      "Credential submission confirmed",
      "Attachment executed or macro enabled",
      "Multiple recipients targeted",
      "Executive, finance, or privileged user involved",
    ],
    reportTemplate:
      "Phishing triage report: summarize sender, subject, recipients, indicators, verdict, containment, and user impact.",
  },
  {
    id: "pb-oauth-consent",
    title: "OAuth Consent Abuse",
    category: "Identity",
    severity: "High",
    difficulty: "Intermediate",
    description:
      "Investigate suspicious SaaS consent grants that may allow mailbox, drive, or identity access without a password change.",
    recommendedFor: [
      "oauth",
      "consent",
      "application permission",
      "new application permission request",
      "token",
    ],
    mitreTechniques: ["T1528", "T1566.002"],
    steps: [
      {
        title: "Identify consent grant",
        description:
          "Review app name, publisher, requested scopes, granting user, and consent timestamp.",
        action: "Pull SaaS audit event",
      },
      {
        title: "Assess scope impact",
        description:
          "Prioritize mail, files, offline access, directory read, and admin-consent scopes.",
        action: "Map permissions",
      },
      {
        title: "Revoke and invalidate",
        description:
          "Remove the app grant, revoke refresh tokens, and force reauthentication for affected users.",
        action: "Revoke app access",
      },
      {
        title: "Hunt downstream abuse",
        description:
          "Search for mailbox reads, forwarding rule changes, file access, and unusual API activity.",
        action: "Hunt OAuth activity",
      },
    ],
    containmentActions: [
      "Revoke app consent",
      "Revoke user sessions and refresh tokens",
      "Block app publisher or app ID",
      "Review tenant consent policy",
    ],
    escalationCriteria: [
      "Admin consent was granted",
      "Mailbox or file read/write scopes present",
      "Multiple users granted the same app",
      "Data exfiltration indicators found",
    ],
    reportTemplate:
      "OAuth abuse report: include app ID, scopes, granting users, revoke actions, audit findings, and residual risk.",
  },
  {
    id: "pb-mfa-fatigue",
    title: "MFA Fatigue Response",
    category: "Identity",
    severity: "High",
    difficulty: "Intermediate",
    description:
      "Respond to repeated MFA prompts, suspicious approvals, and new-device sign-ins that indicate push fatigue or social engineering.",
    recommendedFor: [
      "mfa fatigue",
      "multiple sign-in approvals",
      "new device",
      "failed login",
      "identity",
    ],
    mitreTechniques: ["T1621"],
    steps: [
      {
        title: "Confirm prompt pattern",
        description:
          "Review failed logins, MFA prompt volume, approval source, device, ASN, and user report status.",
        action: "Inspect identity timeline",
      },
      {
        title: "Contain identity",
        description:
          "Revoke sessions, require password reset, and temporarily block risky sign-ins.",
        action: "Contain account",
      },
      {
        title: "Validate user and device",
        description:
          "Contact the user through a trusted channel and confirm whether any prompt was approved.",
        action: "Verify user",
      },
      {
        title: "Harden MFA method",
        description:
          "Move to number matching, passkeys, hardware keys, or phishing-resistant MFA where possible.",
        action: "Update MFA controls",
      },
    ],
    containmentActions: [
      "Revoke active sessions",
      "Force password reset",
      "Require MFA re-registration",
      "Block suspicious IPs or ASNs",
    ],
    escalationCriteria: [
      "MFA approval accepted from unfamiliar network",
      "Privileged account involved",
      "Mailbox, VPN, or admin access after approval",
      "User cannot confirm activity",
    ],
    reportTemplate:
      "MFA fatigue report: document prompt count, source, approval status, session revocation, user confirmation, and follow-up hardening.",
  },
  {
    id: "pb-bec-invoice",
    title: "BEC Invoice Fraud",
    category: "Email",
    severity: "Critical",
    difficulty: "Advanced",
    description:
      "Investigate payment redirection, invoice fraud, executive impersonation, and urgent finance requests.",
    recommendedFor: [
      "bec",
      "invoice",
      "payment",
      "urgent transfer",
      "finance",
      "supplier",
    ],
    mitreTechniques: ["T1566.002"],
    steps: [
      {
        title: "Freeze payment workflow",
        description:
          "Pause payment processing until sender identity and payment changes are verified out-of-band.",
        action: "Hold payment",
      },
      {
        title: "Validate communication chain",
        description:
          "Review sender, reply-to, thread history, forwarding rules, and whether the request hijacked an existing thread.",
        action: "Review mail thread",
      },
      {
        title: "Verify beneficiary change",
        description:
          "Call known finance or supplier contacts using trusted records, not numbers in the email.",
        action: "Confirm out-of-band",
      },
      {
        title: "Hunt related targeting",
        description:
          "Search finance, executives, and procurement mailboxes for similar language or domains.",
        action: "Hunt finance lures",
      },
    ],
    containmentActions: [
      "Pause or reverse payment if possible",
      "Block impersonation domains",
      "Quarantine related messages",
      "Review finance mailbox rules",
    ],
    escalationCriteria: [
      "Payment already sent",
      "Executive impersonation involved",
      "Supplier account compromise suspected",
      "Multiple finance users targeted",
    ],
    reportTemplate:
      "BEC report: summarize payment request, impacted parties, beneficiary details, verification outcome, containment, and financial exposure.",
  },
  {
    id: "pb-encoded-powershell",
    title: "Encoded PowerShell Investigation",
    category: "Endpoint",
    severity: "High",
    difficulty: "Intermediate",
    description:
      "Investigate encoded PowerShell launched by Office, script hosts, browsers, or suspicious parent processes.",
    recommendedFor: [
      "encoded powershell",
      "powershell.exe -encodedcommand",
      "office document parent process",
      "endpoint",
      "macro",
    ],
    mitreTechniques: ["T1059.001"],
    steps: [
      {
        title: "Capture process tree",
        description:
          "Collect parent process, command line, user, host, hash, child processes, and network connections.",
        action: "Collect EDR telemetry",
      },
      {
        title: "Decode command",
        description:
          "Decode safely and identify download cradle, obfuscation, persistence, credential theft, or lateral movement behavior.",
        action: "Decode payload",
      },
      {
        title: "Contain host",
        description:
          "Isolate the endpoint if malicious intent or outbound execution is confirmed.",
        action: "Isolate endpoint",
      },
      {
        title: "Hunt execution pattern",
        description:
          "Search for matching command fragments, parent processes, hashes, and network destinations.",
        action: "Hunt related execution",
      },
    ],
    containmentActions: [
      "Isolate endpoint",
      "Quarantine source document",
      "Block payload hashes and URLs",
      "Collect memory/process artifacts",
    ],
    escalationCriteria: [
      "Outbound command-and-control observed",
      "Credential dumping or persistence detected",
      "Privileged user context",
      "Multiple endpoints with matching execution",
    ],
    reportTemplate:
      "PowerShell investigation report: include process tree, decoded command, execution verdict, containment, and hunt results.",
  },
  {
    id: "pb-c2-beaconing",
    title: "C2 Beaconing Containment",
    category: "Network",
    severity: "High",
    difficulty: "Advanced",
    description:
      "Contain periodic outbound connections, uncommon TLS fingerprints, and suspected command-and-control traffic.",
    recommendedFor: [
      "beacon",
      "c2",
      "periodic outbound",
      "unusual tls",
      "network",
    ],
    mitreTechniques: ["T1071.001"],
    steps: [
      {
        title: "Validate beacon pattern",
        description:
          "Confirm interval, destination, JA3/JA4, bytes transferred, DNS history, and host process attribution.",
        action: "Analyze network flow",
      },
      {
        title: "Contain destination and host",
        description:
          "Block destination infrastructure and isolate the source endpoint if compromise is likely.",
        action: "Block and isolate",
      },
      {
        title: "Collect endpoint evidence",
        description:
          "Pull process, persistence, scheduled task, startup, and recent execution artifacts from the host.",
        action: "Collect host triage",
      },
      {
        title: "Hunt lateral indicators",
        description:
          "Search for the same domain, fingerprint, interval, and payload across network telemetry.",
        action: "Hunt C2 indicators",
      },
    ],
    containmentActions: [
      "Block destination domain/IP",
      "Isolate source endpoint",
      "Sinkhole or monitor DNS if available",
      "Hunt same JA3/interval across hosts",
    ],
    escalationCriteria: [
      "Confirmed malware process",
      "Multiple hosts beaconing",
      "Data transfer or staging observed",
      "Critical server involved",
    ],
    reportTemplate:
      "C2 containment report: document source host, destination, beacon interval, containment, endpoint findings, and remaining hunt scope.",
  },
  {
    id: "pb-shared-document",
    title: "Suspicious Shared Document",
    category: "Email",
    severity: "Medium",
    difficulty: "Beginner",
    description:
      "Triage document-sharing lures, fake cloud collaboration prompts, and sensitive-file themed phishing.",
    recommendedFor: [
      "shared document",
      "docusign",
      "sharepoint",
      "googledocs",
      "document shared",
      "collaboration",
    ],
    mitreTechniques: ["T1566.002"],
    steps: [
      {
        title: "Verify platform domain",
        description:
          "Compare sender and link domains against legitimate collaboration platforms and tenant branding.",
        action: "Check platform identity",
      },
      {
        title: "Review document lure",
        description:
          "Assess sensitivity theme, urgency, recipient targeting, and whether login is requested.",
        action: "Analyze lure context",
      },
      {
        title: "Inspect link chain",
        description:
          "Trace redirects and final landing page safely, recording credential collection or OAuth prompts.",
        action: "Trace link",
      },
      {
        title: "Contain and notify",
        description:
          "Remove related messages and warn targeted users if the lure reached inboxes.",
        action: "Quarantine and notify",
      },
    ],
    containmentActions: [
      "Quarantine related shared-document emails",
      "Block fake collaboration domains",
      "Revoke sessions if credentials were entered",
      "Warn recipients with screenshot/context",
    ],
    escalationCriteria: [
      "Sensitive department targeted",
      "Credentials entered",
      "OAuth prompt observed",
      "Multiple similar lures delivered",
    ],
    reportTemplate:
      "Shared document report: capture platform impersonation, link chain, targeted users, credential/OAuth risk, and containment.",
  },
];
