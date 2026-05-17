"use client";

import { useEffect, useRef } from "react";
import type { ChallengeLog } from "@/engine/types";

type TerminalLog = ChallengeLog & {
    time: string;
};

type TerminalPanelProps = {
    logs: TerminalLog[];
    title?: string;
};

export function TerminalPanel({
    logs,
    title = "Exploit Runtime",
}: TerminalPanelProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const isNearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 40;

        if (isNearBottom) {
            el.scrollTop = el.scrollHeight;
        }
    }, [logs]);

    function getLogClass(level: ChallengeLog["level"]) {
        if (level === "success") return "text-emerald-300";
        if (level === "warning") return "text-amber-300";
        if (level === "error") return "text-red-300";
        return "text-red-100";
    }

    function getPrefix(level: ChallengeLog["level"]) {
        if (level === "success") return "[BREACH]";
        if (level === "warning") return "[RECON]";
        if (level === "error") return "[BLOCKED]";
        return "[EXEC]";
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-red-300/18 bg-black/55 p-6 backdrop-blur-xl shadow-[inset_0_0_28px_rgba(248,113,113,0.035),0_18px_60px_rgba(0,0,0,.55)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(248,113,113,0.035)_1px,transparent_1px)] bg-[length:100%_4px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.09),transparent_45%)]" />
            <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-red-300/50 via-blue-300/30 to-transparent" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-400/[0.07] blur-3xl" />

            <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-200">
                            {title}
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">
                            Payload execution stream
                        </p>
                    </div>

                    <span className="rounded-full border border-red-300/18 bg-red-400/[0.07] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-red-200">
                        armed
                    </span>
                </div>

                <div
                    ref={containerRef}
                    className="h-[300px] space-y-2 overflow-y-auto pr-2 font-[var(--font-mono)] text-[13px] leading-relaxed tracking-[0.03em]"
                >
                    {logs.map((log, index) => (
                        <p
                            key={index}
                            className={`animate-[fadeIn_0.25s_ease] ${getLogClass(log.level)} opacity-95`}
                        >
                            <span className="text-slate-600">[{log.time}]</span>{" "}
                            <span className="text-blue-300/80">{getPrefix(log.level)}</span>{" "}
                            {log.message}
                        </p>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <div className="h-4 w-[2px] animate-[blink_1s_step-end_infinite] bg-red-300" />
                    <span className="font-mono text-xs text-slate-600">
                        awaiting payload...
                    </span>
                </div>
            </div>
        </div>
    );
}