import PanelCard from "./PanelCard";
import AppBadge from "./AppBadge";
import AppButton from "./AppButton";
import { radius, typography } from "../../styles/ui";

export default function EmptyState({
    eyebrow = "Empty state",
    title,
    description,
    actionLabel,
    actionTo,
    accent = "blue",
}) {
    return (
        <PanelCard
            variant="elevated"
            accent={accent}
            animated
            className="mt-4 p-8 text-center"
        >
            <div className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center ${radius.card} bg-white/[0.035] font-mono text-sm text-slate-400 ring-1 ring-white/[0.08]`}>
                ∅
            </div>

            <AppBadge variant={accent}>{eyebrow}</AppBadge>

            <h3 className={`mt-4 ${typography.cardTitle}`}>
                {title}
            </h3>

            {description && (
                <p className={`mx-auto mt-3 max-w-md ${typography.body}`}>
                    {description}
                </p>
            )}

            {actionLabel && actionTo && (
                <AppButton to={actionTo} variant="secondary" className="mt-6">
                    {actionLabel}
                </AppButton>
            )}
        </PanelCard>
    );
}
