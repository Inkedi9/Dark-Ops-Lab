const STORAGE_KEY = "dc_global_progress";

export type GlobalProgress = {
    totalXp: number;
    level: number;
    rank: string;
};

function getRankFromLevel(level: number): string {
    if (level < 2) return "novice";
    if (level < 4) return "recon";
    if (level < 6) return "exploiter";
    if (level < 8) return "operator";
    if (level < 10) return "specialist";
    return "ghost";
}

function getLevelFromXp(xp: number): number {
    return Math.floor(xp / 1000) + 1;
}

export function getGlobalProgress(): GlobalProgress {
    if (typeof window === "undefined") {
        return { totalXp: 0, level: 1, rank: "novice" };
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return { totalXp: 0, level: 1, rank: "novice" };
    }

    return JSON.parse(raw);
}

export function saveGlobalProgress(progress: GlobalProgress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addXp(amount: number) {
    const current = getGlobalProgress();

    const newXp = current.totalXp + amount;
    const newLevel = getLevelFromXp(newXp);

    const updated: GlobalProgress = {
        totalXp: newXp,
        level: newLevel,
        rank: getRankFromLevel(newLevel),
    };

    saveGlobalProgress(updated);

    return updated;
}