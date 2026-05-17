import { StatusBadge } from "@/components/dc-ui/StatusBadge";

type TimeBasedSqlPanelProps = {
    preview: string;
    solved: boolean;
    attempts: number;
};

function getTimingState(preview: string, solved: boolean, attempts: number) {
    const lower = preview.toLowerCase();

    if (solved || lower.includes("case when") || lower.includes("substring")) {
        return {
            status: "delay confirmed",
            responseTime: "5.132s",
            baseline: "118ms",
            jitter: "+5.014s",
            variant: "success" as const,
            graph: [12, 13, 12, 14, 92],
        };
    }

    if (
        lower.includes("sleep(5)") ||
        lower.includes("pg_sleep(5)") ||
        lower.includes("waitfor delay")
    ) {
        return {
            status: "delay observed",
            responseTime: "5.084s",
            baseline: "121ms",
            jitter: "+4.963s",
            variant: "warning" as const,
            graph: [11, 12, 13, 12, 88],
        };
    }

    return {
        status: attempts > 0 ? "normal response" : "waiting",
        responseTime: attempts > 0 ? "124ms" : "-",
        baseline: "120ms",
        jitter: attempts > 0 ? "+4ms" : "-",
        variant: "neutral" as const,
        graph: [11, 12, 11, 13, 12],
    };
}

export function TimeBasedSqlPanel({
    preview,
    solved,
    attempts,
}: TimeBasedSqlPanelProps) {
    const timing = getTimingState(preview, solved, attempts);
    const max = Math.max(...timing.graph, 1);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,92,122,0.1),transparent_45%)]" />

            <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-300">
                        Time-based SQLi Sandbox
                    </p>

                    <StatusBadge variant={timing.variant}>{timing.status}</StatusBadge>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#05070d] p-5">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                        Simulated request
                    </p>

                    <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-7 text-blue-100">
                        {preview}
                    </pre>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Response time
                        </p>
                        <p className="mt-2 text-3xl font-black">{timing.responseTime}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Baseline
                        </p>
                        <p className="mt-2 text-3xl font-black">{timing.baseline}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Delta
                        </p>
                        <p
                            className={[
                                "mt-2 text-3xl font-black",
                                solved ? "text-green-300" : "text-amber-300",
                            ].join(" ")}
                        >
                            {timing.jitter}
                        </p>
                    </div>
                </div>

                <div className="mt-5 rounded-xl border border-slate-800 bg-[#05070d] p-5">
                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                        Response timing samples
                    </p>

                    <div className="grid h-32 grid-cols-5 items-end gap-3">
                        {timing.graph.map((value, index) => {
                            const height = Math.max(16, (value / max) * 100);

                            return (
                                <div key={index} className="flex h-full flex-col justify-end gap-2">
                                    <div className="flex h-full items-end">
                                        <div
                                            className="rounded-xl px-5 py-3 font-medium text-sm text-slate-200 border border-slate-700 bg-[#0f1623] transition-all duration-200 hover:border-[rgba(var(--dc-accent),0.4)] hover:text-blue-200 hover:shadow-[0_0_18px_rgba(var(--dc-accent),0.1)]"
                                            style={{ height: `${height}%`, minHeight: "16px" }}
                                        />
                                    </div>

                                    <span className="text-center font-mono text-[10px] text-slate-500">
                                        r{index + 1}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {solved && (
                    <div className="mt-5 rounded-xl border border-green-400/30 bg-green-400/10 p-4">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-green-300">
                            Time oracle confirmed
                        </p>
                        <p className="mt-2 font-mono text-sm text-green-100">
                            Conditional SQL delay created a measurable response-time delta.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}