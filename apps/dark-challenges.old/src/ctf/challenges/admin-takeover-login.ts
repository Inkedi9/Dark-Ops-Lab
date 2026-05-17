import type { CtfStep } from "../types";

export const adminTakeoverLoginStep: CtfStep = {
    id: "admin-takeover-login",
    title: "Step 1 — Legacy Login Bypass",
    objective:
        "Bypass the legacy login form and obtain access to the internal comment system.",
    field: {
        name: "payload",
        label: "Login payload",
        placeholder: "' OR '1'='1",
        type: "text",
    },
    evaluate(input) {
        const payload = String(input.payload ?? "").toLowerCase();

        if (payload.includes("' or '1'='1") || payload.includes("' or 1=1")) {
            return {
                success: true,
                message: "Legacy login bypassed.",
                flagFragment: "flag{admin",
                logs: [
                    { level: "info", message: "login request submitted" },
                    { level: "warning", message: "authentication query altered" },
                    { level: "success", message: "internal comment system unlocked" },
                    { level: "success", message: "flag fragment recovered: flag{admin" },
                ],
            };
        }

        return {
            success: false,
            message: "Login bypass failed.",
            logs: [
                { level: "info", message: "login request submitted" },
                { level: "error", message: "authentication denied" },
            ],
        };
    },
};