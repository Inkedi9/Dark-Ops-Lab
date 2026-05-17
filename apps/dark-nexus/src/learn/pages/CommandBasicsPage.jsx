"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import PageHeader from "@dark/ui/components/PageHeader";
import { commandBasics } from "../data/commandBasics";
import { recordCommandModuleCompleted } from "../services/splainingProgressEvents";

const STORAGE_KEY = "darksplaining-command-basics";
const platforms = ["Linux", "PowerShell"];

function safeLoadProgress() {
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

function normalizeAnswer(value, platform) {
    const compact = value.trim().replace(/\s+/g, " ");
    return platform === "PowerShell" ? compact.toLowerCase() : compact;
}

function isCorrectAnswer(input, exercise, platform) {
    return normalizeAnswer(input, platform) === normalizeAnswer(exercise.expected, platform);
}

export default function CommandBasicsPage() {
    const [platform, setPlatform] = useState("Linux");
    const platformModules = useMemo(
        () => commandBasics.filter((module) => module.platform === platform),
        [platform]
    );
    const [selectedId, setSelectedId] = useState(() => commandBasics[0]?.id);
    const selectedModule =
        platformModules.find((module) => module.id === selectedId) || platformModules[0];
    const [exerciseIndex, setExerciseIndex] = useState(0);
    const exercise = selectedModule?.exercises?.[exerciseIndex] || selectedModule?.exercises?.[0];
    const [terminalInput, setTerminalInput] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [progress, setProgress] = useState(() => safeLoadProgress());

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch {
            // Progress is non-critical; keep the mock trainer usable in-memory.
        }
    }, [progress]);

    const completedCount = Object.values(progress).filter(Boolean).length;
    const completionPercent = Math.round((completedCount / commandBasics.length) * 100);

    function selectModule(moduleId) {
        setSelectedId(moduleId);
        setExerciseIndex(0);
        setTerminalInput("");
        setFeedback(null);
    }

    function switchPlatform(nextPlatform) {
        const nextModule = commandBasics.find((module) => module.platform === nextPlatform);
        setPlatform(nextPlatform);
        setSelectedId(nextModule?.id);
        setExerciseIndex(0);
        setTerminalInput("");
        setFeedback(null);
    }

    function submitCommand(event) {
        event.preventDefault();
        if (!exercise || !selectedModule) return;

        if (isCorrectAnswer(terminalInput, exercise, selectedModule.platform)) {
            setFeedback({
                type: "success",
                message: exercise.success,
            });
            setProgress((current) => {
                if (!current[selectedModule.id]) {
                    recordCommandModuleCompleted(selectedModule.id);
                }

                return {
                    ...current,
                    [selectedModule.id]: true,
                };
            });
            return;
        }

        setFeedback({
            type: "error",
            message: exercise.hint,
        });
    }

    function nextExercise() {
        if (!selectedModule?.exercises?.length) return;
        setExerciseIndex((current) => (current + 1) % selectedModule.exercises.length);
        setTerminalInput("");
        setFeedback(null);
    }

    return (
        <div className="py-10">
            <PageHeader
                eyebrow="Command Basics"
                title="Practice terminal fundamentals safely."
                description="Learn Linux and PowerShell basics with a mocked terminal. No real command execution happens here."
                accent="blue"
                badges={[
                    { label: "mock terminal", variant: "blue" },
                    { label: `${completionPercent}% complete`, variant: "emerald" },
                ]}
            />

            <div className="mb-6 flex flex-wrap gap-2">
                {platforms.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => switchPlatform(item)}
                        className={[
                            "rounded-xl border px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] transition",
                            platform === item
                                ? "border-blue-300/30 bg-blue-300/[0.12] text-blue-100"
                                : "border-white/[0.07] bg-white/[0.03] text-slate-400 hover:text-white",
                        ].join(" ")}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <section className="grid gap-5 xl:grid-cols-[280px_1fr_340px]">
                <PanelCard variant="darkOps" accent="blue" className="p-4">
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                        Modules
                    </p>

                    <div className="space-y-3">
                        {platformModules.map((module) => {
                            const active = module.id === selectedModule?.id;
                            const done = Boolean(progress[module.id]);

                            return (
                                <button
                                    key={module.id}
                                    type="button"
                                    onClick={() => selectModule(module.id)}
                                    className={[
                                        "w-full rounded-xl border p-3 text-left transition",
                                        active
                                            ? "border-blue-300/30 bg-blue-300/[0.08]"
                                            : "border-white/[0.07] bg-white/[0.03] hover:border-blue-300/18 hover:bg-white/[0.05]",
                                    ].join(" ")}
                                >
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <AppBadge variant={done ? "emerald" : "blue"}>
                                            {done ? "done" : module.difficulty}
                                        </AppBadge>
                                    </div>
                                    <p className="font-bold text-white">{module.title}</p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {module.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </PanelCard>

                <div className="space-y-5">
                    <PanelCard variant="darkOpsHero" accent="blue" className="p-5">
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <AppBadge variant="amber">No real execution</AppBadge>
                                <h2 className="mt-3 text-3xl font-black text-white">
                                    {selectedModule?.title}
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                    {selectedModule?.description}
                                </p>
                            </div>
                            <AppBadge variant="blue">{platform}</AppBadge>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#050913]/90 font-mono shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                            <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.04] px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                    <span className="ml-2 text-xs text-slate-500">
                                        mocked-{platform.toLowerCase()}
                                    </span>
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                    string compare only
                                </span>
                            </div>

                            <div className="space-y-4 p-5">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                        Exercise {exerciseIndex + 1}/{selectedModule?.exercises?.length || 1}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-300">
                                        {exercise?.prompt}
                                    </p>
                                </div>

                                <form onSubmit={submitCommand} className="flex flex-col gap-3 md:flex-row">
                                    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-blue-300/12 bg-black/35 px-4 py-3">
                                        <span className="text-blue-300">
                                            {platform === "PowerShell" ? "PS>" : "$"}
                                        </span>
                                        <input
                                            value={terminalInput}
                                            onChange={(event) => setTerminalInput(event.target.value)}
                                            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                                            placeholder={exercise?.expected || "Type the expected command..."}
                                            autoComplete="off"
                                        />
                                    </label>

                                    <AppButton variant="primary" className="md:w-auto">
                                        Run mock
                                    </AppButton>
                                </form>

                                {feedback && (
                                    <div
                                        className={[
                                            "rounded-xl border p-4 text-sm leading-6",
                                            feedback.type === "success"
                                                ? "border-emerald-300/18 bg-emerald-300/[0.08] text-emerald-100"
                                                : "border-amber-300/18 bg-amber-300/[0.08] text-amber-100",
                                        ].join(" ")}
                                    >
                                        {feedback.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <AppButton variant="secondary" onClick={nextExercise}>
                                Next exercise
                            </AppButton>
                            <Link href="/learn/lessons"
                                className="inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to lessons
                            </Link>
                        </div>
                    </PanelCard>
                </div>

                <PanelCard variant="darkOps" accent="violet" className="p-4">
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
                        Cheat sheet
                    </p>

                    <div className="space-y-3">
                        {selectedModule?.commands.map((command) => (
                            <div
                                key={command.command}
                                className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3"
                            >
                                <p className="font-mono text-sm font-black text-white">
                                    {command.command}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                    {command.purpose}
                                </p>
                                <code className="mt-3 block overflow-x-auto rounded-lg border border-blue-300/12 bg-blue-300/[0.05] px-3 py-2 text-xs text-blue-100">
                                    {command.example}
                                </code>
                            </div>
                        ))}
                    </div>
                </PanelCard>
            </section>
        </div>
    );
}
