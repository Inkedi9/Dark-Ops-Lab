import { radius } from "../../styles/ui";

const variants = {
    slate:
        "bg-white/[0.035] text-slate-300 ring-1 ring-white/[0.08]",

    blue:
        "bg-blue-300/[0.10] text-blue-200 ring-1 ring-blue-300/[0.22]",

    emerald:
        "bg-emerald-300/[0.10] text-emerald-200 ring-1 ring-emerald-300/[0.22]",

    violet:
        "bg-violet-300/[0.10] text-violet-200 ring-1 ring-violet-300/[0.22]",

    // 🔥 NEW
    nexus:
        "bg-blue-300/[0.08] text-blue-200 ring-1 ring-blue-300/[0.25] shadow-[0_0_12px_rgba(0,229,255,.18)]",

    nexusGreen:
        "bg-emerald-300/[0.08] text-emerald-200 ring-1 ring-emerald-300/[0.25] shadow-[0_0_12px_rgba(57,255,20,.18)]",
};

export default function AppBadge({
    children,
    variant = "slate",
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
