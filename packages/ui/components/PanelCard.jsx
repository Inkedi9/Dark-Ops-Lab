import { radius, spacing } from "../styles/ui";

const accents = {
    none: "",
    blue: "before:bg-blue-200/35 after:bg-blue-400/[0.045]",
    violet: "before:bg-indigo-200/35 after:bg-indigo-400/[0.045]",
    emerald: "before:bg-emerald-200/35 after:bg-emerald-400/[0.045]",
    amber: "before:bg-amber-200/35 after:bg-amber-400/[0.045]",
    danger: "before:bg-red-200/35 after:bg-red-400/[0.045]",
};

const variants = {
    subtle:
        "bg-white/[0.018] ring-1 ring-white/[0.035] shadow-[0_10px_35px_rgba(0,0,0,.25)]",

    default:
        "bg-[#0b0f17]/88 ring-1 ring-white/[0.055] shadow-[0_18px_55px_rgba(0,0,0,.42)]",

    elevated:
        "bg-gradient-to-b from-white/[0.045] to-white/[0.014] ring-1 ring-white/[0.07] shadow-[0_24px_70px_rgba(0,0,0,.52)]",

    featured:
        "bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.055),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.045),rgba(255,255,255,0.012))] ring-1 ring-white/[0.075] shadow-[0_28px_85px_rgba(0,0,0,.58)]",

    hero:
        "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_58%),linear-gradient(to_bottom,rgba(255,255,255,0.045),rgba(255,255,255,0.012))] ring-1 ring-white/[0.085] shadow-[0_32px_100px_rgba(0,0,0,.62)]",

    glass:
        "bg-white/[0.022] ring-1 ring-white/[0.045] backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,.38)]",

    danger:
        "bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.065),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] ring-1 ring-red-300/[0.10] shadow-[0_22px_70px_rgba(248,113,113,0.05)]",

    nexus:
        "border border-blue-300/10 bg-black/25 ring-1 ring-blue-300/[0.045] backdrop-blur-xl shadow-[inset_0_0_18px_rgba(96,165,250,.012),0_10px_35px_rgba(0,0,0,.52)]",

    nexusHero:
        "border border-blue-300/12 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.055),transparent_40%),linear-gradient(to_bottom,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] ring-1 ring-white/[0.05] backdrop-blur-2xl shadow-[0_18px_70px_rgba(0,0,0,.62)]",

    darkNexus:
        "border border-white/[0.055] bg-[#03070c]/72 ring-1 ring-white/[0.04] backdrop-blur-2xl shadow-[inset_0_0_22px_rgba(96,165,250,.012),0_14px_45px_rgba(0,0,0,.55)]",

    darkNexusHero:
        "border border-white/[0.065] bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.055),transparent_40%),linear-gradient(to_bottom,rgba(255,255,255,0.038),rgba(255,255,255,0.011))] ring-1 ring-white/[0.055] backdrop-blur-2xl shadow-[0_24px_85px_rgba(0,0,0,.64)]",

};

export default function PanelCard({
    children,
    variant = "default",
    accent = "none",
    hover = false,
    animated = false,
    className = "",
}) {
    const hasAccent = accent !== "none";
    const isNexus =
        variant === "nexus" ||
        variant === "nexusHero" ||
        variant === "darkNexus" ||
        variant === "darkNexusHero";

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
                "hover:-translate-y-[1px] hover:ring-white/[0.09] hover:shadow-[0_26px_90px_rgba(0,0,0,0.62)] hover:after:opacity-100",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {isNexus && (
                <>
                    <div className="pointer-events-none absolute inset-0 opacity-14 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px]" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/30 to-indigo-200/16" />
                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-300/[0.025] blur-3xl" />
                </>
            )}

            <div className="relative z-10">{children}</div>
        </div>
    );
}
