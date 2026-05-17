"use client";

import { createElement, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/defend/components/Header";
import InboxList from "@/defend/components/InboxList";
import EmailViewer from "@/defend/components/EmailViewer";
import AnalysisPanel from "@/defend/components/AnalysisPanel";
import ScoreSummary from "@/defend/components/ScoreSummary";
import { phishingPath, scenarios } from "@/defend/data/scenarios";
import { calculateEmailScore } from "@/defend/utils/scoring";
import {
    ArrowRight,
    Clock,
    Crosshair,
    Flame,
    MailCheck,
    Radio,
    RotateCcw,
    ShieldAlert,
    Trash2,
    Trophy,
    FileSearch,
} from "lucide-react";
import { PhishPanel } from "@/defend/components/ui/PhishPanel";
import { PhishHeader } from "@/defend/components/ui/PhishHeader";
import { PhishBadge } from "@/defend/components/ui/PhishBadge";
import { PhishButton } from "@/defend/components/ui/PhishButton";
import { PhishProgress } from "@/defend/components/ui/PhishProgress";
import { getDarkProfile, recordDefendScenario } from "@/defend/lib/defend/defendProgressService";
import { createIncidentFromScenario } from "@/defend/lib/defend/incidentService";
import { PhishCard } from "@/defend/components/ui/PhishCard";

type Scenario = (typeof scenarios)[number];
type PhishingPath = (typeof phishingPath)[number];
type DarkProfile = { rank: string; level: number | string; xp: number | string };

const SLA_INITIAL_SECONDS = 180;
const MODES = ["beginner", "analyst"];

const INBOX_FILTERS = [
    ["all", "All"],
    ["open", "Open"],
    ["completed", "Done"],
    ["high-risk", "High risk"],
    ["attachments", "Files"],
    ["links", "Links"],
];

function safeParseArray(key: string) {
    try {
        const stored = localStorage.getItem(key);
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function safeParseNumber(key: string, fallback = 0) {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
}

export default function Simulator() {
    const [selectedEmail, setSelectedEmail] = useState(scenarios[0]);
    const [verdict, setVerdict] = useState("");
    const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
    const [currentResult, setCurrentResult] = useState<Record<string, unknown> | null>(null);
    const [profile, setProfile] = useState<DarkProfile | null>(null);
    const [lastXpAwarded, setLastXpAwarded] = useState(0);
    const [mode, setMode] = useState(() => localStorage.getItem("darkdefend-mode") || "beginner");
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(() =>
        safeParseNumber("darkdefend-best-streak", 0)
    );
    const [results, setResults] = useState(() =>
        safeParseArray("phishscope-results")
    );
    const [inboxFilter, setInboxFilter] = useState("all");
    const [confidence, setConfidence] = useState("medium");
    const [analystReasoning, setAnalystReasoning] = useState("");
    const [slaSeconds, setSlaSeconds] = useState(SLA_INITIAL_SECONDS);
    const [escalateToSoc, setEscalateToSoc] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const completedIds = useMemo(() => results.map((r) => r.scenarioId), [results]);
    const selectedCompleted = completedIds.includes(selectedEmail?.id);
    const selectedPath = phishingPath.find((path) => path.id === selectedEmail?.pathId);
    const selectedIndex = scenarios.findIndex((scenario) => scenario.id === selectedEmail?.id);
    const riskTone = selectedEmail?.riskLevel === "Critical" || selectedEmail?.riskLevel === "High" ? "red" : "blue";
    const pathProgress = useMemo(
        () =>
            phishingPath.map((path) => {
                const pathScenarios = scenarios.filter((scenario) => scenario.pathId === path.id);
                const completed = pathScenarios.filter((scenario) => completedIds.includes(scenario.id)).length;
                return { ...path, completed, total: pathScenarios.length };
            }),
        [completedIds]
    );

    const filteredEmails = useMemo(() => {
        return scenarios.filter((email) => {
            const completed = completedIds.includes(email.id);
            const highRisk = email.riskLevel === "High" || email.riskLevel === "Critical";
            const hasAttachment = Boolean(email.attachment);
            const hasLink = Boolean(email.linkUrl);

            if (inboxFilter === "open") return !completed;
            if (inboxFilter === "completed") return completed;
            if (inboxFilter === "high-risk") return highRisk;
            if (inboxFilter === "attachments") return hasAttachment;
            if (inboxFilter === "links") return hasLink;
            return true;
        });
    }, [completedIds, inboxFilter]);

    const isSimulationComplete = results.length === scenarios.length;

    function resetAnalysisState() {
        setVerdict("");
        setSelectedFlags([]);
        setCurrentResult(null);
        setLastXpAwarded(0);
        setConfidence("medium");
        setAnalystReasoning("");
        setSlaSeconds(SLA_INITIAL_SECONDS);
        setEscalateToSoc(false);
        setSubmitError("");
    }

    const goToNextEmail = (currentEmailId: number | undefined) => {
        const currentIndex = scenarios.findIndex((email) => email.id === currentEmailId);
        const nextEmail = scenarios[currentIndex + 1];
        if (nextEmail) {
            setSelectedEmail(nextEmail);
            resetAnalysisState();
        }
    };

    const handleSubmit = async () => {
        if (!selectedEmail || !verdict || isSubmitting) return;
        const alreadyDone = completedIds.includes(selectedEmail.id);
        if (alreadyDone) return;

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const scoreData = calculateEmailScore(selectedEmail, verdict, selectedFlags, mode);
            const generatedIncident = createIncidentFromScenario({
                email: selectedEmail,
                result: scoreData,
                mode,
                forced: escalateToSoc,
            });
            const nextStreak = scoreData.isCorrect ? streak + 1 : 0;
            const nextBestStreak = Math.max(bestStreak, nextStreak);

            const resultEntry = {
                scenarioId: selectedEmail.id,
                verdict,
                expectedType: selectedEmail.type,
                score: scoreData.score,
                isCorrect: scoreData.isCorrect,
                matchedFlags: scoreData.matchedFlags,
                missedFlags: scoreData.missedFlags,
                mode,
                confidence,
                analystReasoning,
                incidentId: generatedIncident?.id || null,
                escalatedToSoc: Boolean(generatedIncident),
            };

            const updatedResults = [...results, resultEntry];
            const defendProgress = await recordDefendScenario({
                scenarioId: selectedEmail.id,
                result: scoreData,
                totalScenarios: scenarios.length,
                mode,
                streak: nextStreak,
            });

            setCurrentResult({ ...scoreData, incidentId: generatedIncident?.id || null });
            setProfile(defendProgress.profile);
            setLastXpAwarded(defendProgress.xpAwarded);
            setStreak(nextStreak);
            setBestStreak(nextBestStreak);
            localStorage.setItem("darkdefend-best-streak", String(nextBestStreak));
            setResults(updatedResults);
            localStorage.setItem("phishscope-results", JSON.stringify(updatedResults));
        } catch (error) {
            console.error("Unable to submit phishing analysis", error);
            setSubmitError("Unable to submit analysis. Please retry.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelect = (email: Scenario) => {
        setSelectedEmail(email);
        resetAnalysisState();
    };

    const handleRestartSession = () => {
        if (!window.confirm("Restart this session and clear current phishing results?")) return;
        localStorage.removeItem("phishscope-results");
        setResults([]);
        setSelectedEmail(scenarios[0]);
        setStreak(0);
        resetAnalysisState();
    };

    useEffect(() => {
        getDarkProfile().then(setProfile);
    }, []);

    function resetPhishScopeEnvironment() {
        if (!window.confirm("Reset the phishing lab and clear current results?")) return;
        localStorage.removeItem("phishscope-results");
        setResults([]);
        setSelectedEmail(scenarios[0]);
        setStreak(0);
        resetAnalysisState();
    }

    const handleModeChange = (nextMode: string) => {
        setMode(nextMode);
        localStorage.setItem("darkdefend-mode", nextMode);
    };

    useEffect(() => {
        if (selectedCompleted) return;
        const timer = window.setInterval(() => {
            setSlaSeconds((current) => Math.max(0, current - 1));
        }, 1000);
        return () => window.clearInterval(timer);
    }, [selectedEmail?.id, selectedCompleted]);

    return (
        <>
            <Header />

            <div>
                <main className="relative z-10 w-full px-4 py-8 md:px-8">
                    <PhishHeader
                        eyebrow="Email Threat Lab"
                        title="Phishing Simulator"
                        description="Analyze suspicious emails, identify red flags and classify human-layer threats with analyst-grade feedback."
                    >
                        <PhishBadge tone="blue">{results.length}/{scenarios.length} analyzed</PhishBadge>
                        <PhishBadge tone={isSimulationComplete ? "green" : "slate"}>
                            {isSimulationComplete ? "Complete" : "In Progress"}
                        </PhishBadge>
                        <PhishBadge tone="amber">
                            {scenarios.length - results.length} Remaining
                        </PhishBadge>
                        {profile && (
                            <PhishBadge tone="green">
                                LVL {profile.level} • {profile.xp} XP
                            </PhishBadge>
                        )}
                    </PhishHeader>

                    <div className="mt-6 space-y-4">
                        <SimulatorActionBar
                            selectedEmail={selectedEmail}
                            resultsCount={results.length}
                            onNext={() => goToNextEmail(selectedEmail?.id)}
                            onResetLab={resetPhishScopeEnvironment}
                            onRestartSession={handleRestartSession}
                            mode={mode}
                            onModeChange={handleModeChange}
                            streak={streak}
                            bestStreak={bestStreak}
                        />

                        <PhishPanel variant="card">
                            <PhishProgress value={results.length} max={scenarios.length} />
                        </PhishPanel>

                        <MissionBriefing
                            selectedEmail={selectedEmail}
                            selectedPath={selectedPath}
                            selectedIndex={selectedIndex}
                            completedCount={results.length}
                            totalCount={scenarios.length}
                            riskTone={riskTone}
                            mode={mode}
                            streak={streak}
                        />

                        <PhishPanel variant="card">
                            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
                                        Phishing Defense Path
                                    </p>
                                    <h2 className="mt-2 text-xl font-black text-white">
                                        Beginner route: learn by inspecting real inbox patterns
                                    </h2>
                                </div>
                                {selectedPath && (
                                    <PhishBadge tone="green">Current: {selectedPath.label}</PhishBadge>
                                )}
                            </div>

                            <div className="grid gap-3 md:grid-cols-5">
                                {pathProgress.map((path) => (
                                    <button
                                        key={path.id}
                                        type="button"
                                        onClick={() => {
                                            const nextScenario =
                                                scenarios.find(
                                                    (scenario) =>
                                                        scenario.pathId === path.id &&
                                                        !completedIds.includes(scenario.id)
                                                ) || scenarios.find((scenario) => scenario.pathId === path.id);
                                            if (nextScenario) handleSelect(nextScenario);
                                        }}
                                        className={`rounded-2xl border p-4 text-left transition ${selectedEmail?.pathId === path.id
                                            ? "border-blue-300/35 bg-blue-400/[0.08]"
                                            : "border-blue-400/12 bg-black/25 hover:border-blue-300/25 hover:bg-blue-400/[0.035]"
                                            }`}
                                    >
                                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-300">
                                            {path.label}
                                        </p>
                                        <h3 className="mt-2 font-bold text-white">{path.title}</h3>
                                        <p className="mt-2 text-xs leading-5 text-slate-400">{path.goal}</p>
                                        <div className="mt-4 h-2 overflow-hidden rounded-full border border-blue-300/10 bg-[#060b11]">
                                            <div
                                                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,.72),rgba(45,212,191,.58))] transition-all duration-500"
                                                style={{ width: `${Math.round((path.completed / path.total) * 100)}%` }}
                                            />
                                        </div>
                                        <p className="mt-2 font-mono text-xs text-slate-500">
                                            {path.completed}/{path.total} complete
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </PhishPanel>

                        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1.35fr)_380px]">
                            <div className="min-h-0">
                                <PhishPanel
                                    variant="card"
                                    className="flex h-[1080px] min-h-0 flex-col overflow-hidden p-5 [&>div.relative]:flex [&>div.relative]:h-full [&>div.relative]:min-h-0 [&>div.relative]:flex-col"
                                >
                                    <div className="mb-4 flex shrink-0 items-center justify-between">
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
                                                Inbox Queue
                                            </p>
                                            <h2 className="mt-2 text-xl font-black text-white">Email Samples</h2>
                                        </div>
                                        <PhishBadge tone="slate">{filteredEmails.length} visible</PhishBadge>
                                    </div>

                                    <div className="mb-4 flex shrink-0 flex-wrap gap-2">
                                        {INBOX_FILTERS.map(([value, label]) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setInboxFilter(value)}
                                                className={[
                                                    "rounded-lg border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition",
                                                    inboxFilter === value
                                                        ? "border-blue-300/25 bg-blue-400/[0.10] text-blue-100"
                                                        : "border-white/[0.07] bg-white/[0.025] text-slate-500 hover:text-blue-200",
                                                ].join(" ")}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mb-4 grid grid-cols-3 gap-2">
                                        <InboxMiniStat
                                            label="Priority"
                                            value={filteredEmails.filter((email) => (email as Record<string, unknown>).mailbox === "Priority").length}
                                            tone="red"
                                        />
                                        <InboxMiniStat
                                            label="Open"
                                            value={filteredEmails.filter((email) => !completedIds.includes(email.id)).length}
                                            tone="blue"
                                        />
                                        <InboxMiniStat
                                            label="Done"
                                            value={filteredEmails.filter((email) => completedIds.includes(email.id)).length}
                                            tone="green"
                                        />
                                    </div>

                                    <div className="mb-4 grid gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextOpen = filteredEmails.find(
                                                    (email) => !completedIds.includes(email.id)
                                                );
                                                if (nextOpen) handleSelect(nextOpen);
                                            }}
                                            className="rounded-xl border border-blue-300/15 bg-blue-400/[0.055] px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-[0.18em] text-blue-200 transition hover:border-blue-300/25 hover:bg-blue-400/[0.08]"
                                        >
                                            Open next unresolved →
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInboxFilter("high-risk")}
                                            className="rounded-xl border border-red-300/15 bg-red-400/[0.045] px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-[0.18em] text-red-200 transition hover:border-red-300/25 hover:bg-red-400/[0.075]"
                                        >
                                            Focus high-risk queue →
                                        </button>
                                    </div>

                                    <div className="min-h-0 flex-1 overflow-y-scroll pr-3 phish-scroll [scrollbar-gutter:stable]">
                                        <InboxList
                                            emails={filteredEmails}
                                            selectedEmail={selectedEmail}
                                            onSelect={handleSelect}
                                            completedIds={completedIds}
                                            groupByMailbox
                                        />
                                    </div>
                                </PhishPanel>
                            </div>

                            <div className="min-w-0 space-y-4">
                                <PhishPanel variant="card">
                                    <EmailViewer email={selectedEmail} mode={mode} />
                                </PhishPanel>

                                {completedIds.includes(selectedEmail?.id) && !currentResult && (
                                    <PhishPanel variant="success">
                                        <p className="text-sm text-slate-200">
                                            This email has already been analyzed in the current session.
                                        </p>
                                    </PhishPanel>
                                )}

                                <ScoreSummary
                                    result={currentResult}
                                    email={selectedEmail}
                                    xpAwarded={lastXpAwarded}
                                    onNext={() => goToNextEmail(selectedEmail?.id)}
                                    isLastEmail={scenarios[scenarios.length - 1]?.id === selectedEmail?.id}
                                />
                            </div>

                            <div className="sticky top-4 space-y-4 self-start">
                                <ThreatIntelPanel
                                    email={selectedEmail}
                                    selectedPath={selectedPath}
                                    mode={mode}
                                    slaSeconds={slaSeconds}
                                />

                                <PhishPanel variant="card">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-xl border border-blue-400/25 bg-blue-400/10 p-3 text-blue-300">
                                            <MailCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
                                                Analysis Panel
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                Classify the email and validate red flags.
                                            </p>
                                        </div>
                                    </div>

                                    {submitError && (
                                        <div className="mb-4 rounded-xl border border-red-300/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-100">
                                            {submitError}
                                        </div>
                                    )}

                                    <AnalysisPanel
                                        email={selectedEmail}
                                        mode={mode}
                                        verdict={verdict}
                                        setVerdict={setVerdict}
                                        selectedFlags={selectedFlags}
                                        setSelectedFlags={setSelectedFlags}
                                        confidence={confidence}
                                        setConfidence={setConfidence}
                                        analystReasoning={analystReasoning}
                                        setAnalystReasoning={setAnalystReasoning}
                                        escalateToSoc={escalateToSoc}
                                        setEscalateToSoc={setEscalateToSoc}
                                        onSubmit={handleSubmit}
                                        disabled={selectedCompleted || isSubmitting}
                                    />
                                </PhishPanel>
                            </div>
                        </div>

                        {isSimulationComplete && (
                            <PhishPanel variant="success">
                                <h2 className="text-xl font-bold text-emerald-300">Simulation Complete</h2>
                                <p className="mt-2 text-sm leading-7 text-slate-200">
                                    All emails have been analyzed. Review the final debrief, then open your results dashboard.
                                </p>
                                <Link href="/defend/results" className="mt-4 inline-flex">
                                    <PhishButton tone="solid">
                                        <Trophy className="h-4 w-4" />
                                        Open Results
                                    </PhishButton>
                                </Link>
                            </PhishPanel>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

function SimulatorActionBar({
    selectedEmail,
    resultsCount,
    onNext,
    onResetLab,
    onRestartSession,
    mode,
    onModeChange,
    streak,
    bestStreak,
}: {
    selectedEmail: Scenario;
    resultsCount: number;
    onNext: () => void;
    onResetLab: () => void;
    onRestartSession: () => void;
    mode: string;
    onModeChange: (mode: string) => void;
    streak: number;
    bestStreak: number;
}) {
    const isLastEmail = scenarios[scenarios.length - 1]?.id === selectedEmail?.id;

    return (
        <PhishPanel className="sticky top-[96px] z-30 p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <PhishBadge tone="blue">Action Dock</PhishBadge>
                    <PhishBadge tone={streak > 0 ? "green" : "slate"}>
                        <span className="inline-flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            Streak {streak} • Best {bestStreak}
                        </span>
                    </PhishBadge>
                    <span className="font-mono text-xs text-slate-400">
                        {resultsCount > 0
                            ? `${resultsCount} artifact${resultsCount > 1 ? "s" : ""} analyzed`
                            : "Analyze one artifact to unlock results"}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex rounded-xl border border-blue-400/20 bg-black/30 p-1">
                        {MODES.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onModeChange(option)}
                                className={`rounded-lg px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] transition ${mode === option
                                    ? "bg-blue-400/15 text-blue-200"
                                    : "text-slate-500 hover:text-blue-200"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <PhishButton
                        tone="slate"
                        onClick={onNext}
                        disabled={!selectedEmail || isLastEmail}
                        className="disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next Email
                        <ArrowRight className="h-4 w-4" />
                    </PhishButton>

                    {resultsCount === 0 ? (
                        <PhishButton tone="slate" disabled className="cursor-not-allowed opacity-50">
                            View Results
                        </PhishButton>
                    ) : (
                        <Link href="/defend/results">
                            <PhishButton tone="solid">
                                View Results
                                <ArrowRight className="h-4 w-4" />
                            </PhishButton>
                        </Link>
                    )}

                    <Link href="/defend/soc">
                        <PhishButton tone="slate">
                            Open SOC
                            <ArrowRight className="h-4 w-4" />
                        </PhishButton>
                    </Link>

                    <PhishButton tone="slate" onClick={onRestartSession}>
                        <RotateCcw className="h-4 w-4" />
                        Restart
                    </PhishButton>

                    <PhishButton tone="danger" onClick={onResetLab}>
                        <Trash2 className="h-4 w-4" />
                        Reset
                    </PhishButton>
                </div>
            </div>
        </PhishPanel>
    );
}

function MissionBriefing({
    selectedEmail,
    selectedPath,
    selectedIndex,
    completedCount,
    totalCount,
    riskTone,
    mode,
    streak,
}: {
    selectedEmail: Scenario;
    selectedPath: PhishingPath | undefined;
    selectedIndex: number;
    completedCount: number;
    totalCount: number;
    riskTone: string;
    mode: string;
    streak: number;
}) {
    const briefingText =
        mode === "analyst"
            ? "Analyst mode hides obvious guidance. Inspect sender context, message intent, authentication traces and business logic before classification."
            : "Beginner mode highlights the defensive workflow. Inspect sender, links, attachments and intent before choosing a verdict.";

    return (
        <PhishPanel variant="glow" className="p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-center">
                <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <PhishBadge tone="blue">Mission {String(selectedIndex + 1).padStart(2, "0")}</PhishBadge>
                        <PhishBadge tone={riskTone}>{selectedEmail?.riskLevel || "Unknown"} Risk</PhishBadge>
                        {selectedPath && <PhishBadge tone="slate">{selectedPath.title}</PhishBadge>}
                        <PhishBadge tone={mode === "analyst" ? "amber" : "green"}>
                            {mode === "analyst" ? "Analyst Mode" : "Beginner Mode"}
                        </PhishBadge>
                    </div>
                    <h2 className="text-2xl font-black text-white">
                        Triage inbox artifact: {selectedEmail?.subject}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{briefingText}</p>
                </div>

                <div className="rounded-2xl border border-blue-400/15 bg-black/30 p-4 font-mono text-sm leading-7">
                    <p className="text-green-300">&gt; CASE QUEUE SYNC......... [ OK ]</p>
                    <p className="text-blue-300">&gt; ARTIFACT #{selectedIndex + 1}/{totalCount}</p>
                    <p className="text-slate-300">&gt; COMPLETED............... {completedCount}</p>
                    <p className="text-amber-300">&gt; OPERATOR MODE.......... {mode.toUpperCase()}</p>
                    <p className="text-green-300">&gt; CURRENT STREAK......... {streak}</p>
                </div>
            </div>
        </PhishPanel>
    );
}

function ThreatIntelPanel({ email, selectedPath, mode, slaSeconds }: { email: Scenario; selectedPath: PhishingPath | undefined; mode: string; slaSeconds: number }) {
    const hasLink = Boolean(email?.linkUrl);
    const hasAttachment = Boolean(email?.attachment);
    const signals = [
        {
            label: "Sender scope",
            value: email?.badge === "Internal" ? "Internal" : "External",
            tone: email?.badge === "Internal" ? "green" : "amber",
        },
        {
            label: "Link present",
            value: mode === "analyst" ? "Inspect manually" : hasLink ? "Yes" : "No",
            tone: hasLink ? "text-amber-300" : "text-slate-300",
        },
        {
            label: "Attachment",
            value: hasAttachment ? email.attachment : "None",
            tone: hasAttachment ? "text-red-300" : "text-slate-300",
        },
    ];

    return (
        <PhishPanel variant="card">
            <div className="mb-4 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-400/25 bg-blue-400/10 text-blue-300">
                    <Radio className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">Threat Intel</p>
                    <p className="text-sm text-slate-400">Context for the selected artifact.</p>
                </div>
            </div>

            <div className="space-y-3">
                {signals.map((signal) => (
                    <PhishCard key={signal.label} tone="slate" hover={false} className="p-3">
                        <div className="flex items-center justify-between gap-3 font-mono text-xs">
                            <span className="text-slate-400">{signal.label}</span>
                            <span className={`text-right ${signal.tone}`}>{signal.value}</span>
                        </div>
                    </PhishCard>
                ))}
            </div>

            <div className="mt-4 rounded-2xl border border-blue-400/15 bg-black/30 p-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-blue-300">
                    <Crosshair className="h-4 w-4" />
                    Focus
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                    {selectedPath?.goal || "Inspect the artifact and choose a verdict."}
                </p>
            </div>

            <div className="mt-4 rounded-2xl border border-blue-300/10 bg-blue-400/[0.04] p-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-blue-200">
                    <FileSearch className="h-4 w-4" />
                    Analyst Notes
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{email.analystNotes}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <ImmersiveStat icon={Clock} label="SLA" value={formatSla(slaSeconds)} danger={slaSeconds <= 30} />
                <ImmersiveStat icon={ShieldAlert} label="Impact" value={email?.riskLevel || "Low"} />
            </div>
        </PhishPanel>
    );
}

function ImmersiveStat({ icon: Icon, label, value, danger = false }: { icon: React.ElementType; label: string; value: string | number; danger?: boolean }) {
    return (
        <PhishCard tone={danger ? "threat" : "blue"} hover={false} className="p-3">
            <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</span>
                {createElement(Icon, {
                    className: danger ? "h-4 w-4 text-red-300" : "h-4 w-4 text-blue-300",
                })}
            </div>
            <p className={danger ? "mt-2 font-mono text-sm font-bold text-red-200" : "mt-2 font-mono text-sm font-bold text-white"}>
                {value}
            </p>
        </PhishCard>
    );
}

function formatSla(seconds: number) {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
}

function InboxMiniStat({ label, value, tone = "blue" }: { label: string; value: string | number; tone?: "blue" | "green" | "red" | "amber" }) {
    const tones = {
        blue: "border-blue-300/12 bg-blue-400/[0.045] text-blue-200",
        green: "border-emerald-300/12 bg-emerald-400/[0.045] text-emerald-200",
        red: "border-red-300/12 bg-red-400/[0.045] text-red-200",
        amber: "border-amber-300/12 bg-amber-400/[0.045] text-amber-200",
    };

    return (
        <div className={`rounded-xl border p-3 ${tones[tone]}`}>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-black text-white">{value}</p>
        </div>
    );
}
