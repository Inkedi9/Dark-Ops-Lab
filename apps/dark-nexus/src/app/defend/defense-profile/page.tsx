"use client";

import { createElement } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    ClipboardCheck,
    CircleDot,
    MailCheck,
    Radio,
    ShieldCheck,
} from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import ProgressBar from "@dark/ui/components/ProgressBar";
import EmptyState from "@/defend/components/shared/EmptyState";
import SectionHeader from "@/defend/components/shared/SectionHeader";
import { buildDefenseProfile } from "@/defend/lib/defend/defenseProfileService";
import { compactSpacing } from "@/defend/lib/defend/uiTokens";

function levelVariant(score: number) {
    if (score >= 85) return "emerald";
    if (score >= 70) return "blue";
    if (score >= 50) return "amber";
    return "danger";
}

function levelDescription(score: number) {
    if (score >= 85) {
        return "Your defense habits are resilient across training, posture checks and SOC response signals.";
    }
    if (score >= 70) {
        return "You are building solid analyst habits. Focus on the weak signals that still create avoidable exposure.";
    }
    if (score >= 50) {
        return "Your profile has useful foundations, but misses and weak controls need structured practice.";
    }
    return "Your current profile shows meaningful exposure. Start with phishing practice, MFA, and basic response discipline.";
}

export default function DefenseProfilePage() {
    const spacing = compactSpacing(true);
    const profile = buildDefenseProfile();
    const variant = levelVariant(profile.overall.score);
    const hasPhishing = profile.phishing.total > 0;
    const hasSecurityCheck = profile.securityCheck.answered > 0;
    const hasSoc = profile.soc.incidents > 0;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070A] px-5 py-8 text-slate-100">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_32%)]" />

            <section className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/defend"
                        className="inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back Home
                    </Link>
                </div>

                <SectionHeader
                    eyebrow="Defense Profile"
                    title="Your human-layer defense posture"
                    description="Consolidated profile from phishing training, SOC incidents and security check."
                    actions={
                        <>
                            <AppBadge variant={variant}>Overall {profile.overall.score}%</AppBadge>
                            <AppBadge variant="blue">{profile.overall.label}</AppBadge>
                        </>
                    }
                />

                <PanelCard variant="darkOpsHero" accent={variant} className={`${spacing.section} ${spacing.panel}`}>
                    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-200">
                                Overall readiness
                            </p>
                            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                                {profile.overall.label}
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                                {levelDescription(profile.overall.score)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-300/12 bg-black/30 p-5">
                            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                                Profile score
                            </p>
                            <p className="mt-2 text-7xl font-black text-white">{profile.overall.score}%</p>
                            <div className="mt-4">
                                <ProgressBar value={profile.overall.score} className="h-3" />
                            </div>
                        </div>
                    </div>
                </PanelCard>

                <section className={`${spacing.section} grid gap-4 xl:grid-cols-3`}>
                    <PillarCard
                        icon={MailCheck}
                        title="Phishing Readiness"
                        empty={!hasPhishing}
                        emptyText="No phishing results yet"
                        cta="/defend/simulator"
                        ctaLabel="Start simulator"
                        stats={[
                            ["Accuracy", `${profile.phishing.accuracy}%`],
                            ["Total analyzed", profile.phishing.total],
                            ["False negatives", profile.phishing.falseNegatives],
                            ["SOC escalations", profile.phishing.socEscalations],
                        ]}
                    />

                    <PillarCard
                        icon={Radio}
                        title="SOC Discipline"
                        empty={!hasSoc}
                        emptyText="No SOC incidents yet"
                        cta="/defend/soc"
                        ctaLabel="Open SOC"
                        stats={[
                            ["Total incidents", profile.soc.incidents],
                            ["High severity", profile.soc.highSeverity],
                            ["Generated", profile.soc.generated],
                            ["Escalated", profile.soc.escalated],
                        ]}
                    />

                    <PillarCard
                        icon={ClipboardCheck}
                        title="Security Posture"
                        empty={!hasSecurityCheck}
                        emptyText="No security check yet"
                        cta="/defend/security-check"
                        ctaLabel="Run check"
                        stats={[
                            ["Check score", `${profile.securityCheck.percent}%`],
                            ["Answered", profile.securityCheck.answered],
                            ["Weak areas", profile.securityCheck.weakAreas.length],
                        ]}
                    />
                </section>

                <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                    <PanelCard variant="darkOps" accent="violet">
                        <div className="mb-5 flex items-center gap-2 text-indigo-200">
                            <ShieldCheck className="h-5 w-5" />
                            <p className="font-mono text-xs uppercase tracking-[0.28em]">Recommendations</p>
                        </div>
                        <div className="grid gap-3">
                            {profile.overall.recommendations.map((recommendation, index) => (
                                <div
                                    key={recommendation}
                                    className="rounded-xl border border-indigo-300/12 bg-indigo-400/[0.045] p-4"
                                >
                                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-indigo-200">
                                        Priority {String(index + 1).padStart(2, "0")}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-300">{recommendation}</p>
                                </div>
                            ))}
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkOps" accent="amber">
                        <div className="mb-5 flex items-center gap-2 text-amber-200">
                            <AlertTriangle className="h-5 w-5" />
                            <p className="font-mono text-xs uppercase tracking-[0.28em]">
                                Weak areas / risk signals
                            </p>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-3">
                            <RiskList
                                title="Phishing weak categories"
                                items={profile.phishing.weakCategories}
                                empty="No phishing weak categories yet."
                            />
                            <RiskList
                                title="Security weak areas"
                                items={profile.securityCheck.weakAreas.map((area) => area.category)}
                                empty="No security weak areas yet."
                            />
                            <RiskList
                                title="High severity incidents"
                                items={
                                    profile.soc.highSeverity > 0
                                        ? [`${profile.soc.highSeverity} high severity incident${profile.soc.highSeverity > 1 ? "s" : ""}`]
                                        : []
                                }
                                empty="No high severity incidents."
                            />
                        </div>
                    </PanelCard>
                </section>

                <PanelCard variant="darkOpsHero" accent="blue" className="mt-6">
                    <div className="flex flex-wrap gap-3">
                        <CtaButton href="/defend/simulator" label="Start phishing simulator" />
                        <CtaButton href="/defend/soc" label="Open SOC" />
                        <CtaButton href="/defend/security-check" label="Run Security Check" />
                        <CtaButton href="/defend/soc/reports" label="View Reports" />
                    </div>
                </PanelCard>
            </section>
        </main>
    );
}

