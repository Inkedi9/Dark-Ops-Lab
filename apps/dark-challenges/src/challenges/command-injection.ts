import type {
    ChallengeDefinition,
    ChallengeInput,
    ChallengeResult,
} from "@/engine/types";

function getHost(input: ChallengeInput) {
    return String(input.host ?? "").trim();
}

function buildPreview(input: ChallengeInput) {
    const host = getHost(input);

    return `POST /diagnostics/ping
host=${host || "<empty>"}

Server command:
ping -c 1 ${host || "127.0.0.1"}`;
}

function hasCommandInjection(payload: string) {
    return (
        /;\s*(whoami|id|cat|ls|pwd)/i.test(payload) ||
        /&&\s*(whoami|id|cat|ls|pwd)/i.test(payload) ||
        /\|\s*(whoami|id|cat|ls|pwd)/i.test(payload)
    );
}

function isReconCommand(payload: string) {
    return /(whoami|id|pwd)/i.test(payload);
}

export const commandInjectionChallenge: ChallengeDefinition = {
    id: "cmd-001",
    slug: "command-injection",
    title: "Command Injection",
    category: "Server-side",
    difficulty: "intermediate",
    estimatedMinutes: 25,
    objective:
        "Exploit a vulnerable diagnostics form to execute an extra command on the simulated server.",
    successCondition:
        "The simulated shell executes a second command after the intended ping command.",
    sandboxType: "terminal",
    fields: [
        {
            name: "host",
            label: "Host",
            placeholder: "127.0.0.1",
            type: "text",
        },
    ],
    hints: [
        {
            id: "cmd-h1",
            title: "Command context",
            content:
                "The host value is inserted into a shell command, not just validated as text.",
            penalty: 150,
        },
        {
            id: "cmd-h2",
            title: "Command separator",
            content:
                "Shells can run more than one command when separators are accepted.",
            penalty: 150,
        },
        {
            id: "cmd-h3",
            title: "Recon first",
            content:
                "A simple identity or directory command can prove execution.",
            penalty: 150,
        },
    ],
    exploitFeedback: {
        title: "Shell command was extended",
        summary:
            "Your input escaped the intended ping argument and caused the server to execute an additional command.",
        brokenAssumption:
            "The application assumed user input could be safely inserted into a shell command.",
        impact:
            "An attacker can run arbitrary server-side commands, potentially reading files or escalating access.",
        defensiveFix:
            "Avoid shell execution with user input. Use safe APIs, strict allowlists, and argument escaping.",
    },
    getPreview(input) {
        return buildPreview(input);
    },
    evaluate(input): ChallengeResult {
        const host = getHost(input);

        if (!host) {
            return {
                success: false,
                message: "No host supplied.",
                logs: [
                    { level: "error", message: "host input missing" },
                    { level: "error", message: "diagnostics command not executed" },
                ],
            };
        }

        if (hasCommandInjection(host)) {
            return {
                success: true,
                message: "Command execution confirmed.",
                logs: [
                    { level: "info", message: "diagnostics request received" },
                    { level: "info", message: "ping command constructed" },
                    { level: "warning", message: "command separator detected" },
                    {
                        level: "success",
                        message: isReconCommand(host)
                            ? "recon command executed"
                            : "secondary command executed",
                    },
                    { level: "success", message: "command injection confirmed" },
                    { level: "success", message: "challenge solved" },
                ],
            };
        }

        return {
            success: false,
            message: "Ping executed normally.",
            logs: [
                { level: "info", message: "diagnostics request received" },
                { level: "info", message: "ping command executed" },
                { level: "error", message: "no secondary command detected" },
            ],
        };
    },
};