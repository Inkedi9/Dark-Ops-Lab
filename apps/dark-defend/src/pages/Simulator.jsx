import { createElement, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import InboxList from "../components/InboxList";
import EmailViewer from "../components/EmailViewer";
import AnalysisPanel from "../components/AnalysisPanel";
import ScoreSummary from "../components/ScoreSummary";
import { phishingPath, scenarios } from "../data/scenarios";
import { calculateEmailScore } from "../utils/scoring";
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
import { PhishLayout } from "@/components/ui/PhishLayout";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishHeader } from "@/components/ui/PhishHeader";
import { PhishBadge } from "@/components/ui/PhishBadge";
import { PhishButton } from "@/components/ui/PhishButton";
import { PhishProgress } from "@/components/ui/PhishProgress";
import { getDarkProfile, recordDefendScenario } from "@/lib/defend/defendProgressService";
import { createIncidentFromScenario } from "@/lib/defend/incidentService";

export default function Simulator() {
    const [selectedEmail, setSelectedEmail] = useState(scenarios[0]);
    const [verdict, setVerdict] = useState("");
    const [selectedFlags, setSelectedFlags] = useState([]);
    const [currentResult, setCurrentResult] = useState(null);
    const [profile, setProfile] = useState(null);
    const [lastXpAwarded, setLastXpAwarded] = useState(0);
    const [mode, setMode] = useState(() => localStorage.getItem("darkdefend-mode") || "beginner");
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(() =>
        Number(localStorage.getItem("darkdefend-best-streak") || 0)
    );
    const [results, setResults] = useState(() => {
        const stored = localStorage.getItem("phishscope-results");
        return stored ? JSON.parse(stored) : [];
    });
    const [inboxFilter, setInboxFilter] = useState("all");

    const completedIds = useMemo(() => results.map((r) => r.scenarioId), [results]);
    const selectedPath = phishingPath.find((path) => path.id === selectedEmail?.pathId);
    const selectedIndex = scenarios.findIndex((scenario) => scenario.id === selectedEmail?.id);
    const riskTone = selectedEmail?.riskLevel === "Critical" || selectedEmail?.riskLevel === "High" ? "red" : "blue";
    const pathProgress = useMemo(
        () =>
            phishingPath.map((path) => {
                const pathScenarios = scenarios.filter((scenario) => scenario.pathId === path.id);
                const completed = pathScenarios.filter((scenario) => completedIds.includes(scenario.id)).length;

                return {
                    ...path,
                    completed,
                    total: pathScenarios.length,
                };
            }),
        [completedIds]
    );

    const filteredEmails = useMemo(() => {
        return scenarios.filter((email) => {
            const completed = completedIds.includes(email.id);
            const highRisk =
                email.riskLevel === "High" || email.riskLevel === "Critical";
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

    const goToNextEmail = (currentEmailId) => {
        const currentIndex = scenarios.findIndex((email) => email.id === currentEmailId);
        const nextEmail = scenarios[currentIndex + 1];

        if (nextEmail) {
            setSelectedEmail(nextEmail);
            setVerdict("");
            setSelectedFlags([]);
            setCurrentResult(null);
            setLastXpAwarded(0);
        }
    };

    const handleSubmit = async () => {
        if (!selectedEmail || !verdict) return;

        const alreadyDone = completedIds.includes(selectedEmail.id);
        if (alreadyDone) return;

        const scoreData = calculateEmailScore(selectedEmail, verdict, selectedFlags, mode);
        const generatedIncident = createIncidentFromScenario({
            email: selectedEmail,
            result: scoreData,
            mode,
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
            incidentId: generatedIncident?.id || null,
        };

        const updatedResults = [...results, resultEntry];

        const defendProgress = await recordDefendScenario({
            scenarioId: selectedEmail.id,
            result: scoreData,
            totalScenarios: scenarios.length,
            mode,
            streak: nextStreak,
        });

        setCurrentResult({
            ...scoreData,
            incidentId: generatedIncident?.id || null,
        });
        setProfile(defendProgress.profile);
        setLastXpAwarded(defendProgress.xpAwarded);
        setStreak(nextStreak);
        setBestStreak(nextBestStreak);
        localStorage.setItem("darkdefend-best-streak", String(nextBestStreak));
        setResults(updatedResults);
        localStorage.setItem("phishscope-results", JSON.stringify(updatedResults));
    };

    const handleSelect = (email) => {
        setSelectedEmail(email);
        setVerdict("");
        setSelectedFlags([]);
        setCurrentResult(null);
        setLastXpAwarded(0);

    };

    const handleRestartSession = () => {
        localStorage.removeItem("phishscope-results");
        setResults([]);
        setSelectedEmail(scenarios[0]);
        setVerdict("");
        setSelectedFlags([]);
        setCurrentResult(null);
        setLastXpAwarded(0);
        setStreak(0);

    };

    useEffect(() => {
        getDarkProfile().then(setProfile);
    }, []);

    function resetPhishScopeEnvironment() {
        localStorage.removeItem("phishscope-results");

        setResults([]);
        setSelectedEmail(scenarios[0]);
        setVerdict("");
        setSelectedFlags([]);
        setCurrentResult(null);
        setLastXpAwarded(0);
        setStreak(0);
    }

    const handleModeChange = (nextMode) => {
        setMode(nextMode);
        localStorage.setItem("darkdefend-mode", nextMode);
    };

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
                            <PhishProgress current={results.length} value={results.length} max={scenarios.length} />
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
                                    <PhishBadge tone="green">
                                        Current: {selectedPath.label}
                                    </PhishBadge>
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
                                                ) ||
                                                scenarios.find((scenario) => scenario.pathId === path.id);

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

                                        <h3 className="mt-2 font-bold text-white">
                                            {path.title}
                                        </h3>

                                        <p className="mt-2 text-xs leading-5 text-slate-400">
                                            {path.goal}
                                        </p>

                                        <div className="mt-4 h-2 overflow-hidden rounded-full border border-blue-300/10 bg-[#060b11]">
                                            <div
                                                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,.72),rgba(45,212,191,.58))] transition-all duration-500"
                                                style={{
                                                    width: `${Math.round((path.completed / path.total) * 100)}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="mt-2 font-mono text-xs text-slate-500">
                                            {path.completed}/{path.total} complete
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </PhishPanel>

                        <div className="grid gap-6 xl:h-[620px] xl:grid-cols-[360px_1fr_400px]">
                            <div className="min-h-0 xl:h-full">
                                <div className="flex h-[520px] min-h-0 flex-col overflow-hidden rounded-2xl border border-blue-400/15 bg-black/25 p-5 xl:h-full">
                                    <div className="mb-4 flex shrink-0 items-center justify-between">
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
                                                Inbox Queue
                                            </p>
                                            <h2 className="mt-2 text-xl font-black text-white">
                                                Email Samples
                                            </h2>
                                        </div>

                                        <PhishBadge tone="slate">{filteredEmails.length} visible</PhishBadge>
                                    </div>

                                    <div className="mb-4 flex shrink-0 flex-wrap gap-2">
                                        {[
                                            ["all", "All"],
                                            ["open", "Open"],
                                            ["completed", "Done"],
                                            ["high-risk", "High risk"],
                                            ["attachments", "Files"],
                                            ["links", "Links"],
                                        ].map(([value, label]) => (
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

                                    <div className="min-h-0 flex-1 overflow-y-auto pr-2 phish-scroll">
                                        <InboxList
                                            emails={filteredEmails}
                                            selectedEmail={selectedEmail}
                                            onSelect={handleSelect}
                                            completedIds={completedIds}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="min-h-0 min-w-0 space-y-4 overflow-y-auto pr-2 phish-scroll xl:h-full">
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

                            <div className="min-h-0 space-y-4 overflow-y-auto pr-2 phish-scroll xl:h-full">
                                <ThreatIntelPanel email={selectedEmail} selectedPath={selectedPath} mode={mode} />

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

                                    <AnalysisPanel
                                        email={selectedEmail}
                                        mode={mode}
                                        verdict={verdict}
                                        setVerdict={setVerdict}
                                        selectedFlags={selectedFlags}
                                        setSelectedFlags={setSelectedFlags}
                                        onSubmit={handleSubmit}
                                        disabled={completedIds.includes(selectedEmail?.id)}
                                    />
                                </PhishPanel>
                            </div>
                        </div>

                        {isSimulationComplete && (
                            <PhishPanel variant="success">
                                <h2 className="text-xl font-bold text-emerald-300">
                                    Simulation Complete
                                </h2>
                                <p className="mt-2 text-sm leading-7 text-slate-200">
                                    All emails have been analyzed. Review the final debrief, then open your results dashboard.
                                </p>
                                <Link to="/results" className="mt-4 inline-flex">
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
                        {["beginner", "analyst"].map((option) => (
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
                        <Link to="/results">
                            <PhishButton tone="solid">
                                View Results
                                <ArrowRight className="h-4 w-4" />
                            </PhishButton>
                        </Link>
                    )}

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
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                        {briefingText}
                    </p>
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

function ThreatIntelPanel({ email, selectedPath, mode }) {
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
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
                        Threat Intel
                    </p>
                    <p className="text-sm text-slate-400">Context for the selected artifact.</p>
                </div>
            </div>

            <div className="space-y-3">
                {signals.map((signal) => (
                    <div
                        key={signal.label}
                        className="flex items-center justify-between gap-3 rounded-xl border border-blue-400/15 bg-black/25 px-3 py-2 font-mono text-xs"
                    >
                        <span className="text-slate-400">{signal.label}</span>
                        <span className={`text-right ${signal.tone}`}>{signal.value}</span>
                    </div>
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

                <p className="mt-2 text-sm leading-6 text-slate-300">
                    {email.analystNotes}
                </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <ImmersiveStat icon={Clock} label="SLA" value="03:00" />
                <ImmersiveStat icon={ShieldAlert} label="Impact" value={email?.riskLevel || "Low"} />
            </div>
        </PhishPanel>
    );
}

function ImmersiveStat({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-blue-400/15 bg-black/25 p-3">
            <div className="flex items-center justify-between gap-2 text-blue-300">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {label}
                </span>
                {createElement(Icon, { className: "h-4 w-4" })}
            </div>
            <p className="mt-2 font-mono text-sm font-bold text-white">{value}</p>
        </div>
    );
}

function PathStrip({ pathProgress, selectedEmail, completedIds, onSelect }) {
    return (
        <PhishPanel variant="card" className="p-3">
            <div className="flex gap-3 overflow-x-auto pb-1">
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
                                ) ||
                                scenarios.find((scenario) => scenario.pathId === path.id);

                            if (nextScenario) onSelect(nextScenario);
                        }}
                        className={[
                            "min-w-[220px] rounded-xl border px-4 py-3 text-left transition",
                            selectedEmail?.pathId === path.id
                                ? "border-blue-300/40 bg-blue-400/10"
                                : "border-blue-400/15 bg-black/25 hover:border-blue-300/30",
                        ].join(" ")}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-300">
                                {path.label}
                            </p>
                            <span className="font-mono text-xs text-slate-500">
                                {path.completed}/{path.total}
                            </span>
                        </div>

                        <h3 className="mt-1 line-clamp-1 font-bold text-white">
                            {path.title}
                        </h3>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-950/40">
                            <div
                                className="h-full rounded-full bg-blue-300"
                                style={{
                                    width: `${Math.round((path.completed / path.total) * 100)}%`,
                                }}
                            />
                        </div>
                    </button>
                ))}
            </div>
        </PhishPanel>
    );
}