function PillarCard({ icon, title, stats, empty, emptyText, cta, ctaLabel }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; stats: [string, string | number][]; empty: boolean; emptyText: string; cta: string; ctaLabel: string }) {
    return (
        <PanelCard variant="darkOps" accent={empty ? "blue" : "violet"} className="p-4">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/15 bg-blue-400/[0.07] text-blue-200">
                        {icon && createElement(icon, { size: 20 })}
                    </div>
                    <h2 className="font-black text-white">{title}</h2>
                </div>
                <AppBadge variant={empty ? "default" : "blue"}>{empty ? "Pending" : "Active"}</AppBadge>
            </div>

            {empty ? (
                <EmptyState
                    icon={icon || CircleDot}
                    title={emptyText}
                    description="Run the related activity to feed this profile pillar."
                    actionLabel={ctaLabel}
                    actionTo={cta}
                />
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {stats.map(([label, value]) => (
                        <MiniStat key={label} label={label} value={value} />
                    ))}
                </div>
            )}
        </PanelCard>
    );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-slate-300/12 bg-slate-400/[0.035] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-black text-white">{value}</p>
        </div>
    );
}

function RiskList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
    const uniqueItems = [...new Set(items)].filter(Boolean).slice(0, 5);
    return (
        <div className="rounded-xl border border-slate-300/12 bg-slate-400/[0.03] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{title}</p>
            <div className="mt-3 space-y-2">
                {uniqueItems.length ? (
                    uniqueItems.map((item) => (
                        <div
                            key={item}
                            className="rounded-lg border border-amber-300/12 bg-amber-400/[0.045] px-3 py-2 text-sm font-bold text-slate-300"
                        >
                            {item}
                        </div>
                    ))
                ) : (
                    <EmptyState
                        icon={AlertTriangle}
                        title={empty}
                        description="No signal is currently strong enough to highlight here."
                    />
                )}
            </div>
        </div>
    );
}

function CtaButton({ href, label }: { href: string; label: string }) {
    return (
        <Link href={href}>
            <AppButton variant="secondary">
                <BarChart3 size={16} />
                {label}
            </AppButton>
        </Link>
    );
}
