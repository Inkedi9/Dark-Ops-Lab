"use client";

import { useState } from "react";
import ExerciseHelpPanel from "../shared/ExerciseHelpPanel";
import ExerciseShell from "../shared/ExerciseShell";
import TerminalExercisePanel from "../shared/TerminalExercisePanel";

const scenarios = [
    {
        id: "trusted-consent",
        title: "Clear consent screen",
        appName: "Calendar Sync",
        redirectUri: "https://calendar.example.com/oauth/callback",
        requestedScopes: ["read calendar events", "create calendar events"],
        risk: "safer",
        signal: "expected_https_redirect",
        explanation:
            "This looks safer because the redirect URI uses HTTPS, matches the app domain, and the requested permissions are understandable.",
        fix:
            "Keep redirect URIs exact, use HTTPS, and request only permissions that match the app purpose.",
    },
    {
        id: "broad-scopes",
        title: "Too many permissions",
        appName: "Simple Notes Exporter",
        redirectUri: "https://notes.example.com/auth/callback",
        requestedScopes: ["read profile", "read email", "manage all files"],
        risk: "risky",
        signal: "overbroad_scopes",
        explanation:
            "This is risky because the requested permissions are broader than what the app seems to need.",
        fix:
            "Reduce scopes to the minimum needed. A notes exporter should not request broad file-management access unless clearly justified.",
    },
    {
        id: "strange-redirect",
        title: "Unexpected redirect URI",
        appName: "Team Dashboard",
        redirectUri: "http://unknown-redirect.test/callback",
        requestedScopes: ["read profile"],
        risk: "risky",
        signal: "unexpected_insecure_redirect",
        explanation:
            "This is risky because the redirect URI is unexpected and does not use HTTPS.",
        fix:
            "Use pre-registered HTTPS redirect URIs that match the trusted application domain.",
    },
];

function analyzeScenario(scenario) {
    const usesHttps = scenario.redirectUri.startsWith("https://");
    const hasBroadScope = scenario.requestedScopes.some((scope) =>
        scope.includes("manage all")
    );

    if (!usesHttps) {
        return {
            status: "danger",
            finding: "INSECURE_REDIRECT_URI",
            insight:
                "The callback target does not use HTTPS, which weakens the trust boundary of the OAuth flow.",
        };
    }

    if (hasBroadScope) {
        return {
            status: "warning",
            finding: "OVERBROAD_SCOPES",
            insight:
                "The app asks for more access than its purpose suggests. Least privilege should apply to OAuth scopes.",
        };
    }

    return {
        status: "success",
        finding: "CONSENT_LOOKS_REASONABLE",
        insight:
            "The redirect URI and requested scopes look aligned with the app purpose in this mocked review.",
    };
}

export default function OAuthExercise({ onCompleteExercise }) {
    const [selectedScenarioId, setSelectedScenarioId] = useState(scenarios[0].id);
    const [answer, setAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);

    const selectedScenario = scenarios.find(
        (scenario) => scenario.id === selectedScenarioId
    );

    const analysis = analyzeScenario(selectedScenario);
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
            eyebrow="OAUTH.REVIEW"
            title="OAuth Consent Review"
            description="Review a mocked consent screen, inspect redirect URI and scopes, then classify whether the authorization request looks safer or risky."
            steps={["Inspect consent", "Classify risk", "Read control"]}
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
                                    consent.case
                                </p>

                                <p className="mt-2 text-sm font-black text-white">
                                    {scenario.title}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    app: {scenario.appName}
                                </p>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    <div className="bg-black/55 p-5 ring-1 ring-white/[0.08]">
                        <div className="border-b border-white/10 pb-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                mock.consent_screen
                            </p>

                            <h3 className="mt-2 text-xl font-black text-white">
                                {selectedScenario.appName}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                This application wants access to your account.
                            </p>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                    redirect_uri
                                </p>
                                <p className="mt-2 break-all bg-slate-950/70 p-3 font-mono text-sm text-blue-200 ring-1 ring-white/[0.07]">
                                    {selectedScenario.redirectUri}
                                </p>
                            </div>

                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                    requested_scopes
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedScenario.requestedScopes.map((scope) => (
                                        <span
                                            key={scope}
                                            className="bg-violet-300/[0.08] px-3 py-1 font-mono text-xs text-violet-200 ring-1 ring-violet-300/[0.18]"
                                        >
                                            {scope}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <TerminalExercisePanel
                        title="oauth.analysis"
                        status={analysis.status}
                    >
                        <p>signal: {selectedScenario.signal}</p>
                        <p>finding: {analysis.finding}</p>
                        <p className="mt-3 text-slate-400">
                            → {analysis.insight}
                        </p>
                    </TerminalExercisePanel>
                </div>
            </div>

            <ExerciseHelpPanel
                hint="Check whether the redirect URI looks expected, uses HTTPS, and whether the requested permissions match the app purpose."
                whyItMatters="OAuth is useful, but unsafe redirect URIs or overly broad permissions can expose accounts or sensitive data."
            />

            <div className="mt-5 bg-black/55 p-5 ring-1 ring-white/[0.08]">
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
                    {["safer", "risky"].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                setAnswer(option);
                                setSubmitted(false);
                            }}
                            className={`p-4 text-left font-mono ring-1 transition ${answer === option
                                ? option === "safer"
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
