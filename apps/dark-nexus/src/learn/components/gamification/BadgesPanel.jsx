"use client";

import BadgeCard from "./BadgeCard";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

export default function BadgesPanel({ badges = [] }) {
    const earnedCount = badges.filter((badge) => badge.earned).length;
    const percent =
        badges.length > 0 ? Math.round((earnedCount / badges.length) * 100) : 0;

    return (
        <PanelCard variant="featured" accent="emerald" className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <AppBadge variant="emerald">Achievements</AppBadge>

                    <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                        {earnedCount}/{badges.length} badges earned
                    </h2>
                </div>

                <p className="max-w-sm text-sm leading-6 text-slate-400 md:text-right">
                    Complete lessons, quizzes and tracks to unlock badges.
                </p>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                <div
                    className="h-full rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)] transition-all duration-700 ease-out"
                    style={{ width: `${percent}%` }}
                />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {badges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                ))}
            </div>
        </PanelCard>
    );
}
