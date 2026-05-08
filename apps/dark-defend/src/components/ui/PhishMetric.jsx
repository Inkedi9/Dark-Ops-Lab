export function PhishMetric({ label, value, tone = "teal" }) {
    const tones = {
        blue: "border-blue-300/14 bg-blue-400/[0.055] text-blue-200",
        teal: "border-blue-300/14 bg-blue-400/[0.055] text-blue-200",
        red: "border-red-300/14 bg-red-400/[0.055] text-red-200",
        green: "border-emerald-300/14 bg-emerald-400/[0.055] text-emerald-200",
        amber: "border-amber-300/14 bg-amber-400/[0.055] text-amber-200",
        slate: "border-white/[0.055] bg-white/[0.025] text-slate-300",
    };

    return (
        <div className={`rounded-[1.5rem] border p-4 shadow-[0_0_24px_rgba(96,165,250,0.04)] ${tones[tone]}`}>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] opacity-80">{label}</p>
            <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
    );
}
