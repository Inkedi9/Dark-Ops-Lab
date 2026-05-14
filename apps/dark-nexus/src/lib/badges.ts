import type { AppProgressState, GlobalProfile, ProgressEvent } from "@dark/types";

export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type GlobalBadge = {
    id: string;
    title: string;
    description: string;
    rarity: BadgeRarity;
    unlocked: boolean;
    unlockedAt: string | null;
    progress: {
        current: number;
        total: number;
        percent: number;
        label: string;
    };
    category: "learning" | "offense" | "defense" | "hybrid" | "sync";
};

type TelemetryContext = {
    lessonsCompleted?: number;
    challengesCompleted?: number;
    ctfCompleted?: number;
    warzoneCompleted?: number;
    phishingAnalyses?: number;
    quizzesCompleted?: number;
    badgesUnlocked?: number;
    streak?: number;
    lastActivity?: string | null;
    progress?: Record<string, Pick<AppProgressState, "events"> | undefined>;
    sync?: {
        authenticated?: boolean;
        configured?: boolean;
    };
};

type Requirement = {
    met: boolean;
    timestamp?: string | null;
};

function clampPercent(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function getEvents(telemetry: TelemetryContext) {
    return Object.values(telemetry.progress || {}).flatMap((progress) => progress?.events || []);
}

function eventText(event: ProgressEvent) {
    return String(
        `${event.type} ${event.namespace} ${event.entityId} ${event.payload?.entityId || ""} ${event.payload?.lessonId || ""} ${event.payload?.challengeId || ""} ${event.payload?.slug || ""} ${event.payload?.kind || ""}`,
    ).toLowerCase();
}

function hasEvent(events: ProgressEvent[], predicate: (event: ProgressEvent) => boolean) {
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

function requirement(event?: ProgressEvent | null, fallback = false): Requirement {
    return {
        met: Boolean(event) || fallback,
        timestamp: event?.timestamp || null,
    };
}

function countCompleted(requirements: Requirement[]) {
    return requirements.filter((item) => item.met).length;
}

function getUnlockedAt(requirements: Requirement[]) {
    if (!requirements.every((item) => item.met)) return null;

    return requirements
        .map((item) => item.timestamp)
        .filter(Boolean)
        .sort()
        .at(-1) || null;
}

function createBadge({
    id,
    title,
    description,
    rarity,
    category,
    requirements,
}: {
    id: string;
    title: string;
    description: string;
    rarity: BadgeRarity;
    category: GlobalBadge["category"];
    requirements: Requirement[];
}): GlobalBadge {
    const current = countCompleted(requirements);
    const total = requirements.length;
    const unlocked = current === total;

    return {
        id,
        title,
        description,
        rarity,
        unlocked,
        unlockedAt: getUnlockedAt(requirements),
        progress: {
            current,
            total,
            percent: total > 0 ? clampPercent((current / total) * 100) : 0,
            label: `${current}/${total} completed`,
        },
        category,
    };
}

export function getGlobalBadges(
    profile: Partial<GlobalProfile> | null | undefined,
    telemetry: TelemetryContext,
): GlobalBadge[] {
    const events = getEvents(telemetry);
    const splainingEvents = telemetry.progress?.splaining?.events || [];
    const challengeEvents = telemetry.progress?.challenges?.events || [];
    const defendEvents = telemetry.progress?.defend?.events || [];
    const completedLessons = profile?.completedLessons || [];
    const completedMissions = profile?.completedMissions || [];
    const completedDefend = profile?.completedDefend || [];

    const sqlLesson = hasEvent(
        splainingEvents,
        (event) => event.type === "lesson_completed" && eventText(event).includes("sql"),
    );
    const sqlChallenge = hasEvent(
        challengeEvents,
        (event) => isChallengeCompletion(event) && eventText(event).includes("sql"),
    );
    const sqlDefend = hasEvent(
        defendEvents,
        (event) => event.type === "phishing_analyzed" && /sql|injection|database/.test(eventText(event)),
    );
    const identityLesson = hasEvent(
        splainingEvents,
        (event) => event.type === "lesson_completed" && /oauth|mfa|identity|auth/.test(eventText(event)),
    );
    const identityChallenge = hasEvent(
        challengeEvents,
        (event) => isChallengeCompletion(event) && /oauth|mfa|identity|auth|token|access/.test(eventText(event)),
    );
    const firstChallenge = hasEvent(challengeEvents, isChallengeCompletion);
    const firstDefend = hasEvent(defendEvents, (event) => event.type === "phishing_analyzed");
    const ctf = hasEvent(challengeEvents, (event) => event.type === "ctf_completed");
    const warzone = hasEvent(challengeEvents, (event) => event.type === "warzone_completed");
    const anySplaining = splainingEvents.length > 0 || completedLessons.length > 0;
    const anyChallenges = challengeEvents.length > 0 || completedMissions.length > 0;
    const anyDefend = defendEvents.length > 0 || completedDefend.length > 0;
    const completedEventCount = events.filter((event) =>
        ["lesson_completed", "challenge_completed", "ctf_completed", "warzone_completed", "quiz_completed", "phishing_analyzed", "incident_generated"].includes(event.type),
    ).length;
    const cloudSyncEnabled = Boolean(telemetry.sync?.configured && telemetry.sync?.authenticated);

    return [
        createBadge({
            id: "injection-specialist",
            title: "Injection Specialist",
            description: "Complete SQL learning, a SQL challenge, and a SQL-related defensive review.",
            rarity: "epic",
            category: "hybrid",
            requirements: [
                requirement(sqlLesson, completedLessons.some((id) => id.toLowerCase().includes("sql"))),
                requirement(sqlChallenge, completedMissions.some((id) => id.toLowerCase().includes("sql"))),
                requirement(sqlDefend),
            ],
        }),
        createBadge({
            id: "identity-analyst",
            title: "Identity Analyst",
            description: "Connect OAuth/MFA learning, phishing analysis, and an identity challenge.",
            rarity: "rare",
            category: "defense",
            requirements: [
                requirement(identityLesson, completedLessons.some((id) => /oauth|mfa|identity|auth/.test(id.toLowerCase()))),
                requirement(firstDefend, completedDefend.length > 0),
                requirement(identityChallenge, completedMissions.some((id) => /oauth|mfa|identity|auth|token|access/.test(id.toLowerCase()))),
            ],
        }),
        createBadge({
            id: "hybrid-operator",
            title: "Hybrid Operator",
            description: "Record activity in Learn, Practice, and Defend.",
            rarity: "rare",
            category: "hybrid",
            requirements: [
                { met: anySplaining, timestamp: splainingEvents[0]?.timestamp || null },
                { met: anyChallenges, timestamp: challengeEvents[0]?.timestamp || null },
                { met: anyDefend, timestamp: defendEvents[0]?.timestamp || null },
            ],
        }),
        createBadge({
            id: "first-offensive-path",
            title: "First Offensive Path",
            description: "Complete your first offensive challenge.",
            rarity: "common",
            category: "offense",
            requirements: [requirement(firstChallenge, completedMissions.length > 0)],
        }),
        createBadge({
            id: "first-defensive-review",
            title: "First Defensive Review",
            description: "Analyze your first defensive scenario.",
            rarity: "common",
            category: "defense",
            requirements: [requirement(firstDefend, completedDefend.length > 0)],
        }),
        createBadge({
            id: "mission-ready",
            title: "Mission Ready",
            description: "Accumulate five completed telemetry events.",
            rarity: "uncommon",
            category: "hybrid",
            requirements: Array.from({ length: 5 }, (_, index) => ({
                met: completedEventCount > index,
                timestamp: events[index]?.timestamp || null,
            })),
        }),
        createBadge({
            id: "persistent-operator",
            title: "Persistent Operator",
            description: "Maintain a three-day activity streak.",
            rarity: "rare",
            category: "learning",
            requirements: Array.from({ length: 3 }, (_, index) => ({
                met: (telemetry.streak || 0) > index,
                timestamp: telemetry.lastActivity || null,
            })),
        }),
        createBadge({
            id: "knowledge-builder",
            title: "Knowledge Builder",
            description: "Complete five lessons across the learning module.",
            rarity: "uncommon",
            category: "learning",
            requirements: Array.from({ length: 5 }, (_, index) => ({
                met: (telemetry.lessonsCompleted || completedLessons.length) > index,
                timestamp: splainingEvents[index]?.timestamp || null,
            })),
        }),
        createBadge({
            id: "field-operator",
            title: "Field Operator",
            description: "Complete a challenge, a CTF, and a warzone.",
            rarity: "legendary",
            category: "offense",
            requirements: [
                requirement(firstChallenge, completedMissions.length > 0),
                requirement(ctf, (telemetry.ctfCompleted || 0) > 0),
                requirement(warzone, (telemetry.warzoneCompleted || 0) > 0),
            ],
        }),
        createBadge({
            id: "connected-operator",
            title: "Connected Operator",
            description: "Enable authenticated cloud sync for Nexus.",
            rarity: "epic",
            category: "sync",
            requirements: [{ met: cloudSyncEnabled, timestamp: telemetry.lastActivity || null }],
        }),
    ];
}
