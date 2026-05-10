"use client";

import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Eye,
    Fingerprint,
    Inbox,
    Lock,
    MailWarning,
    Radar,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import AppButton from "@dark/ui/components/AppButton";
import NexusAIButton from "@/components/assistant/NexusAIButton";
import MissionBriefingCard from "@/components/command/MissionBriefingCard";

const defenseSteps = [
    {
        label: "Inspect",
        title: "Read the signal",
        text: "Check sender, urgency, link behavior and identity mismatch.",
        icon: Eye,
        active: true,
    },
    {
        label: "Classify",
        title: "Decide risk level",
        text: "Mark the message as safe, suspicious or malicious before the user clicks.",
        icon: Radar,
        active: false,
    },
    {
        label: "Harden",
        title: "Reduce exposure",
        text: "Apply MFA, password and account protection recommendations.",
        icon: Lock,
        active: false,
    },
];

const cases = [
    {
        code: "PHISH-001",
        title: "Fake Microsoft Login",
        status: "Recommended",
        difficulty: "Beginner",
        time: "8 min",
        unlock: "Unlocks identity protection checklist",
    },
    {
        code: "SOCIAL-001",
        title: "CEO Urgency Scam",
        status: "Next",
        difficulty: "Beginner",
        time: "12 min",
        unlock: "Unlocks manipulation signals",
    },
    {
        code: "MFA-001",
        title: "Suspicious MFA Prompt",
        status: "Locked",
        difficulty: "Intermediate",
        time: "18 min",
        unlock: "Requires account security basics",
    },
];

export default function DefendCommandCenter() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070A] text-slate-100">
            <NexusBackground />

            <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Command
                    </Link>

                    <span className="font-mono text-xs font-black uppercase tracking-[0.35em] text-emerald-200">
                        Defense Command Center
                    </span>
                </div>

                <header className="grid gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/[0.08] px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.3em] text-emerald-200">
                            <ShieldCheck size={14} /> Defend / Human Risk
                        </div>

                        <h1 className="max-w-4xl text-6xl font-black leading-[0.95] tracking-tight text-white md:text-8xl">
                            Protect users
                            <span className="block text-slate-300">before they click.</span>
                        </h1>

                        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                            Defense mode trains human-layer reflexes: inspect suspicious emails,
                            classify threats, and apply simple protection actions that reduce real-world risk.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <AppButton href="https://darkdefend.vercel.app" variant="primary">
                                Analyze first email →
                            </AppButton>

                            <AppButton href="/practice" variant="secondary">
                                Review attack side
                            </AppButton>
                        </div>
                    </div>

                    <PanelCard variant="darkNexusHero" accent="emerald">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-emerald-200">
                                    Active Case
                                </p>
                                <h2 className="mt-2 text-3xl font-black text-white">
                                    PHISH-001 / Fake Microsoft Login
                                </h2>
                            </div>

                            <div className="grid h-12 w-12 place-items-center rounded-xl border border-emerald-300/25 bg-emerald-400/[0.08] text-emerald-200">
                                <MailWarning size={22} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-emerald-300/15 bg-black/30 p-5">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Stat label="Risk" value="High" />
                                <Stat label="Signal" value="Impersonation" />
                                <Stat label="Reward" value="+40 XP" />
                            </div>

                            <div className="mt-5 border-t border-white/[0.07] pt-5">
                                <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                                    Objective
                                </p>
                                <p className="mt-2 text-lg font-bold text-white">
                                    Identify whether the email is safe, suspicious or malicious.
                                </p>
                            </div>

                            <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-400/[0.07] p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="mt-1 h-5 w-5 text-amber-200" />
                                    <p className="text-sm leading-6 text-slate-300">
                                        The goal is not speed. The goal is pattern recognition:
                                        sender trust, link mismatch, urgency and credential capture intent.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </PanelCard>
                </header>

                <MissionBriefingCard
                    eyebrow="Defense Briefing"
                    title="PHISH-001 / Fake Microsoft Login"
                    objective="Inspect the email, identify impersonation signals and classify the threat before the user clicks."
                    flow={["Inspect", "Classify", "Explain", "Harden"]}
                    rewards={["+40 XP", "Human Risk badge"]}
                    duration="8 min"
                    difficulty="Beginner"
                    unlocks="Identity protection checklist and account hardening path."
                    href="https://darkdefend.vercel.app"
                    cta="Analyze case"
                    accent="emerald"
                />

                <section className="py-8">
                    <PanelCard variant="darkNexus" accent="emerald">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200">
                                <Inbox size={22} />
                            </div>
                            <div>
                                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-emerald-200">
                                    Defense Workflow
                                </p>
                                <h2 className="text-3xl font-black text-white">
                                    Inspect → Classify → Harden
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            {defenseSteps.map((step) => (
                                <DefenseStep key={step.label} {...step} />
                            ))}
                        </div>
                    </PanelCard>
                </section>

                <section className="grid gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <PanelCard variant="darkNexus" accent="emerald">
                        <div className="mb-6">
                            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-emerald-200">
                                Case Queue
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-white">
                                Human-risk route
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {cases.map((item) => (
                                <CaseRow key={item.code} item={item} />
                            ))}
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkNexus" accent="blue">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/20 bg-blue-400/[0.08] text-blue-200">
                                <Fingerprint size={22} />
                            </div>
                            <div>
                                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                                    Analyst Mindset
                                </p>
                                <h2 className="text-3xl font-black text-white">
                                    Protect people.
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm leading-6 text-slate-300">
                            <p>
                                DarkDefend should feel like a human risk defense center, not an email mini-game.
                                Every scenario teaches a real-world protection reflex.
                            </p>

                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                                <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                                    After classification
                                </p>
                                <p className="mt-2 font-semibold text-white">
                                    The user receives a clear explanation: which signal mattered,
                                    what the attacker wanted, and how to prevent the same risk.
                                </p>
                            </div>

                            <AppButton href="https://darkdefend.vercel.app" variant="primary">
                                Open DarkDefend →
                            </AppButton>
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

