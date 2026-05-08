import { ArrowRight } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

type PathItem = {
    id: string;
    title: string;
    label: string;
    steps: string[];
    progress: number;
    href: string;
};

export default function PathCard({ path }: { path: PathItem }) {
    return (
        <a href={path.href} target="_blank" rel="noreferrer" className="group block">
            <PanelCard variant="darkNexus" accent="blue" hover>
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <span className="mb-2 inline-flex rounded-full border border-blue-300/18 bg-blue-400/[0.07] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-blue-100">
                            {path.label}
                        </span>

                        <h3 className="text-lg font-black text-white">{path.title}</h3>
                    </div>

                    <span className="font-mono text-xs text-blue-200">
                        {path.progress}%
                    </span>
                </div>

                <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-300 to-emerald-300"
                        style={{ width: `${path.progress}%` }}
                    />
                </div>

                <div className="space-y-3">
                    {path.steps.map((step, i) => (
                        <div key={step} className="flex items-center gap-3 text-sm text-slate-300">
                            <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.035] font-mono text-xs text-blue-100">
                                {i + 1}
                            </span>
                            {step}
                        </div>
                    ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-sm font-bold text-slate-200">
                    Open path
                    <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1 group-hover:text-white"
                    />
                </div>
            </PanelCard>
        </a>
    );
}