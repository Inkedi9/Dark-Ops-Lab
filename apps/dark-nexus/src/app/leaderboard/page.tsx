"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, Medal, Shield, Trophy, User, Zap, Route } from "lucide-react";
import { profileService } from "@dark/profile/profileService"
import type { DarkProfile } from "@dark/profile/types";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import NexusAIButton from "@/components/assistant/NexusAIButton";

const mockOperators = [
    { username: "NullByte", xp: 2450, level: 25, rank: "OPERATOR", badges: 12, routes: 8 },
    { username: "GhostRoot", xp: 1980, level: 20, rank: "HUNTER", badges: 9, routes: 8 },
    { username: "Cipher", xp: 1640, level: 17, rank: "HUNTER", badges: 7, routes: 8 },
    { username: "ZeroDay", xp: 1280, level: 13, rank: "ROOKIE", badges: 5, routes: 8 },
    { username: "PacketKid", xp: 940, level: 10, rank: "ROOKIE", badges: 4, routes: 8 },
];

export default function LeaderboardPage() {
    const [profile, setProfile] = useState<DarkProfile | null>(null);

    useEffect(() => {
        async function load() {
            const p = await profileService.getProfile();
            setProfile(p);
        }

        load();
    }, []);

    const operators = [
        ...mockOperators,
        ...(profile
            ? [
                {
                    username: profile.username,
                    xp: profile.xp,
                    level: profile.level,
                    rank: profile.rank,
                    badges: profile.badges.length,
                    isYou: true,
                    routes:
                        Math.min(
                            profile.completedLessons.length,
                            profile.completedMissions.length,
                            profile.completedDefend.length
                        ),
                },
            ]
            : []),
    ].sort((a, b) => {
        if (b.routes !== a.routes) return b.routes - a.routes;
        return b.xp - a.xp;
    });

    return (

        <main className="relative min-h-screen overflow-hidden bg-[#05070A] px-5 py-8 text-slate-100">
            <NexusBackground />

            <section className="relative z-10 mx-auto max-w-6xl">
                <PanelCard variant="darkNexus" className="mb-8">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                        >
                            <ArrowLeft size={17} />
                            Back to DarkNexus
                        </Link>

                        <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] text-slate-400 md:flex">
                            <span className="text-emerald-300">Training Board ●</span>
                            <span>mocked V1</span>
                        </div>
                    </div>
                </PanelCard>

                <PanelCard variant="darkNexusHero" accent="blue" className="mb-6 p-6">
                    <div className="flex items-center gap-4">
                        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-blue-300/40 bg-blue-400/10 text-blue-300 shadow-[0_0_24px_rgba(0,229,255,.22)]">
                            <Trophy size={32} />
                        </div>

                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.4em] text-blue-300">
                                Operator Board
                            </p>
                            <h1 className="mt-2 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl font-black text-transparent">
                                Operator Ranking
                            </h1>
                            <p className="mt-2 text-slate-400">
                                Track operator progression across lessons, labs, defense simulations and completed routes.
                            </p>
                        </div>
                    </div>
                </PanelCard>

                <div className="mb-4 grid gap-3 md:grid-cols-3">
                    <PanelCard variant="elevated" accent="blue" className="p-4">
                        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Operators</p>
                        <p className="mt-2 text-2xl font-black text-white">{operators.length}</p>
                    </PanelCard>

                    <PanelCard variant="elevated" accent="emerald" className="p-4">
                        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Top XP</p>
                        <p className="mt-2 text-2xl font-black text-white">{operators[0]?.xp ?? 0}</p>
                    </PanelCard>

                    <PanelCard variant="elevated" accent="blue" className="p-4">
                        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Mode</p>
                        <p className="mt-2 text-2xl font-black text-white">Local</p>
                    </PanelCard>
                </div>

                <div className="grid gap-4">
                    {operators.map((op, index) => (
                        <LeaderboardRow key={`${op.username}-${index}`} operator={op} position={index + 1} />
                    ))}
                </div>
            </section>
            <NexusAIButton />
        </main>
    );
}

function LeaderboardRow({
    operator,
    position,
}: {
    operator: {
        username: string;
        xp: number;
        level: number;
        rank: string;
        badges: number;
        routes: number;
        isYou?: boolean;
    };
    position: number;
}) {
    const isTopThree = position <= 3;

    return (
        <PanelCard
            variant="darkNexus"
            accent={operator.isYou ? "emerald" : "blue"}
            hover
            className="p-5"
        >
            <div className="grid gap-3 md:grid-cols-[70px_1fr_repeat(4,110px)] md:items-center">
                <div className="flex items-center gap-3">
                    <RankIcon position={position} />
                    <span className="font-mono text-sm text-slate-400">#{position}</span>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        className={`grid h-12 w-12 place-items-center rounded-xl border ${isTopThree
                            ? "border-yellow-300/40 bg-yellow-400/10 text-yellow-300"
                            : "border-white/[0.08] bg-white/[0.04] text-slate-200"
                            }`}
                    >
                        <User size={22} />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-white">{operator.username}</h2>
                            {operator.isYou && (
                                <span className="rounded-full border border-green-300/25 bg-green-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-green-200">
                                    YOU
                                </span>
                            )}
                        </div>
                        <p className="font-mono text-xs text-blue-300">{operator.rank}</p>
                    </div>
                </div>
                <MiniStat icon={Zap} label="XP" value={operator.xp} />
                <MiniStat icon={Shield} label="LVL" value={operator.level} />
                <MiniStat icon={Medal} label="Badges" value={operator.badges} />
                <MiniStat icon={Route} label="Routes" value={operator.routes} />
            </div>
        </PanelCard>
    );
}

function RankIcon({ position }: { position: number }) {
    if (position === 1) return <Crown className="text-yellow-300" size={24} />;
    if (position === 2) return <Medal className="text-slate-300" size={24} />;
    if (position === 3) return <Medal className="text-orange-300" size={24} />;
    return <Trophy className="text-blue-300" size={22} />;
}

function MiniStat({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-xl border border-blue-400/15 bg-white/[0.03] p-3">
            <div className="mb-1 flex items-center gap-2 text-blue-300">
                <Icon size={15} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    {label}
                </span>
            </div>
            <p className="text-xl font-black text-white">{value}</p>
        </div>
    );
}
