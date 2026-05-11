"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Activity,
    ArrowLeft,
    BadgeCheck,
    Flame,
    Gauge,
    RadioTower,
    ShieldCheck,
    Sparkles,
    Trophy,
} from "lucide-react";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import PageHeader from "@dark/ui/components/PageHeader";
import PanelCard from "@dark/ui/components/PanelCard";
import SectionHeader from "@dark/ui/components/SectionHeader";
import NexusBackground from "@dark/ui/components/NexusBackground";
import { exportAllDarkData } from "@dark/progress/debug";
import { getGlobalProfile } from "@dark/profile";
import {
    getProgress,
    getProgressTelemetry,
    getSyncQueue,
    progressNamespaces,
} from "@dark/progress";
import { useSupabaseBootstrapSync } from "@/hooks/useSupabaseBootstrapSync";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import type { AppProgressState, GlobalProfile, ProgressEvent, SyncQueueItem } from "@dark/types";

type DashboardState = {
    profile: GlobalProfile | null;
    telemetry: ReturnType<typeof getProgressTelemetry>;
    progress: Record<string, AppProgressState>;
    syncQueue: SyncQueueItem[];
    exportedAt: string | null;
};

type EcosystemCard = {
    namespace: string;
    title: string;
    accent: "blue" | "emerald" | "violet" | "amber";
    eventsCount: number;
    lastActivity: string | null;
    mainMetric: string;
    subMetric: string;
};

const emptyTelemetry = {
    lessonsCompleted: 0,
    challengesCompleted: 0,
    ctfCompleted: 0,
    warzoneCompleted: 0,
    phishingAnalyses: 0,
    quizzesCompleted: 0,
    totalXp: 0,
    badgesUnlocked: 0,
    streak: 0,
    lastActivity: null,
};

