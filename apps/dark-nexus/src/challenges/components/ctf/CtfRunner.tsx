"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSubmitChallenge } from "@/hooks/useSubmitChallenge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TerminalPanel } from "@/components/dc-ui/TerminalPanel";
import type { ChallengeLog } from "@/engine/types";
import {
    getCtfProgress,
    resetCtfProgress,
    saveCtfProgress,
} from "@/store/ctf-progress-store";
import { addXp } from "@/store/global-progress";
import { appendProgressEvent } from "@dark/progress";
import { getMiniCtfBySlug } from "@/challenges/ctf/registry";
import type { MiniCtf } from "@/challenges/ctf/types";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import ProgressBar from "@dark/ui/components/ProgressBar";
import SectionHeader from "@dark/ui/components/SectionHeader";
import ChallengeInfoCard from "@/challenges/components/ChallengeInfoCard";


type TerminalLog = ChallengeLog & {
    time: string;
};

type Props = {
    slug: string;
};

const fallbackCtf: MiniCtf = {
    id: "missing-ctf",
    slug: "missing-ctf",
    title: "CTF not found",
    description: "Return to the CTF board and choose an available operation.",
    difficulty: "beginner",
    rewardXp: 0,
    badge: "Unavailable",
    steps: [
        {
            id: "missing-step",
            title: "Unavailable fragment",
            objective: "No CTF operation loaded.",
            field: {
                name: "input",
                label: "Input",
                placeholder: "No operation available",
            },
            evaluate: () => ({
                success: false,
                message: "CTF not found.",
                logs: [{ level: "error", message: "ctf not found" }],
            }),
        },
    ],
};

