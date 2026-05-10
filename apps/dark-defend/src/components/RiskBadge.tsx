import { getDefendTone } from "@/lib/defend/uiTokens";

type RiskBadgeProps = {
    level?: string;
};

export default function RiskBadge({ level }: RiskBadgeProps) {
    const toneName =
        level === "Low" ? "emerald" : level === "Medium" ? "amber" : level ? "red" : "blue";
    const tone = getDefendTone(toneName);

    return (
        <span
            className={[
                "rounded-full border px-3 py-1 font-mono text-xs font-semibold",
                tone.border,
                tone.bg,
                tone.text,
            ].join(" ")}
        >
            {level} Risk
        </span>
    );
}
