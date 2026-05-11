import { safeRead, safeWrite } from "@dark/storage";
import { progressNamespaces, syncProgressWithSupabase } from "@dark/progress";
import { migrateLegacyProgress } from "@dark/progress/migrations";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";
import type { AppProgressState, GlobalProfile, ProgressEvent } from "@dark/types";

type BootstrapOptions = {
    force?: boolean;
};

type BootstrapResult = {
    ok: boolean;
    skipped: boolean;
    migrated: unknown;
    pulled: {
        profile?: unknown;
        events?: unknown;
        snapshots?: unknown;
        eventsMerged?: number;
        snapshotsMerged?: number;
        profileHydrated?: boolean;
    };
    pushed: unknown;
    errors: string[];
    timestamp: string;
    reason?: string;
};

const PROFILE_KEY = "dark_profile";
const PROGRESS_PREFIX = "dark:progress:";

function progressKey(namespace: string) {
    return `${PROGRESS_PREFIX}${namespace}`;
}

function bootstrapKey(userId: string) {
    return `dark:supabase:bootstrap:${userId}`;
}

function toTime(value: unknown) {
    if (!value || typeof value !== "string") return 0;
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : 0;
}

function emptyProgress(namespace: string): AppProgressState {
    return {
        namespace,
        data: {},
        events: [],
        updatedAt: null,
        schemaVersion: 1,
    };
}

function readProgress(namespace: string) {
    return safeRead<AppProgressState>(progressKey(namespace), emptyProgress(namespace));
}

function writeProgress(namespace: string, progress: AppProgressState) {
    return safeWrite(progressKey(namespace), progress);
}

function mergeEventsIntoLocal(events: ProgressEvent[]) {
    let merged = 0;

    events.forEach((event) => {
        const namespace = String(event.namespace || "nexus");
        const current = readProgress(namespace);
        const existingKeys = new Set(current.events.map((item) => item.idempotencyKey));

        if (existingKeys.has(event.idempotencyKey)) return;

        writeProgress(namespace, {
            ...current,
            events: [...current.events, event],
            updatedAt: current.updatedAt && toTime(current.updatedAt) > toTime(event.timestamp)
                ? current.updatedAt
                : event.timestamp,
        });
        merged += 1;
    });

    return merged;
}

function mergeSnapshotsIntoLocal(snapshots: AppProgressState[]) {
    let merged = 0;

    snapshots.forEach((snapshot) => {
        const namespace = String(snapshot.namespace || "nexus");
        const current = readProgress(namespace);
        const localTime = toTime(current.updatedAt);
        const remoteTime = toTime(snapshot.updatedAt);

        if (localTime > remoteTime) return;

        const existingKeys = new Set(current.events.map((event) => event.idempotencyKey));
        const remoteEvents = Array.isArray(snapshot.events) ? snapshot.events : [];
        const mergedEvents = [
            ...current.events,
            ...remoteEvents.filter((event) => !existingKeys.has(event.idempotencyKey)),
        ];

        writeProgress(namespace, {
            ...current,
            ...snapshot,
            events: mergedEvents,
            updatedAt: snapshot.updatedAt || current.updatedAt,
        });
        merged += 1;
    });

    return merged;
}

function hydrateProfile(remoteProfile: GlobalProfile | null) {
    if (!remoteProfile) return false;

    const localProfile = safeRead<(Partial<GlobalProfile> & { updatedAt?: string }) | null>(PROFILE_KEY, null);
    const localTime = toTime(localProfile?.updatedAt);
    const remoteTime = toTime(remoteProfile.updatedAt);

    if (localProfile && localTime > remoteTime) return false;

    safeWrite(PROFILE_KEY, remoteProfile);
    return true;
}

function getResultBase(): BootstrapResult {
    return {
        ok: false,
        skipped: false,
        migrated: null,
        pulled: {},
        pushed: null,
        errors: [],
        timestamp: new Date().toISOString(),
    };
}

export async function bootstrapSupabaseSync(options: BootstrapOptions = {}): Promise<BootstrapResult> {
    const result = getResultBase();

    try {
        if (!hasSupabaseConfig()) {
            return { ...result, reason: "not_configured" };
        }

        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            return { ...result, reason: "not_configured" };
        }

        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            return {
                ...result,
                reason: "not_authenticated",
                errors: error?.message ? [error.message] : [],
            };
        }

        const key = bootstrapKey(data.user.id);
        const existingBootstrap = safeRead(key, null);
        if (existingBootstrap && !options.force) {
            return {
                ...result,
                ok: true,
                skipped: true,
                reason: "already_bootstrapped",
            };
        }

        try {
            result.migrated = migrateLegacyProgress();
        } catch (migrationError) {
            result.errors.push(migrationError instanceof Error ? migrationError.message : "Legacy migration failed.");
        }

        const pullResult = await syncProgressWithSupabase({ mode: "pull" });
        result.pulled.profile = pullResult.profile;
        result.pulled.events = pullResult.events;
        result.pulled.snapshots = pullResult.snapshots;

        const remoteProfile = pullResult.profile?.ok
            ? (pullResult.profile.data as GlobalProfile | null)
            : null;
        const remoteEvents = pullResult.events?.ok && Array.isArray(pullResult.events.data)
            ? (pullResult.events.data as ProgressEvent[])
            : [];
        const remoteSnapshots = pullResult.snapshots?.ok && Array.isArray(pullResult.snapshots.data)
            ? (pullResult.snapshots.data as AppProgressState[])
            : [];

        result.pulled.profileHydrated = hydrateProfile(remoteProfile);
        result.pulled.snapshotsMerged = mergeSnapshotsIntoLocal(remoteSnapshots);
        result.pulled.eventsMerged = mergeEventsIntoLocal(remoteEvents);

        const pushResult = await syncProgressWithSupabase({ mode: "push" });
        result.pushed = pushResult;

        safeWrite(key, {
            userId: data.user.id,
            completedAt: new Date().toISOString(),
            namespaces: progressNamespaces,
        });

        return {
            ...result,
            ok: result.errors.length === 0,
            skipped: false,
        };
    } catch (error) {
        return {
            ...result,
            ok: false,
            errors: [
                ...result.errors,
                error instanceof Error ? error.message : "Supabase bootstrap failed.",
            ],
        };
    }
}
