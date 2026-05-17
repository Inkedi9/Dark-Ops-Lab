import type { CtfStep } from "../types";

export const internalBreachCommandStep: CtfStep = {
    id: "internal-breach-command",
    title: "Step 3 — Read Flag File",
    objective:
        "Use the internal shell utility to read the final flag file.",
    field: {
        name: "command",
        label: "Command",
        placeholder: "cat /flag.txt",
        type: "text",
    },
    evaluate(input) {
        const command = String(input.command ?? "").toLowerCase().trim();

        if (command === "cat /flag.txt" || command === "cat /opt/flag.txt") {
            return {
                success: true,
                message: "Flag file read.",
                flagFragment: "_compromised}",
                logs: [
                    { level: "info", message: "internal command submitted" },
                    { level: "warning", message: "file read primitive available" },
                    { level: "success", message: "flag file opened" },
                    { level: "success", message: "flag fragment recovered: _compromised}" },
                ],
            };
        }

        return {
            success: false,
            message: "Command executed but no flag recovered.",
            logs: [
                { level: "info", message: "internal command submitted" },
                { level: "error", message: "flag file not accessed" },
            ],
        };
    },
};