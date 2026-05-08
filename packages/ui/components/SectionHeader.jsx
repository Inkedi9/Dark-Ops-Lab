import AppBadge from "./AppBadge";
import { typography } from "../styles/ui";

const badgeVariant = {
    blue: "blue",
    violet: "violet",
    emerald: "emerald",
    amber: "amber",
    danger: "danger",
    slate: "default",
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
                {eyebrow && (
                    <AppBadge variant={badgeVariant[accent] || "blue"}>
                        {eyebrow}
                    </AppBadge>
                )}

                <h2
                    className={
                        isNexus
                            ? "mt-4 font-[var(--font-display)] text-3xl font-black tracking-tight text-white md:text-4xl"
                            : `mt-3 ${typography.title}`
                    }
                >
                    {title}
                </h2>

                {description && (
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                        {description}
                    </p>
                )}
            </div>

            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}