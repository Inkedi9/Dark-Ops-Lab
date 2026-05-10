"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crosshair, Clock, Trophy, ShieldAlert } from "lucide-react";
import { getChallengeBySlug } from "@/challenges/registry";
import { runChallengeAttempt } from "@/engine/challenge-engine";
import { calculateScore } from "@/engine/scoring";
import type { ChallengeLog } from "@/engine/types";
import type { ChallengeDefinition } from "@/engine/types";
import {
    getChallengeProgress,
    resetChallengeProgress,
    saveChallengeProgress,
} from "@/store/progress-store";
import { TerminalPanel } from "@/components/dc-ui/TerminalPanel";
import { ChallengeSandbox } from "@/components/challenge/sandbox/ChallengeSandbox";
import { addXp } from "@/store/global-progress";
import { appendProgressEvent } from "@dark/progress";
import { MissionStatusBar } from "@/components/challenge/MissionStatusBar";
import { AppShell } from "@/components/layout/AppShell";
import { FailIntelligencePanel } from "@/components/challenge/FailIntelligencePanel";
import { ExploitFeedbackPanel } from "@/components/challenge/ExploitFeedbackPanel";
import PanelCard from "@dark/ui/components/PanelCard";
import StatCard from "@dark/ui/components/StatCard";
import AppButton from "@dark/ui/components/AppButton";
import AppBadge from "@dark/ui/components/AppBadge";
import SectionHeader from "@dark/ui/components/SectionHeader";

type TerminalLog = ChallengeLog & {
    time: string;
};

type Props = {
    slug: string;
};

const fallbackChallenge: ChallengeDefinition = {
    id: "missing-challenge",
    slug: "missing-challenge",
    title: "Mission not found",
    category: "Unknown",
    difficulty: "beginner",
    estimatedMinutes: 0,
    objective: "Return to the mission board and choose an available mission.",
    successCondition: "No mission loaded.",
    hints: [],
    evaluate: () => ({
        success: false,
        message: "Mission not found.",
        logs: [{ level: "error", message: "mission not found" }],
    }),
    fields: [],
    sandboxType: "terminal",
};

