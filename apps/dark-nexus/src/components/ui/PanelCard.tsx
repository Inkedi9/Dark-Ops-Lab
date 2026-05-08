import React from "react";
import { radius, spacing } from "@/styles/ui";

const accents = {
    none: "",
    blue: "before:bg-blue-300/60 after:bg-blue-300/10",
    violet: "before:bg-violet-300/60 after:bg-violet-300/10",
    emerald: "before:bg-emerald-300/60 after:bg-emerald-300/10",
    green: "before:bg-green-300/60 after:bg-green-300/10",
    amber: "before:bg-amber-300/60 after:bg-amber-300/10",
    danger: "before:bg-red-300/60 after:bg-red-300/10",
};

const variants = {
    subtle: "bg-white/[0.018] ring-1 ring-white/[0.035]",

    default:
        "bg-[#0b0f17]/90 ring-1 ring-white/[0.06] shadow-[0_18px_60px_rgba(0,0,0,0.38)]",

    elevated:
        "bg-gradient-to-b from-white/[0.055] to-white/[0.018] ring-1 ring-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.50)]",

    featured:
        "bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.10),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] ring-1 ring-white/[0.09] shadow-[0_30px_100px_rgba(0,0,0,0.65)]",

    hero:
        "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.075),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.055),rgba(255,255,255,0.015))] ring-1 ring-white/[0.10] shadow-[0_35px_120px_rgba(0,0,0,0.65)]",

    glass:
        "bg-white/[0.025] ring-1 ring-white/[0.05] backdrop-blur-2xl",

    danger:
        "bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.10),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.045),rgba(255,255,255,0.012))] ring-1 ring-red-300/[0.12] shadow-[0_24px_80px_rgba(248,113,113,0.08)]",

    nexus:
        "border border-blue-400/20 bg-black/30 ring-1 ring-blue-300/[0.08] backdrop-blur-xl shadow-[inset_0_0_24px_rgba(0,229,255,.04),0_0_34px_rgba(0,229,255,.06)]",

    nexusHero:
        "border border-blue-400/20 bg-black/25 ring-1 ring-blue-300/[0.10] backdrop-blur-2xl shadow-[0_0_60px_rgba(0,229,255,.10)]",

    nexusGreen:
        "border border-green-300/20 bg-black/30 ring-1 ring-green-300/[0.08] backdrop-blur-xl shadow-[inset_0_0_24px_rgba(57,255,20,.04),0_0_34px_rgba(57,255,20,.06)]",

    nexusDanger:
        "border border-red-300/20 bg-black/30 ring-1 ring-red-300/[0.08] backdrop-blur-xl shadow-[inset_0_0_24px_rgba(248,113,113,.04),0_0_34px_rgba(248,113,113,.06)]",
};

type PanelCardProps = {
    children: React.ReactNode;
    variant?: keyof typeof variants;
    accent?: keyof typeof accents;
    hover?: boolean;
    animated?: boolean;
    className?: string;
};

export default function PanelCard({
    children,
    variant = "default",
    accent = "none",
    hover = false,
    animated = false,
    className = "",
}: PanelCardProps) {
    const hasAccent = accent !== "none";

    const isNexus =
        variant === "nexus" ||
        variant === "nexusHero" ||
        variant === "nexusGreen" ||
        variant === "nexusDanger";

    const gridColor =
        variant === "nexusGreen"
            ? "rgba(57,255,20,0.08)"
            : variant === "nexusDanger"
                ? "rgba(248,113,113,0.08)"
                : "rgba(0,229,255,0.08)";

    const glowColor =
        variant === "nexusGreen"
            ? "bg-green-300/10"
            : variant === "nexusDanger"
                ? "bg-red-300/10"
                : "bg-blue-300/10";

    return (
        <div
            className={[
                `relative overflow-hidden ${radius.panel} ${spacing.card} transition duration-300 ease-out motion-hover`,
                animated && "ui-enter",
                variants[variant],
                hasAccent &&
                "before:pointer-events-none before:absolute before:left-8 before:right-8 before:top-0 before:h-px before:blur-[0.5px]",
                hasAccent &&
                "after:pointer-events-none after:absolute after:-top-28 after:right-8 after:h-56 after:w-56 after:rounded-full after:blur-3xl after:transition-opacity after:duration-300",
                accents[accent],
                hover &&
                "hover:-translate-y-0.5 hover:ring-white/[0.12] hover:shadow-[0_30px_100px_rgba(0,0,0,0.65)] hover:after:opacity-100",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {isNexus && (
                <>
                    <div
                        className="pointer-events-none absolute inset-0 opacity-25 bg-[size:28px_28px]"
                        style={{
                            backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
                        }}
                    />

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-emerald-300/40" />

                    <div
                        className={[
                            "pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl",
                            glowColor,
                        ].join(" ")}
                    />
                </>
            )}

            <div className="relative z-10">{children}</div>
        </div>
    );
}