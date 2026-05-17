import { useXp } from "../../hooks/useXp";

export default function XpBadge() {
    const { xp, level } = useXp();

    return (
        <div className="group relative flex items-center gap-3 rounded-xl bg-emerald-300/[0.05] px-4 py-2 ring-1 ring-emerald-300/[0.18] transition hover:ring-emerald-300/[0.35]">

            {/* subtle glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
            </div>

            {/* level */}
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-300 text-xs font-black text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.35)]">
                {level}
            </div>

            {/* xp */}
            <div className="leading-tight">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
                    XP
                </p>

                <p className="text-sm font-bold text-white">
                    {xp}
                </p>
            </div>
        </div>
    );
}
