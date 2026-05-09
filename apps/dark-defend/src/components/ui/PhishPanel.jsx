import { cn } from "@/lib/utils";
import PanelCard from "@dark/ui/components/PanelCard";
import { compactSpacing } from "@/lib/defend/uiTokens";

export function PhishPanel({
    children,
    className = "",
    variant = "default",
    hover = false,
    animated = false,
    compact = false,
}) {
    const spacing = compactSpacing(compact);
    const variants = {
        default: { panel: "darkNexus", accent: "blue" },
        card: { panel: "nexus", accent: "blue" },
        glow: { panel: "darkNexusHero", accent: "blue" },
        threat: { panel: "danger", accent: "danger" },
        success: { panel: "featured", accent: "emerald" },
        warning: { panel: "featured", accent: "amber" },
        slate: { panel: "darkNexus", accent: "none" },
    };

    const selected = variants[variant] || variants.default;

    return (
        <PanelCard
            variant={selected.panel}
            accent={selected.accent}
            hover={hover}
            animated={animated}
            className={cn(
                "transition-all duration-300",
                compact && spacing.panel,
                className
            )}
        >
            {children}
        </PanelCard>
    );
}
