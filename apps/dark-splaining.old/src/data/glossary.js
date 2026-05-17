const baseGlossaryTerms = [
  {
    id: "botnets",
    title: "Botnets",
    shortDescription:
      "Networks of compromised devices controlled remotely by an attacker.",
    description:
      "A botnet is a group of infected devices controlled remotely. These devices can include computers, servers, phones, or IoT objects. Botnets are often used to send spam, overload websites, spread malware, or perform coordinated attacks. The device owner usually does not know their system is part of the botnet.",
  },
  {
    id: "brute-force-attacks",
    title: "Brute Force Attacks",
    shortDescription:
      "Attempts to guess credentials by trying many possible combinations.",
    description:
      "A brute force attack tries many possible passwords, tokens, or keys until one works. It is simple but can be effective when passwords are weak or protections are missing. Safer systems use strong passwords, rate limiting, account lockouts, monitoring, and multi-factor authentication.",
  },
  {
    id: "clean-urls",
    title: "Clean URLs",
    shortDescription:
      "Readable URLs that avoid unnecessary parameters or technical noise.",
    description:
      "Clean URLs are human-readable web addresses that clearly describe the resource being accessed. For example, /lessons/sql-injection is easier to understand than /page?id=42. They improve readability and user experience, but they still need proper access control.",
  },
  {
    id: "code-injection",
    title: "Code Injection",
    shortDescription:
      "A weakness where unsafe input changes how code is interpreted.",
    description:
      "Code injection happens when untrusted input is treated as executable code or commands. This can happen when applications mix user input with code logic. Safer design separates data from execution and validates input carefully.",
    relatedTermIds: ["sql", "dml", "command-injection"],
  },
  {
    id: "content-management-systems",
    title: "Content Management Systems",
    shortDescription:
      "Platforms used to create, edit, and publish website content.",
    description:
      "A Content Management System, or CMS, helps people manage website content without writing every page manually. Examples include platforms for blogs, stores, or company websites. Security depends on updates, plugins, permissions, configuration, and user account hygiene.",
  },
  {
    id: "cookies",
    title: "Cookies",
    shortDescription:
      "Small pieces of data stored by the browser for a website.",
    description:
      "Cookies are small values stored in the browser and sent back to a website on later requests. They are often used for sessions, preferences, and tracking. Security flags such as HttpOnly, Secure, and SameSite help reduce common risks.",
    relatedTermIds: ["sessions", "http", "https"],
  },
  {
    id: "ddl",
    title: "DDL",
    shortDescription:
      "Database language used to define or change database structure.",
    description:
      "DDL means Data Definition Language. It is used to create, modify, or delete database structures such as tables and schemas. Common examples include CREATE, ALTER, and DROP. It changes the shape of the database, not just the data inside it.",
  },
  {
    id: "defense-in-depth",
    title: "Defense in Depth",
    shortDescription:
      "A security approach using multiple layers of protection.",
    description:
      "Defense in depth means using several security layers instead of relying on one control. If one layer fails, another can still reduce the risk. Examples include input validation, authentication, authorization, logging, monitoring, backups, and network controls.",
  },
  {
    id: "denial-of-service-attacks",
    title: "Denial of Service Attacks",
    shortDescription:
      "Attempts to make a service unavailable to legitimate users.",
    description:
      "A denial of service attack tries to overload or disrupt a system so normal users cannot access it. This can involve too many requests, resource exhaustion, or abuse of application behavior. Defenses include rate limiting, traffic filtering, caching, and monitoring.",
  },
  {
    id: "dictionary-attacks",
    title: "Dictionary Attacks",
    shortDescription:
      "Password guessing using lists of common words or known passwords.",
    description:
      "A dictionary attack uses prepared wordlists instead of trying every possible combination. It often includes common passwords, names, dates, and leaked credentials. Strong unique passwords, password managers, MFA, and rate limiting help reduce this risk.",
  },
  {
    id: "digital-signatures",
    title: "Digital Signatures",
    shortDescription:
      "Cryptographic proof that data came from a trusted signer.",
    description:
      "A digital signature helps verify that data was created by a specific signer and was not changed. It uses cryptography to provide authenticity and integrity. Digital signatures are used in software updates, documents, certificates, and secure communication.",
  },
  {
    id: "dml",
    title: "DML",
    shortDescription: "Database language used to read or modify stored data.",
    description:
      "DML means Data Manipulation Language. It is used to work with data inside database tables. Common examples include SELECT, INSERT, UPDATE, and DELETE. DML changes or retrieves records, while DDL changes the database structure.",
  },
  {
    id: "hashing",
    title: "Hashing",
    shortDescription:
      "Turning data into a fixed-size value that is hard to reverse.",
    description:
      "Hashing transforms input data into a fixed-size output called a hash. It is commonly used to verify integrity or store password representations safely. Good password storage also uses salting and slow password hashing algorithms.",
  },
  {
    id: "http",
    title: "HTTP",
    shortDescription:
      "The basic protocol browsers and servers use to exchange web data.",
    description:
      "HTTP means HyperText Transfer Protocol. It defines how browsers and servers send requests and responses. By itself, HTTP is not encrypted, which means data may be visible to others on the network.",
  },
  {
    id: "https",
    title: "HTTPS",
    shortDescription:
      "HTTP protected with encryption and server identity verification.",
    description:
      "HTTPS is HTTP secured with TLS. It encrypts data between the browser and server and helps verify the website identity. It protects against many network-level risks, but it does not automatically fix application security issues.",
  },
  {
    id: "ldap",
    title: "LDAP",
    shortDescription:
      "A protocol used to access directory services and identity data.",
    description:
      "LDAP means Lightweight Directory Access Protocol. It is often used to query users, groups, and organizational information from a directory. It appears in identity systems and enterprise environments, where access control and safe queries matter.",
  },
  {
    id: "netmasks",
    title: "Netmasks",
    shortDescription:
      "Values that define which part of an IP address belongs to a network.",
    description:
      "A netmask helps separate the network part and host part of an IP address. It is used in networking to understand which devices are in the same network range. Netmasks are important for routing, segmentation, and access rules.",
  },
  {
    id: "oauth",
    title: "OAuth",
    shortDescription:
      "A standard for delegated authorization between applications.",
    description:
      "OAuth allows one application to access limited resources on behalf of a user without sharing the user's password. It is commonly used for sign-in integrations and API access. Correct configuration is important to avoid token and redirect issues.",
  },
  {
    id: "owasp",
    title: "OWASP",
    shortDescription:
      "A community that publishes widely used web security guidance.",
    description:
      "OWASP is the Open Worldwide Application Security Project. It provides free resources, tools, and guidance for application security. The OWASP Top 10 is one of the most popular lists of common web application security risks.",
  },
  {
    id: "password-lists",
    title: "Password Lists",
    shortDescription:
      "Collections of known or common passwords used for testing or abuse.",
    description:
      "Password lists contain common, leaked, or guessed passwords. They can be used by defenders to test password strength, but also by attackers in guessing attempts. Strong password policies and MFA reduce the usefulness of these lists.",
  },
  {
    id: "phishing",
    title: "Phishing",
    shortDescription:
      "Tricking people into revealing information or taking unsafe actions.",
    description:
      "Phishing uses fake messages, websites, or requests to manipulate people. The goal may be to steal passwords, payment data, or convince someone to install malware. Awareness, verification habits, MFA, and email protections help reduce the risk.",
  },
  {
    id: "principle-of-least-privilege",
    title: "Principle of Least Privilege",
    shortDescription:
      "Giving users and systems only the access they truly need.",
    description:
      "The principle of least privilege means every user, service, or system should have the minimum permissions required to do its job. This limits damage if an account or component is misused. It is a core idea in access control.",
  },
  {
    id: "randomness",
    title: "Randomness",
    shortDescription:
      "Unpredictability used to make tokens, secrets, and keys safer.",
    description:
      "Randomness is important when generating secrets such as tokens, session IDs, and cryptographic keys. Predictable values are easier to guess. Security-sensitive randomness should use reliable cryptographic random generators.",
  },
  {
    id: "releases",
    title: "Releases",
    shortDescription:
      "Published versions of software delivered to users or systems.",
    description:
      "A release is a version of software made available for use. Secure releases involve testing, review, dependency updates, and sometimes rollback plans. Good release practices reduce the chance of shipping bugs or security issues.",
  },
  {
    id: "rest",
    title: "REST",
    shortDescription: "A common style for designing web APIs around resources.",
    description:
      "REST is an architectural style often used for web APIs. It organizes operations around resources and standard HTTP methods such as GET, POST, PUT, and DELETE. REST APIs still require authentication, authorization, validation, and rate limiting.",
  },
  {
    id: "salting",
    title: "Salting",
    shortDescription: "Adding unique random data before hashing passwords.",
    description:
      "Salting means adding a unique random value to each password before hashing it. This helps prevent attackers from using precomputed tables against many users at once. Salting is usually combined with slow password hashing algorithms.",
  },
  {
    id: "sessions",
    title: "Sessions",
    shortDescription:
      "A way for applications to remember a user across requests.",
    description:
      "Sessions allow an application to keep track of a logged-in user between requests. A session often relies on a token or cookie. Secure sessions need protection against theft, fixation, long lifetimes, and unsafe cookie settings.",
    relatedTermIds: ["cookies", "oauth", "https"],
  },
  {
    id: "social-engineering",
    title: "Social Engineering",
    shortDescription:
      "Manipulating people instead of attacking technology directly.",
    description:
      "Social engineering uses trust, pressure, fear, or curiosity to influence people into unsafe actions. It can happen through email, phone calls, messages, or in-person interactions. Good training and verification habits are important defenses.",
  },
  {
    id: "sql",
    title: "SQL",
    shortDescription:
      "A language used to query and manage relational databases.",
    description:
      "SQL means Structured Query Language. It is used to read, insert, update, and delete data in relational databases. Since SQL queries often use user input, applications must handle that input safely.",
    relatedTermIds: ["dml", "ddl", "code-injection"],
  },
  {
    id: "urls",
    title: "URLs",
    shortDescription: "Addresses used to locate resources on the web.",
    description:
      "A URL identifies where a resource is located and how to access it. It can include a protocol, domain, path, query parameters, and fragments. URLs should not be trusted as proof of authorization by themselves.",
  },
  {
    id: "worms",
    title: "Worms",
    shortDescription: "Malware that can spread automatically between systems.",
    description:
      "A worm is malware designed to spread from one system to another, often without direct user action. Worms may abuse weak configurations, missing updates, or network exposure. Patching and segmentation help reduce their spread.",
  },
  {
    id: "zero-day-exploits",
    title: "Zero-Day Exploits",
    shortDescription:
      "Exploits for vulnerabilities that are not yet publicly fixed.",
    description:
      "A zero-day exploit targets a vulnerability before a fix is widely available. This makes it harder for defenders because normal patching may not yet be possible. Monitoring, defense in depth, and rapid response help reduce impact.",
  },
];

