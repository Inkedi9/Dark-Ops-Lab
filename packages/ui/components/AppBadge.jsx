import { radius } from "../styles/ui";

const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-[0.28em]";

const variants = {
    default:
        "bg-white/[0.035] text-slate-300 ring-1 ring-white/[0.07]",

    blue:
        "bg-blue-400/[0.07] text-blue-100 ring-1 ring-blue-400/[0.16]",

    violet:
        "bg-indigo-400/[0.08] text-indigo-200 ring-1 ring-indigo-300/[0.16]",

    emerald:
        "bg-emerald-400/[0.08] text-emerald-200 ring-1 ring-emerald-300/[0.16]",

    amber:
        "bg-amber-400/[0.08] text-amber-200 ring-1 ring-amber-300/[0.16]",

    danger:
        "bg-red-400/[0.08] text-red-200 ring-1 ring-red-300/[0.16]",

    nexus:
        "bg-blue-400/[0.075] text-blue-100 ring-1 ring-blue-400/[0.18] shadow-[0_0_18px_rgba(96,165,250,.06)]",

    nexusGreen:
        "bg-emerald-400/[0.075] text-emerald-100 ring-1 ring-emerald-400/[0.16] shadow-[0_0_18px_rgba(52,211,153,.05)]",
};

export default function AppBadge({
    children,
    variant = "default",
    className = "",
}) {
    return (
        <span
            className={`
                inline-flex items-center
                rounded-full px-3 py-1
                font-mono text-[11px] uppercase tracking-[0.22em]
                ${variants[variant]}
                ${className}
            `}
        >
            {children}
        </span>
    );
}
