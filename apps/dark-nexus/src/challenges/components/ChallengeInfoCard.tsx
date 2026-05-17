"use client";

import PanelCard from "@dark/ui/components/PanelCard";

type Props = {
    title: string;
    objective: string;
    difficulty: string;
    risk: string;
    duration: string;
    rewards: string;
    skills: string[];
};

export default function ChallengeInfoCard({ title, objective, difficulty, risk, duration, rewards, skills }: Props) {
    return (
        <PanelCard variant="darkOps" accent="blue" className="mb-8">
            <h2 className="mb-2 text-2xl font-black text-white">{title}</h2>
            <p className="mb-4 text-sm leading-6 text-slate-300">{objective}</p>
            <div className="flex flex-wrap gap-3 text-xs font-mono uppercase tracking-widest text-slate-400">
                <span>Difficulty: <span className="text-white font-black">{difficulty}</span></span>
                <span>Risk: <span className="text-white font-black">{risk}</span></span>
                <span>Duration: <span className="text-white font-black">{duration}</span></span>
                <span>Reward: <span className="text-emerald-300 font-black">{rewards}</span></span>
            </div>
            {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((s) => (
                        <span key={s} className="rounded-full border border-blue-300/20 bg-blue-400/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-blue-200">
                            {s}
                        </span>
                    ))}
                </div>
            )}
        </PanelCard>
    );
}
