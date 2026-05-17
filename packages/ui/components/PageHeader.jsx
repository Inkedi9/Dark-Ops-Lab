import PanelCard from "./PanelCard";
import AppBadge from "./AppBadge";
import { spacing, typography } from "../styles/ui";

export default function PageHeader({
    eyebrow,
    title,
    highlight,
    description,
    action,
    accent = "blue",
    variant = "hero",
    mode = "default",
    badges = [],
}) {
    const isNexus = mode === "nexus";

    return (
        <PanelCard
            variant={isNexus ? "darkOpsHero" : variant}
            accent={accent}
            animated
            className={`${spacing.sectionBottom} p-7 md:p-10`}
        >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    {eyebrow && (
                        <AppBadge variant={accent === "emerald" ? "emerald" : "blue"}>
                            {eyebrow}
                        </AppBadge>
                    )}

                    <h1
                        className={`mt-4 max-w-4xl ${isNexus
                            ? "font-[var(--font-display)] text-4xl font-black leading-[0.98] tracking-tight text-white md:text-6xl"
                            : typography.heroTitle
                            }`}
                    >
                        {title}
                        {highlight && (
                            <span
                                className={[
                                    "block bg-clip-text text-transparent",
                                    accent === "danger"
                                        ? "bg-gradient-to-b from-red-200 via-red-300 to-slate-500"
                                        : "bg-gradient-to-b from-blue-200 to-slate-400",
                                ].join(" ")}
                            >
                                {highlight}
                            </span>
                        )}
                    </h1>

                    {description && (
                        <p className={`mt-5 max-w-2xl ${typography.bodyLarge}`}>
                            {description}
                        </p>
                    )}

                    {badges.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {badges.map((badge) => (
                                <AppBadge key={badge.label} variant={badge.variant ?? "blue"}>
                                    {badge.label}
                                </AppBadge>
                            ))}
                        </div>
                    )}
                </div>

                {action && <div className="shrink-0">{action}</div>}
            </div>
        </PanelCard>
    );
}