import { useState } from "react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

const toneStyles = {
    blue: {
        badge: "blue",
        dot: "bg-blue-300",
        ring: "ring-blue-300/35",
        glow: "shadow-blue-500/15",
        text: "text-blue-200",
    },
    amber: {
        badge: "amber",
        dot: "bg-amber-300",
        ring: "ring-amber-300/35",
        glow: "shadow-amber-500/15",
        text: "text-amber-200",
    },
    red: {
        badge: "danger",
        dot: "bg-red-300",
        ring: "ring-red-300/35",
        glow: "shadow-red-500/15",
        text: "text-red-200",
    },
    emerald: {
        badge: "emerald",
        dot: "bg-emerald-300",
        ring: "ring-emerald-300/35",
        glow: "shadow-emerald-500/15",
        text: "text-emerald-200",
    },
    violet: {
        badge: "violet",
        dot: "bg-violet-300",
        ring: "ring-violet-300/35",
        glow: "shadow-violet-500/15",
        text: "text-violet-200",
    },
};

function getTone(tone) {
    return toneStyles[tone] || toneStyles.blue;
}

export default function AttackFlowBlock({ title = "Attack flow", steps = [] }) {
    const [activeStep, setActiveStep] = useState(0);

    if (!steps.length) return null;

    const selectedStep = steps[activeStep] || steps[0];
    const selectedTone = getTone(selectedStep.tone);

    return (
        <PanelCard variant="darkNexus" accent="violet" className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <AppBadge variant="violet">Flow view</AppBadge>

                    <h3 className="mt-3 text-lg font-extrabold tracking-tight text-white">
                        {title}
                    </h3>
                </div>

                <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                    {activeStep + 1}/{steps.length}
                </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-[repeat(var(--flow-count),minmax(0,1fr))] md:gap-2" style={{ "--flow-count": steps.length }}>
                {steps.map((step, index) => {
                    const tone = getTone(step.tone);
                    const isActive = activeStep === index;

                    return (
                        <button
                            key={`${step.label}-${index}`}
                            type="button"
                            onClick={() => setActiveStep(index)}
                            className={`group relative rounded-2xl border px-4 py-3 text-left transition ${isActive
                                ? `border-white/15 bg-white/[0.07] shadow-lg ${tone.glow} ring-1 ${tone.ring}`
                                : "border-white/10 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.045]"
                                }`}
                        >
                            {index < steps.length - 1 && (
                                <span className="pointer-events-none absolute left-[calc(100%+0.25rem)] top-1/2 hidden h-px w-2 bg-white/10 md:block" />
                            )}

                            <span className="flex items-center gap-3">
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isActive ? tone.dot : "bg-slate-700"} font-mono text-[11px] font-black text-slate-950`}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className={`text-sm font-bold ${isActive ? tone.text : "text-slate-300"}`}>
                                    {step.label}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className={`mt-5 rounded-2xl border border-white/10 bg-slate-950/45 p-4 ring-1 ${selectedTone.ring}`}>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                    Selected step
                </p>

                <h4 className={`mt-2 text-base font-extrabold ${selectedTone.text}`}>
                    {selectedStep.label}
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                    {selectedStep.description}
                </p>
            </div>
        </PanelCard>
    );
}
