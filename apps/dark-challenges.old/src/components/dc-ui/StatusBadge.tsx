type StatusBadgeVariant =
    | "neutral"
    | "active"
    | "success"
    | "warning"
    | "danger"
    | "locked";

type StatusBadgeProps = {
    children: React.ReactNode;
    variant?: StatusBadgeVariant;
};

const variants: Record<StatusBadgeVariant, string> = {
    neutral:
        "border-slate-700/80 bg-black/25 text-slate-300",
    active:
        "border-[rgba(var(--dc-accent),0.32)] bg-[rgba(var(--dc-accent),0.055)] text-blue-100 shadow-[0_0_14px_rgba(var(--dc-accent),0.06)]",
    success:
        "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.06)]",
    warning:
        "border-amber-300/30 bg-amber-300/10 text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.06)]",
    danger:
        "border-red-400/30 bg-red-400/10 text-red-200 shadow-[0_0_14px_rgba(255,92,122,0.06)]",
    locked:
        "border-slate-800 bg-black/30 text-slate-500",
};

export function StatusBadge({
    children,
    variant = "neutral",
}: StatusBadgeProps) {
    return (
        <span
            className={[
                "inline-flex items-center rounded-full border px-3 py-1",
                "font-mono text-[11px] font-bold uppercase tracking-[0.18em]",
                "backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
                variants[variant],
            ].join(" ")}
        >
            {children}
        </span>
    );
}