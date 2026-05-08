"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    AlertTriangle,
    CheckCircle2,
    Lock,
    MailWarning,
    Radar,
    RefreshCcw,
    ShieldCheck,
    UserCheck,
} from "lucide-react";
import { securityCheckQuestions } from "@/data/securityCheckQuestions";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import ProgressBar from "@dark/ui/components/ProgressBar";

function getRiskProfile(percent) {
    if (percent >= 80) {
        return {
            label: "Strong baseline",
            variant: "emerald",
            tone: "text-blue-200",
            message:
                "Your defensive habits are strong. Keep practicing phishing recognition and account protection.",
        };
    }

    if (percent >= 50) {
        return {
            label: "Moderate exposure",
            variant: "amber",
            tone: "text-amber-200",
            message:
                "You have a workable baseline, but several habits could reduce your exposure.",
        };
    }

    return {
        label: "High exposure",
        variant: "danger",
        tone: "text-red-200",
        message:
            "Your answers reveal multiple common risk areas. Start with MFA, password hygiene and phishing awareness.",
    };
}

function categoryIcon(category) {
    const lower = category.toLowerCase();

    if (lower.includes("phishing") || lower.includes("email")) return MailWarning;
    if (lower.includes("account") || lower.includes("password")) return Lock;
    if (lower.includes("identity") || lower.includes("mfa")) return UserCheck;

    return ShieldCheck;
}

