export const phishingFlags = [
  "Suspicious sender address",
  "Lookalike domain",
  "Urgent language",
  "Credential request",
  "Suspicious attachment",
  "Suspicious link",
  "Generic greeting",
  "Poor grammar or unusual tone",
  "Financial request",
  "External sender",
  "Link text does not match URL",
  "Unexpected document share",
];

export const phishingPath = [
  {
    id: "basics",
    title: "Foundations",
    label: "Step 01",
    goal: "Learn the difference between normal internal email and obvious phishing pressure.",
  },
  {
    id: "links",
    title: "Links & Domains",
    label: "Step 02",
    goal: "Inspect senders, lookalike domains, and URLs before trusting a call to action.",
  },
  {
    id: "attachments",
    title: "Attachments",
    label: "Step 03",
    goal: "Recognize risky file types and unexpected document workflows.",
  },
  {
    id: "business",
    title: "Business Impersonation",
    label: "Step 04",
    goal: "Spot finance, supplier, HR, and executive pressure tactics.",
  },
  {
    id: "accounts",
    title: "Account Defense",
    label: "Step 05",
    goal: "Handle account alerts, MFA messages, and security notifications safely.",
  },
];

export const scenarios = [
  {
    id: 1,
    pathId: "basics",
    category: "Internal HR",
    difficulty: "Easy",
    type: "legitimate",

    senderName: "HR Team",
    senderEmail: "hr@company.com",
    senderCompany: "HR Team",
    brand: "hr",
    avatar: "HR",

    subject: "Reminder: onboarding meeting tomorrow",
    preview: "Please find the Teams meeting details below.",
    date: "2026-04-10 09:10",
    timestamp: "09:10",

    badge: "Internal",
    unread: true,
    priority: "low",
    threadCount: 1,

    severity: "low",
    tactic: "awareness",
    delivery: "email",
    trustLevel: "high",
    businessContext: "HR onboarding",
    attackTechnique: "Legitimate internal reminder",

    ioc: {
      domainAge: "known",
      geo: "internal",
      authFail: false,
      linkMismatch: false,
    },

    timeline: [
      "Message received from internal HR team",
      "No external link or attachment detected",
      "Request matches expected onboarding context",
    ],

    analystNotes:
      "Legitimate internal HR communication. No urgent credential request, no external domain and no attachment.",

    socEscalation: false,
    socPlaybook: null,
    mitreTechniques: [],

    learningObjective:
      "Recognize a normal internal message with a clear context and no risky request.",
    beginnerTip:
      "A legitimate email usually has a known sender, a reasonable request, and no pressure to act through a strange link.",

    body: `Hello Kevin,

This is a reminder for your onboarding meeting scheduled for tomorrow at 10:00 AM.

You can join through the usual Teams link in your calendar invite.

Best regards,
HR Team`,

    linkText: null,
    linkUrl: null,
    attachment: null,
    redFlags: [],

    explanation:
      "This email is consistent with normal internal HR communication and contains no suspicious indicators.",
    riskLevel: "Low",

    threadMessages: [
      {
        senderName: "Analyst",
        senderEmail: "admin:root@dark.nexus.com",
        date: "2026-04-10 08:55",
        body: "Hi, can you confirm this is expected before I proceed?",
      },
      {
        senderName: "HR Team",
        senderEmail: "hr@company.com",
        date: "2026-04-10 09:02",
        body: "Yes, this is part of the onboarding process. You can use the calendar invite already sent.",
      },
    ],
  },
  {
    id: 2,
    pathId: "basics",
    category: "Generic Phishing",
    difficulty: "Easy",
    type: "phishing",
    senderName: "Mail Administrator",
    senderEmail: "admin@secure-mailbox-warning.com",
    brand: "default",
    avatar: "PH",
    subject: "Your mailbox will be disabled today",
    preview: "Confirm your account now to keep receiving email.",
    date: "2026-04-10 10:22",
    badge: "External",
    learningObjective:
      "Identify generic greetings, urgency, and credential pressure.",
    beginnerTip:
      "If an email threatens account loss and asks you to confirm credentials through a link, slow down and inspect it.",
    body: `Dear user,

Your mailbox has exceeded the allowed security limit.

To avoid permanent deactivation today, confirm your email account immediately using the secure portal below.`,
    linkText: "Confirm mailbox",
    linkUrl: "http://secure-mailbox-warning.com/login",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Credential request",
      "Suspicious link",
      "Generic greeting",
      "External sender",
    ],
    explanation:
      "This is a basic phishing pattern: generic greeting, fear of losing access, and a fake login portal.",
    riskLevel: "High",
  },
  {
    id: 3,
    pathId: "basics",
    category: "Internal IT",
    difficulty: "Easy",
    type: "legitimate",
    senderName: "IT Support",
    senderEmail: "support@company.com",
    brand: "default",
    avatar: "PH",
    subject: "Scheduled maintenance on VPN gateway this weekend",
    preview: "A short service interruption is expected on Saturday.",
    date: "2026-04-10 16:40",
    badge: "Internal",
    learningObjective:
      "Separate a routine informational email from a credential-stealing request.",
    beginnerTip:
      "Maintenance notices can be legitimate when they inform you without asking for passwords or unexpected downloads.",
    body: `Hello team,

Please note that scheduled maintenance will take place on the VPN gateway this Saturday from 07:00 to 09:00.

During this period, remote access may be briefly unavailable.

Regards,
IT Support`,
    linkText: null,
    linkUrl: null,
    attachment: null,
    redFlags: [],
    explanation:
      "This is a normal internal IT maintenance notification with no suspicious indicators.",
    riskLevel: "Low",
  },
  {
    id: 4,
    pathId: "links",
    category: "Account Alert",
    difficulty: "Medium",
    type: "phishing",
    senderName: "Microsoft Security",
    senderEmail: "security@micr0soft-alerts.com",
    brand: "microsoft",
    avatar: "MS",
    subject: "Unusual sign-in attempt detected",
    preview: "We noticed suspicious activity on your account.",
    date: "2026-04-11 08:14",
    badge: "External",
    learningObjective:
      "Spot a lookalike domain and a login link pretending to be Microsoft.",
    beginnerTip:
      "Look carefully at the domain. `micr0soft` with a zero is not the same as `microsoft`.",
    body: `We detected an unusual sign-in attempt from a new location.

To avoid account suspension, please verify your identity immediately.

Failure to act within 30 minutes may result in restricted access.`,
    linkText: "Review activity",
    linkUrl: "http://microsoft-login-alerts.verify-session.net",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Lookalike domain",
      "Urgent language",
      "Credential request",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "This email imitates Microsoft branding and pressures the user into clicking a malicious login link.",
    riskLevel: "High",
  },
  {
    id: 5,
    pathId: "links",
    category: "GitHub Notification",
    difficulty: "Easy",
    type: "legitimate",
    senderName: "GitHub",
    senderEmail: "noreply@github.com",
    brand: "github",
    avatar: "GH",
    subject: "New sign-in to your GitHub account",
    preview: "We noticed a new sign-in from a recognized device.",
    date: "2026-04-11 18:42",
    badge: "Trusted",
    learningObjective:
      "Recognize a legitimate security notification with an expected domain.",
    beginnerTip:
      "A security alert is not automatically phishing. Check whether the sender and link point to the real service.",
    body: `Hello,

We noticed a new sign-in to your GitHub account from a recognized device.

If this was you, no further action is needed.

If you do not recognize this activity, please review your account security settings.

GitHub`,
    linkText: "Review your account",
    linkUrl: "https://github.com/settings/security-log",
    attachment: null,
    redFlags: [],
    explanation:
      "The sender domain is legitimate, the tone is normal, and the link points to the expected GitHub domain.",
    riskLevel: "Low",
  },
  {
    id: 6,
    pathId: "links",
    category: "Delivery Scam",
    difficulty: "Medium",
    type: "phishing",
    senderName: "DHL Express",
    senderEmail: "delivery@dhl-track-help.net",
    brand: "default",
    avatar: "PH",
    subject: "Your package could not be delivered",
    preview: "Update your delivery address to avoid return to sender.",
    date: "2026-04-12 11:05",
    badge: "External",
    learningObjective:
      "Inspect a delivery link that uses a believable but unofficial domain.",
    beginnerTip:
      "Delivery scams often exploit urgency. Go to the carrier website yourself instead of using the email link.",
    body: `Dear customer,

Your parcel could not be delivered due to an address validation issue.

Please confirm your details within 24 hours to avoid return to sender.`,
    linkText: "Update delivery details",
    linkUrl: "http://dhl-delivery-confirm.help/track",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Suspicious link",
      "Generic greeting",
      "External sender",
    ],
    explanation:
      "This email uses a common delivery scam pattern with urgency and a suspicious non-official tracking domain.",
    riskLevel: "High",
  },
  {
    id: 7,
    pathId: "attachments",
    category: "Project Collaboration",
    difficulty: "Medium",
    type: "legitimate",
    senderName: "Project Manager",
    senderEmail: "marie.dubois@company.com",
    brand: "default",
    avatar: "PH",
    subject: "Updated roadmap before tomorrow's review",
    preview: "Please review the latest project notes ahead of the meeting.",
    date: "2026-04-12 14:05",
    badge: "Internal",
    learningObjective:
      "Recognize a normal collaboration email with context and an expected SharePoint link.",
    beginnerTip:
      "Context matters: known sender, expected project, and company domain reduce risk.",
    body: `Hi Kevin,

I've updated the project roadmap and added the latest notes for tomorrow's review meeting.

Please take a look when you have a moment, and we will go through the priorities together tomorrow morning.

Thanks,
Marie`,
    linkText: "Open shared notes",
    linkUrl: "https://company.sharepoint.com/sites/projects/roadmap",
    attachment: null,
    redFlags: [],
    explanation:
      "This message is consistent with normal internal collaboration and uses an expected company SharePoint domain.",
    riskLevel: "Low",
  },
  {
    id: 8,
    pathId: "attachments",
    category: "Cloud Share Scam",
    difficulty: "Hard",
    type: "phishing",
    senderName: "SharePoint Online",
    senderEmail: "noreply@sharepoint-docs-cloud.com",
    brand: "microsoft",
    avatar: "MS",
    subject: "A document has been shared with you: Q2_Budget_Review.xlsx",
    preview: "Open the secured document to review the latest changes.",
    date: "2026-04-12 14:22",
    badge: "External",
    learningObjective:
      "Detect a fake document-sharing workflow that leads to credential theft.",
    beginnerTip:
      "Real document shares usually come from the real service domain or your organization domain.",
    body: `Hello,

A secure document has been shared with you and requires authentication before viewing.

Please review the file as soon as possible to avoid project delays.`,
    linkText: "Open document",
    linkUrl: "http://sharepoint-secure-access-docs.net/open",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Unexpected document share",
      "Credential request",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "This phishing email abuses trust in document-sharing platforms and pushes the victim toward a fake login page.",
    riskLevel: "High",
  },
  {
    id: 9,
    pathId: "attachments",
    category: "Payroll Scam",
    difficulty: "Medium",
    type: "phishing",
    senderName: "Payroll Department",
    senderEmail: "payroll@company-payrolls.com",
    brand: "default",
    avatar: "PH",
    subject: "Updated salary statement for April",
    preview: "Please review the attached salary update confidentially.",
    date: "2026-04-13 08:20",
    badge: "External",
    learningObjective:
      "Identify a risky attachment and a suspicious payroll sender.",
    beginnerTip:
      "HTML, macro documents, and unexpected payroll attachments deserve extra caution.",
    body: `Hello,

Your updated salary statement for April is now available.

Please review the attached file and confirm receipt today.

Regards,
Payroll Department`,
    linkText: null,
    linkUrl: null,
    attachment: "Salary_Update_April.html",
    redFlags: [
      "Suspicious sender address",
      "Suspicious attachment",
      "External sender",
    ],
    explanation:
      "This email mimics payroll communication but uses an unusual sender and a risky HTML attachment.",
    riskLevel: "High",
  },
  {
    id: 10,
    pathId: "business",
    category: "Business Email Compromise",
    difficulty: "Hard",
    type: "phishing",
    senderName: "CEO Office",
    senderEmail: "ceo-office@consulting-finance.net",
    brand: "default",
    avatar: "PH",
    subject: "Need an urgent transfer handled discreetly",
    preview: "I need you to process a confidential payment today.",
    date: "2026-04-13 09:10",
    badge: "External",
    learningObjective:
      "Spot executive impersonation using urgency, secrecy, and money pressure.",
    beginnerTip:
      "Any urgent secret payment request should be verified through another channel before action.",
    body: `Hi,

I'm currently in a meeting and cannot talk.

I need you to urgently handle a confidential transfer for a partner before noon. Reply as soon as you are available so I can send the banking details.

Do not share this with anyone yet.`,
    linkText: null,
    linkUrl: null,
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Financial request",
      "Generic greeting",
      "External sender",
    ],
    explanation:
      "This is a classic business email compromise attempt using urgency, secrecy, and financial pressure.",
    riskLevel: "Critical",
  },
  {
    id: 11,
    pathId: "business",
    category: "Supplier Invoice Fraud",
    difficulty: "Hard",
    type: "phishing",
    senderName: "Accounts Receivable",
    senderEmail: "billing@global-supplier-invoices.com",
    brand: "default",
    avatar: "PH",
    subject: "Outstanding invoice requires confirmation",
    preview: "Please validate the attached invoice before end of day.",
    date: "2026-04-13 09:35",
    badge: "External",
    learningObjective:
      "Recognize invoice pressure and macro-enabled attachment risk.",
    beginnerTip:
      "A `.docm` file can contain macros. Unexpected invoice files should be verified with the supplier.",
    body: `Hello,

We are following up regarding the attached invoice pending confirmation.

Please review the file and process it before close of business to avoid service interruption.`,
    linkText: null,
    linkUrl: null,
    attachment: "Invoice_10482.docm",
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Suspicious attachment",
      "Generic greeting",
      "External sender",
    ],
    explanation:
      "This scenario uses invoice pressure and a macro-enabled attachment, which is a common malware delivery technique.",
    riskLevel: "Critical",
  },
  {
    id: 12,
    pathId: "business",
    category: "DocuSign Workflow",
    difficulty: "Hard",
    type: "phishing",
    senderName: "DocuSign",
    senderEmail: "documents@docusign-review-center.com",
    brand: "docusign",
    avatar: "DS",
    subject: "Signature requested: Updated contractor agreement",
    preview: "Please sign the document to avoid onboarding delays.",
    date: "2026-04-13 12:25",
    badge: "External",
    learningObjective:
      "Detect a fake e-signature notification with an unofficial domain.",
    beginnerTip:
      "Brand names in the sender display name are easy to fake. Trust the domain, not the label.",
    body: `Hello,

A revised contractor agreement is awaiting your signature.

Please complete the signing process today to avoid onboarding delays.`,
    linkText: "Review and sign",
    linkUrl: "http://docusign-review-center.com/access",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Unexpected document share",
      "Urgent language",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "The message abuses the familiarity of e-signature workflows and pushes the user toward a fake signing portal.",
    riskLevel: "High",
  },
  {
    id: 13,
    pathId: "accounts",
    category: "Password Change Confirmation",
    difficulty: "Easy",
    type: "legitimate",
    senderName: "Microsoft Account Team",
    senderEmail: "account-security-noreply@account.microsoft.com",
    brand: "microsoft",
    avatar: "MS",
    subject: "Your password was changed",
    preview: "This is a confirmation of a recent password update.",
    date: "2026-04-13 13:10",
    badge: "Trusted",
    learningObjective: "Recognize a legitimate account security notification.",
    beginnerTip:
      "For account alerts, verify the real domain and prefer visiting the service directly.",
    body: `Hello,

This is a confirmation that the password for your Microsoft account was successfully changed.

If you made this change, no further action is required.

If you did not make this change, review your recent account activity immediately through the official Microsoft account page.`,
    linkText: "Review account activity",
    linkUrl: "https://account.microsoft.com/security",
    attachment: null,
    redFlags: [],
    explanation:
      "The sender domain and link are legitimate, and the email follows a standard account notification format.",
    riskLevel: "Low",
  },
  {
    id: 14,
    pathId: "accounts",
    category: "MFA Fraud",
    difficulty: "Hard",
    type: "phishing",
    senderName: "Security Notifications",
    senderEmail: "notify@auth-microsoft365.net",
    brand: "microsoft",
    avatar: "MS",
    subject: "Multi-factor authentication reset required",
    preview: "A security policy update requires immediate MFA re-enrollment.",
    date: "2026-04-13 14:00",
    badge: "External",
    learningObjective:
      "Spot fake MFA reset workflows designed to steal credentials.",
    beginnerTip:
      "MFA setup should happen from the official account portal, not a random email domain.",
    body: `Hello,

Due to a recent security policy update, all employees must re-enroll their MFA settings today.

Failure to complete the process may result in access interruption.`,
    linkText: "Re-enroll MFA",
    linkUrl: "http://auth-microsoft365.net/revalidate",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Lookalike domain",
      "Urgent language",
      "Credential request",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "The email imitates a trusted authentication workflow and pressures the user into a fake MFA reset.",
    riskLevel: "Critical",
  },
  {
    id: 15,
    pathId: "accounts",
    category: "Banking Alert Scam",
    difficulty: "Medium",
    type: "phishing",
    senderName: "Bank Security Center",
    senderEmail: "alerts@secure-bank-verification.net",
    brand: "default",
    avatar: "PH",
    subject: "Suspicious transaction detected on your account",
    preview: "Immediate verification is required to avoid account restriction.",
    date: "2026-04-13 15:11",
    badge: "External",
    learningObjective:
      "Recognize fear-based financial phishing and credential collection.",
    beginnerTip:
      "For banking alerts, never use the email link. Open the bank app or website yourself.",
    body: `Dear client,

We detected a suspicious card transaction on your account.

To prevent temporary restriction, please verify your account activity immediately using the secure form below.`,
    linkText: "Verify transaction",
    linkUrl: "http://secure-bank-verification.net/client-check",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Credential request",
      "Suspicious link",
      "Generic greeting",
      "External sender",
    ],
    explanation:
      "This email creates fear around account abuse and redirects the victim to a fake banking portal.",
    riskLevel: "High",
  },
  {
    id: 16,
    pathId: "advanced",
    category: "OAuth Abuse",
    difficulty: "Medium",
    type: "phishing",

    senderName: "Microsoft 365",
    senderEmail: "notifications@ms365-access.com",
    brand: "microsoft",
    avatar: "MS",
    senderCompany: "Microsoft 365",

    subject: "New application permission request",
    preview: "DarkDocs is requesting access to your Microsoft account.",
    date: "2026-04-11 10:24",
    timestamp: "10:24",

    badge: "External",
    unread: true,
    priority: "high",
    threadCount: 1,

    severity: "high",
    tactic: "credential-access",
    delivery: "oauth",
    trustLevel: "low",
    businessContext: "SaaS access request",
    attackTechnique: "OAuth consent phishing",

    ioc: {
      domainAge: "5 days",
      geo: "unknown",
      authFail: true,
      linkMismatch: true,
    },

    timeline: [
      "User received OAuth permission request",
      "Application requested mailbox and profile access",
      "Sender domain does not match Microsoft identity infrastructure",
    ],

    analystNotes:
      "This is not a password phishing email. The risk is delegated account access through OAuth consent.",

    socEscalation: true,
    socPlaybook: "OAuth Consent Abuse",
    mitreTechniques: ["T1566.002", "T1528"],

    learningObjective:
      "Recognize OAuth consent phishing where attackers request access instead of asking for a password.",

    beginnerTip:
      "Not all phishing asks for credentials. Some attacks ask you to approve app permissions.",

    body: `Hello,

The application DarkDocs is requesting access to your Microsoft 365 account.

Requested permissions:
- Read your profile
- Read your mailbox
- Maintain access to data you have given it access to

Approve this request to continue using document collaboration features.

Microsoft 365 Security`,

    linkText: "Review application permissions",
    linkUrl: "https://ms365-access.com/oauth/authorize/darkdocs",
    attachment: null,

    redFlags: [
      "Sender domain does not match Microsoft",
      "OAuth permission request",
      "Persistent account access requested",
      "Unfamiliar application name",
    ],

    explanation:
      "This is OAuth consent phishing. The attacker is trying to obtain delegated access rather than stealing the password directly.",

    riskLevel: "High",
  },
  {
    id: 17,
    pathId: "advanced",
    category: "MFA Fatigue",
    difficulty: "Medium",
    type: "phishing",

    senderName: "Okta Verify",
    senderEmail: "security@okta-verify-support.com",
    senderCompany: "Okta",
    brand: "okta",
    avatar: "OK",

    subject: "Multiple sign-in approvals pending",
    preview:
      "Approve the latest request to stop repeated verification prompts.",
    date: "2026-04-11 11:08",
    timestamp: "11:08",

    badge: "External",
    unread: true,
    priority: "high",
    threadCount: 1,

    severity: "high",
    tactic: "credential-access",
    delivery: "mfa",
    trustLevel: "low",
    businessContext: "Identity verification",
    attackTechnique: "MFA fatigue social engineering",

    ioc: {
      domainAge: "7 days",
      geo: "unknown",
      authFail: true,
      linkMismatch: true,
    },

    timeline: [
      "User received repeated MFA prompts",
      "Email instructs user to approve latest request",
      "Sender domain does not match Okta infrastructure",
    ],

    analystNotes:
      "MFA fatigue attacks pressure users into approving authentication prompts. The email attempts to normalize approval instead of instructing the user to report suspicious activity.",

    socEscalation: true,
    socPlaybook: "MFA Fatigue Response",
    mitreTechniques: ["T1621", "T1566.002"],

    learningObjective:
      "Recognize MFA fatigue attacks where attackers pressure users into approving login prompts.",
    beginnerTip:
      "A real security team will never ask you to approve an MFA request you did not initiate.",

    body: `Hello Kevin,

We detected multiple verification prompts linked to your employee account.

To prevent additional approval requests, please approve the most recent Okta Verify notification on your mobile device.

If you did not request this, approval is still required to close the pending verification session.

Okta Verify Support`,

    linkText: "View pending verification",
    linkUrl: "https://okta-verify-support.com/session/pending",
    attachment: null,

    redFlags: [
      "Asks user to approve MFA request",
      "External sender impersonating Okta",
      "Urgent verification language",
      "Suspicious support domain",
    ],

    explanation:
      "This is an MFA fatigue phishing scenario. The attacker is trying to make the user approve an authentication request they did not initiate.",
    riskLevel: "High",
  },

  {
    id: 18,
    pathId: "advanced",
    category: "Executive Fraud",
    difficulty: "Hard",
    type: "phishing",

    senderName: "Martin Keller",
    senderEmail: "martin.keller.ceo@company-payments.com",
    senderCompany: "Executive Office",
    brand: "default",
    avatar: "PH",

    subject: "Need this handled before EOD",
    preview:
      "Can you process this vendor payment today? Keep this between us for now.",
    date: "2026-04-11 15:42",
    timestamp: "15:42",

    badge: "External",
    unread: true,
    priority: "high",
    threadCount: 1,

    severity: "high",
    tactic: "fraud",
    delivery: "email",
    trustLevel: "low",
    businessContext: "Urgent vendor payment",
    attackTechnique: "Business Email Compromise",

    ioc: {
      domainAge: "2 days",
      geo: "unknown",
      authFail: true,
      linkMismatch: false,
    },

    timeline: [
      "Email received late in business day",
      "Sender impersonates executive authority",
      "Message requests urgent payment outside normal workflow",
    ],

    analystNotes:
      "BEC attacks often contain no link or attachment. The signal is in the business process violation, urgency, secrecy, and sender mismatch.",

    socEscalation: true,
    socPlaybook: "BEC Invoice Fraud",
    mitreTechniques: ["T1566.002"],

    learningObjective:
      "Identify business email compromise where social pressure replaces technical payloads.",
    beginnerTip:
      "No link does not mean safe. Urgent payment requests and secrecy are major red flags.",

    body: `Kevin,

I need you to handle a vendor payment before close of business today.

Amount: €18,750
Vendor: Northline Strategic Consulting
Reference: Q2 advisory retainer

I am heading into meetings, so do not loop in the wider finance group yet. Please confirm once this is processed.

Martin`,

    linkText: null,
    linkUrl: null,
    attachment: null,

    redFlags: [
      "Urgent payment request",
      "Requests secrecy",
      "External domain impersonating executive",
      "Bypasses finance approval workflow",
    ],

    explanation:
      "This is BEC invoice fraud. There is no malware or link, but the attacker uses authority, urgency, and secrecy to manipulate payment behavior.",
    riskLevel: "High",
  },

  {
    id: 19,
    pathId: "intermediate",
    category: "Security Operations",
    difficulty: "Medium",
    type: "legitimate",

    senderName: "Security Operations",
    senderEmail: "security-ops@company.com",
    senderCompany: "Security Operations",
    brand: "slack",
    avatar: "SL",

    subject: "Scheduled VPN credential rotation",
    preview:
      "VPN credential rotation begins tomorrow as part of scheduled maintenance.",
    date: "2026-04-12 08:30",
    timestamp: "08:30",

    badge: "Internal",
    unread: true,
    priority: "medium",
    threadCount: 2,

    severity: "medium",
    tactic: "awareness",
    delivery: "email",
    trustLevel: "high",
    businessContext: "Security maintenance",
    attackTechnique: "Legitimate security maintenance",

    ioc: {
      domainAge: "known",
      geo: "internal",
      authFail: false,
      linkMismatch: false,
    },

    timeline: [
      "Security Operations announced planned VPN rotation",
      "Message references normal internal maintenance window",
      "No external link or attachment detected",
    ],

    analystNotes:
      "This message may look security-sensitive, but it comes from an internal sender, references scheduled maintenance, and does not request credentials through email.",

    socEscalation: false,
    socPlaybook: null,
    mitreTechniques: [],

    learningObjective:
      "Avoid over-classifying legitimate security communications as phishing.",
    beginnerTip:
      "Some legitimate security emails mention passwords or VPNs. Check sender, workflow, and whether credentials are requested directly.",

    body: `Hello,

As part of scheduled maintenance, VPN credential rotation will begin tomorrow at 09:00.

You do not need to send your password to anyone. When prompted by the VPN client, follow the standard company password reset workflow.

If you receive any message asking you to share credentials directly, report it to Security Operations.

Regards,
Security Operations`,

    linkText: null,
    linkUrl: null,
    attachment: null,

    threadMessages: [
      {
        senderName: "Kevin",
        senderEmail: "kevin@company.com",
        date: "2026-04-12 08:34",
        body: "Can you confirm whether we need to take action before tomorrow?",
      },
      {
        senderName: "Security Operations",
        senderEmail: "security-ops@company.com",
        date: "2026-04-12 08:39",
        body: "No action is needed before the maintenance window. The VPN client will guide users through the normal workflow.",
      },
    ],

    redFlags: [],

    explanation:
      "This is a legitimate internal security maintenance email. It discusses credential rotation but does not ask users to send credentials or use an external link.",
    riskLevel: "Medium",
  },

  {
    id: 20,
    pathId: "intermediate",
    category: "Shared Document",
    difficulty: "Medium",
    type: "phishing",

    senderName: "Google Drive",
    senderEmail: "drive-notify@googledocs-share.com",
    senderCompany: "Google Drive",
    brand: "google",
    avatar: "GD",

    subject: "Document shared with you: Q2 Compensation Review",
    preview:
      "A document has been shared with you and requires sign-in to view.",
    date: "2026-04-12 10:16",
    timestamp: "10:16",

    badge: "External",
    unread: true,
    priority: "medium",
    threadCount: 1,

    severity: "medium",
    tactic: "credential-access",
    delivery: "collaboration",
    trustLevel: "low",
    businessContext: "Shared HR document",
    attackTechnique: "Fake shared document phishing",

    ioc: {
      domainAge: "4 days",
      geo: "unknown",
      authFail: true,
      linkMismatch: true,
    },

    timeline: [
      "User received shared document notification",
      "Document title creates curiosity around compensation",
      "Sender domain does not match Google infrastructure",
    ],

    analystNotes:
      "Shared document lures abuse normal collaboration behavior. The subject is sensitive and the sender domain is not an official Google domain.",

    socEscalation: true,
    socPlaybook: "Credential Phishing",
    mitreTechniques: ["T1566.002"],

    learningObjective:
      "Detect fake shared document notifications that imitate Google Drive or collaboration tools.",
    beginnerTip:
      "Check the sender domain and destination URL before signing in to view a shared document.",

    body: `Hello Kevin,

A document has been shared with you:

Q2 Compensation Review

You need to sign in with your company account to view this file.

Google Drive`,

    linkText: "Open shared document",
    linkUrl: "https://googledocs-share.com/file/q2-compensation-review",
    attachment: null,

    redFlags: [
      "Sender domain is not google.com",
      "Sensitive compensation-themed lure",
      "Requests sign-in through external link",
      "Generic notification wording",
    ],

    explanation:
      "This is fake shared document phishing. The attacker uses a sensitive document title and a lookalike Google Drive domain to lure the user into signing in.",
    riskLevel: "Medium",
  },
];
