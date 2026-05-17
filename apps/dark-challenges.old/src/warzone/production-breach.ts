import type { Warzone, WarzoneState } from "./types";

function completeObjective(state: WarzoneState, objectiveId: string) {
    return Array.from(new Set([...state.objectivesCompleted, objectiveId]));
}

function addFlagPart(state: WarzoneState, flagPart: string) {
    return Array.from(new Set([...state.flagParts, flagPart]));
}

export const productionBreachWarzone: Warzone = {
    id: "warzone-production-breach",
    slug: "production-breach",
    title: "Production Breach",
    description:
        "A live production-like environment is leaking signals. Explore, exploit, escalate and exfiltrate before the window closes.",
    difficulty: "advanced",
    timeLimitSeconds: 900,
    rewardXp: 7500,
    badge: "Warzone Operator",
    objectives: [
        {
            id: "recon",
            title: "Recon the exposed surface",
            description: "Identify a useful endpoint or debug surface.",
        },
        {
            id: "initial-access",
            title: "Gain initial access",
            description: "Use an injection path to obtain a low-privilege session.",
        },
        {
            id: "privilege-escalation",
            title: "Escalate privileges",
            description: "Find and reuse a privileged token.",
        },
        {
            id: "exfiltration",
            title: "Exfiltrate the final flag",
            description: "Use the compromised access to read the flag.",
        },
    ],
    initialState: {
        stage: "recon",
        objectivesCompleted: [],
        flagParts: [],
    },
    evaluateAction(input, state) {
        const command = input.toLowerCase().trim();

        if (!command) {
            return {
                success: false,
                message: "No action supplied.",
                logs: [
                    { level: "error", message: "empty action ignored" },
                ],
            };
        }

        if (state.stage === "recon") {
            if (
                command.includes("/debug") ||
                command.includes("/diagnostics") ||
                command.includes("scan")
            ) {
                return {
                    success: true,
                    message: "Debug surface discovered.",
                    logs: [
                        { level: "info", message: "surface scan executed" },
                        { level: "warning", message: "debug endpoint exposed build metadata" },
                        { level: "success", message: "endpoint discovered: /legacy-login" },
                        { level: "success", message: "flag fragment recovered: flag{prod" },
                    ],
                    nextState: {
                        stage: "initial-access",
                        objectivesCompleted: completeObjective(state, "recon"),
                        flagParts: addFlagPart(state, "flag{prod"),
                    },
                };
            }

            return {
                success: false,
                message: "Recon produced no useful signal.",
                logs: [
                    { level: "info", message: "surface scan executed" },
                    { level: "error", message: "no exploitable signal found" },
                    { level: "info", message: "try looking for debug or diagnostics surfaces" },
                ],
            };
        }

        if (state.stage === "initial-access") {
            if (
                command.includes("' or '1'='1") ||
                command.includes("' or 1=1") ||
                command.includes("sqli")
            ) {
                return {
                    success: true,
                    message: "Initial access obtained.",
                    logs: [
                        { level: "info", message: "legacy login request submitted" },
                        { level: "warning", message: "authentication logic altered" },
                        { level: "success", message: "low-privilege production session created" },
                        { level: "success", message: "flag fragment recovered: _access" },
                    ],
                    nextState: {
                        stage: "privilege-escalation",
                        objectivesCompleted: completeObjective(state, "initial-access"),
                        flagParts: addFlagPart(state, "_access"),
                    },
                };
            }

            return {
                success: false,
                message: "Initial access failed.",
                logs: [
                    { level: "info", message: "legacy login tested" },
                    { level: "error", message: "session not created" },
                    { level: "info", message: "the exposed legacy login may trust raw query logic" },
                ],
            };
        }

        if (state.stage === "privilege-escalation") {
            if (
                command.includes("debug-admin-token") ||
                command.includes("token") ||
                command.includes("bearer")
            ) {
                return {
                    success: true,
                    message: "Privilege escalation confirmed.",
                    logs: [
                        { level: "info", message: "session artifacts inspected" },
                        { level: "warning", message: "debug-admin-token found in exposed response" },
                        { level: "success", message: "privileged bearer token accepted" },
                        { level: "success", message: "flag fragment recovered: _root" },
                    ],
                    nextState: {
                        stage: "exfiltration",
                        objectivesCompleted: completeObjective(state, "privilege-escalation"),
                        flagParts: addFlagPart(state, "_root"),
                    },
                };
            }

            return {
                success: false,
                message: "Privilege escalation failed.",
                logs: [
                    { level: "info", message: "session artifacts inspected" },
                    { level: "error", message: "no privileged token replayed" },
                    { level: "info", message: "look for debug tokens or bearer artifacts" },
                ],
            };
        }

        if (state.stage === "exfiltration") {
            if (
                command.includes("cat /flag.txt") ||
                command.includes("/flag.txt") ||
                command.includes("exfil")
            ) {
                return {
                    success: true,
                    message: "Production flag exfiltrated.",
                    logs: [
                        { level: "info", message: "privileged file read requested" },
                        { level: "warning", message: "sensitive file access granted" },
                        { level: "success", message: "flag recovered: flag{prod_access_root_exfil}" },
                        { level: "success", message: "warzone complete" },
                    ],
                    nextState: {
                        stage: "complete",
                        objectivesCompleted: completeObjective(state, "exfiltration"),
                        flagParts: addFlagPart(state, "_exfil}"),
                    },
                };
            }

            return {
                success: false,
                message: "Exfiltration failed.",
                logs: [
                    { level: "info", message: "privileged action attempted" },
                    { level: "error", message: "flag file not accessed" },
                ],
            };
        }

        return {
            success: false,
            message: "Warzone already complete.",
            logs: [
                { level: "success", message: "operation already completed" },
            ],
        };
    },
};