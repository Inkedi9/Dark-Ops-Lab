"use client";

import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Circle,
    Lock,
    ShieldCheck,
    Swords,
} from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

type Profile = {
    completedLessons: string[];
    completedMissions: string[];
    completedDefend: string[];
};

type RouteStep = {
    key: "learn" | "practice" | "defend";
    label: string;
    title: string;
    description: string;
    icon: React.ElementType;
};

const steps: RouteStep[] = [
    {
        key: "learn",
        label: "Learn",
        title: "SQL Injection Basics",
        description: "Understand the flaw before using it.",
        icon: BookOpen,
    },
    {
        key: "practice",
        label: "Practice",
        title: "Login Bypass",
        description: "Exploit safely in a mocked lab.",
        icon: Swords,
    },
    {
        key: "defend",
        label: "Defend",
        title: "Weak Auth Signals",
        description: "Recognize and reduce the same risk.",
        icon: ShieldCheck,
    },
];

export default function OperatorRouteMap({ profile }: { profile: Profile }) {
    const learnDone = profile.completedLessons.length > 0;
    const practiceDone = profile.completedMissions.length > 0;
    const defendDone = profile.completedDefend.length > 0;

    const state = {
        learn: {
            done: learnDone,
            active: !learnDone,
            locked: false,
            href: "/learn",
        },
        practice: {
            done: practiceDone,
            active: learnDone && !practiceDone,
            locked: !learnDone,
            href: "/practice",
        },
        defend: {
            done: defendDone,
            active: practiceDone && !defendDone,
            locked: !practiceDone,
            href: "/defend",
        },
    };

    const routeProgress =
        [learnDone, practiceDone, defendDone].filter(Boolean).length * 33;

    return (
        <section className="py-8">
            <PanelCard variant="darkOps" accent="blue" hover>
                <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                            Operator Route Map
                        </p>
                        <h2 className="mt-2 text-3xl font-black text-white">
                            SQL Injection operator path
                        </h2>
                        <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                            One route connects concept, safe exploitation and defensive recognition.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-blue-300/20 bg-blue-400/[0.07] px-5 py-4">
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-blue-200">
                            Route progress
                        </p>
                        <p className="mt-1 text-2xl font-black text-white">
                            {Math.min(routeProgress, 100)}%
                        </p>
                    </div>
                </div>

                <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        className="h-full rounded-full bg-blue-300/70 shadow-[0_0_18px_rgba(0,229,255,.45)] transition-all"
                        style={{ width: `${Math.min(routeProgress, 100)}%` }}
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {steps.map((step, index) => (
                        <RouteNode
                            key={step.key}
                            step={step}
                            index={index}
                            state={state[step.key]}
                        />
                    ))}
                </div>
            </PanelCard>
        </section>
    );
}

function RouteNode({
    step,
    index,
    state,
}: {
    step: RouteStep;
    index: number;
    state: {
        done: boolean;
        active: boolean;
        locked: boolean;
        href: string;
    };
}) {
    const Icon = step.icon;

    const StatusIcon = state.done ? CheckCircle2 : state.locked ? Lock : Circle;

    return (
        <a
            href={state.locked ? "#" : state.href}
            className={[
                "group relative rounded-2xl border p-5 transition-all",
                state.done
                    ? "border-emerald-300/25 bg-emerald-400/[0.07]"
                    : state.active
                        ? "border-blue-300/30 bg-blue-400/[0.08] shadow-[0_0_34px_rgba(0,229,255,.08)]"
                        : "border-white/[0.07] bg-white/[0.035] opacity-70",
                state.locked ? "cursor-not-allowed" : "hover:-translate-y-[1px] hover:bg-white/[0.055]",
            ].join(" ")}
        >
            <div className="mb-5 flex items-center justify-between">
                <div
                    className={[
                        "grid h-12 w-12 place-items-center rounded-xl border",
                        state.done
                            ? "border-emerald-300/25 bg-emerald-400/[0.08] text-emerald-200"
                            : state.active
                                ? "border-blue-300/25 bg-blue-400/[0.08] text-blue-200"
                                : "border-white/[0.08] bg-white/[0.035] text-slate-500",
                    ].join(" ")}
                >
                    <Icon size={22} />
                </div>

                <StatusIcon
                    size={20}
                    className={
                        state.done
                            ? "text-emerald-200"
                            : state.active
                                ? "text-blue-200"
                                : "text-slate-600"
                    }
                />
            </div>

            <p className="font-mono text-xs font-black uppercase tracking-[0.32em] text-slate-500">
                0{index + 1} / {step.label}
            </p>

            <h3 className="mt-2 text-2xl font-black text-white">{step.title}</h3>

            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-300">
                {step.description}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <span
                    className={[
                        "font-mono text-[10px] font-black uppercase tracking-[0.25em]",
                        state.done
                            ? "text-emerald-200"
                            : state.active
                                ? "text-blue-200"
                                : "text-slate-500",
                    ].join(" ")}
                >
                    {state.done ? "Completed" : state.locked ? "Locked" : "Active"}
                </span>

                {!state.locked && (
                    <ArrowRight
                        size={18}
                        className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-white"
                    />
                )}
            </div>
        </a>
    );
}