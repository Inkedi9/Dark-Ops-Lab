"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, Medal, Trophy, User, Zap, Shield } from "lucide-react";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import NexusAIButton from "@/components/assistant/NexusAIButton";
import { parseOrWarn, LeaderboardResponseSchema, type LeaderboardEntry } from "@/lib/api/schemas";

// Extend the validated type with the client-side isYou flag.
type LeaderboardEntryWithYou = LeaderboardEntry & { isYou?: boolean };

async function fetchLeaderboard(): Promise<LeaderboardEntry[] | null> {
    const apiUrl = process.env.NEXT_PUBLIC_DARK_API_URL;
    if (!apiUrl) return null;

    try {
        const res = await fetch(`${apiUrl}/v1/leaderboard`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        return parseOrWarn(LeaderboardResponseSchema, await res.json(), "leaderboard");
    } catch {
        return null;
    }
}

async function getCurrentUserId(): Promise<string | null> {
    if (!hasSupabaseConfig()) return null;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
}

export default function LeaderboardPage() {
    const [entries, setEntries] = useState<LeaderboardEntryWithYou[]>([]);
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        async function load() {
            const [liveData, userId] = await Promise.all([
                fetchLeaderboard(),
                getCurrentUserId(),
            ]);

            if (liveData && liveData.length > 0) {
                const withYou = liveData.map((entry) => ({
                    ...entry,
                    isYou: userId ? entry.id === userId : false,
                }));
                setEntries(withYou);
                setIsLive(true);
            } else if (process.env.NEXT_PUBLIC_DARK_API_URL && liveData === null) {
                setApiError(true);
            }

            setLoading(false);
        }

        load();
    }, []);

    const topXp = entries[0]?.xp ?? 0;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070A] px-5 py-8 text-slate-100">
            <NexusBackground />

            <section className="relative z-10 mx-auto max-w-6xl">
                <PanelCard variant="darkOps" className="mb-8">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                        >
                            <ArrowLeft size={17} />
                            Back to DarkOps
                        </Link>

                        <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] text-slate-400 md:flex">
                            <span className="text-emerald-300">Training Board ●</span>
                            <span className={isLive ? "text-emerald-400" : "text-slate-600"}>
                                {loading ? "Connecting..." : isLive ? "Live · dark-api" : "Offline"}
                            </span>
                        </div>
                    </div>
                </PanelCard>

                <PanelCard variant="darkOpsHero" accent="blue" className="mb-6 p-6">
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
                                Global operator progression — challenges, labs, defense simulations.
                            </p>
                        </div>
                    </div>
                </PanelCard>

                <div className="mb-4 grid gap-3 md:grid-cols-3">
                    <PanelCard variant="elevated" accent="blue" className="p-4">
                        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Operators</p>
                        <p className="mt-2 text-2xl font-black text-white">
                            {loading ? "—" : entries.length}
                        </p>
                    </PanelCard>

                    <PanelCard variant="elevated" accent="emerald" className="p-4">
                        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Top XP</p>
                        <p className="mt-2 text-2xl font-black text-white">
                            {loading ? "—" : topXp.toLocaleString()}
                        </p>
                    </PanelCard>

                    <PanelCard
                        variant="elevated"
                        accent={isLive ? "emerald" : "blue"}
                        className="p-4"
                    >
                        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Mode</p>
                        <p className={`mt-2 text-2xl font-black ${isLive ? "text-emerald-300" : "text-slate-500"}`}>
                            {loading ? "—" : isLive ? "Live" : "Offline"}
                        </p>
                    </PanelCard>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-24 animate-pulse rounded-2xl bg-white/[0.04]"
                                style={{ animationDelay: `${i * 80}ms` }}
                            />
                        ))}
                    </div>
                ) : entries.length > 0 ? (
                    <div className="grid gap-3">
                        {entries.map((entry) => (
                            <LeaderboardRow key={entry.id} operator={entry} />
                        ))}
                    </div>
                ) : (
                    <PanelCard variant="darkOps" className="p-16 text-center">
                        <Trophy className="mx-auto mb-4 text-slate-700" size={40} />
                        <p className="font-mono text-sm text-slate-500">
                            {!process.env.NEXT_PUBLIC_DARK_API_URL
                                ? "Backend offline — set NEXT_PUBLIC_DARK_API_URL to enable live rankings."
                                : apiError
                                ? "API unreachable — make sure dark-api is running."
                                : "No operators ranked yet. Complete a challenge to appear here."}
                        </p>
                    </PanelCard>
                )}
            </section>

            <NexusAIButton />
        </main>
    );
}

function LeaderboardRow({ operator }: { operator: LeaderboardEntryWithYou }) {
    const { position } = operator;
    const isTopThree = position <= 3;

    return (
        <PanelCard
            variant="darkOps"
            accent={operator.isYou ? "emerald" : "blue"}
            hover
            className="p-5"
        >
            <div className="grid gap-3 md:grid-cols-[70px_1fr_repeat(2,130px)] md:items-center">
                <div className="flex items-center gap-3">
                    <RankIcon position={position} />
                    <span className="font-mono text-sm text-slate-400">#{position}</span>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        className={`grid h-12 w-12 place-items-center rounded-xl border ${
                            isTopThree
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
                                <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-200">
                                    YOU
                                </span>
                            )}
                        </div>
                        <p className="font-mono text-xs text-blue-300">{operator.rank}</p>
                    </div>
                </div>

                <MiniStat icon={Zap} label="XP" value={operator.xp.toLocaleString()} />
                <MiniStat icon={Shield} label="Level" value={operator.level} />
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
            <div className="mb-1 flex items-center gap-2">
                <Icon size={15} className="text-blue-300" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    {label}
                </span>
            </div>
            <p className="text-xl font-black text-white">{value}</p>
        </div>
    );
}