export default function ChallengeRunner({ slug }: Props) {
    const foundChallenge = getChallengeBySlug(slug);
    const challenge = foundChallenge ?? fallbackChallenge;

    const [inputValues, setInputValues] = useState<Record<string, string>>({});
    const [savedProgress] = useState(() => getChallengeProgress(challenge.id));
    const [logs, setLogs] = useState<TerminalLog[]>(() => [
        { time: "00:00", level: "info", message: "mission initialized" },
        { time: "00:00", level: "info", message: "waiting for input" },
        ...(savedProgress
            ? [
                {
                    time: "00:00",
                    level: "success" as const,
                    message: `saved progress loaded: best score ${savedProgress.bestScore} XP`,
                },
            ]
            : []),
    ]);
    const [attempts, setAttempts] = useState(savedProgress?.attempts ?? 0);
    const [hintsUsed, setHintsUsed] = useState(savedProgress?.hintsUsed ?? 0);
    const [solved, setSolved] = useState(savedProgress?.solved ?? false);
    const [bestScore, setBestScore] = useState<number | null>(savedProgress?.bestScore ?? null);
    const [startedAt] = useState(() => Date.now());

    const generatedQuery = useMemo(() => {
        return challenge.getPreview?.(inputValues) ?? "";
    }, [challenge, inputValues]);

    const score = calculateScore({
        difficulty: challenge.difficulty,
        attempts,
        hintsUsed,
        elapsedSeconds: 0,
    });

    function getTime() {
        const seconds = Math.floor((Date.now() - startedAt) / 1000);
        const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
        const remainingSeconds = String(seconds % 60).padStart(2, "0");

        return `${minutes}:${remainingSeconds}`;
    }

    function appendLogs(nextLogs: ChallengeLog[]) {
        setLogs((current) => [
            ...current,
            ...nextLogs.map((log) => ({
                ...log,
                time: getTime(),
            })),
        ]);
    }

    function getElapsedSeconds() {
        return Math.floor((Date.now() - startedAt) / 1000);
    }

    function runLogin() {
        if (solved) return;

        const result = runChallengeAttempt({
            challenge,
            input: inputValues,
        });

        const finalAttempts = attempts + 1;

        setAttempts(finalAttempts);
        appendLogs(result.logs);

        if (!result.success) return;

        setLogs((current) => [
            ...current,
            {
                time: getTime(),
                level: "success",
                message: "[BREACH SUCCESSFUL] target condition compromised",
            },
        ]);

        const finalScore = calculateScore({
            difficulty: challenge.difficulty,
            attempts: finalAttempts,
            hintsUsed,
            elapsedSeconds: getElapsedSeconds(),
        });

        addXp(finalScore);
        appendProgressEvent("challenges", {
            type: "challenge_completed",
            source: "dark-challenges",
            payload: {
                challengeId: challenge.id,
                slug: challenge.slug,
                xp: finalScore,
                attempts: finalAttempts,
                hintsUsed,
            },
        });

        setSolved(true);

        saveChallengeProgress({
            challengeId: challenge.id,
            solved: true,
            bestScore: finalScore,
            attempts: finalAttempts,
            hintsUsed,
            solvedAt: new Date().toISOString(),
        });

        setBestScore((current) =>
            current === null ? finalScore : Math.max(current, finalScore)
        );
    }

    function revealHint() {
        if (hintsUsed >= challenge.hints.length || solved) return;

        const hint = challenge.hints[hintsUsed];

        setHintsUsed((value) => value + 1);

        setLogs((current) => [
            ...current,
            {
                time: getTime(),
                level: "warning",
                message: `hint revealed: ${hint.title}`,
            },
        ]);
    }

    function resetMission() {
        resetChallengeProgress(challenge.id);
        challenge.reset?.();

        setSolved(false);
        setBestScore(null);
        setAttempts(0);
        setHintsUsed(0);
        setInputValues({});
        setLogs([
            { time: "00:00", level: "info", message: "mission reset" },
            { time: "00:00", level: "info", message: "waiting for input" },
        ]);
    }

    if (!foundChallenge) {
        return (
            <AppShell>
                <PanelCard variant="darkNexus" accent="danger" className="p-8">
                    <AppBadge variant="danger">Mission not found</AppBadge>

                    <h1 className="mt-4 text-3xl font-black text-white">
                        This challenge does not exist.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                        Return to the mission board and choose an available operation.
                    </p>

                    <Link
                        href="/challenges"
                        className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to missions
                    </Link>
                </PanelCard>
            </AppShell>
        );
    }

    return (

        <AppShell>

            <MissionStatusBar
                challengeId={challenge.id.toUpperCase()}
                solved={solved}
                attempts={attempts}
                score={score}
            />

            <div className="mb-8">
                <SectionHeader
                    eyebrow="Live operation"
                    title={challenge.title}
                    description={challenge.objective}
                    accent="danger"
                    mode="nexus"
                    action={
                        <AppButton onClick={resetMission} variant="ghost">
                            Reset mission
                        </AppButton>
                    }
                />

                <div className="mt-4 flex flex-wrap gap-2">
                    <AppBadge variant="blue">{challenge.category}</AppBadge>
                    <AppBadge
                        variant={
                            challenge.difficulty === "advanced"
                                ? "danger"
                                : challenge.difficulty === "intermediate"
                                    ? "amber"
                                    : "blue"
                        }
                    >
                        {challenge.difficulty}
                    </AppBadge>
                    <AppBadge variant={solved ? "emerald" : "danger"}>
                        {solved ? "Solved" : "Live mission"}
                    </AppBadge>
                </div>
            </div>

            <PanelCard variant="darkNexus" accent="danger" className="mb-8">
                <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_1.2fr]">
                    <OperationMetric
                        icon={Crosshair}
                        label="Target"
                        value={challenge.category}
                    />

                    <OperationMetric
                        icon={ShieldAlert}
                        label="Difficulty"
                        value={challenge.difficulty}
                    />

                    <OperationMetric
                        icon={Clock}
                        label="Estimated"
                        value={`${challenge.estimatedMinutes} min`}
                    />

                    <OperationMetric
                        icon={Trophy}
                        label="Reward"
                        value={`${score} XP`}
                    />
                </div>

                <div className="mt-6 rounded-2xl border border-red-300/15 bg-red-400/[0.045] p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-red-200">
                        Operation flow
                    </p>

                    <div className="mt-4 grid gap-2 md:grid-cols-4">
                        {["Recon", "Payload", "Bypass", "Capture"].map((step, index) => (
                            <div
                                key={step}
                                className={[
                                    "rounded-xl border px-3 py-3 text-center font-mono text-[10px] uppercase tracking-[0.22em]",
                                    solved
                                        ? "border-emerald-300/20 bg-emerald-400/[0.07] text-emerald-200"
                                        : index === 0
                                            ? "border-red-300/25 bg-red-400/[0.08] text-red-200"
                                            : "border-white/[0.07] bg-white/[0.03] text-slate-500",
                                ].join(" ")}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                </div>
            </PanelCard>

            <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="space-y-6">
                    <PanelCard variant="darkNexus" accent="violet" className="p-6">
                        <SectionHeader
                            eyebrow="Payload Console"
                            title={
                                challenge.sandboxType === "browser"
                                    ? "Client-side injection surface"
                                    : challenge.sandboxType === "terminal"
                                        ? "Command execution surface"
                                        : "Authentication attack surface"
                            }
                            accent="violet"
                            className="mb-5"
                        />

                        <div className="space-y-4">
                            {challenge.fields.map((field) => (
                                <label key={field.name} className="block">
                                    <span className="mb-2 block font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                        {field.label}
                                    </span>

                                    {field.type === "textarea" ? (
                                        <textarea
                                            value={inputValues[field.name] ?? ""}
                                            onChange={(event) =>
                                                setInputValues((current) => ({
                                                    ...current,
                                                    [field.name]: event.target.value,
                                                }))
                                            }
                                            className="min-h-36 w-full resize-none rounded-xl border border-white/[0.08] bg-black/35 px-4 py-3 font-mono text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-blue-200/40 focus:ring-2 focus:ring-blue-300/10"
                                            placeholder={field.placeholder}
                                        />
                                    ) : (
                                        <input
                                            value={inputValues[field.name] ?? ""}
                                            onChange={(event) =>
                                                setInputValues((current) => ({
                                                    ...current,
                                                    [field.name]: event.target.value,
                                                }))
                                            }
                                            className="w-full rounded-xl border border-white/[0.08] bg-black/35 px-4 py-3 font-mono text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-blue-200/40 focus:ring-2 focus:ring-blue-300/10"
                                            placeholder={field.placeholder}
                                            type={field.type === "password" ? "password" : "text"}
                                        />
                                    )}
                                </label>
                            ))}

                            <AppButton
                                onClick={runLogin}
                                disabled={solved}
                                variant={solved ? "emerald" : "danger"}
                                shape="terminal"
                                className="w-full font-black"
                            >
                                {solved ? "BREACHED" : "EXECUTE PAYLOAD"}
                            </AppButton>
                        </div>
                    </PanelCard>

                    <ChallengeSandbox
                        challenge={challenge}
                        preview={generatedQuery}
                        solved={solved}
                        attempts={attempts}
                    />

                    <TerminalPanel logs={logs} />
                </div>

                <aside className="space-y-6">
                    <PanelCard variant="darkNexus" accent="blue">
                        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-blue-300">
                            Objective
                        </p>

                        <p className="text-slate-300">{challenge.objective}</p>

                        <div className="mt-6 border-t border-slate-800 pt-6">
                            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                Success condition
                            </p>
                            <p className="mt-2 text-slate-300">
                                {challenge.successCondition}
                            </p>
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkNexus" accent="blue">
                        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-violet-300">
                            Operation telemetry
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                            <StatCard label="Attempts" value={attempts} />
                            <StatCard label="Hints" value={`${hintsUsed}/${challenge.hints.length}`} />
                            <StatCard label="XP" value={score} />
                        </div>

                        {bestScore !== null && (
                            <div className="mt-4 rounded-xl border border-green-400/20 bg-green-400/10 p-4">
                                <p className="font-mono text-xs uppercase tracking-[0.2em] text-green-300">
                                    Best saved score
                                </p>
                                <p className="mt-1 text-2xl font-black">{bestScore} XP</p>
                            </div>
                        )}
                    </PanelCard>

                    <FailIntelligencePanel
                        challenge={challenge}
                        attempts={attempts}
                        hintsUsed={hintsUsed}
                        solved={solved}
                    />

                    <ExploitFeedbackPanel challenge={challenge} solved={solved} />

                    <PanelCard variant="darkNexus" accent="amber">
                        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-amber-300">
                            Recon assistance
                        </p>

                        <div className="space-y-3">
                            {challenge.hints.map((hint, index) => {
                                const revealed = index < hintsUsed;

                                return (
                                    <div
                                        key={hint.id}
                                        className="rounded-xl border border-slate-800 bg-[#05070d] p-4"
                                    >
                                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                                            {hint.title}
                                        </p>

                                        <p className="mt-2 text-sm text-slate-300">
                                            {revealed ? hint.content : "Locked"}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <AppButton
                            onClick={revealHint}
                            disabled={hintsUsed >= challenge.hints.length || solved}
                            variant="amber"
                            shape="terminal"
                            className="mt-5 w-full"
                        >
                            Request recon hint
                        </AppButton>
                    </PanelCard>

                    {solved && (
                        <PanelCard variant="darkNexus" accent="emerald" className="p-6">
                            <p className="font-mono text-sm uppercase tracking-[0.3em] text-green-300">
                                Mission Complete
                            </p>

                            <h3 className="mt-3 text-2xl font-black">
                                {bestScore ?? score} XP earned.
                            </h3>

                            <p className="mt-3 text-slate-300">
                                Authentication logic was bypassed by altering the target
                                condition.
                            </p>
                        </PanelCard>
                    )}
                </aside>
            </section>

            {solved && (
                <div className="pointer-events-none fixed bottom-6 right-6 z-50 animate-[toastIn_0.35s_ease-out]">
                    <div className="rounded-2xl border border-emerald-300/30 bg-black/85 px-5 py-4 shadow-[0_0_40px_rgba(88,240,167,0.18)] backdrop-blur-xl">
                        <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-300">
                            Breach successful
                        </p>
                        <p className="mt-1 text-xl font-black text-white">
                            Mission Complete · {bestScore ?? score} XP
                        </p>
                    </div>
                </div>
            )}
        </AppShell>
    );
}

function OperationMetric({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-red-300/20 bg-red-400/[0.08] text-red-200">
                <Icon size={18} />
            </div>

            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>

            <p className="mt-2 line-clamp-1 text-lg font-black text-white">
                {value}
            </p>
        </div>
    );
}
