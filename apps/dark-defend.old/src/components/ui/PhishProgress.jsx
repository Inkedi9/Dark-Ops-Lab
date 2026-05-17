export function PhishProgress({ value = 0, max = 100 }) {
    const percent = Math.min(100, Math.round((value / max) * 100));

    return (
        <div>
            <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>Progress</span>

                <span className="text-slate-400">
                    {value}/{max}
                </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full border border-blue-300/10 bg-[#060b11]">
                <div
                    className="
                        h-full rounded-full
                        bg-[linear-gradient(90deg,rgba(56,189,248,.72),rgba(45,212,191,.58))]
                        transition-all duration-500
                    "
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}