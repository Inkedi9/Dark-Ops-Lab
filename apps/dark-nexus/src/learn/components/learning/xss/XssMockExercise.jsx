"use client";

import { useState } from "react";
import ExerciseHelpPanel from "../shared/ExerciseHelpPanel";
import ExerciseShell from "../shared/ExerciseShell";
import TerminalExercisePanel from "../shared/TerminalExercisePanel";

const payloads = [
    {
        label: "normal_comment",
        value: "This lesson was helpful!",
    },
    {
        label: "html_markup",
        value: "<strong>Great explanation</strong>",
    },
    {
        label: "script_payload",
        value: "<script>alert('xss')</script>",
    },
    {
        label: "image_payload",
        value: "<img src=x onerror=alert('xss') />",
    },
];

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function analyzeComment(comment) {
    const lowerComment = comment.toLowerCase();

    const containsMarkup = comment.includes("<") || comment.includes(">");
    const containsScript = lowerComment.includes("<script");
    const containsEventHandler =
        lowerComment.includes("onerror=") || lowerComment.includes("onclick=");

    if (containsScript || containsEventHandler) {
        return {
            risk: "high",
            status: "danger",
            title: "Potential XSS payload detected",
            signal: "script-like behavior detected",
            message:
                "This input contains script-like behavior. A vulnerable page might treat it as executable content instead of plain text.",
            insight:
                "The browser trusts rendered HTML. If user input becomes HTML, attacker-controlled behavior can enter the page.",
        };
    }

    if (containsMarkup) {
        return {
            risk: "medium",
            status: "warning",
            title: "Markup-like input detected",
            signal: "html-like characters detected",
            message:
                "This input contains HTML-like characters. It may be safe in some contexts, but user content should not be trusted as raw HTML.",
            insight:
                "Even harmless-looking markup proves the app is interpreting user content as structure instead of text.",
        };
    }

    return {
        risk: "low",
        status: "success",
        title: "Normal text comment",
        signal: "plain text input",
        message:
            "This looks like normal text. Even normal-looking user content should still be escaped before rendering.",
        insight:
            "Safe rendering should be consistent: treat every user comment as text by default.",
    };
}

