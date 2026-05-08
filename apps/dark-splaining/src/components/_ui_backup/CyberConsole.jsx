const defaultLines = [
    { type: "info", text: "[2026-01-11 14:32:01] Lesson engine initialized" },
    { type: "success", text: "✓ Concept explanation loaded" },
    { type: "success", text: "✓ Real-world example prepared" },
    { type: "success", text: "✓ Safe mocked exercise ready" },
    { type: "warning", text: "[SIMULATION] No real system is being tested" },
    { type: "info", text: "Ready to start learning..." },
];

export default function CyberConsole({
    title = "Lesson Console",
    lines = defaultLines,
}) {
    const getLineColor = (type) => {
        if (type === "success") return "text-emerald-300";
        if (type === "warning") return "text-amber-300";
        if (type === "danger") return "text-red-300";
        return "text-slate-300";
    };

    return (
        <div className="relative rounded-[1.25rem] bg-white/[0.03] p-[1px] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">

            {/* subtle gradient border */}
            <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-b from-white/10 via-transparent to-white/5 pointer-events-none" />

            <div className="relative overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#06090f]/90">

                {/* topbar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.04]">

                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />

                        <p className="ml-2 font-mono text-[11px] text-slate-400">
                            {title}
                        </p>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-slate-400">
                        Simulation
                    </span>
                </div>

                {/* content */}
                <div className="relative min-h-[200px] space-y-3 px-5 py-4 font-mono text-xs leading-6 md:text-sm">

                    {lines.map((line, index) => (
                        <p
                            key={`${line.text}-${index}`}
                            className={`${getLineColor(line.type)} ${index === lines.length - 1 ? "animate-pulse" : ""
                                }`}
                        >
                            <span className="mr-2 text-slate-600">$</span>
                            {line.text}
                        </p>
                    ))}
                </div>

                {/* subtle bottom fade */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
        </div>
    );
}
