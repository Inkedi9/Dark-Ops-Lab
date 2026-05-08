import PanelCard from "./PanelCard";
import AppBadge from "./AppBadge";
import { spacing, typography } from "../../styles/ui";

const accentText = {
    blue: "text-blue-300/85",
    violet: "text-violet-300/85",
    emerald: "text-emerald-300/85",
    amber: "text-amber-300/85",
    danger: "text-red-300/85",
    nexus: "text-blue-300",
    nexusGreen: "text-emerald-300",
};

export default function PageHeader({
    eyebrow,
    title,
    description,
    action,
    accent = "blue",
    variant = "hero",
    mode = "default",
}) {
    const isNexus = mode === "nexus";

    return (
        <PanelCard
            variant={isNexus ? "nexusHero" : variant}
            accent={isNexus ? "blue" : accent}
            animated
            className={`${spacing.sectionBottom} p-7 md:p-10`}
        >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    {eyebrow &&
                        (isNexus ? (
                            <AppBadge variant="nexus">{eyebrow}</AppBadge>
                        ) : (
                            <p
                                className={`${typography.meta} ${accentText[accent] || accentText.blue
                                    }`}
                            >
                                {eyebrow}
                            </p>
                        ))}

                    <h1
                        className={`mt-4 max-w-4xl ${isNexus
                            ? "text-4xl font-semibold uppercase tracking-[0.18em] text-white md:text-6xl"
                            : typography.heroTitle
                            }`}
                    >
                        {title}
                    </h1>

                    {description && (
                        <p
                            className={`mt-5 max-w-2xl ${isNexus
                                ? "text-base leading-8 text-slate-300 md:text-lg"
                                : typography.bodyLarge
                                }`}
                        >
                            {description}
                        </p>
                    )}

                    {isNexus && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            <AppBadge variant="nexus">Learn</AppBadge>
                            <AppBadge variant="nexusGreen">Practice</AppBadge>
                            <AppBadge variant="nexus">Defend</AppBadge>
                        </div>
                    )}
                </div>

                {action && <div className="shrink-0">{action}</div>}
            </div>
        </PanelCard>
    );
}
