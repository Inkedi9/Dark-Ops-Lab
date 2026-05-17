import { securityCheckQuestions } from "@/data/securityCheckQuestions";

const PHISHING_RESULTS_KEY = "phishscope-results";
const SOC_INCIDENTS_KEY = "darkdefend-incidents";
const SECURITY_CHECK_KEY = "darkdefend-security-check";

export function safeJson(key, fallback) {
  try {
    if (typeof localStorage === "undefined") return fallback;

    const stored = localStorage.getItem(key);
    if (!stored) return fallback;

    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

export function getPhishingResults() {
  const results = safeJson(PHISHING_RESULTS_KEY, []);
  return Array.isArray(results) ? results : [];
}

export function getSocIncidents() {
  const incidents = safeJson(SOC_INCIDENTS_KEY, []);
  return Array.isArray(incidents) ? incidents : [];
}

export function getSecurityCheckAnswers() {
  const answers = safeJson(SECURITY_CHECK_KEY, {});
  return answers && typeof answers === "object" && !Array.isArray(answers)
    ? answers
    : {};
}

export function buildDefenseProfile() {
  const phishingResults = getPhishingResults();
  const socIncidents = getSocIncidents();
  const securityAnswers = getSecurityCheckAnswers();

  const phishing = buildPhishingProfile(phishingResults);
  const soc = buildSocProfile(socIncidents);
  const securityCheck = buildSecurityCheckProfile(securityAnswers);
  const socDiscipline = clamp(
    100 - Math.min(60, soc.highSeverity * 10) + Math.min(20, soc.escalated * 5),
    0,
    100
  );
  const score = Math.round(
    phishing.accuracy * 0.45 + securityCheck.percent * 0.35 + socDiscipline * 0.2
  );
  const level = getOverallLevel(score);

  return {
    phishing,
    soc,
    securityCheck,
    overall: {
      score,
      level,
      label: level,
      recommendations: buildRecommendations({
        phishing,
        soc,
        securityCheck,
      }),
    },
  };
}

function buildPhishingProfile(results) {
  const total = results.length;
  const correct = results.filter((result) => result.isCorrect).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const falsePositives = results.filter(
    (result) =>
      result.expectedType === "legitimate" &&
      ["phishing", "suspicious"].includes(result.verdict)
  ).length;
  const falseNegatives = results.filter(
    (result) =>
      result.expectedType === "phishing" &&
      ["legitimate", "suspicious"].includes(result.verdict)
  ).length;
  const socEscalations = results.filter(
    (result) => result.escalatedToSoc || result.incidentId
  ).length;
  const highConfidence = results.filter(
    (result) => result.confidence === "high"
  ).length;
  const reasonedDecisions = results.filter((result) =>
    Boolean(result.analystReasoning?.trim())
  ).length;
  const weakCategories = getWeakPhishingCategories(results);

  return {
    total,
    correct,
    accuracy,
    falsePositives,
    falseNegatives,
    socEscalations,
    highConfidence,
    reasonedDecisions,
    weakCategories,
  };
}

function buildSocProfile(incidents) {
  const highSeverity = incidents.filter(
    (incident) =>
      incident.severity === "Critical" ||
      incident.severity === "High" ||
      incident.riskLevel === "Critical" ||
      incident.riskLevel === "High"
  ).length;
  const generated = incidents.filter((incident) => !incident.forced).length;
  const escalated = incidents.filter((incident) => incident.forced).length;
  const open = incidents.filter((incident) => incident.status !== "closed").length;

  return {
    incidents: incidents.length,
    highSeverity,
    generated,
    escalated,
    open,
  };
}

function buildSecurityCheckProfile(answers) {
  const answerEntries = securityCheckQuestions
    .map((question) => ({
      question,
      answer: answers[question.id],
    }))
    .filter((item) => item.answer);
  const answered = answerEntries.length;
  const score = answerEntries.reduce(
    (total, item) => total + (Number(item.answer.score) || 0),
    0
  );
  const maxScore = securityCheckQuestions.length * 2;
  const percent = maxScore ? Math.round((score / maxScore) * 100) : 0;
  const weakAreas = answerEntries
    .filter((item) => (Number(item.answer.score) || 0) < 2)
    .map((item) => ({
      id: item.question.id,
      category: item.question.category,
      question: item.question.question,
      score: Number(item.answer.score) || 0,
      risk: item.answer.risk || "Unknown",
      recommendation:
        item.answer.recommendation || item.question.answers?.[0]?.recommendation || "",
    }));

  return {
    answered,
    score,
    percent,
    weakAreas,
  };
}

function getWeakPhishingCategories(results) {
  const counts = results.reduce((acc, result) => {
    const category = result.riskLevel || result.technique || result.expectedType || "General";
    const current = acc[category] || { total: 0, missed: 0 };

    acc[category] = {
      total: current.total + 1,
      missed: current.missed + (result.isCorrect ? 0 : 1),
    };

    return acc;
  }, {});

  return Object.entries(counts)
    .map(([category, data]) => ({
      category,
      total: data.total,
      missed: data.missed,
      missRate: data.total ? Math.round((data.missed / data.total) * 100) : 0,
    }))
    .filter((item) => item.missed > 0)
    .sort((a, b) => b.missRate - a.missRate || b.missed - a.missed)
    .map((item) => item.category);
}

function buildRecommendations({ phishing, soc, securityCheck }) {
  const recommendations = [];

  if (phishing.falseNegatives > 0) {
    recommendations.push(
      "Practice phishing detection with emphasis on missed malicious emails and suspicious login prompts."
    );
  }

  if (phishing.falsePositives > 0) {
    recommendations.push(
      "Review legitimate security and business emails to reduce false positives while preserving caution."
    );
  }

  if (soc.highSeverity > 0) {
    recommendations.push(
      "Prioritize high-severity SOC incidents and document containment steps before closing cases."
    );
  }

  if (securityCheck.weakAreas.length > 0) {
    const categories = [...new Set(securityCheck.weakAreas.map((area) => area.category))]
      .slice(0, 3)
      .join(", ");

    recommendations.push(
      `Harden security check weak areas first: ${categories}.`
    );
  }

  if (phishing.accuracy < 70) {
    recommendations.push(
      "Repeat the phishing simulator until classification accuracy is consistently above 70%."
    );
  }

  if (recommendations.length < 3) {
    recommendations.push(
      "Maintain MFA coverage, unique passwords, and regular connected-app reviews."
    );
  }

  if (recommendations.length < 3) {
    recommendations.push(
      "Keep using SOC mode to practice structured triage, evidence capture, and escalation decisions."
    );
  }

  return recommendations.slice(0, 5);
}

function getOverallLevel(score) {
  if (score >= 85) return "Resilient Defender";
  if (score >= 70) return "Developing Analyst";
  if (score >= 50) return "At-Risk Operator";
  return "High-Risk User";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
