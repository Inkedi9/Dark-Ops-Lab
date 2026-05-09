import AppBadge from "@dark/ui/components/AppBadge";

export function PhishBadge({ children, tone = "teal" }) {
    const variants = {
        blue: "blue",
        teal: "blue",
        slate: "default",
        red: "danger",
        danger: "danger",
        orange: "amber",
        emerald: "emerald",
        green: "emerald",
        amber: "amber",
        violet: "blue",
    };

    return (
        <AppBadge variant={variants[tone] || variants.teal} className="rounded-lg tracking-[0.16em]">
            {children}
        </AppBadge>
    );
}
