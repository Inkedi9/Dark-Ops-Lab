import type { CtfStep } from "../types";

export const adminTakeoverAdminStep: CtfStep = {
    id: "admin-takeover-admin",
    title: "Step 4 — Admin Panel Access",
    objective:
        "Replay the extracted admin token to access the protected admin panel.",
    field: {
        name: "token",
        label: "Admin token",
        placeholder: "adm_debug_713",
        type: "text",
    },
    evaluate(input) {
        const token = String(input.token ?? "").trim();

        if (token === "adm_debug_713") {
            return {
                success: true,
                message: "Admin panel breached.",
                flagFragment: "_complete}",
                logs: [
                    { level: "info", message: "admin token submitted" },
                    { level: "warning", message: "session replay accepted" },
                    { level: "success", message: "admin panel opened" },
                    { level: "success", message: "flag fragment recovered: _complete}" },
                ],
            };
        }

        return {
            success: false,
            message: "Admin token rejected.",
            logs: [
                { level: "info", message: "admin token submitted" },
                { level: "error", message: "admin panel denied access" },
            ],
        };
    },
};