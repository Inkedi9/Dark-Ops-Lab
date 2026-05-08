export default function RiskBadge({ level }) {
    const styles = {
        Low: "border-emerald-300/15 bg-emerald-400/[0.06] text-emerald-200",

        Medium: "border-amber-300/15 bg-amber-400/[0.06] text-amber-200",

        High: "border-red-300/15 bg-red-400/[0.06] text-red-200",

        Critical: "border-red-400/20 bg-red-500/[0.10] text-red-100",
    };

    return (
        <span
            className={[
                "rounded-full border px-3 py-1 font-mono text-xs font-semibold",
                styles[level] ||
                "border-blue-300/15 bg-blue-400/[0.06] text-blue-200",
            ].join(" ")}
        >
            {level} Risk
        </span>
    );
}
