"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import PageHeader from "@dark/ui/components/PageHeader";
import PanelCard from "@dark/ui/components/PanelCard";
import SectionHeader from "@dark/ui/components/SectionHeader";
import NexusBackground from "@dark/ui/components/NexusBackground";
import { clearSyncQueue, getSyncQueue, markSyncItemSynced, progressNamespaces, syncProgressWithSupabase } from "@dark/progress";
import { exportAllDarkData, importAllDarkData, importProgressDump, clearDarkData } from "@dark/progress/debug";
import { migrateLegacyProgress, previewLegacyMigration } from "@dark/progress/migrations";
import { createBrowserSupabaseClient } from "@dark/supabase-client";
import { supabaseProgressProvider } from "@dark/progress/providers/supabaseProgressProvider";
import { useSupabaseBootstrapSync } from "@/hooks/useSupabaseBootstrapSync";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import type { User } from "@supabase/supabase-js";
import type { AppProgressState, SyncQueueItem } from "@dark/types";

const legacyKeys = [
    "darksplaining:xp",
    "darksplaining.lessonProgress",
    "dc_global_progress",
    "darkchallenges:progress",
    "darkchallenges:ctf-progress",
    "darkchallenges:warzone-progress",
    "phishscope-results",
    "darkdefend-incidents",
    "darkdefend-security-check",
];

type DarkDataDump = {
    darkProfile?: unknown;
    progress?: Record<string, AppProgressState>;
    syncQueue?: SyncQueueItem[];
    migrations?: Record<string, unknown>;
};

type Feedback = {
    tone: "success" | "error" | "info";
    message: string;
} | null;

type SupabaseProfileRow = {
    id: string;
    username: string;
    xp: number;
    level: number;
    rank: string;
    badges: unknown[];
    telemetry: Record<string, unknown>;
    schema_version: number;
};

function safeLocalStorageKeys() {
    try {
        if (!("localStorage" in globalThis)) return [];

        return legacyKeys.filter((key) => globalThis.localStorage.getItem(key) !== null);
    } catch {
        return [];
    }
}

function formatJson(value: unknown) {
    return JSON.stringify(value, null, 2);
}

function decodePayload(payload: string) {
    const binary = atob(payload);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
}

function getActiveProgressNamespaces(progress: Record<string, AppProgressState> = {}) {
    return Object.values(progress).filter((state) => {
        const dataSize = state?.data ? Object.keys(state.data).length : 0;
        return dataSize > 0 || (state?.events?.length || 0) > 0;
    }).length;
}

function getLocalDataSize(dump: DarkDataDump) {
    try {
        const bytes = new TextEncoder().encode(JSON.stringify(dump)).length;
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
        return `${Math.round(bytes / 1024 / 102.4) / 10} MB`;
    } catch {
        return "unknown";
    }
}

function getSupabaseUsername(user: User) {
    const userName = user.user_metadata?.user_name;
    if (typeof userName === "string" && userName) return userName;
    return user.email || "Operator";
}

function getSupabaseUserLabel(user: User | null) {
    if (!user) return "not authenticated";
    const userName = user.user_metadata?.user_name;
    if (typeof userName === "string" && userName) return userName;
    return user.email || user.id;
}

function buildMinimalProfile(user: User): SupabaseProfileRow {
    return {
        id: user.id,
        username: getSupabaseUsername(user),
        xp: 0,
        level: 1,
        rank: "ROOKIE",
        badges: [],
        telemetry: {},
        schema_version: 1,
    };
}

