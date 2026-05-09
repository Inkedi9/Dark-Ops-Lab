import { createElement, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    ArrowLeft,
    Award,
    ClipboardCheck,
    FileText,
    MailCheck,
    Radio,
    Shield,
    ShieldCheck,
    Target,
    Terminal,
    Trophy,
    User,
    Zap,
} from "lucide-react";
import Header from "@/components/Header";
import { PhishLayout } from "@/components/ui/PhishLayout";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishBadge } from "@/components/ui/PhishBadge";
import { PhishButton } from "@/components/ui/PhishButton";
import { PhishMetric } from "@/components/ui/PhishMetric";
import { PhishProgress } from "@/components/ui/PhishProgress";
import { scenarios } from "@/data/scenarios";
import { securityCheckQuestions } from "@/data/securityCheckQuestions";
import { getDarkProfile, getDefendStats } from "@/lib/defend/defendProgressService";
import { buildDefenseProfile, getPhishingResults, getSocIncidents, getSecurityCheckAnswers } from "@/lib/defend/defenseProfileService";

const BADGE_LABELS = {
    defend_first_analysis: "First Analysis",
    defend_perfect_analysis: "Perfect Analysis",
    defend_phishing_path_complete: "Phishing Path Complete",
    defend_analyst_correct: "Analyst Call",
    defend_streak_3: "Three-Call Streak",
};

const readinessItems = [
    { key: "email", label: "Email Security" },
    { key: "mfa", label: "MFA Hygiene" },
    { key: "device", label: "Device Hygiene" },
    { key: "response", label: "Incident Response" },
    { key: "soc", label: "SOC Readiness" },
];

