"use client";

import {
    ArrowRight,
    Clock,
    Lock,
    Route,
    Sparkles,
    Target,
    Trophy,
} from "lucide-react";
import Link from "next/link";
import PanelCard from "@dark/ui/components/PanelCard";

type Accent = "blue" | "danger" | "emerald" | "violet" | "amber";

type MissionBriefingCardProps = {
    eyebrow: string;
    title: string;
    objective: string;
    flow: string[];
    rewards: string[];
    duration: string;
    difficulty: string;
    unlocks: string;
    href: string;
    cta: string;

    threatLevel?: "LOW" | "MEDIUM" | "HIGH";
    successRate?: number;

    requiredSkills?: {
        label: string;
        completed: boolean;
    }[];

    accent?: Accent;
    locked?: boolean;
};

function tone(accent: Accent) {
    if (accent === "danger") return "border-red-300/20 bg-red-400/[0.08] text-red-200";
    if (accent === "emerald") return "border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200";
    if (accent === "violet") return "border-indigo-300/20 bg-indigo-400/[0.08] text-indigo-200";
    if (accent === "amber") return "border-amber-300/20 bg-amber-400/[0.08] text-amber-200";
    return "border-blue-300/20 bg-blue-400/[0.08] text-blue-200";
}

function threatTone(level: "LOW" | "MEDIUM" | "HIGH") {
    if (level === "HIGH") {
        return "text-red-200 border-red-300/20 bg-red-400/[0.08]";
    }

    if (level === "MEDIUM") {
        return "text-amber-200 border-amber-300/20 bg-amber-400/[0.08]";
    }

    return "text-emerald-200 border-emerald-300/20 bg-emerald-400/[0.08]";
}

export default function MissionBriefingCard({
    eyebrow,
    title,
    objective,
    flow,
    rewards,
    duration,
    difficulty,
    unlocks,
    href,
    cta,
    threatLevel = "LOW",
    successRate = 82,
    requiredSkills = [],
    accent = "blue",
    locked = false,

}: MissionBriefingCardProps) {
    const content = (
        <PanelCard
            variant="darkOpsHero"
            accent={accent}
            hover={!locked}
            className={locked ? "opacity-65" : ""}
        >
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className={`font-mono text-xs font-black uppercase tracking-[0.35em] ${tone(accent).split(" ").at(-1)}`}>
                        {eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-white">{title}</h2>
                </div>

                <div className={`grid h-12 w-12 place-items-center rounded-xl border ${tone(accent)}`}>
                    {locked ? <Lock size={22} /> : <Target size={22} />}
                </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-5">
                <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                    Objective
                </p>
                <p className="mt-2 text-lg font-bold leading-7 text-white">
                    {objective}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Info icon={Clock} label="Duration" value={duration} />
                    <Info icon={Trophy} label="Difficulty" value={difficulty} />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div
                        className={`rounded-xl border p-4 ${threatTone(threatLevel)}`}
                    >
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em]">
                            Threat level
                        </p>

                        <p className="mt-2 text-xl font-black">
                            {threatLevel}
                        </p>
                    </div>

                    <div className="rounded-xl border border-blue-300/15 bg-blue-400/[0.06] p-4">
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-blue-200">
                            Estimated success
                        </p>

                        <div className="mt-3">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-slate-400">
                                    Operator readiness
                                </span>

                                <span className="font-mono text-blue-200">
                                    {successRate}%
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    className="h-full rounded-full bg-blue-300 shadow-[0_0_18px_rgba(0,229,255,.45)]"
                                    style={{ width: `${successRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2">
                        <Route size={17} className="text-slate-500" />
                        <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                            Operation flow
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {flow.map((item, index) => (
                            <span
                                key={item}
                                className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-300"
                            >
                                {index + 1}. {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.06] p-4">
                        <div className="mb-2 flex items-center gap-2 text-emerald-200">
                            <Sparkles size={16} />
                            <p className="font-mono text-xs font-black uppercase tracking-[0.25em]">
                                Rewards
                            </p>
                        </div>

                        <ul className="space-y-1 text-sm text-slate-300">
                            {rewards.map((reward) => (
                                <li key={reward}>• {reward}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-blue-300/15 bg-blue-400/[0.06] p-4">
                        <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-blue-200">
                            Unlocks
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{unlocks}</p>
                    </div>
                </div>

                {requiredSkills.length > 0 && (
                    <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                        <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                            Required skills
                        </p>

                        <div className="mt-4 space-y-2">
                            {requiredSkills.map((skill) => (
                                <div
                                    key={skill.label}
                                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3"
                                >
                                    <span className="font-semibold text-white">
                                        {skill.label}
                                    </span>

                                    <span
                                        className={[
                                            "font-mono text-[10px] font-black uppercase tracking-[0.22em]",
                                            skill.completed
                                                ? "text-emerald-200"
                                                : "text-red-200",
                                        ].join(" ")}
                                    >
                                        {skill.completed ? "READY" : "MISSING"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <span className="font-bold text-slate-200">
                        {locked ? "Locked" : cta}
                    </span>

                    {!locked && <ArrowRight size={20} className="text-slate-300" />}
                </div>
            </div>
        </PanelCard>
    );

    if (locked) return content;

    return (
        <Link href={href} className="block">
            {content}
        </Link>
    );
}

function Info({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-4">
            <div className="mb-1 flex items-center gap-2 text-slate-500">
                <Icon size={15} />
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.25em]">
                    {label}
                </span>
            </div>
            <p className="font-black text-white">{value}</p>
        </div>
    );
}