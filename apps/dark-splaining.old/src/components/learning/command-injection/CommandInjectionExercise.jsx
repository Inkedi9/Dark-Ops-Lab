import { useState } from "react";
import ExerciseHelpPanel from "../shared/ExerciseHelpPanel";
import ExerciseShell from "../shared/ExerciseShell";
import TerminalExercisePanel from "../shared/TerminalExercisePanel";

const inputs = [
    {
        label: "normal_domain",
        value: "example.com",
    },
    {
        label: "command_chain",
        value: "example.com && whoami",
    },
    {
        label: "pipe_payload",
        value: "example.com | id",
    },
    {
        label: "internal_host",
        value: "internal-service.local",
    },
];

function analyzeInput(input) {
    const suspiciousTokens = ["&&", ";", "|", "`", "$("];
    const matchedToken = suspiciousTokens.find((token) => input.includes(token));

    if (matchedToken) {
        return {
            risk: "high",
            status: "warning",
            title: "Command-like behavior detected",
            signal: `operator_detected:${matchedToken}`,
            message:
                "This input tries to add command behavior. A vulnerable app could execute more than the intended ping.",
            insight:
                "The problem is not the hostname itself. The problem is treating raw input as part of shell command logic.",
        };
    }

    return {
        risk: "low",
        status: "success",
        title: "Normal-looking hostname",
        signal: "hostname_like_input",
        message:
            "This looks like a normal hostname in the mocked scenario.",
        insight:
            "Even normal-looking input should still be validated and passed through safer APIs.",
    };
}

function buildUnsafeCommand(input) {
    return `ping ${input}`;
}

function buildSafeCommand() {
    return `ping -- <validated-hostname>`;
}

