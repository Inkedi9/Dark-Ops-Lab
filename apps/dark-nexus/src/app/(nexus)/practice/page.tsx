"use client";

import {
    ArrowLeft,
    ArrowRight,
    Crosshair,
    Flag,
    LockKeyhole,
    Radar,
    Route,
    ShieldAlert,
    Swords,
    TerminalSquare,
} from "lucide-react";
import Link from "next/link";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import AppButton from "@dark/ui/components/AppButton";
import NexusAIButton from "@/components/assistant/NexusAIButton";
import MissionBriefingCard from "@/components/command/MissionBriefingCard";

const attackSteps = [
    {
        label: "Recon",
        title: "Identify the weak surface",
        text: "Review target signals, exposed routes and suspicious authentication behavior.",
        icon: Radar,
        active: true,
    },
    {
        label: "Exploit",
        title: "Bypass the fake login",
        text: "Apply the SQLi concept inside a safe mocked target.",
        icon: LockKeyhole,
        active: false,
    },
    {
        label: "Capture",
        title: "Extract the flag",
        text: "Confirm impact, capture proof and earn operator XP.",
        icon: Flag,
        active: false,
    },
];

const missions = [
    {
        code: "SQLI-001",
        title: "Login Bypass",
        status: "Recommended",
        difficulty: "Beginner",
        time: "10 min",
        unlock: "Unlocks auth defense simulation",
    },
    {
        code: "XSS-001",
        title: "Reflected XSS",
        status: "Locked",
        difficulty: "Beginner",
        time: "15 min",
        unlock: "Requires XSS Basics",
    },
    {
        code: "AUTH-001",
        title: "Token Replay",
        status: "Later",
        difficulty: "Intermediate",
        time: "30 min",
        unlock: "Unlocks session defense route",
    },
];

