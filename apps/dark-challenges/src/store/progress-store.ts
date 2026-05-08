export type ChallengeProgress = {
    challengeId: string;
    solved: boolean;
    bestScore: number;
    attempts: number;
    hintsUsed: number;
    solvedAt?: string;
};

const STORAGE_KEY = "darkchallenges:progress";

function isBrowser() {
    return typeof window !== "undefined";
}

export function getAllProgress(): ChallengeProgress[] {
    if (!isBrowser()) return [];

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    try {
        return JSON.parse(raw) as ChallengeProgress[];
    } catch {
        return [];
    }
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
    if (!isBrowser()) return;

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

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}

export function resetChallengeProgress(challengeId: string) {
    if (!isBrowser()) return;

    const nextProgress = getAllProgress().filter(
        (progress) => progress.challengeId !== challengeId
    );

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
}