import AppBadge from "@dark/ui/components/AppBadge";

export default function BadgeCard({ badge }) {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl p-4 ring-1 transition ${badge.earned
                ? "bg-emerald-300/[0.075] ring-emerald-300/[0.20] shadow-[0_0_24px_rgba(16,185,129,0.10)] hover:bg-emerald-300/[0.10]"
                : "bg-slate-950/35 opacity-60 ring-white/[0.05]"
                }`}
        >
            {badge.earned && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent opacity-0 transition group-hover:opacity-100" />
            )}

            <div className="flex items-start gap-3">
                <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-black ring-1 ${badge.earned
                        ? "bg-emerald-300 text-slate-950 ring-emerald-200/40"
                        : "bg-white/[0.035] text-slate-500 ring-white/[0.06]"
                        }`}
                >
                    {badge.earned ? "✓" : "?"}
                </span>

                <div>
                    <p className="font-bold text-white">{badge.title}</p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                        {badge.description}
                    </p>

                    <div className="mt-3">
                        <AppBadge variant={badge.earned ? "emerald" : "slate"}>
                            {badge.earned ? "Earned" : "Locked"}
                        </AppBadge>
                    </div>
                </div>
            </div>
        </div>
    );
}
