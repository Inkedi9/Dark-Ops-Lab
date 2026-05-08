import { useState } from "react";
import ExerciseHelpPanel from "../shared/ExerciseHelpPanel";
import ExerciseShell from "../shared/ExerciseShell";
import TerminalExercisePanel from "../shared/TerminalExercisePanel";

const patterns = [
    {
        id: "plain-text",
        title: "Plain text storage",
        example: "password = 'mySecret123'",
        risk: "risky",
        status: "danger",
        finding: "PASSWORD_READABLE",
        explanation:
            "Storing passwords in plain text means anyone with access to the database can read them directly.",
        leakedView: "mySecret123",
    },
    {
        id: "hashed-only",
        title: "Hashed password",
        example: "hash = hash(password)",
        risk: "better",
        status: "warning",
        finding: "IDENTICAL_PASSWORDS_MATCH",
        explanation:
            "Hashing protects passwords, but without salting, identical passwords can produce identical hashes.",
        leakedView: "5f4dcc3b5aa765d61d8327deb882cf99",
    },
    {
        id: "hashed-salted",
        title: "Hashed + salted password",
        example: "hash = hash(password + salt)",
        risk: "safer",
        status: "success",
        finding: "UNIQUE_HASH_PER_USER",
        explanation:
            "Salting helps ensure that even identical passwords produce different stored values.",
        leakedView: "salt:9xA2... hash:a81f4d7c...",
    },
];

export default function PasswordSecurityExercise({ onCompleteExercise }) {
    const [selectedId, setSelectedId] = useState("plain-text");
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);

    const selected = patterns.find((pattern) => pattern.id === selectedId);
    const isCorrect = selected?.risk === "safer";
    const currentStep = submitted ? 2 : selectedId ? 1 : 0;

    function handleSubmit() {
        if (!selected) return;

        setSubmitted(true);

        if (selected.risk === "safer" && !hasScored) {
            setScore((currentScore) => currentScore + 1);
            setHasScored(true);
        }
    }

    function handleRetry() {
        setSelectedId("plain-text");
        setSubmitted(false);
        setHasScored(false);
    }

    return (
        <ExerciseShell
            eyebrow="PASSWORD.STORAGE"
            title="Password Storage Review"
            description="Compare how passwords appear after a mocked database leak and identify the storage pattern that best protects users."
            steps={["Review storage", "Choose pattern", "Read control"]}
            currentStep={currentStep}
            score={score}
            status={submitted ? selected.status : "neutral"}
            xpReward={10}
            isCompleted={score > 0}
            onCompleteExercise={onCompleteExercise}
            onRetry={handleRetry}
        >
            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-3">
                    {patterns.map((pattern) => {
                        const isActive = selectedId === pattern.id;

                        return (
                            <button
                                key={pattern.id}
                                type="button"
                                onClick={() => {
                                    setSelectedId(pattern.id);
                                    setSubmitted(false);
                                }}
                                className={`w-full p-4 text-left font-mono ring-1 transition ${isActive
                                    ? "bg-blue-300/[0.10] ring-blue-300/[0.32]"
                                    : "bg-black/45 ring-white/[0.07] hover:bg-blue-300/[0.06] hover:ring-blue-300/[0.18]"
                                    }`}
                            >
                                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                    storage.pattern
                                </p>

                                <p className="mt-2 text-sm font-black text-white">
                                    {pattern.title}
                                </p>

                                <pre className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-400">
                                    {pattern.example}
                                </pre>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    <TerminalExercisePanel
                        title="database.leak.preview"
                        status={selected.status}
                    >
                        <p>pattern: {selected.id}</p>
                        <p>finding: {selected.finding}</p>

                        <div className="mt-3 border-l-2 border-current/40 pl-3">
                            <p>stored_value</p>
                            <p className="break-all text-slate-400">
                                {selected.leakedView}
                            </p>
                        </div>

                        <p className="mt-3 text-slate-400">
                            → What would an attacker learn from this leaked value?
                        </p>
                    </TerminalExercisePanel>

                    <div className="bg-black/55 p-5 ring-1 ring-white/[0.08]">
                        <div className="border-b border-white/10 pb-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                choose.best_control
                            </p>

                            <h3 className="mt-2 text-lg font-black text-white">
                                Which method is safest?
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!selected}
                            className="mt-5 w-full bg-blue-300/[0.10] px-5 py-3 font-mono text-sm font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-blue-300/[0.24] transition hover:bg-blue-300/[0.16] hover:ring-blue-300/[0.35] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            check_method
                        </button>
                    </div>
                </div>
            </div>

            <ExerciseHelpPanel
                hint="Think about what happens if the database is leaked. Can someone read passwords directly or compare users with the same password?"
                whyItMatters="Password storage is critical because leaked credentials can affect many accounts, especially when users reuse passwords."
            />

            {submitted && selected && (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <TerminalExercisePanel
                        title="storage.result"
                        status={isCorrect ? "success" : "warning"}
                    >
                        <p>{isCorrect ? "BEST_PATTERN_SELECTED" : "CONTROL_NOT_STRONG_ENOUGH"}</p>
                        <p className="mt-3 text-slate-400">
                            → {selected.explanation}
                        </p>
                    </TerminalExercisePanel>

                    <div className="bg-emerald-300/[0.055] p-5 ring-1 ring-emerald-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                            fix.pattern
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Store password hashes instead of raw passwords. Use unique salts
                            and a slow password hashing algorithm so leaked databases are
                            harder to abuse.
                        </p>
                    </div>
                </div>
            )}
        </ExerciseShell>
    );
}
