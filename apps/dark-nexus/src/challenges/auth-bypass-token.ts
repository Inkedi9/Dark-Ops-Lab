import type {
    ChallengeDefinition,
    ChallengeInput,
    ChallengeResult,
} from "@/engine/types";

function getValue(input: ChallengeInput, key: string) {
    return String(input[key] ?? "").trim();
}

function buildPreview(input: ChallengeInput) {
    const username = getValue(input, "username");
    const password = getValue(input, "password");
    const token = getValue(input, "token");

    return `POST /login
username=${username || "<empty>"}
password=${password || "<empty>"}

GET /admin
Authorization: Bearer ${token || "<missing>"}`;
}

function weakCredentialsValid(input: ChallengeInput) {
    return (
        getValue(input, "username").toLowerCase() === "guest" &&
        getValue(input, "password").toLowerCase() === "guest"
    );
}

function tokenValid(input: ChallengeInput) {
    const token = getValue(input, "token");

    return token === "debug-admin-token";
}

export const authBypassTokenChallenge: ChallengeDefinition = {
    id: "auth-001",
    slug: "auth-bypass-token",
    title: "Token Replay",
    category: "Authentication",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    objective:
        "Chain weak credentials with an exposed debug token to access the admin route.",
    successCondition:
        "The simulated admin endpoint accepts the replayed bearer token.",
    sandboxType: "terminal",
    fields: [
        {
            name: "username",
            label: "Username",
            placeholder: "guest",
            type: "text",
        },
        {
            name: "password",
            label: "Password",
            placeholder: "guest",
            type: "text",
        },
        {
            name: "token",
            label: "Bearer Token",
            placeholder: "debug-admin-token",
            type: "text",
        },
    ],

    exploitFeedback: {
        title: "Trust boundary was broken",
        summary:
            "A low-privilege path exposed a token that could be replayed against an admin route.",
        brokenAssumption:
            "The application assumed debug artifacts would not be reachable or reusable.",
        impact:
            "An attacker can escalate privileges by chaining weak access with token reuse.",
        defensiveFix:
            "Remove debug artifacts, scope tokens tightly, and validate token audience, expiry, and privilege.",
    },

    hints: [
        {
            id: "auth-token-h1",
            title: "Low privilege first",
            content: "Start by finding access that looks harmless.",
            penalty: 150,
        },
        {
            id: "auth-token-h2",
            title: "Debug artifacts",
            content: "Development systems often expose tokens or headers.",
            penalty: 150,
        },
        {
            id: "auth-token-h3",
            title: "Replay",
            content: "A token can sometimes be reused outside its intended context.",
            penalty: 150,
        },
    ],
    getPreview(input) {
        return buildPreview(input);
    },
    evaluate(input): ChallengeResult {
        const hasWeakLogin = weakCredentialsValid(input);
        const hasToken = tokenValid(input);

        if (!hasWeakLogin) {
            return {
                success: false,
                message: "Initial access failed.",
                logs: [
                    { level: "info", message: "login request submitted" },
                    { level: "error", message: "guest session not established" },
                    { level: "error", message: "admin route blocked" },
                ],
            };
        }

        if (!hasToken) {
            return {
                success: false,
                message: "Guest access obtained. Admin token missing.",
                logs: [
                    { level: "success", message: "guest session established" },
                    { level: "warning", message: "debug route exposed token reference" },
                    { level: "error", message: "bearer token rejected by admin route" },
                    { level: "info", message: "chain incomplete" },
                ],
            };
        }

        return {
            success: true,
            message: "Admin route compromised.",
            logs: [
                { level: "success", message: "guest session established" },
                { level: "warning", message: "debug token discovered" },
                { level: "warning", message: "bearer token replayed" },
                { level: "success", message: "admin route accepted token" },
                { level: "success", message: "challenge solved" },
            ],
        };
    },
};