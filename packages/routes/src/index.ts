export const darkRoutes = {
  nexus: {
    home: "/",
  },
  splaining: {
    home: "/",
    tracks: "/tracks",
    lessons: "/lessons",
    lesson: (id: string) => `/lessons/${id}`,
    commandBasics: "/command-basics",
    resources: "/resources",
    concept: (id: string) => `/concepts/${id}`,
  },
  challenges: {
    home: "/",
    missions: "/challenges",
    mission: (slug: string) => `/challenges/${slug}`,
    warzone: "/warzone",
    warzoneMission: (slug: string) => `/warzone/${slug}`,
  },
  defend: {
    home: "/",
    simulator: "/simulator",
    soc: "/soc",
    socAlerts: "/soc/alerts",
    socReports: "/soc/reports",
    securityCheck: "/security-check",
    defenseProfile: "/defense-profile",
  },
};

export const bridgeTargets = {
  sqlInjection: {
    splainingLesson: "sql-injection",
    challengeMission: "sql-injection-login",
  },
  reflectedXss: {
    splainingLesson: "reflected-xss",
    challengeMission: "reflected-xss",
  },
  storedXss: {
    splainingLesson: "stored-xss",
    challengeMission: "stored-xss",
  },
  authBypass: {
    splainingLesson: "auth-bypass",
    challengeMission: "auth-bypass-token",
  },
};
