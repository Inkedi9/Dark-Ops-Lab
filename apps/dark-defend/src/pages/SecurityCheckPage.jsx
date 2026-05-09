"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    AlertTriangle,
    CheckCircle2,
    ClipboardCheck,
    KeyRound,
    Lock,
    MailWarning,
    Radar,
    RefreshCcw,
    ShieldCheck,
} from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import ProgressBar from "@dark/ui/components/ProgressBar";
import { securityCheckQuestions } from "@/data/securityCheckQuestions";
import EmptyState from "@/components/shared/EmptyState";
import SectionHeader from "@/components/shared/SectionHeader";
import { compactSpacing } from "@/lib/defend/uiTokens";

const STORAGE_KEY = "darkdefend-security-check";

const categoryIcons = {
    Passwords: KeyRound,
    MFA: Lock,
    Phishing: MailWarning,
    "Device Security": ShieldCheck,
    "Browser / SaaS": Radar,
    "Data Handling": ClipboardCheck,
    "Incident Response": AlertTriangle,
};

function safeLoadAnswers() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return {};
        const parsed = JSON.parse(stored);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? parsed
            : {};
    } catch {
        return {};
    }
}

function answerScore(answer) {
    return Number(answer?.score) || 0;
}

function getRiskProfile(percent) {
    if (percent >= 85) {
        return {
            label: "Strong baseline",
            variant: "emerald",
            tone: "text-emerald-200",
            message: "Your defensive habits are strong across identity, devices, phishing, and response readiness.",
        };
    }

    if (percent >= 65) {
        return {
            label: "Improving posture",
            variant: "blue",
            tone: "text-blue-200",
            message: "You have a solid base. Tighten the weak areas to reduce avoidable exposure.",
        };
    }

    if (percent >= 45) {
        return {
            label: "Moderate risk",
            variant: "amber",
            tone: "text-amber-200",
            message: "Several habits need attention. Start with MFA, passwords, reporting, and update hygiene.",
        };
    }

    return {
        label: "High risk",
        variant: "danger",
        tone: "text-red-200",
        message: "Your answers show meaningful exposure. Focus on the highest-impact basics first.",
    };
}

function getCategoryScores(answers) {
    const categories = securityCheckQuestions.reduce((acc, question) => {
        const current = acc[question.category] || {
            category: question.category,
            answered: 0,
            total: 0,
            score: 0,
            maxScore: 0,
            percent: 0,
        };

        const selected = answers[question.id];
        current.total += 1;
        current.maxScore += 2;

        if (selected) {
            current.answered += 1;
            current.score += answerScore(selected);
        }

        current.percent = current.maxScore
            ? Math.round((current.score / current.maxScore) * 100)
            : 0;

        acc[question.category] = current;
        return acc;
    }, {});

    return Object.values(categories);
}

function getWeakAreas(categoryScores) {
    return categoryScores
        .filter((category) => category.answered > 0 && category.percent < 70)
        .sort((a, b) => a.percent - b.percent);
}

function getRecommendations(answers) {
    const weakAnswers = securityCheckQuestions
        .map((question) => ({
            question,
            answer: answers[question.id],
        }))
        .filter((item) => item.answer && answerScore(item.answer) < 2)
        .sort((a, b) => answerScore(a.answer) - answerScore(b.answer));

    const recommendations = weakAnswers.map((item) => ({
        id: item.question.id,
        category: item.question.category,
        text: item.answer.recommendation,
        risk: item.answer.risk,
    }));

    if (recommendations.length === 0) {
        return [
            {
                id: "maintain-baseline",
                category: "Baseline",
                risk: "low",
                text: "Maintain unique passwords, phishing-resistant MFA where possible, prompt updates, and fast reporting habits.",
            },
        ];
    }

    return recommendations.slice(0, 5);
}

function riskVariant(risk) {
    if (risk === "high") return "danger";
    if (risk === "medium") return "amber";
    return "emerald";
}

