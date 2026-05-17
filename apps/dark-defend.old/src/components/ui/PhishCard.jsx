import { cn } from "@/lib/utils";
import { getDefendTone } from "@/lib/defend/uiTokens";

export function PhishCard({
    children,
    active = false,
    disabled = false,
    tone = "default",
    hover = true,
    className = "",
    ...props
}) {
    const selectedTone = getDefendTone(tone);

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border p-4 transition-all duration-200",
                selectedTone.border,
                selectedTone.bg,
                selectedTone.text,
                selectedTone.glow,
                hover && !disabled && "hover:-translate-y-0.5 hover:border-blue-300/22 hover:bg-white/[0.035]",
                active && "border-blue-300/35 bg-blue-400/[0.085] shadow-[0_0_28px_rgba(96,165,250,0.09)]",
                disabled && "opacity-50",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
