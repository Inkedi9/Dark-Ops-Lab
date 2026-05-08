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

    return `GET /profile
Cookie: TrackingId=${trackingId || "guest-session"}

Server behavior:
- No database errors are shown
- No rows are returned
- Only response delay can reveal execution`;
}

function hasSleepPayload(payload: string) {
    return (
        /sleep\s*\(\s*5\s*\)/i.test(payload) ||
        /pg_sleep\s*\(\s*5\s*\)/i.test(payload) ||
        /waitfor\s+delay\s+'00:00:05'/i.test(payload)
    );
}

function hasConditionalSleepPayload(payload: string) {
    return (
        /substring\s*\(\s*password\s*,\s*1\s*,\s*1\s*\)\s*=\s*'s'[\s\S]*sleep\s*\(\s*5\s*\)/i.test(payload) ||
        /substr\s*\(\s*password\s*,\s*1\s*,\s*1\s*\)\s*=\s*'s'[\s\S]*sleep\s*\(\s*5\s*\)/i.test(payload) ||
        /case\s+when[\s\S]*then[\s\S]*sleep\s*\(\s*5\s*\)/i.test(payload)
    );
}

export const timeBasedBlindSqliChallenge: ChallengeDefinition = {
    id: "sqli-003",
    slug: "time-based-blind-sqli",
    title: "Time-based Blind SQLi",
    category: "Injection",
    difficulty: "advanced",
    estimatedMinutes: 35,
    objective:
        "Use response delay as an oracle to prove that the tracking cookie reaches a SQL execution context.",
    successCondition:
        "The simulated server delays the response because a conditional SQL sleep payload executed.",
    sandboxType: "sql",
    sandboxMode: "time",
    fields: [
        {
            name: "trackingId",
            label: "TrackingId Cookie",
            placeholder: "guest-session",
            type: "text",
        },
    ],

    exploitFeedback: {
        title: "Response delay became an oracle",
        summary:
            "The payload caused measurable delay, proving that SQL logic executed even without visible output.",
        brokenAssumption:
            "The application assumed that no visible error or data meant no exploit signal.",
        impact:
            "An attacker can extract data by measuring response times for conditional payloads.",
        defensiveFix:
            "Use parameterized queries and enforce query timeouts, monitoring abnormal latency patterns.",
    },

    hints: [
        {
            id: "time-sqli-h1",
            title: "No visible difference",
            content:
                "The response body does not change. You need to watch timing instead.",
            penalty: 150,
        },
        {
            id: "time-sqli-h2",
            title: "Delay primitive",
            content:
                "Some SQL dialects allow intentional delay functions like SLEEP or pg_sleep.",
            penalty: 150,
        },
        {
            id: "time-sqli-h3",
            title: "Conditional delay",
            content:
                "A conditional delay can prove that a specific database condition was true.",
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
                message: "No tracking cookie supplied.",
                logs: [
                    { level: "error", message: "tracking cookie missing" },
                    { level: "error", message: "request ignored" },
                ],
            };
        }

        if (hasConditionalSleepPayload(payload)) {
            return {
                success: true,
                message: "Time-based oracle confirmed.",
                logs: [
                    { level: "info", message: "tracking cookie received" },
                    { level: "info", message: "query executed without visible output" },
                    { level: "warning", message: "conditional delay triggered" },
                    { level: "success", message: "response delayed by 5 seconds" },
                    { level: "success", message: "time-based blind injection confirmed" },
                    { level: "success", message: "challenge solved" },
                ],
            };
        }

        if (hasSleepPayload(payload)) {
            return {
                success: false,
                message: "Delay observed. Make it conditional.",
                logs: [
                    { level: "info", message: "tracking cookie received" },
                    { level: "warning", message: "response delayed by 5 seconds" },
                    { level: "info", message: "unconditional delay is not enough" },
                    { level: "info", message: "prove a conditional database check" },
                ],
            };
        }

        return {
            success: false,
            message: "No timing difference detected.",
            logs: [
                { level: "info", message: "tracking cookie received" },
                { level: "error", message: "response returned normally" },
                { level: "error", message: "no time oracle detected" },
            ],
        };
    },
};