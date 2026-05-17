import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { PhishButton } from "@/components/ui/PhishButton";

export default function ScoreSummary({
    result,
    email,
    xpAwarded = 0,
    onNext,
    isLastEmail = false,
}) {
    if (!result || !email) return null;
    const outcome = result.isCorrect ? "Threat call accepted" : "Review required";

    return (
        <div className="mt-6 rounded-2xl border border-blue-300/35 bg-black/40 p-6 shadow-[0_0_42px_rgba(0,229,255,0.16)]">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                        Analyst Debrief
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white">{outcome}</h3>
                </div>
                <span className={`rounded-full border px-3 py-1 font-mono text-xs ${result.isCorrect
                    ? "border-green-300/30 bg-green-400/10 text-green-300"
                    : "border-amber-300/30 bg-amber-400/10 text-amber-300"
                    }`}>
                    {result.isCorrect ? "ACCEPTED" : "RETRAIN"}
                </span>
            </div>
            <p className="text-sm text-slate-300">
                Score: <span className="font-bold text-white">{result.score}/100</span>
            </p>
            <p className="mt-2 text-sm text-slate-300">
                Expected: <span className="font-semibold">{email.type}</span>
            </p>
            <p className="mt-2 text-sm text-slate-300">
                Correct: <span className="font-semibold">{result.isCorrect ? "Yes" : "No"}</span>
            </p>
            {xpAwarded > 0 && (
                <p className="mt-2 text-sm text-slate-300">
                    DarkNexus XP: <span className="font-semibold text-green-300">+{xpAwarded}</span>
                </p>
            )}
            <p className="mt-4 text-sm leading-6 text-slate-300">{email.explanation}</p>

            {result.feedback?.length > 0 && (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {result.feedback.map((item) => (
                        <FeedbackCard key={`${item.title}-${item.text}`} item={item} />
                    ))}
                </div>
            )}

            {result?.incidentId && (
                <div className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/[0.06] p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-red-200">
                        SOC incident generated
                    </p>

                    <p className="mt-2 text-sm text-slate-300">
                        Incident ID: {result.incidentId}
                    </p>
                </div>
            )}

            {result.matchedFlags.length > 0 && (
                <div className="mt-4">
                    <p className="font-semibold text-green-300">Matched flags</p>
                    <p className="text-sm text-slate-300">{result.matchedFlags.join(", ")}</p>
                </div>
            )}

            {result.missedFlags.length > 0 && (
                <div className="mt-4">
                    <p className="font-semibold text-warning">Missed flags</p>
                    <p className="text-sm text-slate-300">{result.missedFlags.join(", ")}</p>
                </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-400/15 bg-black/30 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                    Debrief stays visible. Move on when ready.
                </p>

                {isLastEmail ? (
                    <Link to="/results">
                        <PhishButton tone="solid">
                            <Trophy className="h-4 w-4" />
                            Open Results
                        </PhishButton>
                    </Link>
                ) : (
                    <PhishButton tone="blue" onClick={onNext}>
                        Next Email
                        <ArrowRight className="h-4 w-4" />
                    </PhishButton>
                )}
            </div>
        </div>
    );
}

function FeedbackCard({ item }) {
    const tones = {
        success: "border-green-300/20 bg-green-400/5 text-green-300",
        warning: "border-amber-300/20 bg-amber-400/5 text-amber-300",
        info: "border-blue-300/20 bg-blue-400/5 text-blue-300",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[item.tone] || tones.info}`}>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em]">
                {item.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
        </div>
    );
}
