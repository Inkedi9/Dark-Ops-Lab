export default function TerminalExercisePanel({
    title = "sandbox.output",
    children,
    status = "neutral",
    className = "",
}) {
    const statusStyles = {
        neutral: "text-blue-300 ring-blue-300/[0.20]",
        success: "text-emerald-300 ring-emerald-300/[0.25]",
        warning: "text-amber-300 ring-amber-300/[0.25]",
        danger: "text-red-300 ring-red-300/[0.25]",
    };

    return (
        <div
            className={`rounded-md relative overflow-hidden bg-black/85 p-4 font-mono ring-1 ${statusStyles[status] || statusStyles.neutral
                } shadow-[inset_0_0_36px_rgba(255,255,255,0.035)] ${className}`}
        >
            <div className="pointer-events-none absolute inset-0 terminal-scanline opacity-30" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-current opacity-50" />

            <div className="relative">
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        {title}
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.24em]">
                        {status}
                    </p>
                </div>

                <div className="text-sm leading-6">{children}</div>
            </div>
        </div>
    );
}
