"use client";

import { BookOpen, Lock, ShieldCheck, Sparkles, Swords } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

type Profile = {
    completedLessons: string[];
    completedMissions: string[];
    completedDefend: string[];
};

const nodes = [
    {
        key: "learn",
        title: "SQLi Basics",
        label: "Learn",
        icon: BookOpen,
        accent: "blue",
    },
    {
        key: "practice",
        title: "Login Bypass",
        label: "Practice",
        icon: Swords,
        accent: "danger",
    },
    {
        key: "defend",
        title: "Weak Auth Defense",
        label: "Defend",
        icon: ShieldCheck,
        accent: "emerald",
    },
    {
        key: "next",
        title: "XSS Route",
        label: "Next",
        icon: Sparkles,
        accent: "violet",
    },
];

function tone(accent: string, active: boolean) {
    if (!active) return "border-white/[0.07] bg-white/[0.03] text-slate-500";

    if (accent === "danger") return "border-red-300/25 bg-red-400/[0.08] text-red-200";
    if (accent === "emerald") return "border-emerald-300/25 bg-emerald-400/[0.08] text-emerald-200";
    if (accent === "violet") return "border-indigo-300/25 bg-indigo-400/[0.08] text-indigo-200";
    return "border-blue-300/25 bg-blue-400/[0.08] text-blue-200";
}

export default function RouteDependencyGraph({ profile }: { profile: Profile }) {
    const learnDone = profile.completedLessons.length > 0;
    const practiceDone = profile.completedMissions.length > 0;
    const defendDone = profile.completedDefend.length > 0;

    const states = {
        learn: true,
        practice: learnDone,
        defend: practiceDone,
        next: defendDone,
    };

    return (
        <section className="py-8">
            <PanelCard variant="darkOps" accent="violet" hover>
                <div className="mb-7">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-indigo-200">
                        Route Dependency Graph
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-white">
                        How this route unlocks the next capability.
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                        DarkOps maps every concept to its lab, defense scenario and next operator route.
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-black/25 p-6">
                    <div className="absolute left-8 right-8 top-1/2 hidden h-px bg-white/[0.08] lg:block" />

                    <div className="absolute left-8 top-1/2 hidden h-px w-1/4 animate-[flow_3s_linear_infinite] bg-gradient-to-r from-transparent via-blue-300 to-transparent lg:block" />
                    <div className="absolute left-[30%] top-1/2 hidden h-px w-1/4 animate-[flow2_3.5s_linear_infinite] bg-gradient-to-r from-transparent via-red-300 to-transparent lg:block" />
                    <div className="absolute left-[55%] top-1/2 hidden h-px w-1/4 animate-[flow3_4s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-300 to-transparent lg:block" />

                    <div className="relative grid gap-4 lg:grid-cols-4">
                        {nodes.map((node, index) => {
                            const Icon = node.icon;
                            const active = states[node.key as keyof typeof states];

                            return (
                                <div key={node.key} className="relative">
                                    <div
                                        className={[
                                            "rounded-2xl border p-5 backdrop-blur-xl transition",
                                            active
                                                ? "bg-white/[0.045] shadow-[0_0_28px_rgba(0,229,255,.06)]"
                                                : "bg-white/[0.02] opacity-60",
                                        ].join(" ")}
                                    >
                                        <div className="mb-5 flex items-center justify-between">
                                            <div className={`grid h-12 w-12 place-items-center rounded-xl border ${tone(node.accent, active)}`}>
                                                <Icon size={22} />
                                            </div>

                                            {!active && <Lock size={18} className="text-slate-600" />}
                                        </div>

                                        <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                                            0{index + 1} / {node.label}
                                        </p>

                                        <h3 className="mt-2 text-xl font-black text-white">
                                            {node.title}
                                        </h3>

                                        <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                                            {active ? "Signal active" : "Dependency locked"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <style jsx>{`
    @keyframes flow {
      0% { transform: translateX(-20%); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translateX(90%); opacity: 0; }
    }

    @keyframes flow2 {
      0% { transform: translateX(-30%); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translateX(85%); opacity: 0; }
    }

    @keyframes flow3 {
      0% { transform: translateX(-25%); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translateX(80%); opacity: 0; }
    }
  `}</style>
                </div>
            </PanelCard>
        </section>
    );
}