export default function SecurityCheckPage() {
    const [answers, setAnswers] = useState({});

    const answeredCount = Object.keys(answers).length;
    const maxScore = securityCheckQuestions.length * 2;

    const score = useMemo(() => {
        return securityCheckQuestions.reduce((total, question) => {
            return total + (answers[question.id]?.score || 0);
        }, 0);
    }, [answers]);

    const percent = Math.round((score / maxScore) * 100);
    const isComplete = answeredCount === securityCheckQuestions.length;
    const riskProfile = getRiskProfile(percent);

    const weakAreas = securityCheckQuestions.filter((question) => {
        const answer = answers[question.id];
        return answer && answer.score < 2;
    });

    function handleAnswer(question, answer) {
        setAnswers((current) => ({
            ...current,
            [question.id]: answer,
        }));
    }

    function resetCheck() {
        setAnswers({});
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070A] px-5 py-8 text-slate-100">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.08),transparent_34%)]" />

            <section className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                    >
                        ← Back to Defend
                    </Link>
                </div>

                <PanelCard variant="darkNexusHero" accent="emerald" className="mb-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
                        <div>
                            <div className="mb-5 flex flex-wrap gap-2">
                                <AppBadge variant="emerald">DarkDefend</AppBadge>
                                <AppBadge variant="blue">Security Check</AppBadge>
                                <AppBadge variant={riskProfile.variant}>
                                    {isComplete ? riskProfile.label : "Assessment active"}
                                </AppBadge>
                            </div>

                            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-white md:text-7xl">
                                Measure your
                                <span className="block bg-gradient-to-b from-emerald-200 to-slate-400 bg-clip-text text-transparent">
                                    defense posture.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                                Answer practical security questions and receive a clear risk score,
                                weak areas and recommended defensive actions.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-emerald-300/20 bg-black/35 p-6">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-200">
                                posture.score
                            </p>

                            <p className={`mt-4 text-7xl font-black ${riskProfile.tone}`}>
                                {percent}%
                            </p>

                            <div className="mt-5">
                                <ProgressBar value={percent} className="h-3" />
                            </div>

                            <p className="mt-3 font-mono text-xs text-slate-500">
                                {answeredCount}/{securityCheckQuestions.length} answered
                            </p>
                        </div>
                    </div>
                </PanelCard>

                <section className="mb-8 grid gap-4 md:grid-cols-4">
                    <PostureStat icon={Radar} label="Score" value={`${percent}%`} />
                    <PostureStat icon={ShieldCheck} label="Status" value={riskProfile.label} />
                    <PostureStat icon={AlertTriangle} label="Weak areas" value={weakAreas.length} />
                    <PostureStat icon={CheckCircle2} label="Answered" value={`${answeredCount}/${securityCheckQuestions.length}`} />
                </section>

                <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
                    <div className="space-y-4">
                        {securityCheckQuestions.map((question, index) => {
                            const selectedAnswer = answers[question.id];
                            const Icon = categoryIcon(question.category);

                            return (
                                <PanelCard
                                    key={question.id}
                                    variant="darkNexus"
                                    accent={selectedAnswer ? "emerald" : "blue"}
                                    hover
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-emerald-300/20 bg-blue-400/[0.08] text-blue-200">
                                                <Icon size={22} />
                                            </div>

                                            <div>
                                                <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                                    Question {String(index + 1).padStart(2, "0")}
                                                </p>

                                                <h2 className="mt-2 text-xl font-black tracking-tight text-white">
                                                    {question.question}
                                                </h2>
                                            </div>
                                        </div>

                                        <AppBadge variant={selectedAnswer ? "emerald" : "default"}>
                                            {selectedAnswer ? "Answered" : question.category}
                                        </AppBadge>
                                    </div>

                                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                                        {question.answers.map((answer) => {
                                            const isSelected = selectedAnswer?.label === answer.label;

                                            return (
                                                <button
                                                    key={answer.label}
                                                    type="button"
                                                    onClick={() => handleAnswer(question, answer)}
                                                    className={[
                                                        "rounded-xl border p-4 text-left text-sm font-bold transition",
                                                        isSelected
                                                            ? "border-emerald-300/30 bg-blue-400/[0.08] text-emerald-100"
                                                            : "border-white/[0.07] bg-white/[0.035] text-slate-300 hover:border-blue-300/20 hover:bg-white/[0.055] hover:text-white",
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
                    </div>

                    <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
                        <PanelCard
                            variant="darkNexusHero"
                            accent={riskProfile.variant === "danger" ? "danger" : riskProfile.variant}
                        >
                            <AppBadge variant={riskProfile.variant}>
                                {isComplete ? riskProfile.label : "In progress"}
                            </AppBadge>

                            <h2 className="mt-4 text-5xl font-black text-white">
                                {percent}%
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                {isComplete
                                    ? riskProfile.message
                                    : "Complete the assessment to unlock recommendations."}
                            </p>

                            <div className="mt-5">
                                <ProgressBar value={percent} className="h-3" />
                            </div>

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

                        {isComplete && (
                            <PanelCard variant="darkNexus" accent="amber">
                                <AppBadge variant="amber">Recommendations</AppBadge>

                                <div className="mt-5 space-y-4">
                                    {(weakAreas.length > 0
                                        ? weakAreas
                                        : securityCheckQuestions.slice(0, 2)
                                    ).map((question) => (
                                        <div
                                            key={question.id}
                                            className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4"
                                        >
                                            <p className="font-bold text-white">
                                                {question.category}
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                                {question.recommendation}
                                            </p>

                                            <Link
                                                href={`/lessons/${question.lessonId}`}
                                                className="mt-3 inline-flex font-mono text-xs font-bold text-blue-300 transition hover:text-blue-200"
                                            >
                                                Learn this →
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </PanelCard>
                        )}

                        <PanelCard variant="darkNexus" accent="blue">
                            <AppBadge variant="blue">Defense loop</AppBadge>

                            <p className="mt-4 text-sm leading-6 text-slate-400">
                                Use this score to decide what to practice next:
                                phishing recognition, account protection, MFA habits or suspicious login response.
                            </p>

                            <div className="mt-5 grid gap-3">
                                <AppButton href="/phishing" variant="primary">
                                    Practice phishing defense →
                                </AppButton>

                                <AppButton href="/soc" variant="secondary">
                                    Open SOC mode →
                                </AppButton>
                            </div>
                        </PanelCard>
                    </aside>
                </section>
            </section>
        </main>
    );
}

function PostureStat({ icon: Icon, label, value }) {
    return (
        <PanelCard variant="darkNexus" accent="emerald">
            <Icon className="mb-3 text-blue-200" size={20} />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-xl font-black text-white">{value}</p>
        </PanelCard>
    );
}