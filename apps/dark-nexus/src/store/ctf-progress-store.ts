import { safeRead, safeWrite } from "@dark/storage";
import { notifyProgressChanged } from "./events";

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

export function getAllCtfProgress(): CtfProgress[] {
    return safeRead<CtfProgress[]>(STORAGE_KEY, []);
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
    const all = getAllCtfProgress();
    const index = all.findIndex((item) => item.ctfId === progress.ctfId);

    if (index >= 0) {
        all[index] = progress;
    } else {
        all.push(progress);
    }

    safeWrite(STORAGE_KEY, all);
    notifyProgressChanged();
}

export function resetCtfProgress(ctfId: string) {
    const next = getAllCtfProgress().filter((item) => item.ctfId !== ctfId);
    safeWrite(STORAGE_KEY, next);
    notifyProgressChanged();
}
