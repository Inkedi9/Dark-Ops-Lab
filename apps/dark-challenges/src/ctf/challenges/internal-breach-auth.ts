import type { CtfStep } from "../types";

export const internalBreachAuthStep: CtfStep = {
    id: "internal-breach-auth",
    title: "Step 2 — Weak Operator Login",
    objective:
        "Use the discovered context to obtain a low-privilege operator session.",
    field: {
        name: "credentials",
        label: "Credentials",
        placeholder: "operator:operator",
        type: "text",
    },
    evaluate(input) {
        const credentials = String(input.credentials ?? "").toLowerCase().trim();

        if (
            credentials === "operator:operator" ||
            credentials === "operator:password"
        ) {
            return {
                success: true,
                message: "Operator session established.",
                flagFragment: "_system",
                logs: [
                    { level: "info", message: "login submitted" },
                    { level: "warning", message: "weak operator credentials accepted" },
                    { level: "success", message: "operator session established" },
                    { level: "success", message: "flag fragment recovered: _system" },
                ],
            };
        }

        return {
            success: false,
            message: "Authentication failed.",
            logs: [
                { level: "info", message: "login submitted" },
                { level: "error", message: "operator session rejected" },
            ],
        };
    },
};