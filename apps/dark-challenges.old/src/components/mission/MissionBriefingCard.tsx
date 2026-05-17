import {
    AlertTriangle,
    Clock3,
    Crosshair,
    ShieldAlert,
    Trophy,
    Swords,
} from "lucide-react";

import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

type MissionBriefingCardProps = {
    title: string;
    objective: string;
    difficulty?: string;
    risk?: string;
    duration?: string;
    rewards?: string;
    skills?: string[];
};

function MetaRow({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-white/6 bg-white/[0.03] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <Icon className="h-3.5 w-3.5 text-amber-400" />
                {label}
            </div>

            <p className="mt-2 font-mono text-sm font-bold text-slate-200">
                {value}
            </p>
        </div>
    );
}

export default function MissionBriefingCard({
    title,
    objective,
    difficulty = "Intermediate",
    risk = "Medium",
    duration = "20 min",
    rewards = "+250 XP",
    skills = [],
}: MissionBriefingCardProps) {
    return (
        <PanelCard
            variant="elevated"
            className="overflow-hidden border border-amber-500/15 bg-[linear-gradient(180deg,rgba(251,191,36,0.04),rgba(15,23,42,0.92))] p-6"
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-400">
                        Mission briefing
                    </p>

                    <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                        {title}
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                        {objective}
                    </p>
                </div>

                <AppBadge variant="amber">
                    Offensive Operation
                </AppBadge>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MetaRow
                    icon={ShieldAlert}
                    label="Detection risk"
                    value={risk}
                />

                <MetaRow
                    icon={Swords}
                    label="Difficulty"
                    value={difficulty}
                />

                <MetaRow
                    icon={Clock3}
                    label="Estimated duration"
                    value={duration}
                />

                <MetaRow
                    icon={Trophy}
                    label="Rewards"
                    value={rewards}
                />
            </div>

            {skills.length > 0 && (
                <div className="mt-6 border-t border-white/8 pt-5">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        <Crosshair className="h-3.5 w-3.5 text-amber-400" />
                        Recommended skills
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <AppBadge
                                key={skill}
                                variant="slate"
                            >
                                {skill}
                            </AppBadge>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 rounded-xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400" />

                    <div>
                        <p className="text-sm font-semibold text-amber-200">
                            Mission Intel
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                            This environment is simulated for educational purposes.
                            Detection indicators, vulnerable flows and attack paths
                            are intentionally exposed to help operators understand
                            exploitation mechanics safely.
                        </p>
                    </div>
                </div>
            </div>
        </PanelCard>
    );
}