import { cn } from "@/lib/utils";
import AppButton from "@dark/ui/components/AppButton";

export function PhishButton({
    children,
    tone = "teal",
    size = "md",
    className = "",
    ...props
}) {
    const tones = {
        blue: "primary",
        teal: "primary",
        solid: "primary",
        slate: "secondary",
        red: "danger",
        danger: "danger",
        green: "emerald",
        amber: "secondary",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-3 text-sm",
    };

    return (
        <AppButton
            variant={tones[tone] || tones.teal}
            className={cn(
                "gap-2",
                sizes[size] || sizes.md,

                tone === "solid" &&
                "border-blue-300/25 bg-blue-400/[0.12] text-blue-100 shadow-[0_0_18px_rgba(96,165,250,.08)] hover:border-blue-300/40 hover:bg-blue-400/[0.18]",

                tone === "blue" &&
                "border-blue-300/20 bg-blue-400/[0.10] text-blue-100 hover:border-blue-300/35 hover:bg-blue-400/[0.16]",

                tone === "amber" &&
                "border-amber-400/25 bg-amber-500/10 text-amber-100 hover:bg-amber-500/15",

                className
            )}
            {...props}
        >
            {children}
        </AppButton>
    );
}