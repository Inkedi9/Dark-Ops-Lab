import { useState } from "react";
import ExerciseHelpPanel from "../shared/ExerciseHelpPanel";
import ExerciseShell from "../shared/ExerciseShell";
import TerminalExercisePanel from "../shared/TerminalExercisePanel";

const events = [
    {
        id: "normal-login",
        title: "Successful login",
        detail: "User kevin logged in successfully from a known device.",
        severity: "low",
        signal: "known_device_success",
        isSuspicious: false,
        explanation:
            "This looks like normal authentication activity from a known context.",
        triage:
            "No alert needed unless this appears with other suspicious signals.",
    },
    {
        id: "failed-burst",
        title: "Multiple failed logins",
        detail: "12 failed login attempts for admin in less than 2 minutes.",
        severity: "high",
        signal: "failed_login_burst_admin",
        isSuspicious: true,
        explanation:
            "A burst of failed login attempts can indicate password guessing or brute force activity.",
        triage:
            "Create an alert, review source IP, check account lockout, and investigate whether any successful login followed.",
    },
    {
        id: "asset-scan",
        title: "Inventory scan completed",
        detail: "Scheduled asset inventory scan completed successfully.",
        severity: "low",
        signal: "scheduled_inventory_scan",
        isSuspicious: false,
        explanation:
            "Scheduled scans can be normal if they match expected maintenance activity.",
        triage:
            "Validate it matches the expected scan window and known tooling.",
    },
];

export default function LoggingDetectionExercise({ onCompleteExercise }) {
    const [selectedEventId, setSelectedEventId] = useState(events[0].id);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);

    const selectedEvent = events.find((event) => event.id === selectedEventId);
    const currentStep = submitted ? 2 : selectedEventId ? 1 : 0;

    function handleSubmit() {
        if (!selectedEvent) return;

        setSubmitted(true);

        if (selectedEvent.isSuspicious && !hasScored) {
            setScore((currentScore) => currentScore + 1);
            setHasScored(true);
        }
    }

    function handleRetry() {
        setSelectedEventId(events[0].id);
        setSubmitted(false);
        setHasScored(false);
    }

    return (
        <ExerciseShell
            eyebrow="SOC.TRIAGE"
            title="Suspicious Log Triage"
            description="Review mocked security events, identify which one deserves investigation, and read the defender triage logic."
            steps={["Review events", "Select alert", "Triage signal"]}
            currentStep={currentStep}
            score={score}
            status={
                submitted
                    ? selectedEvent.isSuspicious
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
                <div className="space-y-3">
                    {events.map((event) => {
                        const isSelected = selectedEventId === event.id;

                        return (
                            <button
                                key={event.id}
                                type="button"
                                onClick={() => {
                                    setSelectedEventId(event.id);
                                    setSubmitted(false);
                                }}
                                className={`w-full p-4 text-left font-mono ring-1 transition ${isSelected
                                    ? "bg-blue-300/[0.10] ring-blue-300/[0.32]"
                                    : "bg-black/45 ring-white/[0.07] hover:bg-blue-300/[0.06] hover:ring-blue-300/[0.18]"
                                    }`}
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                            log.event
                                        </p>

                                        <p className="mt-2 text-sm font-black text-white">
                                            {event.title}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] ring-1 ${event.severity === "high"
                                            ? "bg-amber-300/[0.08] text-amber-200 ring-amber-300/[0.24]"
                                            : "bg-white/[0.035] text-slate-400 ring-white/[0.07]"
                                            }`}
                                    >
                                        {event.severity}
                                    </span>
                                </div>

                                <p className="mt-3 text-xs leading-5 text-slate-400">
                                    {event.detail}
                                </p>
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedEvent}
                        className="w-full bg-blue-300/[0.10] px-5 py-3 font-mono text-sm font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-blue-300/[0.24] transition hover:bg-blue-300/[0.16] hover:ring-blue-300/[0.35] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        mark_for_triage
                    </button>
                </div>

                <div className="space-y-4">
                    <TerminalExercisePanel
                        title="event.payload"
                        status={
                            selectedEvent.severity === "high"
                                ? "warning"
                                : "neutral"
                        }
                    >
                        <p>event_id: {selectedEvent.id}</p>
                        <p>signal: {selectedEvent.signal}</p>
                        <p>severity: {selectedEvent.severity}</p>
                        <p className="mt-3 text-slate-400">
                            → {selectedEvent.detail}
                        </p>
                    </TerminalExercisePanel>

                    {submitted && (
                        <TerminalExercisePanel
                            title="triage.result"
                            status={selectedEvent.isSuspicious ? "success" : "warning"}
                        >
                            <p>
                                {selectedEvent.isSuspicious
                                    ? "ALERT_WORTHY_SIGNAL"
                                    : "LIKELY_NORMAL_ACTIVITY"}
                            </p>

                            <p className="mt-3 text-slate-400">
                                → {selectedEvent.explanation}
                            </p>

                            <div className="mt-3 border-l-2 border-current/40 pl-3">
                                <p>next_step</p>
                                <p className="text-slate-400">
                                    {selectedEvent.triage}
                                </p>
                            </div>
                        </TerminalExercisePanel>
                    )}
                </div>
            </div>

            <ExerciseHelpPanel
                hint="Look for unusual frequency, sensitive accounts, unexpected locations, or repeated failures."
                whyItMatters="Detection is about spotting behavior that stands out from normal activity. Logs become useful when they help defenders ask better questions."
            />

            {submitted && (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="bg-amber-300/[0.055] p-5 ring-1 ring-amber-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
                            detection.insight
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Logs are not automatically useful. They become useful when
                            defenders can connect event type, frequency, account sensitivity,
                            source context, and timing.
                        </p>
                    </div>

                    <div className="bg-emerald-300/[0.055] p-5 ring-1 ring-emerald-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                            control.pattern
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Good detection rules focus on meaningful patterns: repeated
                            failures, sensitive users, unexpected access, and activity that
                            differs from normal behavior.
                        </p>
                    </div>
                </div>
            )}
        </ExerciseShell>
    );
}