export default function DataSettingsPage() {
    const handledBridgePayloadRef = useRef(false);
    const [dump, setDump] = useState<DarkDataDump>({});
    const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
    const [legacyDetected, setLegacyDetected] = useState<string[]>([]);
    const [migrationStatus, setMigrationStatus] = useState("unknown");
    const [resultJson, setResultJson] = useState("");
    const [exportJson, setExportJson] = useState("");
    const [importJson, setImportJson] = useState("");
    const [feedback, setFeedback] = useState<Feedback>(null);
    const {
        configured: supabaseConfigured,
        loading: sessionLoading,
        user: authUser,
        profile: supabaseProfile,
        avatarUrl,
        email,
        refreshProfile,
        signOut,
    } = useSupabaseSession();
    const {
        status: bootstrapStatus,
        result: bootstrapResult,
        runNow: runBootstrapSync,
    } = useSupabaseBootstrapSync();

    function refresh() {
        const nextDump = exportAllDarkData() as DarkDataDump;
        const nextQueue = getSyncQueue();
        const migrationPreview = previewLegacyMigration();

        setDump(nextDump);
        setSyncQueue(nextQueue);
        setLegacyDetected(safeLocalStorageKeys());
        setMigrationStatus(migrationPreview.alreadyMigrated ? "migrated" : "not migrated");
    }

    useEffect(() => {
        const refreshTimer = window.setTimeout(refresh, 0);

        return () => {
            window.clearTimeout(refreshTimer);
        };
    }, []);

    useEffect(() => {
        if (handledBridgePayloadRef.current) return;
        handledBridgePayloadRef.current = true;

        const timer = window.setTimeout(async () => {
            try {
                const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
                const payload = hash.get("payload");
                const shouldAutoSync = hash.get("autoSync") === "1";
                const shouldClose = hash.get("closeOnDone") === "1";

                if (!payload) return;

                const imported = importProgressDump(decodePayload(payload));
                setResultJson(formatJson(imported));
                refresh();

                if (!shouldAutoSync) {
                    setFeedback({ tone: "success", message: "DarkSplaining progress imported." });
                    return;
                }

                setFeedback({ tone: "info", message: "DarkSplaining progress imported. Running cloud sync..." });
                const synced = await syncProgressWithSupabase();
                setResultJson(formatJson(synced));
                setFeedback({ tone: "success", message: "DarkSplaining progress imported and synced." });
                refresh();

                if (shouldClose) {
                    window.setTimeout(() => window.close(), 900);
                }
            } catch (error) {
                setFeedback({
                    tone: "error",
                    message: error instanceof Error ? error.message : "DarkSplaining bridge sync failed.",
                });
            } finally {
                window.history.replaceState(null, "", window.location.pathname);
            }
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const progressCount = useMemo(
        () => getActiveProgressNamespaces(dump.progress),
        [dump.progress],
    );
    const localDataSize = useMemo(() => getLocalDataSize(dump), [dump]);
    const pendingSyncCount = useMemo(
        () => syncQueue.filter((item) => item.status !== "synced").length,
        [syncQueue],
    );
    const syncedSyncCount = useMemo(
        () => syncQueue.filter((item) => item.status === "synced").length,
        [syncQueue],
    );

    const latestQueueItems = useMemo(
        () => [...syncQueue].reverse().slice(0, 10),
        [syncQueue],
    );

    function setResult(value: unknown, message: string) {
        setResultJson(formatJson(value));
        setFeedback({ tone: "success", message });
        refresh();
    }

    function handlePreviewMigration() {
        try {
            setResult(previewLegacyMigration(), "Legacy migration preview ready.");
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Preview failed." });
        }
    }

    function handleRunMigration() {
        if (!window.confirm("Run legacy migration? Existing legacy keys will be kept.")) return;

        try {
            setResult(migrateLegacyProgress(), "Legacy migration completed.");
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Migration failed." });
        }
    }

    function handleClearSyncQueue() {
        if (!window.confirm("Clear the local sync queue?")) return;

        clearSyncQueue();
        setFeedback({ tone: "success", message: "Sync queue cleared." });
        refresh();
    }

    function handleMarkAllSynced() {
        if (!window.confirm("Mark every sync queue item as synced locally?")) return;

        getSyncQueue().forEach((item) => markSyncItemSynced(item.id));
        setFeedback({ tone: "success", message: "Sync queue marked as synced." });
        refresh();
    }

    function handleExport() {
        try {
            const nextExport = formatJson(exportAllDarkData());
            setExportJson(nextExport);
            setFeedback({ tone: "success", message: "Local data exported." });
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Export failed." });
        }
    }

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(exportJson);
            setFeedback({ tone: "success", message: "JSON copied." });
        } catch {
            setFeedback({ tone: "error", message: "Clipboard copy failed." });
        }
    }

    function handleImport() {
        if (!window.confirm("Import this JSON into local Dark data? This can overwrite current local QA data.")) return;

        try {
            const parsed = JSON.parse(importJson) as Record<string, unknown>;
            setResult(importAllDarkData(parsed), "Local data imported.");
            setImportJson("");
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Invalid JSON." });
        }
    }

    function handleClearDarkData(includeLegacy: boolean) {
        const label = includeLegacy ? "Dark data and legacy keys" : "Dark data only";
        if (!window.confirm(`Clear ${label}? This cannot be undone locally.`)) return;

        clearDarkData({ includeLegacy });
        setFeedback({ tone: "success", message: `${label} cleared.` });
        setResultJson("");
        setExportJson("");
        refresh();
    }

    async function handleTestSupabaseConnection() {
        if (!supabaseConfigured) {
            setFeedback({ tone: "error", message: "Supabase env is not configured." });
            return;
        }

        try {
            const supabase = createBrowserSupabaseClient();
            if (!supabase) {
                setFeedback({ tone: "error", message: "Supabase env is not configured." });
                return;
            }

            const { data: authData, error: authError } = await supabase.auth.getUser();

            if (authError || !authData.user) {
                setResult(
                    {
                        ok: true,
                        configured: true,
                        authenticated: false,
                        message: "Supabase configured. No authenticated user yet.",
                    },
                    "Supabase configured. No authenticated user yet.",
                );
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", authData.user.id)
                .maybeSingle();

            if (error) {
                setResult(
                    {
                        ok: false,
                        configured: true,
                        authenticated: true,
                        error: error.message,
                    },
                    "Supabase connection test returned an error.",
                );
                return;
            }

            let profile = data;
            let bootstrapped = false;

            if (!profile) {
                const minimalProfile = buildMinimalProfile(authData.user);
                const { data: insertedProfile, error: insertError } = await supabase
                    .from("profiles")
                    .insert(minimalProfile)
                    .select("*")
                    .single();

                if (insertError) {
                    setResult(
                        {
                            ok: false,
                            configured: true,
                            authenticated: true,
                            userId: authData.user.id,
                            error: insertError.message,
                        },
                        "Supabase profile bootstrap failed.",
                    );
                    return;
                }

                profile = insertedProfile;
                bootstrapped = true;
            }

            setResult(
                    {
                        ok: true,
                        configured: true,
                        authenticated: true,
                        userId: authData.user.id,
                        profile,
                        profileBootstrapped: bootstrapped,
                    },
                    "Supabase connection OK.",
                );
            await refreshProfile(authData.user);
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Supabase connection failed." });
        }
    }

    async function handleSignOut() {
        if (!window.confirm("Sign out from Supabase on this browser?")) return;

        try {
            await signOut();
            setFeedback({ tone: "success", message: "Signed out from Supabase." });
            refresh();
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Sign out failed." });
        }
    }

    async function handlePushLocalSyncQueue() {
        if (!window.confirm("Push local profile, snapshots, and pending sync queue to Supabase?")) return;

        try {
            setResult(await syncProgressWithSupabase(), "Supabase push completed.");
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Supabase push failed." });
        }
    }

    async function handlePullRemoteData() {
        try {
            const [profile, events, snapshots] = await Promise.all([
                supabaseProgressProvider.pullProfile(),
                supabaseProgressProvider.pullEvents(),
                supabaseProgressProvider.pullSnapshots(),
            ]);

            setResult(
                {
                    profile,
                    events,
                    snapshots,
                    note: "Remote data is previewed only. localStorage remains the source of truth until auth sync is explicitly enabled.",
                },
                "Remote Supabase data pulled for preview.",
            );
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Supabase pull failed." });
        }
    }

    async function handleRunBootstrapAgain() {
        try {
            setResult(await runBootstrapSync({ force: true }), "Bootstrap sync completed.");
            refresh();
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Bootstrap sync failed." });
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080d1a] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
            <NexusBackground />
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
                <Link
                    href="/"
                    className="inline-flex w-fit items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back home
                </Link>

                <PanelCard
                    variant="darkNexusHero"
                    accent="blue"
                    className="border-blue-300/15 bg-[radial-gradient(circle_at_14%_0%,rgba(96,165,250,0.15),transparent_32%),radial-gradient(circle_at_86%_16%,rgba(16,185,129,0.10),transparent_30%),linear-gradient(135deg,rgba(4,10,22,0.96),rgba(7,12,24,0.80)_52%,rgba(3,7,18,0.96))] p-7"
                >
                    <PageHeader
                        eyebrow="Advanced"
                        title="Data & Sync"
                        description="Advanced local-first storage, cloud sync and diagnostics."
                        accent="blue"
                        badges={[
                            { label: "localStorage", variant: "blue" },
                            { label: "sync-ready", variant: "emerald" },
                            {
                                label: `Supabase ${sessionLoading ? "checking" : supabaseConfigured ? "yes" : "no"}`,
                                variant: supabaseConfigured ? "emerald" : "slate",
                            },
                            {
                                label: `Auth ${sessionLoading ? "checking" : authUser ? "yes" : "no"}`,
                                variant: authUser ? "emerald" : "slate",
                            },
                        ]}
                    />
                    <div className="mt-6 grid gap-3 md:grid-cols-4">
                        <StatusTile label="Local size" value={localDataSize} tone="blue" />
                        <StatusTile label="Pending queue" value={String(pendingSyncCount)} tone={pendingSyncCount > 0 ? "amber" : "emerald"} />
                        <StatusTile label="Active namespaces" value={`${progressCount}/${progressNamespaces.length}`} tone="violet" />
                        <StatusTile label="Migration" value={migrationStatus} tone={migrationStatus === "migrated" ? "emerald" : "slate"} />
                    </div>
                </PanelCard>

                <PanelCard variant="darkNexus" accent="amber" className="border-amber-300/14 bg-amber-300/[0.055] p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <AppBadge variant="amber">Local-first</AppBadge>
                        <p className="text-sm leading-6 text-amber-100/90">
                            Local storage remains the source of truth until cloud sync is fully enabled.
                        </p>
                    </div>
                </PanelCard>

                {feedback && (
                    <PanelCard
                        variant="darkNexus"
                        accent={feedback.tone === "error" ? "danger" : "blue"}
                        className={feedback.tone === "error" ? "border-red-300/16 bg-red-300/[0.055] p-4" : "border-blue-300/14 bg-blue-300/[0.05] p-4"}
                    >
                        <p className={feedback.tone === "error" ? "text-sm text-red-200" : "text-sm text-blue-100"}>
                            {feedback.message}
                        </p>
                    </PanelCard>
                )}

                <PanelCard
                    variant="darkNexus"
                    accent="blue"
                    className="border-blue-300/12 bg-[linear-gradient(180deg,rgba(96,165,250,0.08),rgba(3,7,18,0.78))] p-6"
                >
                    <SectionHeader
                        eyebrow="Connection"
                        title="Connection status"
                        description="Supabase configuration, authenticated user, session state, and local profile availability."
                        accent="blue"
                    />
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <StatusTile
                            label="Supabase"
                            value={sessionLoading ? "checking" : supabaseConfigured ? "configured" : "missing"}
                            tone={supabaseConfigured ? "emerald" : "slate"}
                        />
                        <StatusTile
                            label="Authenticated"
                            value={sessionLoading ? "checking" : authUser ? "yes" : "no"}
                            tone={authUser ? "emerald" : "slate"}
                        />
                        <StatusTile label="Session user" value={getSupabaseUserLabel(authUser)} tone={authUser ? "emerald" : "slate"} />
                        <StatusTile label="Local profile" value={dump.darkProfile ? "present" : "missing"} tone={dump.darkProfile ? "emerald" : "slate"} />
                        <StatusTile label="Remote profile" value={supabaseProfile ? "present" : "missing"} tone={supabaseProfile ? "emerald" : "slate"} />
                    </div>
                </PanelCard>

                <PanelCard
                    variant="darkNexus"
                    accent="emerald"
                    className="border-emerald-300/12 bg-[linear-gradient(180deg,rgba(16,185,129,0.095),rgba(3,7,18,0.78))] p-6"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <SectionHeader
                            eyebrow="Cloud Sync"
                            title="Cloud sync controls"
                            description="Manual Supabase checks, profile bootstrap, push, pull, and sign-out controls."
                            accent="emerald"
                        />
                        <AppBadge variant={supabaseConfigured ? "emerald" : "slate"}>
                            {supabaseConfigured ? "configured" : "not configured"}
                        </AppBadge>
                    </div>
                    <div className="mt-2 rounded-xl border border-emerald-300/12 bg-emerald-300/[0.045] p-4">
                        <div className="flex flex-wrap items-center gap-4">
                            {avatarUrl ? (
                                <span
                                    aria-hidden="true"
                                    className="h-12 w-12 rounded-full border border-blue-300/20 bg-blue-400/[0.08] bg-cover bg-center"
                                    style={{ backgroundImage: `url(${avatarUrl})` }}
                                />
                            ) : (
                                <span className="grid h-12 w-12 place-items-center rounded-full border border-blue-300/20 bg-blue-400/[0.08] font-mono text-xs text-blue-100">
                                    NX
                                </span>
                            )}
                            <div className="min-w-0">
                                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                    Supabase user
                                </p>
                                <p className="mt-2 break-all text-sm font-bold text-slate-200">
                                    {sessionLoading ? "checking" : getSupabaseUserLabel(authUser)}
                                </p>
                                {email && (
                                    <p className="mt-1 break-all text-xs text-slate-500">{email}</p>
                                )}
                                {supabaseProfile && (
                                    <p className="mt-1 text-xs text-emerald-300">
                                        Remote profile: {supabaseProfile.rank} / LVL {supabaseProfile.level}
                                    </p>
                                )}
                            </div>
                        </div>
                        {!authUser && supabaseConfigured && (
                            <p className="mt-4 text-sm text-slate-400">
                                Sign in to enable Supabase profile bootstrap and manual sync actions.
                            </p>
                        )}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        {!authUser && (
                            <AppButton href="/auth" variant="primary">
                                Sign in with GitHub
                            </AppButton>
                        )}
                        <AppButton type="button" variant="secondary" onClick={handleTestSupabaseConnection}>
                            Test Supabase connection
                        </AppButton>
                        <AppButton type="button" variant="primary" onClick={handlePushLocalSyncQueue}>
                            Push local sync queue
                        </AppButton>
                        <AppButton type="button" variant="secondary" onClick={handlePullRemoteData}>
                            Pull remote profile/events
                        </AppButton>
                        {authUser && (
                            <AppButton type="button" variant="secondary" onClick={handleSignOut}>
                                Sign out
                            </AppButton>
                        )}
                    </div>
                </PanelCard>

                <PanelCard
                    variant="darkNexus"
                    accent="violet"
                    className="border-violet-300/12 bg-[linear-gradient(180deg,rgba(124,58,237,0.09),rgba(3,7,18,0.78))] p-6"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <SectionHeader
                            eyebrow="Cloud Sync"
                            title="Bootstrap status"
                            description="Runs once after Supabase login: migrate legacy data, pull remote state, merge local-first, then push pending local queue."
                            accent="violet"
                        />
                        <AppBadge
                            variant={
                                bootstrapStatus === "error"
                                    ? "amber"
                                    : bootstrapStatus === "running"
                                        ? "blue"
                                        : bootstrapStatus === "idle"
                                            ? "slate"
                                            : "emerald"
                            }
                        >
                            {bootstrapStatus}
                        </AppBadge>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <AppButton
                            type="button"
                            variant="secondary"
                            onClick={handleRunBootstrapAgain}
                            disabled={bootstrapStatus === "running"}
                        >
                            Run bootstrap sync again
                        </AppButton>
                    </div>
                    <pre className="mt-5 max-h-64 overflow-auto rounded-xl border border-violet-300/14 bg-[#05020d]/70 p-4 text-xs leading-relaxed text-violet-50">
                        {formatJson(bootstrapResult || { status: bootstrapStatus })}
                    </pre>
                </PanelCard>

                <PanelCard
                    variant="darkNexus"
                    accent="blue"
                    className="border-blue-300/12 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(3,7,18,0.78))] p-6"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <SectionHeader
                            eyebrow="Cloud Sync"
                            title="Sync queue"
                            description="Pending local event payloads that can be pushed to Supabase when authenticated."
                            accent="blue"
                        />
                        <div className="flex flex-wrap gap-3">
                            <AppBadge variant="amber">{pendingSyncCount} pending</AppBadge>
                            <AppBadge variant="emerald">{syncedSyncCount} synced</AppBadge>
                            <AppButton type="button" variant="secondary" onClick={handleMarkAllSynced}>
                                Mark all as synced mock
                            </AppButton>
                            <AppButton type="button" variant="secondary" onClick={handleClearSyncQueue}>
                                Clear sync queue
                            </AppButton>
                        </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.08]">
                        {latestQueueItems.length === 0 ? (
                            <p className="bg-blue-300/[0.035] p-4 text-sm text-slate-400">No sync queue items.</p>
                        ) : (
                            <div className="divide-y divide-white/[0.06]">
                                {latestQueueItems.map((item) => (
                                    <div key={item.id} className="grid gap-2 bg-blue-300/[0.03] p-4 text-sm md:grid-cols-[1fr_auto_auto] md:items-center">
                                        <div>
                                            <p className="font-semibold text-slate-100">{item.payload?.type || "event"}</p>
                                            <p className="mt-1 break-all text-xs text-slate-400">{item.idempotencyKey}</p>
                                        </div>
                                        <AppBadge variant={item.status === "synced" ? "emerald" : "amber"}>{item.status}</AppBadge>
                                        <span className="text-xs text-slate-500">{item.createdAt}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </PanelCard>

                <PanelCard
                    variant="darkNexus"
                    accent="blue"
                    className="border-blue-300/12 bg-[linear-gradient(180deg,rgba(14,165,233,0.07),rgba(3,7,18,0.80))] p-6"
                >
                    <SectionHeader
                        eyebrow="Local Cache"
                        title="Namespace snapshots"
                        description="Current localStorage footprint and progress namespace state."
                        accent="blue"
                    />
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <StatusTile label="Data size" value={localDataSize} tone="blue" />
                        <StatusTile label="Namespaces" value={`${progressCount}/${progressNamespaces.length}`} tone="blue" />
                        <StatusTile label="Queue items" value={String(syncQueue.length)} tone={syncQueue.length > 0 ? "amber" : "emerald"} />
                        <StatusTile label="Legacy keys" value={String(legacyDetected.length)} tone={legacyDetected.length > 0 ? "amber" : "slate"} />
                        <StatusTile label="Migration" value={migrationStatus} tone={migrationStatus === "migrated" ? "emerald" : "slate"} />
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                        {progressNamespaces.map((namespace) => {
                            const state = dump.progress?.[namespace];
                            const eventCount = state?.events?.length || 0;
                            const dataCount = state?.data ? Object.keys(state.data).length : 0;

                            return (
                                <div key={namespace} className="rounded-xl border border-blue-300/10 bg-blue-300/[0.035] p-4">
                                    <AppBadge variant={eventCount > 0 || dataCount > 0 ? "emerald" : "slate"}>
                                        {namespace}
                                    </AppBadge>
                                    <p className="mt-3 text-sm text-slate-300">{eventCount} events</p>
                                    <p className="mt-1 text-xs text-slate-500">{dataCount} data keys</p>
                                </div>
                            );
                        })}
                    </div>
                </PanelCard>

                <section className="grid gap-6 lg:grid-cols-2">
                    <PanelCard
                        variant="darkNexus"
                        accent="blue"
                        className="border-blue-300/12 bg-[linear-gradient(180deg,rgba(96,165,250,0.08),rgba(3,7,18,0.78))] p-6"
                    >
                        <SectionHeader eyebrow="Local Cache" title="Export local data" accent="blue" />
                        <div className="mt-5 flex flex-wrap gap-3">
                            <AppButton type="button" variant="primary" onClick={handleExport}>
                                Export local data
                            </AppButton>
                            <AppButton type="button" variant="secondary" onClick={handleCopy} disabled={!exportJson}>
                                Copy JSON
                            </AppButton>
                        </div>
                        <textarea
                            className="mt-5 min-h-80 w-full resize-y rounded-xl border border-blue-300/14 bg-[#020817]/85 p-4 font-mono text-xs text-blue-50 outline-none ring-blue-300/20 focus:ring-2"
                            value={exportJson}
                            onChange={(event) => setExportJson(event.target.value)}
                            spellCheck={false}
                        />
                    </PanelCard>

                    <PanelCard
                        variant="darkNexus"
                        accent="emerald"
                        className="border-emerald-300/12 bg-[linear-gradient(180deg,rgba(16,185,129,0.085),rgba(3,7,18,0.78))] p-6"
                    >
                        <SectionHeader eyebrow="Local Cache" title="Import local data" accent="emerald" />
                        <textarea
                            className="mt-5 min-h-80 w-full resize-y rounded-xl border border-emerald-300/14 bg-[#02110c]/80 p-4 font-mono text-xs text-emerald-50 outline-none ring-emerald-300/20 focus:ring-2"
                            value={importJson}
                            onChange={(event) => setImportJson(event.target.value)}
                            placeholder="{ }"
                            spellCheck={false}
                        />
                        <div className="mt-5">
                            <AppButton type="button" variant="primary" onClick={handleImport} disabled={!importJson.trim()}>
                                Import local data
                            </AppButton>
                        </div>
                    </PanelCard>
                </section>

                <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <PanelCard
                        variant="darkNexus"
                        accent="emerald"
                        className="border-emerald-300/12 bg-[linear-gradient(180deg,rgba(5,150,105,0.08),rgba(3,7,18,0.80))] p-6"
                    >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <SectionHeader
                                eyebrow="Legacy Migration"
                                title="Legacy migration"
                                description="Preview and convert older localStorage keys into normalized progress events without deleting legacy data."
                                accent="emerald"
                            />
                            <AppBadge variant="amber">Advanced</AppBadge>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <AppButton type="button" variant="secondary" onClick={handlePreviewMigration}>
                                Preview legacy migration
                            </AppButton>
                            <AppButton type="button" variant="primary" onClick={handleRunMigration}>
                                Run legacy migration
                            </AppButton>
                        </div>
                        {legacyDetected.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {legacyDetected.map((key) => (
                                    <AppBadge key={key} variant="amber">{key}</AppBadge>
                                ))}
                            </div>
                        )}
                    </PanelCard>

                    <PanelCard
                        variant="darkNexus"
                        accent="violet"
                        className="border-violet-300/12 bg-[linear-gradient(180deg,rgba(109,40,217,0.08),rgba(3,7,18,0.80))] p-6"
                    >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <SectionHeader
                                eyebrow="Diagnostics"
                                title="Raw JSON outputs"
                                description="Latest command output for migration, Supabase tests, bootstrap, import, export, and sync actions."
                                accent="violet"
                            />
                            <AppBadge variant="amber">Advanced</AppBadge>
                        </div>
                        <pre className="mt-5 max-h-80 overflow-auto rounded-xl border border-violet-300/14 bg-[#060211]/80 p-4 text-xs leading-relaxed text-violet-50">
                            {resultJson || "{\n  \"status\": \"No diagnostic result yet\"\n}"}
                        </pre>
                    </PanelCard>
                </section>

                <PanelCard
                    variant="danger"
                    accent="danger"
                    className="border-red-300/14 bg-[linear-gradient(180deg,rgba(248,113,113,0.095),rgba(3,7,18,0.82))] p-6"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <SectionHeader
                            eyebrow="Danger Zone"
                            title="Reset local data"
                            description="Destructive local actions. Confirmation is required before anything is cleared."
                            accent="danger"
                        />
                        <AppBadge variant="amber">Advanced</AppBadge>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <AppButton type="button" variant="secondary" onClick={() => handleClearDarkData(false)}>
                            Clear Dark data only
                        </AppButton>
                        <AppButton type="button" variant="secondary" onClick={() => handleClearDarkData(true)}>
                            Clear Dark data + legacy
                        </AppButton>
                    </div>
                </PanelCard>
            </div>
        </main>
    );
}

function StatusTile({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone: string;
}) {
    const toneClass =
        tone === "emerald"
            ? "border-emerald-300/14 bg-emerald-300/[0.045]"
            : tone === "amber"
                ? "border-amber-300/14 bg-amber-300/[0.045]"
                : tone === "violet"
                    ? "border-violet-300/14 bg-violet-300/[0.045]"
                    : tone === "blue"
                        ? "border-blue-300/14 bg-blue-300/[0.045]"
                        : "border-white/[0.07] bg-white/[0.025]";

    return (
        <div className={`rounded-xl border p-4 ${toneClass}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <div className="mt-3">
                <AppBadge variant={tone}>{value}</AppBadge>
            </div>
        </div>
    );
}
