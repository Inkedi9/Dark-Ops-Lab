"use client";

import { useState } from "react";
import {
    BadgeCheck,
    Lock,
    ShieldCheck,
    Sparkles,
    Swords,
    Zap,
} from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

const unlocks = [
    {
        title: "Login Bypass Mission",
        label: "Next unlock",
        status: "Complete SQLi Basics",
        icon: Swords,
        tone: "danger",
        locked: false,
        xp: "+50 XP",
        requires: "SQLi Basics",
        dependency: "Learn → Practice",
    },
    {
        title: "Weak Auth Defense Sim",
        label: "Defense unlock",
        status: "Complete Login Bypass",
        icon: ShieldCheck,
        tone: "emerald",
        locked: true,
        xp: "+40 XP",
        requires: "Login Bypass",
        dependency: "Practice → Defend",
    },
    {
        title: "Operator Badge: First Exploit",
        label: "Badge",
        status: "Capture your first flag",
        icon: BadgeCheck,
        tone: "blue",
        locked: true,
        xp: "Badge",
        requires: "First flag",
        dependency: "Capture proof",
    },
    {
        title: "XSS Operator Route",
        label: "Route",
        status: "Complete SQLi route",
        icon: Sparkles,
        tone: "violet",
        locked: true,
        xp: "Route",
        requires: "SQLi route complete",
        dependency: "Next capability",
    },
];

function toneClass(tone: string) {
    if (tone === "danger") return "border-red-300/20 bg-red-400/[0.08] text-red-200";
    if (tone === "emerald") return "border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200";
    if (tone === "violet") return "border-indigo-300/20 bg-indigo-400/[0.08] text-indigo-200";
    return "border-blue-300/20 bg-blue-400/[0.08] text-blue-200";
}

export default function UnlockCenter() {
    const [active, setActive] = useState(unlocks[0]);

    return (
        <PanelCard variant="darkOps" accent="emerald" hover className="h-full">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-emerald-200">
                        Unlock Center
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-white">
                        What your next action unlocks.
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                        Hover an unlock to inspect rewards, requirements and dependencies.
                    </p>
                </div>

                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.07] px-5 py-4">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-emerald-200">
                        Selected
                    </p>
                    <p className="mt-1 text-xl font-black text-white">{active.xp}</p>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
                {unlocks.map((unlock) => {
                    const Icon = unlock.icon;
                    const isActive = active.title === unlock.title;

                    return (
                        <button
                            key={unlock.title}
                            onMouseEnter={() => setActive(unlock)}
                            onFocus={() => setActive(unlock)}
                            className={[
                                "relative overflow-hidden rounded-2xl border p-5 text-left transition",
                                isActive
                                    ? "border-emerald-300/30 bg-emerald-400/[0.08] shadow-[0_0_30px_rgba(110,231,183,.08)]"
                                    : unlock.locked
                                        ? "border-white/[0.07] bg-white/[0.03] opacity-70"
                                        : "border-white/[0.07] bg-white/[0.035]",
                            ].join(" ")}
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <div className={`grid h-11 w-11 place-items-center rounded-xl border ${toneClass(unlock.tone)}`}>
                                    <Icon size={20} />
                                </div>

                                {unlock.locked ? (
                                    <Lock size={18} className="text-slate-600" />
                                ) : (
                                    <Zap size={18} className="text-emerald-200" />
                                )}
                            </div>

                            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                                {unlock.label}
                            </p>

                            <h3 className="mt-2 min-h-14 text-xl font-black text-white">
                                {unlock.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                {unlock.status}
                            </p>
                        </button>
                    );
                })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-emerald-200">
                    Dependency detail
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <Detail label="Requires" value={active.requires} />
                    <Detail label="Dependency" value={active.dependency} />
                    <Detail label="Reward" value={active.xp} />
                </div>
            </div>
        </PanelCard>
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