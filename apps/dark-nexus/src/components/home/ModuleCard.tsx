"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ShieldCheck, Swords } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

type ModuleItem = {
    key: string;
    name: string;
    role: string;
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    badge: string;
    cta: string;
    stats: string[];
    tone: "blue" | "green";
};

const moduleLanguage = {
    learn: {
        system: "Concept route",
        action: "Lesson → unlock → practice",
        icon: BookOpen,
    },
    practice: {
        system: "Attack route",
        action: "Recon → exploit → capture",
        icon: Swords,
    },
    defend: {
        system: "Defense route",
        action: "Inspect → classify → reduce risk",
        icon: ShieldCheck,
    },
} as const;

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function getAccent(key: string) {
    if (key === "practice") {
        return {
            text: "text-rose-200",
            border: "border-rose-300/20",
            bg: "bg-rose-400/[0.07]",
            line: "from-rose-300/40",
            accent: "danger" as const,
        };
    }

    if (key === "defend") {
        return {
            text: "text-emerald-200",
            border: "border-emerald-300/20",
            bg: "bg-emerald-400/[0.07]",
            line: "from-emerald-300/40",
            accent: "emerald" as const,
        };
    }

    return {
        text: "text-blue-100",
        border: "border-blue-300/20",
        bg: "bg-blue-400/[0.07]",
        line: "from-blue-300/40",
        accent: "blue" as const,
    };
}

export default function ModuleCard({
    module,
    index,
}: {
    module: ModuleItem;
    index: number;
}) {
    const Icon = module.icon;
    const accent = getAccent(module.key);
    const language =
        moduleLanguage[module.key as keyof typeof moduleLanguage] ??
        moduleLanguage.learn;

    const RouteIcon = language.icon;

    return (
        <motion.a
            href={module.href}
            target={module.href.startsWith("/") ? undefined : "_blank"}
            rel={module.href.startsWith("/") ? undefined : "noreferrer"}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="block h-full"
        >
            <PanelCard
                variant="darkNexus"
                accent={accent.accent}
                hover
                className="group relative h-full overflow-hidden"
            >
                <div
                    className={cn(
                        "absolute left-0 top-0 h-px w-full bg-gradient-to-r to-transparent",
                        accent.line
                    )}
                />

                <div className="mb-8 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={cn("rounded-xl border p-3", accent.border, accent.bg, accent.text)}>
                            <Icon size={22} />
                        </div>

                        <div>
                            <p className={cn("font-mono text-xs tracking-[0.38em]", accent.text)}>
                                {module.role}
                            </p>
                            <h3 className="text-xl font-black text-white">{module.name}</h3>
                        </div>
                    </div>

                    <span
                        className={cn(
                            "rounded-full border px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest",
                            accent.border,
                            accent.bg,
                            accent.text
                        )}
                    >
                        {module.badge}
                    </span>
                </div>

                <div className="mb-5 rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <RouteIcon size={17} className={accent.text} />
                        <p className={cn("font-mono text-xs font-black uppercase tracking-[0.28em]", accent.text)}>
                            {language.system}
                        </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-300">{language.action}</p>
                </div>

                <h2 className="max-w-md text-3xl font-black leading-tight text-white md:text-4xl">
                    {module.title}
                </h2>

                <p className="mt-4 min-h-20 text-base leading-7 text-slate-300">
                    {module.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                    {module.stats.map((stat) => (
                        <span
                            key={stat}
                            className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-slate-300"
                        >
                            {stat}
                        </span>
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <span className="font-bold text-slate-100">{module.cta}</span>
                    <ArrowRight
                        className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
                        size={20}
                    />
                </div>
            </PanelCard>
        </motion.a>
    );
}