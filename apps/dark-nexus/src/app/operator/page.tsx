"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    BadgeCheck,
    BookOpen,
    CalendarDays,
    Crosshair,
    Fingerprint,
    Flame,
    Gauge,
    GitBranch,
    Lock,
    Radar,
    Route,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    UserCircle,
} from "lucide-react";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import ProgressBar from "@dark/ui/components/ProgressBar";
import { getGlobalProfile } from "@dark/profile";
import { getProgress, getProgressTelemetry, progressNamespaces } from "@dark/progress";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { getGlobalBadges } from "@/lib/badges";
import { getEcosystemMilestones } from "@/lib/milestones";
import { getOperatorPaths } from "@/lib/operatorPaths";
import { getUnlockChains } from "@/lib/progression";
import { getRecommendedActions } from "@/lib/recommendations";
import type { BadgeRarity, GlobalBadge } from "@/lib/badges";
import type { EcosystemMilestone, EcosystemMilestonesResult } from "@/lib/milestones";
import type { OperatorPath } from "@/lib/operatorPaths";
import type { UnlockChain } from "@/lib/progression";
import type { RecommendedAction } from "@/lib/recommendations";
import type { AppProgressState, AppTone, GlobalProfile, ProgressEvent } from "@dark/types";

type OperatorState = {
    profile: GlobalProfile | null;
    telemetry: ReturnType<typeof getProgressTelemetry>;
    progress: Record<string, AppProgressState>;
    capturedAt: string;
};

type TimelineItem = {
    label: string;
    detail: string;
    timestamp: string | null;
    icon: typeof BookOpen;
    accent: "blue" | "emerald" | "violet" | "amber";
};

