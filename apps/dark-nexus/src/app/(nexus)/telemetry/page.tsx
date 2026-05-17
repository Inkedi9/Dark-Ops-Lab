"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Activity,
    ArrowLeft,
    ArrowUpRight,
    BadgeCheck,
    BookOpen,
    Clock3,
    Crosshair,
    Gauge,
    Layers,
    RadioTower,
    Route,
    ShieldCheck,
    Sparkles,
    Target,
    Terminal,
    Trophy,
    UserCircle,
} from "lucide-react";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import PanelCard from "@dark/ui/components/PanelCard";
import ProgressBar from "@dark/ui/components/ProgressBar";
import NexusBackground from "@dark/ui/components/NexusBackground";
import { exportAllDarkData } from "@dark/progress/debug";
import { getGlobalProfile } from "@dark/profile";
import {
    getProgress,
    getProgressTelemetry,
    getSyncQueue,
    progressNamespaces,
} from "@dark/progress";
import { getRecommendedActions } from "@/lib/recommendations";
import { getGlobalBadges } from "@/lib/badges";
import { getEcosystemMilestones } from "@/lib/milestones";
import { getOperatorPaths } from "@/lib/operatorPaths";
import { getUnlockChains } from "@/lib/progression";
import { useSupabaseBootstrapSync } from "@/hooks/useSupabaseBootstrapSync";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import type { AppProgressState, AppTone, GlobalProfile, ProgressEvent, SyncQueueItem } from "@dark/types";
import type { BadgeRarity, GlobalBadge } from "@/lib/badges";
import type { EcosystemMilestone, EcosystemMilestonesResult } from "@/lib/milestones";
import type { OperatorPath } from "@/lib/operatorPaths";
import type { UnlockChain } from "@/lib/progression";
import type { RecommendedAction } from "@/lib/recommendations";

type DashboardState = {
    profile: GlobalProfile | null;
    telemetry: ProgressTelemetrySnapshot;
    progress: Record<string, AppProgressState>;
    syncQueue: SyncQueueItem[];
    exportedAt: string | null;
    capturedAt: string;
};

type EcosystemCard = {
    namespace: string;
    title: string;
    accent: "blue" | "emerald" | "violet" | "amber";
    eventsCount: number;
    lastActivity: string | null;
    mainMetric: string;
    subMetric: string;
    progress: number;
};

type ProgressTelemetrySnapshot = ReturnType<typeof getProgressTelemetry>;

const GOALS = {
    lessons: 12,
    challenges: 7,
    defend: 6,
    quizzes: 8,
};

