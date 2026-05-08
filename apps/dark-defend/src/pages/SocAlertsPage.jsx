"use client";

import { useMemo, useState } from "react";
import { Search, ShieldAlert } from "lucide-react";
import SocLayout from "../components/soc/layout/SocLayout";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import { socAlerts } from "@/data/socAlerts";
import { getIncidents, mapIncidentToSocAlert } from "@/lib/defend/incidentService";

function severityVariant(severity) {
    if (severity === "Critical" || severity === "High") return "danger";
    if (severity === "Medium") return "amber";
    return "blue";
}

export default function SocAlertsPage() {
    const [query, setQuery] = useState("");
    const [severity, setSeverity] = useState("All");

    const generatedAlerts = getIncidents().map(mapIncidentToSocAlert);
    const allAlerts = [...generatedAlerts, ...socAlerts];

    const filteredAlerts = useMemo(() => {
        return allAlerts.filter((alert) => {
            const matchesQuery =
                alert.title.toLowerCase().includes(query.toLowerCase()) ||
                alert.category.toLowerCase().includes(query.toLowerCase()) ||
                alert.source.toLowerCase().includes(query.toLowerCase());

            const matchesSeverity =
                severity === "All" || alert.severity === severity;

            return matchesQuery && matchesSeverity;
        });
    }, [query, severity]);

    return (
        <SocLayout>
            <section className="mb-8">
                <div className="mb-4 flex flex-wrap gap-2">
                    <AppBadge variant="blue">SIEM queue</AppBadge>
                    <AppBadge variant="amber">{filteredAlerts.length} visible alerts</AppBadge>
                </div>

                <h1 className="text-5xl font-black tracking-tight text-white">
                    Alert Queue
                </h1>

                <p className="mt-4 max-w-3xl text-slate-400">
                    Search, filter and inspect security alerts across identity, endpoint,
                    network, cloud and application telemetry.
                </p>
            </section>

            <PanelCard variant="darkNexus" accent="blue" className="mb-6">
                <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search alerts, sources, categories..."
                            className="w-full rounded-xl border border-white/[0.08] bg-black/35 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-300/35"
                        />
                    </div>

                    <select
                        value={severity}
                        onChange={(event) => setSeverity(event.target.value)}
                        className="rounded-xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-300/35"
                    >
                        <option>All</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>
                </div>
            </PanelCard>

            <section className="grid gap-4">
                {filteredAlerts.map((alert) => (
                    <PanelCard
                        key={alert.id}
                        variant="darkNexus"
                        accent={severityVariant(alert.severity)}
                        hover
                    >
                        <div className="grid gap-5 xl:grid-cols-[180px_1fr_160px_160px_160px] xl:items-center">
                            <div>
                                <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                    {alert.id}
                                </p>
                                <p className="mt-2 text-sm text-slate-400">
                                    {alert.timestamp}
                                </p>
                            </div>

                            <div>
                                <div className="mb-2 flex flex-wrap gap-2">
                                    <AppBadge variant={severityVariant(alert.severity)}>
                                        {alert.severity}
                                    </AppBadge>
                                    <AppBadge variant="blue">{alert.category}</AppBadge>
                                </div>

                                <h2 className="text-xl font-black text-white">
                                    {alert.title}
                                </h2>

                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                                    {alert.description}
                                </p>
                            </div>

                            <Mini label="Source" value={alert.source} />
                            <Mini label="Datasource" value={alert.datasource} />
                            <Mini label="Status" value={alert.status} />
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-3">
                            {alert.signals.slice(0, 3).map((signal) => (
                                <div
                                    key={signal}
                                    className="rounded-xl border border-blue-300/12 bg-blue-400/[0.04] px-4 py-3 text-sm font-bold text-slate-300"
                                >
                                    {signal}
                                </div>
                            ))}
                        </div>
                    </PanelCard>
                ))}
            </section>
        </SocLayout>
    );
}

function Mini({ label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-bold text-white">
                {value}
            </p>
        </div>
    );
}