const emptyTelemetry: ReturnType<typeof getProgressTelemetry> = {
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

function formatDate(value?: string | null) {
    if (!value) return "Unknown";

    try {
        return new Intl.DateTimeFormat("en", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function formatRelative(value?: string | null, nowValue?: string) {
    if (!value) return "No signal";

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

function getAllEvents(state: OperatorState | null) {
    if (!state) return [];

    return Object.values(state.progress)
        .flatMap((progress) => progress.events || [])
        .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
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

function createOperatorState(): OperatorState {
    return {
        profile: getGlobalProfile(),
        telemetry: getProgressTelemetry(),
        progress: Object.fromEntries(
            progressNamespaces.map((namespace) => [namespace, getProgress(namespace)]),
        ),
        capturedAt: new Date().toISOString(),
    };
}

function getInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "OP";
}

function getTimeline(state: OperatorState | null): TimelineItem[] {
    const events = getAllEvents(state);
    const firstLesson = events.find((event) => event.type === "lesson_completed");
    const firstChallenge = events.find(isChallengeCompletionEvent);
    const firstPhishing = events.find((event) => event.type === "phishing_analyzed");
    const latest = events.at(-1);
    const badge = events.find((event) => event.type === "badge_awarded");

    return [
        {
            label: "First lesson",
            detail: firstLesson ? titleCase(String(firstLesson.entityId)) : "Awaiting first learning signal",
            timestamp: firstLesson?.timestamp || null,
            icon: BookOpen,
            accent: "blue",
        },
        {
            label: "First challenge",
            detail: firstChallenge ? titleCase(String(firstChallenge.payload?.slug || firstChallenge.entityId)) : "No challenge cleared yet",
            timestamp: firstChallenge?.timestamp || null,
            icon: Target,
            accent: "violet",
        },
        {
            label: "First phishing analysis",
            detail: firstPhishing ? titleCase(String(firstPhishing.entityId)) : "No defense analysis recorded",
            timestamp: firstPhishing?.timestamp || null,
            icon: ShieldCheck,
            accent: "emerald",
        },
        {
            label: "Milestone unlock",
            detail: badge ? titleCase(String(badge.payload?.badge || badge.entityId)) : "Next badge slot locked",
            timestamp: badge?.timestamp || null,
            icon: Trophy,
            accent: "amber",
        },
        {
            label: "Latest activity",
            detail: latest ? titleCase(latest.type) : "No telemetry events yet",
            timestamp: latest?.timestamp || null,
            icon: Radar,
            accent: "blue",
        },
    ];
}

function getAffinities(state: OperatorState | null) {
    const events = getAllEvents(state);
    const telemetry = state?.telemetry || emptyTelemetry;
    const webSignals = events.filter((event) =>
        /sql|xss|web|injection|auth|oauth/.test(String(`${event.entityId} ${event.payload?.slug || ""}`).toLowerCase()),
    ).length;
    const identitySignals = events.filter((event) =>
        /auth|oauth|identity|access|token/.test(String(`${event.entityId} ${event.payload?.slug || ""}`).toLowerCase()),
    ).length;
    const reconSignals = events.filter((event) =>
        /recon|internal|breach|warzone|ctf/.test(String(`${event.entityId} ${event.payload?.kind || ""}`).toLowerCase()),
    ).length;

    return [
        { label: "Web", value: clampPercent(webSignals * 22), accent: "blue" },
        { label: "Offensive", value: clampPercent((telemetry.challengesCompleted + telemetry.ctfCompleted + telemetry.warzoneCompleted) * 18), accent: "violet" },
        { label: "Defense", value: clampPercent(telemetry.phishingAnalyses * 20), accent: "emerald" },
        { label: "Identity", value: clampPercent(identitySignals * 25), accent: "amber" },
        { label: "Recon", value: clampPercent(reconSignals * 28), accent: "violet" },
    ] as const;
}

function StatTile({
    label,
    value,
    icon: Icon,
    tone = "blue",
}: {
    label: string;
    value: string | number;
    icon: typeof BookOpen;
    tone?: "blue" | "emerald" | "violet" | "amber";
}) {
    const toneClass = {
        blue: "border-blue-300/14 bg-blue-300/[0.045] text-blue-200",
        emerald: "border-emerald-300/14 bg-emerald-300/[0.045] text-emerald-200",
        violet: "border-violet-300/14 bg-violet-300/[0.045] text-violet-200",
        amber: "border-amber-300/14 bg-amber-300/[0.045] text-amber-200",
    }[tone];

    return (
        <div className={`rounded-2xl border p-4 ${toneClass}`}>
            <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    {label}
                </span>
                <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-black text-white">{value}</p>
        </div>
    );
}

function AffinityBar({
    label,
    value,
    accent,
}: {
    label: string;
    value: number;
    accent: "blue" | "emerald" | "violet" | "amber";
}) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-slate-200">{label}</span>
                <AppBadge variant={accent}>{value}%</AppBadge>
            </div>
            <ProgressBar value={value} />
        </div>
    );
}

function BadgeChip({
    badge,
}: {
    badge: GlobalBadge;
}) {
    const rarityClass =
        badge.rarity === "legendary"
            ? "border-amber-300/30 bg-amber-400/[0.10] text-amber-100"
            : badge.rarity === "epic"
                ? "border-violet-300/30 bg-violet-400/[0.10] text-violet-100"
                : badge.rarity === "rare"
                    ? "border-blue-300/30 bg-blue-400/[0.10] text-blue-100"
                    : badge.rarity === "uncommon"
                        ? "border-emerald-300/28 bg-emerald-400/[0.09] text-emerald-100"
                    : "border-emerald-300/25 bg-emerald-400/[0.08] text-emerald-100";

    return (
        <div
            className={[
                "rounded-2xl border px-4 py-3",
                badge.unlocked ? rarityClass : "border-white/[0.06] bg-white/[0.025] text-slate-500",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.18em]">{badge.title}</span>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{badge.description}</p>
                </div>
                {badge.unlocked ? <BadgeCheck className="h-4 w-4 shrink-0" /> : <Lock className="h-4 w-4 shrink-0" />}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {badge.rarity}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {badge.progress.label}
                </span>
            </div>
            {!badge.unlocked && <ProgressBar value={badge.progress.percent} className="mt-3 h-1.5" />}
        </div>
    );
}

function timelineToneClass(accent: "blue" | "emerald" | "violet" | "amber") {
    return {
        blue: "border-blue-300/12 bg-blue-300/[0.045]",
        emerald: "border-emerald-300/12 bg-emerald-300/[0.045]",
        violet: "border-violet-300/12 bg-violet-300/[0.045]",
        amber: "border-amber-300/12 bg-amber-300/[0.045]",
    }[accent];
}

function getRecommendationAccent(app: RecommendedAction["app"]): AppTone {
    if (app === "DarkChallenges") return "violet";
    if (app === "DarkDefend") return "emerald";
    if (app === "DarkNexus") return "amber";
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

function getAppTone(app: "DarkSplaining" | "DarkChallenges" | "DarkDefend"): AppTone {
    if (app === "DarkChallenges") return "violet";
    if (app === "DarkDefend") return "emerald";
    return "blue";
}

function ChainBlock({ chain }: { chain: UnlockChain }) {
    return (
        <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <AppBadge variant={chain.completed ? "emerald" : "violet"}>
                        {chain.completedSteps}/{chain.totalSteps} steps
                    </AppBadge>
                    <h3 className="mt-3 text-lg font-black text-white">{chain.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{chain.description}</p>
                </div>
                <span className="font-mono text-sm font-black text-blue-100">{chain.progress}%</span>
            </div>

            <ProgressBar value={chain.progress} className="mt-4 h-2" />

            <div className="mt-4 grid gap-2">
                {chain.steps.map((step) => (
                    <div
                        key={step.id}
                        className={[
                            "flex items-center justify-between gap-3 rounded-xl border px-3 py-2",
                            step.completed
                                ? "border-emerald-300/14 bg-emerald-300/[0.045]"
                                : "border-white/[0.06] bg-white/[0.025]",
                        ].join(" ")}
                    >
                        <span className={step.completed ? "text-sm font-bold text-emerald-100" : "text-sm text-slate-400"}>
                            {step.title}
                        </span>
                        <AppBadge variant={step.completed ? "emerald" : getAppTone(step.app)}>
                            {step.completed ? "done" : step.app.replace("Dark", "")}
                        </AppBadge>
                    </div>
                ))}
            </div>

            <div className="mt-4 rounded-xl border border-violet-300/12 bg-violet-300/[0.045] p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Next unlock
                </p>
                <p className="mt-1 text-sm font-bold text-white">{chain.nextUnlock || chain.unlockedRewards.join(", ")}</p>
                {chain.currentRecommendedAction && (
                    <AppButton href={chain.currentRecommendedAction.href} variant="nexus" className="mt-3 w-full">
                        {chain.currentRecommendedAction.label}
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

function MilestonesPanel({ result }: { result: EcosystemMilestonesResult }) {
    const visibleMilestones = [
        ...result.milestones.filter((milestone) => milestone.completed).slice(0, 3),
        ...result.milestones.filter((milestone) => !milestone.completed).slice(0, 3),
    ].slice(0, 6);

    return (
        <PanelCard
            variant="darkNexus"
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

            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-2xl border border-blue-300/12 bg-blue-300/[0.045] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                        Next milestone
                    </p>
                    <h3 className="mt-3 text-xl font-black text-white">
                        {result.nextMilestone?.title || "All milestones complete"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        {result.nextMilestone?.description || "The current V1 ecosystem milestone set is complete."}
                    </p>
                    {result.nextMilestone && (
                        <>
                            <div className="mt-4 flex items-center justify-between gap-3">
                                <AppBadge variant={getMilestoneTone(result.nextMilestone.category)}>
                                    {result.nextMilestone.category}
                                </AppBadge>
                                <span className="font-mono text-xs text-slate-500">{result.nextMilestone.progress.label}</span>
                            </div>
                            <ProgressBar value={result.nextMilestone.progress.percent} className="mt-3 h-2" />
                        </>
                    )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    {visibleMilestones.map((milestone) => (
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
                                <div>
                                    <AppBadge variant={milestone.completed ? "emerald" : getMilestoneTone(milestone.category)}>
                                        {milestone.completed ? "complete" : milestone.category}
                                    </AppBadge>
                                    <h3 className="mt-3 font-black text-white">{milestone.title}</h3>
                                </div>
                                <span className="font-mono text-xs text-slate-500">{milestone.progress.label}</span>
                            </div>
                            <ProgressBar value={milestone.progress.percent} className="mt-3 h-1.5" />
                        </div>
                    ))}
                </div>
            </div>
        </PanelCard>
    );
}

function OperatorPathCard({ path }: { path: OperatorPath }) {
    const accent = getPathAccent(path.id);
    const action = path.recommendedActions[0];

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <AppBadge variant={accent}>Career path</AppBadge>
                    <h3 className="mt-3 text-lg font-black text-white">{path.title}</h3>
                </div>
                <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Affinity</p>
                    <p className="mt-1 text-2xl font-black text-white">{path.affinity}%</p>
                </div>
            </div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Progression
                </span>
                <span className="font-mono text-xs text-slate-300">{path.progression}%</span>
            </div>
            <ProgressBar value={path.progression} className="h-2.5" />
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Next action</p>
                <p className="mt-2 text-sm font-bold text-white">
                    {action?.title || "Maintain path momentum"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                    {action?.description || "This path is currently stable. Keep collecting cross-app signals."}
                </p>
                {action && (
                    <AppButton href={action.href} variant="nexus" className="mt-3 w-full">
                        {action.ctaLabel}
                    </AppButton>
                )}
            </div>
        </div>
    );
}

export default function OperatorPage() {
    const [state, setState] = useState<OperatorState | null>(null);
    const { avatarUrl, configured, displayName, user } = useSupabaseSession();

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setState(createOperatorState());
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const events = useMemo(() => getAllEvents(state), [state]);
    const operatorPaths = useMemo(
        () =>
            getOperatorPaths(state?.profile, {
                ...(state?.telemetry || emptyTelemetry),
                progress: state?.progress,
                sync: {
                    configured,
                    authenticated: Boolean(user),
                },
            }),
        [configured, state, user],
    );
    const primaryPath = operatorPaths[0];
    const timeline = useMemo(() => getTimeline(state), [state]);
    const affinities = useMemo(() => getAffinities(state), [state]);
    const recommendations = useMemo(
        () =>
            getRecommendedActions(state?.profile, {
                ...(state?.telemetry || emptyTelemetry),
                progress: state?.progress,
                sync: {
                    configured,
                    authenticated: Boolean(user),
                },
            }),
        [configured, state, user],
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
                        configured,
                        authenticated: Boolean(user),
                    },
                },
                state?.profile,
            ),
        [configured, state, user],
    );
    const telemetry = state?.telemetry || emptyTelemetry;
    const profile = state?.profile;
    const globalBadges = useMemo(
        () =>
            getGlobalBadges(profile, {
                ...telemetry,
                progress: state?.progress,
                sync: {
                    configured,
                    authenticated: Boolean(user),
                },
            }),
        [configured, profile, state?.progress, telemetry, user],
    );
    const unlockedBadges = globalBadges.filter((badge) => badge.unlocked);
    const lockedBadges = globalBadges
        .filter((badge) => !badge.unlocked)
        .sort((left, right) => right.progress.percent - left.progress.percent)
        .slice(0, 4);
    const operatorName = displayName || profile?.username || user?.email?.split("@")[0] || "Nexus Operator";
    const operatorId = profile?.id || user?.id || "local-operator";
    const xp = profile?.xp ?? telemetry.totalXp;
    const level = profile?.level || 1;
    const rank = profile?.rank || "ROOKIE";
    const activeModules = progressNamespaces.filter(
        (namespace) => (state?.progress[namespace]?.events || []).length > 0,
    ).length;
    const telemetryEventsCount = events.length;
    const incidentsGenerated = countEvents(state?.progress.defend?.events || [], "incident_generated");
    const joinedAt = profile?.createdAt || user?.created_at || null;
    const nextLevel = Math.max(100, level * 100);
    const levelStart = Math.max(0, (level - 1) * 100);
    const xpProgress = clampPercent(((xp - levelStart) / Math.max(1, nextLevel - levelStart)) * 100);
    const specializationName = primaryPath?.title || "Hybrid Operator";
    const specializationAccent = primaryPath ? getPathAccent(primaryPath.id) : "blue";
    const specializationAffinity = primaryPath?.affinity || 0;
    const specializationProgression = primaryPath?.progression || 0;
    const specializationGuidance =
        primaryPath?.recommendedActions[0]?.description ||
        "Keep alternating learning, offensive practice, and defensive review.";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#070b14] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <NexusBackground />
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
                <Link
                    href="/"
                    className="inline-flex w-fit items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Command
                </Link>

                <PanelCard
                    variant="darkNexusHero"
                    accent="blue"
                    className="border-blue-300/15 bg-[radial-gradient(circle_at_18%_0%,rgba(96,165,250,0.16),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(16,185,129,0.10),transparent_30%),linear-gradient(135deg,rgba(4,10,22,0.96),rgba(7,12,24,0.78)_52%,rgba(3,7,18,0.96))] p-6 lg:p-7"
                >
                    <div className="grid gap-7 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                {avatarUrl ? (
                                    <div
                                        className="h-28 w-28 shrink-0 rounded-3xl border border-blue-300/25 bg-blue-400/[0.08] bg-cover bg-center shadow-[0_0_55px_rgba(96,165,250,.10)]"
                                        style={{ backgroundImage: `url(${avatarUrl})` }}
                                        aria-label={`${operatorName} avatar`}
                                    />
                                ) : (
                                    <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-3xl border border-blue-300/20 bg-blue-300/[0.08] text-4xl font-black text-blue-100 shadow-[0_0_55px_rgba(96,165,250,.10)]">
                                        <UserCircle className="absolute h-20 w-20 text-blue-200/15" />
                                        <span className="relative">{getInitials(operatorName)}</span>
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        <AppBadge variant="blue">Operator dossier</AppBadge>
                                        <AppBadge variant={specializationAccent}>{specializationName}</AppBadge>
                                    </div>
                                    <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                                        {operatorName}
                                    </h1>
                                    <p className="mt-3 break-all font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                                        Operator ID: {operatorId}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <StatTile label="Rank" value={rank} icon={Trophy} />
                                <StatTile label="Level" value={level} icon={Sparkles} />
                                <StatTile label="XP" value={xp} icon={Flame} />
                                <StatTile label="Active Modules" value={`${activeModules}/4`} icon={GitBranch} />
                            </div>

                                <div className="rounded-2xl border border-blue-300/15 bg-blue-300/[0.045] p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                        Level progress
                                    </span>
                                    <span className="font-mono text-xs text-blue-200">{xpProgress}%</span>
                                </div>
                                <ProgressBar value={xpProgress} className="h-3" />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-blue-300/15 bg-[#06101f]/85 p-5 shadow-[inset_0_0_24px_rgba(96,165,250,.035)]">
                                <div className="mb-4 flex items-center gap-2 text-blue-200">
                                    <Fingerprint className="h-5 w-5" />
                                    <p className="font-mono text-xs uppercase tracking-[0.24em]">Identity</p>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <DossierRow label="Specialization" value={specializationName} />
                                    <DossierRow label="Join date" value={formatDate(joinedAt)} />
                                    <DossierRow label="Last activity" value={formatRelative(telemetry.lastActivity, state?.capturedAt)} />
                                    <DossierRow label="Mode" value={user ? "GitHub linked" : "Local operator"} />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-violet-300/18 bg-violet-400/[0.055] p-5 shadow-[inset_0_0_24px_rgba(167,139,250,.035)]">
                                <div className="mb-4 flex items-center gap-2 text-violet-200">
                                    <Gauge className="h-5 w-5" />
                                    <p className="font-mono text-xs uppercase tracking-[0.24em]">Specialization</p>
                                </div>
                                <p className="text-3xl font-black text-white">{specializationAffinity}%</p>
                                <p className="mt-2 text-sm leading-6 text-slate-400">{specializationGuidance}</p>
                                <div className="mt-4 grid gap-2">
                                    <ProgressBar value={specializationAffinity} className="h-3" />
                                    <ProgressBar value={specializationProgression} className="h-1.5" />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.045] p-5 md:col-span-2">
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <div>
                                        <AppBadge variant="violet">Command profile</AppBadge>
                                        <h2 className="mt-3 text-2xl font-black text-white">Cyber dossier summary</h2>
                                    </div>
                                    <AppButton href="/telemetry" variant="nexus">
                                        Telemetry
                                    </AppButton>
                                </div>
                                <p className="text-sm leading-6 text-slate-400">
                                    This dossier fuses profile state, module telemetry, badges, learning paths, and activity milestones into a single operator record.
                                </p>
                            </div>
                        </div>
                    </div>
                </PanelCard>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
                    <StatTile label="Lessons" value={telemetry.lessonsCompleted} icon={BookOpen} tone="blue" />
                    <StatTile label="Challenges" value={telemetry.challengesCompleted} icon={Target} tone="violet" />
                    <StatTile label="Phishing" value={telemetry.phishingAnalyses} icon={ShieldCheck} tone="emerald" />
                    <StatTile label="Incidents" value={incidentsGenerated} icon={Radar} tone="amber" />
                    <StatTile label="Badges" value={unlockedBadges.length} icon={BadgeCheck} tone="emerald" />
                    <StatTile label="Streak" value={`${telemetry.streak}d`} icon={Flame} tone="amber" />
                    <StatTile label="Events" value={telemetryEventsCount} icon={Route} tone="blue" />
                </section>

                <PanelCard
                    variant="darkNexus"
                    accent="violet"
                    className="border-violet-300/12 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_34%),linear-gradient(180deg,rgba(13,10,28,0.9),rgba(3,7,18,0.78))] p-6"
                >
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <AppBadge variant="violet">Operator Paths</AppBadge>
                            <h2 className="mt-4 text-2xl font-black text-white">Career specialization tracks</h2>
                        </div>
                        <AppBadge variant={specializationAccent}>{specializationName}</AppBadge>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-5">
                        {operatorPaths.map((path) => (
                            <OperatorPathCard key={path.id} path={path} />
                        ))}
                    </div>
                </PanelCard>

                <PanelCard
                    variant="darkNexusHero"
                    accent="amber"
                    className="border-amber-300/12 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.10),transparent_34%),linear-gradient(180deg,rgba(15,12,6,0.88),rgba(3,7,18,0.86))] p-6"
                >
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <AppBadge variant="amber">Mission Briefing</AppBadge>
                            <h2 className="mt-4 text-2xl font-black text-white">Next objectives</h2>
                        </div>
                        <AppBadge variant="blue">{recommendations.length} active directives</AppBadge>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {recommendations.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-white/[0.08] bg-black/30 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <AppBadge variant={getRecommendationAccent(item.app)}>{item.app}</AppBadge>
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200">
                                        P{item.priority}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-black text-white">{item.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                    {item.reason}
                                </p>
                                <AppButton href={item.href} variant="nexus" className="mt-4 w-full gap-2">
                                    {item.ctaLabel}
                                </AppButton>
                            </div>
                        ))}
                    </div>
                </PanelCard>

                <MilestonesPanel result={milestones} />

                <PanelCard
                    variant="darkNexus"
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
                    <div className="grid gap-4 lg:grid-cols-2">
                        {unlockChains.map((chain) => (
                            <ChainBlock key={chain.id} chain={chain} />
                        ))}
                    </div>
                </PanelCard>

                <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                    <PanelCard
                        variant="darkNexus"
                        accent="violet"
                        className="border-violet-300/12 bg-[linear-gradient(180deg,rgba(79,70,229,0.10),rgba(3,7,18,0.76))] p-6"
                    >
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <AppBadge variant="violet">Module Affinities</AppBadge>
                                <h2 className="mt-4 text-2xl font-black text-white">Operational shape</h2>
                            </div>
                            <Crosshair className="h-5 w-5 text-violet-200" />
                        </div>
                        <div className="space-y-5">
                            {affinities.map((affinity) => (
                                <AffinityBar
                                    key={affinity.label}
                                    label={affinity.label}
                                    value={affinity.value}
                                    accent={affinity.accent}
                                />
                            ))}
                        </div>
                    </PanelCard>

                    <PanelCard
                        variant="darkNexus"
                        accent="emerald"
                        className="border-emerald-300/12 bg-[linear-gradient(180deg,rgba(16,185,129,0.095),rgba(3,7,18,0.78))] p-6"
                    >
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <AppBadge variant="emerald">Global Badges</AppBadge>
                                <h2 className="mt-4 text-2xl font-black text-white">Unlocked and locked signals</h2>
                            </div>
                            <Trophy className="h-5 w-5 text-emerald-200" />
                        </div>

                        <div className="mb-4 flex flex-wrap gap-2">
                            <AppBadge variant="emerald">{unlockedBadges.length} unlocked</AppBadge>
                            <AppBadge variant="amber">{lockedBadges.length} next locked</AppBadge>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {unlockedBadges.length > 0 ? (
                                unlockedBadges.slice(0, 4).map((badge) => (
                                    <div key={badge.id} className="rounded-2xl border border-emerald-300/18 bg-emerald-300/[0.055] p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <AppBadge variant={getBadgeTone(badge.rarity)}>{badge.rarity}</AppBadge>
                                                <h3 className="mt-3 font-black text-white">{badge.title}</h3>
                                                <p className="mt-2 text-xs leading-5 text-slate-400">{badge.description}</p>
                                            </div>
                                            <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-200" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-sm text-slate-400 md:col-span-2">
                                    No global badges unlocked yet. Complete a lesson, challenge, or defense scenario to generate the first badge signal.
                                </div>
                            )}

                            {lockedBadges.map((badge) => (
                                <BadgeChip key={badge.id} badge={badge} />
                            ))}
                        </div>
                    </PanelCard>
                </section>

                <PanelCard
                    variant="darkNexusHero"
                    accent="blue"
                    className="border-blue-300/12 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.11),transparent_36%),linear-gradient(180deg,rgba(7,13,28,0.94),rgba(3,7,18,0.82))] p-6"
                >
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <AppBadge variant="blue">Operator Timeline</AppBadge>
                            <h2 className="mt-4 text-2xl font-black text-white">Milestone trail</h2>
                        </div>
                        <CalendarDays className="h-5 w-5 text-blue-200" />
                    </div>

                    <div className="relative grid gap-4 before:absolute before:bottom-4 before:left-5 before:top-4 before:w-px before:bg-white/[0.08]">
                        {timeline.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article key={item.label} className="relative grid gap-3 pl-14">
                                    <span className="absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-xl border border-blue-300/20 bg-blue-300/[0.08] text-blue-100">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <div className={`rounded-2xl border p-4 ${timelineToneClass(item.accent)}`}>
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="font-bold text-white">{item.label}</p>
                                                <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                                            </div>
                                            <AppBadge variant={item.accent}>
                                                {formatRelative(item.timestamp, state?.capturedAt)}
                                            </AppBadge>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </PanelCard>
            </div>
        </main>
    );
}

function DossierRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2">
            <span className="text-slate-500">{label}</span>
            <span className="text-right font-bold text-slate-200">{value}</span>
        </div>
    );
}
