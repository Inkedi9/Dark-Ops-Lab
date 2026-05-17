import { useState } from "react";
import ExerciseHelpPanel from "../shared/ExerciseHelpPanel";
import ExerciseShell from "../shared/ExerciseShell";
import TerminalExercisePanel from "../shared/TerminalExercisePanel";

const signals = [
    {
        id: "sender",
        label: "Sender domain",
        value: "security@paypaI-support.com",
        isSuspicious: true,
        severity: "high",
        finding: "LOOKALIKE_DOMAIN",
        explanation:
            "The domain looks like a trusted brand, but it uses a misleading spelling.",
        action:
            "Do not click links. Verify by visiting the official website directly.",
    },
    {
        id: "urgency",
        label: "Message tone",
        value: "Your account will be closed in 30 minutes.",
        isSuspicious: true,
        severity: "medium",
        finding: "URGENCY_PRESSURE",
        explanation:
            "Strong urgency is commonly used to pressure users into acting quickly.",
        action:
            "Pause and verify. Urgent language is a signal to slow down, not speed up.",
    },
    {
        id: "logo",
        label: "Brand logo",
        value: "A familiar payment logo is displayed.",
        isSuspicious: false,
        severity: "low",
        finding: "BRANDING_NOT_PROOF",
        explanation:
            "A logo alone does not prove the message is legitimate. Attackers can copy visual branding.",
        action:
            "Treat branding as weak evidence. Check sender, links, and request context.",
    },
];

export default function PhishingExercise({ onCompleteExercise }) {
    const [selectedSignalId, setSelectedSignalId] = useState(signals[0].id);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);

    const selectedSignal = signals.find(
        (signal) => signal.id === selectedSignalId
    );

    const currentStep = submitted ? 2 : selectedSignalId ? 1 : 0;

    function handleSubmit() {
        if (!selectedSignal) return;

        setSubmitted(true);

        if (selectedSignal.isSuspicious && !hasScored) {
            setScore((currentScore) => currentScore + 1);
            setHasScored(true);
        }
    }

    function handleRetry() {
        setSelectedSignalId(signals[0].id);
        setSubmitted(false);
        setHasScored(false);
    }

    return (
        <ExerciseShell
            eyebrow="PHISHING.INVESTIGATION"
            title="Suspicious Email Review"
            description="Inspect a mocked phishing email, identify the strongest suspicious signal, then read the safe response pattern."
            steps={["Review message", "Select signal", "Decide action"]}
            currentStep={currentStep}
            score={score}
            status={
                submitted
                    ? selectedSignal.isSuspicious
                        ? "success"
                        : "warning"
                    : "neutral"
            }
            xpReward={10}
            isCompleted={score > 0}
            onCompleteExercise={onCompleteExercise}
            onRetry={handleRetry}
        >
            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-4">
                    <div className="bg-black/55 p-5 ring-1 ring-white/[0.08]">
                        <div className="border-b border-white/10 pb-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                mock.email
                            </p>

                            <h3 className="mt-2 text-lg font-black text-white">
                                Urgent account verification required
                            </h3>
                        </div>

                        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                    from
                                </p>
                                <p className="mt-1 break-all font-mono text-blue-200">
                                    security@paypaI-support.com
                                </p>
                            </div>

                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                    subject
                                </p>
                                <p className="mt-1 text-white">
                                    Urgent account verification required
                                </p>
                            </div>

                            <div className="bg-slate-950/70 p-4 ring-1 ring-white/[0.07]">
                                <p>
                                    Your account will be closed in 30 minutes.
                                    Click the link below to confirm your payment
                                    details.
                                </p>

                                <button
                                    type="button"
                                    className="mt-4 bg-blue-300/[0.10] px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-blue-300/[0.22]"
                                >
                                    confirm_account
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedSignal}
                        className="w-full bg-blue-300/[0.10] px-5 py-3 font-mono text-sm font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-blue-300/[0.24] transition hover:bg-blue-300/[0.16] hover:ring-blue-300/[0.35] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        check_signal
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-3">
                        {signals.map((signal) => {
                            const isSelected = selectedSignalId === signal.id;

                            return (
                                <button
                                    key={signal.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedSignalId(signal.id);
                                        setSubmitted(false);
                                    }}
                                    className={`w-full p-4 text-left font-mono ring-1 transition ${isSelected
                                        ? "bg-blue-300/[0.10] ring-blue-300/[0.32]"
                                        : "bg-black/45 ring-white/[0.07] hover:bg-blue-300/[0.06] hover:ring-blue-300/[0.18]"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                                signal
                                            </p>

                                            <p className="mt-2 text-sm font-black text-white">
                                                {signal.label}
                                            </p>
                                        </div>

                                        <span
                                            className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] ring-1 ${signal.severity === "high"
                                                ? "bg-red-300/[0.08] text-red-200 ring-red-300/[0.24]"
                                                : signal.severity === "medium"
                                                    ? "bg-amber-300/[0.08] text-amber-200 ring-amber-300/[0.24]"
                                                    : "bg-white/[0.035] text-slate-400 ring-white/[0.07]"
                                                }`}
                                        >
                                            {signal.severity}
                                        </span>
                                    </div>

                                    <p className="mt-3 break-all text-xs leading-5 text-slate-400">
                                        {signal.value}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    <TerminalExercisePanel
                        title="signal.analysis"
                        status={
                            selectedSignal.isSuspicious
                                ? selectedSignal.severity === "high"
                                    ? "danger"
                                    : "warning"
                                : "neutral"
                        }
                    >
                        <p>finding: {selectedSignal.finding}</p>
                        <p>severity: {selectedSignal.severity}</p>
                        <p className="mt-3 text-slate-400">
                            → Select the signal you think matters most.
                        </p>
                    </TerminalExercisePanel>
                </div>
            </div>

            <ExerciseHelpPanel
                hint="Look for pressure, strange domains, unexpected links, and requests for sensitive information."
                whyItMatters="Phishing works by manipulating trust and urgency. Learning to slow down and inspect signals reduces risk."
            />

            {submitted && selectedSignal && (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <TerminalExercisePanel
                        title="review.result"
                        status={selectedSignal.isSuspicious ? "success" : "warning"}
                    >
                        <p>
                            {selectedSignal.isSuspicious
                                ? "SUSPICIOUS_SIGNAL_CONFIRMED"
                                : "WEAK_SIGNAL_BY_ITSELF"}
                        </p>

                        <p className="mt-3 text-slate-400">
                            → {selectedSignal.explanation}
                        </p>
                    </TerminalExercisePanel>

                    <div className="bg-emerald-300/[0.055] p-5 ring-1 ring-emerald-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                            safe.response
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            {selectedSignal.action}
                        </p>
                    </div>
                </div>
            )}
        </ExerciseShell>
    );
}
