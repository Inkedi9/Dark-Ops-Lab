import { cn } from "@/lib/utils";

export function PhishCard({
    children,
    active = false,
    tone = "default",
    className = "",
    ...props
}) {
    const tones = {
        default:
            "border-white/[0.055] bg-[#03070c]/72 hover:border-blue-300/20 hover:bg-white/[0.035]",
        teal:
            "border-blue-300/30 bg-blue-400/[0.075] shadow-[0_0_18px_rgba(96,165,250,0.08)]",
        threat:
            "border-red-400/30 bg-red-400/[0.08] shadow-[0_0_18px_rgba(248,113,113,0.08)]",
        success:
            "border-emerald-300/25 bg-emerald-400/[0.07] shadow-[0_0_18px_rgba(52,211,153,0.07)]",
        warning:
            "border-amber-300/25 bg-amber-400/[0.075] shadow-[0_0_18px_rgba(251,191,36,0.07)]",
    };

    return (
        <div
            className={cn(
                "rounded-2xl border p-4 transition-all duration-200",
                "hover:-translate-y-0.5",
                tones[tone] || tones.default,
                active && "border-blue-300/55 shadow-[0_0_24px_rgba(96,165,250,0.16)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
