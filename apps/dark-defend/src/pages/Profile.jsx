import { createElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Award, BookOpen, Shield, Target, Trophy, User, Zap } from "lucide-react";
import Header from "@/components/Header";
import { PhishLayout } from "@/components/ui/PhishLayout";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishBadge } from "@/components/ui/PhishBadge";
import { PhishButton } from "@/components/ui/PhishButton";
import { PhishMetric } from "@/components/ui/PhishMetric";
import { PhishProgress } from "@/components/ui/PhishProgress";
import { scenarios } from "@/data/scenarios";
import { getDarkProfile, getDefendStats } from "@/lib/defend/defendProgressService";

const BADGE_LABELS = {
    defend_first_analysis: "First Analysis",
    defend_perfect_analysis: "Perfect Analysis",
    defend_phishing_path_complete: "Phishing Path Complete",
    defend_analyst_correct: "Analyst Call",
    defend_streak_3: "Three-Call Streak",
};

export default function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        getDarkProfile().then(setProfile);
    }, []);

    const stats = getDefendStats(profile, scenarios.length);
    const xpIntoLevel = profile ? profile.xp % 100 : 0;
    const xpToNext = xpIntoLevel === 0 ? 100 : 100 - xpIntoLevel;
    const badges = profile?.badges || [];

    return (
        <>
            <Header />

            <PhishLayout>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <Link to="/">
                        <PhishButton tone="slate">
                            <ArrowLeft className="h-4 w-4" />
                            Back Home
                        </PhishButton>
                    </Link>

                    <div className="flex flex-wrap gap-2">
                        <PhishBadge tone="green">Profile Secure</PhishBadge>
                        <PhishBadge tone="slate">localStorage V1</PhishBadge>
                    </div>
                </div>

                <PhishPanel variant="glow" className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-center gap-5">
                            <div className="grid h-20 w-20 place-items-center rounded-2xl border border-blue-300/40 bg-blue-400/10 text-blue-300 shadow-[0_0_30px_rgba(0,229,255,0.16)]">
                                <User className="h-9 w-9" />
                            </div>

                            <div>
                                <p className="font-mono text-xs uppercase tracking-[0.32em] text-blue-300">
                                    Operator Profile
                                </p>
                                <h1 className="mt-2 text-5xl font-black text-white">
                                    {profile?.username || "Ghost"}
                                </h1>
                                <p className="mt-2 text-sm text-slate-400">
                                    Rank: <span className="font-bold text-green-300">{profile?.rank || "ROOKIE"}</span>
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-blue-400/15 bg-black/30 p-4 font-mono text-sm leading-7">
                            <p className="text-green-300">&gt; PROFILE LOADED.......... [ OK ]</p>
                            <p className="text-blue-300">&gt; XP TRACKER ONLINE....... [ OK ]</p>
                            <p className="text-slate-300">&gt; NEXT LEVEL.............. {xpToNext} XP</p>
                        </div>
                    </div>

                    <div className="mt-7 grid gap-4 md:grid-cols-4">
                        <PhishMetric label="XP" value={profile?.xp ?? 0} tone="blue" />
                        <PhishMetric label="Level" value={profile?.level ?? 1} tone="green" />
                        <PhishMetric label="Badges" value={badges.length} tone="slate" />
                        <PhishMetric label="Defend Done" value={stats.completedScenarioCount} tone="amber" />
                    </div>

                    <div className="mt-7">
                        <PhishProgress value={xpIntoLevel} max={100} />
                    </div>
                </PhishPanel>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <PhishPanel className="p-6">
                        <PanelTitle icon={Trophy} title="Badges" />

                        {badges.length === 0 ? (
                            <p className="mt-5 text-slate-400">No badges unlocked yet.</p>
                        ) : (
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {badges.map((badge) => (
                                    <div
                                        key={badge}
                                        className="rounded-2xl border border-blue-400/15 bg-black/30 p-4"
                                    >
                                        <Award className="h-5 w-5 text-blue-300" />
                                        <p className="mt-3 font-bold text-white">
                                            {BADGE_LABELS[badge] || badge}
                                        </p>
                                        <p className="mt-1 font-mono text-xs text-slate-500">{badge}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </PhishPanel>

                    <PhishPanel className="p-6">
                        <PanelTitle icon={Target} title="Progress" />

                        <div className="mt-5 space-y-5">
                            <ProgressRow label="Lessons" value={profile?.completedLessons?.length || 0} icon={BookOpen} />
                            <ProgressRow label="Missions" value={profile?.completedMissions?.length || 0} icon={Zap} />
                            <ProgressRow label="Defense sims" value={stats.completedScenarioCount} icon={Shield} />
                        </div>
                    </PhishPanel>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <PhishPanel className="p-6">
                        <PanelTitle icon={Shield} title="Account Details" />

                        <div className="mt-5 grid gap-4 font-mono text-sm text-slate-400 md:grid-cols-2">
                            <p className="break-all">ID: {profile?.id || "pending"}</p>
                            <p>Storage: localStorage V1</p>
                            <p>Created: {formatDate(profile?.createdAt)}</p>
                            <p>Updated: {formatDate(profile?.updatedAt)}</p>
                        </div>
                    </PhishPanel>

                    <PhishPanel className="p-6">
                        <PanelTitle icon={Shield} title="System Status" />

                        <div className="mt-5 font-mono text-sm leading-7">
                            <p className="text-green-300">&gt; PROFILE SECURE.......... [ OK ]</p>
                            <p className="text-blue-300">&gt; DEFEND MODULE LINKED.... [ OK ]</p>
                            <p className="text-slate-300">&gt; SUPABASE ADAPTER........ [ FUTURE ]</p>
                        </div>
                    </PhishPanel>
                </div>
            </PhishLayout>
        </>
    );
}

function PanelTitle({ icon, title }) {
    return (
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
            {createElement(icon, { className: "h-4 w-4" })}
            {title}
        </div>
    );
}

function ProgressRow({ label, value, icon }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                    {createElement(icon, { className: "h-4 w-4 text-blue-300" })}
                    {label}
                </span>
                <span className="font-mono text-blue-300">{value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-blue-950/40">
                <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,.72),rgba(45,212,191,.58))]"
                    style={{ width: value > 0 ? "100%" : "0%" }}
                />
            </div>
        </div>
    );
}

function formatDate(value) {
    if (!value) return "pending";
    return new Intl.DateTimeFormat("fr-FR").format(new Date(value));
}
