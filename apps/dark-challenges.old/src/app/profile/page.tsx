"use client";

import { useState } from "react";
import PanelCard from "@dark/ui/components/PanelCard";
import { BadgeCard } from "@/components/profile/BadgeCard";
import type { UserProfile } from "@/services/profile-service";
import { getLocalUserProfile } from "@/services/profile-service";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressBar } from "@/components/dc-ui/ProgressBar";
import PageHeader from "@dark/ui/components/PageHeader";
import AppButton from "@dark/ui/components/AppButton";
import StatCard from "@dark/ui/components/StatCard";
import AppBadge from "@dark/ui/components/AppBadge";

export default function ProfilePage() {
    const [profile] = useState<UserProfile | null>(() => getLocalUserProfile());

    if (!profile) {
        return (
            <AppShell>
                <p className="font-mono text-sm text-slate-500">
                    Loading profile...
                </p>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(77,231,255,0.08),transparent_35%)]" />

            <div className="relative z-10 mx-auto max-w-7xl">

                <PageHeader
                    eyebrow="Operator profile"
                    title="Local identity"
                    description="Your local progression, stats and unlocked achievements."
                    mode="nexus"
                    badges={[
                        { label: "Local profile", variant: "blue" },
                        { label: "XP tracking", variant: "emerald" },
                    ]}
                    action={
                        <AppButton href="/challenges" variant="default">
                            Mission Board
                        </AppButton>
                    }
                />

                <section className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <PanelCard variant="darkNexusHero" accent="violet" className="p-6">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-300">
                            Operator identity
                        </p>

                        <h2 className="mt-3 text-4xl font-black text-white">
                            {profile.username ?? "Local Operator"}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Local offensive profile tracking mission score, operator rank and unlocked badges.
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <StatCard label="XP" value={profile.totalXp} />
                            <StatCard label="Level" value={profile.level} />
                            <StatCard label="Rank" value={profile.rank.toUpperCase()} tone="emerald" />
                        </div>
                    </PanelCard>

                    <PanelCard variant="darkNexus" accent="blue">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-300">
                            Progression
                        </p>

                        <div className="mt-6">
                            <ProgressBar
                                label="Completion"
                                value={Math.min(100, (profile.solvedCount / profile.totalChallenges) * 100)}
                            />
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <StatCard
                                label="Solved"
                                value={`${profile.solvedCount}/${profile.totalChallenges}`}
                            />
                            <StatCard label="Attempts" value={profile.totalAttempts} />
                            <StatCard label="Hints used" value={profile.totalHints} />
                        </div>
                    </PanelCard>
                </section>

                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-2xl font-black">Badges</h2>
                        <AppBadge variant="blue">
                            {profile.badges.filter((badge) => badge.unlocked).length}/
                            {profile.badges.length}
                        </AppBadge>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {profile.badges.map((badge) => (
                            <BadgeCard
                                key={badge.id}
                                title={badge.title}
                                description={badge.description}
                                unlocked={badge.unlocked}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
