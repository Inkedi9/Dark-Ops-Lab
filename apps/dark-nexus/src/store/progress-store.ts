import { safeRead, safeWrite } from "@dark/storage";
import { notifyProgressChanged } from "./events";

export type ChallengeProgress = {
    challengeId: string;
    solved: boolean;
    bestScore: number;
    attempts: number;
    hintsUsed: number;
    solvedAt?: string;
};

const STORAGE_KEY = "darkchallenges:progress";

export function getAllProgress(): ChallengeProgress[] {
    return safeRead<ChallengeProgress[]>(STORAGE_KEY, []);
}

export function getChallengeProgress(
    challengeId: string
): ChallengeProgress | null {
    return (
        getAllProgress().find((progress) => progress.challengeId === challengeId) ??
        null
    );
}

export function saveChallengeProgress(progress: ChallengeProgress) {
    const allProgress = getAllProgress();
    const existingIndex = allProgress.findIndex(
        (item) => item.challengeId === progress.challengeId
    );

    if (existingIndex >= 0) {
        const existing = allProgress[existingIndex];

        allProgress[existingIndex] = {
            ...existing,
            ...progress,
            bestScore: Math.max(existing.bestScore, progress.bestScore),
            attempts: Math.min(existing.attempts, progress.attempts),
            hintsUsed: Math.min(existing.hintsUsed, progress.hintsUsed),
            solvedAt: existing.solvedAt ?? progress.solvedAt,
        };
    } else {
        allProgress.push(progress);
    }

    safeWrite(STORAGE_KEY, allProgress);
    notifyProgressChanged();
}

export function resetChallengeProgress(challengeId: string) {
    const nextProgress = getAllProgress().filter(
        (progress) => progress.challengeId !== challengeId
    );
    safeWrite(STORAGE_KEY, nextProgress);
    notifyProgressChanged();
}
