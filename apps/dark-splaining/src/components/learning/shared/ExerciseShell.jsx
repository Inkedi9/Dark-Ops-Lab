import { useEffect, useRef, useState } from "react";

export default function ExerciseShell({
    eyebrow = "MOCK.EXERCISE",
    title,
    description,
    steps = [],
    currentStep = 0,
    score,
    xpReward = 10,
    isCompleted = false,
    status = "neutral", // neutral | success | warning | danger
    onCompleteExercise,
    onRetry,
    children,
}) {
    const hasReportedCompletion = useRef(false);
    const [showXpPulse, setShowXpPulse] = useState(false);

    useEffect(() => {
        if (!isCompleted || hasReportedCompletion.current) return;

        hasReportedCompletion.current = true;
        onCompleteExercise?.();

        setShowXpPulse(true);
        const timeoutId = window.setTimeout(() => {
            setShowXpPulse(false);
        }, 1800);

        return () => window.clearTimeout(timeoutId);
    }, [isCompleted, xpReward, onCompleteExercise]);

    const statusStyles = {
        neutral: "ring-blue-300/[0.22] text-blue-300",
        success: "ring-emerald-300/[0.28] text-emerald-300",
        warning: "ring-amber-300/[0.28] text-amber-300",
        danger: "ring-red-300/[0.28] text-red-300",
    };

    return (
        <section className="relative overflow-hidden bg-[#020409] p-5 font-mono shadow-[0_30px_120px_rgba(0,0,0,0.95)] ring-1 ring-blue-300/[0.20]">
            <div className="pointer-events-none absolute inset-0 terminal-scanline opacity-[0.16]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(96,165,250,0.16),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(248,113,113,0.12),transparent_28%),radial-gradient(circle_at_60%_100%,rgba(16,185,129,0.12),transparent_35%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-blue-300/70" />

            <div className="relative">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-blue-300/[0.10] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-blue-200 ring-1 ring-blue-300/[0.25]">
                                {eyebrow}
                            </span>

                            <span
                                className={`px-3 py-1 text-[10px] uppercase tracking-[0.3em] ring-1 ${statusStyles[status] || statusStyles.neutral
                                    }`}
                            >
                                status:{status}
                            </span>
                        </div>

                        <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        {typeof score === "number" && (
                            <div className="bg-black/70 px-4 py-3 ring-1 ring-white/[0.08]">
                                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                    score
                                </p>
                                <p className="mt-1 text-2xl font-black text-white">
                                    {score}
                                </p>
                            </div>
                        )}

                        <div
                            className={`bg-black/70 px-4 py-3 ring-1 transition ${isCompleted
                                ? "ring-emerald-300/[0.35]"
                                : "ring-white/[0.08]"
                                } ${showXpPulse ? "motion-reward" : ""}`}
                        >
                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                reward
                            </p>
                            <p
                                className={`mt-1 text-2xl font-black ${isCompleted
                                    ? "text-emerald-300"
                                    : "text-slate-300"
                                    }`}
                            >
                                +{xpReward} XP
                            </p>
                        </div>

                        <div className="bg-black/70 px-4 py-3 ring-1 ring-white/[0.08]">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                state
                            </p>
                            <p
                                className={`mt-1 text-sm font-black uppercase ${isCompleted
                                    ? "text-emerald-300"
                                    : "text-blue-300"
                                    }`}
                            >
                                {isCompleted ? "completed" : "running"}
                            </p>
                        </div>
                    </div>
                </div>

                {steps.length > 0 && (
                    <div className="mt-5 grid gap-2 md:grid-cols-3">
                        {steps.map((step, index) => {
                            const isActive = currentStep === index;
                            const isDone = currentStep > index;

                            return (
                                <div
                                    key={step}
                                    className={`p-3 ring-1 ${isActive
                                        ? "bg-blue-300/[0.10] ring-blue-300/[0.32]"
                                        : isDone
                                            ? "bg-emerald-300/[0.08] ring-emerald-300/[0.24]"
                                            : "bg-black/45 ring-white/[0.06]"
                                        }`}
                                >
                                    <p
                                        className={`text-[10px] uppercase tracking-[0.22em] ${isActive
                                            ? "text-blue-300"
                                            : isDone
                                                ? "text-emerald-300"
                                                : "text-slate-600"
                                            }`}
                                    >
                                        step_{String(index + 1).padStart(2, "0")}
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-slate-200">
                                        {step}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-5 bg-black/55 p-4 ring-1 ring-white/[0.08]">
                    {children}
                </div>

                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-5 bg-white/[0.035] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-slate-300 ring-1 ring-white/[0.08] transition hover:bg-blue-300/[0.10] hover:text-blue-200 hover:ring-blue-300/[0.28]"
                    >
                        retry_exercise
                    </button>
                )}
            </div>
        </section>
    );
}
