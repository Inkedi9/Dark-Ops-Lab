"use client";

import { useState } from "react";

export default function QuizCard({
    eyebrow = "Quiz",
    title,
    question,
    options = [],
    correctAnswer,
    explanation,
    onCorrectAnswer,
}) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasScored, setHasScored] = useState(false);

    const hasAnswered = selectedAnswer !== null;
    const isCorrect = selectedAnswer === correctAnswer;

    function handleAnswer(option) {
        setSelectedAnswer(option);

        if (option === correctAnswer && !hasScored) {
            setHasScored(true);
            onCorrectAnswer?.();
        }
    }

    return (
        <section className="rounded-md relative overflow-hidden bg-[#020409] p-5 font-mono shadow-[0_24px_100px_rgba(0,0,0,0.85)] ring-1 ring-violet-300/[0.20]">
            <div className="pointer-events-none absolute inset-0 terminal-scanline opacity-[0.12]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(96,165,250,0.10),transparent_28%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-violet-300/70" />

            <div className="relative">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-md bg-violet-300/[0.10] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-violet-200 ring-1 ring-violet-300/[0.25]">
                                quiz.checkpoint
                            </span>

                            <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                {eyebrow}
                            </span>
                        </div>

                        <h3 className="mt-4 text-xl font-black tracking-tight text-white">
                            {title}
                        </h3>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                            {question}
                        </p>
                    </div>

                    <div
                        className={`rounded-md bg-black/70 px-4 py-3 ring-1 transition ${hasScored
                            ? "ring-emerald-300/[0.35]"
                            : "ring-white/[0.08]"
                            }`}
                    >
                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                            reward
                        </p>

                        <p
                            className={`mt-1 text-2xl font-black ${hasScored ? "text-emerald-300" : "text-slate-300"
                                }`}
                        >
                            +5 XP
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-3">
                    {options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectOption = option === correctAnswer;

                        const stateClass =
                            hasAnswered && isCorrectOption
                                ? "bg-emerald-300/[0.10] text-emerald-200 ring-emerald-300/[0.35]"
                                : isSelected
                                    ? "bg-amber-300/[0.10] text-amber-200 ring-amber-300/[0.35]"
                                    : "bg-black/45 text-slate-300 ring-white/[0.07] hover:bg-blue-300/[0.08] hover:text-blue-200 hover:ring-blue-300/[0.24]";

                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleAnswer(option)}
                                className={`rounded-md w-full p-4 text-left text-sm transition ring-1 ${stateClass}`}
                            >
                                <span className="mr-3 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                    opt_{String(index + 1).padStart(2, "0")}
                                </span>

                                {hasAnswered && isCorrectOption ? "✓ " : ""}
                                {option}
                            </button>
                        );
                    })}
                </div>

                {hasAnswered && (
                    <div
                        className={`mt-5 p-4 ring-1 ${isCorrect
                            ? "bg-emerald-300/[0.08] ring-emerald-300/[0.26]"
                            : "bg-amber-300/[0.08] ring-amber-300/[0.26]"
                            }`}
                    >
                        <p
                            className={`text-xs font-black uppercase tracking-[0.22em] ${isCorrect ? "text-emerald-300" : "text-amber-300"
                                }`}
                        >
                            {isCorrect ? "result:correct" : "result:retry"}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            {explanation}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
