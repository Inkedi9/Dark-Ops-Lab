import {
    CheckCircle2,
    FileText,
    FolderOpen,
    ShieldAlert,
    XCircle,
} from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppButton from "@dark/ui/components/AppButton";
import { toneClass } from "@/defend/lib/defend/uiTokens";

function responseAccent(alert) {
    if (alert?.severity === "Critical" || alert?.severity === "High") return "danger";
    if (alert?.severity === "Medium") return "amber";
    return "blue";
}

function verdictButtonClass(active, tone) {
    const activeStyles = {
        benign: "border-emerald-300/30 bg-emerald-400/[0.10] text-emerald-100",
        suspicious: "border-amber-300/30 bg-amber-400/[0.10] text-amber-100",
        malicious: "border-red-300/30 bg-red-400/[0.10] text-red-100",
    };

    return [
        "w-full justify-start border px-4 py-3",
        active
            ? activeStyles[tone]
            : `${toneClass("slate")} hover:bg-slate-400/[0.055] hover:text-white`,
    ].join(" ");
}

export default function SocResponseActions({
    alert,
    onVerdict,
    selectedVerdict,
}) {
    return (
        <PanelCard variant="darkOps" accent={responseAccent(alert)}>
            <div className="mb-4 flex items-center gap-2 text-blue-200">
                <ShieldAlert size={18} />
                <p className="font-mono text-xs uppercase tracking-[0.3em]">
                    Response Actions
                </p>
            </div>

            <div className="rounded-xl border border-blue-300/12 bg-blue-400/[0.045] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-300">
                    Recommended response
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                    {alert?.recommendedAction || "Review the alert context and document the response."}
                </p>
            </div>

            <div className="mt-4 space-y-3">
                <AppButton
                    variant="secondary"
                    className={verdictButtonClass(selectedVerdict === "Benign", "benign")}
                    onClick={() => onVerdict?.("Benign")}
                >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark benign
                </AppButton>

                <AppButton
                    variant="secondary"
                    className={verdictButtonClass(selectedVerdict === "Suspicious", "suspicious")}
                    onClick={() => onVerdict?.("Suspicious")}
                >
                    <ShieldAlert className="h-4 w-4" />
                    Suspicious
                </AppButton>

                <AppButton
                    variant="secondary"
                    className={verdictButtonClass(selectedVerdict === "Malicious", "malicious")}
                    onClick={() => onVerdict?.("Malicious")}
                >
                    <XCircle className="h-4 w-4" />
                    Malicious
                </AppButton>
            </div>

            <div className="mt-5 grid gap-2">
                <AppButton variant="nexus" className="justify-start">
                    <FolderOpen className="h-4 w-4" />
                    Open playbook
                </AppButton>

                <AppButton variant="secondary" className="justify-start">
                    <FileText className="h-4 w-4" />
                    Generate report
                </AppButton>

                <AppButton variant="ghost" className="justify-start">
                    <XCircle className="h-4 w-4" />
                    Close case
                </AppButton>
            </div>
        </PanelCard>
    );
}
