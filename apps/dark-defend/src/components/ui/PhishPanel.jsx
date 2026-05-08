import { cn } from "@/lib/utils";
import PanelCard from "@dark/ui/components/PanelCard";

export function PhishPanel({ children, className = "", variant = "default" }) {
    const variants = {
        default: { panel: "darkNexus", accent: "blue" },
        card: { panel: "nexus", accent: "blue" },
        glow: { panel: "darkNexusHero", accent: "blue" },
        threat: { panel: "danger", accent: "danger" },
        success: { panel: "featured", accent: "emerald" },
        warning: { panel: "featured", accent: "amber" },
    };
    const selected = variants[variant] || variants.default;

    return (
        <PanelCard
            variant={selected.panel}
            accent={selected.accent}
            className={cn("transition-all duration-300", className)}
        >
            {children}
        </PanelCard>
    );
}
