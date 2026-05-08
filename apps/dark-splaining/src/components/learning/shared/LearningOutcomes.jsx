import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

export default function LearningOutcomes({ items = [] }) {
    if (items.length === 0) return null;

    return (
        <PanelCard variant="featured" accent="emerald" className="p-6">
            <AppBadge variant="emerald">What you will learn</AppBadge>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
                {items.map((item) => (
                    <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/[0.05]"
                    >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300/[0.12] text-xs font-bold text-emerald-200 ring-1 ring-emerald-300/[0.25]">
                            ✓
                        </span>

                        <p className="text-sm leading-6 text-slate-300">
                            {item}
                        </p>
                    </div>
                ))}
            </div>
        </PanelCard>
    );
}
