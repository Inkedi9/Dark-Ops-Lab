import AppBadge from "@dark/ui/components/AppBadge";
import PanelCard from "@dark/ui/components/PanelCard";
import MitreBadge from "@/components/threat/MitreBadge";

function severityVariant(severity) {
    if (severity === "Critical" || severity === "High") return "danger";
    if (severity === "Medium") return "amber";
    return "blue";
}

export default function SocIncidentReport({ incidents = [] }) {
    const highCount = incidents.filter((i) => i.severity === "High").length;
    const manualCount = incidents.filter((i) => i.forced).length;
    const autoCount = incidents.filter((i) => !i.forced).length;

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-4xl font-black text-white">
                    DarkDefend SOC Incident Report
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Human-layer defense report · Phishing Simulator + SOC Queue · Local mock mode
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                <ReportStat label="Incidents" value={incidents.length} tone="blue" />
                <ReportStat label="High severity" value={highCount} tone="red" />
                <ReportStat label="Generated" value={autoCount} tone="amber" />
                <ReportStat label="Escalated" value={manualCount} tone="green" />
            </section>

            <p className="border-b border-white/[0.06] pb-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                Incident analysis
            </p>

            {incidents.map((incident) => (
                <PanelCard
                    key={incident.id}
                    variant="darkNexus"
                    accent={incident.forced ? "amber" : "danger"}
                >
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="mb-3 flex flex-wrap gap-2">
                                <AppBadge variant={severityVariant(incident.severity)}>
                                    {incident.severity}
                                </AppBadge>
                                <AppBadge variant={incident.forced ? "amber" : "danger"}>
                                    {incident.forced ? "Manual escalation" : "Auto generated"}
                                </AppBadge>
                            </div>

                            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                {incident.id}
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-white">
                                {incident.title}
                            </h2>
                        </div>

                        <p className="font-mono text-xs text-slate-500">
                            {new Date(incident.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-4">
                        <ReportMini label="User verdict" value={incident.userVerdict || "-"} />
                        <ReportMini label="Expected" value={incident.expectedVerdict || "-"} />
                        <ReportMini label="Confidence" value={incident.confidence || "-"} />
                        <ReportMini label="Risk" value={incident.riskLevel || incident.severity} />
                    </div>

                    {incident.analystReasoning && (
                        <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                Analyst reasoning
                            </p>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                {incident.analystReasoning}
                            </p>
                        </div>
                    )}

                    <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            Artifact
                        </p>

                        <div className="mt-3 grid gap-2 text-sm md:grid-cols-[150px_1fr]">
                            <span className="text-slate-500">Sender</span>
                            <span className="break-all text-slate-300">{incident.artifact?.sender}</span>

                            <span className="text-slate-500">Subject</span>
                            <span className="text-slate-300">{incident.artifact?.subject}</span>

                            <span className="text-slate-500">Attachment</span>
                            <span className="text-slate-300">{incident.artifact?.attachment}</span>

                            <span className="text-slate-500">URL</span>
                            <span className="break-all text-slate-300">{incident.artifact?.url}</span>
                        </div>
                    </div>

                    {incident.mitre && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            <MitreBadge technique={incident.mitre} />
                        </div>
                    )}

                    <div className="mt-5 rounded-2xl border border-blue-300/12 bg-blue-400/[0.045] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-200">
                            Recommended action
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            {incident.recommendedAction}
                        </p>
                    </div>
                </PanelCard>
            ))}
        </div>
    );
}

function ReportStat({ label, value, tone = "blue" }) {
    const tones = {
        blue: "border-blue-300/15 bg-blue-400/[0.055] text-blue-200",
        red: "border-red-300/15 bg-red-400/[0.055] text-red-200",
        amber: "border-amber-300/15 bg-amber-400/[0.055] text-amber-200",
        green: "border-emerald-300/15 bg-emerald-400/[0.055] text-emerald-200",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-3xl font-black text-white">{value}</p>
        </div>
    );
}

function ReportMini({ label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {label}
            </p>
            <p className="mt-1 break-all text-sm font-bold text-white">
                {value}
            </p>
        </div>
    );
}