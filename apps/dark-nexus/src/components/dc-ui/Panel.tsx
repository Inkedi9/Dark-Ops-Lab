import type { ReactNode } from "react";

type PanelAccent = "blue" | "green" | "violet" | "amber" | "danger" | "none";

type PanelProps = {
    children: ReactNode;
    className?: string;
    accent?: PanelAccent;
};

const accentClasses: Record<PanelAccent, string> = {
    blue: [
        "border-[rgba(var(--dc-accent),0.22)]",
        "before:bg-[rgba(var(--dc-accent),0.38)]",
        "after:bg-[radial-gradient(circle_at_top_right,rgba(var(--dc-accent),0.045),transparent_45%)]",
    ].join(" "),

    green: [
        "border-emerald-400/20",
        "before:bg-emerald-300/38",
        "after:bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.045),transparent_45%)]",
    ].join(" "),

    violet: [
        "border-violet-400/20",
        "before:bg-violet-300/38",
        "after:bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.045),transparent_45%)]",
    ].join(" "),

    amber: [
        "border-amber-300/20",
        "before:bg-amber-300/38",
        "after:bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.045),transparent_45%)]",
    ].join(" "),

    danger: [
        "border-red-400/20",
        "before:bg-red-400/38",
        "after:bg-[radial-gradient(circle_at_top_right,rgba(255,92,122,0.05),transparent_45%)]",
    ].join(" "),

    none: [
        "border-slate-800",
        "before:bg-transparent",
        "after:bg-none",
    ].join(" "),
};

export function Panel({
    children,
    className = "",
    accent = "blue",
}: PanelProps) {
    return (
        <div
            className={[
                "relative overflow-hidden rounded-2xl border bg-black/30 p-6 backdrop-blur-xl",
                "shadow-[inset_0_0_24px_rgba(var(--dc-accent),0.028),0_0_34px_rgba(var(--dc-accent),0.035)]",
                "before:pointer-events-none before:absolute before:left-0 before:top-0 before:h-px before:w-full",
                "after:pointer-events-none after:absolute after:inset-0",
                accentClasses[accent],
                className,
            ].join(" ")}
        >
            <div className="relative z-10">{children}</div>
        </div>
    );
}