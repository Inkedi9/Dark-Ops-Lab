"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TerminalPanel } from "@/components/dc-ui/TerminalPanel";
import type { ChallengeLog } from "@/engine/types";
import {
    getCtfProgress,
    resetCtfProgress,
    saveCtfProgress,
} from "@/store/ctf-progress-store";
import { addXp } from "@/store/global-progress";
import { getMiniCtfBySlug } from "@/ctf/registry";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import ProgressBar from "@dark/ui/components/ProgressBar";
import SectionHeader from "@dark/ui/components/SectionHeader";


type TerminalLog = ChallengeLog & {
    time: string;
};

type Props = {
    slug: string;
};

export function CtfRunner({ slug }: Props) {
    const ctf = getMiniCtfBySlug(slug);

    if (!ctf) {
        return null;
    }

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

    const activeStep = ctf.steps[activeStepIndex];

    useEffect(() => {
        const saved = getCtfProgress(ctf.id);

        setSolvedStepIds(saved.solvedStepIds);
        setFragments(saved.fragments);
        setCompleted(saved.completed);
        setSubmittedFlag(saved.submittedFlag ?? "");

        const nextIndex = ctf.steps.findIndex(
            (step) => !saved.solvedStepIds.includes(step.id)
        );

        setActiveStepIndex(nextIndex === -1 ? ctf.steps.length - 1 : nextIndex);
    }, [ctf]);

    const completion = useMemo(() => {
        return Math.round((solvedStepIds.length / ctf.steps.length) * 100);
    }, [solvedStepIds.length, ctf.steps.length]);

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


        if (!ctf) return;
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

    function submitFinalFlag() {
        if (!ctf) return;

        const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
        const success = submittedFlag.trim() === ctf.finalFlag;

        if (!success) {
            setLogs((current) => [
                ...current,
                {
                    time: getTime(),
                    level: "error",
                    message: "final flag rejected",
                },
            ]);
            return;
        }

        setCompleted(true);
        addXp(ctf.rewardXp);

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
        if (!ctf) return;

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

    return (
        <AppShell>
            <SectionHeader
                eyebrow={completed ? "Captured" : "Live CTF"}
                title={ctf.title}
                description={ctf.description}
                mode="nexus"
                action={
                    <div className="flex flex-col gap-3 md:min-w-72">
                        <div className="flex flex-wrap gap-2">
                            <AppBadge variant="violet">{ctf.difficulty}</AppBadge>
                            <AppBadge variant="emerald">{ctf.rewardXp} XP</AppBadge>
                            <AppBadge variant={completed ? "emerald" : "blue"}>
                                {completed ? "Completed" : "Live chain"}
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

            <PanelCard variant="darkNexus" accent="violet" className="mb-8">
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
                    <PanelCard variant="darkNexus" accent="violet">
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
                    <PanelCard variant="darkNexus" accent="blue">
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

                        <input
                            value={submittedFlag}
                            onChange={(event) => setSubmittedFlag(event.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-[#05070d] px-4 py-3 font-mono text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-green-300/45 focus:shadow-[0_0_15px_rgba(88,240,167,0.12)]"
                            placeholder="flag{...}"
                        />

                        <AppButton
                            onClick={submitFinalFlag}
                            variant={completed ? "emerald" : "danger"}
                            disabled={completed || solvedStepIds.length < ctf.steps.length}
                            className="mt-4 w-full"
                        >
                            {completed ? "Flag captured" : "Submit final flag"}
                        </AppButton >

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