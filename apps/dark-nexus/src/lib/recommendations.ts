import type { AppProgressState, GlobalProfile, ProgressEvent } from "@dark/types";
import { getOperatorPaths } from "@/lib/operatorPaths";

export type RecommendedAction = {
    id: string;
    title: string;
    description: string;
    reason: string;
    ctaLabel: string;
    href: string;
    app: "DarkSplaining" | "DarkChallenges" | "DarkDefend" | "DarkOps";
    priority: number;
};

type TelemetryContext = {
    lessonsCompleted?: number;
    challengesCompleted?: number;
    ctfCompleted?: number;
    warzoneCompleted?: number;
    phishingAnalyses?: number;
    quizzesCompleted?: number;
    totalXp?: number;
    badgesUnlocked?: number;
    streak?: number;
    lastActivity?: string | null;
    progress?: Record<string, Pick<AppProgressState, "events"> | undefined>;
    sync?: {
        authenticated?: boolean;
        configured?: boolean;
        pendingQueue?: number;
    };
};

function getEvents(telemetry: TelemetryContext) {
    return Object.values(telemetry.progress || {}).flatMap((progress) => progress?.events || []);
}

function eventText(event: ProgressEvent) {
    return String(
        `${event.type} ${event.entityId} ${event.payload?.entityId || ""} ${event.payload?.lessonId || ""} ${event.payload?.challengeId || ""} ${event.payload?.slug || ""}`,
    ).toLowerCase();
}

function hasEvent(events: ProgressEvent[], predicate: (event: ProgressEvent) => boolean) {
    return events.some(predicate);
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

function addRecommendation(
    recommendations: RecommendedAction[],
    recommendation: RecommendedAction,
) {
    if (recommendations.some((item) => item.id === recommendation.id)) return;
    recommendations.push(recommendation);
}

export function getRecommendedActions(
    profile: Partial<GlobalProfile> | null | undefined,
    telemetry: TelemetryContext,
): RecommendedAction[] {
    const events = getEvents(telemetry);
    const splainingEvents = telemetry.progress?.splaining?.events || [];
    const challengeEvents = telemetry.progress?.challenges?.events || [];
    const defendEvents = telemetry.progress?.defend?.events || [];
    const recommendations: RecommendedAction[] = [];
    const lessonsCompleted = telemetry.lessonsCompleted || profile?.completedLessons?.length || 0;
    const challengesCompleted = telemetry.challengesCompleted || profile?.completedMissions?.length || 0;
    const defendCompleted = telemetry.phishingAnalyses || profile?.completedDefend?.length || 0;
    const offensiveTotal =
        challengesCompleted + (telemetry.ctfCompleted || 0) + (telemetry.warzoneCompleted || 0);

    if (events.length === 0 && lessonsCompleted === 0 && challengesCompleted === 0 && defendCompleted === 0) {
        addRecommendation(recommendations, {
            id: "start-splaining-first-lesson",
            title: "Start SQL Injection fundamentals",
            description: "Open the first guided lesson and create your initial learning signal.",
            reason: "No operator activity is recorded yet.",
            ctaLabel: "Start lesson",
            href: "/learn",
            app: "DarkSplaining",
            priority: 100,
        });
    }

    const sqlLessonCompleted =
        profile?.completedLessons?.some((lessonId) => lessonId.toLowerCase().includes("sql")) ||
        hasEvent(splainingEvents, (event) => event.type === "lesson_completed" && eventText(event).includes("sql"));
    const sqlChallengeCompleted =
        profile?.completedMissions?.some((missionId) => missionId.toLowerCase().includes("sql")) ||
        hasEvent(challengeEvents, (event) => isChallengeCompletion(event) && eventText(event).includes("sql"));

    if (sqlLessonCompleted && !sqlChallengeCompleted) {
        addRecommendation(recommendations, {
            id: "sql-challenge-after-lesson",
            title: "Run the SQL challenge",
            description: "Convert the SQL lesson into an offensive proof in DarkChallenges.",
            reason: "SQL learning is complete, but no SQL mission is captured.",
            ctaLabel: "Open practice",
            href: "/practice",
            app: "DarkChallenges",
            priority: 90,
        });
    }

    if (offensiveTotal > 0 && defendEvents.length === 0 && defendCompleted === 0) {
        addRecommendation(recommendations, {
            id: "defend-after-challenge",
            title: "Analyze a phishing scenario",
            description: "Balance offensive progress with a defensive investigation signal.",
            reason: "You have challenge progress but no Defend activity.",
            ctaLabel: "Open Defend",
            href: "/defend",
            app: "DarkDefend",
            priority: 84,
        });
    }

    if (lessonsCompleted >= 3 && offensiveTotal <= 1) {
        addRecommendation(recommendations, {
            id: "practice-after-many-lessons",
            title: "Run a practice mission",
            description: "Turn accumulated lessons into a hands-on exploitation route.",
            reason: "Learning volume is ahead of practical mission progress.",
            ctaLabel: "Practice now",
            href: "/practice",
            app: "DarkChallenges",
            priority: 76,
        });
    }

    if (offensiveTotal >= 3 && lessonsCompleted <= 1) {
        addRecommendation(recommendations, {
            id: "review-concepts-after-challenges",
            title: "Review core concepts",
            description: "Reinforce the theory behind your captured missions.",
            reason: "Challenge progress is ahead of lesson coverage.",
            ctaLabel: "Review concepts",
            href: "/learn",
            app: "DarkSplaining",
            priority: 72,
        });
    }

    if (telemetry.sync && (!telemetry.sync.authenticated || !telemetry.sync.configured)) {
        addRecommendation(recommendations, {
            id: "enable-cloud-sync",
            title: "Enable cloud sync",
            description: "Link Nexus so operator progress can sync beyond local storage.",
            reason: "Your cockpit is currently local-first only.",
            ctaLabel: "Open sync",
            href: "/data-settings",
            app: "DarkOps",
            priority: 68,
        });
    }

    const commandBasicsCompleted =
        profile?.completedLessons?.some((lessonId) => /command|linux|terminal/.test(lessonId.toLowerCase())) ||
        hasEvent(splainingEvents, (event) =>
            event.type.includes("completed") && /command|linux|terminal/.test(eventText(event)),
        );

    if (!commandBasicsCompleted) {
        addRecommendation(recommendations, {
            id: "linux-command-basics",
            title: "Complete Linux fundamentals",
            description: "Build command-line fluency for offensive and defensive workflows.",
            reason: "No command basics completion signal was found.",
            ctaLabel: "Open fundamentals",
            href: "/learn",
            app: "DarkSplaining",
            priority: 62,
        });
    }

    const relatedPathScore = [
        lessonsCompleted >= 3,
        offensiveTotal >= 2,
        defendCompleted >= 2,
        (telemetry.quizzesCompleted || 0) >= 2,
    ].filter(Boolean).length;
    const primaryPath = getOperatorPaths(profile, telemetry)[0];

    if (relatedPathScore >= 3 && primaryPath) {
        addRecommendation(recommendations, {
            id: "specialization-path",
            title: `Advance ${primaryPath.title}`,
            description: primaryPath.recommendedActions[0]?.description || "Lock in a focused route based on your strongest module signals.",
            reason: `${primaryPath.affinity}% affinity / ${primaryPath.progression}% path progression.`,
            ctaLabel: "View operator",
            href: "/operator",
            app: "DarkOps",
            priority: 58,
        });
    }

    return recommendations
        .sort((left, right) => right.priority - left.priority || left.id.localeCompare(right.id))
        .slice(0, 3);
}
