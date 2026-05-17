import { StatusBadge } from "@/components/dc-ui/StatusBadge";

type FakeTerminalOutputProps = {
    preview?: string;
    solved: boolean;
    attempts: number;
};

export function FakeTerminalOutput({
    preview = "",
    solved,
    attempts,
}: FakeTerminalOutputProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(88,240,167,0.08),transparent_45%)]" />

            <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between">
                    {preview.includes("diagnostics/ping")
                        ? "Command Injection Sandbox"
                        : "Auth Chain Sandbox"}

                    <StatusBadge variant={solved ? "success" : attempts > 0 ? "warning" : "neutral"}>
                        {solved ? "admin breached" : attempts > 0 ? "chain active" : "idle"}
                    </StatusBadge>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#05070d] p-5">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                        Simulated request chain
                    </p>

                    <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-green-100">
                        {preview || "No request submitted yet."}
                    </pre>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Session
                        </p>
                        <p className={attempts > 0 ? "mt-2 text-xl font-black text-amber-300" : "mt-2 text-xl font-black text-slate-500"}>
                            {attempts > 0 ? "GUEST" : "NONE"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Token
                        </p>
                        <p className={solved ? "mt-2 text-xl font-black text-green-300" : "mt-2 text-xl font-black text-slate-500"}>
                            {solved ? "ACCEPTED" : "UNKNOWN"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#05070d] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Admin
                        </p>
                        <p className={solved ? "mt-2 text-xl font-black text-green-300" : "mt-2 text-xl font-black text-red-300"}>
                            {solved ? "OPEN" : "LOCKED"}
                        </p>
                    </div>
                </div>

                {solved && (
                    <div className="mt-5 rounded-xl border border-green-400/30 bg-green-400/10 p-4">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-green-300">
                            Chain complete
                        </p>
                        <p className="mt-2 font-mono text-sm text-green-100">
                            weak login → debug token → admin replay
                        </p>
                    </div>
                )}
                {preview.includes("diagnostics/ping") && (
                    <div className="mt-5 rounded-xl border border-slate-800 bg-[#05070d] p-5">
                        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                            Simulated shell output
                        </p>

                        <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-green-100">
                            {solved
                                ? "$ ping -c 1 127.0.0.1\n64 bytes from 127.0.0.1\n$ whoami\napp-user"
                                : attempts > 0
                                    ? "$ ping -c 1 target\n64 bytes from target\nsecondary command: none"
                                    : "$ waiting for diagnostics input"}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}