export default function CommandInjectionExercise({ onCompleteExercise }) {
    const [input, setInput] = useState("example.com");
    const [mode, setMode] = useState("attack");
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);

    const isAttackMode = mode === "attack";
    const analysis = analyzeInput(input);
    const command = isAttackMode ? buildUnsafeCommand(input) : buildSafeCommand();

    const isSuspicious = analysis.risk === "high";
    const isLearningWin = submitted && (isSuspicious || !isAttackMode);
    const currentStep = submitted ? 2 : input ? 1 : 0;

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);

        if (isLearningWin && !hasScored) {
            setScore((currentScore) => currentScore + 1);
            setHasScored(true);
        }
    }

    function handleRetry() {
        setInput("example.com");
        setMode("attack");
        setSubmitted(false);
        setHasScored(false);
    }

    function applyInput(item) {
        setInput(item.value);
        setSubmitted(false);
    }

    return (
        <ExerciseShell
            eyebrow="COMMAND.SANDBOX"
            title="Command Injection Playground"
            description="Inspect how hostname input can become dangerous when it is mixed into shell command logic, then compare it with a safer execution pattern."
            steps={["Choose input", "Run command", "Compare fix"]}
            currentStep={currentStep}
            score={score}
            status={submitted ? analysis.status : "neutral"}
            xpReward={10}
            isCompleted={score > 0}
            onCompleteExercise={onCompleteExercise}
            onRetry={handleRetry}
        >
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => {
                        setMode("attack");
                        setSubmitted(false);
                    }}
                    className={`p-4 text-left font-mono ring-1 transition ${isAttackMode
                        ? "bg-amber-300/[0.10] text-amber-200 ring-amber-300/[0.35]"
                        : "bg-black/45 text-slate-400 ring-white/[0.07] hover:text-amber-200 hover:ring-amber-300/[0.22]"
                        }`}
                >
                    <p className="text-[10px] uppercase tracking-[0.25em]">
                        attack_mode
                    </p>
                    <p className="mt-2 text-sm font-black text-white">
                        Unsafe shell command
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Raw input is concatenated into command logic.
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setMode("fix");
                        setSubmitted(false);
                    }}
                    className={`p-4 text-left font-mono ring-1 transition ${!isAttackMode
                        ? "bg-emerald-300/[0.10] text-emerald-200 ring-emerald-300/[0.35]"
                        : "bg-black/45 text-slate-400 ring-white/[0.07] hover:text-emerald-200 hover:ring-emerald-300/[0.22]"
                        }`}
                >
                    <p className="text-[10px] uppercase tracking-[0.25em]">
                        fix_mode
                    </p>
                    <p className="mt-2 text-sm font-black text-white">
                        Validated execution
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Validate input and avoid shell interpretation.
                    </p>
                </button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <form
                    onSubmit={handleSubmit}
                    className="bg-black/55 p-5 ring-1 ring-white/[0.08]"
                >
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                diagnostic.tool
                            </p>

                            <h3 className="mt-2 text-lg font-black text-white">
                                Enter hostname
                            </h3>
                        </div>

                        <span
                            className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ring-1 ${isAttackMode
                                ? "bg-amber-300/[0.08] text-amber-200 ring-amber-300/[0.24]"
                                : "bg-emerald-300/[0.08] text-emerald-200 ring-emerald-300/[0.24]"
                                }`}
                        >
                            {isAttackMode ? "unsafe" : "validated"}
                        </span>
                    </div>

                    <input
                        value={input}
                        onChange={(event) => {
                            setInput(event.target.value);
                            setSubmitted(false);
                        }}
                        className="mt-5 w-full bg-slate-950/80 px-4 py-3 font-mono text-sm text-slate-100 outline-none ring-1 ring-white/[0.08] transition placeholder:text-slate-600 focus:ring-blue-300/[0.35]"
                        placeholder="example.com"
                    />

                    <div className="mt-5 flex flex-wrap gap-2">
                        {inputs.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => applyInput(item)}
                                className="bg-white/[0.035] px-3 py-2 font-mono text-[11px] text-slate-300 ring-1 ring-white/[0.07] transition hover:bg-blue-300/[0.08] hover:text-blue-200 hover:ring-blue-300/[0.24]"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button className="mt-5 w-full bg-blue-300/[0.10] px-5 py-3 font-mono text-sm font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-blue-300/[0.24] transition hover:bg-blue-300/[0.16] hover:ring-blue-300/[0.35]">
                        run_command_simulation
                    </button>
                </form>

                <div className="space-y-4">
                    <TerminalExercisePanel
                        title={isAttackMode ? "unsafe.command" : "safe.command"}
                        status={isAttackMode ? "warning" : "success"}
                    >
                        <pre className="overflow-x-auto whitespace-pre-wrap">
                            {command}
                        </pre>
                    </TerminalExercisePanel>

                    {submitted && (
                        <TerminalExercisePanel
                            title="sandbox.analysis"
                            status={isAttackMode ? analysis.status : "success"}
                        >
                            <p>{analysis.title}</p>
                            <p className="mt-2 text-slate-400">
                                signal: {analysis.signal}
                            </p>

                            {isAttackMode && isSuspicious && (
                                <div className="mt-3 border-l-2 border-current/40 pl-3">
                                    <p>mocked.effect</p>
                                    <p className="text-slate-400">
                                        Additional command behavior would be possible in a
                                        vulnerable shell context.
                                    </p>
                                </div>
                            )}

                            {!isAttackMode && (
                                <div className="mt-3 border-l-2 border-current/40 pl-3">
                                    <p>mocked.effect</p>
                                    <p className="text-slate-400">
                                        Payload-like text is rejected or handled outside shell
                                        interpretation.
                                    </p>
                                </div>
                            )}

                            <p className="mt-3 text-slate-400">
                                → {analysis.insight}
                            </p>
                        </TerminalExercisePanel>
                    )}
                </div>
            </div>

            <ExerciseHelpPanel
                hint="Try command_chain or pipe_payload in attack mode, then switch to fix mode and compare the output."
                whyItMatters="Command injection can happen when applications pass unsafe input into operating system commands. Safer designs validate input and avoid shell execution with raw values."
            />

            {submitted && (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="bg-amber-300/[0.055] p-5 ring-1 ring-amber-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
                            attack.insight
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            The unsafe version builds a command with string concatenation.
                            If user input contains shell operators, the shell may interpret
                            those characters as command logic instead of data.
                        </p>
                    </div>

                    <div className="bg-emerald-300/[0.055] p-5 ring-1 ring-emerald-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                            fix.pattern
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Validate allowed hostname characters, reject suspicious operators,
                            and prefer APIs that pass arguments directly instead of invoking a
                            shell with raw user input.
                        </p>
                    </div>
                </div>
            )}
        </ExerciseShell>
    );
}
