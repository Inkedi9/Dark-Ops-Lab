import type { AppProgressState, GlobalProfile, ProgressEvent } from "@dark/types";

export type OperatorPathAction = {
    id: string;
    title: string;
    description: string;
    ctaLabel: string;
    href: string;
    app: "DarkSplaining" | "DarkChallenges" | "DarkDefend" | "DarkNexus";
    priority: number;
};

export type OperatorPath = {
    id: "offensive-operator" | "defense-analyst" | "hybrid-operator" | "recon-specialist" | "web-security-operator";
    title: string;
    affinity: number;
    progression: number;
    recommendedActions: OperatorPathAction[];
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

function clampPercent(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function completionPercent(value: number, total: number) {
    if (total <= 0) return 0;
    return clampPercent((value / total) * 100);
}

function getEvents(telemetry: TelemetryContext) {
    return Object.values(telemetry.progress || {}).flatMap((progress) => progress?.events || []);
}

function eventText(event: ProgressEvent) {
    return String(
        `${event.type} ${event.namespace} ${event.entityId} ${event.payload?.entityId || ""} ${event.payload?.lessonId || ""} ${event.payload?.challengeId || ""} ${event.payload?.slug || ""} ${event.payload?.title || ""}`,
    ).toLowerCase();
}

function hasEvent(events: ProgressEvent[], predicate: (event: ProgressEvent) => boolean) {
    return events.some(predicate);
}

function countSignals(events: ProgressEvent[], pattern: RegExp) {
    return events.filter((event) => pattern.test(eventText(event))).length;
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

function addAction(actions: OperatorPathAction[], action: OperatorPathAction) {
    if (actions.some((item) => item.id === action.id)) return;
    actions.push(action);
}

export function getOperatorPaths(
    profile: Partial<GlobalProfile> | null | undefined,
    telemetry: TelemetryContext,
): OperatorPath[] {
    const events = getEvents(telemetry);
    const splainingEvents = telemetry.progress?.splaining?.events || [];
    const challengeEvents = telemetry.progress?.challenges?.events || [];
    const defendEvents = telemetry.progress?.defend?.events || [];
    const lessonsCompleted = telemetry.lessonsCompleted || profile?.completedLessons?.length || 0;
    const challengesCompleted = telemetry.challengesCompleted || profile?.completedMissions?.length || 0;
    const defendCompleted = telemetry.phishingAnalyses || profile?.completedDefend?.length || 0;
    const ctfCompleted = telemetry.ctfCompleted || 0;
    const warzoneCompleted = telemetry.warzoneCompleted || 0;
    const quizzesCompleted = telemetry.quizzesCompleted || 0;
    const offensiveTotal = challengesCompleted + ctfCompleted + warzoneCompleted;
    const totalActivity = events.length + lessonsCompleted + offensiveTotal + defendCompleted + quizzesCompleted;
    const sqlLessonCompleted =
        profile?.completedLessons?.some((lessonId) => lessonId.toLowerCase().includes("sql")) ||
        hasEvent(splainingEvents, (event) => event.type === "lesson_completed" && eventText(event).includes("sql"));
    const sqlChallengeCompleted =
        profile?.completedMissions?.some((missionId) => missionId.toLowerCase().includes("sql")) ||
        hasEvent(challengeEvents, (event) => isChallengeCompletion(event) && eventText(event).includes("sql"));
    const xssLessonCompleted = hasEvent(
        splainingEvents,
        (event) => event.type === "lesson_completed" && /xss|cross.?site/.test(eventText(event)),
    );
    const xssChallengeCompleted = hasEvent(
        challengeEvents,
        (event) => isChallengeCompletion(event) && /xss|cross.?site/.test(eventText(event)),
    );
    const phishingCompleted = hasEvent(defendEvents, (event) => event.type === "phishing_analyzed");
    const incidentReviewed = hasEvent(defendEvents, (event) => /incident|oauth|identity|mfa/.test(eventText(event)));
    const reconSignals = countSignals(challengeEvents, /recon|internal|breach|osint|scan|enumerat|warzone|ctf/);
    const identitySignals = countSignals(events, /identity|oauth|mfa|auth|access|phishing/);
    const webSignals = [
        sqlLessonCompleted,
        sqlChallengeCompleted,
        xssLessonCompleted,
        xssChallengeCompleted,
        countSignals(events, /web|injection|csrf|cookie|session/) > 0,
        quizzesCompleted > 0,
    ].filter(Boolean).length;

    const offensiveActions: OperatorPathAction[] = [];
    if (challengesCompleted === 0) {
        addAction(offensiveActions, {
            id: "offensive-first-challenge",
            title: "Capture a first practice mission",
            description: "Start building offensive evidence with a concrete challenge completion.",
            ctaLabel: "Open practice",
            href: "/practice",
            app: "DarkChallenges",
            priority: 90,
        });
    }
    if (ctfCompleted === 0 && challengesCompleted > 0) {
        addAction(offensiveActions, {
            id: "offensive-first-ctf",
            title: "Enter a CTF run",
            description: "Add timed capture work to your offensive path.",
            ctaLabel: "Open CTF",
            href: "/practice",
            app: "DarkChallenges",
            priority: 78,
        });
    }
    if (warzoneCompleted === 0 && offensiveTotal >= 2) {
        addAction(offensiveActions, {
            id: "offensive-warzone",
            title: "Clear a warzone",
            description: "Convert practice wins into a higher-pressure offensive scenario.",
            ctaLabel: "Open warzone",
            href: "/practice",
            app: "DarkChallenges",
            priority: 68,
        });
    }

    const defenseActions: OperatorPathAction[] = [];
    if (!phishingCompleted) {
        addAction(defenseActions, {
            id: "defense-phishing-analysis",
            title: "Analyze a phishing scenario",
            description: "Create the first defensive investigation signal.",
            ctaLabel: "Open Defend",
            href: "/defend",
            app: "DarkDefend",
            priority: 88,
        });
    }
    if (phishingCompleted && !incidentReviewed) {
        addAction(defenseActions, {
            id: "defense-identity-incident",
            title: "Review an identity incident",
            description: "Extend defensive coverage toward OAuth, MFA, and access-control cases.",
            ctaLabel: "Review incident",
            href: "/defend",
            app: "DarkDefend",
            priority: 74,
        });
    }

    const hybridActions: OperatorPathAction[] = [];
    if (lessonsCompleted === 0) {
        addAction(hybridActions, {
            id: "hybrid-first-lesson",
            title: "Complete a guided lesson",
            description: "Hybrid operators need at least one learning signal before branching.",
            ctaLabel: "Open lessons",
            href: "/learn",
            app: "DarkSplaining",
            priority: 84,
        });
    }
    if (offensiveTotal === 0) addAction(hybridActions, offensiveActions[0]);
    if (defendCompleted === 0) addAction(hybridActions, defenseActions[0]);

    const reconActions: OperatorPathAction[] = [];
    if (reconSignals === 0) {
        addAction(reconActions, {
            id: "recon-internal-breach",
            title: "Run an Internal Breach route",
            description: "Build recon coverage through enumeration and breach-path discovery.",
            ctaLabel: "Open recon mission",
            href: "/practice",
            app: "DarkChallenges",
            priority: 82,
        });
    }
    if (ctfCompleted === 0 && reconSignals > 0) {
        addAction(reconActions, {
            id: "recon-ctf",
            title: "Validate recon in CTF",
            description: "Use capture workflow to turn discovery into proof.",
            ctaLabel: "Open CTF",
            href: "/practice",
            app: "DarkChallenges",
            priority: 70,
        });
    }

    const webActions: OperatorPathAction[] = [];
    if (!sqlLessonCompleted) {
        addAction(webActions, {
            id: "web-sql-lesson",
            title: "Complete SQL Injection fundamentals",
            description: "Anchor the web path with the core injection lesson.",
            ctaLabel: "Open lesson",
            href: "/learn",
            app: "DarkSplaining",
            priority: 86,
        });
    }
    if (sqlLessonCompleted && !sqlChallengeCompleted) {
        addAction(webActions, {
            id: "web-sql-challenge",
            title: "Capture the SQL challenge",
            description: "Convert SQL theory into an offensive completion.",
            ctaLabel: "Open challenge",
            href: "/practice",
            app: "DarkChallenges",
            priority: 80,
        });
    }
    if (!xssLessonCompleted && sqlChallengeCompleted) {
        addAction(webActions, {
            id: "web-xss-lesson",
            title: "Continue into XSS",
            description: "Expand web coverage beyond injection basics.",
            ctaLabel: "Open lesson",
            href: "/learn",
            app: "DarkSplaining",
            priority: 66,
        });
    }

    const hybridCoverage = [
        lessonsCompleted > 0,
        offensiveTotal > 0,
        defendCompleted > 0,
        quizzesCompleted > 0,
    ].filter(Boolean).length;

    const paths: OperatorPath[] = [
        {
            id: "offensive-operator",
            title: "Offensive Operator",
            affinity: clampPercent(((offensiveTotal * 2 + reconSignals + webSignals) / Math.max(1, totalActivity + 4)) * 100),
            progression: completionPercent(offensiveTotal, 6),
            recommendedActions: offensiveActions.slice(0, 3),
        },
        {
            id: "defense-analyst",
            title: "Defense Analyst",
            affinity: clampPercent(((defendCompleted * 3 + identitySignals) / Math.max(1, totalActivity + 4)) * 100),
            progression: completionPercent(defendCompleted + Number(incidentReviewed), 5),
            recommendedActions: defenseActions.slice(0, 3),
        },
        {
            id: "hybrid-operator",
            title: "Hybrid Operator",
            affinity: clampPercent((hybridCoverage / 4) * 100),
            progression: clampPercent(
                (completionPercent(lessonsCompleted, 3) +
                    completionPercent(offensiveTotal, 2) +
                    completionPercent(defendCompleted, 2)) /
                    3,
            ),
            recommendedActions: hybridActions.filter(Boolean).slice(0, 3),
        },
        {
            id: "recon-specialist",
            title: "Recon Specialist",
            affinity: clampPercent(((reconSignals + ctfCompleted + warzoneCompleted) / Math.max(1, totalActivity + 3)) * 100),
            progression: completionPercent(reconSignals + ctfCompleted + warzoneCompleted, 5),
            recommendedActions: reconActions.slice(0, 3),
        },
        {
            id: "web-security-operator",
            title: "Web Security Operator",
            affinity: clampPercent(((webSignals * 2 + lessonsCompleted + challengesCompleted) / Math.max(1, totalActivity + 6)) * 100),
            progression: completionPercent(webSignals, 6),
            recommendedActions: webActions.slice(0, 3),
        },
    ];

    return paths.sort(
        (left, right) =>
            right.affinity - left.affinity ||
            right.progression - left.progression ||
            left.title.localeCompare(right.title),
    );
}
