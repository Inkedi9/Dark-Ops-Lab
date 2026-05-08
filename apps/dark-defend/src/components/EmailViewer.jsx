import RiskBadge from "./RiskBadge";
import {
    Server,
    Fingerprint,
    FileWarning,
    Link2,
    Radio,
    Crosshair,
    ShieldAlert,
    FileSearch,
    ShieldCheck,
    AlertTriangle,
    Clock3,
    Globe2,
    MapPin,
    KeyRound,
    ExternalLink,
    Paperclip,
} from "lucide-react";

export default function EmailViewer({ email, mode = "beginner" }) {
    if (!email) {
        return (
            <div className="rounded-2xl border border-blue-400/20 bg-black/30 p-6 text-muted">
                Select an email to begin analysis.
            </div>
        );
    }

    const badgeClass =
        email.badge === "External"
            ? "bg-danger/15 text-danger border-danger/30"
            : email.badge === "Internal"
                ? "bg-green-400/10 text-green-300 border-green-300/30"
                : "bg-blue-400/10 text-blue-300 border-blue-300/30";
    const senderDomain = email.senderEmail.split("@")[1] || "unknown";
    const linkDomain = email.linkUrl ? getDomain(email.linkUrl) : null;
    const authStatus = email.badge === "External" && email.type === "phishing" ? "Review" : "Pass";
    const isAnalyst = mode === "analyst";

    return (

        <div className="overflow-hidden rounded-2xl border border-blue-400/20 bg-black/25">

            <div className="border-b border-blue-400/15 bg-black/30 px-6 py-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-300/15 bg-blue-400/[0.07] font-mono text-sm font-black text-blue-100">
                            {email.avatar || email.senderName?.slice(0, 2).toUpperCase() || "EM"}
                        </div>
                        <h2 className="mt-2 text-2xl font-black text-white">{email.subject}</h2>

                        <div className="mt-4 space-y-1 font-mono text-sm text-slate-300">
                            <p>
                                <span className="font-semibold text-white">From:</span> {email.senderName}
                            </p>
                            <p className="break-all text-slate-400">{email.senderEmail}</p>
                            <p>
                                <span className="font-semibold text-white">Date:</span> {email.date}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                To: admin:root@dark.nexus.com
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-blue-400/15 bg-black/30 px-3 py-1 font-mono text-xs text-slate-200">
                            {email.category}
                        </span>

                        <span className="rounded-full border border-blue-400/15 bg-black/30 px-3 py-1 font-mono text-xs text-slate-200">
                            {email.difficulty}
                        </span>

                        <span className={`rounded-full border px-3 py-1 font-mono text-xs ${badgeClass}`}>
                            {email.badge}
                        </span>

                        <RiskBadge level={email.riskLevel} />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-6 py-4">
                <button className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-blue-300/20 hover:text-blue-200">
                    Reply
                </button>

                <button className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-blue-300/20 hover:text-blue-200">
                    Forward
                </button>

                <button className="rounded-xl border border-red-300/15 bg-red-400/[0.05] px-3 py-2 text-xs font-bold text-red-200 transition hover:bg-red-400/[0.08]">
                    Report phishing
                </button>

                <button className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-blue-300/20 hover:text-blue-200">
                    Quarantine
                </button>
            </div>

            {email.badge !== "Internal" && mode !== "analyst" && (
                <div className="mb-5 rounded-2xl border border-amber-300/20 bg-amber-400/[0.08] px-4 py-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,.55)]" />

                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-200">
                                External Sender
                            </p>

                            <p className="mt-1 text-sm leading-6 text-amber-100/90">
                                Use caution with links, attachments, and credential requests.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-6 py-6">
                {mode === "beginner" && (email.learningObjective || email.beginnerTip) && (
                    <div className="mb-5 grid gap-3 md:grid-cols-2">
                        {email.learningObjective && (
                            <div className="rounded-2xl border border-blue-400/15 bg-blue-400/5 p-4">
                                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                                    Learning Objective
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    {email.learningObjective}
                                </p>
                            </div>
                        )}

                        {email.beginnerTip && (
                            <div className="rounded-2xl border border-green-300/15 bg-green-400/5 p-4">
                                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-green-300">
                                    Beginner Tip
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    {email.beginnerTip}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mb-5 grid gap-3 lg:grid-cols-3">
                    <IntelTile
                        icon={<Server className="h-4 w-4" />}
                        label="Sender Domain"
                        value={senderDomain}
                        tone={email.badge === "External" ? "amber" : "green"}
                    />
                    <IntelTile
                        icon={<Fingerprint className="h-4 w-4" />}
                        label="Auth Trace"
                        value={mode === "beginner" ? `SPF/DKIM: ${authStatus}` : "SPF/DKIM: Hidden"}
                        tone={authStatus === "Pass" ? "green" : "amber"}
                    />
                    <IntelTile
                        icon={email.attachment ? <FileWarning className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                        label={email.attachment ? "Attachment" : "URL Domain"}
                        value={email.attachment || linkDomain || "None"}
                        tone={email.attachment || linkDomain ? "amber" : "slate"}
                    />
                    <IntelTile
                        icon={<Radio className="h-4 w-4" />}
                        label="Delivery"
                        value={email.delivery}
                        tone="blue"
                    />

                    <IntelTile
                        icon={<ShieldAlert className="h-4 w-4" />}
                        label="Attack Technique"
                        value={email.attackTechnique}
                        tone={email.type === "phishing" ? "amber" : "blue"}
                    />

                    <IntelTile
                        icon={<Crosshair className="h-4 w-4" />}
                        label="Trust Level"
                        value={email.trustLevel}
                        tone={
                            email.trustLevel === "high"
                                ? "green"
                                : email.trustLevel === "medium"
                                    ? "amber"
                                    : "red"
                        }
                    />
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <MetaPill
                        icon={<ShieldCheck className="h-4 w-4" />}
                        label="Sender Type"
                        value={email.badge === "Internal" ? "Internal" : "External"}
                        tone={email.badge === "Internal" ? "green" : "amber"}
                    />

                    <MetaPill
                        icon={<AlertTriangle className="h-4 w-4" />}
                        label="Risk Level"
                        value={email.riskLevel}
                        tone={
                            email.riskLevel === "High" || email.riskLevel === "Critical"
                                ? "red"
                                : "blue"
                        }
                    />

                    <MetaPill
                        icon={<Fingerprint className="h-4 w-4" />}
                        label="Auth Trace"
                        value={isAnalyst ? "Hidden — inspect manually" : `SPF/DKIM: ${authStatus}`}
                        tone={isAnalyst ? "slate" : authStatus === "Pass" ? "green" : "amber"}
                    />
                </div>

                {mode === "beginner" && email.analystNotes && (
                    <div className="mb-5 rounded-2xl border border-blue-400/15 bg-blue-400/[0.045] p-4">
                        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-blue-200">
                            <FileSearch className="h-4 w-4" />
                            Analyst Notes
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            {email.analystNotes}
                        </p>
                    </div>
                )}

                {mode === "beginner" && email.timeline?.length > 0 && (
                    <div className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                        <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
                            <Clock3 className="h-4 w-4 text-blue-200" />
                            Message Timeline
                        </div>

                        <div className="space-y-3">
                            {email.timeline.map((event, index) => (
                                <div
                                    key={`${event}-${index}`}
                                    className="flex gap-3 rounded-xl border border-white/[0.06] bg-black/25 p-3"
                                >
                                    <span className="font-mono text-xs text-blue-300">
                                        0{index + 1}
                                    </span>

                                    <p className="text-sm leading-5 text-slate-300">
                                        {event}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {mode === "analyst" && (
                    <div className="mb-5 rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                            Analyst mode
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Guided notes and timeline are hidden. Inspect the artifact manually before classification.
                        </p>
                    </div>
                )}

                {email.ioc && (
                    <div className="mb-5 rounded-2xl border border-blue-400/12 bg-blue-400/[0.035] p-4">
                        <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-blue-200">
                            <Globe2 className="h-4 w-4" />
                            Indicator Context
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <IocTile
                                icon={<Clock3 className="h-4 w-4" />}
                                label="Domain Age"
                                value={email.ioc.domainAge}
                                suspicious={email.ioc.domainAge !== "known"}
                            />

                            <IocTile
                                icon={<MapPin className="h-4 w-4" />}
                                label="Geo"
                                value={email.ioc.geo}
                                suspicious={email.ioc.geo !== "internal"}
                            />

                            <IocTile
                                icon={<KeyRound className="h-4 w-4" />}
                                label="Auth Fail"
                                value={email.ioc.authFail ? "Yes" : "No"}
                                suspicious={email.ioc.authFail}
                            />

                            <IocTile
                                icon={<ExternalLink className="h-4 w-4" />}
                                label="Link Mismatch"
                                value={email.ioc.linkMismatch ? "Yes" : "No"}
                                suspicious={email.ioc.linkMismatch}
                            />
                        </div>
                    </div>
                )}

                <div className="px-6 py-6">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-4 flex flex-wrap gap-2">
                            <MailPill
                                label={email.badge === "Internal" ? "Internal sender" : "External sender"}
                                tone={email.badge === "Internal" ? "green" : "amber"}
                            />

                            <MailPill
                                label={email.redFlags?.length ? "Signals detected" : "No obvious signals"}
                                tone={email.redFlags?.length ? "amber" : "blue"}
                            />

                            <MailPill
                                label={email.linkUrl ? "Contains link" : "No link"}
                                tone={email.linkUrl ? "amber" : "slate"}
                            />

                            <MailPill
                                label={email.attachment ? "Attachment present" : "No attachment"}
                                tone={email.attachment ? "red" : "slate"}
                            />
                        </div>

                        <div className="rounded-3xl border border-white/[0.07] bg-[#08111d]/80 p-7 shadow-[inset_0_0_24px_rgba(96,165,250,.025)]">
                            <pre className="whitespace-pre-wrap font-sans text-[15px] leading-8 text-slate-200">
                                {email.body}
                            </pre>

                            {email.linkUrl && (
                                <UrlPreview email={email} />
                            )}

                            {email.attachment && (
                                <AttachmentCard name={email.attachment} />
                            )}

                        </div>
                        {email.threadMessages?.length > 0 && (
                            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                                <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-blue-200">
                                    Conversation Thread
                                </p>

                                <div className="space-y-3">
                                    {email.threadMessages.map((message, index) => (
                                        <div
                                            key={`${message.senderEmail}-${index}`}
                                            className="rounded-2xl border border-white/[0.06] bg-black/25 p-4"
                                        >
                                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-bold text-white">
                                                        {message.senderName}
                                                    </p>

                                                    <p className="font-mono text-xs text-slate-500">
                                                        {message.senderEmail}
                                                    </p>
                                                </div>

                                                <span className="font-mono text-xs text-slate-500">
                                                    {message.date}
                                                </span>
                                            </div>

                                            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                                {message.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function IntelTile({ icon, label, value, tone = "slate" }) {
    const tones = {
        green: "border-green-300/20 bg-green-400/5 text-green-300",
        amber: "border-amber-300/20 bg-amber-400/5 text-amber-300",
        slate: "border-blue-400/15 bg-black/25 text-slate-300",
        blue: "border-blue-400/15 bg-blue-400/[0.05] text-blue-100",
        red: "border-red-300/20 bg-black/25 text-red-300",

    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em]">
                {icon}
                {label}
            </div>
            <p className="mt-2 break-all font-mono text-xs text-slate-200">{value}</p>
        </div>
    );
}

function getDomain(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
}

function MetaPill({ icon, label, value, tone = "blue" }) {
    const tones = {
        blue: "border-blue-300/15 bg-blue-400/[0.055] text-blue-200",
        green: "border-emerald-300/15 bg-emerald-400/[0.055] text-emerald-200",
        amber: "border-amber-300/15 bg-amber-400/[0.055] text-amber-200",
        red: "border-red-300/15 bg-red-400/[0.055] text-red-200",
        slate: "border-white/[0.07] bg-white/[0.035] text-slate-300",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone] || tones.blue}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    {label}
                </p>

                {icon && (
                    <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-black/25">
                        {icon}
                    </div>
                )}
            </div>

            <p className="text-sm font-bold leading-5 text-white">
                {value}
            </p>
        </div>
    );
}

function IocTile({ icon, label, value, suspicious = false }) {
    return (
        <div
            className={[
                "rounded-xl border p-3",
                suspicious
                    ? "border-amber-300/18 bg-amber-400/[0.055] text-amber-100"
                    : "border-emerald-300/14 bg-emerald-400/[0.045] text-emerald-100",
            ].join(" ")}
        >
            <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {label}
                </p>

                {icon}
            </div>

            <p className="break-all text-sm font-bold text-white">
                {value}
            </p>
        </div>
    );
}

function MailAction({ children, tone = "default" }) {
    const danger = tone === "danger";

    return (
        <button
            type="button"
            className={[
                "rounded-xl border px-3 py-2 text-xs font-bold transition",
                danger
                    ? "border-red-300/15 bg-red-400/[0.055] text-red-200 hover:bg-red-400/[0.09]"
                    : "border-white/[0.07] bg-white/[0.03] text-slate-300 hover:border-blue-300/20 hover:text-blue-200",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function MailPill({ label, tone = "blue" }) {
    const tones = {
        blue: "border-blue-300/15 bg-blue-400/[0.055] text-blue-200",
        green: "border-emerald-300/15 bg-emerald-400/[0.055] text-emerald-200",
        amber: "border-amber-300/15 bg-amber-400/[0.055] text-amber-200",
        red: "border-red-300/15 bg-red-400/[0.055] text-red-200",
        slate: "border-white/[0.07] bg-white/[0.035] text-slate-300",
    };

    return (
        <span
            className={[
                "rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
                tones[tone] || tones.blue,
            ].join(" ")}
        >
            {label}
        </span>
    );
}

function UrlPreview({ email }) {
    let domain = "unknown";

    try {
        domain = new URL(email.linkUrl).hostname;
    } catch {
        domain = email.linkUrl;
    }

    return (
        <div className="mt-6 rounded-2xl border border-amber-300/15 bg-amber-400/[0.045] p-4">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-amber-200">
                <ExternalLink className="h-4 w-4" />
                URL Preview
            </div>

            <div className="grid gap-3 md:grid-cols-[140px_1fr] text-sm">
                <span className="text-slate-500">Displayed link</span>
                <span className="font-mono text-slate-300">{email.linkText || "No display text"}</span>

                <span className="text-slate-500">Destination</span>
                <span className="break-all font-mono text-amber-100">{email.linkUrl}</span>

                <span className="text-slate-500">Domain</span>
                <span className="font-mono text-white">{domain}</span>
            </div>
        </div>
    );
}

function AttachmentCard({ name }) {
    const extension = name?.split(".").pop()?.toUpperCase() || "FILE";

    return (
        <div className="mt-6 rounded-2xl border border-red-300/15 bg-red-400/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-red-300/20 bg-black/35 text-red-200">
                        <FileWarning className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="font-bold text-white">{name}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            {extension} attachment · requires inspection
                        </p>
                    </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-red-300/15 bg-red-400/[0.08] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-red-200">
                    <Paperclip className="h-3 w-3" />
                    inspect
                </span>
            </div>
        </div>
    );
}