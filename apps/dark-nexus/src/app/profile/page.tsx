"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Route,
    BadgeCheck,
    Cpu,
    Radar,
    RotateCcw,
    Shield,
    Trophy,
    User,
    Zap,
} from "lucide-react";
import { profileService } from "@dark/profile/profileService";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import ProgressBar from "@dark/ui/components/ProgressBar";
import StatCard from "@dark/ui/components/StatCard";
import NexusAIButton from "@/components/assistant/NexusAIButton";

type Profile = {
    id: string;
    username: string;
    xp: number;
    level: number;
    rank: string;
    badges: string[];
    completedLessons: string[];
    completedMissions: string[];
    completedDefend: string[];
    createdAt: string;
    updatedAt: string;
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        async function loadProfile() {
            const p = await profileService.getProfile();
            setProfile(p);
        }

        loadProfile();
    }, []);

    async function handleReset() {
        await profileService.resetProfile();
        setProfile(null);
    }

    if (!profile) {
        return (
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070A] px-5 text-slate-100">
                <NexusBackground />
                <div className="relative z-10 max-w-md">
                    <PanelCard variant="darkNexus" accent="blue" hover className="text-center">
                        <h1 className="text-2xl font-black">No operator profile found</h1>
                        <p className="mt-3 text-slate-400">Create your profile from the hub first.</p>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]"
                        >
                            <ArrowLeft size={18} />
                            Back to hub
                        </Link>
                    </PanelCard>
                </div>
            </main>
        );
    }

    const totalCompleted =
        profile.completedLessons.length +
        profile.completedMissions.length +
        profile.completedDefend.length;

    const completedRoutes = Math.min(
        profile.completedLessons.length,
        profile.completedMissions.length,
        profile.completedDefend.length
    );

    const nextLevelXp = profile.level * 100;
    const levelStartXp = Math.max(0, (profile.level - 1) * 100);
    const levelProgress = Math.min(
        100,
        ((profile.xp - levelStartXp) / (nextLevelXp - levelStartXp)) * 100
    );

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070A] px-5 py-8 text-slate-100">
            <NexusBackground />

            <section className="relative z-10 mx-auto max-w-6xl">
                <PanelCard variant="darkNexus" accent="blue" className="mb-8">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]"
                        >
                            <ArrowLeft size={17} />
                            Back to DarkNexus
                        </Link>

                        <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] text-slate-400 md:flex">
                            <span className="text-green-300">Profile Secure ●</span>
                            <span>localStorage V1</span>
                        </div>
                    </div>
                </PanelCard>

                <PanelCard variant="darkNexusHero" accent="blue" className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-5">
                            <div className="grid h-20 w-20 place-items-center rounded-2xl border border-blue-300/40 bg-blue-500/10 text-blue-300/35 shadow-[0_0_24px_rgba(0,229,255,.22)]">
                                <User size={36} />
                            </div>

                            <div>
                                <p className="font-mono text-xs uppercase tracking-[0.4em] text-blue-300">
                                    Operator profile
                                </p>
                                <h1 className="mt-2 bg-gradient-to-r from-white via-blue-300 to-green-300 bg-clip-text text-5xl font-black text-transparent">
                                    {profile.username}
                                </h1>
                                <p className="mt-1 text-slate-400">
                                    Rank: <span className="font-bold text-green-300">{profile.rank}</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleReset}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300/25 bg-red-400/10 px-4 py-3 font-bold text-red-100 hover:bg-red-400/20"
                        >
                            <RotateCcw size={18} />
                            Reset profile
                        </button>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-4">
                        <StatCard icon={Zap} label="XP" value={profile.xp} />
                        <StatCard icon={Trophy} label="Level" value={profile.level} />
                        <StatCard icon={BadgeCheck} label="Badges" value={profile.badges.length} />
                        <StatCard icon={Route} label="Routes" value={completedRoutes} />
                    </div>

                    <div className="mt-8">

                        <div className="mb-2 flex items-center justify-between font-mono text-xs text-slate-400">
                            <span>Next level progress</span>
                            <span>
                                {profile.xp} / {nextLevelXp} XP
                            </span>
                        </div>

                        <ProgressBar value={levelProgress} />
                    </div>
                </PanelCard>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <PanelCard variant="darkNexus" accent="emerald" hover>
                        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-emerald-300">
                            <Trophy className="h-4 w-4" />
                            <span>Badges</span>
                        </div>

                        {profile.badges.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {profile.badges.map((badge) => (
                                    <span
                                        key={badge}
                                        className="rounded-full border border-green-300/25 bg-green-400/10 px-3 py-1 font-mono text-xs font-bold text-green-100"
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">No badges unlocked yet.</p>
                        )}
                    </PanelCard>

                    <PanelCard variant="darkNexus" accent="blue" hover>
                        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-blue-300">
                            <Radar className="h-4 w-4" />
                            <span>Progress</span>
                        </div>

                        <ProgressLine label="Lessons" value={profile.completedLessons.length} />
                        <ProgressLine label="Missions" value={profile.completedMissions.length} />
                        <ProgressLine label="Defense sims" value={profile.completedDefend.length} />
                    </PanelCard>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <PanelCard variant="darkNexus" accent="blue" hover>
                        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-blue-300">
                            <Cpu className="h-4 w-4" />
                            <span>Operator record</span>
                        </div>

                        <div className="grid gap-3 font-mono text-sm text-slate-400 md:grid-cols-2">
                            <p>Profile ID: {profile.id}</p>
                            <p>Mode: Local Operator</p>
                            <p>Created: {new Date(profile.createdAt).toLocaleDateString()}</p>
                            <p>Updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </PanelCard>

                    <PanelCard variant="elevated" accent="emerald" hover>
                        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-emerald-300">
                            <Shield className="h-4 w-4" />
                            <span>System status</span>
                        </div>

                        <div className="space-y-3 font-mono text-sm">
                            <p className="text-green-300">&gt; PROFILE LOADED.......... [ OK ]</p>
                            <p className="text-blue-300">&gt; XP TRACKER ONLINE....... [ OK ]</p>
                            <p className="text-green-300">&gt; SUPABASE READY.......... [ NEXT ]</p>
                        </div>
                    </PanelCard>
                </div>
            </section>
            <NexusAIButton />
        </main>
    );
}

function ProgressLine({ label, value }: { label: string; value: number }) {
    return (
        <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-slate-300">{label}</span>
                <span className="font-mono text-blue-300">{value}</span>
            </div>
            <ProgressBar value={Math.min(value * 20, 100)} className="h-2" />
        </div>
    );
}