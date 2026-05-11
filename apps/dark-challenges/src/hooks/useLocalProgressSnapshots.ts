"use client";

import { useSyncExternalStore } from "react";
import type { ChallengeProgress } from "@/store/progress-store";
import type { CtfProgress } from "@/store/ctf-progress-store";
import type { GlobalProgress } from "@/store/global-progress";
import type { WarzoneProgress } from "@/store/warzone-progress-store";

const GLOBAL_PROGRESS_KEY = "dc_global_progress";
const CHALLENGE_PROGRESS_KEY = "darkchallenges:progress";
const CTF_PROGRESS_KEY = "darkchallenges:ctf-progress";
const WARZONE_PROGRESS_KEY = "darkchallenges:warzone-progress";

const defaultGlobalProgress: GlobalProgress = {
    totalXp: 0,
    level: 1,
    rank: "novice",
};

const emptyChallengeProgress: ChallengeProgress[] = [];
const emptyCtfProgress: CtfProgress[] = [];
const emptyWarzoneProgress: WarzoneProgress[] = [];

const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

function subscribeToLocalStorage(onStoreChange: () => void) {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener("darkchallenges:local-progress", onStoreChange);

    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("darkchallenges:local-progress", onStoreChange);
    };
}

function readCachedJson<T>(key: string, fallback: T): T {
    try {
        const raw = window.localStorage.getItem(key);
        const cached = snapshotCache.get(key);

        if (cached?.raw === raw) {
            return cached.value as T;
        }

        const value = raw ? (JSON.parse(raw) as T) : fallback;
        snapshotCache.set(key, { raw, value });
        return value;
    } catch {
        return fallback;
    }
}

export function notifyLocalProgressChanged() {
    window.dispatchEvent(new Event("darkchallenges:local-progress"));
}

export function useGlobalProgressSnapshot() {
    return useSyncExternalStore(
        subscribeToLocalStorage,
        () => readCachedJson(GLOBAL_PROGRESS_KEY, defaultGlobalProgress),
        () => defaultGlobalProgress,
    );
}

export function useChallengeProgressSnapshot() {
    return useSyncExternalStore(
        subscribeToLocalStorage,
        () => readCachedJson(CHALLENGE_PROGRESS_KEY, emptyChallengeProgress),
        () => emptyChallengeProgress,
    );
}

export function useCtfProgressSnapshot() {
    return useSyncExternalStore(
        subscribeToLocalStorage,
        () => readCachedJson(CTF_PROGRESS_KEY, emptyCtfProgress),
        () => emptyCtfProgress,
    );
}

export function useWarzoneProgressSnapshot() {
    return useSyncExternalStore(
        subscribeToLocalStorage,
        () => readCachedJson(WARZONE_PROGRESS_KEY, emptyWarzoneProgress),
        () => emptyWarzoneProgress,
    );
}
