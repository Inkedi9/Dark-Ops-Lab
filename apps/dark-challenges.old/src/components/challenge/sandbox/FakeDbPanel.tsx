import { StatusBadge } from "@/components/dc-ui/StatusBadge";

type FakeDbPanelProps = {
    preview: string;
    solved: boolean;
    attempts: number;
};

export function FakeDbPanel({ preview, solved, attempts }: FakeDbPanelProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(77,231,255,0.08),transparent_45%)]" />

            <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-300">
                        SQL Sandbox
                    </p>

                    <StatusBadge variant={solved ? "success" : "neutral"}>
                        {solved ? "row returned" : "waiting"}
                    </StatusBadge>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#05070d] p-5">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                        Generated query
                    </p>

                    <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-7 text-blue-100">
                        {preview || "SELECT * FROM users WHERE ..."}
                    </pre>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Rows
                        </p>
                        <p className="mt-2 text-3xl font-black">
                            {solved ? "1" : "0"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Auth
                        </p>
                        <p className={solved ? "mt-2 text-xl font-black text-green-300" : "mt-2 text-xl font-black text-red-300"}>
                            {solved ? "GRANTED" : attempts > 0 ? "DENIED" : "PENDING"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Session
                        </p>
                        <p className={solved ? "mt-2 text-xl font-black text-green-300" : "mt-2 text-xl font-black text-slate-500"}>
                            {solved ? "OPEN" : "CLOSED"}
                        </p>
                    </div>
                </div>

                {solved && (
                    <div className="mt-5 rounded-xl border border-green-400/30 bg-green-400/10 p-4">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-green-300">
                            Database response
                        </p>
                        <p className="mt-2 font-mono text-sm text-green-100">
                            user_id=1 role=admin session_token=issued
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}