import {
  LEARNING_STANDARDS,
  SECURITY_PILLARS,
  SECURITY_DOMAINS,
  LAB_TYPES,
} from "./learningModel";

export const lessonExperience = {
  "sql-injection": {
    domain: SECURITY_DOMAINS.INJECTION,
    standard: LEARNING_STANDARDS.OWASP_TOP_10,
    owaspId: "A03",
    pillar: SECURITY_PILLARS.WEB_SECURITY,
    labType: LAB_TYPES.SANDBOX,
    skills: ["SQL Injection", "Input validation", "Parameterized queries"],
  },

  xss: {
    domain: SECURITY_DOMAINS.CLIENT_SIDE,
    standard: LEARNING_STANDARDS.OWASP_TOP_10,
    owaspId: "A03",
    pillar: SECURITY_PILLARS.WEB_SECURITY,
    labType: LAB_TYPES.SANDBOX,
    skills: ["Cross-Site Scripting", "Escaping", "Unsafe rendering"],
  },

  "broken-auth": {
    domain: SECURITY_DOMAINS.AUTHENTICATION,
    standard: LEARNING_STANDARDS.OWASP_TOP_10,
    owaspId: "A07",
    pillar: SECURITY_PILLARS.IDENTITY,
    labType: LAB_TYPES.SCENARIO,
    skills: ["Authentication", "Sessions", "Password reset flows"],
  },

  "access-control": {
    domain: SECURITY_DOMAINS.ACCESS_CONTROL,
    standard: LEARNING_STANDARDS.OWASP_TOP_10,
    owaspId: "A01",
    pillar: SECURITY_PILLARS.AUTHORIZATION,
    labType: LAB_TYPES.SANDBOX,
    skills: ["Authorization", "Object access", "Permission checks"],
  },

  "command-injection": {
    domain: SECURITY_DOMAINS.INJECTION,
    standard: LEARNING_STANDARDS.OWASP_TOP_10,
    owaspId: "A03",
    pillar: SECURITY_PILLARS.SYSTEM_SECURITY,
    labType: LAB_TYPES.SANDBOX,
    skills: ["Command Injection", "Input validation", "Shell boundaries"],
  },

  "phishing-basics": {
    domain: SECURITY_DOMAINS.SECURITY_AWARENESS,
    standard: LEARNING_STANDARDS.HUMAN_RISK,
    owaspId: null,
    pillar: SECURITY_PILLARS.AWARENESS,
    labType: LAB_TYPES.SCENARIO,
    skills: ["Phishing detection", "URL inspection", "Social engineering"],
  },

  "logging-detection-basics": {
    domain: SECURITY_DOMAINS.LOGGING_DETECTION,
    standard: LEARNING_STANDARDS.DEFENSIVE_SECURITY,
    owaspId: "A09",
    pillar: SECURITY_PILLARS.SOC_BASICS,
    labType: LAB_TYPES.INVESTIGATION,
    skills: ["Logs", "Detection logic", "Suspicious activity"],
  },

  "oauth-basics": {
    domain: SECURITY_DOMAINS.IDENTITY_ACCESS,
    standard: LEARNING_STANDARDS.OWASP_TOP_10,
    owaspId: "A07",
    pillar: SECURITY_PILLARS.IDENTITY,
    labType: LAB_TYPES.REVIEW,
    skills: ["OAuth", "Scopes", "Redirect URIs"],
  },

  "password-security": {
    domain: SECURITY_DOMAINS.AUTHENTICATION,
    standard: LEARNING_STANDARDS.OWASP_TOP_10,
    owaspId: "A07",
    pillar: SECURITY_PILLARS.IDENTITY,
    labType: LAB_TYPES.COMPARISON,
    skills: ["Hashing", "Salting", "Password storage"],
  },
};