const glossaryEnhancements = {
  "code-injection": {
    category: "Web Security",
    level: "Intermediate",
    whyItMatters:
      "Code injection breaks the boundary between user data and application behavior, which can lead to data exposure, account takeover, or remote actions.",
    attackerUse:
      "Attackers look for inputs that are passed into interpreters, queries, templates, or commands and try payloads that change execution.",
    defenderTip:
      "Separate data from execution, prefer safe APIs, validate input, and log suspicious payload patterns.",
    commonMistakes: [
      "Filtering only a few dangerous characters.",
      "Trusting frontend validation as the main defense.",
      "Building queries or commands with string concatenation.",
    ],
    relatedLessons: ["sql-injection", "command-injection"],
    relatedTracks: ["injection", "web-security"],
    relatedCommands: ["linux-search", "powershell-files"],
  },
  cookies: {
    category: "Identity & Access",
    level: "Beginner",
    relatedLessons: ["broken-auth"],
    relatedTracks: ["identity-access"],
  },
  hashing: {
    category: "Secure Coding",
    level: "Beginner",
    relatedLessons: ["broken-auth"],
    relatedTracks: ["identity-access"],
  },
  http: {
    category: "Web Security",
    level: "Beginner",
    relatedLessons: ["sql-injection", "xss"],
    relatedTracks: ["web-security", "fundamentals"],
    relatedCommands: ["linux-networking", "powershell-networking"],
  },
  https: {
    category: "Web Security",
    level: "Beginner",
    relatedTracks: ["web-security"],
    relatedCommands: ["linux-networking", "powershell-networking"],
  },
  oauth: {
    category: "Identity & Access",
    level: "Intermediate",
    whyItMatters:
      "OAuth is common in modern SaaS and identity flows. Misconfigured scopes, redirects, or app consent can create account and data exposure risks.",
    attackerUse:
      "Attackers may abuse consent prompts, malicious OAuth apps, weak redirect validation, or stolen tokens to gain delegated access.",
    defenderTip:
      "Review app consent, restrict risky scopes, monitor new grants, and prefer least-privilege integrations.",
    commonMistakes: [
      "Treating OAuth as authentication without validating identity correctly.",
      "Allowing broad scopes by default.",
      "Ignoring suspicious third-party application consent.",
    ],
    relatedLessons: ["oauth-basics", "broken-auth"],
    relatedTracks: ["identity-access"],
  },
  phishing: {
    category: "SOC / Detection",
    level: "Beginner",
    whyItMatters:
      "Phishing targets human decision-making and is often the entry point for credential theft, malware delivery, and business email compromise.",
    attackerUse:
      "Attackers use urgency, impersonation, fake login pages, attachments, and trusted brands to push users into unsafe actions.",
    defenderTip:
      "Verify sender context, inspect links carefully, report suspicious messages, and use phishing-resistant MFA where possible.",
    commonMistakes: [
      "Trusting display names instead of sender details.",
      "Clicking before checking the destination.",
      "Assuming a message is safe because it mentions a known service.",
    ],
    relatedLessons: ["phishing-basics"],
    relatedTracks: ["fundamentals", "soc-basics"],
  },
  "principle-of-least-privilege": {
    category: "Identity & Access",
    level: "Beginner",
    relatedLessons: ["access-control"],
    relatedTracks: ["identity-access", "access-control"],
  },
  sessions: {
    category: "Identity & Access",
    level: "Beginner",
    relatedLessons: ["broken-auth"],
    relatedTracks: ["identity-access"],
  },
  sql: {
    category: "Web Security",
    level: "Beginner",
    whyItMatters:
      "SQL sits directly in front of application data. Unsafe query construction can expose or alter sensitive records.",
    attackerUse:
      "Attackers test form fields, URL parameters, and API inputs for values that change query logic or reveal database errors.",
    defenderTip:
      "Use prepared statements, least-privilege database users, and monitoring for suspicious database errors or query patterns.",
    commonMistakes: [
      "Concatenating user input into SQL strings.",
      "Relying on escaping instead of parameterized queries.",
      "Giving the application database user more privileges than needed.",
    ],
    relatedLessons: ["sql-injection"],
    relatedTracks: ["web-security", "injection"],
    relatedCommands: ["linux-search", "powershell-files"],
  },
  "social-engineering": {
    category: "SOC / Detection",
    level: "Beginner",
    relatedLessons: ["phishing-basics"],
    relatedTracks: ["fundamentals"],
  },
};

