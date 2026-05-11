import type { WarzoneState } from "@/warzone/types";

const STORAGE_KEY = "darkchallenges:warzone-progress";

export type WarzoneProgress = {
    warzoneId: string;
    state: WarzoneState;
    completed: boolean;
    completedAt?: string;
    bestTimeSeconds?: number;
    actionsCount: number;
};

function isBrowser() {
    return typeof window !== "undefined";
}

function notifyProgressChanged() {
    window.dispatchEvent(new Event("darkchallenges:local-progress"));
}

export function getAllWarzoneProgress(): WarzoneProgress[] {
    if (!isBrowser()) return [];

    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
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
    if (!isBrowser()) return;

    const all = getAllWarzoneProgress();
    const index = all.findIndex((item) => item.warzoneId === progress.warzoneId);

    if (index >= 0) {
        all[index] = progress;
    } else {
        all.push(progress);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    notifyProgressChanged();
}

export function resetWarzoneProgress(warzoneId: string) {
    if (!isBrowser()) return;

    const next = getAllWarzoneProgress().filter(
        (item) => item.warzoneId !== warzoneId
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notifyProgressChanged();
}
