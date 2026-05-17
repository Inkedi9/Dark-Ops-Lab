"use client";

import { useChallengeProgressSnapshot } from "@/hooks/useLocalProgressSnapshots";
import { MissionCard } from "@/components/dc-ui/MissionCard";
import { getAllChallenges, isChallengeUnlocked } from "@/challenges/registry";
import { AppShell } from "@/components/layout/AppShell";
import { challengePacks, getPackProgress, isPackUnlocked } from "@/challenges/packs";
import { PackCard } from "@/challenges/components/PackCard";
import PageHeader from "@dark/ui/components/PageHeader";
import StatCard from "@dark/ui/components/StatCard";

export default function MissionsPage() {
    const challenges = getAllChallenges();
    const progress = useChallengeProgressSnapshot();

    const solvedCount = progress.filter((p) => p.solved).length;

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
