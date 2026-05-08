const STORAGE_KEY = "darknexus_profile";

function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

function calculateRank(level) {
  if (level >= 50) return "GHOST";
  if (level >= 25) return "OPERATOR";
  if (level >= 10) return "HUNTER";
  return "ROOKIE";
}

function save(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function normalizeProfile(profile) {
  return {
    ...profile,
    badges: profile.badges || [],
    completedLessons: profile.completedLessons || [],
    completedMissions: profile.completedMissions || [],
    completedDefend: profile.completedDefend || [],
  };
}

export const localProfileAdapter = {
  async getProfile() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeProfile(JSON.parse(raw)) : null;
  },

  async createProfile(username = "Ghost") {
    const now = new Date().toISOString();

    const profile = {
      id: crypto.randomUUID(),
      username,
      xp: 0,
      level: 1,
      rank: "ROOKIE",
      badges: [],
      completedLessons: [],
      completedMissions: [],
      completedDefend: [],
      createdAt: now,
      updatedAt: now,
    };

    save(profile);
    return profile;
  },

  async updateProfile(profile) {
    const updated = normalizeProfile({
      ...profile,
      updatedAt: new Date().toISOString(),
    });

    save(updated);
    return updated;
  },

  async addXp(amount) {
    const profile = await this.getProfile();

    if (!profile) {
      throw new Error("No profile found");
    }

    const xp = profile.xp + amount;
    const level = calculateLevel(xp);

    const updated = {
      ...profile,
      xp,
      level,
      rank: calculateRank(level),
      updatedAt: new Date().toISOString(),
    };

    save(updated);
    return updated;
  },

  async resetProfile() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
