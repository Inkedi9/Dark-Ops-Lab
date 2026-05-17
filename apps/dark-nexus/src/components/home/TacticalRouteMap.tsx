"use client";

import { useState } from "react";
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Lock,
    ShieldCheck,
    Sparkles,
    Swords,
} from "lucide-react";
import Link from "next/link";
import PanelCard from "@dark/ui/components/PanelCard";

type Profile = {
    completedLessons: string[];
    completedMissions: string[];
    completedDefend: string[];
};

const routeNodes = [
    {
        key: "learn",
        label: "Learn",
        title: "SQLi Basics",
        description: "Understand how unsafe queries expose accounts.",
        requires: "Operator profile",
        unlocks: "Login Bypass mission",
        xp: "+30 XP",
        href: "/learn",
        icon: BookOpen,
        accent: "blue",
    },
    {
        key: "practice",
        label: "Practice",
        title: "Login Bypass",
        description: "Exploit a mocked login safely and capture proof.",
        requires: "SQLi Basics",
        unlocks: "Weak Auth Defense simulation",
        xp: "+50 XP",
        href: "/practice",
        icon: Swords,
        accent: "danger",
    },
    {
        key: "defend",
        label: "Defend",
        title: "Weak Auth Defense",
        description: "Recognize and reduce the same weakness defensively.",
        requires: "Login Bypass",
        unlocks: "SQLi route completion",
        xp: "+40 XP",
        href: "/defend",
        icon: ShieldCheck,
        accent: "emerald",
    },
    {
        key: "next",
        label: "Next",
        title: "XSS Route",
        description: "Unlock the next offensive and defensive capability path.",
        requires: "SQLi route complete",
        unlocks: "XSS Basics + Reflected XSS",
        xp: "Route unlock",
        href: "/learn",
        icon: Sparkles,
        accent: "violet",
    },
];

function getTone(accent: string, active: boolean) {
    if (!active) return "border-white/[0.07] bg-white/[0.03] text-slate-500";

    if (accent === "danger") return "border-red-300/25 bg-red-400/[0.08] text-red-200";
    if (accent === "emerald") return "border-emerald-300/25 bg-emerald-400/[0.08] text-emerald-200";
    if (accent === "violet") return "border-indigo-300/25 bg-indigo-400/[0.08] text-indigo-200";
    return "border-blue-300/25 bg-blue-400/[0.08] text-blue-200";
}

