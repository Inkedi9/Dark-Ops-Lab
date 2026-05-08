import type { CtfStep } from "../types";

export const adminTakeoverXssStep: CtfStep = {
    id: "admin-takeover-xss",
    title: "Step 2 — Stored XSS Implant",
    objective:
        "Plant a stored XSS payload that will execute when an admin reviews the comments.",
    field: {
        name: "comment",
        label: "Stored comment",
        placeholder: "<img src=x onerror=...>",
        type: "textarea",
    },
    evaluate(input) {
        const comment = String(input.comment ?? "").toLowerCase();

        if (
            comment.includes("onerror") ||
            comment.includes("<script") ||
            comment.includes("onload")
        ) {
            return {
                success: true,
                message: "Stored implant accepted.",
                flagFragment: "_takeover",
                logs: [
                    { level: "info", message: "comment submitted" },
                    { level: "warning", message: "payload stored in moderation queue" },
                    { level: "success", message: "admin browser execution simulated" },
                    { level: "success", message: "flag fragment recovered: _takeover" },
                ],
            };
        }

        return {
            success: false,
            message: "Comment stored but no execution detected.",
            logs: [
                { level: "info", message: "comment submitted" },
                { level: "error", message: "no executable payload detected" },
            ],
        };
    },
};