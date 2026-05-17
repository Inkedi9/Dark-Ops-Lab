import {
  addGlobalXp,
  awardGlobalBadge,
  getGlobalLevel,
  getGlobalProfile,
  getGlobalRank,
  saveGlobalProfile,
} from "@dark/profile/profileService";
import { recordPhishingAnalyzed } from "@/defend/lib/defend/defendProgressEvents";

const MODULE_ID = "darkdefend:phishing-simulator";

const DEFEND_BADGES = {
  FIRST_ANALYSIS: "defend_first_analysis",
  PERFECT_ANALYSIS: "defend_perfect_analysis",
  PHISHING_PATH_COMPLETE: "defend_phishing_path_complete",
  ANALYST_CORRECT: "defend_analyst_correct",
  STREAK_THREE: "defend_streak_3",
};

function scenarioCompletionId(scenarioId) {
  return `${MODULE_ID}:scenario-${scenarioId}`;
}

function calculateDefendXp(result, mode = "beginner", streak = 0) {
  const verdictBonus = result.isCorrect ? 15 : 5;
  const flagBonus = Math.min(result.matchedFlags.length * 2, 10);
  const perfectBonus = result.score >= 100 ? 10 : 0;
  const analystBonus = mode === "analyst" && result.isCorrect ? 5 : 0;
  const streakBonus = result.isCorrect && streak >= 3 ? 5 : 0;

  return verdictBonus + flagBonus + perfectBonus + analystBonus + streakBonus;
}

async function getOrCreateProfile() {
  return getGlobalProfile();
}

export async function getDarkProfile() {
  return getOrCreateProfile();
}

export function getDefendStats(profile, totalScenarios) {
  const completedDefend = profile?.completedDefend || [];
  const completedScenarioCount = completedDefend.filter((entry) =>
    entry.startsWith(`${MODULE_ID}:scenario-`),
  ).length;
  const completionPercent = totalScenarios
    ? Math.round((completedScenarioCount / totalScenarios) * 100)
    : 0;

  return {
    completedScenarioCount,
    completionPercent,
    remainingScenarioCount: Math.max(
      totalScenarios - completedScenarioCount,
      0,
    ),
  };
}

export async function recordDefendScenario({
  scenarioId,
  result,
  totalScenarios,
  mode = "beginner",
  streak = 0,
}) {
  const profile = await getOrCreateProfile();
  const completionId = scenarioCompletionId(scenarioId);
  const xpAwarded = calculateDefendXp(result, mode, streak);

  recordPhishingAnalyzed(scenarioId, {
    scenarioId,
    mode,
    score: result.score,
    isCorrect: result.isCorrect,
    xp: profile.completedDefend.includes(completionId) ? 0 : xpAwarded,
    matchedFlags: result.matchedFlags,
    confidence: result.confidence,
  });

  if (profile.completedDefend.includes(completionId)) {
    return { profile, xpAwarded: 0, alreadyCompleted: true };
  }

  const completedDefend = [...profile.completedDefend, completionId];
  const badges = new Set(profile.badges);

  badges.add(DEFEND_BADGES.FIRST_ANALYSIS);

  if (result.score >= 100) {
    badges.add(DEFEND_BADGES.PERFECT_ANALYSIS);
  }

  if (mode === "analyst" && result.isCorrect) {
    badges.add(DEFEND_BADGES.ANALYST_CORRECT);
  }

  if (streak >= 3) {
    badges.add(DEFEND_BADGES.STREAK_THREE);
  }

  const completedScenarioCount = completedDefend.filter((entry) =>
    entry.startsWith(`${MODULE_ID}:scenario-`),
  ).length;

  if (completedScenarioCount >= totalScenarios) {
    badges.add(DEFEND_BADGES.PHISHING_PATH_COMPLETE);
  }

  const profileWithDefendStats = saveGlobalProfile({
    ...profile,
    badges: Array.from(badges),
    completedDefend,
  });
  const updatedProfile = addGlobalXp(
    xpAwarded,
    "darkdefend",
    `scenario:${scenarioId}`,
    profileWithDefendStats,
  );

  for (const badge of badges) {
    awardGlobalBadge(badge);
  }

  return { profile: updatedProfile, xpAwarded, alreadyCompleted: false };
}

export { getGlobalLevel, getGlobalRank };
