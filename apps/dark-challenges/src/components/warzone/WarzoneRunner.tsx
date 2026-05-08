"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TerminalPanel } from "@/components/dc-ui/TerminalPanel";
import type { ChallengeLog } from "@/engine/types";
import type { WarzoneState } from "@/warzone/types";
import { getWarzoneBySlug } from "@/warzone/registry";
import {
    getWarzoneProgress,
    resetWarzoneProgress,
    saveWarzoneProgress,
} from "@/store/warzone-progress-store";
import { addXp } from "@/store/global-progress";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import ProgressBar from "@dark/ui/components/ProgressBar";

type TerminalLog = ChallengeLog & {
    time: string;
};

type Props = {
    slug: string;
};

export function WarzoneRunner({ slug }: Props) {
    const warzone = getWarzoneBySlug(slug);

    if (!warzone) return null;

    const [action, setAction] = useState("");
    const [state, setState] = useState<WarzoneState>(warzone.initialState);
    const [completed, setCompleted] = useState(false);
    const [actionsCount, setActionsCount] = useState(0);
    const [startedAt] = useState(() => Date.now());
    const [remainingSeconds, setRemainingSeconds] = useState(warzone.timeLimitSeconds);
    const [logs, setLogs] = useState<TerminalLog[]>([
        { time: "00:00", level: "info", message: "warzone simulation initialized" },
        { time: "00:00", level: "warning", message: "live production-like signals detected" },
    ]);
    const [detectionRisk, setDetectionRisk] = useState(12);
    const [failed, setFailed] = useState(false);
    const [hostileEvent, setHostileEvent] = useState<string | null>(null);
    const [actionHistory, setActionHistory] = useState<string[]>([]);
    const [defenseMode, setDefenseMode] = useState<"normal" | "learning" | "hardened">("normal");

    useEffect(() => {
        const saved = getWarzoneProgress(warzone.id, warzone.initialState);
        setState(saved.state);
        setCompleted(saved.completed);
        setActionsCount(saved.actionsCount);
    }, [warzone]);

    useEffect(() => {
        if (completed) return;

        const timer = window.setInterval(() => {
            setRemainingSeconds((current) => Math.max(0, current - 1));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [completed]);

    useEffect(() => {
        if (completed) return;

        const events = [
            "background traffic: healthcheck /api/status",
            "auth service: failed login noise detected",
            "edge proxy: unusual request latency spike",
            "worker node: diagnostics job completed",
            "audit stream: low-confidence anomaly recorded",
        ];

        const timer = window.setInterval(() => {
            const randomEvent = events[Math.floor(Math.random() * events.length)];

            setLogs((current) => [
                ...current.slice(-40),
                {
                    time: getTime(),
                    level: "info",
                    message: randomEvent,
                },
            ]);

            setDetectionRisk((current) => Math.min(100, current + 1));
        }, 9000);

        return () => window.clearInterval(timer);
    }, [completed]);

    useEffect(() => {
        if (detectionRisk >= 100 && !completed) {
            setFailed(true);

            setLogs((current) => [
                ...current,
                {
                    time: getTime(),
                    level: "error",
                    message: "detection threshold exceeded",
                },
                {
                    time: getTime(),
                    level: "error",
                    message: "system lockdown initiated",
                },
                {
                    time: getTime(),
                    level: "error",
                    message: "all access revoked",
                },
            ]);
        }
    }, [detectionRisk, completed]);

    useEffect(() => {
        if (completed || failed) return;

        const hostileEvents = [
            {
                message: "SOC analyst opened investigation thread",
                risk: 8,
            },
            {
                message: "WAF anomaly score increased",
                risk: 6,
            },
            {
                message: "honeypot endpoint /admin-old triggered by background scan",
                risk: 10,
            },
            {
                message: "EDR telemetry correlated unusual session behavior",
                risk: 12,
            },
        ];

        const timer = window.setInterval(() => {
            const event =
                hostileEvents[Math.floor(Math.random() * hostileEvents.length)];

            setHostileEvent(event.message);

            setLogs((current) => [
                ...current.slice(-45),
                {
                    time: getTime(),
                    level: "warning",
                    message: event.message,
                },
            ]);

            setDetectionRisk((current) => Math.min(100, current + event.risk));
        }, 18000);

        return () => window.clearInterval(timer);
    }, [completed, failed]);

    const completion = useMemo(() => {
        return Math.round(
            (state.objectivesCompleted.length / warzone.objectives.length) * 100
        );
    }, [state.objectivesCompleted.length, warzone.objectives.length]);

    const fullFlag = state.flagParts.join("");

    function getTime() {
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const seconds = String(elapsed % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    function formatRemaining(seconds: number) {
        const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
        const remaining = String(seconds % 60).padStart(2, "0");
        return `${minutes}:${remaining}`;
    }

    function appendLogs(nextLogs: ChallengeLog[]) {
        setLogs((current) => [
            ...current,
            ...nextLogs.map((log) => ({
                ...log,
                time: getTime(),
            })),
        ]);
    }

    function analyzePatterns(history: string[]) {
        const joined = history.join(" ").toLowerCase();

        const scanCount = history.filter((item) =>
            item.toLowerCase().includes("scan")
        ).length;

        const sqliCount = history.filter((item) => {
            const lower = item.toLowerCase();
            return lower.includes("or 1=1") || lower.includes("'1'='1");
        }).length;

        const tokenCount = history.filter((item) =>
            item.toLowerCase().includes("token")
        ).length;

        if (sqliCount >= 3) {
            return "repeated-sqli";
        }

        if (scanCount >= 3) {
            return "repeated-recon";
        }

        if (tokenCount >= 3) {
            return "token-abuse";
        }

        if (joined.includes("/admin-old") || joined.includes("/admin-test")) {
            return "suspicious-admin-path";
        }

        return null;
    }

    function executeAction() {
        if (completed || remainingSeconds <= 0) return;
        if (completed || failed || remainingSeconds <= 0) return;
        if (!warzone) return

        const result = warzone.evaluateAction(action, state);

        const nextHistory = [...actionHistory.slice(-10), action];
        const detectedPattern = analyzePatterns(nextHistory);

        setActionHistory(nextHistory);

        if (detectedPattern) {
            setDefenseMode((current) =>
                current === "hardened" ? "hardened" : "learning"
            );

            setDetectionRisk((current) => Math.min(100, current + 15));

            appendLogs([
                {
                    level: "warning",
                    message: `pattern detected: ${detectedPattern}`,
                },
                {
                    level: "warning",
                    message: "WAF learning mode activated",
                },
            ]);
        }

        setDetectionRisk((current) => {
            if (result.success) {
                return Math.max(5, current - 10);
            }

            const penalty = defenseMode === "hardened" ? 22 : 12;
            return Math.min(100, current + penalty);
        });
        const nextActionsCount = actionsCount + 1;

        setActionsCount(nextActionsCount);
        appendLogs(result.logs);

        if (result.nextState) {
            const nextState = {
                ...state,
                ...result.nextState,
            };
            if (result.success) {
                setDefenseMode((current) =>
                    current === "learning" ? "normal" : current
                );
            }

            const isComplete = nextState.stage === "complete";
            const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);

            setState(nextState);
            setCompleted(isComplete);

            if (isComplete) {
                addXp(warzone.rewardXp);
            }

            saveWarzoneProgress({
                warzoneId: warzone.id,
                state: nextState,
                completed: isComplete,
                completedAt: isComplete ? new Date().toISOString() : undefined,
                bestTimeSeconds: isComplete ? elapsedSeconds : undefined,
                actionsCount: nextActionsCount,
            });
        } else {
            saveWarzoneProgress({
                warzoneId: warzone.id,
                state,
                completed,
                actionsCount: nextActionsCount,
            });
        }

        setAction("");
    }

    function resetSimulation() {
        if (!warzone) return

        resetWarzoneProgress(warzone.id);
        setState(warzone.initialState);
        setCompleted(false);
        setActionsCount(0);
        setAction("");
        setRemainingSeconds(warzone.timeLimitSeconds);
        setLogs([
            { time: "00:00", level: "info", message: "warzone simulation reset" },
            { time: "00:00", level: "warning", message: "live production-like signals detected" },
        ]);
        setDetectionRisk(12);
        setFailed(false);
        setDetectionRisk(12);
        setHostileEvent(null);
        setActionHistory([]);
        setDefenseMode("normal");
    }

    useEffect(() => {
        if (completed || failed) return;

        if (detectionRisk >= 75 && defenseMode !== "hardened") {
            setDefenseMode("hardened");

            setLogs((current) => [
                ...current,
                {
                    time: getTime(),
                    level: "warning",
                    message: "WAF hardened mode enabled",
                },
                {
                    time: getTime(),
                    level: "warning",
                    message: "future noisy actions will increase detection faster",
                },
            ]);
        }
    }, [detectionRisk, defenseMode, completed, failed]);

    return (
        <AppShell>
            <section className="mb-8 rounded-3xl border border-red-300/20 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.10),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] p-7 shadow-[0_24px_90px_rgba(0,0,0,.65)]">
                <div className="pointer-events-none absolute -right-24 top-10 h-52 w-52 rounded-full bg-red-700/10 blur-3xl" />
                <div className="pointer-events-none absolute right-12 top-20 h-20 w-32 rotate-12 rounded-full bg-red-500/[0.035] blur-xl" />
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <AppBadge variant={completed ? "emerald" : failed ? "danger" : "danger"}>
                        {completed ? "Zone cleared" : failed ? "Lockdown" : "Hot zone"}
                    </AppBadge>
                    <AppBadge >{warzone.difficulty}</AppBadge >
                    <AppBadge >{formatRemaining(remainingSeconds)}</AppBadge >
                    <AppBadge >{actionsCount} actions</AppBadge >
                </div>

                <h1 className="text-6xl font-black tracking-tight text-white">
                    {warzone.title}
                </h1>
                <p className="mt-4 max-w-3xl text-slate-400">{warzone.description}</p>

                {hostileEvent && (
                    <div className="mt-5 rounded-xl border border-red-300/25 bg-red-400/[0.08] p-4">
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-red-200">
                            Active hostile signal
                        </p>
                        <p className="mt-2 text-sm font-bold text-white">{hostileEvent}</p>
                    </div>
                )}

                <div className="mt-6">
                    <ProgressBar
                        label="Zone control"
                        value={completion}
                        variant={completed ? "success" : "danger"}
                    />
                </div>
            </section>

            <PanelCard variant="danger" accent="danger" className="mb-8">
                <div className="grid gap-4 md:grid-cols-4">
                    <WarMetric label="TIME LEFT" value={formatRemaining(remainingSeconds)} hot={remainingSeconds < 60} />
                    <WarMetric label="DETECTION" value={`${detectionRisk}%`} hot={detectionRisk >= 75} />
                    <WarMetric label="ACTIONS" value={actionsCount} />
                    <WarMetric label="CONTROL" value={`${completion}%`} hot={completion >= 75} />
                </div>

                <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-400/[0.06] p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-200">
                        Combat route
                    </p>

                    <div className="mt-4 grid gap-2 md:grid-cols-4">
                        {["Recon", "Breach", "Evade", "Extract"].map((step, index) => (
                            <div
                                key={step}
                                className={[
                                    "rounded-xl border px-3 py-3 text-center font-mono text-[10px] uppercase tracking-[0.22em]",
                                    completed
                                        ? "border-emerald-300/20 bg-emerald-400/[0.07] text-emerald-200"
                                        : index === Math.min(state.objectivesCompleted.length, 3)
                                            ? "border-red-300/25 bg-red-400/[0.08] text-red-200 animate-pulse"
                                            : "border-white/[0.07] bg-white/[0.03] text-slate-500",
                                ].join(" ")}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                </div>
            </PanelCard>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <PanelCard variant="darkNexus" accent="danger">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-300">
                            Action console
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Submit tactical actions. The zone reacts to your foothold, noise level and hostile telemetry.
                        </p>

                        <textarea
                            value={action}
                            onChange={(event) => setAction(event.target.value)}
                            className="mt-6 min-h-32 w-full resize-none rounded-xl border border-slate-700 bg-[#05070d] px-4 py-3 font-mono text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-red-300/45 focus:shadow-[0_0_15px_rgba(255,92,122,0.12)]"
                            placeholder="recon /debug --stealth"
                        />

                        <AppButton
                            onClick={executeAction}
                            variant={completed ? "success" : "danger"}
                            disabled={completed || remainingSeconds <= 0}
                            className="mt-4 w-full"
                        >
                            {completed ? "Zone cleared" : failed ? "Lockdown active" : "Execute combat action"}
                        </AppButton >
                    </PanelCard>

                    <TerminalPanel logs={logs} />
                </div>

                <aside className="space-y-6">
                    <PanelCard variant="darkNexus" accent="blue">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="font-mono text-sm uppercase tracking-[0.3em] text-blue-200">
                                Objectives
                            </p>
                            <AppBadge variant={completed ? "emerald" : "blue"}>
                                {state.objectivesCompleted.length}/{warzone.objectives.length}
                            </AppBadge>
                        </div>

                        <div className="space-y-3">
                            {warzone.objectives.map((objective) => {
                                const solved = state.objectivesCompleted.includes(objective.id);

                                return (
                                    <div
                                        key={objective.id}
                                        className={[
                                            "rounded-xl border bg-white/[0.025] p-4",
                                            solved ? "border-emerald-300/18" : "border-white/[0.06]",
                                        ].join(" ")}
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                                                {objective.id}
                                            </p>

                                            <AppBadge variant={solved ? "emerald" : "default"}>
                                                {solved ? "Complete" : "Open"}
                                            </AppBadge>
                                        </div>

                                        <p className="font-bold text-white">{objective.title}</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {objective.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </PanelCard>

                    <PanelCard
                        variant="darkNexus"
                        accent={detectionRisk >= 80 ? "danger" : detectionRisk >= 50 ? "amber" : "blue"}
                        className={detectionRisk >= 80 ? "animate-pulse" : ""}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <p className="font-mono text-sm uppercase tracking-[0.3em] text-blue-200">
                                Detection Risk
                            </p>

                            <AppBadge
                                variant={detectionRisk >= 80 ? "danger" : detectionRisk >= 50 ? "amber" : "blue"}
                            >
                                {detectionRisk >= 80 ? "Critical" : detectionRisk >= 50 ? "Elevated" : "Low"}
                            </AppBadge>
                        </div>

                        <div className="mb-3 flex items-center justify-between font-mono text-xs text-slate-400">
                            <span>Signal exposure</span>
                            <span>{detectionRisk}%</span>
                        </div>

                        <ProgressBar value={detectionRisk} className="h-2" />

                        <p className="mt-4 text-sm leading-6 text-slate-400">
                            Failed or noisy actions increase detection risk. Successful progression lowers the signal.
                        </p>
                    </PanelCard>

                    <PanelCard
                        variant="darkNexus"
                        accent={defenseMode === "hardened" ? "danger" : defenseMode === "learning" ? "amber" : "blue"}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <p className="font-mono text-sm uppercase tracking-[0.3em] text-slate-300">
                                Adaptive WAF
                            </p>

                            <AppBadge
                                variant={defenseMode === "hardened" ? "danger" : defenseMode === "learning" ? "amber" : "default"}
                            >
                                {defenseMode}
                            </AppBadge>
                        </div>

                        <p className="text-sm leading-6 text-slate-400">
                            Repeated noisy patterns cause the simulated WAF to adapt. Hardened mode increases penalties for failed actions.
                        </p>
                    </PanelCard>

                    <PanelCard variant="danger" accent="danger">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="font-mono text-sm uppercase tracking-[0.3em] text-red-200">
                                Hostile Signal
                            </p>

                            <AppBadge variant={hostileEvent ? "danger" : "default"}>
                                {hostileEvent ? "Active" : "Quiet"}
                            </AppBadge>
                        </div>

                        <p className="text-sm leading-6 text-slate-400">
                            {hostileEvent ?? "No hostile signal detected. Background monitoring is still active."}
                        </p>
                    </PanelCard>

                    <PanelCard variant="darkNexus" accent="amber">
                        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-amber-200">
                            Recovered signal
                        </p>

                        <div className="rounded-xl border border-white/[0.06] bg-black/35 p-4 font-mono text-sm text-slate-300">
                            {fullFlag || "No signal recovered yet."}
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkNexus" accent={completed ? "emerald" : failed ? "danger" : "blue"}>
                        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-emerald-200">
                            Simulation control
                        </p>

                        {completed && (
                            <div className="mb-4 rounded-xl border border-emerald-300/14 bg-emerald-400/[0.055] p-4">
                                <p className="font-mono text-sm text-emerald-200">
                                    Badge unlocked: {warzone.badge}
                                </p>
                            </div>
                        )}

                        {failed && (
                            <div className="mb-4 rounded-xl border border-red-300/14 bg-red-400/[0.055] p-4">
                                <p className="font-mono text-sm text-red-200">
                                    SYSTEM DETECTED YOUR ACTIVITY
                                </p>
                                <p className="mt-2 text-sm text-slate-400">
                                    The environment has locked you out. Restart the simulation.
                                </p>
                            </div>
                        )}

                        <AppButton
                            onClick={failed || completed ? resetSimulation : executeAction}
                            variant={completed ? "emerald" : "danger"}
                            shape="terminal"
                            className="mt-4 w-full"
                        >
                            {failed
                                ? "Restart simulation"
                                : completed
                                    ? "Reset cleared zone"
                                    : "Execute action"}
                        </AppButton>
                    </PanelCard>
                </aside>
            </section>
        </AppShell>
    );
}

function WarMetric({
    label,
    value,
    hot = false,
}: {
    label: string;
    value: string | number;
    hot?: boolean;
}) {
    return (
        <div
            className={[
                "rounded-2xl border p-4",
                hot
                    ? "border-red-300/30 bg-red-400/[0.09] shadow-[0_0_28px_rgba(248,113,113,.08)]"
                    : "border-white/[0.07] bg-white/[0.035]",
            ].join(" ")}
        >
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                {label}
            </p>
            <p className={["mt-2 text-2xl font-black", hot ? "text-red-200" : "text-white"].join(" ")}>
                {value}
            </p>
        </div>
    );
}