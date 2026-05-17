import type { ReactNode } from "react";

type NexusCardProps = {
    children: ReactNode;
    className?: string;
    accent?: "blue" | "green" | "red" | "violet";
};

const accentMap = {
    blue: "border-[rgba(var(--dc-accent),0.22)] shadow-[0_0_34px_rgba(var(--dc-accent),0.06)]",
    green: "border-emerald-400/20 shadow-[0_0_34px_rgba(52,211,153,0.06)]",
    red: "border-red-400/20 shadow-[0_0_34px_rgba(255,92,122,0.06)]",
    violet: "border-violet-400/20 shadow-[0_0_34px_rgba(167,139,250,0.06)]",
};

export function NexusCard({
    children,
    className = "",
    accent = "blue",
}: NexusCardProps) {
    return (
        <div
            className={[
                "relative overflow-hidden rounded-2xl border bg-black/30 p-5 backdrop-blur-xl",
                "shadow-[inset_0_0_24px_rgba(var(--dc-accent),0.035)]",
                "before:pointer-events-none before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-[rgba(var(--dc-accent),0.35)]",
                "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top_right,rgba(var(--dc-accent),0.045),transparent_45%)]",
                accentMap[accent],
                className,
            ].join(" ")}
        >
            <div className="relative z-10">{children}</div>
        </div>
    );
}