export function CtfRunner({ slug }: Props) {
    const foundCtf = getMiniCtfBySlug(slug);
    const ctf = foundCtf ?? fallbackCtf;

    const [mounted, setMounted] = useState(false);
    const [inputValues, setInputValues] = useState<Record<string, string>>({});
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [submittedFlag, setSubmittedFlag] = useState("");
    const [completed, setCompleted] = useState(false);
    const [solvedStepIds, setSolvedStepIds] = useState<string[]>([]);
    const [fragments, setFragments] = useState<string[]>([]);
    const [logs, setLogs] = useState<TerminalLog[]>([
        { time: "00:00", level: "info", message: "ctf operation initialized" },
    ]);
    const [startedAt] = useState(() => Date.now());
    const [attempts, setAttempts] = useState(0);
    const { submitToApi, isSubmitting, isAuthenticated, authChecked } = useSubmitChallenge();

    const activeStep = ctf.steps[activeStepIndex];
    const isClientReady = mounted;
    const displayCompleted = isClientReady && completed;

    const completion = useMemo(() => {
        return Math.round((solvedStepIds.length / ctf.steps.length) * 100);
    }, [solvedStepIds.length, ctf.steps.length]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setMounted(true);

            if (!foundCtf) return;

            const savedProgress = getCtfProgress(ctf.id);
            const nextIndex = ctf.steps.findIndex(
                (step) => !savedProgress.solvedStepIds.includes(step.id)
            );

            setActiveStepIndex(nextIndex === -1 ? ctf.steps.length - 1 : nextIndex);
            setSubmittedFlag(savedProgress.submittedFlag ?? "");
            setCompleted(savedProgress.completed);
            setSolvedStepIds(savedProgress.solvedStepIds);
            setFragments(savedProgress.fragments);
        }, 0);

        return () => window.clearTimeout(timeout);
    }, [ctf.id, ctf.steps, foundCtf]);

    function getTime() {
        const now = new Date();
        return now.toLocaleTimeString("en-GB", {
            minute: "2-digit",
            second: "2-digit",
        });
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

    function runStep() {
        setAttempts((value) => value + 1);
        if (!activeStep || completed) return;

        const result = activeStep.evaluate(inputValues);
        appendLogs(result.logs);

        if (!result.success) return;

        const nextSolved = Array.from(new Set([...solvedStepIds, activeStep.id]));
        const nextFragments = result.flagFragment
            ? Array.from(new Set([...fragments, result.flagFragment]))
            : fragments;

        setSolvedStepIds(nextSolved);
        setFragments(nextFragments);

        saveCtfProgress({
            ctfId: ctf.id,
            solvedStepIds: nextSolved,
            fragments: nextFragments,
            completed,
            submittedFlag,
        });

        const nextIndex = Math.min(activeStepIndex + 1, ctf.steps.length - 1);
        setActiveStepIndex(nextIndex);
        setInputValues({});
    }

    async function submitFinalFlag() {
        const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
        const outcome = await submitToApi(ctf.id, submittedFlag.trim());

        if (outcome.status === "incorrect") {
            appendLogs([{ level: "error", message: "final flag rejected" }]);
            return;
        }
        if (outcome.status === "unauthenticated") {
            appendLogs([{ level: "error", message: "sign in to submit the final flag" }]);
            return;
        }
        if (outcome.status === "error") {
            appendLogs([{ level: "error", message: "api unavailable — try again later" }]);
            return;
        }

        setCompleted(true);
        addXp(outcome.xp);
        appendProgressEvent("challenges", {
            type: "ctf_completed",
            source: "dark-challenges",
            entityId: ctf.id,
            idempotencyKey: `challenges:ctf_completed:${ctf.id}`,
            payload: {
                entityId: ctf.id,
                challengeId: ctf.id,
                slug: ctf.slug,
                kind: "ctf",
                rewardXp: outcome.xp,
                attempts,
            },
        });
        appendProgressEvent("challenges", {
            type: "xp_awarded",
            source: "dark-challenges",
            entityId: `ctf:${ctf.id}`,
            idempotencyKey: `challenges:xp_awarded:ctf:${ctf.id}`,
            payload: {
                entityId: `ctf:${ctf.id}`,
                challengeId: ctf.id,
                slug: ctf.slug,
                kind: "ctf",
                amount: outcome.xp,
                reason: "ctf_completed",
            },
        });

        saveCtfProgress({
            ctfId: ctf.id,
            solvedStepIds,
            fragments,
            completed: true,
            submittedFlag,
            completedAt: new Date().toISOString(),
            bestTimeSeconds: elapsedSeconds,
            bestAttempts: attempts,
        });

        setLogs((current) => [
            ...current,
            {
                time: getTime(),
                level: "success",
                message: `final flag accepted — badge unlocked: ${ctf.badge}`,
            },
        ]);
    }

    function resetOperation() {
        resetCtfProgress(ctf.id);
        setInputValues({});
        setActiveStepIndex(0);
        setSubmittedFlag("");
        setCompleted(false);
        setSolvedStepIds([]);
        setFragments([]);
        setLogs([
            { time: "00:00", level: "info", message: "ctf operation reset" },
        ]);
    }

    if (!foundCtf) {
        return (
            <AppShell>
                <PanelCard variant="darkOps" accent="danger" className="p-8">
                    <AppBadge variant="danger">CTF not found</AppBadge>

                    <h1 className="mt-4 text-3xl font-black text-white">
                        This CTF operation does not exist.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                        Return to the CTF board and choose an available chain.
                    </p>

                    <Link
                        href="/ctf"
                        className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to CTF
                    </Link>
                </PanelCard>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <SectionHeader
                eyebrow={displayCompleted ? "Captured" : "Live CTF"}
                title={ctf.title}
                description={ctf.description}
                mode="nexus"
                action={
                    <div className="flex flex-col gap-3 md:min-w-72">
                        <div className="flex flex-wrap gap-2">
                            <AppBadge variant="violet">{ctf.difficulty}</AppBadge>
                            <AppBadge variant="emerald">{ctf.rewardXp} XP</AppBadge>
                            <AppBadge variant={displayCompleted ? "emerald" : "blue"}>
                                {displayCompleted ? "Completed" : "Live chain"}
                            </AppBadge>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between font-mono text-xs text-slate-400">
                                <span>CTF progress</span>
                                <span>{completion}%</span>
                            </div>
                            <ProgressBar value={completion} className="h-2" />
                        </div>
                    </div>
                }
            />

            <ChallengeInfoCard
                title={ctf.title}
                objective={ctf.description}
                difficulty={ctf.difficulty}
                risk="High"
                duration="20 min"
                rewards={`+${ctf.rewardXp} XP`}
                skills={["SQL Injection", "Recon", "Input Analysis"]}
            />

            <PanelCard variant="darkOps" accent="violet" className="mb-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.35em] text-violet-300">
                            Fragment chain
                        </p>
                        <h2 className="mt-2 text-3xl font-black text-white">
                            Recover every fragment to assemble the final flag.
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-violet-300/20 bg-violet-400/[0.07] px-5 py-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-violet-200">
                            Chain progress
                        </p>
                        <p className="mt-1 text-2xl font-black text-white">
                            {solvedStepIds.length}/{ctf.steps.length}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {ctf.steps.map((step, index) => {
                        const solved = solvedStepIds.includes(step.id);
                        const active = index === activeStepIndex;

                        return (
                            <div
                                key={step.id}
                                className={[
                                    "rounded-2xl border p-4",
                                    solved
                                        ? "border-emerald-300/20 bg-emerald-400/[0.07]"
                                        : active
                                            ? "border-violet-300/25 bg-violet-400/[0.08]"
                                            : "border-white/[0.07] bg-white/[0.03] opacity-70",
                                ].join(" ")}
                            >
                                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                                    Fragment 0{index + 1}
                                </p>

                                <h3 className="mt-2 font-black text-white">
                                    {step.title}
                                </h3>

                                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                    {solved ? "Recovered" : active ? "Active trace" : "Encrypted"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </PanelCard>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <PanelCard variant="darkOps" accent="violet">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-300">
                            Active fragment
                        </p>

                        <h2 className="mt-3 text-3xl font-black">{activeStep.title}</h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            {activeStep.objective}
                        </p>

                        <div className="mt-6">
                            <label className="block">
                                <span className="mb-2 block font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                    {activeStep.field.label}
                                </span>

                                <input
                                    value={inputValues[activeStep.field.name] ?? ""}
                                    onChange={(event) =>
                                        setInputValues((current) => ({
                                            ...current,
                                            [activeStep.field.name]: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-700 bg-[#05070d] px-4 py-3 font-mono text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-[rgba(var(--dc-accent),0.45)] focus:shadow-[0_0_15px_rgba(var(--dc-accent),0.12)]"
                                    placeholder={activeStep.field.placeholder}
                                />
                            </label>

                            <AppButton
                                onClick={runStep}
                                variant="default"
                                disabled={completed}
                                className="mt-4 w-full"
                            >
                                Execute step
                            </AppButton >
                        </div>
                    </PanelCard>

                    <TerminalPanel logs={logs} />
                </div>

                <aside className="space-y-6">
                    <PanelCard variant="darkOps" accent="blue">
                        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-blue-300">
                            Operation intelligence
                        </p>

                        <div className="space-y-4">
                            <IntelRow
                                label="Active fragment"
                                value={activeStep.title}
                            />

                            <IntelRow
                                label="Objective"
                                value={activeStep.objective}
                            />

                            <IntelRow
                                label="Recovered"
                                value={`${fragments.length}/${ctf.steps.length} fragments`}
                            />

                            <IntelRow
                                label="Attempts"
                                value={attempts}
                            />
                        </div>

                        <div className="mt-5 rounded-xl border border-blue-300/15 bg-blue-400/[0.06] p-4">
                            <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-200">
                                Operator note
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                Each fragment reveals part of the final flag. Complete the chain,
                                assemble the proof, then submit the final flag.
                            </p>
                        </div>
                    </PanelCard>

                    <PanelCard variant="nexus" accent="amber">
                        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-amber-300">
                            Flag fragments
                        </p>

                        <div className="rounded-xl border border-slate-800 bg-black p-4 font-mono text-sm text-slate-300">
                            {fragments.length > 0 ? fragments.join("") : "No fragments recovered."}
                        </div>
                    </PanelCard>

                    <PanelCard variant="nexus" accent="emerald">
                        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-green-300">
                            Final flag
                        </p>

                        {authChecked && !isAuthenticated ? (
                            <div className="rounded-xl border border-emerald-300/15 bg-emerald-400/[0.05] p-5 text-center">
                                <p className="font-mono text-xs leading-6 text-slate-400">
                                    Sign in to submit the final flag and earn XP.
                                </p>
                                <Link
                                    href="/auth"
                                    className="mt-3 inline-block font-mono text-sm font-bold text-emerald-300 transition hover:text-emerald-200"
                                >
                                    Sign in →
                                </Link>
                            </div>
                        ) : (
                            <>
                                <input
                                    value={submittedFlag}
                                    onChange={(event) => setSubmittedFlag(event.target.value)}
                                    className="w-full rounded-xl border border-slate-700 bg-[#05070d] px-4 py-3 font-mono text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-green-300/45 focus:shadow-[0_0_15px_rgba(88,240,167,0.12)]"
                                    placeholder="flag{...}"
                                    disabled={!authChecked}
                                />

                                <AppButton
                                    onClick={submitFinalFlag}
                                    variant={displayCompleted ? "emerald" : "danger"}
                                    disabled={completed || isSubmitting || !authChecked || solvedStepIds.length < ctf.steps.length}
                                    className="mt-4 w-full"
                                >
                                    {displayCompleted ? "Flag captured" : isSubmitting ? "Verifying..." : "Submit final flag"}
                                </AppButton >
                            </>
                        )}

                        <AppButton
                            onClick={resetOperation}
                            variant="ghost"
                            className="mt-3 w-full"
                        >
                            Reset operation
                        </AppButton >
                    </PanelCard>
                </aside>
            </section>
        </AppShell>
    );
}

function IntelRow({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-sm font-bold leading-6 text-white">
                {value}
            </p>
        </div>
    );
}