export default function TacticalRouteMap({ profile }: { profile: Profile }) {
    const learnDone = profile.completedLessons.length > 0;
    const practiceDone = profile.completedMissions.length > 0;
    const defendDone = profile.completedDefend.length > 0;

    const states = {
        learn: {
            unlocked: true,
            completed: learnDone,
            current: !learnDone,
        },
        practice: {
            unlocked: learnDone,
            completed: practiceDone,
            current: learnDone && !practiceDone,
        },
        defend: {
            unlocked: practiceDone,
            completed: defendDone,
            current: practiceDone && !defendDone,
        },
        next: {
            unlocked: defendDone,
            completed: false,
            current: defendDone,
        },
    };

    const completedCount = [learnDone, practiceDone, defendDone].filter(Boolean).length;
    const progress = Math.round((completedCount / 3) * 100);

    const defaultActive =
        routeNodes.find((node) => states[node.key as keyof typeof states].current) ??
        routeNodes[0];

    const [activeNode, setActiveNode] = useState(defaultActive);

    const activeState = states[activeNode.key as keyof typeof states];

    return (
        <section className="py-8">
            <PanelCard variant="darkOps" accent="violet" hover>
                <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-indigo-200">
                            Tactical Route Map
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-white">
                            Learn → Practice → Defend → Unlock
                        </h2>

                        <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                            Every concept unlocks a safe mission. Every mission unlocks the
                            matching defense capability.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-indigo-300/20 bg-indigo-400/[0.07] px-5 py-4">
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-indigo-200">
                            Route readiness
                        </p>
                        <p className="mt-1 text-2xl font-black text-white">{progress}%</p>
                    </div>
                </div>

                <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        className="h-full rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(165,180,252,.45)] transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-black/25 p-6">
                    <div className="absolute left-8 right-8 top-[92px] hidden h-px bg-white/[0.08] lg:block" />

                    <div className="absolute left-8 top-[92px] hidden h-px w-1/4 animate-[flow_3s_linear_infinite] bg-gradient-to-r from-transparent via-blue-300 to-transparent lg:block" />
                    <div className="absolute left-[30%] top-[92px] hidden h-px w-1/4 animate-[flow2_3.5s_linear_infinite] bg-gradient-to-r from-transparent via-red-300 to-transparent lg:block" />
                    <div className="absolute left-[55%] top-[92px] hidden h-px w-1/4 animate-[flow3_4s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-300 to-transparent lg:block" />

                    <div className="relative grid gap-4 lg:grid-cols-4">
                        {routeNodes.map((node, index) => {
                            const Icon = node.icon;
                            const nodeState = states[node.key as keyof typeof states];
                            const isSelected = activeNode.key === node.key;

                            const content = (
                                <div
                                    onMouseEnter={() => setActiveNode(node)}
                                    onFocus={() => setActiveNode(node)}
                                    className={[
                                        "group h-full rounded-2xl border p-5 backdrop-blur-xl transition",
                                        isSelected
                                            ? "border-indigo-300/30 bg-indigo-400/[0.07] shadow-[0_0_28px_rgba(165,180,252,.08)]"
                                            : nodeState.unlocked
                                                ? "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.055]"
                                                : "border-white/[0.06] bg-white/[0.025] opacity-60",
                                    ].join(" ")}
                                >
                                    <div className="mb-5 flex items-center justify-between">
                                        <div
                                            className={`grid h-12 w-12 place-items-center rounded-xl border ${getTone(
                                                node.accent,
                                                nodeState.unlocked
                                            )}`}
                                        >
                                            <Icon size={22} />
                                        </div>

                                        {nodeState.completed ? (
                                            <CheckCircle2 size={20} className="text-emerald-200" />
                                        ) : nodeState.unlocked ? (
                                            <ArrowRight
                                                size={18}
                                                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-white"
                                            />
                                        ) : (
                                            <Lock size={18} className="text-slate-600" />
                                        )}
                                    </div>

                                    <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                                        0{index + 1} / {node.label}
                                    </p>

                                    <h3 className="mt-2 text-xl font-black text-white">
                                        {node.title}
                                    </h3>

                                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                                        {node.description}
                                    </p>

                                    <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                                        {nodeState.completed
                                            ? "Completed"
                                            : nodeState.current
                                                ? "Current objective"
                                                : nodeState.unlocked
                                                    ? "Available"
                                                    : "Dependency locked"}
                                    </p>
                                </div>
                            );

                            if (!nodeState.unlocked) {
                                return <div key={node.key}>{content}</div>;
                            }

                            return (
                                <Link key={node.key} href={node.href}>
                                    {content}
                                </Link>
                            );
                        })}
                    </div>

                    <style jsx>{`
            @keyframes flow {
              0% {
                transform: translateX(-20%);
                opacity: 0;
              }
              20% {
                opacity: 1;
              }
              100% {
                transform: translateX(90%);
                opacity: 0;
              }
            }

            @keyframes flow2 {
              0% {
                transform: translateX(-30%);
                opacity: 0;
              }
              20% {
                opacity: 1;
              }
              100% {
                transform: translateX(85%);
                opacity: 0;
              }
            }

            @keyframes flow3 {
              0% {
                transform: translateX(-25%);
                opacity: 0;
              }
              20% {
                opacity: 1;
              }
              100% {
                transform: translateX(80%);
                opacity: 0;
              }
            }
          `}</style>
                </div>

                <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/25 p-5">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-indigo-200">
                        Current node analysis
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-4">
                        <Detail label="Node" value={activeNode.title} />
                        <Detail
                            label="Status"
                            value={
                                activeState.completed
                                    ? "Completed"
                                    : activeState.current
                                        ? "Current"
                                        : activeState.unlocked
                                            ? "Available"
                                            : "Locked"
                            }
                        />
                        <Detail label="Requires" value={activeNode.requires} />
                        <Detail label="Unlocks" value={activeNode.unlocks} />
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <Detail label="Reward" value={activeNode.xp} />
                        <Detail label="Dependency" value={`${activeNode.requires} → ${activeNode.unlocks}`} />
                    </div>
                </div>
            </PanelCard>
        </section>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-bold text-white">{value}</p>
        </div>
    );
}