"use client";

import SocLayout from "../components/soc/layout/SocLayout";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import {
    FileText,
    Clock,
    ShieldCheck,
    AlertTriangle,
    Download,
} from "lucide-react";

const reports = [
    {
        id: "CASE-1042",
        title: "Credential stuffing attempt against m.chen",
        severity: "High",
        status: "Draft",
        type: "Identity",
        summary:
            "Multiple failed login attempts followed by successful access from an unfamiliar device.",
        timeline: ["Login burst", "New device success", "Sessions revoked", "MFA reset recommended"],
    },
    {
        id: "CASE-1043",
        title: "Encoded PowerShell execution on WIN-014",
        severity: "High",
        status: "Open",
        type: "Endpoint",
        summary:
            "Office-spawned PowerShell execution with encoded command arguments and outbound connection attempt.",
        timeline: ["Document opened", "PowerShell spawned", "Outbound blocked", "Endpoint isolation pending"],
    },
    {
        id: "CASE-1044",
        title: "Approved scanner activity",
        severity: "Low",
        status: "Closed",
        type: "Network",
        summary:
            "Broad TCP scan matched approved internal scanner and validated change ticket.",
        timeline: ["Scan detected", "Scanner allowlist matched", "Ticket validated", "Closed as benign"],
    },
];

function severityVariant(severity) {
    if (severity === "High" || severity === "Critical") return "danger";
    if (severity === "Medium") return "amber";
    return "blue";
}

function statusVariant(status) {
    if (status === "Closed") return "emerald";
    if (status === "Draft") return "amber";
    return "blue";
}

export default function SocReportsPage() {
    return (
        <SocLayout>
            <section className="mb-8">
                <div className="mb-4 flex flex-wrap gap-2">
                    <AppBadge variant="blue">Case reports</AppBadge>
                    <AppBadge variant="emerald">Analyst documentation</AppBadge>
                </div>

                <h1 className="text-5xl font-black tracking-tight text-white">
                    Case Reports
                </h1>

                <p className="mt-4 max-w-3xl text-slate-400">
                    Review investigation summaries, decisions, timelines and response actions generated from SOC analysis.
                </p>
            </section>

            <section className="mb-6 grid gap-4 md:grid-cols-3">
                <ReportStat icon={FileText} label="Reports" value={reports.length} />
                <ReportStat icon={Clock} label="Open cases" value={reports.filter((r) => r.status !== "Closed").length} />
                <ReportStat icon={ShieldCheck} label="Closed" value={reports.filter((r) => r.status === "Closed").length} />
            </section>

            <section className="grid gap-5">
                {reports.map((report) => (
                    <PanelCard
                        key={report.id}
                        variant="darkNexus"
                        accent={severityVariant(report.severity)}
                        hover
                    >
                        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                            <div>
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <AppBadge variant={severityVariant(report.severity)}>
                                        {report.severity}
                                    </AppBadge>
                                    <AppBadge variant={statusVariant(report.status)}>
                                        {report.status}
                                    </AppBadge>
                                    <AppBadge variant="blue">{report.type}</AppBadge>
                                </div>

                                <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
                                    {report.id}
                                </p>

                                <h2 className="mt-2 text-2xl font-black text-white">
                                    {report.title}
                                </h2>

                                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                                    {report.summary}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-blue-200">
                                    Case timeline
                                </p>

                                <div className="space-y-2">
                                    {report.timeline.map((item, index) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/25 px-3 py-2"
                                        >
                                            <span className="font-mono text-xs text-slate-500">
                                                0{index + 1}
                                            </span>
                                            <span className="text-sm font-bold text-slate-300">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3 border-t border-white/[0.06] pt-5">
                            <AppButton variant="secondary">
                                Open report
                            </AppButton>

                            <AppButton variant="ghost">
                                <Download size={16} />
                                Export mock PDF
                            </AppButton>
                        </div>
                    </PanelCard>
                ))}
            </section>

            <PanelCard variant="darkNexusHero" accent="amber" className="mt-6">
                <div className="flex items-start gap-4">
                    <AlertTriangle className="mt-1 h-6 w-6 text-amber-200" />
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.35em] text-amber-200">
                            Mock mode
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-white">
                            Reports are currently local examples.
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Later, reports can be generated from completed alert investigations, analyst notes and selected playbooks.
                        </p>
                    </div>
                </div>
            </PanelCard>
        </SocLayout>
    );
}

function ReportStat({ icon: Icon, label, value }) {
    return (
        <PanelCard variant="darkNexus" accent="blue">
            <Icon className="mb-3 text-blue-200" size={20} />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </PanelCard>
    );
}