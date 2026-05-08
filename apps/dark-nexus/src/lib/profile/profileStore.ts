/* const STORAGE_KEY = "darknexus_profile";

export function getProfile() {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: any) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function addXP(amount: number) {
    const profile = getProfile();
    if (!profile) return;

    profile.xp += amount;

    const newLevel = Math.floor(profile.xp / 100) + 1;
    profile.level = newLevel;

    saveProfile(profile);
}*/