const emptyTelemetry: ProgressTelemetrySnapshot = {
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

function clampPercent(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function completionPercent(value: number, total: number) {
    if (total <= 0) return 0;
    return clampPercent((value / total) * 100);
}

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

function formatRelative(value?: string | null, nowValue?: string) {
    if (!value) return "No activity yet";

    const now = nowValue ? new Date(nowValue).getTime() : Date.now();
    const elapsed = Math.max(0, now - new Date(value).getTime());
    const minutes = Math.floor(elapsed / 60000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 14) return `${days}d ago`;

    return formatDate(value);
}

function titleCase(value: string) {
    return value
        .replace(/[_:-]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
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

function getEventSyncStatus(event: ProgressEvent, queue: SyncQueueItem[]) {
    const queueItem = queue.find((item) => item.idempotencyKey === event.idempotencyKey);
    return queueItem?.status || "local";
}

function getEventIcon(event: ProgressEvent) {
    if (event.namespace === "splaining") return BookOpen;
    if (event.type === "ctf_completed") return Trophy;
    if (event.type === "warzone_completed") return Crosshair;
    if (event.namespace === "challenges") return Target;
    if (event.namespace === "defend") return ShieldCheck;
    if (event.namespace === "nexus") return RadioTower;
    return Activity;
}

function describeEvent(event: ProgressEvent) {
    const entity = titleCase(
        String(event.payload?.slug || event.payload?.lessonId || event.payload?.entityId || event.entityId || "activity"),
    );

    if (event.type === "lesson_completed") return `Completed ${entity} lesson`;
    if (event.type === "quiz_completed") return `Completed ${entity} quiz`;
    if (event.type === "challenge_completed") return `Cleared ${entity} challenge`;
    if (event.type === "ctf_completed") return `Captured ${entity} CTF`;
    if (event.type === "warzone_completed") return `Cleared ${entity} warzone`;
    if (event.type === "phishing_analyzed") return `Analyzed ${entity} phishing scenario`;
    if (event.type === "incident_generated") return `Generated ${entity} incident`;
    if (event.type === "xp_awarded") return `Awarded ${event.payload?.amount || event.payload?.xp || 0} XP`;

    return titleCase(event.type);
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
        capturedAt: new Date().toISOString(),
    };
}

function buildEcosystemCards(state: DashboardState): EcosystemCard[] {
    const splainingEvents = state.progress.splaining?.events || [];
    const challengeEvents = state.progress.challenges?.events || [];
    const defendEvents = state.progress.defend?.events || [];
    const nexusEvents = state.progress.nexus?.events || [];
    const challengeTotal =
        challengeEvents.filter(isChallengeCompletionEvent).length +
        challengeEvents.filter(isCtfCompletionEvent).length +
        challengeEvents.filter(isWarzoneCompletionEvent).length;

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
            progress: completionPercent(countEvents(splainingEvents, "lesson_completed"), GOALS.lessons),
        },
        {
            namespace: "challenges",
            title: "DarkChallenges",
            accent: "violet",
            eventsCount: challengeEvents.length,
            lastActivity: getLastActivity(challengeEvents),
            mainMetric: `${challengeEvents.filter(isChallengeCompletionEvent).length} challenges`,
            subMetric: `${challengeEvents.filter(isCtfCompletionEvent).length} CTF / ${challengeEvents.filter(isWarzoneCompletionEvent).length} warzones`,
            progress: completionPercent(challengeTotal, GOALS.challenges),
        },
        {
            namespace: "defend",
            title: "DarkDefend",
            accent: "emerald",
            eventsCount: defendEvents.length,
            lastActivity: getLastActivity(defendEvents),
            mainMetric: `${countEvents(defendEvents, "phishing_analyzed")} analyses`,
            subMetric: `${countEvents(defendEvents, "incident_generated")} incidents generated`,
            progress: completionPercent(countEvents(defendEvents, "phishing_analyzed"), GOALS.defend),
        },
        {
            namespace: "nexus",
            title: "DarkOps",
            accent: "amber",
            eventsCount: nexusEvents.length,
            lastActivity: getLastActivity(nexusEvents),
            mainMetric: `${pendingQueue} pending`,
            subMetric: `${syncedQueue} synced queue items`,
            progress: pendingQueue === 0 ? 100 : 45,
        },
    ];
}

function getXpProgress(profile: GlobalProfile | null, telemetry: ProgressTelemetrySnapshot) {
    const level = profile?.level || 1;
    const xp = profile?.xp ?? telemetry.totalXp;
    const levelBase = Math.max(0, (level - 1) * 100);
    return clampPercent(((xp - levelBase) / 100) * 100);
}

function getInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "OP";
}

function getRecommendationAccent(app: RecommendedAction["app"]): AppTone {
    if (app === "DarkChallenges") return "violet";
    if (app === "DarkDefend") return "emerald";
    if (app === "DarkOps") return "amber";
    return "blue";
}

function getPathAccent(pathId: OperatorPath["id"]): AppTone {
    if (pathId === "defense-analyst") return "emerald";
    if (pathId === "hybrid-operator") return "blue";
    if (pathId === "recon-specialist") return "amber";
    if (pathId === "web-security-operator") return "blue";
    return "violet";
}

function getBadgeTone(rarity: BadgeRarity): AppTone {
    if (rarity === "legendary") return "amber";
    if (rarity === "epic") return "violet";
    if (rarity === "rare") return "blue";
    return "emerald";
}

