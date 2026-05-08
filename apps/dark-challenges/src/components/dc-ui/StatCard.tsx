type StatCardProps = {
    label: string;
    value: string | number;
    hint?: string;
    accent?: "blue" | "green" | "amber" | "red" | "violet";
};

const accentStyles = {
    blue: "text-blue-300 before:bg-blue-300/40",
    green: "text-emerald-300 before:bg-emerald-300/40",
    amber: "text-amber-300 before:bg-amber-300/40",
    red: "text-red-300 before:bg-red-300/40",
    violet: "text-violet-300 before:bg-violet-300/40",
};

export function StatCard({
    label,
    value,
    hint,
    accent = "blue",
}: StatCardProps) {
    return (
        <div
            className={[
                "relative overflow-hidden rounded-xl border bg-black/30 p-4 backdrop-blur-xl",
                "border-[rgba(var(--dc-accent),0.18)]",
                "shadow-[inset_0_0_18px_rgba(var(--dc-accent),0.025)]",
                "before:absolute before:left-0 before:top-0 before:h-px before:w-full",
                "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top_right,rgba(var(--dc-accent),0.04),transparent_45%)]",
            ].join(" ")}
        >
            <div className="relative z-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    {label}
                </p>

                <p
                    className={[
                        "mt-2 text-3xl font-black tracking-tight",
                        accentStyles[accent],
                    ].join(" ")}
                >
                    {value}
                </p>

                {hint && (
                    <p className="mt-1 text-xs text-slate-500">{hint}</p>
                )}
            </div>
        </div>
    );
}