"use client";


import { useEffect, useState } from "react";
import { getAllProgress } from "@/store/progress-store";
import { MissionCard } from "@/components/dc-ui/MissionCard";
import {
    getAllChallenges,
    isChallengeUnlocked,
} from "@/challenges/registry";
import { AppShell } from "@/components/layout/AppShell";
import { challengePacks, getPackProgress, isPackUnlocked } from "@/challenges/packs";
import { PackCard } from "@/components/challenge/PackCard";
import PageHeader from "@dark/ui/components/PageHeader";
import StatCard from "@dark/ui/components/StatCard";
import Link from "next/link";
import AppBadge from "@dark/ui/components/AppBadge";
import PanelCard from "@dark/ui/components/PanelCard";

export default function ChallengesPage() {
    const challenges = getAllChallenges();
    const [progress, setProgress] = useState<ReturnType<typeof getAllProgress>>([]);

    const solvedCount = progress.filter((p) => p.solved).length;

    useEffect(() => {
        setProgress(getAllProgress());
    }, []);

    function getProgress(challengeId: string) {
        return progress.find((item) => item.challengeId === challengeId);
    }

    const solvedSlugs = progress
        .filter((p) => p.solved)
        .map((p) => {
            const challenge = challenges.find((c) => c.id === p.challengeId);
            return challenge?.slug;
        })
        .filter(Boolean) as string[];

    const packsProgress = challengePacks.map((pack) => {
        const packProgress = getPackProgress(pack, solvedSlugs);
        return packProgress.completion;
    });

    const nextMission =
        challenges.find(
            (challenge) =>
                !progress.find((item) => item.challengeId === challenge.id)?.solved &&
                isChallengeUnlocked(challenges.indexOf(challenge), solvedCount)
        ) ?? challenges[0];

    return (
        <AppShell>
            <PageHeader
                eyebrow="DarkChallenges"
                title="Mission Board"
                description="Choose an unguided offensive lab, solve the target and improve your operator score."
                mode="nexus"
                badges={[
                    { label: "Unguided labs", variant: "blue" },
                    { label: "Local progression", variant: "emerald" },
                ]}
            />

            <section className="mb-8 grid gap-4 md:grid-cols-3">
                <StatCard label="Available" value={challenges.length} />
                <StatCard label="Solved" value={solvedCount} tone="emerald" />
                <StatCard
                    label="Total XP"
                    value={progress.reduce((sum, item) => sum + item.bestScore, 0)}
                />
            </section>

            <section className="mb-10">
                <PanelCard variant="darkNexusHero" accent="danger" hover>
                    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-200">
                                Recommended operation
                            </p>

                            <h2 className="mt-3 text-4xl font-black text-white">
                                {nextMission?.title ?? "All missions cleared"}
                            </h2>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                                Start with the next available target. Recon the surface,
                                identify the weakness, exploit safely and capture proof.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <AppBadge variant="danger">Recon</AppBadge>
                                <AppBadge variant="amber">Exploit</AppBadge>
                                <AppBadge variant="emerald">Capture</AppBadge>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-red-300/15 bg-black/30 p-5">
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
                                Operation route
                            </p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-4">
                                {["Recon", "Payload", "Bypass", "Extract"].map((step, index) => (
                                    <div
                                        key={step}
                                        className={[
                                            "rounded-xl border px-3 py-4 text-center font-mono text-[10px] uppercase tracking-[0.22em]",
                                            index === 0
                                                ? "border-red-300/25 bg-red-400/[0.08] text-red-200"
                                                : "border-white/[0.07] bg-white/[0.035] text-slate-500",
                                        ].join(" ")}
                                    >
                                        {step}
                                    </div>
                                ))}
                            </div>

                            {nextMission && (
                                <Link
                                    href={`/challenges/${nextMission.slug}`}
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-red-300/25 bg-red-400/10 px-5 py-3 font-bold text-red-100 transition hover:bg-red-400/20"
                                >
                                    Launch operation →
                                </Link>
                            )}
                        </div>
                    </div>
                </PanelCard>
            </section>

            <section className="mb-10 grid gap-6 md:grid-cols-2">
                {challengePacks.map((pack, index) => {
                    const packProgress = getPackProgress(pack, solvedSlugs);
                    const unlocked = isPackUnlocked(index, packsProgress);

                    return (
                        <PackCard
                            key={pack.id}
                            title={pack.title}
                            description={pack.description}
                            completion={packProgress.completion}
                            firstChallengeSlug={pack.challenges[0]}
                            locked={!unlocked}
                        />
                    );
                })}
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {challenges.map((challenge, index) => {
                    const saved = getProgress(challenge.id);
                    const unlocked = isChallengeUnlocked(index, solvedCount);

                    return (
                        <MissionCard
                            key={challenge.id}
                            challenge={challenge}
                            solved={Boolean(saved?.solved)}
                            bestScore={saved?.bestScore}
                            locked={!unlocked}
                        />
                    );
                })}
            </section>

        </AppShell>
    );
}