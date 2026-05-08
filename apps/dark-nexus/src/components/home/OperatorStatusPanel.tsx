"use client";

import { Activity, Cpu, Lock, Radio, Route, ShieldCheck, Zap } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

type Profile = {
    xp: number;
    level: number;
    rank: string;
    completedLessons: string[];
    completedMissions: string[];
    completedDefend: string[];
};

export default function OperatorStatusPanel({ profile }: { profile: Profile }) {
    const learnDone = profile.completedLessons.length > 0;
    const practiceDone = profile.completedMissions.length > 0;
    const defendDone = profile.completedDefend.length > 0;

    const routeStepsDone = [learnDone, practiceDone, defendDone].filter(Boolean).length;
    const readiness = Math.round((routeStepsDone / 3) * 100);

    const focus = !learnDone
        ? "SQL Injection Basics"
        : !practiceDone
            ? "Login Bypass"
            : !defendDone
                ? "Weak Auth Defense"
                : "XSS Operator Route";

    const nextUnlock = !learnDone
        ? "Login Bypass Mission"
        : !practiceDone
            ? "Weak Auth Defense Sim"
            : !defendDone
                ? "SQLi Route Completion"
                : "XSS Route";

    return (
        <section className="py-8">
            <PanelCard variant="darkNexusHero" accent="blue" hover>
                <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/[0.08] px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.3em] text-emerald-200">
                            <Radio size={14} />
                            Operator signal active
                        </div>

                        <h2 className="text-4xl font-black tracking-tight text-white">
                            Operator status
                        </h2>

                        <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                            DarkNexus monitors your current route, readiness and next unlock.
                            Your command path updates as you complete lessons, labs and defense simulations.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-blue-300/20 bg-blue-400/[0.07] px-5 py-4">
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-blue-200">
                            Readiness
                        </p>
                        <p className="mt-1 text-3xl font-black text-white">{readiness}%</p>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                    <StatusMetric icon={Zap} label="XP" value={profile.xp} accent="blue" />
                    <StatusMetric icon={ShieldCheck} label="Rank" value={profile.rank} accent="emerald" />
                    <StatusMetric icon={Route} label="Focus" value={focus} accent="blue" />
                    <StatusMetric icon={Lock} label="Next unlock" value={nextUnlock} accent="amber" />
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/25 p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity size={17} className="text-blue-200" />
                            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-blue-200">
                                Route readiness
                            </p>
                        </div>

                        <span className="font-mono text-xs text-slate-400">
                            {routeStepsDone}/3 systems aligned
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                            className="h-full rounded-full bg-blue-300 shadow-[0_0_18px_rgba(0,229,255,.45)] transition-all"
                            style={{ width: `${readiness}%` }}
                        />
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <Signal label="Learn" active={learnDone} current={!learnDone} />
                        <Signal label="Practice" active={practiceDone} current={learnDone && !practiceDone} />
                        <Signal label="Defend" active={defendDone} current={practiceDone && !defendDone} />
                    </div>
                </div>
            </PanelCard>
        </section>
    );
}

function StatusMetric({
    icon: Icon,
    label,
    value,
    accent,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    accent: "blue" | "emerald" | "amber";
}) {
    const tone =
        accent === "emerald"
            ? "border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200"
            : accent === "amber"
                ? "border-amber-300/20 bg-amber-400/[0.08] text-amber-200"
                : "border-blue-300/20 bg-blue-400/[0.08] text-blue-200";

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
            <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl border ${tone}`}>
                <Icon size={18} />
            </div>

            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>

            <p className="mt-2 line-clamp-2 text-lg font-black text-white">
                {value}
            </p>
        </div>
    );
}

function Signal({
    label,
    active,
    current,
}: {
    label: string;
    active: boolean;
    current: boolean;
}) {
    return (
        <div
            className={[
                "rounded-xl border px-4 py-3",
                active
                    ? "border-emerald-300/20 bg-emerald-400/[0.08]"
                    : current
                        ? "border-blue-300/25 bg-blue-400/[0.08]"
                        : "border-white/[0.07] bg-white/[0.03]",
            ].join(" ")}
        >
            <div className="flex items-center justify-between">
                <span className="font-bold text-white">{label}</span>

                <span
                    className={[
                        "h-2.5 w-2.5 rounded-full",
                        active
                            ? "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]"
                            : current
                                ? "bg-blue-300 shadow-[0_0_12px_rgba(0,229,255,.9)]"
                                : "bg-slate-700",
                    ].join(" ")}
                />
            </div>

            <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                {active ? "Complete" : current ? "Current" : "Locked"}
            </p>
        </div>
    );
}