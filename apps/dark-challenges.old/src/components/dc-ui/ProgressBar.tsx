type ProgressBarVariant =
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "muted";

type ProgressBarProps = {
    value: number;
    variant?: ProgressBarVariant;
    label?: string;
};

const variants: Record<ProgressBarVariant, string> = {
    default:
        "bg-[linear-gradient(90deg,rgba(var(--dc-accent),0.45),rgba(var(--dc-accent),0.8))] shadow-[0_0_14px_rgba(var(--dc-accent),0.16)]",
    success:
        "bg-[linear-gradient(90deg,rgba(52,211,153,0.45),rgba(52,211,153,0.8))] shadow-[0_0_14px_rgba(52,211,153,0.16)]",
    warning:
        "bg-[linear-gradient(90deg,rgba(251,191,36,0.45),rgba(251,191,36,0.8))] shadow-[0_0_14px_rgba(251,191,36,0.16)]",
    danger:
        "bg-[linear-gradient(90deg,rgba(248,113,113,0.45),rgba(248,113,113,0.85))] shadow-[0_0_14px_rgba(248,113,113,0.16)]",
    muted:
        "bg-slate-700/80",
};

export function ProgressBar({
    value,
    variant = "default",
    label,
}: ProgressBarProps) {
    const safeValue = Math.max(0, Math.min(100, value));

    return (
        <div>
            {label && (
                <div className="mb-2 flex justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    <span>{label}</span>
                    <span>{safeValue}%</span>
                </div>
            )}

            <div className="h-2 overflow-hidden rounded-full border border-slate-800/90 bg-black/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.65)]">
                <div
                    className={[
                        "h-full rounded-full transition-all duration-700",
                        variants[variant],
                    ].join(" ")}
                    style={{ width: `${safeValue}%` }}
                />
            </div>
        </div>
    );
}