export default function PracticeCommandCenter() {
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

                    <span className="font-mono text-xs font-black uppercase tracking-[0.35em] text-rose-200">
                        Offensive Command Center
                    </span>
                </div>

                <header className="grid gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-400/[0.08] px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.3em] text-rose-200">
                            <Swords size={14} /> Practice / Attack
                        </div>

                        <h1 className="max-w-4xl text-6xl font-black leading-[0.95] tracking-tight text-white md:text-8xl">
                            Execute your
                            <span className="block text-slate-300">first safe exploit.</span>
                        </h1>

                        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                            Practice mode turns lessons into operations. Recon the target,
                            exploit safely, capture proof, then unlock the defender-side lesson.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <AppButton href="/challenges" variant="primary">
                                Launch Login Bypass →
                            </AppButton>

                            <AppButton href="/learn" variant="secondary">
                                Review SQLi Basics
                            </AppButton>
                        </div>
                    </div>

                    <PanelCard variant="darkOpsHero" accent="danger">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-rose-200">
                                    Active Operation
                                </p>
                                <h2 className="mt-2 text-3xl font-black text-white">
                                    SQLI-001 / Login Bypass
                                </h2>
                            </div>

                            <div className="grid h-12 w-12 place-items-center rounded-xl border border-rose-300/25 bg-rose-400/[0.08] text-rose-200">
                                <Crosshair size={22} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-rose-300/15 bg-black/30 p-5">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Stat label="Status" value="Ready" />
                                <Stat label="Risk" value="Safe Lab" />
                                <Stat label="Reward" value="+50 XP" />
                            </div>

                            <div className="mt-5 border-t border-white/[0.07] pt-5">
                                <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                                    Objective
                                </p>
                                <p className="mt-2 text-lg font-bold text-white">
                                    Authenticate as a user without knowing the password.
                                </p>
                            </div>

                            <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-400/[0.07] p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldAlert className="mt-1 h-5 w-5 text-amber-200" />
                                    <p className="text-sm leading-6 text-slate-300">
                                        This is a mocked target. No real system is being tested.
                                        The goal is to understand the vulnerability safely.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </PanelCard>
                </header>

                <MissionBriefingCard
                    eyebrow="Mission Briefing"
                    title="SQLI-001 / Login Bypass"
                    objective="Authenticate as a user without knowing the password by exploiting unsafe login logic in a mocked target."
                    flow={["Recon", "Payload", "Bypass", "Capture"]}
                    rewards={["+50 XP", "First Exploit badge", "Defense simulation unlock"]}
                    duration="10 min"
                    difficulty="Beginner"
                    unlocks="Weak Auth Defense simulation in DarkDefend."
                    href="/challenges"
                    cta="Launch operation"
                    accent="danger"
                    threatLevel="HIGH"
                    successRate={82}
                    requiredSkills={[
                        {
                            label: "SQL Injection Basics",
                            completed: true,
                        },
                        {
                            label: "Authentication Weaknesses",
                            completed: false,
                        },
                    ]}
                />

                <section className="py-8">
                    <PanelCard variant="darkOps" accent="danger">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl border border-rose-300/20 bg-rose-400/[0.08] text-rose-200">
                                <Route size={22} />
                            </div>
                            <div>
                                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-rose-200">
                                    Attack Route
                                </p>
                                <h2 className="text-3xl font-black text-white">
                                    Recon → Exploit → Capture
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            {attackSteps.map((step) => (
                                <AttackStep key={step.label} {...step} />
                            ))}
                        </div>
                    </PanelCard>
                </section>

                <section className="grid gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <PanelCard variant="darkOps" accent="danger">
                        <div className="mb-6">
                            <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-rose-200">
                                Mission Queue
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-white">
                                Offensive route
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {missions.map((mission) => (
                                <MissionRow key={mission.code} mission={mission} />
                            ))}
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkOps" accent="blue">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/20 bg-blue-400/[0.08] text-blue-200">
                                <TerminalSquare size={22} />
                            </div>
                            <div>
                                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                                    Operation Rules
                                </p>
                                <h2 className="text-3xl font-black text-white">
                                    Safe practice only.
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm leading-6 text-slate-300">
                            <p>
                                Practice mode is for simulated targets only. Each operation is
                                designed to teach reasoning, impact and defensive awareness.
                            </p>

                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                                <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                                    After capture
                                </p>
                                <p className="mt-2 font-semibold text-white">
                                    DarkOps recommends the matching defense simulation so the
                                    user learns how to prevent the same weakness.
                                </p>
                            </div>

                            <AppButton href="/challenges" variant="primary">
                                Open DarkChallenges →
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

function AttackStep({
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
                    ? "border-rose-300/25 bg-rose-400/[0.08]"
                    : "border-white/[0.07] bg-white/[0.035]",
            ].join(" ")}
        >
            <Icon className={active ? "text-rose-200" : "text-slate-500"} size={22} />

            <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.32em] text-slate-500">
                {label}
            </p>

            <h3 className="mt-2 text-xl font-black text-white">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
        </div>
    );
}

function MissionRow({
    mission,
}: {
    mission: {
        code: string;
        title: string;
        status: string;
        difficulty: string;
        time: string;
        unlock: string;
    };
}) {
    const isRecommended = mission.status === "Recommended";

    return (
        <a
            href={isRecommended ? "/challenges" : "#"}
            className={[
                "group rounded-2xl border p-5 transition",
                isRecommended
                    ? "border-rose-300/25 bg-rose-400/[0.08] hover:bg-rose-400/[0.12]"
                    : "border-white/[0.07] bg-white/[0.035] opacity-70",
            ].join(" ")}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-mono text-xs font-black uppercase tracking-[0.32em] text-rose-200">
                        {mission.code}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white">{mission.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{mission.unlock}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge>{mission.status}</Badge>
                    <Badge>{mission.difficulty}</Badge>
                    <Badge>{mission.time}</Badge>
                    {isRecommended && <ArrowRight className="text-rose-200 transition group-hover:translate-x-1" />}
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
