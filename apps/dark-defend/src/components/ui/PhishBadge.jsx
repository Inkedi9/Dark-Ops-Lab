import AppBadge from "@dark/ui/components/AppBadge";

export function PhishBadge({ children, tone = "teal" }) {
    const variants = {
        blue: "blue",
        teal: "blue",
        slate: "slate",
        red: "danger",
        danger: "danger",
        orange: "amber",
        green: "emerald",
        amber: "amber",
    };

    return (
        <AppBadge variant={variants[tone] || variants.teal} className="rounded-lg tracking-[0.16em]">
            {children}
        </AppBadge>
    );
}
