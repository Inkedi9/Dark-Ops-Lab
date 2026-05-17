import Link from "next/link";
import type { ChallengeDefinition } from "@/engine/types";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import ProgressBar from "@dark/ui/components/ProgressBar";
import { ArrowRight, Lock, Target } from "lucide-react";

type MissionCardProps = {
    challenge: ChallengeDefinition;
    solved?: boolean;
    bestScore?: number;
    locked?: boolean;
};

function difficultyVariant(difficulty: string) {
    if (difficulty === "advanced") return "danger";
    if (difficulty === "intermediate") return "amber";
    return "blue";
}

function operationFlow(category: string) {
    if (category.toLowerCase().includes("authentication")) {
        return ["Recon", "Token", "Replay"];
    }

    if (category.toLowerCase().includes("client")) {
        return ["Inject", "Trigger", "Execute"];
    }

    if (category.toLowerCase().includes("injection")) {
        return ["Probe", "Payload", "Bypass"];
    }

    return ["Recon", "Exploit", "Capture"];
}

export function MissionCard({
    challenge,
    solved = false,
    bestScore,
    locked = false,
}: MissionCardProps) {
    const variant = difficultyVariant(challenge.difficulty);
    const flow = operationFlow(challenge.category);

    if (locked) {
        return (
            <PanelCard variant="darkNexus" accent="none" className="h-full p-6 opacity-45">
                <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
                        {challenge.id}
                    </span>
                    <AppBadge variant="default">Locked</AppBadge>
                </div>

                <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-slate-600">
                    <Lock size={22} />
                </div>

                <h2 className="mt-5 text-xl font-black text-white">{challenge.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Complete previous operations to unlock this target.
                </p>

                <div className="mt-6">
                    <ProgressBar value={0} className="h-2" />
                </div>
            </PanelCard>
        );
    }

    return (
        <Link href={`/challenges/${challenge.slug}`} className="group block h-full">
            <PanelCard
                variant="nexus"
                accent={variant}
                hover
                className="h-full p-6"
            >
                <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-blue-200">
                        {challenge.id}
                    </span>

                    <AppBadge variant={solved ? "emerald" : "default"}>
                        {solved ? "Solved" : "Unsolved"}
                    </AppBadge>
                </div>

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-300/18 bg-red-400/[0.06] text-red-200">
                    <Target size={22} />
                </div>

                <h2 className="text-2xl font-black tracking-tight text-white transition group-hover:text-red-100">
                    {challenge.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                    {challenge.objective}
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2">
                    {flow.map((step, index) => (
                        <div
                            key={step}
                            className={[
                                "rounded-xl border px-2 py-3 text-center font-mono text-[10px] uppercase tracking-[0.18em]",
                                index === 0 && !solved
                                    ? "border-red-300/25 bg-red-400/[0.08] text-red-200"
                                    : solved
                                        ? "border-emerald-300/18 bg-emerald-400/[0.06] text-emerald-200"
                                        : "border-white/[0.07] bg-white/[0.03] text-slate-500",
                            ].join(" ")}
                        >
                            {step}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    <AppBadge>{challenge.category}</AppBadge>
                    <AppBadge variant={variant}>{challenge.difficulty}</AppBadge>
                    <AppBadge>{challenge.estimatedMinutes} min</AppBadge>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <span className="font-bold text-slate-200">
                        {solved ? "Review operation" : "Start operation"}
                    </span>

                    <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-white" size={18} />
                </div>

                {bestScore !== undefined && (
                    <div className="mt-5 rounded-xl border border-emerald-300/14 bg-emerald-400/[0.055] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                            Best result
                        </p>
                        <p className="mt-1 text-xl font-black text-white">{bestScore} XP</p>
                    </div>
                )}
            </PanelCard>
        </Link>
    );
}