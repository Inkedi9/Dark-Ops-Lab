"use client";

import { useState } from "react";
import ExerciseHelpPanel from "../shared/ExerciseHelpPanel";
import ExerciseShell from "../shared/ExerciseShell";
import TerminalExercisePanel from "../shared/TerminalExercisePanel";

const scenarios = [
    {
        id: "short-session",
        title: "Session expires after inactivity",
        description:
            "The application signs the user out after a reasonable period of inactivity.",
        risk: "safe",
        signal: "session_expiry_enabled",
        systemOutput: "SESSION_EXPIRED_AFTER_IDLE_TIME",
        explanation:
            "This is safer because inactive sessions should not stay valid forever.",
        fix:
            "Keep idle timeouts, rotate sessions after sensitive actions, and require re-authentication when needed.",
    },
    {
        id: "weak-reset",
        title: "Password reset link never expires",
        description:
            "A password reset link remains valid even several days after being sent.",
        risk: "risky",
        signal: "reset_token_no_expiry",
        systemOutput: "RESET_TOKEN_ACCEPTED_AFTER_LONG_DELAY",
        explanation:
            "This is risky because old reset links could be reused if someone gains access to them later.",
        fix:
            "Use short-lived reset tokens, single-use links, and invalidate old reset requests.",
    },
    {
        id: "generic-error",
        title: "Generic login error message",
        description:
            "The login form says 'Invalid email or password' instead of revealing which field is wrong.",
        risk: "safe",
        signal: "generic_auth_error",
        systemOutput: "LOGIN_ERROR_DOES_NOT_REVEAL_ACCOUNT_STATE",
        explanation:
            "This is safer because it avoids confirming whether a specific account exists.",
        fix:
            "Keep login errors generic and add rate limiting or monitoring for repeated failures.",
    },
];

export default function BrokenAuthExercise({ onCompleteExercise }) {
    const [selectedScenarioId, setSelectedScenarioId] = useState(scenarios[0].id);
    const [answer, setAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);

    const selectedScenario = scenarios.find(
        (scenario) => scenario.id === selectedScenarioId
    );

    const isCorrect = answer === selectedScenario.risk;
    const currentStep = submitted ? 2 : answer ? 1 : 0;

    function handleScenarioChange(id) {
        setSelectedScenarioId(id);
        setAnswer(null);
        setSubmitted(false);
    }

    function handleSubmit() {
        if (!answer) return;

        setSubmitted(true);

        if (answer === selectedScenario.risk && !hasScored) {
            setScore((currentScore) => currentScore + 1);
            setHasScored(true);
        }
    }

    function handleRetry() {
        setSelectedScenarioId(scenarios[0].id);
        setAnswer(null);
        setSubmitted(false);
        setHasScored(false);
    }

    return (
        <ExerciseShell
            eyebrow="AUTH.SANDBOX"
            title="Authentication Flow Review"
            description="Review mocked authentication behaviors, classify the risk, then compare the safer control pattern."
            steps={["Review signal", "Classify risk", "Read control"]}
            currentStep={currentStep}
            score={score}
            status={submitted ? (isCorrect ? "success" : "warning") : "neutral"}
            xpReward={10}
            isCompleted={score > 0}
            onCompleteExercise={onCompleteExercise}
            onRetry={handleRetry}
        >
            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-3">
                    {scenarios.map((scenario) => {
                        const isActive = selectedScenarioId === scenario.id;

                        return (
                            <button
                                key={scenario.id}
                                type="button"
                                onClick={() => handleScenarioChange(scenario.id)}
                                className={`w-full p-4 text-left font-mono ring-1 transition ${isActive
                                    ? "bg-blue-300/[0.10] ring-blue-300/[0.32]"
                                    : "bg-black/45 ring-white/[0.07] hover:bg-blue-300/[0.06] hover:ring-blue-300/[0.18]"
                                    }`}
                            >
                                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                    auth.signal
                                </p>

                                <p className="mt-2 text-sm font-black text-white">
                                    {scenario.title}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {scenario.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    <TerminalExercisePanel
                        title="auth.event"
                        status={
                            selectedScenario.risk === "risky"
                                ? "warning"
                                : "success"
                        }
                    >
                        <p>signal: {selectedScenario.signal}</p>
                        <p>output: {selectedScenario.systemOutput}</p>
                        <p className="mt-3 text-slate-400">
                            → Decide whether this behavior is safe or risky.
                        </p>
                    </TerminalExercisePanel>

                    <div className="bg-black/55 p-5 ring-1 ring-white/[0.08]">
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                    risk.classification
                                </p>

                                <h3 className="mt-2 text-lg font-black text-white">
                                    Your answer
                                </h3>
                            </div>

                            <span className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-blue-200 ring-1 ring-blue-300/[0.22]">
                                choose_one
                            </span>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {["safe", "risky"].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        setAnswer(option);
                                        setSubmitted(false);
                                    }}
                                    className={`p-4 text-left font-mono ring-1 transition ${answer === option
                                        ? option === "safe"
                                            ? "bg-emerald-300/[0.10] text-emerald-200 ring-emerald-300/[0.32]"
                                            : "bg-amber-300/[0.10] text-amber-200 ring-amber-300/[0.32]"
                                        : "bg-white/[0.035] text-slate-300 ring-white/[0.07] hover:bg-white/[0.055]"
                                        }`}
                                >
                                    <p className="text-[10px] uppercase tracking-[0.22em]">
                                        mark_as
                                    </p>
                                    <p className="mt-2 text-sm font-black uppercase">
                                        {option}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!answer}
                            className="mt-5 w-full bg-blue-300/[0.10] px-5 py-3 font-mono text-sm font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-blue-300/[0.24] transition hover:bg-blue-300/[0.16] hover:ring-blue-300/[0.35] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            check_answer
                        </button>
                    </div>
                </div>
            </div>

            <ExerciseHelpPanel
                hint="Look at how long credentials, sessions, or reset links remain useful. Time limits and generic errors are strong safety signals."
                whyItMatters="Authentication issues often come from small design decisions: long-lived reset links, weak sessions, revealing login errors, or missing re-authentication."
            />

            {submitted && (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <TerminalExercisePanel
                        title="classification.result"
                        status={isCorrect ? "success" : "warning"}
                    >
                        <p>{isCorrect ? "CORRECT_CLASSIFICATION" : "REVIEW_NEEDED"}</p>
                        <p className="mt-3 text-slate-400">
                            → {selectedScenario.explanation}
                        </p>
                    </TerminalExercisePanel>

                    <div className="bg-emerald-300/[0.055] p-5 ring-1 ring-emerald-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                            control.pattern
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            {selectedScenario.fix}
                        </p>
                    </div>
                </div>
            )}
        </ExerciseShell>
    );
}
