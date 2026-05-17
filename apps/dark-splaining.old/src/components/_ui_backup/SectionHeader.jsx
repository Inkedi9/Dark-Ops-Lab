import AppBadge from "./AppBadge";

const accentText = {
    blue: "text-blue-300/85",
    violet: "text-violet-300/85",
    emerald: "text-emerald-300/85",
    amber: "text-amber-300/85",
    slate: "text-slate-400",
    danger: "text-red-300/85",
};

export default function SectionHeader({
    eyebrow,
    title,
    description,
    action,
    accent = "blue",
    mode = "default",
    className = "",
}) {
    const isNexus = mode === "nexus";

    return (
        <div
            className={`mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${className}`}
        >
            <div>
                {eyebrow &&
                    (isNexus ? (
                        <AppBadge variant="nexus">{eyebrow}</AppBadge>
                    ) : (
                        <p
                            className={`font-mono text-xs uppercase tracking-[0.32em] ${accentText[accent] || accentText.blue
                                }`}
                        >
                            {eyebrow}
                        </p>
                    ))}

                <h2
                    className={
                        isNexus
                            ? "mt-4 text-3xl font-semibold uppercase tracking-[0.16em] text-white"
                            : "mt-3 text-3xl font-extrabold tracking-tight text-white"
                    }
                >
                    {title}
                </h2>

                {description && (
                    <p
                        className={
                            isNexus
                                ? "mt-3 max-w-2xl text-sm leading-7 text-slate-400"
                                : "mt-3 max-w-2xl text-sm leading-7 text-slate-400"
                        }
                    >
                        {description}
                    </p>
                )}
            </div>

            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
