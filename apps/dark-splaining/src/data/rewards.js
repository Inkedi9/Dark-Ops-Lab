export const XP_REWARDS = {
  START_LESSON: 1,
  COMPLETE_EXERCISE: 10,
  COMPLETE_QUIZ: 5,
  COMPLETE_LESSON: 15,
  COMPLETE_TRACK: 30,
  UNLOCK_CERTIFICATE: 50,
};

export const XP_REWARD_LABELS = {
  START_LESSON: "Started lesson",
  COMPLETE_EXERCISE: "Completed exercise",
  COMPLETE_QUIZ: "Completed quiz",
  COMPLETE_LESSON: "Completed lesson",
  COMPLETE_TRACK: "Completed track",
  UNLOCK_CERTIFICATE: "Unlocked certificate",
};

export function getLevelFromXp(xp) {
  return Math.floor(xp / 50);
}
