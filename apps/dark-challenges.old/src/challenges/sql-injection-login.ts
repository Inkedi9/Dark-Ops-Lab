import type {
    ChallengeDefinition,
    ChallengeInput,
    ChallengeResult,
} from "@/engine/types";

const validPayloadPatterns = [
    /'\s*or\s*'1'\s*=\s*'1/i,
    /'\s*or\s*1\s*=\s*1/i,
    /admin'\s*--/i,
    /'\s*--/i,
    /'\s*or\s*'a'\s*=\s*'a/i,
];

function buildQuery(input: ChallengeInput) {
    const username = String(input.username ?? "");
    const password = String(input.password ?? "");

    return `SELECT * FROM users WHERE username = '${username}' AND password = '${password}';`;
}

function hasValidInjection(input: ChallengeInput) {
    const combinedInput = `${input.username ?? ""} ${input.password ?? ""}`;

    return validPayloadPatterns.some((pattern) => pattern.test(combinedInput));
}

export const sqlInjectionLoginChallenge: ChallengeDefinition = {
    id: "sqli-001",
    slug: "sql-injection-login",
    title: "Login Bypass",
    category: "Injection",
    difficulty: "beginner",
    estimatedMinutes: 15,
    objective: "Authenticate as any valid user without knowing the password.",
    successCondition:
        "The simulated backend returns an authenticated session.",
    sandboxType: "sql",
    fields: [
        {
            name: "username",
            label: "Username",
            placeholder: "alice",
            type: "text",
        },
        {
            name: "password",
            label: "Password",
            placeholder: "password",
            type: "text",
        },
    ],
    relatedLessons: [
        {
            title: "SQL Injection",
            description: "Review unsafe query construction and boolean bypasses.",
            href: "/lessons/sql-injection",
        },
    ],

    exploitFeedback: {
        title: "Query logic was altered",
        summary:
            "Your input changed the intended authentication condition instead of being treated as plain data.",
        brokenAssumption:
            "The application assumed user input could be safely concatenated into a SQL query.",
        impact:
            "An attacker can bypass authentication and access accounts without valid credentials.",
        defensiveFix:
            "Use parameterized queries so user input is handled as data, not executable SQL logic.",
    },

    hints: [
        {
            id: "hint-1",
            title: "Observe the query",
            content: "Watch how your input is inserted into the SQL query.",
            penalty: 150,
        },
        {
            id: "hint-2",
            title: "Break the boundary",
            content: "A single quote can change where the string ends.",
            penalty: 150,
        },
        {
            id: "hint-3",
            title: "Change the condition",
            content:
                "Try making the WHERE condition true even when the password is wrong.",
            penalty: 150,
        },
    ],
    getPreview(input) {
        return buildQuery(input);
    },
    evaluate(input): ChallengeResult {
        const query = buildQuery(input);

        if (hasValidInjection(input)) {
            return {
                success: true,
                message: "Access granted.",
                logs: [
                    { level: "info", message: "input received" },
                    { level: "info", message: "query generated" },
                    { level: "warning", message: "boolean condition altered" },
                    { level: "success", message: "database response: 1 row" },
                    { level: "success", message: "session granted" },
                    { level: "success", message: "challenge solved" },
                ],
                metadata: {
                    query,
                },
            };
        }

        return {
            success: false,
            message: "Authentication failed.",
            logs: [
                { level: "info", message: "input received" },
                { level: "info", message: "query generated" },
                { level: "error", message: "database response: 0 rows" },
                { level: "error", message: "authentication failed" },
            ],
            metadata: {
                query,
            },
        };
    },
};

