"use client";

import AppBadge from "@dark/ui/components/AppBadge";

const loopSteps = [
    {
        key: "learn",
        label: "Learn",
        description: "Understand the flaw",
        accent: "blue",
    },
    {
        key: "break",
        label: "Break",
        description: "Exploit a safe mock",
        accent: "violet",
    },
    {
        key: "fix",
        label: "Fix",
        description: "Compare secure code",
        accent: "emerald",
    },
    {
        key: "quiz",
        label: "Quiz",
        description: "Earn XP locally",
        accent: "amber",
    },
];

const accentClasses = {
    blue: "text-blue-200 ring-blue-300/[0.22] bg-blue-300/[0.08]",
    violet: "text-violet-200 ring-violet-300/[0.22] bg-violet-300/[0.08]",
    emerald: "text-emerald-200 ring-emerald-300/[0.22] bg-emerald-300/[0.08]",
    amber: "text-amber-200 ring-amber-300/[0.22] bg-amber-300/[0.08]",
};

export default function LearningLoop() {
    return (
        <div className="relative overflow-hidden bg-slate-950/90 p-5 ring-1 ring-white/[0.08] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        learning.loop
                    </p>

                    <h3 className="mt-2 text-xl font-black tracking-tight text-white">
                        Learn → Break → Fix → XP
                    </h3>
                </div>

                <AppBadge variant="emerald">Portfolio-ready</AppBadge>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-4">
                {loopSteps.map((step, index) => (
                    <div
                        key={step.key}
                        className={`relative p-3 ring-1 ${accentClasses[step.accent]}`}
                    >
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
                            step_{String(index + 1).padStart(2, "0")}
                        </p>

                        <p className="mt-2 text-sm font-black text-white">
                            {step.label}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
