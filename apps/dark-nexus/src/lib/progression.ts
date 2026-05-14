import type { AppProgressState, GlobalProfile, ProgressEvent } from "@dark/types";

export type UnlockStep = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    completedAt: string | null;
    href: string;
    app: "DarkSplaining" | "DarkChallenges" | "DarkDefend";
};

export type UnlockChain = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    progress: number;
    completedSteps: number;
    totalSteps: number;
    nextUnlock: string | null;
    currentRecommendedAction: {
        label: string;
        href: string;
        app: UnlockStep["app"];
    } | null;
    steps: UnlockStep[];
    unlockedRewards: string[];
};

type TelemetryContext = {
    progress?: Record<string, Pick<AppProgressState, "events"> | undefined>;
    lessonsCompleted?: number;
    challengesCompleted?: number;
    ctfCompleted?: number;
    warzoneCompleted?: number;
    phishingAnalyses?: number;
};

function clampPercent(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function eventText(event: ProgressEvent) {
    return String(
        `${event.type} ${event.namespace} ${event.entityId} ${event.payload?.entityId || ""} ${event.payload?.lessonId || ""} ${event.payload?.challengeId || ""} ${event.payload?.slug || ""} ${event.payload?.kind || ""}`,
    ).toLowerCase();
}

function findEvent(events: ProgressEvent[], predicate: (event: ProgressEvent) => boolean) {
    return events.find(predicate);
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

function step({
    id,
    title,
    description,
    event,
    fallback = false,
    href,
    app,
}: {
    id: string;
    title: string;
    description: string;
    event?: ProgressEvent | null;
    fallback?: boolean;
    href: string;
    app: UnlockStep["app"];
}): UnlockStep {
    return {
        id,
        title,
        description,
        completed: Boolean(event) || fallback,
        completedAt: event?.timestamp || null,
        href,
        app,
    };
}

function chain({
    id,
    title,
    description,
    steps,
    reward,
}: {
    id: string;
    title: string;
    description: string;
    steps: UnlockStep[];
    reward: string;
}): UnlockChain {
    const completedSteps = steps.filter((item) => item.completed).length;
    const completed = completedSteps === steps.length;
    const nextStep = steps.find((item) => !item.completed) || null;

    return {
        id,
        title,
        description,
        completed,
        progress: clampPercent((completedSteps / steps.length) * 100),
        completedSteps,
        totalSteps: steps.length,
        nextUnlock: nextStep?.title || null,
        currentRecommendedAction: nextStep
            ? {
                label: nextStep.title,
                href: nextStep.href,
                app: nextStep.app,
            }
            : null,
        steps,
        unlockedRewards: completed ? [reward] : [],
    };
}

export function getUnlockChains(
    telemetry: TelemetryContext,
    profile?: Partial<GlobalProfile> | null,
): UnlockChain[] {
    const splainingEvents = telemetry.progress?.splaining?.events || [];
    const challengeEvents = telemetry.progress?.challenges?.events || [];
    const defendEvents = telemetry.progress?.defend?.events || [];
    const completedLessons = profile?.completedLessons || [];
    const completedMissions = profile?.completedMissions || [];
    const completedDefend = profile?.completedDefend || [];

    const sqlLesson = findEvent(
        splainingEvents,
        (event) => event.type === "lesson_completed" && eventText(event).includes("sql"),
    );
    const xssLesson = findEvent(
        splainingEvents,
        (event) => event.type === "lesson_completed" && eventText(event).includes("xss"),
    );
    const mfaLesson = findEvent(
        splainingEvents,
        (event) => event.type === "lesson_completed" && /mfa|identity|auth/.test(eventText(event)),
    );
    const oauthLesson = findEvent(
        splainingEvents,
        (event) => event.type === "lesson_completed" && /oauth|identity|auth/.test(eventText(event)),
    );
    const sqlChallenge = findEvent(
        challengeEvents,
        (event) => isChallengeCompletion(event) && eventText(event).includes("sql"),
    );
    const xssChallenge = findEvent(
        challengeEvents,
        (event) => isChallengeCompletion(event) && eventText(event).includes("xss"),
    );
    const firstLesson = findEvent(splainingEvents, (event) => event.type === "lesson_completed");
    const firstChallenge = findEvent(challengeEvents, isChallengeCompletion);
    const firstDefend = findEvent(defendEvents, (event) => event.type === "phishing_analyzed");
    const phishingAnalysis = firstDefend;
    const identityIncident = findEvent(
        defendEvents,
        (event) => event.type === "incident_generated" && /identity|oauth|mfa|auth|token|access|phishing/.test(eventText(event)),
    );
    const ctf = findEvent(challengeEvents, (event) => event.type === "ctf_completed");
    const warzone = findEvent(challengeEvents, (event) => event.type === "warzone_completed");

    return [
        chain({
            id: "web-injection-path",
            title: "Web Injection Path",
            description: "Chain SQL and XSS learning into practical offensive captures.",
            reward: "Injection Specialist",
            steps: [
                step({
                    id: "sql-lesson",
                    title: "SQL lesson",
                    description: "Complete the SQL injection concept path.",
                    event: sqlLesson,
                    fallback: completedLessons.some((id) => id.toLowerCase().includes("sql")),
                    href: "/learn",
                    app: "DarkSplaining",
                }),
                step({
                    id: "sql-challenge",
                    title: "SQL challenge",
                    description: "Clear the SQL practice mission.",
                    event: sqlChallenge,
                    fallback: completedMissions.some((id) => id.toLowerCase().includes("sql")),
                    href: "/practice",
                    app: "DarkChallenges",
                }),
                step({
                    id: "xss-lesson",
                    title: "XSS lesson",
                    description: "Complete the XSS concept path.",
                    event: xssLesson,
                    fallback: completedLessons.some((id) => id.toLowerCase().includes("xss")),
                    href: "/learn",
                    app: "DarkSplaining",
                }),
                step({
                    id: "xss-challenge",
                    title: "XSS challenge",
                    description: "Clear an XSS practice mission.",
                    event: xssChallenge,
                    fallback: completedMissions.some((id) => id.toLowerCase().includes("xss")),
                    href: "/practice",
                    app: "DarkChallenges",
                }),
            ],
        }),
        chain({
            id: "identity-defense-path",
            title: "Identity Defense Path",
            description: "Link identity learning with phishing and incident review.",
            reward: "Identity Analyst",
            steps: [
                step({
                    id: "mfa-lesson",
                    title: "MFA lesson",
                    description: "Complete MFA or identity hardening fundamentals.",
                    event: mfaLesson,
                    fallback: completedLessons.some((id) => /mfa|identity|auth/.test(id.toLowerCase())),
                    href: "/learn",
                    app: "DarkSplaining",
                }),
                step({
                    id: "oauth-lesson",
                    title: "OAuth lesson",
                    description: "Complete OAuth or delegated access fundamentals.",
                    event: oauthLesson,
                    fallback: completedLessons.some((id) => /oauth|identity|auth/.test(id.toLowerCase())),
                    href: "/learn",
                    app: "DarkSplaining",
                }),
                step({
                    id: "phishing-analysis",
                    title: "Phishing analysis",
                    description: "Analyze a phishing scenario in Defend.",
                    event: phishingAnalysis,
                    fallback: completedDefend.length > 0,
                    href: "/defend",
                    app: "DarkDefend",
                }),
                step({
                    id: "identity-incident-review",
                    title: "Identity incident review",
                    description: "Review or generate an identity-flavored incident.",
                    event: identityIncident,
                    href: "/defend",
                    app: "DarkDefend",
                }),
            ],
        }),
        chain({
            id: "operator-initiation",
            title: "Operator Initiation",
            description: "Touch every core app once to unlock the hybrid loop.",
            reward: "Hybrid Operator",
            steps: [
                step({
                    id: "first-lesson",
                    title: "First lesson",
                    description: "Complete any lesson.",
                    event: firstLesson,
                    fallback: completedLessons.length > 0 || (telemetry.lessonsCompleted || 0) > 0,
                    href: "/learn",
                    app: "DarkSplaining",
                }),
                step({
                    id: "first-challenge",
                    title: "First challenge",
                    description: "Complete any challenge.",
                    event: firstChallenge,
                    fallback: completedMissions.length > 0 || (telemetry.challengesCompleted || 0) > 0,
                    href: "/practice",
                    app: "DarkChallenges",
                }),
                step({
                    id: "first-defend-analysis",
                    title: "First defend analysis",
                    description: "Complete any Defend analysis.",
                    event: firstDefend,
                    fallback: completedDefend.length > 0 || (telemetry.phishingAnalyses || 0) > 0,
                    href: "/defend",
                    app: "DarkDefend",
                }),
            ],
        }),
        chain({
            id: "offensive-operations",
            title: "Offensive Operations",
            description: "Complete the full offensive spread: mission, CTF, and warzone.",
            reward: "Field Operator",
            steps: [
                step({
                    id: "challenge",
                    title: "Challenge",
                    description: "Complete any offensive challenge.",
                    event: firstChallenge,
                    fallback: completedMissions.length > 0 || (telemetry.challengesCompleted || 0) > 0,
                    href: "/practice",
                    app: "DarkChallenges",
                }),
                step({
                    id: "ctf",
                    title: "CTF",
                    description: "Capture a CTF operation.",
                    event: ctf,
                    fallback: (telemetry.ctfCompleted || 0) > 0,
                    href: "/practice",
                    app: "DarkChallenges",
                }),
                step({
                    id: "warzone",
                    title: "Warzone",
                    description: "Clear a warzone simulation.",
                    event: warzone,
                    fallback: (telemetry.warzoneCompleted || 0) > 0,
                    href: "/practice",
                    app: "DarkChallenges",
                }),
            ],
        }),
    ];
}