export default function XssMockExercise({ onCompleteExercise }) {
    const [comment, setComment] = useState("This lesson was helpful!");
    const [mode, setMode] = useState("attack");
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);

    const isAttackMode = mode === "attack";
    const analysis = analyzeComment(comment);
    const safePreview = escapeHtml(comment);

    const isRisky = analysis.risk === "high" || analysis.risk === "medium";
    const isLearningWin = submitted && (isRisky || !isAttackMode);
    const currentStep = submitted ? 2 : comment ? 1 : 0;

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);

        if (isLearningWin && !hasScored) {
            setScore((currentScore) => currentScore + 1);
            setHasScored(true);
        }
    }

    function handleRetry() {
        setComment("This lesson was helpful!");
        setMode("attack");
        setSubmitted(false);
        setHasScored(false);
    }

    function applyPayload(payload) {
        setComment(payload.value);
        setSubmitted(false);
    }

    return (
        <ExerciseShell
            eyebrow="CLIENT.SIDE.SANDBOX"
            title="XSS Comment Playground"
            description="Render user-controlled comments in attack mode, then switch to fix mode to see how escaping turns dangerous markup into safe text."
            steps={["Choose payload", "Render preview", "Compare fix"]}
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
                        Vulnerable render
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        App trusts comment as HTML.
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
                        Escaped text render
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        App displays comment as text.
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
                                mock.comment_form
                            </p>

                            <h3 className="mt-2 text-lg font-black text-white">
                                Write a comment
                            </h3>
                        </div>

                        <span
                            className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ring-1 ${isAttackMode
                                ? "bg-amber-300/[0.08] text-amber-200 ring-amber-300/[0.24]"
                                : "bg-emerald-300/[0.08] text-emerald-200 ring-emerald-300/[0.24]"
                                }`}
                        >
                            {isAttackMode ? "raw_html" : "escaped"}
                        </span>
                    </div>

                    <textarea
                        value={comment}
                        onChange={(event) => {
                            setComment(event.target.value);
                            setSubmitted(false);
                        }}
                        rows={7}
                        className="mt-5 w-full resize-none bg-slate-950/80 px-4 py-3 font-mono text-sm text-slate-100 outline-none ring-1 ring-white/[0.08] transition placeholder:text-slate-600 focus:ring-blue-300/[0.35]"
                        placeholder="Write a comment..."
                    />

                    <div className="mt-5 flex flex-wrap gap-2">
                        {payloads.map((payload) => (
                            <button
                                key={payload.label}
                                type="button"
                                onClick={() => applyPayload(payload)}
                                className="bg-white/[0.035] px-3 py-2 font-mono text-[11px] text-slate-300 ring-1 ring-white/[0.07] transition hover:bg-blue-300/[0.08] hover:text-blue-200 hover:ring-blue-300/[0.24]"
                            >
                                {payload.label}
                            </button>
                        ))}
                    </div>

                    <button className="mt-5 w-full bg-blue-300/[0.10] px-5 py-3 font-mono text-sm font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-blue-300/[0.24] transition hover:bg-blue-300/[0.16] hover:ring-blue-300/[0.35]">
                        render_comment
                    </button>
                </form>

                <div className="space-y-4">
                    <TerminalExercisePanel
                        title={isAttackMode ? "vulnerable.preview" : "safe.preview"}
                        status={
                            submitted
                                ? isAttackMode
                                    ? analysis.status
                                    : "success"
                                : "neutral"
                        }
                    >
                        <div className="border-b border-white/10 pb-3">
                            <p className="text-slate-500">render.strategy</p>
                            <p className={isAttackMode ? "text-amber-200" : "text-emerald-200"}>
                                {isAttackMode
                                    ? "dangerously trust user HTML"
                                    : "escape user content before rendering"}
                            </p>
                        </div>

                        <div className="mt-4 bg-black/40 p-4 ring-1 ring-white/[0.07]">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center bg-blue-300/[0.10] font-mono text-xs font-bold text-blue-200 ring-1 ring-blue-300/[0.18]">
                                    U
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-white">
                                        User comment
                                    </p>
                                    <p className="font-mono text-xs text-slate-500">
                                        rendered by mock app
                                    </p>
                                </div>
                            </div>

                            {isAttackMode ? (
                                <div className="bg-amber-300/[0.045] p-4 ring-1 ring-amber-300/[0.16]">
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-amber-300">
                                        raw_html_interpretation
                                    </p>

                                    <div className="mt-3 text-sm leading-6 text-slate-300">
                                        {analysis.risk === "high" ? (
                                            <div className="bg-red-300/[0.09] p-3 ring-1 ring-red-300/[0.24]">
                                                <p className="font-bold text-red-200">
                                                    SCRIPT EXECUTION SIMULATED / BLOCKED
                                                </p>
                                                <p className="mt-2 text-xs leading-5 text-slate-300">
                                                    DarkSplaining does not execute payloads. This
                                                    sandbox shows what a vulnerable page would risk.
                                                </p>
                                            </div>
                                        ) : analysis.risk === "medium" ? (
                                            <div>
                                                <p className="font-bold text-amber-100">
                                                    HTML-like content would be interpreted.
                                                </p>
                                                <p className="mt-2 text-slate-300">
                                                    The comment is acting like page structure,
                                                    not plain text.
                                                </p>
                                            </div>
                                        ) : (
                                            <p>{comment}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-emerald-300/[0.045] p-4 ring-1 ring-emerald-300/[0.16]">
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-300">
                                        escaped_text_output
                                    </p>

                                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-emerald-100">
                                        {safePreview}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </TerminalExercisePanel>

                    {submitted && (
                        <TerminalExercisePanel
                            title="sandbox.analysis"
                            status={isAttackMode ? analysis.status : "success"}
                        >
                            <p>{analysis.title}</p>
                            <p className="mt-2 text-slate-400">{analysis.message}</p>
                            <p className="mt-3 text-slate-400">→ {analysis.insight}</p>
                        </TerminalExercisePanel>
                    )}
                </div>
            </div>

            <ExerciseHelpPanel
                hint="Try the script or image payload in attack mode, then switch to fix mode and compare the output."
                whyItMatters="XSS happens when user-controlled content is treated as trusted page content. Escaping converts markup-like input into harmless text."
            />

            {submitted && (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="bg-amber-300/[0.055] p-5 ring-1 ring-amber-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
                            attack.insight
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            The vulnerable version trusts user input as HTML. If the input
                            contains markup or script-like behavior, the browser may treat it
                            as part of the page instead of plain text.
                        </p>
                    </div>

                    <div className="bg-emerald-300/[0.055] p-5 ring-1 ring-emerald-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                            fix.pattern
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Escaping converts characters like {"<"} and {">"} into safe text.
                            The browser displays the content instead of interpreting it as page
                            structure.
                        </p>
                    </div>
                </div>
            )}
        </ExerciseShell>
    );
}
