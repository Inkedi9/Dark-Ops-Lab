"use client";

import { DarkProfile, ProfileAdapter } from "./types";

const STORAGE_KEY = "darknexus_profile";

function calculateLevel(xp: number) {
    return Math.floor(xp / 100) + 1;
}

function calculateRank(level: number) {
    if (level >= 50) return "GHOST";
    if (level >= 25) return "OPERATOR";
    if (level >= 10) return "HUNTER";
    return "ROOKIE";
}

function save(profile: DarkProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

async function completeProfileEntry({
    profile,
    key,
    id,
    xp,
    adapter,
}: {
    profile: DarkProfile;
    key: "completedLessons" | "completedMissions" | "completedDefend";
    id: string;
    xp: number;
    adapter: ProfileAdapter;
}) {
    const alreadyCompleted = profile[key].includes(id);
    const completedEntries = alreadyCompleted ? profile[key] : [...profile[key], id];

    await adapter.updateProfile({
        ...profile,
        [key]: completedEntries,
    });

    return adapter.addXp(alreadyCompleted ? 0 : xp);
}

export const localProfileAdapter: ProfileAdapter = {
    async getProfile() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    async createProfile(username) {
        const now = new Date().toISOString();

        const profile: DarkProfile = {
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
        const updated = {
            ...profile,
            updatedAt: new Date().toISOString(),
        };

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

        const updated: DarkProfile = {
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
    async addBadge(badge) {
        const profile = await this.getProfile();
        if (!profile) throw new Error("No profile found");

        if (profile.badges.includes(badge)) return profile;

        return this.updateProfile({
            ...profile,
            badges: [...profile.badges, badge],
        });
    },

    async completeLesson(lessonId, xp = 25) {
        const profile = await this.getProfile();
        if (!profile) throw new Error("No profile found");

        return completeProfileEntry({
            profile,
            key: "completedLessons",
            id: lessonId,
            xp,
            adapter: this,
        });
    },

    async completeMission(missionId, xp = 50) {
        const profile = await this.getProfile();
        if (!profile) throw new Error("No profile found");

        return completeProfileEntry({
            profile,
            key: "completedMissions",
            id: missionId,
            xp,
            adapter: this,
        });
    },

    async completeDefend(defendId, xp = 35) {
        const profile = await this.getProfile();
        if (!profile) throw new Error("No profile found");

        return completeProfileEntry({
            profile,
            key: "completedDefend",
            id: defendId,
            xp,
            adapter: this,
        });
    },
};
