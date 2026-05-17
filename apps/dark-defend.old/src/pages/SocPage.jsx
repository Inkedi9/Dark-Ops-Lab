"use client";

import { createElement, useMemo, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Eye,
    Inbox,
    Radio,
    ShieldAlert,
} from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import { socAlerts } from "@/data/socAlerts";
import SocLayout from "../components/soc/layout/SocLayout";
import { getIncidents, mapIncidentToSocAlert } from "@/lib/defend/incidentService";
import SocAlertDetail from "@/components/soc/SocAlertDetail";
import SocResponseActions from "@/components/soc/SocResponseActions";

function severityVariant(severity) {
    if (severity === "Critical" || severity === "High") return "danger";
    if (severity === "Medium") return "amber";
    return "blue";
}

function bridgeVariant(label) {
    if (label === "Generated") return "danger";
    if (label === "Escalated") return "amber";
    if (label === "Legit false positive") return "blue";
    if (label === "Correct analyst detection") return "emerald";
    return "blue";
}

export default function SocPage() {
    const generatedAlerts = useMemo(() => getIncidents().map(mapIncidentToSocAlert), []);
    const allAlerts = useMemo(() => [...generatedAlerts, ...socAlerts], [generatedAlerts]);

    const [selectedId, setSelectedId] = useState(allAlerts[0]?.id);
    const [verdicts, setVerdicts] = useState({});

    const selectedAlert = useMemo(
        () => allAlerts.find((alert) => alert.id === selectedId) ?? allAlerts[0],
        [selectedId, allAlerts]
    );

    const resolvedCount = Object.keys(verdicts).length;

    function submitVerdict(verdict) {
        setVerdicts((current) => ({
            ...current,
            [selectedAlert.id]: verdict,
        }));
    }

    const selectedVerdict = selectedAlert ? verdicts[selectedAlert.id] : null;

    return (
        <SocLayout>
            <>
                <section className="mb-8">
                    <div className="mb-4 flex flex-wrap gap-2">
                        <AppBadge variant="emerald">SOC analyst mode</AppBadge>
                        <AppBadge variant="blue">Mock SIEM</AppBadge>
                        <AppBadge variant="amber">{allAlerts.length} alerts incoming</AppBadge>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight text-white">
                        SOC Command Center
                    </h1>

                    <p className="mt-4 max-w-3xl text-slate-400">
                        Investigate suspicious alerts, inspect artifacts, identify signals and classify the incident before users are impacted.
                    </p>
                </section>

                <section className="mb-8 grid gap-4 md:grid-cols-4">
                    <Stat label="Incoming alerts" value={allAlerts.length} icon={Inbox} />
                    <Stat label="Resolved" value={resolvedCount} icon={CheckCircle2} />
                    <Stat label="High risk" value={allAlerts.filter((a) => a.severity === "High" || a.severity === "Critical").length} icon={ShieldAlert} />
                    <Stat label="Mode" value="Mock" icon={Radio} />
                </section>

                <section className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr_0.8fr]">
                    <PanelCard variant="darkNexus" accent="emerald" className="h-fit">
                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">SIEM ingestion</span>
                                <span className="text-emerald-300">2.1k eps</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">Correlated alerts</span>
                                <span className="text-red-300">18</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">Blocked payloads</span>
                                <span className="text-blue-300">442</span>
                            </div>
                        </div>
                        <div className="mb-5 flex items-center justify-between">
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-200">
                                Queue
                            </p>
                            <AppBadge variant="emerald">Live</AppBadge>
                        </div>
                        <div className="space-y-3">
                            {allAlerts.map((alert) => {
                                const active = alert.id === selectedAlert.id;
                                const resolved = Boolean(verdicts[alert.id]);

                                return (
                                    <button
                                        key={alert.id}
                                        onClick={() => {
                                            setSelectedId(alert.id);
                                        }}
                                        className={[
                                            "w-full rounded-2xl border p-4 text-left transition",
                                            active
                                                ? "border-emerald-300/25 bg-blue-400/[0.08]"
                                                : "border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.055]",
                                        ].join(" ")}
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                                #{alert.id}
                                            </p>
                                            <AppBadge variant={resolved ? "emerald" : severityVariant(alert.severity)}>
                                                {resolved ? "Resolved" : alert.severity}
                                            </AppBadge>
                                        </div>

                                        <h3 className="font-black text-white">{alert.title}</h3>
                                        <p className="mt-2 text-sm text-slate-500">{alert.category} · {alert.timestamp}</p>
                                        {alert.generated && (
                                            <div className="mt-3">
                                                <AppBadge variant={bridgeVariant(alert.bridgeLabel)}>
                                                    {alert.bridgeLabel}
                                                </AppBadge>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </PanelCard>

                    <SocAlertDetail alert={selectedAlert} />

                    <aside className="space-y-6">
                        <PanelCard variant="darkNexus" accent="emerald">
                            <div className="mb-4 flex items-center gap-2 text-blue-200">
                                <Eye size={18} />
                                <p className="font-mono text-xs uppercase tracking-[0.3em]">
                                    Signals
                                </p>
                            </div>

                            <div className="space-y-3">
                                {selectedAlert.signals.map((signal) => (
                                    <div
                                        key={signal}
                                        className="rounded-xl border border-blue-300/15 bg-blue-400/[0.06] p-3 text-sm font-bold text-slate-200"
                                    >
                                        {signal}
                                    </div>
                                ))}
                            </div>
                        </PanelCard>

                        <SocResponseActions
                            alert={selectedAlert}
                            selectedVerdict={selectedVerdict}
                            onVerdict={submitVerdict}
                        />

                        <PanelCard variant="darkNexus" accent="violet">
                            <div className="mb-4 flex items-center gap-2 text-indigo-200">
                                <AlertTriangle size={18} />
                                <p className="font-mono text-xs uppercase tracking-[0.3em]">
                                    Analyst note
                                </p>
                            </div>

                            <textarea
                                placeholder="Document your reasoning..."
                                className="min-h-20 w-full resize-none rounded-xl border border-slate-300/10 bg-black/35 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-300/35"
                            />
                        </PanelCard>
                    </aside>
                </section>
            </>
        </SocLayout>
    );
}

function Stat({ label, value, icon }) {
    return (
        <PanelCard variant="default" accent="blue">
            {createElement(icon, { className: "mb-3 text-blue-200", size: 20 })}

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-2xl font-black text-white">
                {value}
            </p>
        </PanelCard>
    );
}

function Meta({ label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>
            <p className="mt-1 font-bold text-white">{value}</p>
        </div>
    );
}

function IntelRow({ label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 break-words text-sm font-bold text-white">
                {value}
            </p>
        </div>
    );
}
