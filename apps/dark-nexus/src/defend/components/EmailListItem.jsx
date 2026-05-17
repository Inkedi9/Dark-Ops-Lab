import { CheckCircle2, FileWarning, Paperclip, ShieldAlert } from "lucide-react";
import MailBrandIcon from "@/defend/components/mail/MailBrandIcon";

function getAvatar(email) {
    return (
        email.avatar ||
        email.senderCompany?.slice(0, 2).toUpperCase() ||
        email.sender?.slice(0, 2).toUpperCase() ||
        "EM"
    );
}

function getPriorityTone(priority) {
    if (priority === "high") return "bg-red-400/10 text-red-200 border-red-300/20";
    if (priority === "medium") return "bg-amber-400/10 text-amber-200 border-amber-300/20";
    return "bg-blue-400/10 text-blue-200 border-blue-300/20";
}

export default function EmailListItem({
    email,
    selected,
    completed,
    onSelect,
}) {
    const external = email.badge !== "Internal";
    const priority = email.priority || (email.riskLevel === "High" || email.riskLevel === "Critical" ? "high" : "low");

    return (
        <button
            type="button"
            onClick={() => onSelect(email)}
            className={[
                "group w-full rounded-2xl border p-4 text-left transition",
                selected
                    ? "border-blue-300/35 bg-blue-400/[0.08]"
                    : "border-white/[0.07] bg-white/[0.025] hover:border-blue-300/20 hover:bg-white/[0.04]",
                completed && !selected ? "opacity-55" : "",
            ].join(" ")}
        >
            <div className="flex gap-3">
                <MailBrandIcon
                    brand={email.brand}
                    label={getAvatar(email)}
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-black text-white">
                            {email.senderCompany || email.sender}
                        </p>

                        <span className="shrink-0 font-mono text-[10px] text-slate-500">
                            {email.timestamp || "09:42"}
                        </span>
                    </div>

                    <p className="mt-1 truncate text-sm font-bold text-slate-300">
                        {email.subject}
                    </p>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {email.preview || email.body?.slice(0, 110) || "No preview available."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {external && (
                            <span className="rounded-full border border-amber-300/15 bg-amber-400/[0.06] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-amber-200">
                                External
                            </span>
                        )}

                        <span className={`rounded-full border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] ${getPriorityTone(priority)}`}>
                            {priority}
                        </span>

                        {email.attachment && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-red-300/15 bg-red-400/[0.06] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-red-200">
                                <Paperclip className="h-3 w-3" />
                                File
                            </span>
                        )}

                        {email.linkUrl && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-300/15 bg-blue-400/[0.06] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                                <ShieldAlert className="h-3 w-3" />
                                Link
                            </span>
                        )}

                        {completed && (
                            <span className="ml-auto inline-flex items-center gap-1 text-emerald-300">
                                <CheckCircle2 className="h-4 w-4" />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}