import type { DarkProfile, ProfileAdapter } from "./types";
import { appendProgressEvent } from "@dark/progress";

const STORAGE_KEY = "dark_profile";

function hasLocalStorage() {
    return typeof globalThis !== "undefined" && "localStorage" in globalThis;
}

export function getGlobalLevel(xp: number) {
    return Math.floor(xp / 100) + 1;
}

export function getGlobalRank(level: number) {
    if (level >= 50) return "GHOST";
    if (level >= 25) return "OPERATOR";
    if (level >= 10) return "HUNTER";
    return "ROOKIE";
}

function createDefaultProfile(username = "Ghost"): DarkProfile {
    const now = new Date().toISOString();

    return {
        id: globalThis.crypto?.randomUUID?.() || `local-${Date.now()}`,
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
}

function normalizeProfile(profile: Partial<DarkProfile> | null, username = "Ghost") {
    const fallback = createDefaultProfile(username);
    const xp = Math.max(0, Number(profile?.xp) || 0);
    const level = getGlobalLevel(xp);

    return {
        ...fallback,
        ...profile,
        xp,
        level,
        rank: getGlobalRank(level),
        badges: Array.isArray(profile?.badges) ? profile.badges : [],
        completedLessons: Array.isArray(profile?.completedLessons)
            ? profile.completedLessons
            : [],
        completedMissions: Array.isArray(profile?.completedMissions)
            ? profile.completedMissions
            : [],
        completedDefend: Array.isArray(profile?.completedDefend)
            ? profile.completedDefend
            : [],
        createdAt: profile?.createdAt || fallback.createdAt,
        updatedAt: profile?.updatedAt || fallback.updatedAt,
    };
}

function readProfile() {
    try {
        if (!hasLocalStorage()) return null;

        const raw = globalThis.localStorage.getItem(STORAGE_KEY);
        return raw ? normalizeProfile(JSON.parse(raw)) : null;
    } catch {
        return null;
    }
}

function save(profile: DarkProfile) {
    const normalized = normalizeProfile({
        ...profile,
        updatedAt: new Date().toISOString(),
    });

    try {
        if (hasLocalStorage()) {
            globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
    } catch {
        // Local storage can be unavailable in private browsing or SSR-like contexts.
    }

    return normalized;
}

async function completeProfileEntry({
    profile,
    key,
    id,
    xp,
}: {
    profile: DarkProfile;
    key: "completedLessons" | "completedMissions" | "completedDefend";
    id: string;
    xp: number;
}) {
    const alreadyCompleted = profile[key].includes(id);
    const completedEntries = alreadyCompleted ? profile[key] : [...profile[key], id];

    const updatedProfile = save({
        ...profile,
        [key]: completedEntries,
    });

    return addGlobalXp(alreadyCompleted ? 0 : xp, key, id, updatedProfile);
}

export function getGlobalProfile() {
    const profile = readProfile();

    if (profile) return profile;

    return save(createDefaultProfile());
}

export function saveGlobalProfile(profile: DarkProfile) {
    return save(profile);
}

export function addGlobalXp(
    amount: number,
    source = "global",
    entityIdOrBaseProfile: string | DarkProfile = "global",
    maybeBaseProfile?: DarkProfile,
) {
    const entityId =
        typeof entityIdOrBaseProfile === "string" ? entityIdOrBaseProfile : "global";
    const baseProfile =
        typeof entityIdOrBaseProfile === "object" ? entityIdOrBaseProfile : maybeBaseProfile;
    const profile = baseProfile || getGlobalProfile();
    const safeAmount = Math.max(0, Number(amount) || 0);
    const xp = profile.xp + safeAmount;
    const level = getGlobalLevel(xp);
    const updatedProfile = save({
        ...profile,
        xp,
        level,
        rank: getGlobalRank(level),
        telemetry: [
            ...((profile as DarkProfile & { telemetry?: unknown[] }).telemetry || []),
            {
                type: "xp",
                amount: safeAmount,
                source,
                entityId,
                createdAt: new Date().toISOString(),
            },
        ],
    } as DarkProfile);

    if (safeAmount > 0) {
        appendProgressEvent("nexus", {
            type: "xp_awarded",
            source,
            entityId,
            idempotencyKey: `${source}:xp_awarded:${entityId}`,
            payload: {
                xp: safeAmount,
                profileId: updatedProfile.id,
            },
        });
    }

    return updatedProfile;
}

export function awardGlobalBadge(id: string) {
    const profile = getGlobalProfile();

    if (profile.badges.includes(id)) return profile;

    return save({
        ...profile,
        badges: [...profile.badges, id],
    });
}

export function getGlobalTelemetry() {
    const profile = getGlobalProfile() as DarkProfile & { telemetry?: unknown[] };
    return Array.isArray(profile.telemetry) ? profile.telemetry : [];
}

export function resetGlobalProfile() {
    try {
        if (hasLocalStorage()) {
            globalThis.localStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        // Keep reset safe in storage-restricted contexts.
    }
}

export const localProfileAdapter: ProfileAdapter = {
    async getProfile() {
        return getGlobalProfile();
    },

    async createProfile(username) {
        return save(createDefaultProfile(username));
    },

    async updateProfile(profile) {
        return save(profile);
    },

    async addXp(amount) {
        return addGlobalXp(amount);
    },

    async resetProfile() {
        resetGlobalProfile();
    },

    async addBadge(badge) {
        return awardGlobalBadge(badge);
    },

    async completeLesson(lessonId, xp = 25) {
        const profile = await this.getProfile();
        if (!profile) throw new Error("No profile found");

        return completeProfileEntry({
            profile,
            key: "completedLessons",
            id: lessonId,
            xp,
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
        });
    },
};
