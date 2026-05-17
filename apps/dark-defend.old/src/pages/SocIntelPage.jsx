"use client";

import { createElement, useMemo } from "react";
import {
    AlertTriangle,
    Fingerprint,
    RadioTower,
    ShieldAlert,
    Target,
} from "lucide-react";
import SocLayout from "@/components/soc/layout/SocLayout";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import MitreBadge from "@/components/threat/MitreBadge";
import { socAlerts } from "@/data/socAlerts";
import { getIncidents, mapIncidentToSocAlert } from "@/lib/defend/incidentService";
import EmptyState from "@/components/shared/EmptyState";
import SectionHeader from "@/components/shared/SectionHeader";

function severityVariant(severity) {
    if (severity === "Critical" || severity === "High") return "danger";
    if (severity === "Medium") return "amber";
    return "blue";
}

function incrementCount(map, key) {
    if (!key) return;
    map.set(key, (map.get(key) || 0) + 1);
}

function sortCounts(map) {
    return [...map.entries()]
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function getSender(alert) {
    return alert.artifact?.sender || alert.sender || "Unknown sender";
}

function getTechniques(alert) {
    return [
        alert.mitre,
        ...(alert.mitreTechniques || []),
    ].filter(Boolean);
}

export default function SocIntelPage() {
    const generatedAlerts = useMemo(() => getIncidents().map(mapIncidentToSocAlert), []);
    const allAlerts = useMemo(() => [...generatedAlerts, ...socAlerts], [generatedAlerts]);

    const intel = useMemo(() => {
        const senderCounts = new Map();
        const categoryCounts = new Map();
        const mitreCounts = new Map();
        const signalCounts = new Map();
        const senderRisk = new Map();

        allAlerts.forEach((alert) => {
            const sender = getSender(alert);

            incrementCount(senderCounts, sender);
            incrementCount(categoryCounts, alert.category || "Uncategorized");

            getTechniques(alert).forEach((technique) => {
                incrementCount(mitreCounts, technique);
            });

            (alert.signals || []).forEach((signal) => {
                incrementCount(signalCounts, signal);
            });

            const current = senderRisk.get(sender) || {
                high: 0,
                generated: 0,
                total: 0,
                latest: alert.timestamp || "-",
            };

            senderRisk.set(sender, {
                ...current,
                high:
                    current.high +
                    (alert.severity === "Critical" || alert.severity === "High" ? 1 : 0),
                generated: current.generated + (alert.generated ? 1 : 0),
                total: current.total + 1,
                latest: alert.timestamp || current.latest,
            });
        });

        return {
            topSenders: sortCounts(senderCounts).slice(0, 6),
            topCategories: sortCounts(categoryCounts).slice(0, 6),
            mitreTechniques: sortCounts(mitreCounts),
            signalPatterns: sortCounts(signalCounts).slice(0, 8),
            suspiciousSenders: sortCounts(senderCounts)
                .map((item) => ({
                    ...item,
                    ...(senderRisk.get(item.label) || {}),
                }))
                .sort((a, b) => b.high - a.high || b.generated - a.generated || b.count - a.count)
                .slice(0, 8),
            highSeverityAlerts: allAlerts.filter(
                (alert) => alert.severity === "Critical" || alert.severity === "High"
            ),
        };
    }, [allAlerts]);

    return (
        <SocLayout>
            <SectionHeader
                eyebrow="Threat Intel"
                title="Threat Intel"
                description="Compact intelligence view across mock SOC telemetry and local simulator-generated incidents."
                actions={
                    <>
                        <AppBadge variant="emerald">{allAlerts.length} correlated alerts</AppBadge>
                        <AppBadge variant="amber">{generatedAlerts.length} simulator incidents</AppBadge>
                    </>
                }
            />

            <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <IntelStat icon={RadioTower} label="Total alerts" value={allAlerts.length} />
                <IntelStat icon={ShieldAlert} label="High severity" value={intel.highSeverityAlerts.length} />
                <IntelStat icon={Fingerprint} label="Top senders" value={intel.topSenders.length} />
                <IntelStat icon={Target} label="Generated" value={generatedAlerts.length} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <PanelCard variant="darkNexus" accent="blue">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-200">
                                MITRE technique cloud
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                Techniques observed from simulator incidents and enriched alerts.
                            </p>
                        </div>
                        <AppBadge variant="blue">{intel.mitreTechniques.length} techniques</AppBadge>
                    </div>

                    {intel.mitreTechniques.length ? (
                        <div className="flex flex-wrap gap-3">
                            {intel.mitreTechniques.map((technique) => (
                                <div
                                    key={technique.label}
                                    className="flex items-center gap-2 rounded-xl border border-red-300/10 bg-red-400/[0.035] px-3 py-2"
                                >
                                    <MitreBadge technique={technique.label} />
                                    <span className="font-mono text-xs text-slate-500">
                                        x{technique.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Target}
                            title="No MITRE mappings"
                            description="No MITRE mappings found in the current alert set."
                        />
                    )}
                </PanelCard>

                <PanelCard variant="darkNexus" accent="amber">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-amber-200">
                            Top categories
                        </p>
                        <AppBadge variant="amber">Observed patterns</AppBadge>
                    </div>

                    <div className="space-y-3">
                        {intel.topCategories.map((category) => (
                            <RankRow
                                key={category.label}
                                label={category.label}
                                value={`${category.count} alert${category.count > 1 ? "s" : ""}`}
                                tone="amber"
                            />
                        ))}
                    </div>
                </PanelCard>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <PanelCard variant="darkNexus" accent="blue">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-200">
                            Suspicious senders
                        </p>
                        <AppBadge variant="blue">{intel.suspiciousSenders.length} tracked</AppBadge>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
                        <div className="grid grid-cols-[1fr_80px_80px_90px] gap-3 border-b border-white/[0.07] bg-white/[0.035] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            <span>Sender</span>
                            <span>Alerts</span>
                            <span>High</span>
                            <span>Generated</span>
                        </div>

                        {intel.suspiciousSenders.map((sender) => (
                            <div
                                key={sender.label}
                                className="grid grid-cols-[1fr_80px_80px_90px] gap-3 border-b border-white/[0.05] px-4 py-3 text-sm last:border-b-0"
                            >
                                <span className="break-all font-bold text-white">{sender.label}</span>
                                <span className="font-mono text-slate-300">{sender.count}</span>
                                <span className="font-mono text-red-200">{sender.high || 0}</span>
                                <span className="font-mono text-blue-200">{sender.generated || 0}</span>
                            </div>
                        ))}
                    </div>
                </PanelCard>

                <PanelCard variant="darkNexus" accent="danger">
                    <div className="mb-5 flex items-center gap-2 text-red-200">
                        <AlertTriangle className="h-4 w-4" />
                        <p className="font-mono text-xs uppercase tracking-[0.28em]">
                            High severity alerts
                        </p>
                    </div>

                    <div className="space-y-3">
                        {intel.highSeverityAlerts.slice(0, 5).map((alert) => (
                            <div
                                key={alert.id}
                                className="rounded-xl border border-red-300/12 bg-red-400/[0.045] p-3"
                            >
                                <div className="mb-2 flex flex-wrap gap-2">
                                    <AppBadge variant={severityVariant(alert.severity)}>
                                        {alert.severity}
                                    </AppBadge>
                                    <AppBadge variant="blue">{alert.category}</AppBadge>
                                </div>
                                <p className="font-bold text-white">{alert.title}</p>
                                <p className="mt-1 text-xs text-slate-500">{getSender(alert)}</p>
                            </div>
                        ))}
                    </div>
                </PanelCard>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <PanelCard variant="darkNexus" accent="blue">
                    <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-blue-200">
                        Top senders
                    </p>

                    <div className="space-y-3">
                        {intel.topSenders.map((sender) => (
                            <RankRow
                                key={sender.label}
                                label={sender.label}
                                value={`${sender.count} hit${sender.count > 1 ? "s" : ""}`}
                            />
                        ))}
                    </div>
                </PanelCard>

                <PanelCard variant="darkNexus" accent="blue">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-200">
                            Signal patterns
                        </p>
                        <AppBadge variant="blue">Recurring signals</AppBadge>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {intel.signalPatterns.map((signal) => (
                            <div
                                key={signal.label}
                                className="rounded-xl border border-blue-300/12 bg-blue-400/[0.045] p-4"
                            >
                                <p className="text-sm font-bold leading-6 text-slate-200">
                                    {signal.label}
                                </p>
                                <p className="mt-2 font-mono text-xs text-blue-200">
                                    {signal.count} observation{signal.count > 1 ? "s" : ""}
                                </p>
                            </div>
                        ))}
                    </div>
                </PanelCard>
            </section>
        </SocLayout>
    );
}

function IntelStat({ icon, label, value }) {
    return (
        <PanelCard variant="darkNexus" accent="blue">
            {createElement(icon, { className: "mb-3 text-blue-200", size: 20 })}
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-3xl font-black text-white">{value}</p>
        </PanelCard>
    );
}

function RankRow({ label, value, tone = "blue" }) {
    const toneClass =
        tone === "amber"
            ? "border-amber-300/12 bg-amber-400/[0.04] text-amber-200"
            : "border-blue-300/12 bg-blue-400/[0.04] text-blue-200";

    return (
        <div className={`rounded-xl border px-4 py-3 ${toneClass}`}>
            <div className="flex items-center justify-between gap-4">
                <p className="min-w-0 break-all text-sm font-bold text-white">{label}</p>
                <p className="shrink-0 font-mono text-xs">{value}</p>
            </div>
        </div>
    );
}
