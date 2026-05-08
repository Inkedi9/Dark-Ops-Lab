"use client";

import { useMemo, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Eye,
    FileSearch,
    Inbox,
    Radio,
    ShieldAlert,
    ShieldCheck,
} from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import { socAlerts } from "@/data/socAlerts";
import SocLayout from "../components/soc/layout/SocLayout";
import { getIncidents, mapIncidentToSocAlert } from "@/lib/defend/incidentService";

function severityVariant(severity) {
    if (severity === "Critical" || severity === "High") return "danger";
    if (severity === "Medium") return "amber";
    return "blue";
}

export default function SocPage() {
    const generatedAlerts = getIncidents().map(mapIncidentToSocAlert);
    const allAlerts = [...generatedAlerts, ...socAlerts];

    const [selectedId, setSelectedId] = useState(allAlerts[0]?.id);
    const [verdicts, setVerdicts] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);

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
        setShowFeedback(true);
    }

    const selectedVerdict = verdicts[selectedAlert.id];
    const isCorrect = selectedVerdict === selectedAlert.expectedVerdict;

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
                        {alert.generated && (
                            <AppBadge variant="danger">
                                Generated
                            </AppBadge>
                        )}

                        <div className="space-y-3">
                            {allAlerts.map((alert) => {
                                const active = alert.id === selectedAlert.id;
                                const resolved = Boolean(verdicts[alert.id]);

                                return (
                                    <button
                                        key={alert.id}
                                        onClick={() => {
                                            setSelectedId(alert.id);
                                            setShowFeedback(false);
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

                                        <h3 className="font-black text-white">{alert.rule}</h3>
                                        <p className="mt-2 text-sm text-slate-500">{alert.type} · {alert.timestamp}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkNexusHero" accent="blue">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="font-mono text-xs uppercase tracking-[0.35em] text-blue-200">
                                    Assigned alert
                                </p>
                                <h2 className="mt-2 text-3xl font-black text-white">
                                    {selectedAlert.title}
                                </h2>
                            </div>

                            <AppBadge variant={severityVariant(selectedAlert.severity)}>
                                {selectedAlert.severity}
                            </AppBadge>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            <Meta label="Type" value={selectedAlert.type} />
                            <Meta label="Datasource" value={selectedAlert.datasource} />
                            <Meta label="Direction" value={selectedAlert.direction} />
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/30 p-5">
                            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
                                Artifact
                            </p>

                            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300 md:grid-cols-[160px_1fr]">
                                <p className="text-slate-500">Subject</p>
                                <p className="font-bold text-white">{selectedAlert.artifact.subject}</p>

                                <p className="text-slate-500">Sender</p>
                                <p>{selectedAlert.artifact.sender}</p>

                                <p className="text-slate-500">Recipient</p>
                                <p>{selectedAlert.artifact.recipient}</p>

                                <p className="text-slate-500">Attachment</p>
                                <p>{selectedAlert.artifact.attachment}</p>

                                <p className="text-slate-500">Content</p>
                                <pre className="whitespace-pre-wrap rounded-xl border border-white/[0.07] bg-black/35 p-4 font-mono text-xs leading-6 text-slate-300">
                                    {selectedAlert.artifact.content}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-5 xl:grid-cols-2">
                            <PanelCard variant="darkNexus" accent="blue">
                                <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-blue-200">
                                    Investigation timeline
                                </p>

                                <div className="space-y-3">
                                    {selectedAlert.timeline.map((item) => (
                                        <div
                                            key={`${item.time}-${item.event}`}
                                            className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3"
                                        >
                                            <span className="font-mono text-xs text-blue-300">
                                                {item.time}
                                            </span>

                                            <p className="text-sm leading-5 text-slate-300">
                                                {item.event}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </PanelCard>

                            <PanelCard variant="darkNexus" accent="amber">
                                <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-amber-200">
                                    Indicators
                                </p>

                                <div className="space-y-3">
                                    {selectedAlert.indicators.map((ioc) => (
                                        <div
                                            key={`${ioc.type}-${ioc.value}`}
                                            className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3"
                                        >
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                                                    {ioc.type}
                                                </span>

                                                <AppBadge
                                                    variant={
                                                        ioc.verdict === "malicious"
                                                            ? "danger"
                                                            : ioc.verdict === "suspicious"
                                                                ? "amber"
                                                                : "emerald"
                                                    }
                                                >
                                                    {ioc.verdict}
                                                </AppBadge>
                                            </div>

                                            <p className="break-all font-mono text-xs text-slate-300">
                                                {ioc.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </PanelCard>
                        </div>

                        {showFeedback && selectedVerdict && (
                            <div
                                className={[
                                    "mt-5 rounded-2xl border p-5",
                                    isCorrect
                                        ? "border-emerald-300/25 bg-blue-400/[0.08]"
                                        : "border-red-300/25 bg-red-400/[0.08]",
                                ].join(" ")}
                            >
                                <p className={isCorrect ? "font-black text-emerald-200" : "font-black text-red-200"}>
                                    {isCorrect ? "Correct classification" : "Incorrect classification"}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    Expected verdict: <span className="font-bold text-white">{selectedAlert.expectedVerdict}</span>
                                </p>
                            </div>
                        )}
                    </PanelCard>

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

                        <PanelCard variant="darkNexus" accent="amber">
                            <div className="mb-4 flex items-center gap-2 text-amber-200">
                                <FileSearch size={18} />
                                <p className="font-mono text-xs uppercase tracking-[0.3em]">
                                    Triage
                                </p>
                            </div>

                            <div className="space-y-3">
                                {["Benign", "Suspicious", "Malicious"].map((verdict) => (
                                    <button
                                        key={verdict}
                                        onClick={() => submitVerdict(verdict)}
                                        className={[
                                            "w-full rounded-xl border px-4 py-3 text-left font-bold transition",
                                            selectedVerdict === verdict
                                                ? "border-amber-300/30 bg-amber-400/[0.08] text-white"
                                                : "border-white/[0.07] bg-white/[0.035] text-slate-300 hover:bg-white/[0.055] hover:text-white",
                                        ].join(" ")}
                                    >
                                        Classify as {verdict}
                                    </button>
                                ))}
                            </div>
                        </PanelCard>

                        <PanelCard variant="darkNexus" accent="blue">
                            <div className="mb-4 flex items-center gap-2 text-blue-200">
                                <ShieldCheck size={18} />
                                <p className="font-mono text-xs uppercase tracking-[0.3em]">
                                    Recommended response
                                </p>
                            </div>

                            <p className="text-sm leading-6 text-slate-300">
                                {selectedAlert.recommendedAction}
                            </p>
                        </PanelCard>

                        <PanelCard variant="darkNexus" accent="violet">
                            <div className="mb-4 flex items-center gap-2 text-indigo-200">
                                <AlertTriangle size={18} />
                                <p className="font-mono text-xs uppercase tracking-[0.3em]">
                                    Analyst note
                                </p>
                            </div>

                            <textarea
                                placeholder="Document your reasoning..."
                                className="min-h-28 w-full resize-none rounded-xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-300/40"
                            />
                        </PanelCard>
                    </aside>
                </section>
            </>
        </SocLayout>
    );
}

function Stat({ label, value, icon: Icon }) {
    return (
        <PanelCard variant="default" accent="blue">
            <Icon className="mb-3 text-blue-200" size={20} />

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