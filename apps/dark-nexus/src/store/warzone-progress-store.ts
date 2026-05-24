import type { WarzoneState } from "@/challenges/warzone/types";
import { safeRead, safeWrite } from "@dark/storage";
import { notifyProgressChanged } from "./events";

const STORAGE_KEY = "darkchallenges:warzone-progress";

export type WarzoneProgress = {
    warzoneId: string;
    state: WarzoneState;
    completed: boolean;
    completedAt?: string;
    bestTimeSeconds?: number;
    actionsCount: number;
};

export function getAllWarzoneProgress(): WarzoneProgress[] {
    return safeRead<WarzoneProgress[]>(STORAGE_KEY, []);
}

export function getWarzoneProgress(
    warzoneId: string,
    initialState: WarzoneState
): WarzoneProgress {
    return (
        getAllWarzoneProgress().find((item) => item.warzoneId === warzoneId) ?? {
            warzoneId,
            state: initialState,
            completed: false,
            actionsCount: 0,
        }
    );
}

export function saveWarzoneProgress(progress: WarzoneProgress) {
    const all = getAllWarzoneProgress();
    const index = all.findIndex((item) => item.warzoneId === progress.warzoneId);

    if (index >= 0) {
        all[index] = progress;
    } else {
        all.push(progress);
    }

    safeWrite(STORAGE_KEY, all);
    notifyProgressChanged();
}

export function resetWarzoneProgress(warzoneId: string) {
    const next = getAllWarzoneProgress().filter(
        (item) => item.warzoneId !== warzoneId
    );
    safeWrite(STORAGE_KEY, next);
    notifyProgressChanged();
}
