"use client";

import { useMemo, useState } from "react";
import { Search, ShieldAlert } from "lucide-react";
import SocLayout from "@/defend/components/soc/layout/SocLayout";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import { socAlerts } from "@/defend/data/socAlerts";
import { getIncidents, mapIncidentToSocAlert } from "@/defend/lib/defend/incidentService";
import MailBrandIcon from "@/defend/components/mail/MailBrandIcon";
import EmptyState from "@/defend/components/shared/EmptyState";
import SectionHeader from "@/defend/components/shared/SectionHeader";

function severityVariant(severity: string) {
    if (severity === "Critical" || severity === "High") return "danger";
    if (severity === "Medium") return "amber";
    return "blue";
}

function sourceLabel(alert: Record<string, unknown>) {
    if (!alert.generated) return "Mock SOC";
    return alert.bridgeLabel === "Escalated" || alert.escalated ? "Escalated" : "Generated";
}

function sourceVariant(label: string) {
    if (label === "Escalated") return "amber";
    if (label === "Generated") return "emerald";
    return "blue";
}

export default function SocAlertsPage() {
    const [query, setQuery] = useState("");
    const [severity, setSeverity] = useState("All");
    const [source, setSource] = useState("All");

    const generatedAlerts = useMemo(() => getIncidents().map(mapIncidentToSocAlert), []);
    const allAlerts = useMemo(() => [...generatedAlerts, ...socAlerts], [generatedAlerts]);

    const filteredAlerts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return allAlerts.filter((alert) => {
            const label = sourceLabel(alert);
            const matchesQuery =
                !normalizedQuery ||
                [alert.title, alert.category, alert.source, alert.datasource, alert.description]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(normalizedQuery));
            const matchesSeverity = severity === "All" || alert.severity === severity;
            const matchesSource =
                source === "All" ||
                (source === "Simulator" && alert.generated) ||
                (source === "Mock SOC" && !alert.generated) ||
                source === label;
            return matchesQuery && matchesSeverity && matchesSource;
        });
    }, [allAlerts, query, severity, source]);

    return (
        <SocLayout>
            <SectionHeader
                eyebrow="Alert Queue"
                title="SOC Alerts"
                description="Investigate simulator-generated escalations alongside mock SOC telemetry."
                actions={
                    <>
                        <AppBadge variant="emerald">{generatedAlerts.length} generated</AppBadge>
                        <AppBadge variant="blue">{socAlerts.length} mock SOC</AppBadge>
                    </>
                }
            />

            <PanelCard variant="darkOps" accent="blue" className="mb-5">
                <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search alerts, sources, categories..."
                            className="w-full rounded-xl border border-slate-300/10 bg-black/35 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-300/35"
                        />
                    </div>

                    <select
                        value={severity}
                        onChange={(event) => setSeverity(event.target.value)}
                        className="rounded-xl border border-slate-300/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-300/35"
                    >
                        <option>All</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>

                    <select
                        value={source}
                        onChange={(event) => setSource(event.target.value)}
                        className="rounded-xl border border-slate-300/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-300/35"
                    >
                        <option>All</option>
                        <option>Simulator</option>
                        <option>Mock SOC</option>
                    </select>
                </div>
            </PanelCard>

            {filteredAlerts.length ? (
                <section className="grid gap-4">
                    {filteredAlerts.map((alert) => {
                        const label = sourceLabel(alert);
                        return (
                            <PanelCard
                                key={alert.id}
                                variant="darkOps"
                                accent={severityVariant(alert.severity)}
                                hover
                                className="p-4"
                            >
                                <div className="grid gap-5 xl:grid-cols-[52px_170px_1fr_150px_150px_130px] xl:items-center">
                                    <MailBrandIcon
                                        brand={alert.artifact?.brand}
                                        label={alert.artifact?.avatar || alert.category || "SOC"}
                                    />

                                    <div>
                                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                            {alert.id}
                                        </p>
                                        <p className="mt-2 text-sm text-slate-400">{alert.timestamp}</p>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            <AppBadge variant={severityVariant(alert.severity)}>{alert.severity}</AppBadge>
                                            <AppBadge variant="blue">{alert.category}</AppBadge>
                                            <AppBadge variant={sourceVariant(label)}>{label}</AppBadge>
                                        </div>
                                        <h2 className="text-xl font-black text-white">{alert.title}</h2>
                                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{alert.description}</p>
                                    </div>

                                    <Mini label="Source" value={alert.source} />
                                    <Mini label="Datasource" value={alert.datasource} />
                                    <Mini label="Status" value={alert.status} />
                                </div>

                                <div className="mt-4 grid gap-3 md:grid-cols-3">
                                    {((alert.signals as string[] | undefined) || []).slice(0, 3).map((signal) => (
                                        <div
                                            key={signal}
                                            className="rounded-xl border border-blue-300/12 bg-blue-400/[0.04] px-4 py-3 text-sm font-bold text-slate-300"
                                        >
                                            {signal}
                                        </div>
                                    ))}
                                </div>
                            </PanelCard>
                        );
                    })}
                </section>
            ) : (
                <EmptyState
                    icon={ShieldAlert}
                    title="No alerts match this filter"
                    description="Adjust search, severity, or source filters to expand the queue."
                />
            )}
        </SocLayout>
    );
}

function Mini({ label, value }: { label: string; value?: string }) {
    return (
        <div className="rounded-xl border border-slate-300/10 bg-slate-400/[0.035] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">{label}</p>
            <p className="mt-1 line-clamp-2 text-sm font-bold text-white">{value || "-"}</p>
        </div>
    );
}
