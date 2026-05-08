import Link from "next/link";
import { StatusBadge } from "@/components/dc-ui/StatusBadge";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import ProgressBar from "@dark/ui/components/ProgressBar";

type PackCardProps = {
    title: string;
    description: string;
    completion: number;
    firstChallengeSlug: string;
    locked?: boolean;
};

export function PackCard({ title, description, completion, firstChallengeSlug, locked = false }: PackCardProps) {
    if (locked) {
        return (
            <PanelCard variant="darkNexus" className="p-6 opacity-45">
                <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                        Pack
                    </p>
                    <AppBadge>Locked</AppBadge>
                </div>

                <h2 className="text-2xl font-black text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Complete the previous pack to unlock this operation.
                </p>

                <div className="mt-6">
                    <ProgressBar value={completion} className="h-2" />
                </div>
            </PanelCard>
        );
    }

    return (
        <Link href={`/challenges/${firstChallengeSlug}`} className="group block">
            <PanelCard variant="darkNexus" accent="blue" hover className="h-full p-6">
                <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-200">
                        Pack
                    </p>

                    <AppBadge variant={completion === 100 ? "emerald" : "blue"}>
                        {completion === 100 ? "Complete" : "Unlocked"}
                    </AppBadge>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-white transition group-hover:text-blue-100">
                    {title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    {description}
                </p>

                <div className="mt-6">
                    <ProgressBar value={completion} className="h-2" />
                </div>
            </PanelCard>
        </Link>
    );
}