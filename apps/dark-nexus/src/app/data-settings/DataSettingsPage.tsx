"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import PageHeader from "@dark/ui/components/PageHeader";
import PanelCard from "@dark/ui/components/PanelCard";
import SectionHeader from "@dark/ui/components/SectionHeader";
import NexusBackground from "@dark/ui/components/NexusBackground";
import { clearSyncQueue, getSyncQueue, markSyncItemSynced, progressNamespaces, syncProgressWithSupabase } from "@dark/progress";
import { exportAllDarkData, importAllDarkData, clearDarkData } from "@dark/progress/debug";
import { migrateLegacyProgress, previewLegacyMigration } from "@dark/progress/migrations";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";
import { supabaseProgressProvider } from "@dark/progress/providers/supabaseProgressProvider";
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

function getActiveProgressNamespaces(progress: Record<string, AppProgressState> = {}) {
    return Object.values(progress).filter((state) => {
        const dataSize = state?.data ? Object.keys(state.data).length : 0;
        return dataSize > 0 || (state?.events?.length || 0) > 0;
    }).length;
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
    const [dump, setDump] = useState<DarkDataDump>({});
    const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
    const [legacyDetected, setLegacyDetected] = useState<string[]>([]);
    const [migrationStatus, setMigrationStatus] = useState("unknown");
    const [resultJson, setResultJson] = useState("");
    const [exportJson, setExportJson] = useState("");
    const [importJson, setImportJson] = useState("");
    const [feedback, setFeedback] = useState<Feedback>(null);
    const [supabaseConfigured, setSupabaseConfigured] = useState(false);
    const [supabaseConfigChecked, setSupabaseConfigChecked] = useState(false);
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [authChecked, setAuthChecked] = useState(false);

    function refresh() {
        const nextDump = exportAllDarkData() as DarkDataDump;
        const nextQueue = getSyncQueue();
        const migrationPreview = previewLegacyMigration();

        setDump(nextDump);
        setSyncQueue(nextQueue);
        setLegacyDetected(safeLocalStorageKeys());
        setMigrationStatus(migrationPreview.alreadyMigrated ? "migrated" : "not migrated");
    }

    async function refreshSupabaseAuth() {
        const configured = hasSupabaseConfig();
        setSupabaseConfigured(configured);
        setSupabaseConfigChecked(true);

        if (!configured) {
            setAuthUser(null);
            setAuthChecked(true);
            return;
        }

        try {
            const supabase = createBrowserSupabaseClient();
            if (!supabase) {
                setAuthUser(null);
                return;
            }

            const { data } = await supabase.auth.getUser();
            setAuthUser(data.user || null);
        } catch {
            setAuthUser(null);
        } finally {
            setAuthChecked(true);
        }
    }

    useEffect(() => {
        const refreshTimer = window.setTimeout(refresh, 0);
        const authTimer = window.setTimeout(() => {
            void refreshSupabaseAuth();
        }, 0);

        return () => {
            window.clearTimeout(refreshTimer);
            window.clearTimeout(authTimer);
        };
    }, []);

    const progressCount = useMemo(
        () => getActiveProgressNamespaces(dump.progress),
        [dump.progress],
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
            setAuthUser(authData.user);
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Supabase connection failed." });
        }
    }

    async function handleSignOut() {
        if (!window.confirm("Sign out from Supabase on this browser?")) return;

        try {
            const supabase = createBrowserSupabaseClient();
            if (!supabase) {
                setFeedback({ tone: "error", message: "Supabase env is not configured." });
                return;
            }

            await supabase.auth.signOut();
            setAuthUser(null);
            setAuthChecked(true);
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

                <PageHeader
                    eyebrow="Developer tools"
                    title="Data Settings"
                    description="Local QA controls for profile, progress, migrations, and backend sync preparation."
                    accent="blue"
                    badges={[
                        { label: "localStorage", variant: "blue" },
                        { label: "sync-ready", variant: "emerald" },
                        {
                            label: `Supabase ${supabaseConfigChecked ? (supabaseConfigured ? "yes" : "no") : "checking"}`,
                            variant: supabaseConfigured ? "emerald" : "slate",
                        },
                        {
                            label: `Auth ${authChecked ? (authUser ? "yes" : "no") : "checking"}`,
                            variant: authUser ? "emerald" : "slate",
                        },
                    ]}
                />

                {feedback && (
                    <PanelCard variant="darkNexus" accent={feedback.tone === "error" ? "danger" : "blue"} className="p-4">
                        <p className={feedback.tone === "error" ? "text-sm text-red-200" : "text-sm text-blue-100"}>
                            {feedback.message}
                        </p>
                    </PanelCard>
                )}

                <PanelCard variant="darkNexus" accent="blue" className="p-6">
                    <SectionHeader eyebrow="Overview" title="Local data overview" accent="blue" />
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <StatusTile label="Profile" value={dump.darkProfile ? "present" : "missing"} tone={dump.darkProfile ? "emerald" : "slate"} />
                        <StatusTile label="Progress namespaces" value={`${progressCount}/${progressNamespaces.length}`} tone="blue" />
                        <StatusTile label="Sync queue" value={String(syncQueue.length)} tone={syncQueue.length > 0 ? "amber" : "emerald"} />
                        <StatusTile label="Legacy keys" value={String(legacyDetected.length)} tone={legacyDetected.length > 0 ? "amber" : "slate"} />
                        <StatusTile label="Migration" value={migrationStatus} tone={migrationStatus === "migrated" ? "emerald" : "slate"} />
                        <StatusTile
                            label="Supabase"
                            value={supabaseConfigChecked ? (supabaseConfigured ? "configured" : "missing") : "checking"}
                            tone={supabaseConfigured ? "emerald" : "slate"}
                        />
                        <StatusTile
                            label="Authenticated"
                            value={authChecked ? (authUser ? "yes" : "no") : "checking"}
                            tone={authUser ? "emerald" : "slate"}
                        />
                    </div>
                    {legacyDetected.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {legacyDetected.map((key) => (
                                <AppBadge key={key} variant="amber">{key}</AppBadge>
                            ))}
                        </div>
                    )}
                </PanelCard>

                <PanelCard variant="darkNexus" accent="emerald" className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <SectionHeader
                            eyebrow="Backend"
                            title="Supabase sync preview"
                            description="Manual QA controls only. Local storage remains the active source of truth until an authenticated user is present."
                            accent="emerald"
                        />
                        <AppBadge variant={supabaseConfigured ? "emerald" : "slate"}>
                            {supabaseConfigured ? "configured" : "not configured"}
                        </AppBadge>
                    </div>
                    <div className="mt-2 rounded-xl border border-white/[0.07] bg-black/25 p-4">
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                            Supabase user
                        </p>
                        <p className="mt-2 break-all text-sm font-bold text-slate-200">
                            {authChecked ? getSupabaseUserLabel(authUser) : "checking"}
                        </p>
                        {authUser?.email && (
                            <p className="mt-1 break-all text-xs text-slate-500">{authUser.email}</p>
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

                <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <PanelCard variant="darkNexus" accent="emerald" className="p-6">
                        <SectionHeader eyebrow="Migration" title="Migration tools" accent="emerald" />
                        <div className="mt-5 flex flex-wrap gap-3">
                            <AppButton type="button" variant="secondary" onClick={handlePreviewMigration}>
                                Preview legacy migration
                            </AppButton>
                            <AppButton type="button" variant="primary" onClick={handleRunMigration}>
                                Run legacy migration
                            </AppButton>
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkNexus" accent="blue" className="p-6">
                        <SectionHeader eyebrow="Result" title="Migration output" accent="blue" />
                        <pre className="mt-5 max-h-80 overflow-auto rounded-xl border border-white/[0.08] bg-black/35 p-4 text-xs leading-relaxed text-slate-200">
                            {resultJson || "{\n  \"status\": \"No migration result yet\"\n}"}
                        </pre>
                    </PanelCard>
                </section>

                <PanelCard variant="darkNexus" accent="blue" className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <SectionHeader eyebrow="Queue" title="Sync queue" accent="blue" />
                        <div className="flex flex-wrap gap-3">
                            <AppBadge variant="blue">{syncQueue.length} items</AppBadge>
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
                            <p className="bg-black/25 p-4 text-sm text-slate-400">No sync queue items.</p>
                        ) : (
                            <div className="divide-y divide-white/[0.06]">
                                {latestQueueItems.map((item) => (
                                    <div key={item.id} className="grid gap-2 bg-black/25 p-4 text-sm md:grid-cols-[1fr_auto_auto] md:items-center">
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

                <section className="grid gap-6 lg:grid-cols-2">
                    <PanelCard variant="darkNexus" accent="blue" className="p-6">
                        <SectionHeader eyebrow="Backup" title="Export local data" accent="blue" />
                        <div className="mt-5 flex flex-wrap gap-3">
                            <AppButton type="button" variant="primary" onClick={handleExport}>
                                Export local data
                            </AppButton>
                            <AppButton type="button" variant="secondary" onClick={handleCopy} disabled={!exportJson}>
                                Copy JSON
                            </AppButton>
                        </div>
                        <textarea
                            className="mt-5 min-h-80 w-full resize-y rounded-xl border border-white/[0.08] bg-black/35 p-4 font-mono text-xs text-slate-200 outline-none ring-blue-300/20 focus:ring-2"
                            value={exportJson}
                            onChange={(event) => setExportJson(event.target.value)}
                            spellCheck={false}
                        />
                    </PanelCard>

                    <PanelCard variant="darkNexus" accent="emerald" className="p-6">
                        <SectionHeader eyebrow="Restore" title="Import local data" accent="emerald" />
                        <textarea
                            className="mt-5 min-h-80 w-full resize-y rounded-xl border border-white/[0.08] bg-black/35 p-4 font-mono text-xs text-slate-200 outline-none ring-emerald-300/20 focus:ring-2"
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

                <PanelCard variant="darkNexus" accent="danger" className="p-6">
                    <SectionHeader eyebrow="Danger" title="Danger zone" accent="danger" />
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
    return (
        <div className="rounded-xl border border-white/[0.07] bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <div className="mt-3">
                <AppBadge variant={tone}>{value}</AppBadge>
            </div>
        </div>
    );
}
