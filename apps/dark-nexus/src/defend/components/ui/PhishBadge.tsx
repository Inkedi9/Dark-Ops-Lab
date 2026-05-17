"use client";

import type { ReactNode } from "react";
import AppBadge from "@dark/ui/components/AppBadge";

type PhishBadgeProps = {
    children: ReactNode;
    tone?: string;
};

export function PhishBadge({ children, tone = "teal" }: PhishBadgeProps) {
    const variants = {
        blue: "blue",
        teal: "blue",
        slate: "default",
        red: "danger",
        danger: "danger",
        orange: "amber",
        emerald: "emerald",
        green: "emerald",
        amber: "amber",
        violet: "blue",
    };

    return (
        <AppBadge variant={variants[tone as keyof typeof variants] || variants.teal} className="rounded-lg tracking-[0.16em]">
            {children}
        </AppBadge>
    );
}
