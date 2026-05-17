import { StatusBadge } from "@/components/dc-ui/StatusBadge";

type BlindSqlPanelProps = {
    preview: string;
    solved: boolean;
    attempts: number;
};

function getBehavior(preview: string, solved: boolean, attempts: number) {
    const lower = preview.toLowerCase();

    if (solved || lower.includes("substring") || lower.includes("substr")) {
        return {
            status: "oracle confirmed",
            banner: "visible",
            responseSize: "4.8kb",
            timing: "132ms",
            variant: "success" as const,
        };
    }

    if (
        lower.includes("1=1") ||
        lower.includes("'a'='a") ||
        lower.includes("true")
    ) {
        return {
            status: "true condition",
            banner: "visible",
            responseSize: "4.8kb",
            timing: "126ms",
            variant: "warning" as const,
        };
    }

    if (
        lower.includes("1=2") ||
        lower.includes("'a'='b") ||
        lower.includes("false")
    ) {
        return {
            status: "false condition",
            banner: "hidden",
            responseSize: "3.1kb",
            timing: "124ms",
            variant: "danger" as const,
        };
    }

    return {
        status: attempts > 0 ? "unchanged" : "waiting",
        banner: "unknown",
        responseSize: attempts > 0 ? "4.1kb" : "-",
        timing: attempts > 0 ? "120ms" : "-",
        variant: "neutral" as const,
    };
}

export function BlindSqlPanel({
    preview,
    solved,
    attempts,
}: BlindSqlPanelProps) {

    const behavior = getBehavior(preview, solved, attempts);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,156,255,0.1),transparent_45%)]" />

            <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-300">
                        Blind SQLi Sandbox
                    </p>

                    <StatusBadge variant={behavior.variant}>
                        {behavior.status}
                    </StatusBadge>
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
                            Welcome banner
                        </p>
                        <p className="mt-2 text-2xl font-black uppercase">
                            {behavior.banner}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Response size
                        </p>
                        <p className="mt-2 text-2xl font-black">
                            {behavior.responseSize}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Timing
                        </p>
                        <p className="mt-2 text-2xl font-black">
                            {behavior.timing}
                        </p>
                    </div>
                </div>

                {solved && (
                    <div className="mt-5 rounded-xl border border-green-400/30 bg-green-400/10 p-4">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-green-300">
                            Oracle result
                        </p>
                        <p className="mt-2 font-mono text-sm text-green-100">
                            password[1] == &apos;s&apos; confirmed through response behavior
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}