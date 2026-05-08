import { ArrowRight, BookOpen, CheckCircle2, Flame, ShieldCheck, Target } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

type Profile = {
    completedLessons: string[];
    completedMissions: string[];
    completedDefend: string[];
};

export default function ContinueJourney({ profile }: { profile: Profile }) {
    const completedLessons = profile.completedLessons.length;
    const completedMissions = profile.completedMissions.length;
    const completedDefend = profile.completedDefend.length;

    const nextItem =
        completedLessons === 0
            ? {
                label: "Start here",
                title: "SQL Injection Basics",
                description:
                    "Understand how unsafe database queries expose accounts before attempting your first exploit.",
                href: "https://darksplaining.vercel.app",
                cta: "Start SQLi lesson",
                icon: BookOpen,
                unlock: "Unlocks Login Bypass mission",
                phase: "Learn",
            }
            : completedMissions === 0
                ? {
                    label: "Next operation",
                    title: "Login Bypass",
                    description:
                        "Use what you learned to bypass authentication in a safe mocked target.",
                    href: "https://darkchallenges.vercel.app",
                    cta: "Launch first exploit",
                    icon: Target,
                    unlock: "Unlocks defensive auth checks",
                    phase: "Practice",
                }
                : completedDefend === 0
                    ? {
                        label: "Defense loop",
                        title: "Spot the same weakness from the defender side",
                        description:
                            "Review the risk pattern, identify warning signs, and learn how to prevent weak authentication failures.",
                        href: "https://darkdefend.vercel.app",
                        cta: "Start defense simulation",
                        icon: ShieldCheck,
                        unlock: "Completes the SQLi operator route",
                        phase: "Defend",
                    }
                    : {
                        label: "Continue route",
                        title: "Cross-Site Scripting Path",
                        description:
                            "Start the next vulnerability route: learn reflected XSS, exploit safely, then defend against unsafe rendering.",
                        href: "https://darksplaining.vercel.app",
                        cta: "Open next route",
                        icon: Flame,
                        unlock: "Next operator capability",
                        phase: "Advance",
                    };

    const Icon = nextItem.icon;

    return (
        <section id="next-action" className="py-8">
            <PanelCard variant="darkNexus" accent="blue" hover>
                <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/[0.08] px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.3em] text-blue-100">
                            <Flame size={14} /> Command recommendation
                        </div>

                        <h2 className="text-3xl font-black text-white md:text-4xl">
                            Your next best action.
                        </h2>

                        <p className="mt-3 leading-7 text-slate-300">
                            DarkNexus connects each step into one route: learn the concept,
                            exploit it safely, then recognize the same risk from the defender side.
                        </p>
                    </div>

                    <a
                        href={nextItem.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5 transition-all hover:-translate-y-[1px] hover:border-blue-300/25 hover:bg-white/[0.055]"
                    >
                        <div className="flex items-start gap-4">
                            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-blue-300/20 bg-blue-400/[0.08] text-blue-100">
                                <Icon size={25} />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                                        {nextItem.label}
                                    </p>

                                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/[0.08] px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">
                                        {nextItem.phase}
                                    </span>
                                </div>

                                <h3 className="mt-2 text-2xl font-black text-white">
                                    {nextItem.title}
                                </h3>

                                <p className="mt-2 leading-7 text-slate-300">
                                    {nextItem.description}
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-200">
                                    <CheckCircle2 size={16} />
                                    {nextItem.unlock}
                                </div>

                                <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-blue-300/18 bg-blue-400/[0.07] px-4 py-2 font-black text-blue-100">
                                    {nextItem.cta}
                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </PanelCard>
        </section>
    );
}