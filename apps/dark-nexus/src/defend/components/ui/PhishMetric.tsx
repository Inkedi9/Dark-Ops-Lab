import { getDefendTone } from "@/defend/lib/defend/uiTokens";

type PhishMetricProps = {
    label: string;
    value: string | number;
    tone?: string;
};

export function PhishMetric({ label, value, tone = "teal" }: PhishMetricProps) {
    const selectedTone = getDefendTone(tone);

    return (
        <div className={`rounded-xl border p-4 ${selectedTone.border} ${selectedTone.bg} ${selectedTone.text} ${selectedTone.glow}`}>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] opacity-80">{label}</p>
            <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
    );
}
