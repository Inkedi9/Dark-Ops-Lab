export const assistantTips = {
  "sql-injection": {
    title: "Need help with SQL Injection?",
    prompts: [
      {
        label: "Explain it simply",
        answer:
          "SQL Injection is when user input changes the meaning of a database query. The key idea is simple: user input should be treated as data, never as query logic.",
      },
      {
        label: "What should I remember?",
        answer:
          "Remember this: never build SQL queries by directly mixing strings and user input. Use parameterized queries instead.",
      },
      {
        label: "Beginner mistake",
        answer:
          "A common mistake is thinking validation alone is enough. Validation helps, but the safer foundation is separating input from query logic.",
      },
    ],
  },

  xss: {
    title: "Need help with XSS?",
    prompts: [
      {
        label: "Explain it simply",
        answer:
          "XSS happens when user-controlled content is displayed as trusted page content. A safer app shows user input as text, not as executable markup.",
      },
      {
        label: "What should I remember?",
        answer:
          "Escape user content before rendering it. Do not trust comments, names, messages or profile fields as safe HTML.",
      },
      {
        label: "Beginner mistake",
        answer:
          "A common mistake is thinking logged-in users are safe. Any user input can become dangerous if rendered incorrectly.",
      },
    ],
  },

  "broken-auth": {
    title: "Need help with Authentication?",
    prompts: [
      {
        label: "Explain it simply",
        answer:
          "Authentication proves who the user is. Broken authentication happens when login, reset or session logic does not protect identity correctly.",
      },
      {
        label: "What should I remember?",
        answer:
          "Sessions, password resets and login errors all matter. Authentication is not just the login form.",
      },
      {
        label: "Beginner mistake",
        answer:
          "A common mistake is revealing too much in login errors, like saying whether an email exists.",
      },
    ],
  },

  "access-control": {
    title: "Need help with Access Control?",
    prompts: [
      {
        label: "Explain it simply",
        answer:
          "Access control checks what a user is allowed to do. Being logged in does not mean the user can access everything.",
      },
      {
        label: "What should I remember?",
        answer:
          "Authorization checks must happen in trusted application logic, not only by hiding buttons in the UI.",
      },
      {
        label: "Beginner mistake",
        answer:
          "A common mistake is assuming that if a link is hidden, the resource is protected. The server-side logic still needs to check permissions.",
      },
    ],
  },

  "phishing-basics": {
    title: "Need help with Phishing?",
    prompts: [
      {
        label: "Explain it simply",
        answer:
          "Phishing is when someone pretends to be trusted to trick you into revealing information or taking an unsafe action.",
      },
      {
        label: "What should I remember?",
        answer:
          "Look for urgency, strange sender domains, unexpected links, and requests for sensitive information.",
      },
      {
        label: "Beginner mistake",
        answer:
          "A common mistake is trusting a message because it has a familiar logo. Logos can be copied.",
      },
    ],
  },

  "command-injection": {
    title: "Need help with Command Injection?",
    prompts: [
      {
        label: "Explain it simply",
        answer:
          "Command injection happens when user input is allowed to change an operating system command.",
      },
      {
        label: "What should I remember?",
        answer:
          "User input should be treated as data. Avoid mixing it directly with command execution logic.",
      },
      {
        label: "Beginner mistake",
        answer:
          "A common mistake is validating only normal-looking input but still passing raw values to a shell.",
      },
    ],
  },

  "logging-detection-basics": {
    title: "Need help with Logging & Detection?",
    prompts: [
      {
        label: "Explain it simply",
        answer:
          "Logging records what happened. Detection looks at those records to find behavior that might be suspicious.",
      },
      {
        label: "What should I remember?",
        answer:
          "A single event is not always enough. Look for context, frequency, sensitive accounts, and unusual patterns.",
      },
      {
        label: "Beginner mistake",
        answer:
          "A common mistake is treating every log as an alert. Good detection focuses on meaningful patterns, not noise.",
      },
    ],
  },

  "oauth-basics": {
    title: "Need help with OAuth?",
    prompts: [
      {
        label: "Explain it simply",
        answer:
          "OAuth lets one application request limited access to something you own without asking for your password.",
      },
      {
        label: "What should I remember?",
        answer:
          "Check what permissions are requested and where the app redirects after approval. Limited scopes and expected redirect URIs matter.",
      },
      {
        label: "Beginner mistake",
        answer:
          "A common mistake is thinking OAuth is just login. It is mainly about delegated authorization.",
      },
    ],
  },

  "password-security": {
    title: "Need help with Password Security?",
    prompts: [
      {
        label: "Explain it simply",
        answer:
          "Passwords should never be stored directly. They are transformed into hashes so they cannot be easily read.",
      },
      {
        label: "What should I remember?",
        answer:
          "Hashing protects passwords. Salting makes them unique even if two users choose the same password.",
      },
      {
        label: "Beginner mistake",
        answer:
          "A common mistake is thinking hashing alone is enough. Without salting, attackers can still exploit patterns.",
      },
    ],
  },
};
