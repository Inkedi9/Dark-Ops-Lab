"use client";

import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

export default function MiniBarChart({ title, items = [], accent = "blue" }) {
    const accentClasses = {
        blue: "bg-blue-300 shadow-[0_0_14px_rgba(96,165,250,0.35)]",
        emerald: "bg-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.35)]",
        violet: "bg-violet-300 shadow-[0_0_14px_rgba(168,85,247,0.35)]",
        amber: "bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.30)]",
    };

    return (
        <PanelCard variant="elevated" accent={accent} className="p-6">
            <AppBadge variant={accent}>{title}</AppBadge>

            <div className="mt-6 space-y-4">
                {items.map((item) => (
                    <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-slate-300">
                                {item.label}
                            </p>

                            <p className="font-mono text-xs text-slate-500">
                                {item.value}%
                            </p>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${accentClasses[accent] || accentClasses.blue
                                    }`}
                                style={{ width: `${item.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </PanelCard>
    );
}
