"use client";

import { Activity, CheckCircle2, Lock, Radio, ShieldCheck, Swords } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

const events = [
    {
        icon: CheckCircle2,
        tone: "emerald",
        title: "Operator profile initialized",
        text: "Progression tracking is active.",
        time: "Now",
    },
    {
        icon: Activity,
        tone: "blue",
        title: "SQL Injection route available",
        text: "Start with SQLi Basics to unlock Login Bypass.",
        time: "Ready",
    },
    {
        icon: Swords,
        tone: "danger",
        title: "Offensive lab locked",
        text: "Complete the matching lesson before launch.",
        time: "Pending",
    },
    {
        icon: ShieldCheck,
        tone: "emerald",
        title: "Defense simulation queued",
        text: "Unlocks after first safe exploit.",
        time: "Next",
    },
    {
        icon: Lock,
        tone: "blue",
        title: "XSS route encrypted",
        text: "Available after completing the first route.",
        time: "Locked",
    },
];

function toneClass(tone: string) {
    if (tone === "emerald") return "border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200";
    if (tone === "danger") return "border-red-300/20 bg-red-400/[0.08] text-red-200";
    return "border-blue-300/20 bg-blue-400/[0.08] text-blue-200";
}

export default function NexusActivityFeed() {
    return (
        <PanelCard variant="darkOps" accent="blue" hover className="h-full">
            <div className="mb-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/20 bg-blue-400/[0.08] text-blue-200">
                    <Radio size={22} />
                </div>

                <div>
                    <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                        System Events
                    </p>
                    <h2 className="text-3xl font-black text-white">
                        Nexus activity feed
                    </h2>
                </div>
            </div>

            <div className="space-y-3">
                {events.map((event) => {
                    const Icon = event.icon;

                    return (
                        <div
                            key={event.title}
                            className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4"
                        >
                            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${toneClass(event.tone)}`}>
                                <Icon size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="font-black text-white">{event.title}</h3>
                                    <span className="shrink-0 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                                        {event.time}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                    {event.text}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </PanelCard>
    );
}