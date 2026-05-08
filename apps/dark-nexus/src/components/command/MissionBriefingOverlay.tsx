"use client";

import { X, Target, Clock, Trophy, ShieldAlert, ArrowRight } from "lucide-react";
import AppButton from "@dark/ui/components/AppButton";

type MissionBriefingOverlayProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    type: string;
    objective: string;
    difficulty: string;
    duration: string;
    reward: string;
    threatLevel?: "LOW" | "MEDIUM" | "HIGH";
    flow: string[];
    href: string;
    cta: string;
    accent?: "blue" | "danger" | "emerald";
};

function threatTone(level: "LOW" | "MEDIUM" | "HIGH") {
    if (level === "HIGH") return "border-red-300/25 bg-red-400/[0.08] text-red-200";
    if (level === "MEDIUM") return "border-amber-300/25 bg-amber-400/[0.08] text-amber-200";
    return "border-emerald-300/25 bg-emerald-400/[0.08] text-emerald-200";
}

export default function MissionBriefingOverlay({
    open,
    onClose,
    title,
    type,
    objective,
    difficulty,
    duration,
    reward,
    threatLevel = "LOW",
    flow,
    href,
    cta,
}: MissionBriefingOverlayProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md">
            <div className="absolute inset-x-4 top-1/2 mx-auto max-w-4xl -translate-y-1/2 overflow-hidden rounded-3xl border border-blue-300/20 bg-[#05070A]/95 shadow-[0_0_80px_rgba(0,229,255,.18)]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                    <div>
                        <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                            {type}
                        </p>
                        <h2 className="mt-2 text-4xl font-black text-white">{title}</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-slate-300 hover:bg-white/[0.08] hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5">
                        <div className="mb-3 flex items-center gap-2 text-blue-200">
                            <Target size={18} />
                            <p className="font-mono text-xs font-black uppercase tracking-[0.28em]">
                                Objective
                            </p>
                        </div>

                        <p className="text-lg font-bold leading-8 text-white">{objective}</p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <MiniStat icon={Clock} label="Duration" value={duration} />
                            <MiniStat icon={Trophy} label="Difficulty" value={difficulty} />
                            <MiniStat icon={ShieldAlert} label="Reward" value={reward} />
                        </div>

                        <div className={`mt-5 rounded-xl border p-4 ${threatTone(threatLevel)}`}>
                            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em]">
                                Threat level
                            </p>
                            <p className="mt-1 text-2xl font-black">{threatLevel}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-5">
                        <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                            Operation sequence
                        </p>

                        <div className="mt-5 space-y-3">
                            {flow.map((step, index) => (
                                <div
                                    key={step}
                                    className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3"
                                >
                                    <span className="font-bold text-white">
                                        0{index + 1}. {step}
                                    </span>
                                    <ArrowRight size={16} className="text-slate-500" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <AppButton href={href} variant="primary">
                                {cta} →
                            </AppButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MiniStat({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-black/25 p-3">
            <div className="mb-1 flex items-center gap-2 text-slate-500">
                <Icon size={14} />
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                    {label}
                </span>
            </div>
            <p className="font-black text-white">{value}</p>
        </div>
    );
}