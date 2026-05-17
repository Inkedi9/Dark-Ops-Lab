"use client";

import { useEffect, useRef } from "react";
import type { ChallengeLog } from "@/engine/types";

type Props = {
    logs: (ChallengeLog & { time: string })[];
};

export default function Terminal({ logs }: Props) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    function getColor(level: ChallengeLog["level"]) {
        switch (level) {
            case "success":
                return "text-green-300";
            case "warning":
                return "text-amber-300";
            case "error":
                return "text-red-400";
            default:
                return "text-slate-300";
        }
    }

    return (
        <div className="relative rounded-2xl border border-slate-800 bg-black p-6 font-mono text-sm">
            {/* subtle glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(77,231,255,0.08),transparent_60%)]" />

            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-green-400">
                Terminal
            </p>

            <div className="space-y-1">
                {logs.map((log, i) => (
                    <div key={i} className={`${getColor(log.level)} flex gap-2`}>
                        <span className="text-slate-600">[{log.time}]</span>
                        <span>{log.message}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* cursor */}
            <div className="mt-2 h-4 w-2 animate-pulse bg-green-400" />
        </div>
    );
}