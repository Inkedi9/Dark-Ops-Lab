"use client";

import {
    ArrowRight,
    BookOpen,
    Brain,
    CheckCircle2,
    Database,
    Eye,
    FlaskConical,
    GraduationCap,
    Route,
    ShieldCheck,
    Swords,
} from "lucide-react";
import Link from "next/link";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import AppButton from "@dark/ui/components/AppButton";
import NexusAIButton from "@/components/assistant/NexusAIButton";
import MissionBriefingCard from "@/components/command/MissionBriefingCard";

const learningSteps = [
    {
        label: "Concept",
        title: "Understand the flaw",
        text: "Learn what SQL Injection is and why unsafe queries become dangerous.",
        icon: Brain,
        active: true,
    },
    {
        label: "Visualize",
        title: "See the data flow",
        text: "Follow how input moves from a login form into a database query.",
        icon: Database,
        active: false,
    },
    {
        label: "Unlock",
        title: "Open the lab",
        text: "Complete the lesson to unlock the matching Login Bypass mission.",
        icon: FlaskConical,
        active: false,
    },
];

const lessons = [
    {
        code: "SQLI-000",
        title: "SQL Injection Basics",
        status: "Recommended",
        difficulty: "Beginner",
        time: "10 min",
        unlock: "Unlocks Login Bypass mission",
    },
    {
        code: "XSS-000",
        title: "Cross-Site Scripting Basics",
        status: "Next",
        difficulty: "Beginner",
        time: "12 min",
        unlock: "Unlocks Reflected XSS mission",
    },
    {
        code: "AUTH-000",
        title: "Authentication Weaknesses",
        status: "Locked",
        difficulty: "Intermediate",
        time: "18 min",
        unlock: "Unlocks Token Replay route",
    },
];

export default function LearnCommandCenter() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070A] text-slate-100">
            <NexusBackground />

            <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href="/"
                        className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                    >
                        ← Back to Command
                    </Link>

                    <span className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                        Learning Command Center
                    </span>
                </div>

                <header className="grid gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/[0.08] px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.3em] text-blue-200">
                            <GraduationCap size={14} /> Learn / Foundation
                        </div>

                        <h1 className="max-w-4xl text-6xl font-black leading-[0.95] tracking-tight text-white md:text-8xl">
                            Learn the flaw
                            <span className="block text-slate-300">before you exploit it.</span>
                        </h1>

                        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                            Learning mode breaks cyber concepts into simple visual steps. Understand
                            the weakness, see how it works, then unlock the matching safe lab.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <AppButton href="https://darksplaining.vercel.app" variant="primary">
                                Start SQLi Basics →
                            </AppButton>

                            <AppButton href="/practice" variant="secondary">
                                Preview matching lab
                            </AppButton>
                        </div>
                    </div>

                    <PanelCard variant="darkNexusHero" accent="blue">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                                    Active Lesson
                                </p>
                                <h2 className="mt-2 text-3xl font-black text-white">
                                    SQLI-000 / SQL Injection Basics
                                </h2>
                            </div>

                            <div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-300/25 bg-blue-400/[0.08] text-blue-200">
                                <BookOpen size={22} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-blue-300/15 bg-black/30 p-5">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Stat label="Level" value="Beginner" />
                                <Stat label="Focus" value="SQLi" />
                                <Stat label="Reward" value="+30 XP" />
                            </div>

                            <div className="mt-5 border-t border-white/[0.07] pt-5">
                                <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                                    Objective
                                </p>
                                <p className="mt-2 text-lg font-bold text-white">
                                    Understand how user input can alter a database query.
                                </p>
                            </div>

                            <div className="mt-5 rounded-xl border border-blue-300/20 bg-blue-400/[0.07] p-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-1 h-5 w-5 text-blue-200" />
                                    <p className="text-sm leading-6 text-slate-300">
                                        Complete this lesson to unlock Login Bypass in Practice mode,
                                        then return to Defend mode to recognize the same risk pattern.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </PanelCard>
                </header>

                <MissionBriefingCard
                    eyebrow="Lesson Briefing"
                    title="SQLI-000 / SQL Injection Basics"
                    objective="Understand how user input can alter a database query and expose authentication flaws."
                    flow={["Concept", "Diagram", "Example", "Unlock"]}
                    rewards={["+30 XP", "SQLi Foundation badge"]}
                    duration="10 min"
                    difficulty="Beginner"
                    unlocks="Login Bypass mission in Practice mode."
                    href="https://darksplaining.vercel.app"
                    cta="Start lesson"
                    accent="blue"
                />

                <section className="py-8">
                    <PanelCard variant="darkNexus" accent="blue">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/20 bg-blue-400/[0.08] text-blue-200">
                                <Route size={22} />
                            </div>
                            <div>
                                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                                    Learning Route
                                </p>
                                <h2 className="text-3xl font-black text-white">
                                    Concept → Visualize → Unlock
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            {learningSteps.map((step) => (
                                <LearningStep key={step.label} {...step} />
                            ))}
                        </div>
                    </PanelCard>
                </section>

                <section className="grid gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <PanelCard variant="darkNexus" accent="blue">
                        <div className="mb-6">
                            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                                Lesson Queue
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-white">
                                Foundation route
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {lessons.map((lesson) => (
                                <LessonRow key={lesson.code} lesson={lesson} />
                            ))}
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkNexus" accent="emerald">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200">
                                <Eye size={22} />
                            </div>
                            <div>
                                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-emerald-200">
                                    Why it matters
                                </p>
                                <h2 className="text-3xl font-black text-white">
                                    Learn once. Use twice.
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm leading-6 text-slate-300">
                            <p>
                                DarkSplaining should be calm, clear and visual. The goal is not to
                                overwhelm the learner — it is to give them operational understanding.
                            </p>

                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                                <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                                    Learning loop
                                </p>
                                <p className="mt-2 font-semibold text-white">
                                    Every concept should unlock a safe exploit lab and a matching
                                    defensive recognition scenario.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <MiniLink href="/practice" icon={Swords} label="Practice side" />
                                <MiniLink href="/defend" icon={ShieldCheck} label="Defense side" />
                            </div>
                        </div>
                    </PanelCard>
                </section>
            </section>
            <NexusAIButton />
        </main>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-xl font-black text-white">{value}</p>
        </div>
    );
}