function inferCategory(term) {
  const id = term.id;

  if (["oauth", "sessions", "cookies", "ldap", "principle-of-least-privilege"].includes(id)) {
    return "Identity & Access";
  }

  if (["phishing", "social-engineering", "botnets", "worms", "zero-day-exploits"].includes(id)) {
    return "SOC / Detection";
  }

  if (["hashing", "salting", "randomness", "releases", "digital-signatures"].includes(id)) {
    return "Secure Coding";
  }

  if (["ip-address", "netmasks"].includes(id)) {
    return "Command Basics";
  }

  return "Web Security";
}

function defaultWhyItMatters(term) {
  return `${term.title} matters because it gives you a clearer mental model for how systems behave, where trust boundaries sit, and what defenders need to verify.`;
}

function defaultAttackerUse(term) {
  return `Attackers may abuse weak understanding or unsafe handling of ${term.title.toLowerCase()} to create confusion, bypass controls, or hide suspicious behavior.`;
}

function defaultDefenderTip(term) {
  return `When you see ${term.title.toLowerCase()} in a system, ask what should be trusted, what should be logged, and what failure mode would be safest.`;
}

export const glossaryTerms = baseGlossaryTerms.map((term) => {
  const enhancement = glossaryEnhancements[term.id] || {};
  const relatedConcepts = enhancement.relatedConcepts || term.relatedTermIds || [];

  return {
    ...term,
    term: term.term || term.title,
    category: enhancement.category || term.category || inferCategory(term),
    level: enhancement.level || term.level || "Beginner",
    definition: term.definition || term.description,
    whyItMatters: enhancement.whyItMatters || term.whyItMatters || defaultWhyItMatters(term),
    attackerUse: enhancement.attackerUse || term.attackerUse || defaultAttackerUse(term),
    defenderTip: enhancement.defenderTip || term.defenderTip || defaultDefenderTip(term),
    commonMistakes: enhancement.commonMistakes || term.commonMistakes || [
      "Memorizing the term without connecting it to a real system behavior.",
      "Assuming the concept is automatically safe because it is common.",
    ],
    relatedLessons: enhancement.relatedLessons || term.relatedLessons || [],
    relatedTracks: enhancement.relatedTracks || term.relatedTracks || [],
    relatedCommands: enhancement.relatedCommands || term.relatedCommands || [],
    relatedConcepts,
  };
});

export function getGlossaryTermById(termId) {
  return glossaryTerms.find((term) => term.id === termId);
}
