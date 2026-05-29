"use client";

import { createElement, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowRight,
    Brain,
    MailWarning,
    ShieldCheck,
    Activity,
    Radar,
    Terminal,
    ShieldAlert,
    UserCheck,
    BarChart3,
} from "lucide-react";
import Header from "@/defend/components/Header";
import { PhishPanel } from "@/defend/components/ui/PhishPanel";
import { PhishBadge } from "@/defend/components/ui/PhishBadge";
import { PhishButton } from "@/defend/components/ui/PhishButton";
import DefenseDashboard from "@/defend/components/DefenseDashboard";
import { scenarios } from "@/defend/data/scenarios";
import {
    getDarkProfile,
    getDefendStats,
} from "@/defend/lib/defend/defendProgressService";
import PhishFooter from "@/defend/components/layout/PhishFooter";

function IncidentRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const incidentId = searchParams?.get("incident");
        if (incidentId) {
            router.replace(`/defend/simulator?incident=${incidentId}`);
        }
    }, [searchParams, router]);

    return null;
}

export default function DefendHome() {
    const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        getDarkProfile().then(setProfile);
    }, []);

    const defendStats = {
        ...getDefendStats(profile, scenarios.length),
        totalScenarios: scenarios.length,
    };

    return (
        <>
            <Suspense>
                <IncidentRedirect />
            </Suspense>
            <Header />

            <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
                <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
                            <Activity className="h-3.5 w-3.5" />
                            Analyst console / incident triage
                        </div>

                        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl xl:text-7xl">
                            Train your human firewall.
                            <span className="block bg-gradient-to-r from-blue-200 via-white to-green-300 bg-clip-text text-transparent">
                                Stop phishing attacks.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
                            Interactive phishing training for analysts and teams.
                            Analyze real-world emails, detect deception patterns, and build instinctive decision-making under pressure.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2 font-mono">
                            <PhishBadge tone="blue">Realistic scenarios</PhishBadge>
                            <PhishBadge tone="slate">SOC-driven training</PhishBadge>
                            <PhishBadge tone="green">Human-layer defense</PhishBadge>
                        </div>

                        <div className="mt-7 grid gap-3 sm:grid-cols-3">
                            <SignalMetric icon={MailWarning} label="Incident" value={`${scenarios.length} scenarios`} tone="blue" />
                            <SignalMetric icon={Radar} label="Confidence" value="92%" tone="green" />
                            <SignalMetric icon={ShieldAlert} label="Queue" value="Triage ready" tone="amber" />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/defend/simulator">
                                <PhishButton tone="blue">
                                    Start training
                                    <ArrowRight className="h-4 w-4" />
                                </PhishButton>
                            </Link>

                            <Link href="/defend/soc">
                                <PhishButton tone="slate">Open SOC mode</PhishButton>
                            </Link>

                            <Link href="/defend/security-check">
                                <PhishButton tone="slate">Security check</PhishButton>
                            </Link>

                            <Link href="/defend/defense-profile">
                                <PhishButton tone="slate">Defense Profile</PhishButton>
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <PhishPanel className="relative min-h-[560px] overflow-hidden border-emerald-300/14 bg-[radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_90%_14%,rgba(96,165,250,0.09),transparent_28%),linear-gradient(180deg,rgba(3,16,13,0.94),rgba(3,7,18,0.86))] p-6">
                            <div className="pointer-events-none absolute inset-0 opacity-[0.16] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />
                            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/45 to-blue-200/25" />

                            <div className="relative z-10">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">Analyst Console</p>
                                        <h2 className="mt-2 text-2xl font-black text-white">Incident review active</h2>
                                    </div>
                                    <div className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-3 text-blue-300">
                                        <MailWarning className="h-6 w-6" />
                                    </div>
                                </div>

                                <div className="mb-5 rounded-2xl border border-emerald-400/15 bg-black/40 p-4 font-mono text-sm leading-7 text-green-300 backdrop-blur-xl shadow-[inset_0_0_24px_rgba(16,185,129,.035)]">
                                    <p>&gt; boot_incident_console</p>
                                    <p className="text-blue-200">[INFO] Signal engine connected</p>
                                    <p>[READY] Analyst triage session live</p>
                                    <p className="text-amber-300">[TASK] Inspect sender, links, tone, and intent</p>
                                    <p className="text-emerald-300">root@dark-defend:~$ <span className="terminal-cursor">█</span></p>
                                </div>

                                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                                    <ConsoleStat label="Signal" value="Suspicious" tone="amber" />
                                    <ConsoleStat label="Confidence" value="High" tone="green" />
                                    <ConsoleStat label="Action" value="Classify" tone="blue" />
                                </div>

                                <div className="space-y-4">
                                    <ScenarioCard icon={MailWarning} label="Phishing Attempt" title="Password reset request from unknown sender" tone="red" />
                                    <ScenarioCard icon={ShieldCheck} label="Trusted Message" title="Internal meeting reminder from verified domain" tone="green" />
                                    <ScenarioCard icon={Brain} label="Analyst Judgment" title="Classify the signal before the user clicks." tone="amber" />
                                </div>
                            </div>
                        </PhishPanel>
                    </div>
                </section>

                <section className="mt-14 grid gap-4 md:grid-cols-3">
                    <ConsoleModule icon={Terminal} title="Investigate" text="Read headers, body language, links and sender context." />
                    <ConsoleModule icon={Radar} title="Classify" text="Decide legitimate, suspicious or phishing with feedback." green />
                    <ConsoleModule icon={ShieldCheck} title="Defend" text="Turn each mistake into sharper human-layer detection." />
                </section>

                <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <DefenseModeCard icon={ShieldAlert} label="SOC Mode" title="Investigate alerts like a blue-team analyst." text="Triage suspicious activity, inspect artifacts, review indicators and classify incidents." href="/defend/soc" tone="blue" />
                    <DefenseModeCard icon={UserCheck} label="Security Check" title="Measure your personal defense posture." text="Answer practical questions and receive a risk score with targeted recommendations." href="/defend/security-check" tone="green" />
                    <DefenseModeCard icon={BarChart3} label="Defense Profile" title="View your consolidated human-layer defense posture." text="Combine phishing training, SOC incidents and posture diagnostics into one operator view." href="/defend/defense-profile" tone="blue" />
                </section>

                <DefenseDashboard profile={profile} stats={defendStats} />
            </main>
            <PhishFooter />
        </>
    );
}