function BadgeBrief({ badge }: { badge: GlobalBadge }) {
    return (
        <div
            className={[
                "rounded-2xl border p-4",
                badge.unlocked
                    ? "border-emerald-300/16 bg-emerald-300/[0.055]"
                    : "border-white/[0.07] bg-white/[0.025]",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <AppBadge variant={getBadgeTone(badge.rarity)}>{badge.rarity}</AppBadge>
                    <h3 className="mt-3 font-black text-white">{badge.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{badge.description}</p>
                </div>
                {badge.unlocked ? (
                    <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-200" />
                ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        locked
                    </span>
                )}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {badge.category}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {badge.progress.label}
                </span>
            </div>
            {!badge.unlocked && <ProgressBar value={badge.progress.percent} className="mt-3 h-1.5" />}
        </div>
    );
}

function OperatorPathBrief({ path }: { path: OperatorPath }) {
    const accent = getPathAccent(path.id);
    const action = path.recommendedActions[0];

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p className="font-bold text-white">{path.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                        {action?.title || "Career track stabilized"}
                    </p>
                </div>
                <AppBadge variant={accent}>{path.affinity}%</AppBadge>
            </div>
            <ProgressBar value={path.progression} />
            <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <span>Progression</span>
                <span>{path.progression}%</span>
            </div>
        </div>
    );
}

function getChainAppTone(app: "DarkSplaining" | "DarkChallenges" | "DarkDefend"): AppTone {
    if (app === "DarkChallenges") return "violet";
    if (app === "DarkDefend") return "emerald";
    return "blue";
}

function ChainBrief({ chain }: { chain: UnlockChain }) {
    const nextAction = chain.currentRecommendedAction;

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <AppBadge variant={chain.completed ? "emerald" : "violet"}>
                        {chain.completedSteps}/{chain.totalSteps} steps
                    </AppBadge>
                    <h3 className="mt-3 font-black text-white">{chain.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{chain.description}</p>
                </div>
                <span className="font-mono text-sm font-black text-blue-100">{chain.progress}%</span>
            </div>
            <ProgressBar value={chain.progress} className="mt-4 h-2" />
            <div className="mt-4 flex flex-wrap gap-2">
                {chain.steps.map((step) => (
                    <AppBadge key={step.id} variant={step.completed ? "emerald" : getChainAppTone(step.app)}>
                        {step.completed ? "done" : step.title}
                    </AppBadge>
                ))}
            </div>
            <div className="mt-4 rounded-xl border border-blue-300/12 bg-blue-300/[0.04] p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Next unlock
                </p>
                <p className="mt-1 text-sm font-bold text-white">{chain.nextUnlock || chain.unlockedRewards.join(", ")}</p>
                {nextAction && (
                    <AppButton href={nextAction.href} variant="nexus" className="mt-3 w-full">
                        {nextAction.label}
                    </AppButton>
                )}
            </div>
        </div>
    );
}

function getMilestoneTone(category: EcosystemMilestone["category"]): AppTone {
    if (category === "offense") return "violet";
    if (category === "defense") return "emerald";
    if (category === "sync" || category === "specialization") return "amber";
    return "blue";
}

function MilestonesBrief({ result }: { result: EcosystemMilestonesResult }) {
    const nextMilestone = result.nextMilestone;

    return (
        <PanelCard
            variant="darkOps"
            accent="blue"
            className="border-blue-300/12 bg-[linear-gradient(180deg,rgba(96,165,250,0.085),rgba(3,7,18,0.78))] p-6"
        >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <AppBadge variant="blue">Ecosystem Milestones</AppBadge>
                    <h2 className="mt-4 text-2xl font-black text-white">Global progression markers</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    <AppBadge variant="emerald">{result.completedCount}/{result.totalCount} complete</AppBadge>
                    <AppBadge variant="violet">{result.ecosystemCompletion}% ecosystem</AppBadge>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-2xl border border-blue-300/12 bg-blue-300/[0.045] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                        Next milestone
                    </p>
                    <h3 className="mt-3 text-xl font-black text-white">
                        {nextMilestone?.title || "All milestones complete"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        {nextMilestone?.description || "The current V1 ecosystem milestone set is complete."}
                    </p>
                    {nextMilestone && (
                        <>
                            <div className="mt-4 flex items-center justify-between">
                                <AppBadge variant={getMilestoneTone(nextMilestone.category)}>
                                    {nextMilestone.category}
                                </AppBadge>
                                <span className="font-mono text-xs text-slate-500">{nextMilestone.progress.label}</span>
                            </div>
                            <ProgressBar value={nextMilestone.progress.percent} className="mt-3 h-2" />
                        </>
                    )}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    {result.milestones.slice(0, 6).map((milestone) => (
                        <div
                            key={milestone.id}
                            className={[
                                "rounded-2xl border p-4",
                                milestone.completed
                                    ? "border-emerald-300/14 bg-emerald-300/[0.045]"
                                    : "border-white/[0.07] bg-white/[0.025]",
                            ].join(" ")}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-black text-white">{milestone.title}</h3>
                                <AppBadge variant={milestone.completed ? "emerald" : getMilestoneTone(milestone.category)}>
                                    {milestone.completed ? "done" : milestone.progress.label}
                                </AppBadge>
                            </div>
                            <ProgressBar value={milestone.progress.percent} className="mt-3 h-1.5" />
                        </div>
                    ))}
                </div>
            </div>
        </PanelCard>
    );
}

function MetricPill({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string | number;
    icon: typeof Activity;
}) {
    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    {label}
                </p>
                <Icon className="h-4 w-4 text-blue-200" />
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-white">{value}</p>
        </div>
    );
}

function ProgressRow({
    label,
    value,
    detail,
}: {
    label: string;
    value: number;
    detail: string;
}) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-slate-200">{label}</span>
                <span className="font-mono text-xs text-slate-500">{value}%</span>
            </div>
            <ProgressBar value={value} />
            <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
    );
}

function StatusRow({
    label,
    value,
    good,
}: {
    label: string;
    value: string | number;
    good: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-black/25 px-4 py-3">
            <span className="text-sm text-slate-400">{label}</span>
            <AppBadge variant={good ? "emerald" : "default"}>{String(value)}</AppBadge>
        </div>
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
            .slice(0, 12);
    }, [state]);
    const recommendations = useMemo(
        () =>
            getRecommendedActions(state?.profile, {
                ...(state?.telemetry || emptyTelemetry),
                progress: state?.progress,
                sync: {
                    configured: supabaseConfigured,
                    authenticated: Boolean(user),
                    pendingQueue,
                },
            }),
        [pendingQueue, state, supabaseConfigured, user],
    );
    const globalBadges = useMemo(
        () =>
            getGlobalBadges(state?.profile, {
                ...(state?.telemetry || emptyTelemetry),
                progress: state?.progress,
                sync: {
                    configured: supabaseConfigured,
                    authenticated: Boolean(user),
                },
            }),
        [state, supabaseConfigured, user],
    );
    const unlockChains = useMemo(
        () =>
            getUnlockChains(
                {
                    ...(state?.telemetry || emptyTelemetry),
                    progress: state?.progress,
                },
                state?.profile,
            ),
        [state],
    );
    const milestones = useMemo(
        () =>
            getEcosystemMilestones(
                {
                    ...(state?.telemetry || emptyTelemetry),
                    progress: state?.progress,
                    sync: {
                        configured: supabaseConfigured,
                        authenticated: Boolean(user),
                    },
                },
                state?.profile,
        ),
        [state, supabaseConfigured, user],
    );
    const operatorPaths = useMemo(
        () =>
            getOperatorPaths(state?.profile, {
                ...(state?.telemetry || emptyTelemetry),
                progress: state?.progress,
                sync: {
                    configured: supabaseConfigured,
                    authenticated: Boolean(user),
                    pendingQueue,
                },
            }),
        [pendingQueue, state, supabaseConfigured, user],
    );
    const primaryPath = operatorPaths[0];
    const unlockedBadges = globalBadges.filter((badge) => badge.unlocked);
    const lockedBadges = globalBadges
        .filter((badge) => !badge.unlocked)
        .sort((left, right) => right.progress.percent - left.progress.percent)
        .slice(0, 3);
    const lastSyncTimestamp = queue
        .map((item) => item.syncedAt)
        .filter(Boolean)
        .sort()
        .at(-1) || bootstrapResult?.timestamp || null;
    const operatorName = profile?.username || user?.email?.split("@")[0] || "Nexus Operator";
    const rank = profile?.rank || "ROOKIE";
    const level = profile?.level || 1;
    const xp = profile?.xp ?? telemetry.totalXp;
    const xpProgress = getXpProgress(profile || null, telemetry);
    const activeModules = ecosystemCards.filter((card) => card.eventsCount > 0).length;
    const overallCompletion = clampPercent(
        (completionPercent(telemetry.lessonsCompleted, GOALS.lessons) +
            completionPercent(telemetry.challengesCompleted + telemetry.ctfCompleted + telemetry.warzoneCompleted, GOALS.challenges) +
            completionPercent(telemetry.phishingAnalyses, GOALS.defend) +
            completionPercent(telemetry.quizzesCompleted, GOALS.quizzes)) /
            4,
    );
    const currentFocus = primaryPath?.recommendedActions[0]?.title || recommendations[0]?.app || (activeModules > 0 ? "Maintain momentum" : "Start the loop");
    const syncState = user ? (pendingQueue > 0 ? "Sync pending" : "Cloud ready") : "Local-first";
    const specializationName = primaryPath?.title || "Hybrid Operator";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080d1a] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <NexusBackground />
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
                <Link
                    href="/"
                    className="inline-flex w-fit items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Command
                </Link>

                <PanelCard variant="darkOpsHero" accent="violet" className="p-6 lg:p-7">
                    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
                        <div className="flex flex-col justify-between gap-7">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-3xl border border-blue-300/20 bg-blue-300/[0.08] text-3xl font-black text-blue-100 shadow-[0_0_45px_rgba(96,165,250,.08)]">
                                    <UserCircle className="absolute h-16 w-16 text-blue-200/15" />
                                    <span className="relative">{getInitials(operatorName)}</span>
                                </div>
                                <div className="min-w-0">
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        <AppBadge variant="violet">Operator Status</AppBadge>
                                        <AppBadge variant={pendingQueue > 0 ? "amber" : "emerald"}>{syncState}</AppBadge>
                                    </div>
                                    <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                                        {operatorName}
                                    </h1>
                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                                        Cyber command telemetry, learning velocity, defensive readiness, and mission queue in one operator cockpit.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500">
                                            XP progression
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-slate-300">
                                            {xp} XP / Level {level}
                                        </p>
                                    </div>
                                    <AppBadge variant="blue">{rank}</AppBadge>
                                </div>
                                <ProgressBar value={xpProgress} className="h-3" />
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <MetricPill label="Rank" value={rank} icon={Trophy} />
                            <MetricPill label="Level" value={level} icon={Sparkles} />
                            <MetricPill label="Active Modules" value={`${activeModules}/4`} icon={Layers} />
                            <MetricPill label="Current Focus" value={currentFocus} icon={Crosshair} />
                            <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-4 sm:col-span-2">
                                <div className="grid gap-3 md:grid-cols-3">
                                    <StatusRow label="Specialization" value={specializationName} good />
                                    <StatusRow label="Last activity" value={formatRelative(telemetry.lastActivity, state?.capturedAt)} good={Boolean(telemetry.lastActivity)} />
                                    <StatusRow label="Mode" value={user ? "Cloud-linked" : "Local-first"} good />
                                </div>
                            </div>
                        </div>
                    </div>
                </PanelCard>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <MetricPill label="Overall Completion" value={`${overallCompletion}%`} icon={Gauge} />
                    <MetricPill label="Lessons" value={telemetry.lessonsCompleted} icon={BookOpen} />
                    <MetricPill label="Challenges" value={telemetry.challengesCompleted} icon={Target} />
                    <MetricPill label="Incidents Analyzed" value={telemetry.phishingAnalyses} icon={ShieldCheck} />
                    <MetricPill label="Streak" value={`${telemetry.streak}d`} icon={RadioTower} />
                </section>

                <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                    <PanelCard variant="darkOps" accent="blue" className="p-6">
                        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <AppBadge variant="blue">Ecosystem Progression</AppBadge>
                                <h2 className="mt-4 text-2xl font-black text-white">Operational readiness</h2>
                            </div>
                            <AppBadge variant="violet">{overallCompletion}% ecosystem</AppBadge>
                        </div>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <ProgressRow label="Splaining progression" value={completionPercent(telemetry.lessonsCompleted, GOALS.lessons)} detail={`${telemetry.lessonsCompleted} lessons / ${telemetry.quizzesCompleted} quizzes`} />
                            <ProgressRow label="Challenges progression" value={completionPercent(telemetry.challengesCompleted + telemetry.ctfCompleted + telemetry.warzoneCompleted, GOALS.challenges)} detail={`${telemetry.challengesCompleted} challenges / ${telemetry.ctfCompleted} CTF / ${telemetry.warzoneCompleted} warzones`} />
                            <ProgressRow label="Defend progression" value={completionPercent(telemetry.phishingAnalyses, GOALS.defend)} detail={`${telemetry.phishingAnalyses} phishing analyses`} />
                            <ProgressRow label="Knowledge checks" value={completionPercent(telemetry.quizzesCompleted, GOALS.quizzes)} detail={`${telemetry.quizzesCompleted} quizzes completed`} />
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkOpsHero" accent="emerald" className="p-6">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <AppBadge variant="emerald">Recommended Next Actions</AppBadge>
                                <h2 className="mt-4 text-2xl font-black text-white">Next best moves</h2>
                            </div>
                            <Terminal className="h-5 w-5 text-emerald-200" />
                        </div>
                        <div className="space-y-3">
                            {recommendations.map((item) => (
                                <div key={item.title} className="rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <AppBadge variant={getRecommendationAccent(item.app)}>{item.app}</AppBadge>
                                            <h3 className="mt-3 text-base font-black text-white">{item.title}</h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                                            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                                P{item.priority} / {item.reason}
                                            </p>
                                        </div>
                                        <AppButton href={item.href} variant="nexus" className="shrink-0 gap-2 px-3 py-2">
                                            <span className="hidden sm:inline">{item.ctaLabel}</span>
                                            <ArrowUpRight className="h-4 w-4" />
                                        </AppButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PanelCard>
                </section>

                <PanelCard
                    variant="darkOps"
                    accent="emerald"
                    className="border-emerald-300/12 bg-[linear-gradient(180deg,rgba(16,185,129,0.09),rgba(3,7,18,0.78))] p-6"
                >
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <AppBadge variant="emerald">Global Badges</AppBadge>
                            <h2 className="mt-4 text-2xl font-black text-white">Cross-app achievement signals</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <AppBadge variant="emerald">{unlockedBadges.length} unlocked</AppBadge>
                            <AppBadge variant="amber">{lockedBadges.length} next locked</AppBadge>
                        </div>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                        {(unlockedBadges.length > 0 ? unlockedBadges.slice(0, 3) : lockedBadges).map((badge) => (
                            <BadgeBrief key={badge.id} badge={badge} />
                        ))}
                    </div>
                    {unlockedBadges.length > 0 && lockedBadges.length > 0 && (
                        <div className="mt-4 grid gap-4 lg:grid-cols-3">
                            {lockedBadges.map((badge) => (
                                <BadgeBrief key={badge.id} badge={badge} />
                            ))}
                        </div>
                    )}
                </PanelCard>

                <MilestonesBrief result={milestones} />

                <PanelCard
                    variant="darkOps"
                    accent="violet"
                    className="border-violet-300/12 bg-[linear-gradient(180deg,rgba(124,58,237,0.09),rgba(3,7,18,0.78))] p-6"
                >
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <AppBadge variant="violet">Unlock Chains</AppBadge>
                            <h2 className="mt-4 text-2xl font-black text-white">Tactical progression map</h2>
                        </div>
                        <AppBadge variant="blue">{unlockChains.filter((chain) => chain.completed).length}/{unlockChains.length} complete</AppBadge>
                    </div>
                    <div className="grid gap-4 xl:grid-cols-4">
                        {unlockChains.map((chain) => (
                            <ChainBrief key={chain.id} chain={chain} />
                        ))}
                    </div>
                </PanelCard>

                <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                    <PanelCard variant="darkOps" accent="violet" className="p-6">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <AppBadge variant="violet">Operator Paths</AppBadge>
                                <h2 className="mt-4 text-2xl font-black text-white">Career tracks</h2>
                            </div>
                            <Route className="h-5 w-5 text-violet-200" />
                        </div>
                        <div className="space-y-4">
                            {operatorPaths.map((path) => (
                                <OperatorPathBrief key={path.id} path={path} />
                            ))}
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkOps" accent="blue" className="p-6">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <AppBadge variant="blue">Recent Activity Timeline</AppBadge>
                                <h2 className="mt-4 text-2xl font-black text-white">Operator trail</h2>
                            </div>
                            <Clock3 className="h-5 w-5 text-blue-200" />
                        </div>

                        <div className="relative space-y-4 before:absolute before:bottom-4 before:left-5 before:top-4 before:w-px before:bg-white/[0.08]">
                            {activityFeed.length > 0 ? (
                                activityFeed.map((event) => {
                                    const Icon = getEventIcon(event);
                                    const syncStatus = getEventSyncStatus(event, queue);

                                    return (
                                        <article key={event.id} className="relative grid gap-3 pl-14">
                                            <span className="absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-xl border border-blue-300/20 bg-blue-300/[0.08] text-blue-100">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <p className="font-bold text-white">{describeEvent(event)}</p>
                                                    <AppBadge variant={syncStatus === "synced" ? "emerald" : syncStatus === "pending" ? "amber" : "default"}>
                                                        {syncStatus}
                                                    </AppBadge>
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                                                    <span>{event.namespace}</span>
                                                    <span>{formatRelative(event.timestamp, state?.capturedAt)}</span>
                                                    <span>{event.source}</span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-5 text-sm text-slate-400">
                                    No progress events yet. Start a lesson, run a challenge, or analyze a scenario to populate the trail.
                                </div>
                            )}
                        </div>
                    </PanelCard>
                </section>

                <section className="grid gap-5 lg:grid-cols-4">
                    {ecosystemCards.map((card) => (
                        <PanelCard
                            key={card.namespace}
                            variant="darkOps"
                            accent={card.accent}
                            hover
                            className="p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <AppBadge variant={card.accent}>active module</AppBadge>
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
                            <div className="mt-5">
                                <ProgressBar value={card.progress} />
                            </div>
                            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                Last activity
                            </p>
                            <p className="mt-2 text-sm text-slate-300">{formatRelative(card.lastActivity, state?.capturedAt)}</p>
                        </PanelCard>
                    ))}
                </section>

                <PanelCard variant="darkOpsHero" accent="amber" className="p-6">
                    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr_auto] lg:items-center">
                        <div>
                            <AppBadge variant="amber">Ecosystem Status</AppBadge>
                            <h2 className="mt-4 text-2xl font-black text-white">Sync and cache state</h2>
                            <p className="mt-2 text-sm text-slate-400">
                                Snapshot refreshed {formatDate(state?.exportedAt)}.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <StatusRow label="Cloud sync" value={supabaseConfigured ? bootstrapStatus : "not configured"} good={supabaseConfigured && (bootstrapStatus === "success" || bootstrapStatus === "skipped")} />
                            <StatusRow label="Queue" value={`${pendingQueue} pending`} good={pendingQueue === 0} />
                            <StatusRow label="Last sync" value={formatRelative(lastSyncTimestamp, state?.capturedAt)} good={Boolean(lastSyncTimestamp)} />
                            <StatusRow label="Modules active" value={`${activeModules}/4`} good={activeModules > 0} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <AppBadge variant={user ? "emerald" : "blue"}>
                                {sessionLoading ? "auth checking" : user ? "cloud-linked" : "local-first mode"}
                            </AppBadge>
                            <AppButton href="/data-settings" variant="primary">
                                Data & Sync
                            </AppButton>
                        </div>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <StatusRow label="Supabase" value={supabaseConfigured ? "configured" : "offline"} good={supabaseConfigured} />
                        <StatusRow label="Synced items" value={syncedQueue} good={syncedQueue > 0 || pendingQueue === 0} />
                        <StatusRow label="Storage mode" value="local-first" good />
                    </div>
                </PanelCard>
            </div>
        </main>
    );
}
