import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

export default function BreakdownSteps({ steps = [] }) {
    return (
        <PanelCard variant="elevated" accent="violet" className="p-6">
            <AppBadge variant="violet">Step-by-step</AppBadge>

            <h2 className="mt-4 text-xl font-extrabold tracking-tight text-white">
                What goes wrong?
            </h2>

            <div className="mt-5 space-y-3">
                {steps.map((step, index) => (
                    <div
                        key={step}
                        className="flex gap-4 rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/[0.05]"
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-300/[0.10] font-mono text-xs text-violet-200 ring-1 ring-violet-300/[0.22]">
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="text-sm leading-6 text-slate-300">{step}</p>
                    </div>
                ))}
            </div>
        </PanelCard>
    );
}