function LearningStep({
    label,
    title,
    text,
    icon: Icon,
    active,
}: {
    label: string;
    title: string;
    text: string;
    icon: React.ElementType;
    active: boolean;
}) {
    return (
        <div
            className={[
                "rounded-2xl border p-5",
                active
                    ? "border-blue-300/25 bg-blue-400/[0.08]"
                    : "border-white/[0.07] bg-white/[0.035]",
            ].join(" ")}
        >
            <Icon className={active ? "text-blue-200" : "text-slate-500"} size={22} />

            <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.32em] text-slate-500">
                {label}
            </p>

            <h3 className="mt-2 text-xl font-black text-white">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
        </div>
    );
}

function LessonRow({
    lesson,
}: {
    lesson: {
        code: string;
        title: string;
        status: string;
        difficulty: string;
        time: string;
        unlock: string;
    };
}) {
    const isRecommended = lesson.status === "Recommended";

    return (
        <a
            href={isRecommended ? "https://darksplaining.vercel.app" : "#"}
            target={isRecommended ? "_blank" : undefined}
            rel={isRecommended ? "noreferrer" : undefined}
            className={[
                "group rounded-2xl border p-5 transition",
                isRecommended
                    ? "border-blue-300/25 bg-blue-400/[0.08] hover:bg-blue-400/[0.12]"
                    : "border-white/[0.07] bg-white/[0.035] opacity-70",
            ].join(" ")}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-mono text-xs font-black uppercase tracking-[0.32em] text-blue-200">
                        {lesson.code}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white">{lesson.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{lesson.unlock}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge>{lesson.status}</Badge>
                    <Badge>{lesson.difficulty}</Badge>
                    <Badge>{lesson.time}</Badge>
                    {isRecommended && (
                        <ArrowRight className="text-blue-200 transition group-hover:translate-x-1" />
                    )}
                </div>
            </div>
        </a>
    );
}

function MiniLink({
    href,
    icon: Icon,
    label,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 font-bold text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
        >
            <span className="flex items-center gap-2">
                <Icon size={17} />
                {label}
            </span>
            <ArrowRight size={16} />
        </Link>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full border border-white/[0.08] bg-black/25 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-300">
            {children}
        </span>
    );
}