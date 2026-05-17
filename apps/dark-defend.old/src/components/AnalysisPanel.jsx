import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Eye, MousePointerClick, Send } from "lucide-react";
import { phishingFlags } from "../data/scenarios";
import { PhishCard } from "@/components/ui/PhishCard";

export default function AnalysisPanel({
    email,
    mode,
    verdict,
    setVerdict,
    selectedFlags,
    setSelectedFlags,
    confidence,
    setConfidence,
    analystReasoning,
    setAnalystReasoning,
    onSubmit,
    disabled,
    escalateToSoc,
    setEscalateToSoc,
}) {
    const [flagsOpen, setFlagsOpen] = useState(false);

    const toggleFlag = (flag) => {
        if (selectedFlags.includes(flag)) {
            setSelectedFlags(selectedFlags.filter((item) => item !== flag));
        } else {
            setSelectedFlags([...selectedFlags, flag]);
        }
    };

    return (
        <div className="rounded-2xl border border-blue-400/15 bg-black/25 p-5">
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                Verdict Matrix
            </h3>

            {mode === "beginner" && (
                <div className="mb-5 rounded-2xl border border-blue-400/15 bg-black/30 p-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                        Operator Checklist
                    </p>
                    <div className="mt-3 space-y-2">
                        <ChecklistItem icon={<Eye className="h-4 w-4" />} text="Inspect sender and domain" active />
                        <ChecklistItem
                            icon={<MousePointerClick className="h-4 w-4" />}
                            text={email?.linkUrl ? "Review link destination" : "No embedded link detected"}
                            active={Boolean(email?.linkUrl)}
                        />
                        <ChecklistItem
                            icon={<CheckCircle2 className="h-4 w-4" />}
                            text={email?.attachment ? "Review attachment risk" : "No attachment detected"}
                            active={Boolean(email?.attachment)}
                        />
                    </div>
                </div>
            )}

            <div className="mb-5 space-y-3">
                <button
                    onClick={() => setVerdict("legitimate")}
                    className={`w-full rounded-xl border px-4 py-3 font-semibold ${verdict === "legitimate"
                        ? "border-green-300/50 bg-green-400/10 text-green-300"
                        : "border-blue-400/15 bg-black/30 text-white hover:border-green-300/30"
                        }`}
                >
                    Legitimate
                </button>

                <button
                    onClick={() => setVerdict("suspicious")}
                    className={`w-full rounded-xl border px-4 py-3 font-semibold ${verdict === "suspicious"
                        ? "border-warning bg-warning/10 text-warning"
                        : "border-blue-400/15 bg-black/30 text-white hover:border-amber-300/30"
                        }`}
                >
                    Suspicious
                </button>

                <button
                    onClick={() => setVerdict("phishing")}
                    className={`w-full rounded-xl border px-4 py-3 font-semibold ${verdict === "phishing"
                        ? "border-danger bg-danger/10 text-danger"
                        : "border-blue-400/15 bg-black/30 text-white hover:border-red-300/30"
                        }`}
                >
                    Phishing
                </button>
            </div>

            <div className="rounded-2xl border border-blue-400/15 bg-black/35 p-3">
                <button
                    type="button"
                    onClick={() => setFlagsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                >
                    <div>
                        <h4 className="font-semibold text-slate-200">Red Flags</h4>
                        <p className="mt-1 font-mono text-xs text-slate-400">
                            {selectedFlags.length} selected
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        {flagsOpen ? "Hide" : "Show"}
                        {flagsOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </div>
                </button>

                {flagsOpen && (
                    <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                        {phishingFlags.map((flag) => (
                            <label
                                key={flag}
                                className="flex items-center gap-3 rounded-lg border border-blue-400/15 bg-black/30 p-3 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedFlags.includes(flag)}
                                    onChange={() => toggleFlag(flag)}
                                />
                                <span>{flag}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <PhishCard tone="blue" hover={false} className="mt-4 p-3">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-blue-200">
                    Analyst Confidence
                </p>


                <div className="grid gap-2">
                    {["low", "medium", "high"].map((level) => (
                        <button
                            key={level}
                            type="button"
                            onClick={() => setConfidence(level)}
                            className={[
                                "rounded-xl border px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-[0.16em] transition",
                                confidence === level
                                    ? "border-blue-300/25 bg-blue-400/[0.10] text-blue-100"
                                    : "border-white/[0.07] bg-white/[0.025] text-slate-500 hover:text-blue-200",
                            ].join(" ")}
                        >
                            {level} confidence
                        </button>
                    ))}
                </div>
            </PhishCard>

            <PhishCard tone="slate" hover={false} className="mmt-4 p-3">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
                    Analyst Reasoning
                </p>

                <textarea
                    value={analystReasoning}
                    onChange={(event) => setAnalystReasoning(event.target.value)}
                    placeholder="Document your decision logic..."
                    className="min-h-28 w-full resize-none rounded-xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-300/35"
                />
            </PhishCard>

            <PhishCard tone="threat" hover={false} className="mt-4 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-red-200">
                            SOC Escalation
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                            Mark this artifact for SOC analyst review after submission.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setEscalateToSoc(!escalateToSoc)}
                        className={[
                            "rounded-xl border px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] transition",
                            escalateToSoc
                                ? "border-red-300/25 bg-red-400/[0.10] text-red-100"
                                : "border-white/[0.07] bg-white/[0.025] text-slate-500 hover:text-red-200",
                        ].join(" ")}
                    >
                        {escalateToSoc ? "Escalate" : "Off"}
                    </button>
                </div>
            </PhishCard>

            <button
                onClick={onSubmit}
                disabled={disabled}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-300/50 bg-blue-300 px-4 py-3 font-semibold text-slate-950 hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Send className="h-4 w-4" />
                Submit Analysis
            </button>
        </div>
    );
}

function ChecklistItem({ icon, text, active }) {
    return (
        <div
            className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${active
                ? "border-blue-400/20 bg-blue-400/5 text-slate-200"
                : "border-blue-400/10 bg-black/20 text-slate-500"
                }`}
        >
            <span className={active ? "text-blue-300" : "text-slate-600"}>{icon}</span>
            <span>{text}</span>
        </div>
    );
}
