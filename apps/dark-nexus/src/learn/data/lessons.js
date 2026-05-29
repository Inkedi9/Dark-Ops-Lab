import {
  DIFFICULTIES,
} from "./learningModel";
import { lessonExperience } from "./lessonExperience";

function withExperience(lesson) {
  return {
    ...lesson,
    experience: {
      loop: ["Learn", "Break", "Fix", "Quiz"],
      labType: "sandbox",
      ...(lessonExperience[lesson.id] || {}),
    },
  };
}

export const lessons = [
  withExperience({
    id: "sql-injection",
    title: "SQL Injection",
    category: "Web Security",
    level: DIFFICULTIES.BEGINNER,
    duration: "15 min",
    status: "New",
    featured: true,
    track: "fundamentals",
    relatedTermIds: ["sql", "code-injection", "dml"],
    description:
      "Understand how unsafe database queries can expose sensitive data.",
    learningPath: {
      prerequisite: "Basic understanding of web requests and login forms",
      goal: "Understand how unsafe input reaches a vulnerable query",
      nextStep: "Practice identifying unsafe concatenation patterns",
    },
    defenderNotes: {
      whyItMatters:
        "SQL injection can turn a simple form field into a path for data exposure, account access, or destructive database actions.",
      attackerAbuse:
        "Attackers look for places where input is mixed into query logic, then try values that alter filters, conditions, or database behavior.",
      detection:
        "Defenders look for unusual query errors, suspicious payload patterns, unexpected authentication success, and abnormal database reads.",
      commonMistake:
        "Only checking the frontend input while still building SQL with string concatenation on the server.",
      fixPattern:
        "Use parameterized queries, least-privilege database accounts, and consistent server-side validation.",
    },
    relatedConcepts: [
      "input-validation",
      "authentication",
      "prepared-statements",
    ],
    attackFlow: {
      title: "SQL Injection attack chain",
      steps: [
        {
          label: "User input",
          description:
            "Attacker-controlled text reaches a vulnerable parameter such as a login field, search box, or API value.",
          tone: "blue",
        },
        {
          label: "Unsafe query",
          description:
            "The application concatenates raw input directly into SQL instead of passing it as data.",
          tone: "amber",
        },
        {
          label: "Database execution",
          description:
            "The database receives a query whose logic may now be influenced by untrusted input.",
          tone: "red",
        },
        {
          label: "Impact",
          description:
            "Sensitive records may become visible, modified, or reachable through logic the app did not intend.",
          tone: "violet",
        },
      ],
    },
    bridges: [
      {
        type: "challenge",
        title: "Practice SQL Injection",
        description:
          "Apply unsafe query concepts in a guided DarkChallenge mission.",
        difficulty: "Beginner",
        to: "/challenges/sql-injection-login",
      },
      {
        type: "defend",
        title: "See the defensive side",
        description:
          "Learn how defenders identify and triage suspicious database behavior.",
        to: "/soc",
      },
    ],

    content: {
      goal: "Understand why raw user input should never be trusted inside a database query.",
      keyIdea: "Never mix raw user input directly with query logic.",
      concept: {
        title: "What is SQL Injection?",
        text: "SQL Injection happens when user input is inserted directly into a database query. If the input is not handled safely, it can change the meaning of the query.",
        glossaryLinks: [
          { label: "SQL", termId: "sql" },
          { label: "database query", termId: "sql" },
        ],
      },
      example: {
        title: "Simple real-world example",
        text: "Imagine a login form where the application builds a database query using exactly what the user typed. A suspicious input could make the query behave differently than expected.",
        glossaryLinks: [
          { label: "login form", termId: "sessions" },
          { label: "database query", termId: "sql" },
        ],
      },
      steps: [
        "A user types something into a form.",
        "The application receives that input.",
        "The application builds a database query.",
        "If the input is mixed directly into the query, the query can behave unexpectedly.",
        "A safer approach is to separate user input from query logic.",
      ],
      outcomes: [
        "Understand how unsafe input can affect query logic.",
        "Recognize why raw user input should not be trusted.",
        "Compare unsafe query building with safer parameterized logic.",
        "Practice identifying suspicious input in a safe simulation.",
      ],
      quiz: {
        eyebrow: "SQL Injection",
        title: "Check your understanding",
        question: "What makes this query vulnerable?",
        options: [
          "Missing WHERE clause",
          "String concatenation with user input",
          "Invalid SQL syntax",
        ],
        correctAnswer: "String concatenation with user input",
        explanation:
          "The risk comes from mixing raw user input directly into query logic.",
      },
      exploit: {
        title: "Input changes the query",
        text: "In an unsafe login form, user input is inserted directly into the SQL query. A crafted value can change the query logic and make the application return a user without valid credentials.",
      },
      fix: {
        title: "Use parameterized queries",
        text: "The safer approach is to keep SQL structure separate from user input. Parameterized queries treat input as data, not executable query logic.",
      },
    },

    progressItems: ["Concept", "Example", "Breakdown", "Exercise"],
    nextLessonId: "xss",
  }),

  withExperience({
    id: "xss",
    title: "Cross-Site Scripting",
    category: "Web Security",
    level: DIFFICULTIES.BEGINNER,
    duration: "20 min",
    status: "Available",
    featured: true,
    track: "fundamentals",
    relatedTermIds: ["code-injection", "http", "https", "cookies"],
    prerequisites: ["sql-injection"],
    description: "Learn how unsafe rendering can execute unwanted scripts.",
    learningPath: {
      prerequisite: "Basic understanding of HTML rendering and user-generated content",
      goal: "Understand how untrusted content becomes active page behavior",
      nextStep: "Practice spotting unsafe rendering and escaping mistakes",
    },
    defenderNotes: {
      whyItMatters:
        "XSS can let untrusted content run in a user's browser, exposing sessions, data, or trusted user actions.",
      attackerAbuse:
        "Attackers place script-like payloads into comments, profile fields, URLs, or reflected messages that other users open.",
      detection:
        "Defenders monitor suspicious script payloads, encoded markup, unusual redirects, and reports of unexpected browser behavior.",
      commonMistake:
        "Assuming stored content is safe because it passed through the application once.",
      fixPattern:
        "Escape output by context, avoid rendering trusted HTML by default, and use defensive browser controls such as CSP.",
    },
    relatedConcepts: [
      "output-encoding",
      "browser-security",
      "content-security-policy",
    ],
    attackFlow: {
      title: "XSS rendering chain",
      steps: [
        {
          label: "User content",
          description:
            "A user-controlled value enters the app through a comment, profile field, message, or URL parameter.",
          tone: "blue",
        },
        {
          label: "Unsafe render",
          description:
            "The app places that content into the page without escaping it for the current HTML context.",
          tone: "amber",
        },
        {
          label: "Browser trust",
          description:
            "The browser interprets the content as page behavior instead of plain text.",
          tone: "red",
        },
        {
          label: "Safer pattern",
          description:
            "Escaping output and using defensive browser controls keeps user content as data.",
          tone: "emerald",
        },
      ],
    },
    bridges: [
      {
        type: "challenge",
        title: "Practice XSS",
        description:
          "Apply rendering and escaping concepts in a guided DarkChallenge mission.",
        difficulty: "Beginner",
        to: "/challenges/reflected-xss",
      },
      {
        type: "defend",
        title: "Review phishing and browser risk",
        description:
          "Train defensive recognition of suspicious links, browser prompts, and user-facing risk.",
        to: "/simulator",
      },
    ],

    content: {
      goal: "Understand why user-controlled content must be escaped before being displayed.",
      keyIdea: "Do not render user-controlled content as trusted HTML.",
      concept: {
        title: "What is Cross-Site Scripting?",
        text: "Cross-Site Scripting happens when user-controlled content is displayed in a page without being handled safely.",
        glossaryLinks: [
          { label: "Cross-Site Scripting", termId: "code-injection" },
          { label: "user-controlled content", termId: "code-injection" },
        ],
      },
      example: {
        title: "Simple real-world example",
        text: "A comment section that displays raw user input could accidentally treat that content as page structure instead of plain text.",
        glossaryLinks: [
          { label: "user input", termId: "code-injection" },
          { label: "page structure", termId: "http" },
        ],
      },
      steps: [
        "A user submits content.",
        "The application stores or reflects the content.",
        "The page displays the content.",
        "If the content is not escaped, the browser may interpret it incorrectly.",
        "A safer approach is to display user content as text, not trusted markup.",
      ],
      outcomes: [
        "Understand why rendering user content can be risky.",
        "Recognize markup-like input in comments or messages.",
        "Compare unsafe rendering with escaped text display.",
        "Practice safe preview behavior in a mocked UI.",
      ],
      quiz: {
        eyebrow: "Cross-Site Scripting",
        title: "Check your understanding",
        question: "What is the safer way to display user comments?",
        options: [
          "Render comments as trusted HTML",
          "Escape comments and display them as text",
          "Only allow logged-in users to comment",
        ],
        correctAnswer: "Escape comments and display them as text",
        explanation:
          "Escaping user content prevents the browser from treating it as trusted markup.",
      },
      exploit: {
        title: "User content becomes page content",
        text: "If a comment is rendered as trusted HTML, the browser may interpret markup or script-like content instead of displaying it as text.",
      },
      fix: {
        title: "Escape user content",
        text: "Display user-controlled content as text by default. Escaping converts characters like < and > into safe text so the browser does not treat them as markup.",
      },
    },

    progressItems: ["Concept", "Example", "Breakdown", "Exercise"],
    nextLessonId: "broken-auth",
  }),

  withExperience({
    id: "broken-auth",
    title: "Broken Authentication",
    category: "Identity",
    level: DIFFICULTIES.BEGINNER,
    duration: "18 min",
    status: "Available",
    featured: true,
    track: "fundamentals",
    relatedTermIds: ["sessions", "cookies", "hashing", "salting"],
    prerequisites: ["xss"],
    description: "Explore common login and session management mistakes.",
    bridges: [
      {
        type: "challenge",
        title: "Practice authentication flaws",
        description:
          "Apply session and login concepts in a guided DarkChallenge mission.",
        difficulty: "Beginner",
        to: "/challenges/authentication",
      },
      {
        type: "defend",
        title: "See account defense workflow",
        description:
          "Connect weak authentication patterns to posture checks and defensive response.",
        to: "/security-check",
      },
    ],

    content: {
      goal: "Understand how weak authentication flows can put accounts at risk.",
      keyIdea:
        "Authentication should verify identity clearly and protect sessions carefully.",
      concept: {
        title: "What is Broken Authentication?",
        text: "Broken authentication happens when login or session logic does not correctly protect user identity.",
        glossaryLinks: [
          { label: "session", termId: "sessions" },
          { label: "identity", termId: "oauth" },
        ],
      },
      example: {
        title: "Simple real-world example",
        text: "A weak session timeout or predictable reset flow can make it easier for someone to access an account they do not own.",
        glossaryLinks: [
          { label: "session", termId: "sessions" },
          { label: "account", termId: "oauth" },
        ],
      },
      steps: [
        "A user signs in.",
        "The application creates a session.",
        "The session proves who the user is.",
        "If the session is weakly protected, identity can be misused.",
        "A safer approach is to protect login, reset and session flows together.",
      ],
      outcomes: [
        "Identify risky authentication behaviors.",
        "Understand why reset links and sessions need limits.",
        "Recognize safer login error messages.",
        "Practice evaluating authentication scenarios.",
      ],
      quiz: {
        eyebrow: "Broken Authentication",
        title: "Check your understanding",
        question: "Which behavior is riskier?",
        options: [
          "Generic login error messages",
          "Password reset links that never expire",
          "Session timeout after inactivity",
        ],
        correctAnswer: "Password reset links that never expire",
        explanation:
          "Reset links should expire so they cannot be reused much later.",
      },
      exploit: {
        title: "Identity checks become weak",
        text: "Authentication flaws often appear when reset links last too long, sessions are poorly managed, or login messages reveal too much information.",
      },
      fix: {
        title: "Protect the full auth flow",
        text: "Use short-lived reset links, safe session handling, generic error messages, strong password storage, and multi-factor authentication when possible.",
      },
    },

    progressItems: ["Concept", "Example", "Breakdown", "Exercise"],
    nextLessonId: "access-control",
  }),

  withExperience({
    id: "access-control",
    title: "Broken Access Control",
    category: "Authorization",
    level: DIFFICULTIES.BEGINNER,
    duration: "20 min",
    status: "Available",
    featured: true,
    track: "fundamentals",
    relatedTermIds: ["principle-of-least-privilege", "oauth", "sessions"],
    prerequisites: ["broken-auth"],
    description: "Learn why users must only access allowed resources.",

    content: {
      goal: "Understand why permission checks must happen before accessing sensitive resources.",
      keyIdea:
        "Every sensitive action should verify what the user is allowed to do.",
      concept: {
        title: "What is Broken Access Control?",
        text: "Broken access control happens when an application does not correctly check whether a user is allowed to access a resource or action.",
        glossaryLinks: [
          {
            label: "access control",
            termId: "principle-of-least-privilege",
          },
          { label: "user", termId: "sessions" },
        ],
      },
      example: {
        title: "Simple real-world example",
        text: "Changing an account ID in a URL should not allow someone to view another user's private data.",
        glossaryLinks: [
          { label: "URL", termId: "urls" },
          {
            label: "private data",
            termId: "principle-of-least-privilege",
          },
        ],
      },
      steps: [
        "A user requests a resource.",
        "The application identifies the resource.",
        "The application checks permissions.",
        "If the permission check is missing, unauthorized access can happen.",
        "A safer approach is to verify authorization on every sensitive request.",
      ],
      outcomes: [
        "Understand the difference between authentication and authorization.",
        "Recognize when a user should not access a resource.",
        "See why hiding UI buttons is not enough.",
        "Practice checking mocked permissions.",
      ],
      quiz: {
        eyebrow: "Access Control",
        title: "Check your understanding",
        question: "Where should access control be enforced?",
        options: [
          "Only by hiding buttons",
          "In trusted authorization logic",
          "Only with CSS",
        ],
        correctAnswer: "In trusted authorization logic",
        explanation:
          "UI hiding can help UX, but real authorization must happen in trusted logic.",
      },
      exploit: {
        title: "Logged in does not mean allowed",
        text: "A user may be authenticated but still not allowed to access another user's private resource. Changing an ID in a URL should not grant access.",
      },
      fix: {
        title: "Check authorization server-side",
        text: "Every sensitive request should verify ownership, role, or permission in trusted application logic before returning private data.",
      },
    },

    progressItems: ["Concept", "Example", "Breakdown", "Exercise"],
    nextLessonId: null,
  }),

  withExperience({
    id: "command-injection",
    title: "Command Injection",
    category: "System Security",
    level: DIFFICULTIES.BEGINNER,
    duration: "15 min",
    status: "New",
    featured: false,
    track: "advanced",
    relatedTermIds: ["code-injection", "http", "urls"],
    prerequisites: ["sql-injection"],
    description:
      "Understand how unsafe command execution can let input change system behavior.",

    content: {
      goal: "Understand why user input should not be mixed directly with operating system commands.",
      keyIdea:
        "Avoid passing raw user input into system commands or shell execution.",
      concept: {
        title: "What is Command Injection?",
        text: "Command Injection happens when user input is passed into an operating system command in an unsafe way. If the input is not handled carefully, it can change what the command does.",
        glossaryLinks: [
          { label: "Command Injection", termId: "code-injection" },
          { label: "user input", termId: "code-injection" },
        ],
      },
      example: {
        title: "Simple real-world example",
        text: "Imagine a diagnostic tool that lets a user enter a hostname to ping. If the application builds a command by directly adding user input, suspicious characters could change the command behavior.",
        glossaryLinks: [
          { label: "hostname", termId: "urls" },
          { label: "user input", termId: "code-injection" },
        ],
      },
      outcomes: [
        "Understand why command execution needs strict boundaries.",
        "Recognize input that tries to add command behavior.",
        "Compare unsafe command building with safer handling.",
        "Practice identifying suspicious command input in a safe simulation.",
      ],
      steps: [
        "A user enters input into a form.",
        "The application uses that input in a system command.",
        "Unsafe input can add extra command behavior.",
        "The system may interpret more than the app intended.",
        "A safer approach validates input and avoids shell execution when possible.",
      ],
      quiz: {
        eyebrow: "Command Injection",
        title: "Check your understanding",
        question: "What makes command injection risky?",
        options: [
          "The input is displayed in a dark UI",
          "User input can change command behavior",
          "The command uses a short hostname",
        ],
        correctAnswer: "User input can change command behavior",
        explanation:
          "The risk appears when user input is treated as part of command logic instead of simple data.",
      },
      exploit: {
        title: "Input changes command behavior",
        text: "If user input is passed into a system command, command-like characters may change what the system executes in the mocked scenario.",
      },
      fix: {
        title: "Avoid shell execution with raw input",
        text: "Validate input strictly, avoid passing user values to a shell, and use safer APIs where input cannot become command logic.",
      },
    },

    progressItems: ["Concept", "Example", "Breakdown", "Exercise", "Quiz"],
    nextLessonId: null,
  }),

  withExperience({
    id: "phishing-basics",
    title: "Phishing Basics",
    category: "Security Awareness",
    level: DIFFICULTIES.BEGINNER,
    duration: "10 min",
    status: "New",
    track: "fundamentals",
    relatedTermIds: ["phishing", "social-engineering", "urls", "http", "https"],
    prerequisites: [],
    description:
      "Learn how phishing attacks trick users and how to identify suspicious messages.",

    content: {
      goal: "Understand how phishing manipulates trust, urgency, and familiar-looking links.",
      keyIdea:
        "Phishing succeeds when users trust a message before verifying its source.",
      concept: {
        title: "What is phishing?",
        text: "Phishing is a type of social engineering attack where an attacker tricks a user into revealing sensitive information or taking unsafe actions by pretending to be a trusted entity.",
        glossaryLinks: [
          { label: "phishing", termId: "phishing" },
          { label: "social engineering", termId: "social-engineering" },
        ],
      },
      example: {
        title: "Simple real-world example",
        text: "You receive an email that looks like it comes from your bank. It asks you to click a link and confirm your account details. The link looks legitimate but actually points to a fake website.",
        glossaryLinks: [
          { label: "link", termId: "urls" },
          { label: "fake website", termId: "phishing" },
        ],
      },
      outcomes: [
        "Understand how phishing manipulates trust.",
        "Recognize suspicious domains and links.",
        "Identify urgency and pressure tactics.",
        "Practice reviewing a mocked suspicious email.",
      ],
      steps: [
        "A user receives a message.",
        "The message pretends to come from a trusted source.",
        "The message creates urgency or pressure.",
        "The user is pushed toward a suspicious link or action.",
        "A safer approach is to verify the sender and use trusted routes.",
      ],
      exercise: {
        type: "phishing-identification",
        question: "Which element is suspicious in this email?",
        options: [
          "The sender domain looks slightly misspelled",
          "The email uses your real name",
          "The message contains a logo",
        ],
        answer: 0,
        explanation:
          "Attackers often use domains that look similar to legitimate ones to trick users.",
      },
      quiz: {
        eyebrow: "Phishing Basics",
        title: "Check your understanding",
        question: "What is the main goal of phishing?",
        options: [
          "Improve website performance",
          "Trick users into revealing information",
          "Encrypt user data",
        ],
        correctAnswer: "Trick users into revealing information",
        explanation:
          "Phishing tries to manipulate people into sharing sensitive information or taking unsafe actions.",
      },
      exploit: {
        title: "Trust is manipulated",
        text: "A phishing message may use urgency, familiar branding, and misleading links to push the user into acting before thinking.",
      },
      fix: {
        title: "Slow down and verify",
        text: "Check sender domains, links, unexpected requests, and urgency. When in doubt, use a known trusted route instead of clicking the message link.",
      },
    },

    progressItems: ["Concept", "Example", "Breakdown", "Exercise", "Quiz"],
  }),

  withExperience({
    id: "logging-detection-basics",
    title: "Logging & Detection Basics",
    category: "Detection",
    level: DIFFICULTIES.BEGINNER,
    duration: "12 min",
    status: "New",
    featured: false,
    track: "soc-basics",
    relatedTermIds: ["brute-force-attacks", "sessions", "http", "phishing"],
    prerequisites: ["broken-auth"],
    description:
      "Learn how logs help defenders detect suspicious activity and understand what happened.",

    content: {
      goal: "Understand how logs can support basic detection and investigation.",
      keyIdea:
        "Logs are useful when they help identify unusual behavior, patterns, and security-relevant events.",
      concept: {
        title: "What are logging and detection?",
        text: "Logging records events that happen inside systems, applications, or networks. Detection uses those events to identify suspicious behavior, such as repeated failed logins or unusual access patterns.",
        glossaryLinks: [
          {
            label: "repeated failed logins",
            termId: "brute-force-attacks",
          },
          { label: "access patterns", termId: "sessions" },
        ],
      },
      example: {
        title: "Simple real-world example",
        text: "If an admin account has many failed login attempts in a short time, a detection rule could flag it for review.",
        glossaryLinks: [
          {
            label: "admin account",
            termId: "principle-of-least-privilege",
          },
          {
            label: "failed login attempts",
            termId: "brute-force-attacks",
          },
        ],
      },
      outcomes: [
        "Understand why logs are useful for defenders.",
        "Recognize suspicious authentication patterns.",
        "Differentiate normal activity from alert-worthy events.",
        "Practice choosing which mocked event should trigger a detection.",
      ],
      steps: [
        "A system records events such as logins, requests, or errors.",
        "Security-relevant events are collected and reviewed.",
        "Detection logic looks for suspicious patterns.",
        "Analysts investigate alerts to understand context.",
        "Good logging helps explain what happened and why it matters.",
      ],
      quiz: {
        eyebrow: "Logging & Detection",
        title: "Check your understanding",
        question: "Which event is most likely to deserve investigation?",
        options: [
          "One successful login from a known device",
          "Many failed admin logins in a short time",
          "A scheduled inventory scan",
        ],
        correctAnswer: "Many failed admin logins in a short time",
        explanation:
          "Repeated failed attempts against a sensitive account can indicate password guessing or brute force behavior.",
      },
      exploit: {
        title: "Suspicious behavior hides in events",
        text: "A single log entry may look harmless, but repeated failures or sensitive account activity can reveal a pattern worth investigating.",
      },
      fix: {
        title: "Detect meaningful patterns",
        text: "Good detection focuses on context: frequency, sensitive accounts, unusual locations, and behavior that differs from normal activity.",
      },
    },

    progressItems: ["Concept", "Example", "Breakdown", "Exercise", "Quiz"],
    nextLessonId: null,
  }),

  withExperience({
    id: "oauth-basics",
    title: "OAuth Basics",
    category: "Identity",
    level: DIFFICULTIES.BEGINNER,
    duration: "14 min",
    status: "New",
    featured: false,
    track: "identity-access",
    relatedTermIds: [
      "oauth",
      "sessions",
      "cookies",
      "principle-of-least-privilege",
      "https",
    ],
    prerequisites: ["broken-auth", "access-control"],
    description:
      "Understand how OAuth lets applications request limited access without sharing passwords.",

    content: {
      goal: "Understand the basic OAuth idea and why redirect URIs and scopes matter.",
      keyIdea:
        "OAuth is about delegated authorization: granting limited access to an application without sharing your password.",
      concept: {
        title: "What is OAuth?",
        text: "OAuth is a standard that lets one application request limited access to a user's resources without asking for the user's password. It is commonly used for sign-in integrations and API access.",
        glossaryLinks: [
          { label: "OAuth", termId: "oauth" },
          {
            label: "limited access",
            termId: "principle-of-least-privilege",
          },
          { label: "password", termId: "hashing" },
        ],
      },
      example: {
        title: "Simple real-world example",
        text: "A calendar app asks permission to read your calendar events. If you approve, it receives a token with limited permissions instead of your password.",
        glossaryLinks: [
          {
            label: "permission",
            termId: "principle-of-least-privilege",
          },
          { label: "token", termId: "sessions" },
          { label: "password", termId: "hashing" },
        ],
      },
      outcomes: [
        "Understand OAuth as delegated authorization.",
        "Recognize why scopes should be limited.",
        "Identify risky redirect URI patterns.",
        "Practice reviewing a mocked consent screen.",
      ],
      steps: [
        "A user wants to connect one application to another service.",
        "The application asks for specific permissions.",
        "The user reviews and approves the request.",
        "The service redirects back to the application with an authorization result.",
        "A safer flow uses expected redirect URIs, HTTPS, and limited scopes.",
      ],
      quiz: {
        eyebrow: "OAuth Basics",
        title: "Check your understanding",
        question: "What is OAuth mainly used for?",
        options: [
          "Sharing a user's password with another app",
          "Delegating limited access to another application",
          "Encrypting every file on a server",
        ],
        correctAnswer: "Delegating limited access to another application",
        explanation:
          "OAuth allows an application to request limited access without directly handling the user's password.",
      },
      exploit: {
        title: "Consent can be too broad",
        text: "OAuth issues often appear when an app requests more permissions than needed or uses an unexpected redirect URI.",
      },
      fix: {
        title: "Limit scopes and validate redirects",
        text: "Use minimal permissions, expected redirect URIs, HTTPS, and clear consent screens so users understand what they approve.",
      },
    },

    progressItems: ["Concept", "Example", "Breakdown", "Exercise", "Quiz"],
    nextLessonId: null,
  }),

  withExperience({
    id: "password-security",
    title: "Password Security",
    category: "Authentication",
    level: DIFFICULTIES.BEGINNER,
    duration: "12 min",
    status: "New",
    track: "identity-access",
    relatedTermIds: ["hashing", "salting", "sessions", "cookies"],
    prerequisites: ["broken-auth"],
    description:
      "Learn how passwords should be stored securely and why hashing and salting matter.",

    content: {
      goal: "Understand why passwords should never be stored in plain text.",
      keyIdea:
        "Passwords must be transformed into hashes and protected with salting.",
      concept: {
        title: "Why password storage matters",
        text: "Storing passwords in plain text is dangerous because anyone who accesses the database can read them. Instead, applications use hashing and salting to protect user credentials.",
        glossaryLinks: [
          { label: "hashing", termId: "hashing" },
          { label: "salting", termId: "salting" },
        ],
      },
      example: {
        title: "Simple real-world example",
        text: "If two users choose the same password, hashing alone produces the same result. Salting makes each stored password unique.",
        glossaryLinks: [{ label: "password", termId: "hashing" }],
      },
      outcomes: [
        "Understand why plain text storage is dangerous",
        "Learn what hashing does",
        "Understand the purpose of salting",
        "Compare safe vs unsafe storage patterns",
      ],
      steps: [
        "User creates a password",
        "Application transforms it using a hashing function",
        "A unique salt is added",
        "The result is stored instead of the original password",
        "During login, the same process is applied and compared",
      ],
      quiz: {
        eyebrow: "Password Security",
        title: "Check your understanding",
        question: "Why is salting important?",
        options: [
          "It makes passwords shorter",
          "It prevents identical hashes for identical passwords",
          "It encrypts the database",
        ],
        correctAnswer: "It prevents identical hashes for identical passwords",
        explanation:
          "Salting ensures that even if users share the same password, their stored values differ.",
      },
      exploit: {
        title: "Stored passwords can leak",
        text: "If passwords are stored in plain text or weakly protected, a database leak can expose user credentials directly.",
      },
      fix: {
        title: "Hash and salt passwords",
        text: "Store password hashes instead of raw passwords, and use unique salts with a slow password hashing algorithm to reduce risk.",
      },
    },

    progressItems: ["Concept", "Example", "Breakdown", "Exercise", "Quiz"],
  }),
];

export function getLessonById(id) {
  return lessons.find((lesson) => lesson.id === id);
}

export function getNextLesson(currentLesson) {
  if (!currentLesson?.nextLessonId) return null;
  return getLessonById(currentLesson.nextLessonId);
}