function formatDate(value?: string | null) {
    if (!value) return "No activity yet";

    try {
        return new Intl.DateTimeFormat("en", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function compactKey(value: string) {
    if (!value) return "none";
    return value.length > 34 ? `${value.slice(0, 16)}...${value.slice(-12)}` : value;
}

function countEvents(events: ProgressEvent[], type: string) {
    return events.filter((event) => event.type === type).length;
}

function isChallengeCompletionEvent(event: ProgressEvent) {
    return (
        event.namespace === "challenges" &&
        event.type === "challenge_completed" &&
        event.payload?.kind !== "ctf" &&
        event.payload?.kind !== "warzone" &&
        !String(event.entityId || "").startsWith("ctf:") &&
        !String(event.entityId || "").startsWith("warzone:")
    );
}

function isCtfCompletionEvent(event: ProgressEvent) {
    return (
        event.namespace === "challenges" &&
        (event.type === "ctf_completed" ||
            (event.type === "challenge_completed" &&
                (event.payload?.kind === "ctf" || String(event.entityId || "").startsWith("ctf:"))))
    );
}

function isWarzoneCompletionEvent(event: ProgressEvent) {
    return (
        event.namespace === "challenges" &&
        (event.type === "warzone_completed" ||
            (event.type === "challenge_completed" &&
                (event.payload?.kind === "warzone" || String(event.entityId || "").startsWith("warzone:"))))
    );
}

function getLastActivity(events: ProgressEvent[]) {
    return events
        .map((event) => event.timestamp)
        .filter(Boolean)
        .sort()
        .at(-1) || null;
}

function createDashboardState(): DashboardState {
    const dump = exportAllDarkData() as {
        exportedAt?: string;
        progress?: Record<string, AppProgressState>;
    };

    return {
        profile: getGlobalProfile(),
        telemetry: getProgressTelemetry(),
        progress: Object.fromEntries(
            progressNamespaces.map((namespace) => [namespace, getProgress(namespace)]),
        ),
        syncQueue: getSyncQueue(),
        exportedAt: dump.exportedAt || null,
    };
}

function buildEcosystemCards(state: DashboardState): EcosystemCard[] {
    const splainingEvents = state.progress.splaining?.events || [];
    const challengeEvents = state.progress.challenges?.events || [];
    const defendEvents = state.progress.defend?.events || [];
    const nexusEvents = state.progress.nexus?.events || [];

    const pendingQueue = state.syncQueue.filter((item) => item.status !== "synced").length;
    const syncedQueue = state.syncQueue.filter((item) => item.status === "synced").length;

    return [
        {
            namespace: "splaining",
            title: "DarkSplaining",
            accent: "blue",
            eventsCount: splainingEvents.length,
            lastActivity: getLastActivity(splainingEvents),
            mainMetric: `${countEvents(splainingEvents, "lesson_completed")} lessons`,
            subMetric: `${countEvents(splainingEvents, "quiz_completed")} quizzes completed`,
        },
        {
            namespace: "challenges",
            title: "DarkChallenge",
            accent: "violet",
            eventsCount: challengeEvents.length,
            lastActivity: getLastActivity(challengeEvents),
            mainMetric: `${challengeEvents.filter(isChallengeCompletionEvent).length} challenges`,
            subMetric: `${challengeEvents.filter(isCtfCompletionEvent).length} CTF / ${challengeEvents.filter(isWarzoneCompletionEvent).length} warzones`,
        },
        {
            namespace: "defend",
            title: "DarkDefend",
            accent: "emerald",
            eventsCount: defendEvents.length,
            lastActivity: getLastActivity(defendEvents),
            mainMetric: `${countEvents(defendEvents, "phishing_analyzed")} analyses`,
            subMetric: `${countEvents(defendEvents, "incident_generated")} incidents generated`,
        },
        {
            namespace: "nexus",
            title: "DarkNexus",
            accent: "amber",
            eventsCount: nexusEvents.length,
            lastActivity: getLastActivity(nexusEvents),
            mainMetric: `${pendingQueue} pending`,
            subMetric: `${syncedQueue} synced queue items`,
        },
    ];
}

function getEventSyncStatus(event: ProgressEvent, queue: SyncQueueItem[]) {
    const queueItem = queue.find((item) => item.idempotencyKey === event.idempotencyKey);
    return queueItem?.status || "local";
}

function StatTile({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string | number;
    icon: typeof Activity;
}) {
    return (
        <PanelCard variant="darkNexus" accent="blue" className="p-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-black tracking-tight text-white">
                        {value}
                    </p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/20 bg-blue-300/[0.08] text-blue-200">
                    <Icon className="h-5 w-5" />
                </span>
            </div>
        </PanelCard>
    );
}

export default function GlobalTelemetryPage() {
    const [state, setState] = useState<DashboardState | null>(null);
    const {
        configured: supabaseConfigured,
        loading: sessionLoading,
        user,
    } = useSupabaseSession();
    const {
        status: bootstrapStatus,
        result: bootstrapResult,
    } = useSupabaseBootstrapSync();

    useEffect(() => {
        const refreshTimer = window.setTimeout(() => {
            setState(createDashboardState());
        }, 0);

        return () => window.clearTimeout(refreshTimer);
    }, []);

    const telemetry = state?.telemetry || emptyTelemetry;
    const profile = state?.profile;
    const queue = state?.syncQueue || [];
    const pendingQueue = queue.filter((item) => item.status !== "synced").length;
    const syncedQueue = queue.filter((item) => item.status === "synced").length;
    const ecosystemCards = useMemo(
        () => (state ? buildEcosystemCards(state) : []),
        [state],
    );
    const activityFeed = useMemo(() => {
        if (!state) return [];

        return Object.values(state.progress)
            .flatMap((progress) => progress.events || [])
            .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
            .slice(0, 10);
    }, [state]);
    const lastSyncTimestamp = queue
        .map((item) => item.syncedAt)
        .filter(Boolean)
        .sort()
        .at(-1) || bootstrapResult?.timestamp || null;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080d1a] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
            <NexusBackground />
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
                <Link
                    href="/"
                    className="inline-flex w-fit items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Command
                </Link>

                <PageHeader
                    eyebrow="Telemetry"
                    title="Global Telemetry"
                    description="Unified local-first activity across the Dark ecosystem."
                    accent="violet"
                    badges={[
                        { label: "local-first", variant: "blue" },
                        { label: `${pendingQueue} pending sync`, variant: pendingQueue > 0 ? "amber" : "emerald" },
                        { label: `Auth ${sessionLoading ? "checking" : user ? "yes" : "no"}`, variant: user ? "emerald" : "slate" },
                    ]}
                />

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatTile label="Total XP" value={profile?.xp ?? telemetry.totalXp} icon={Sparkles} />
                    <StatTile label="Rank / Level" value={`${profile?.rank || "ROOKIE"} L${profile?.level || 1}`} icon={Trophy} />
                    <StatTile label="Lessons" value={telemetry.lessonsCompleted} icon={BadgeCheck} />
                    <StatTile label="Challenges" value={telemetry.challengesCompleted} icon={Gauge} />
                    <StatTile label="CTF" value={telemetry.ctfCompleted} icon={Trophy} />
                    <StatTile label="Warzones" value={telemetry.warzoneCompleted} icon={RadioTower} />
                    <StatTile label="Phishing analyses" value={telemetry.phishingAnalyses} icon={ShieldCheck} />
                    <StatTile label="Quizzes" value={telemetry.quizzesCompleted} icon={Activity} />
                    <StatTile label="Badges" value={telemetry.badgesUnlocked} icon={Flame} />
                    <StatTile label="Streak" value={`${telemetry.streak} days`} icon={RadioTower} />
                </section>

                <section className="grid gap-5 lg:grid-cols-4">
                    {ecosystemCards.map((card) => (
                        <PanelCard
                            key={card.namespace}
                            variant="darkNexus"
                            accent={card.accent}
                            hover
                            className="p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <AppBadge variant={card.accent}>local-first</AppBadge>
                                    <h2 className="mt-4 text-xl font-black tracking-tight text-white">
                                        {card.title}
                                    </h2>
                                </div>
                                <span className="font-mono text-xs text-slate-500">
                                    {card.eventsCount} events
                                </span>
                            </div>
                            <p className="mt-5 text-2xl font-black text-white">{card.mainMetric}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-400">{card.subMetric}</p>
                            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                Last activity
                            </p>
                            <p className="mt-2 text-sm text-slate-300">{formatDate(card.lastActivity)}</p>
                        </PanelCard>
                    ))}
                </section>

                <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
                    <PanelCard variant="darkNexus" accent="blue" className="p-6">
                        <SectionHeader
                            eyebrow="Activity"
                            title="Latest progress events"
                            description="The last 10 normalized events across Splaining, Challenge, Defend, and Nexus."
                            accent="blue"
                        />

                        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
                            {activityFeed.length > 0 ? (
                                activityFeed.map((event) => (
                                    <article
                                        key={event.id}
                                        className="grid gap-4 py-4 md:grid-cols-[160px_1fr_auto] md:items-center"
                                    >
                                        <div>
                                            <AppBadge variant="slate">{event.namespace}</AppBadge>
                                            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                                {formatDate(event.timestamp)}
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-mono text-sm font-black text-white">
                                                {event.type}
                                            </p>
                                            <p className="mt-1 truncate text-sm text-slate-400">
                                                {event.entityId || "global"}
                                            </p>
                                            <p className="mt-2 truncate font-mono text-[11px] text-slate-500">
                                                {compactKey(event.idempotencyKey)}
                                            </p>
                                        </div>
                                        <AppBadge
                                            variant={getEventSyncStatus(event, queue) === "synced" ? "emerald" : "amber"}
                                        >
                                            {getEventSyncStatus(event, queue)}
                                        </AppBadge>
                                    </article>
                                ))
                            ) : (
                                <div className="py-8 text-sm text-slate-400">
                                    No progress events yet. Complete a lesson, challenge, or analysis to populate this feed.
                                </div>
                            )}
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkNexusHero" accent="violet" className="p-6">
                        <SectionHeader
                            eyebrow="Sync health"
                            title="Local to Supabase"
                            description="Nexus can push local-first data when authentication is available."
                            accent="violet"
                        />

                        <div className="mt-6 space-y-3">
                            <HealthRow label="Supabase configured" value={supabaseConfigured ? "yes" : "no"} good={supabaseConfigured} />
                            <HealthRow label="Authenticated" value={user ? "yes" : "no"} good={Boolean(user)} />
                            <HealthRow label="Bootstrap" value={bootstrapStatus} good={bootstrapStatus === "success" || bootstrapStatus === "skipped"} />
                            <HealthRow label="Queue pending" value={pendingQueue} good={pendingQueue === 0} />
                            <HealthRow label="Queue synced" value={syncedQueue} good={syncedQueue > 0} />
                            <HealthRow label="Last activity" value={formatDate(telemetry.lastActivity)} good={Boolean(telemetry.lastActivity)} />
                            <HealthRow label="Last sync" value={formatDate(lastSyncTimestamp)} good={Boolean(lastSyncTimestamp)} />
                        </div>

                        <div className="mt-6 rounded-xl border border-white/[0.07] bg-black/25 p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                Local cache
                            </p>
                            <p className="mt-2 text-sm text-slate-300">
                                Snapshot refreshed {formatDate(state?.exportedAt)}.
                            </p>
                        </div>

                        <AppButton href="/data-settings" variant="primary" className="mt-6 w-full">
                            Open Data & Sync settings
                        </AppButton>
                    </PanelCard>
                </section>
            </div>
        </main>
    );
}

function HealthRow({
    label,
    value,
    good,
}: {
    label: string;
    value: string | number;
    good: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
            <span className="text-sm text-slate-400">{label}</span>
            <AppBadge variant={good ? "emerald" : "slate"}>{String(value)}</AppBadge>
        </div>
    );
}
