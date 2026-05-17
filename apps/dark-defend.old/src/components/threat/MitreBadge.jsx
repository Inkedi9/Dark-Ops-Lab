import { getDefendTone } from "@/lib/defend/uiTokens";

const techniqueLabels = {
    "T1566.002": "Phishing Link",
    T1528: "OAuth Abuse",
    T1621: "MFA Fatigue",
};

export default function MitreBadge({ technique }) {
    const tone = getDefendTone("red");

    return (
        <span className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${tone.border} ${tone.bg} ${tone.text}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-red-300 shadow-[0_0_10px_rgba(252,165,165,.9)]" />
            {technique}
            <span className="text-red-300/60">
                {techniqueLabels[technique] || "ATT&CK"}
            </span>
        </span>
    );
}
