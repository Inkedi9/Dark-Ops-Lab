import { useState } from "react";

export default function ExerciseHelpPanel({ hint, whyItMatters }) {
    const [showHint, setShowHint] = useState(false);

    return (
        <div className="mt-5 bg-black/70 p-4 font-mono ring-1 ring-white/[0.08]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    learning.support
                </p>

                <button
                    type="button"
                    onClick={() => setShowHint((current) => !current)}
                    className="px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-blue-300 ring-1 ring-blue-300/30 transition hover:bg-blue-300/10"
                >
                    {showHint ? "hide_hint" : "show_hint"}
                </button>
            </div>

            {showHint && (
                <div className="mt-4 border-l-2 border-blue-300/50 pl-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-blue-300">
                        hint
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                        {hint}
                    </p>
                </div>
            )}

            <div className="mt-4 border-l-2 border-emerald-300/50 pl-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">
                    why_it_matters
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                    {whyItMatters}
                </p>
            </div>
        </div>
    );
}
