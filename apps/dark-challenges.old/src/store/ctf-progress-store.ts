const STORAGE_KEY = "darkchallenges:ctf-progress";

export type CtfProgress = {
    ctfId: string;
    solvedStepIds: string[];
    fragments: string[];
    completed: boolean;
    submittedFlag?: string;
    completedAt?: string;
    bestTimeSeconds?: number;
    bestAttempts?: number;
};

function isBrowser() {
    return typeof window !== "undefined";
}

function notifyProgressChanged() {
    window.dispatchEvent(new Event("darkchallenges:local-progress"));
}

export function getAllCtfProgress(): CtfProgress[] {
    if (!isBrowser()) return [];

    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
}

export function getCtfProgress(ctfId: string): CtfProgress {
    return (
        getAllCtfProgress().find((item) => item.ctfId === ctfId) ?? {
            ctfId,
            solvedStepIds: [],
            fragments: [],
            completed: false,
        }
    );
}

export function saveCtfProgress(progress: CtfProgress) {
    if (!isBrowser()) return;

    const all = getAllCtfProgress();
    const index = all.findIndex((item) => item.ctfId === progress.ctfId);

    if (index >= 0) {
        all[index] = progress;
    } else {
        all.push(progress);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    notifyProgressChanged();
}

export function resetCtfProgress(ctfId: string) {
    if (!isBrowser()) return;

    const next = getAllCtfProgress().filter((item) => item.ctfId !== ctfId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notifyProgressChanged();
}