export default function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        getDarkProfile().then(setProfile);
    }, []);

    const defenseProfile = useMemo(() => buildDefenseProfile(), []);
    const phishingResults = useMemo(() => getPhishingResults(), []);
    const socIncidents = useMemo(() => getSocIncidents(), []);
    const securityAnswers = useMemo(() => getSecurityCheckAnswers(), []);

    const stats = getDefendStats(profile, scenarios.length);
    const xpIntoLevel = profile ? profile.xp % 100 : 0;
    const xpToNext = xpIntoLevel === 0 ? 100 : 100 - xpIntoLevel;
    const badges = profile?.badges || [];
    const operatorFocus = getOperatorFocus(defenseProfile);
    const recentActivity = getRecentActivity({
        phishingResults,
        socIncidents,
        securityAnswers,
        profile,
    });
    const readiness = getReadinessScores(defenseProfile, securityAnswers);

    return (
        <>
            <Header />

            <PhishLayout>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <Link to="/">
                        <PhishButton tone="slate">
                            <ArrowLeft className="h-4 w-4" />
                            Back Home
                        </PhishButton>
                    </Link>

                    <div className="flex flex-wrap gap-2">
                        <PhishBadge tone="green">Profile Secure</PhishBadge>
                        <PhishBadge tone="blue">Defense identity</PhishBadge>
                        <PhishBadge tone="slate">Local mode</PhishBadge>
                    </div>
                </div>

                <PhishPanel variant="glow" compact className="p-5">
                    <div className="grid gap-5 lg:grid-cols-[1fr_330px] lg:items-start">
                        <div className="flex gap-5">
                            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-blue-300/24 bg-blue-400/[0.08] text-blue-200 shadow-[0_0_30px_rgba(96,165,250,0.12)]">
                                <User className="h-9 w-9" />
                            </div>

                            <div className="min-w-0">
                                <p className="font-mono text-xs uppercase tracking-[0.32em] text-blue-300">
                                    Operator Profile
                                </p>
                                <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">
                                    {profile?.username || "Ghost"}
                                </h1>
                                <p className="mt-2 text-sm text-slate-400">
                                    Rank: <span className="font-bold text-emerald-300">{profile?.rank || "ROOKIE"}</span>
                                </p>

                                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                    <MiniStatus label="Posture" value={defenseProfile.overall.label} />
                                    <MiniStatus label="Specialization" value={operatorFocus.specialization} />
                                    <MiniStatus label="Next level" value={`${xpToNext} XP`} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-blue-300/14 bg-blue-400/[0.045] p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-blue-200">
                                defense.posture
                            </p>
                            <div className="mt-3 flex items-end justify-between gap-4">
                                <p className="text-6xl font-black text-white">
                                    {defenseProfile.overall.score}%
                                </p>
                                <PhishBadge tone={profileTone(defenseProfile.overall.score)}>
                                    {defenseProfile.overall.level}
                                </PhishBadge>
                            </div>
                            <div className="mt-4">
                                <PhishProgress value={defenseProfile.overall.score} max={100} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                        <PhishMetric label="XP" value={profile?.xp ?? 0} tone="blue" />
                        <PhishMetric label="Level" value={profile?.level ?? 1} tone="green" />
                        <PhishMetric label="Badges" value={badges.length} tone="slate" />
                        <PhishMetric label="Defend Done" value={stats.completedScenarioCount} tone="amber" />
                    </div>
                </PhishPanel>

                <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                    <PhishPanel compact className="p-5">
                        <PanelTitle icon={Target} title="Operator Focus" />
                        <div className="mt-4 grid gap-3">
                            <FocusRow label="Specialization" value={operatorFocus.specialization} tone="blue" />
                            <FocusRow label="Strongest category" value={operatorFocus.strongestCategory} tone="green" />
                            <FocusRow label="Weakest area" value={operatorFocus.weakestArea} tone="amber" />
                        </div>
                    </PhishPanel>

                    <PhishPanel compact className="p-5">
                        <PanelTitle icon={Activity} title="Recent Activity" />
                        <div className="mt-4 grid gap-3">
                            {recentActivity.map((item) => (
                                <TimelineItem key={item.label} {...item} />
                            ))}
                        </div>
                    </PhishPanel>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                    <PhishPanel compact className="p-5">
                        <PanelTitle icon={ShieldCheck} title="Defense Posture" />
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <CompactMetric label="Phishing accuracy" value={`${defenseProfile.phishing.accuracy}%`} />
                            <CompactMetric label="False positives" value={defenseProfile.phishing.falsePositives} tone="amber" />
                            <CompactMetric label="False negatives" value={defenseProfile.phishing.falseNegatives} tone="red" />
                            <CompactMetric label="SOC escalations" value={defenseProfile.phishing.socEscalations} tone="blue" />
                            <CompactMetric label="High confidence" value={defenseProfile.phishing.highConfidence} tone="green" />
                            <CompactMetric label="Reasoned decisions" value={defenseProfile.phishing.reasonedDecisions} tone="slate" />
                        </div>
                    </PhishPanel>

                    <PhishPanel compact className="p-5">
                        <PanelTitle icon={Radio} title="Readiness Grid" />
                        <div className="mt-4 space-y-4">
                            {readinessItems.map((item) => (
                                <ReadinessRow
                                    key={item.key}
                                    label={item.label}
                                    value={readiness[item.key]}
                                />
                            ))}
                        </div>
                    </PhishPanel>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-2">
                    <PhishPanel compact className="p-5">
                        <PanelTitle icon={Trophy} title="Badges" />

                        {badges.length === 0 ? (
                            <p className="mt-4 text-slate-400">No badges unlocked yet.</p>
                        ) : (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {badges.map((badge) => {
                                    const rarity = getBadgeRarity(badge);
                                    return (
                                        <div
                                            key={badge}
                                            className={[
                                                "rounded-xl border p-4",
                                                rarity.className,
                                            ].join(" ")}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <Award className="h-5 w-5 text-blue-200" />
                                                <span className="rounded-lg border border-white/[0.08] bg-black/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300">
                                                    {rarity.label}
                                                </span>
                                            </div>
                                            <p className="mt-3 font-bold text-white">
                                                {BADGE_LABELS[badge] || badge}
                                            </p>
                                            <p className="mt-1 font-mono text-xs text-slate-500">{badge}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </PhishPanel>

                    <PhishPanel compact className="p-5">
                        <PanelTitle icon={Zap} title="Quick Actions" />
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <QuickAction to="/simulator" icon={MailCheck} label="Continue Training" />
                            <QuickAction to="/soc" icon={Radio} label="Open SOC" />
                            <QuickAction to="/security-check" icon={ClipboardCheck} label="Run Security Check" />
                            <QuickAction to="/soc/reports" icon={FileText} label="View Reports" />
                        </div>
                    </PhishPanel>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                    <PhishPanel compact className="p-5">
                        <PanelTitle icon={Shield} title="Account Details" />

                        <div className="mt-4 grid gap-3 font-mono text-sm text-slate-400 md:grid-cols-2">
                            <p className="break-all">ID: {profile?.id || "pending"}</p>
                            <p>Storage: localStorage V2</p>
                            <p>Created: {formatDate(profile?.createdAt)}</p>
                            <p>Updated: {formatDate(profile?.updatedAt)}</p>
                        </div>
                    </PhishPanel>

                    <PhishPanel compact className="p-5">
                        <PanelTitle icon={Terminal} title="System Status" />

                        <div className="mt-4 grid gap-2 font-mono text-sm">
                            <SystemLine label="Local profile sync" status="ONLINE" tone="green" />
                            <SystemLine label="Defense telemetry" status="ACTIVE" tone="blue" />
                            <SystemLine label="SOC bridge" status="READY" tone="amber" />
                            <SystemLine label="Incident correlation" status="LOCAL MODE" tone="slate" />
                        </div>
                    </PhishPanel>
                </div>
            </PhishLayout>
        </>
    );
}

function PanelTitle({ icon, title }) {
    return (
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
            {createElement(icon, { className: "h-4 w-4" })}
            {title}
        </div>
    );
}

function MiniStatus({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-300/10 bg-slate-400/[0.035] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-1 truncate font-bold text-white">{value}</p>
        </div>
    );
}

function FocusRow({ label, value, tone = "blue" }) {
    const tones = {
        blue: "border-blue-300/14 bg-blue-400/[0.045] text-blue-200",
        green: "border-emerald-300/14 bg-emerald-400/[0.045] text-emerald-200",
        amber: "border-amber-300/14 bg-amber-400/[0.045] text-amber-200",
    };

    return (
        <div className={`rounded-xl border p-3 ${tones[tone] || tones.blue}`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-80">{label}</p>
            <p className="mt-1 font-black text-white">{value}</p>
        </div>
    );
}

function TimelineItem({ label, value, detail, icon }) {
    return (
        <div className="flex gap-3 rounded-xl border border-slate-300/10 bg-slate-400/[0.03] p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-blue-300/14 bg-blue-400/[0.045] text-blue-200">
                {createElement(icon, { className: "h-4 w-4" })}
            </div>
            <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
                <p className="mt-1 truncate font-bold text-white">{value}</p>
                {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
            </div>
        </div>
    );
}

function CompactMetric({ label, value, tone = "blue" }) {
    const colors = {
        blue: "border-blue-300/14 bg-blue-400/[0.045] text-blue-200",
        green: "border-emerald-300/14 bg-emerald-400/[0.045] text-emerald-200",
        amber: "border-amber-300/14 bg-amber-400/[0.045] text-amber-200",
        red: "border-red-300/14 bg-red-400/[0.045] text-red-200",
        slate: "border-slate-300/10 bg-slate-400/[0.035] text-slate-300",
    };

    return (
        <div className={`rounded-xl border p-3 ${colors[tone] || colors.blue}`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">{label}</p>
            <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>
    );
}

function ReadinessRow({ label, value }) {
    const tone = value >= 75 ? "text-emerald-200" : value >= 50 ? "text-amber-200" : "text-red-200";
    const status = value >= 75 ? "Stable" : value >= 50 ? "Improving" : "Exposed";

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-slate-200">{label}</span>
                <span className={`font-mono text-xs ${tone}`}>{value}% · {status}</span>
            </div>
            <PhishProgress value={value} max={100} />
        </div>
    );
}

function QuickAction({ to, icon, label }) {
    return (
        <Link
            to={to}
            className="flex items-center gap-3 rounded-xl border border-blue-300/14 bg-blue-400/[0.045] px-4 py-3 font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-blue-300/25 hover:bg-blue-400/[0.075] hover:text-white"
        >
            {createElement(icon, { className: "h-4 w-4 text-blue-200" })}
            {label}
        </Link>
    );
}

function SystemLine({ label, status, tone = "blue" }) {
    const colors = {
        green: "text-emerald-300",
        blue: "text-blue-300",
        amber: "text-amber-300",
        slate: "text-slate-300",
    };

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-300/10 bg-black/20 px-3 py-2">
            <span className="text-slate-400">&gt; {label}</span>
            <span className={colors[tone] || colors.blue}>[ {status} ]</span>
        </div>
    );
}

function getOperatorFocus(defenseProfile) {
    const phishing = defenseProfile.phishing;
    const soc = defenseProfile.soc;
    const security = defenseProfile.securityCheck;

    let specialization = "Generalist";
    if (phishing.accuracy >= 75 && phishing.total > 0) specialization = "Email Defense";
    if (soc.incidents >= 3 || phishing.socEscalations >= 2) specialization = "SOC Triage";
    if (security.weakAreas.some((area) => area.category === "MFA" || area.category === "Browser / SaaS")) {
        specialization = "Identity Defense";
    }
    if (phishing.weakCategories.some((category) => String(category).toLowerCase().includes("mitre"))) {
        specialization = "Threat Intel";
    }

    const categories = getSecurityCategoryScores(getSecurityCheckAnswers());
    const strongestCategory =
        categories.sort((a, b) => b.percent - a.percent)[0]?.category ||
        (phishing.accuracy >= 70 ? "Phishing" : "General defense");
    const weakestArea =
        defenseProfile.securityCheck.weakAreas[0]?.category ||
        defenseProfile.phishing.weakCategories[0] ||
        (soc.highSeverity > 0 ? "SOC containment" : "No major weak area");

    return {
        specialization,
        strongestCategory,
        weakestArea,
    };
}

function getRecentActivity({ phishingResults, socIncidents, securityAnswers, profile }) {
    const lastPhishing = phishingResults[phishingResults.length - 1];
    const lastIncident = socIncidents[socIncidents.length - 1];
    const answered = Object.keys(securityAnswers || {}).length;

    return [
        {
            label: "Last phishing scenario",
            value: lastPhishing?.scenarioTitle || lastPhishing?.title || "No scenario analyzed yet",
            detail: lastPhishing ? `Verdict: ${lastPhishing.verdict || "recorded"}` : "Start simulator to feed profile telemetry.",
            icon: MailCheck,
        },
        {
            label: "Last SOC incident",
            value: lastIncident?.title || lastIncident?.scenarioTitle || "No local incident yet",
            detail: lastIncident ? `Severity: ${lastIncident.severity || lastIncident.riskLevel || "unknown"}` : "Escalated simulator cases will appear here.",
            icon: Radio,
        },
        {
            label: "Security check",
            value: answered ? `${answered}/${securityCheckQuestions.length} answers recorded` : "Not completed yet",
            detail: answered === securityCheckQuestions.length ? "Diagnostic complete." : "Run Security Check to complete posture data.",
            icon: ClipboardCheck,
        },
        {
            label: "Streak",
            value: `${profile?.streak || profile?.currentStreak || 0} active calls`,
            detail: "Maintained through simulator progress.",
            icon: Activity,
        },
    ];
}

function getReadinessScores(defenseProfile, securityAnswers) {
    const categoryScores = getSecurityCategoryScores(securityAnswers);
    const byCategory = Object.fromEntries(categoryScores.map((item) => [item.category, item.percent]));

    return {
        email: Math.round((defenseProfile.phishing.accuracy + (byCategory.Phishing || 0)) / 2),
        mfa: byCategory.MFA || 0,
        device: byCategory["Device Security"] || 0,
        response: byCategory["Incident Response"] || 0,
        soc: Math.max(0, Math.min(100, 60 + defenseProfile.phishing.socEscalations * 10 - defenseProfile.soc.highSeverity * 5)),
    };
}

function getSecurityCategoryScores(answers) {
    const scores = securityCheckQuestions.reduce((acc, question) => {
        const current = acc[question.category] || {
            category: question.category,
            score: 0,
            maxScore: 0,
            percent: 0,
        };

        current.score += Number(answers?.[question.id]?.score) || 0;
        current.maxScore += 2;
        current.percent = current.maxScore ? Math.round((current.score / current.maxScore) * 100) : 0;
        acc[question.category] = current;
        return acc;
    }, {});

    return Object.values(scores);
}

function getBadgeRarity(badge) {
    if (badge.includes("perfect") || badge.includes("path_complete")) {
        return {
            label: "elite",
            className: "border-indigo-300/20 bg-indigo-400/[0.06] shadow-[0_0_24px_rgba(129,140,248,0.08)]",
        };
    }

    if (badge.includes("streak") || badge.includes("analyst")) {
        return {
            label: "rare",
            className: "border-blue-300/18 bg-blue-400/[0.055] shadow-[0_0_24px_rgba(96,165,250,0.07)]",
        };
    }

    return {
        label: "common",
        className: "border-slate-300/12 bg-slate-400/[0.035]",
    };
}

function profileTone(score) {
    if (score >= 85) return "green";
    if (score >= 70) return "blue";
    if (score >= 50) return "amber";
    return "red";
}

function formatDate(value) {
    if (!value) return "pending";
    return new Intl.DateTimeFormat("fr-FR").format(new Date(value));
}
