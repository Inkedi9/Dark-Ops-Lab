import type { AppProgressState, GlobalProfile, ProgressEvent } from "@dark/types";

export type EcosystemMilestone = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    unlockedAt: string | null;
    progress: {
        current: number;
        total: number;
        percent: number;
        label: string;
    };
    category: "learning" | "offense" | "defense" | "hybrid" | "sync" | "specialization";
};

export type EcosystemMilestonesResult = {
    milestones: EcosystemMilestone[];
    completedCount: number;
    totalCount: number;
    ecosystemCompletion: number;
    nextMilestone: EcosystemMilestone | null;
};

type TelemetryContext = {
    lessonsCompleted?: number;
    challengesCompleted?: number;
    ctfCompleted?: number;
    warzoneCompleted?: number;
    phishingAnalyses?: number;
    quizzesCompleted?: number;
    streak?: number;
    lastActivity?: string | null;
    progress?: Record<string, Pick<AppProgressState, "events"> | undefined>;
    sync?: {
        authenticated?: boolean;
        configured?: boolean;
    };
};

function clampPercent(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function getEvents(telemetry: TelemetryContext) {
    return Object.values(telemetry.progress || {})
        .flatMap((progress) => progress?.events || [])
        .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
}

function isChallengeCompletion(event: ProgressEvent) {
    return (
        event.namespace === "challenges" &&
        event.type === "challenge_completed" &&
        event.payload?.kind !== "ctf" &&
        event.payload?.kind !== "warzone" &&
        !String(event.entityId || "").startsWith("ctf:") &&
        !String(event.entityId || "").startsWith("warzone:")
    );
}

function completedEventTypes(event: ProgressEvent) {
    return [
        "lesson_completed",
        "challenge_completed",
        "ctf_completed",
        "warzone_completed",
        "quiz_completed",
        "phishing_analyzed",
        "incident_generated",
    ].includes(event.type);
}

function createMilestone({
    id,
    title,
    description,
    current,
    total,
    unlockedAt,
    category,
}: {
    id: string;
    title: string;
    description: string;
    current: number;
    total: number;
    unlockedAt?: string | null;
    category: EcosystemMilestone["category"];
}): EcosystemMilestone {
    const safeCurrent = Math.min(current, total);
    const completed = safeCurrent >= total;

    return {
        id,
        title,
        description,
        completed,
        unlockedAt: completed ? unlockedAt || null : null,
        progress: {
            current: safeCurrent,
            total,
            percent: clampPercent((safeCurrent / total) * 100),
            label: `${safeCurrent}/${total}`,
        },
        category,
    };
}

export function getEcosystemMilestones(
    telemetry: TelemetryContext,
    profile?: Partial<GlobalProfile> | null,
): EcosystemMilestonesResult {
    const events = getEvents(telemetry);
    const splainingEvents = telemetry.progress?.splaining?.events || [];
    const challengeEvents = telemetry.progress?.challenges?.events || [];
    const defendEvents = telemetry.progress?.defend?.events || [];
    const firstLesson = splainingEvents.find((event) => event.type === "lesson_completed");
    const firstChallenge = challengeEvents.find(isChallengeCompletion);
    const firstDefend = defendEvents.find((event) => event.type === "phishing_analyzed");
    const completedActivities = events.filter(completedEventTypes);
    const lessonsCompleted = telemetry.lessonsCompleted || profile?.completedLessons?.length || 0;
    const challengesCompleted = telemetry.challengesCompleted || profile?.completedMissions?.length || 0;
    const defendCompleted = telemetry.phishingAnalyses || profile?.completedDefend?.length || 0;
    const allModulesStarted = [lessonsCompleted > 0, challengesCompleted > 0, defendCompleted > 0].filter(Boolean).length;
    const specializationSignals = [
        lessonsCompleted >= 3,
        challengesCompleted + (telemetry.ctfCompleted || 0) + (telemetry.warzoneCompleted || 0) >= 2,
        defendCompleted >= 2,
    ].filter(Boolean).length;
    const cloudSyncEnabled = Boolean(telemetry.sync?.configured && telemetry.sync?.authenticated);

    const milestones = [
        createMilestone({
            id: "first-lesson",
            title: "First Lesson",
            description: "Complete the first learning module.",
            current: lessonsCompleted,
            total: 1,
            unlockedAt: firstLesson?.timestamp,
            category: "learning",
        }),
        createMilestone({
            id: "first-challenge",
            title: "First Challenge",
            description: "Clear the first offensive challenge.",
            current: challengesCompleted,
            total: 1,
            unlockedAt: firstChallenge?.timestamp,
            category: "offense",
        }),
        createMilestone({
            id: "first-defend-review",
            title: "First Defend Review",
            description: "Analyze the first defensive scenario.",
            current: defendCompleted,
            total: 1,
            unlockedAt: firstDefend?.timestamp,
            category: "defense",
        }),
        createMilestone({
            id: "first-cross-app-path",
            title: "First Cross-App Path",
            description: "Record activity in Learn, Practice, and Defend.",
            current: allModulesStarted,
            total: 3,
            unlockedAt: [firstLesson?.timestamp, firstChallenge?.timestamp, firstDefend?.timestamp].filter(Boolean).sort().at(-1),
            category: "hybrid",
        }),
        createMilestone({
            id: "ten-lessons",
            title: "10 Lessons",
            description: "Complete ten lessons across DarkSplaining.",
            current: lessonsCompleted,
            total: 10,
            unlockedAt: splainingEvents.filter((event) => event.type === "lesson_completed").at(9)?.timestamp,
            category: "learning",
        }),
        createMilestone({
            id: "ten-challenges",
            title: "10 Challenges",
            description: "Complete ten offensive challenges.",
            current: challengesCompleted,
            total: 10,
            unlockedAt: challengeEvents.filter(isChallengeCompletion).at(9)?.timestamp,
            category: "offense",
        }),
        createMilestone({
            id: "twenty-five-activities",
            title: "25 Total Activities",
            description: "Accumulate twenty-five completed telemetry events.",
            current: completedActivities.length,
            total: 25,
            unlockedAt: completedActivities.at(24)?.timestamp,
            category: "hybrid",
        }),
        createMilestone({
            id: "first-cloud-sync",
            title: "First Cloud Sync",
            description: "Enable authenticated Nexus cloud sync.",
            current: cloudSyncEnabled ? 1 : 0,
            total: 1,
            unlockedAt: telemetry.lastActivity,
            category: "sync",
        }),
        createMilestone({
            id: "first-specialization",
            title: "First Specialization",
            description: "Build enough signals to identify an operator specialization.",
            current: specializationSignals,
            total: 2,
            unlockedAt: events.at(-1)?.timestamp,
            category: "specialization",
        }),
    ];

    const completedCount = milestones.filter((milestone) => milestone.completed).length;
    const nextMilestone =
        milestones
            .filter((milestone) => !milestone.completed)
            .sort((left, right) => right.progress.percent - left.progress.percent)[0] || null;

    return {
        milestones,
        completedCount,
        totalCount: milestones.length,
        ecosystemCompletion: clampPercent((completedCount / milestones.length) * 100),
        nextMilestone,
    };
}
