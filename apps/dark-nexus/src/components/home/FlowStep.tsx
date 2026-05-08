"use client";

import { ArrowRight } from "lucide-react";

type ModuleItem = {
    key: string;
    name: string;
    role: string;
    short: string;
    icon: React.ElementType;
    tone: "blue" | "green";
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function toneClasses(tone: "blue" | "green" = "blue") {
    return tone === "green"
        ? {
            text: "text-emerald-200",
            border: "border-emerald-300/20",
            bg: "bg-emerald-400/[0.07]",
        }
        : {
            text: "text-blue-100",
            border: "border-blue-300/20",
            bg: "bg-blue-400/[0.07]",
        };
}

export default function FlowStep({
    module,
    index,
}: {
    module: ModuleItem;
    index: number;
}) {
    const Icon = module.icon;
    const tone = toneClasses(module.tone);

    return (
        <div className="relative flex-1 rounded-2xl border border-white/[0.06] bg-black/25 p-5 shadow-[0_10px_35px_rgba(0,0,0,.35)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "grid h-11 w-11 place-items-center rounded-xl border",
                            tone.border,
                            tone.bg,
                            tone.text
                        )}
                    >
                        <Icon size={21} />
                    </div>

                    <div>
                        <p className={cn("font-mono text-xs font-black tracking-[0.3em]", tone.text)}>
                            0{index + 1}
                        </p>
                        <h3 className="font-black text-white">{module.role}</h3>
                    </div>
                </div>

                {index < 3 && (
                    <ArrowRight className="hidden text-slate-500 lg:block" size={22} />
                )}
            </div>

            <p className="text-sm font-bold text-slate-200">{module.short}</p>
            <p className="mt-1 text-sm text-slate-400">{module.name}</p>
        </div>
    );
}