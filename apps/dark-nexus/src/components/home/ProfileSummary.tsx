"use client";

import { Activity } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

type Profile = {
    username: string;
    xp: number;
    level: number;
    rank: string;
    badges: string[];
};

function getNextLevelXp(level: number) {
    return level * 100;
}

function getCurrentLevelStartXp(level: number) {
    return Math.max(0, (level - 1) * 100);
}

function StatCard({
    label,
    value,
    green,
}: {
    label: string;
    value: string | number;
    green?: boolean;
}) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                {label}
            </p>
            <p
                className={`mt-2 text-2xl font-black ${green ? "text-emerald-300" : "text-white"
                    }`}
            >
                {value}
            </p>
        </div>
    );
}

export default function ProfileSummary({
    profile,
    onAddXp,
    onReset,
}: {
    profile: Profile;
    onAddXp: () => void;
    onReset: () => void;
}) {
    const nextLevelXp = getNextLevelXp(profile.level);
    const levelStartXp = getCurrentLevelStartXp(profile.level);

    const levelProgress = Math.min(
        100,
        ((profile.xp - levelStartXp) / (nextLevelXp - levelStartXp)) * 100
    );

    return (
        <PanelCard variant="subtle" accent="blue" hover>
            <div className="mb-5 flex items-center gap-3 text-blue-200">
                <Activity size={22} />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.35em]">
                    Operator progression
                </span>
            </div>

            <h2 className="text-4xl font-black text-white">
                Global profile ready.
            </h2>

            <p className="mt-2 font-mono text-amber-300">
                Operator: {profile.username}
            </p>

            <p className="mt-4 leading-7 text-slate-300">
                XP, level, badges and completed paths are centralized here now.
            </p>

            {/* Stats */}
            <div className="mt-7 grid grid-cols-3 gap-3">
                <StatCard label="XP" value={profile.xp} />
                <StatCard label="LVL" value={profile.level} />
                <StatCard label="RANK" value={profile.rank} green />
            </div>

            {/* Progress bar */}
            <div className="mt-7">
                <div className="mb-2 flex items-center justify-between font-mono text-xs text-slate-400">
                    <span>Next level</span>
                    <span>
                        {profile.xp} / {nextLevelXp} XP
                    </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-300 to-emerald-300"
                        style={{ width: `${levelProgress}%` }}
                    />
                </div>

                <p className="mt-3 text-sm text-slate-400">
                    Next unlock: XSS Path
                </p>
            </div>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
                {profile.badges.length > 0 ? (
                    profile.badges.map((badge) => (
                        <span
                            key={badge}
                            className="rounded-full border border-emerald-300/20 bg-emerald-400/[0.08] px-3 py-1 font-mono text-xs font-bold text-emerald-100"
                        >
                            {badge}
                        </span>
                    ))
                ) : (
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-xs font-bold text-slate-400">
                        No badges yet
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
                <button
                    onClick={onAddXp}
                    className="rounded-xl border border-emerald-300/20 bg-emerald-400/[0.08] px-4 py-2 font-bold text-emerald-100 hover:bg-emerald-400/[0.15]"
                >
                    +50 XP test
                </button>

                <button
                    onClick={onReset}
                    className="rounded-xl border border-red-300/20 bg-red-400/[0.08] px-4 py-2 font-bold text-red-100 hover:bg-red-400/[0.15]"
                >
                    Reset
                </button>
            </div>
        </PanelCard>
    );
}