function DefenseStep({
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
                    ? "border-emerald-300/25 bg-emerald-400/[0.08]"
                    : "border-white/[0.07] bg-white/[0.035]",
            ].join(" ")}
        >
            <Icon className={active ? "text-emerald-200" : "text-slate-500"} size={22} />

            <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.32em] text-slate-500">
                {label}
            </p>

            <h3 className="mt-2 text-xl font-black text-white">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
        </div>
    );
}

function CaseRow({
    item,
}: {
    item: {
        code: string;
        title: string;
        status: string;
        difficulty: string;
        time: string;
        unlock: string;
    };
}) {
    const isRecommended = item.status === "Recommended";

    return (
        <a
            href={isRecommended ? "https://darkdefend.vercel.app" : "#"}
            target={isRecommended ? "_blank" : undefined}
            rel={isRecommended ? "noreferrer" : undefined}
            className={[
                "group rounded-2xl border p-5 transition",
                isRecommended
                    ? "border-emerald-300/25 bg-emerald-400/[0.08] hover:bg-emerald-400/[0.12]"
                    : "border-white/[0.07] bg-white/[0.035] opacity-70",
            ].join(" ")}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-mono text-xs font-black uppercase tracking-[0.32em] text-emerald-200">
                        {item.code}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{item.unlock}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge>{item.status}</Badge>
                    <Badge>{item.difficulty}</Badge>
                    <Badge>{item.time}</Badge>
                    {isRecommended && (
                        <ArrowRight className="text-emerald-200 transition group-hover:translate-x-1" />
                    )}
                </div>
            </div>
        </a>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full border border-white/[0.08] bg-black/25 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-300">
            {children}
        </span>
    );
}
