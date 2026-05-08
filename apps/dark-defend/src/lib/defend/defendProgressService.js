import { profileService } from "@dark/profile/profileService";

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
  const profile = await profileService.getProfile();
  return profile || profileService.createProfile("Ghost");
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

  const xpAwarded = calculateDefendXp(result, mode, streak);
  const updatedProfile = await profileService.updateProfile({
    ...profile,
    xp: profile.xp + xpAwarded,
    level: Math.floor((profile.xp + xpAwarded) / 100) + 1,
    rank: calculateRank(Math.floor((profile.xp + xpAwarded) / 100) + 1),
    badges: Array.from(badges),
    completedDefend,
  });

  return { profile: updatedProfile, xpAwarded, alreadyCompleted: false };
}

function calculateRank(level) {
  if (level >= 50) return "GHOST";
  if (level >= 25) return "OPERATOR";
  if (level >= 10) return "HUNTER";
  return "ROOKIE";
}