function ScenarioCard({ icon, label, title, tone = "blue" }: { icon: React.ElementType; label: string; title: string; tone?: "red" | "green" | "amber" | "blue" }) {
    const tones = {
        red: "border-red-500/30 bg-red-500/10 text-red-300",
        green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    };
    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
                    <p className="mt-2 text-sm font-bold text-white">{title}</p>
                </div>
                {createElement(icon, { className: "h-5 w-5" })}
            </div>
        </div>
    );
}

function SignalMetric({ icon, label, value, tone = "blue" }: { icon: React.ElementType; label: string; value: string | number; tone?: "blue" | "green" | "amber" }) {
    const tones = {
        blue: "border-blue-300/16 bg-blue-300/[0.055] text-blue-200",
        green: "border-emerald-300/16 bg-emerald-300/[0.055] text-emerald-200",
        amber: "border-amber-300/16 bg-amber-300/[0.055] text-amber-200",
    };
    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="mb-3 flex items-center gap-2">
                {createElement(icon, { className: "h-4 w-4" })}
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
            </div>
            <p className="text-sm font-black text-white">{value}</p>
        </div>
    );
}

function ConsoleStat({ label, value, tone = "blue" }: { label: string; value: string | number; tone?: "blue" | "green" | "amber" }) {
    const tones = {
        blue: "border-blue-300/14 bg-blue-300/[0.045] text-blue-200",
        green: "border-emerald-300/14 bg-emerald-300/[0.045] text-emerald-200",
        amber: "border-amber-300/14 bg-amber-300/[0.045] text-amber-200",
    };
    return (
        <div className={`rounded-xl border px-3 py-3 ${tones[tone]}`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-black text-white">{value}</p>
        </div>
    );
}

function ConsoleModule({ icon, title, text, green = false }: { icon: React.ElementType; title: string; text: string; green?: boolean }) {
    return (
        <div className="rounded-2xl border border-blue-400/20 bg-black/30 p-5 shadow-[0_0_24px_rgba(0,229,255,0.05)] backdrop-blur-xl">
            <div className={`mb-4 grid h-11 w-11 place-items-center rounded-xl border ${green ? "border-green-300/50 text-green-300" : "border-blue-300/50 text-blue-300"}`}>
                {createElement(icon, { className: "h-5 w-5" })}
            </div>
            <h3 className={`font-bold uppercase tracking-[0.2em] ${green ? "text-green-300" : "text-blue-300"}`}>{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
        </div>
    );
}

function DefenseModeCard({ icon, label, title, text, href, tone = "blue" }: { icon: React.ElementType; label: string; title: string; text: string; href: string; tone?: "blue" | "green" }) {
    const isGreen = tone === "green";
    return (
        <Link href={href} className="group block rounded-2xl border border-blue-400/15 bg-black/30 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.035]">
            <div className="mb-5 flex items-center justify-between">
                <div className={`grid h-12 w-12 place-items-center rounded-xl border ${isGreen ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200" : "border-blue-300/30 bg-blue-400/10 text-blue-200"}`}>
                    {createElement(icon, { className: "h-5 w-5" })}
                </div>
                <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </div>
            <p className={`font-mono text-xs font-bold uppercase tracking-[0.26em] ${isGreen ? "text-emerald-300" : "text-blue-300"}`}>{label}</p>
            <h3 className="mt-3 text-2xl font-black text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
        </Link>
    );
}
