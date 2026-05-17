import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";

type DefendBridgeCardProps = {
    title: string;
    description: string;
    to?: string;
};

export default function DefendBridgeCard({
    title,
    description,
    to,
}: DefendBridgeCardProps) {
    if (!to) return null;

    return (
        <PanelCard variant="darkOps" accent="emerald" className="p-5">
            <AppBadge variant="emerald">DarkDefend</AppBadge>

            <h3 className="mt-4 text-lg font-extrabold tracking-tight text-white">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {description}
            </p>

            <AppButton to={to} variant="emerald" className="mt-5 w-full">
                See defense view →
            </AppButton>
        </PanelCard>
    );
}
