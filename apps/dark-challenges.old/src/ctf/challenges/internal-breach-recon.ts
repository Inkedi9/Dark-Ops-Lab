import type { CtfStep } from "../types";

export const internalBreachReconStep: CtfStep = {
    id: "internal-breach-recon",
    title: "Step 1 — Exposed Diagnostics",
    objective:
        "Find a useful internal hint from the exposed diagnostics endpoint.",
    field: {
        name: "path",
        label: "Endpoint path",
        placeholder: "/debug",
        type: "text",
    },
    evaluate(input) {
        const path = String(input.path ?? "").toLowerCase().trim();

        if (path === "/debug" || path === "/diagnostics") {
            return {
                success: true,
                message: "Debug endpoint exposed.",
                flagFragment: "flag{internal",
                logs: [
                    { level: "info", message: "endpoint requested" },
                    { level: "warning", message: "debug endpoint exposed metadata" },
                    { level: "success", message: "internal service name discovered" },
                    { level: "success", message: "flag fragment recovered: flag{internal" },
                ],
            };
        }

        return {
            success: false,
            message: "Nothing useful found.",
            logs: [
                { level: "info", message: "endpoint requested" },
                { level: "error", message: "no debug metadata exposed" },
            ],
        };
    },
};