export default function SecurityCheckPage() {
    const spacing = compactSpacing(true);
    const [answers, setAnswers] = useState(() => safeLoadAnswers());

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
        } catch {
            // Ignore storage failures; the check still works in-memory.
        }
    }, [answers]);

    const answeredCount = Object.keys(answers).length;
    const maxScore = securityCheckQuestions.length * 2;
    const score = securityCheckQuestions.reduce(
        (total, question) => total + answerScore(answers[question.id]),
        0
    );
    const percent = maxScore ? Math.round((score / maxScore) * 100) : 0;
    const isComplete = answeredCount === securityCheckQuestions.length;

    const categoryScores = useMemo(() => getCategoryScores(answers), [answers]);
    const weakAreas = useMemo(() => getWeakAreas(categoryScores), [categoryScores]);
    const recommendations = useMemo(() => getRecommendations(answers), [answers]);
    const riskProfile = getRiskProfile(percent);

    function handleAnswer(question, answer) {
        setAnswers((current) => ({
            ...current,
            [question.id]: answer,
        }));
    }

    function resetCheck() {
        if (!window.confirm("Reset your Security Check answers?")) return;
        setAnswers({});
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070A] px-5 py-8 text-slate-100">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_32%)]" />

            <section className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <Link to="/">
                        <AppButton variant="secondary">Back Home</AppButton>
                    </Link>
                    <div className="flex flex-wrap gap-2">
                        <AppBadge variant={riskProfile.variant}>{riskProfile.label}</AppBadge>
                        <AppBadge variant="blue">{answeredCount}/{securityCheckQuestions.length} answered</AppBadge>
                    </div>
                </div>

                <SectionHeader
                    eyebrow="Security Check"
                    title="Measure your defense posture"
                    description="Assess passwords, MFA, phishing habits, device hygiene and response readiness."
                    actions={
                        <AppBadge variant="blue">
                            local diagnostic
                        </AppBadge>
                    }
                />

                <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
                    <div className={spacing.stack}>
                        {securityCheckQuestions.map((question, index) => {
                            const selectedAnswer = answers[question.id];
                            const Icon = categoryIcons[question.category] || ShieldCheck;

                            return (
                                <PanelCard
                                    key={question.id}
                                    variant="darkNexus"
                                    accent={selectedAnswer ? riskVariant(selectedAnswer.risk) : "blue"}
                                    hover
                                    className="p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex min-w-0 gap-3">
                                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-blue-300/18 bg-blue-400/[0.055] text-blue-200">
                                                <Icon size={20} />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="mb-2 flex flex-wrap gap-2">
                                                    <AppBadge variant="blue">{question.category}</AppBadge>
                                                    <AppBadge variant="default">{question.impact}</AppBadge>
                                                </div>
                                                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                                    Question {String(index + 1).padStart(2, "0")}
                                                </p>
                                                <h2 className="mt-2 text-lg font-black text-white">
                                                    {question.question}
                                                </h2>
                                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                                    {question.description}
                                                </p>
                                            </div>
                                        </div>

                                        {selectedAnswer && (
                                            <AppBadge variant={riskVariant(selectedAnswer.risk)}>
                                                {selectedAnswer.risk} risk
                                            </AppBadge>
                                        )}
                                    </div>

                                    <div className="mt-4 grid gap-2 md:grid-cols-3">
                                        {question.answers.map((answer) => {
                                            const selected = selectedAnswer?.label === answer.label;

                                            return (
                                                <button
                                                    key={answer.label}
                                                    type="button"
                                                    onClick={() => handleAnswer(question, answer)}
                                                    className={[
                                                        "rounded-xl border px-3 py-3 text-left text-sm font-bold transition",
                                                        selected
                                                            ? "border-blue-300/35 bg-blue-400/[0.10] text-blue-100 shadow-[0_0_24px_rgba(96,165,250,0.08)]"
                                                            : "border-slate-300/10 bg-slate-400/[0.035] text-slate-300 hover:border-blue-300/20 hover:bg-blue-400/[0.055] hover:text-white",
                                                    ].join(" ")}
                                                >
                                                    {answer.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </PanelCard>
                            );
                        })}

                        {isComplete && (
                            <PanelCard variant="darkNexusHero" accent="emerald" className="p-5">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <AppBadge variant="emerald">Defense Profile unlocked</AppBadge>
                                        <h2 className="mt-3 text-2xl font-black text-white">
                                            Your diagnostic is ready to consolidate.
                                        </h2>
                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            Send these results into your broader human-layer profile with phishing and SOC telemetry.
                                        </p>
                                    </div>
                                    <Link to="/defense-profile">
                                        <AppButton variant="primary">View Defense Profile</AppButton>
                                    </Link>
                                </div>
                            </PanelCard>
                        )}
                    </div>

                    <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
                        <PanelCard variant="darkNexusHero" accent={riskProfile.variant} className="p-5">
                            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                                posture.score
                            </p>
                            <p className={`mt-3 text-6xl font-black ${riskProfile.tone}`}>
                                {percent}%
                            </p>
                            <div className="mt-4">
                                <ProgressBar value={percent} className="h-3" />
                            </div>
                            <p className="mt-3 font-bold text-white">{riskProfile.label}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-400">{riskProfile.message}</p>

                            <AppButton
                                type="button"
                                onClick={resetCheck}
                                variant="secondary"
                                className="mt-5 w-full"
                            >
                                <RefreshCcw size={16} />
                                Reset check
                            </AppButton>
                        </PanelCard>

                        <PanelCard variant="darkNexus" accent="blue" className="p-4">
                            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-200">
                                Category scores
                            </p>
                            <div className="space-y-3">
                                {categoryScores.map((category) => (
                                    <ScoreRow key={category.category} category={category} />
                                ))}
                            </div>
                        </PanelCard>

                        <PanelCard variant="darkNexus" accent={weakAreas.length ? "amber" : "emerald"} className="p-4">
                            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-amber-200">
                                Weak areas
                            </p>
                            {weakAreas.length ? (
                                <div className="space-y-2">
                                    {weakAreas.map((area) => (
                                        <div
                                            key={area.category}
                                            className="rounded-xl border border-amber-300/14 bg-amber-400/[0.045] px-3 py-2"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="font-bold text-white">{area.category}</span>
                                                <span className="font-mono text-xs text-amber-200">{area.percent}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={CheckCircle2}
                                    title={answeredCount ? "No weak areas yet" : "Answer questions to reveal weak areas"}
                                    description="Categories below 70% will appear here."
                                />
                            )}
                        </PanelCard>

                        <PanelCard variant="darkNexus" accent="violet" className="p-4">
                            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-indigo-200">
                                Recommendations
                            </p>
                            <div className="space-y-3">
                                {recommendations.map((recommendation) => (
                                    <div
                                        key={recommendation.id}
                                        className="rounded-xl border border-indigo-300/12 bg-indigo-400/[0.045] p-3"
                                    >
                                        <AppBadge variant={riskVariant(recommendation.risk)}>
                                            {recommendation.category}
                                        </AppBadge>
                                        <p className="mt-2 text-sm leading-6 text-slate-300">
                                            {recommendation.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </PanelCard>

                        <PanelCard variant="darkNexus" accent="blue" className="p-4">
                            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-200">
                                Next actions
                            </p>
                            <div className="grid gap-3">
                                <Link to="/simulator">
                                    <AppButton variant="primary" className="w-full">Practice phishing</AppButton>
                                </Link>
                                <Link to="/soc">
                                    <AppButton variant="secondary" className="w-full">Open SOC</AppButton>
                                </Link>
                                <Link to="/defense-profile">
                                    <AppButton variant="secondary" className="w-full">View Defense Profile</AppButton>
                                </Link>
                            </div>
                        </PanelCard>
                    </aside>
                </section>
            </section>
        </main>
    );
}

function ScoreRow({ category }) {
    const variant = category.percent >= 70 ? "emerald" : category.percent >= 45 ? "amber" : "danger";

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-slate-200">{category.category}</span>
                <span className="font-mono text-xs text-slate-400">
                    {category.percent}% · {category.answered}/{category.total}
                </span>
            </div>
            <ProgressBar value={category.percent} className="h-2" />
            <div className="mt-2">
                <AppBadge variant={variant}>{category.percent >= 70 ? "stable" : "needs work"}</AppBadge>
            </div>
        </div>
    );
}
