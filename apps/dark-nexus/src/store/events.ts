export const PROGRESS_CHANGED_EVENT = "darkchallenges:local-progress" as const;

export function notifyProgressChanged() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(PROGRESS_CHANGED_EVENT));
    }
}
