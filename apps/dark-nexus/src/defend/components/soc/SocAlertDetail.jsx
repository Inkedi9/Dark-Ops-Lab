"use client";

import {
    AlertTriangle,
    Clock3,
    FileSearch,
    Fingerprint,
    ShieldCheck,
    UserCheck,
} from "lucide-react";
import { createElement } from "react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import MitreBadge from "@/defend/components/threat/MitreBadge";

function severityVariant(severity) {
    if (severity === "Critical" || severity === "High") return "danger";
    if (severity === "Medium") return "amber";
    return "blue";
}

export default function SocAlertDetail({ alert }) {
    if (!alert) {
        return (
            <PanelCard variant="darkOps" accent="blue">
                <p className="text-sm text-slate-400">No alert selected.</p>
            </PanelCard>
        );
    }

    return (
        <div className="space-y-5">
            <PanelCard variant="darkOpsHero" accent={severityVariant(alert.severity)}>
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="mb-3 flex flex-wrap gap-2">
                            <AppBadge variant={severityVariant(alert.severity)}>
                                {alert.severity}
                            </AppBadge>

                            {alert.generated && (
                                <AppBadge variant={alert.title?.startsWith("Escalated") ? "amber" : "danger"}>
                                    {alert.title?.startsWith("Escalated") ? "Escalated" : "Generated"}
                                </AppBadge>
                            )}

                            <AppBadge variant="blue">
                                {alert.category}
                            </AppBadge>
                        </div>

                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                            {alert.id}
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-white">
                            {alert.title || alert.rule}
                        </h2>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                            {alert.description || alert.reason || "Security alert requires analyst review."}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-4 text-right">
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            Timestamp
                        </p>
                        <p className="mt-1 font-mono text-sm text-white">
                            {alert.timestamp || "-"}
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                    <MetaBox icon={Fingerprint} label="Source" value={alert.source || "-"} />
                    <MetaBox icon={FileSearch} label="Datasource" value={alert.datasource || "-"} />
                    <MetaBox icon={UserCheck} label="Direction" value={alert.direction || "-"} />
                    <MetaBox icon={ShieldCheck} label="Status" value={alert.status || "open"} />
                </div>
            </PanelCard>

            <PanelCard variant="darkOps" accent="blue">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                    Artifact
                </p>

                <div className="grid gap-3 md:grid-cols-[160px_1fr] text-sm">
                    <span className="text-slate-500">Subject</span>
                    <span className="font-bold text-white">
                        {alert.artifact?.subject || alert.subject || "-"}
                    </span>

                    <span className="text-slate-500">Sender</span>
                    <span className="break-all text-slate-300">
                        {alert.artifact?.sender || alert.sender || "-"}
                    </span>

                    <span className="text-slate-500">Recipient</span>
                    <span className="text-slate-300">
                        {alert.artifact?.recipient || alert.recipient || "-"}
                    </span>

                    <span className="text-slate-500">Attachment</span>
                    <span className="text-slate-300">
                        {alert.artifact?.attachment || alert.attachment || "None"}
                    </span>

                    {alert.artifact?.content && (
                        <>
                            <span className="text-slate-500">Content</span>
                            <pre className="whitespace-pre-wrap rounded-xl border border-white/[0.07] bg-black/35 p-4 font-mono text-xs leading-6 text-slate-300">
                                {alert.artifact.content}
                            </pre>
                        </>
                    )}
                </div>
            </PanelCard>

            {(alert.userVerdict || alert.confidence || alert.analystReasoning) && (
                <PanelCard variant="darkOps" accent="amber">
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
                        Analyst Assessment
                    </p>

                    <div className="grid gap-3 md:grid-cols-4">
                        <Mini label="User verdict" value={alert.userVerdict || "Unknown"} />
                        <Mini label="Expected" value={alert.expectedVerdict || "Unknown"} />
                        <Mini label="Confidence" value={alert.confidence || "Unknown"} />
                        <Mini label="Risk" value={alert.riskLevel || alert.severity || "Unknown"} />
                    </div>

                    {alert.analystReasoning && (
                        <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                Reasoning
                            </p>

                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                {alert.analystReasoning}
                            </p>
                        </div>
                    )}
                </PanelCard>
            )}

            {alert.timeline?.length > 0 && (
                <PanelCard variant="darkOps" accent="blue">
                    <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                        <Clock3 className="h-4 w-4" />
                        Timeline
                    </p>

                    <div className="space-y-3">
                        {alert.timeline.map((item, index) => (
                            <div
                                key={`${item.time}-${item.event}-${index}`}
                                className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3"
                            >
                                <span className="font-mono text-xs text-blue-300">
                                    {item.time || `0${index + 1}`}
                                </span>
                                <p className="text-sm leading-5 text-slate-300">
                                    {item.event}
                                </p>
                            </div>
                        ))}
                    </div>
                </PanelCard>
            )}

            {(alert.mitre || alert.mitreTechniques?.length > 0 || alert.technique) && (
                <PanelCard variant="danger" accent="danger">
                    <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-red-300">
                        <AlertTriangle className="h-4 w-4" />
                        MITRE / Technique
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {alert.mitre && <MitreBadge technique={alert.mitre} />}
                        {alert.mitreTechniques?.map((technique) => (
                            <MitreBadge key={technique} technique={technique} />
                        ))}
                    </div>

                    {alert.technique && (
                        <p className="mt-4 text-sm leading-6 text-slate-300">
                            Technique: {alert.technique}
                        </p>
                    )}
                </PanelCard>
            )}
        </div>
    );
}

function MetaBox({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {label}
                </p>
                {createElement(Icon, { className: "h-4 w-4 text-blue-300" })}
            </div>
            <p className="break-all text-sm font-bold text-white">{value}</p>
        </div>
    );
}

function Mini({ label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {label}
            </p>
            <p className="mt-1 break-all text-sm font-bold text-white">{value}</p>
        </div>
    );
}
