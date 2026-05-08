import RiskBadge from "./RiskBadge";

export default function EmailCard({ email, selected, onClick, completed }) {
    const badgeClass =
        email.badge === "External"
            ? "bg-danger/15 text-danger border-danger/30"
            : email.badge === "Internal"
                ? "bg-success/15 text-success border-success/30"
                : "bg-blue-400/10 text-blue-300 border-blue-300/30";

    return (
        <button
            onClick={onClick}
            className={`w-full rounded-2xl border p-4 text-left transition duration-200 ${selected
                ? "border-blue-300/60 bg-blue-400/10 shadow-[0_0_24px_rgba(0,229,255,0.12)] ring-1 ring-blue-300/20"
                : completed
                    ? "border-green-300/30 bg-green-400/5 shadow-md shadow-green-500/5 hover:border-green-300/50"
                    : "border-blue-400/15 bg-black/25 hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-blue-400/5 hover:shadow-[0_0_22px_rgba(0,229,255,0.07)]"
                }`}
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">{email.senderName}</h3>
                    <p className="truncate text-xs text-slate-400">{email.senderEmail}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted">{email.date}</span>
            </div>

            <p className="truncate text-sm font-semibold text-slate-100">{email.subject}</p>
            <p className="mt-1 text-sm text-muted">{email.preview}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                {email.pathId && (
                    <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 font-mono text-xs text-blue-300">
                        {email.pathId}
                    </span>
                )}

                <span className="rounded-full border border-blue-400/15 bg-black/30 px-3 py-1 font-mono text-xs text-slate-200">
                    {email.category}
                </span>

                <span className="rounded-full border border-blue-400/15 bg-black/30 px-3 py-1 font-mono text-xs text-slate-200">
                    {email.difficulty}
                </span>

                <span className={`rounded-full border px-3 py-1 font-mono text-xs ${badgeClass}`}>
                    {email.badge}
                </span>

                <RiskBadge level={email.riskLevel} />

                {completed && (
                    <span className="rounded-full border border-green-300/30 bg-green-400/10 px-3 py-1 font-mono text-xs text-green-300">
                        Analyzed
                    </span>
                )}
            </div>
        </button>
    );
}
