import type { ReactNode } from "react";

type MetricCardProps = {
    label: string;
    value: ReactNode;
    helper?: string;
    accent?: "blue" | "emerald" | "violet" | "amber";
};

export default function MetricCard({
    label,
    value,
    helper,
    accent = "blue",
}: MetricCardProps) {
    const accents = {
        blue: "text-blue-300",
        emerald: "text-emerald-300",
        violet: "text-violet-300",
        amber: "text-amber-300",
    };

    return (
        <div className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]">

            {/* subtle glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                {label}
            </p>

            <p className={`mt-3 text-3xl font-extrabold tracking-tight ${accents[accent]}`}>
                {value}
            </p>

            {helper && (
                <p className="mt-2 text-sm leading-6 text-slate-400">
                    {helper}
                </p>
            )}
        </div>
    );
}
