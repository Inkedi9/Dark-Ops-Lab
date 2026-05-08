"use client";

import { ArrowRight, BookOpen, Lock, ShieldCheck, Swords } from "lucide-react";
import Link from "next/link";
import PanelCard from "@dark/ui/components/PanelCard";

type Profile = {
    completedLessons: string[];
    completedMissions: string[];
    completedDefend: string[];
};

const actions = [
    {
        key: "learn",
        title: "Start SQL Injection Basics",
        description: "Understand how unsafe queries expose accounts.",
        href: "/learn",
        cta: "Open Learn",
        icon: BookOpen,
        accent: "blue",
    },
    {
        key: "practice",
        title: "Launch Login Bypass",
        description: "Exploit a mocked login safely and capture proof.",
        href: "/practice",
        cta: "Open Practice",
        icon: Swords,
        accent: "danger",
    },
    {
        key: "defend",
        title: "Analyze Weak Auth Signals",
        description: "Recognize and reduce the same risk from defense side.",
        href: "/defend",
        cta: "Open Defend",
        icon: ShieldCheck,
        accent: "emerald",
    },
];

function getActionState(key: string, profile: Profile) {
    const learnDone = profile.completedLessons.length > 0;
    const practiceDone = profile.completedMissions.length > 0;

    if (key === "learn") {
        return { locked: false, recommended: !learnDone, reason: "Start here" };
    }

    if (key === "practice") {
        return {
            locked: !learnDone,
            recommended: learnDone && !practiceDone,
            reason: learnDone ? "Ready to launch" : "Requires SQLi Basics",
        };
    }

    return {
        locked: !practiceDone,
        recommended: practiceDone,
        reason: practiceDone ? "Defense loop ready" : "Requires Login Bypass",
    };
}

function toneClass(accent: string) {
    if (accent === "danger") return "border-red-300/20 bg-red-400/[0.08] text-red-200";
    if (accent === "emerald") return "border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200";
    return "border-blue-300/20 bg-blue-400/[0.08] text-blue-200";
}

export default function NextActionsPanel({ profile }: { profile: Profile }) {
    return (
        <section className="py-8">
            <PanelCard variant="darkNexus" accent="blue" hover>
                <div className="mb-6">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                        Next Actions
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-white">
                        Choose the right move.
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                        DarkNexus prioritizes your next action based on what you have already completed.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        const state = getActionState(action.key, profile);

                        const content = (
                            <div
                                className={[
                                    "group h-full rounded-2xl border p-5 transition",
                                    state.recommended
                                        ? "border-blue-300/30 bg-blue-400/[0.08] shadow-[0_0_34px_rgba(0,229,255,.08)]"
                                        : state.locked
                                            ? "border-white/[0.07] bg-white/[0.03] opacity-60"
                                            : "border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.055]",
                                ].join(" ")}
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <div className={`grid h-12 w-12 place-items-center rounded-xl border ${toneClass(action.accent)}`}>
                                        <Icon size={22} />
                                    </div>

                                    {state.locked ? (
                                        <Lock size={18} className="text-slate-600" />
                                    ) : (
                                        <ArrowRight
                                            size={18}
                                            className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-white"
                                        />
                                    )}
                                </div>

                                <div className="mb-3 flex flex-wrap gap-2">
                                    {state.recommended && (
                                        <span className="rounded-full border border-blue-300/20 bg-blue-400/[0.08] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-blue-200">
                                            Recommended
                                        </span>
                                    )}

                                    <span className="rounded-full border border-white/[0.08] bg-black/25 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                                        {state.reason}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white">{action.title}</h3>

                                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                                    {action.description}
                                </p>

                                <p className="mt-5 font-bold text-slate-200">
                                    {state.locked ? "Locked" : action.cta}
                                </p>
                            </div>
                        );

                        if (state.locked) {
                            return <div key={action.key}>{content}</div>;
                        }

                        return (
                            <Link key={action.key} href={action.href}>
                                {content}
                            </Link>
                        );
                    })}
                </div>
            </PanelCard>
        </section>
    );
}