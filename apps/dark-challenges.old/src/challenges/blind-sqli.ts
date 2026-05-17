import type {
    ChallengeDefinition,
    ChallengeInput,
    ChallengeResult,
} from "@/engine/types";

function getTrackingId(input: ChallengeInput) {
    return String(input.trackingId ?? "");
}

function buildPreview(input: ChallengeInput) {
    const trackingId = getTrackingId(input);

    return `GET /account
Cookie: TrackingId=${trackingId || "guest-session"}
Response behavior: ${trackingId ? "observable" : "default"}`;
}

function isTrueCondition(payload: string) {
    return (
        /'\s*and\s*1\s*=\s*1/i.test(payload) ||
        /'\s*or\s*1\s*=\s*1/i.test(payload) ||
        /'\s*and\s*'a'\s*=\s*'a/i.test(payload)
    );
}

function isFalseCondition(payload: string) {
    return (
        /'\s*and\s*1\s*=\s*2/i.test(payload) ||
        /'\s*and\s*'a'\s*=\s*'b/i.test(payload)
    );
}

function extractsAdminFirstChar(payload: string) {
    return (
        /substring\s*\(\s*password\s*,\s*1\s*,\s*1\s*\)\s*=\s*'s'/i.test(
            payload
        ) ||
        /substr\s*\(\s*password\s*,\s*1\s*,\s*1\s*\)\s*=\s*'s'/i.test(payload)
    );
}

export const blindSqliChallenge: ChallengeDefinition = {
    id: "sqli-002",
    slug: "blind-sqli",
    title: "Blind SQL Injection",
    category: "Injection",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    objective:
        "Use boolean-based behavior to prove that the tracking cookie is injectable.",
    successCondition:
        "The simulated app reveals a true condition through different response behavior.",
    sandboxType: "sql",
    sandboxMode: "blind",
    fields: [
        {
            name: "trackingId",
            label: "TrackingId Cookie",
            placeholder: "guest-session",
            type: "text",
        },
    ],

    exploitFeedback: {
        title: "Response behavior became an oracle",
        summary:
            "The application did not reveal data directly, but different responses exposed whether a database condition was true.",
        brokenAssumption:
            "The application assumed hiding database output was enough to prevent exploitation.",
        impact:
            "An attacker can infer sensitive data one condition at a time.",
        defensiveFix:
            "Use parameterized queries and avoid leaking behavioral differences tied to database conditions.",
    },

    hints: [
        {
            id: "blind-sqli-h1",
            title: "No direct output",
            content:
                "Blind injection does not show database rows. Watch response behavior.",
            penalty: 150,
        },
        {
            id: "blind-sqli-h2",
            title: "Compare conditions",
            content:
                "Try sending one condition that is true and one condition that is false.",
            penalty: 150,
        },
        {
            id: "blind-sqli-h3",
            title: "Boolean oracle",
            content:
                "A different response can become an oracle for extracting information.",
            penalty: 150,
        },
    ],
    getPreview(input) {
        return buildPreview(input);
    },
    evaluate(input): ChallengeResult {
        const payload = getTrackingId(input);

        if (!payload.trim()) {
            return {
                success: false,
                message: "No cookie supplied.",
                logs: [
                    { level: "error", message: "tracking cookie missing" },
                    { level: "error", message: "request ignored" },
                ],
            };
        }

        if (extractsAdminFirstChar(payload)) {
            return {
                success: true,
                message: "Boolean oracle confirmed.",
                logs: [
                    { level: "info", message: "tracking cookie received" },
                    { level: "info", message: "database condition evaluated silently" },
                    { level: "warning", message: "response behavior changed" },
                    { level: "success", message: "true condition inferred" },
                    { level: "success", message: "blind injection confirmed" },
                    { level: "success", message: "challenge solved" },
                ],
            };
        }

        if (isTrueCondition(payload)) {
            return {
                success: false,
                message: "True condition observed. Keep going.",
                logs: [
                    { level: "info", message: "tracking cookie received" },
                    { level: "warning", message: "response behavior: welcome banner visible" },
                    { level: "info", message: "boolean condition appears true" },
                    { level: "info", message: "prove a meaningful extracted condition" },
                ],
            };
        }

        if (isFalseCondition(payload)) {
            return {
                success: false,
                message: "False condition observed.",
                logs: [
                    { level: "info", message: "tracking cookie received" },
                    { level: "error", message: "response behavior: welcome banner hidden" },
                    { level: "info", message: "boolean condition appears false" },
                ],
            };
        }

        return {
            success: false,
            message: "No useful behavior difference detected.",
            logs: [
                { level: "info", message: "tracking cookie received" },
                { level: "error", message: "response behavior unchanged" },
                { level: "error", message: "no boolean oracle detected" },
            ],
        };
    },
};