import { safeRead, safeWrite } from "@dark/storage";
import { notifyProgressChanged } from "./events";

const STORAGE_KEY = "dc_global_progress";

export type GlobalProgress = {
    totalXp: number;
    level: number;
    rank: string;
};

const DEFAULT_PROGRESS: GlobalProgress = { totalXp: 0, level: 1, rank: "novice" };

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
    return safeRead<GlobalProgress>(STORAGE_KEY, DEFAULT_PROGRESS);
}

export function saveGlobalProgress(progress: GlobalProgress) {
    safeWrite(STORAGE_KEY, progress);
    notifyProgressChanged();
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
