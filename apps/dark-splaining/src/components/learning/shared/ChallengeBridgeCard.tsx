import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";

type ChallengeBridgeCardProps = {
    title: string;
    description: string;
    difficulty?: string;
    to?: string;
};

export default function ChallengeBridgeCard({
    title,
    description,
    difficulty = "Beginner",
    to,
}: ChallengeBridgeCardProps) {
    if (!to) return null;

    return (
        <PanelCard variant="darkNexus" accent="violet" className="p-5">
            <div className="flex flex-wrap items-center gap-2">
                <AppBadge variant="violet">DarkChallenge</AppBadge>
                <AppBadge variant="slate">{difficulty}</AppBadge>
            </div>

            <h3 className="mt-4 text-lg font-extrabold tracking-tight text-white">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {description}
            </p>

            <AppButton to={to} variant="secondary" className="mt-5 w-full">
                Practice this →
            </AppButton>
        </PanelCard>
    );
}
