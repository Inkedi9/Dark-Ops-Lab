import { createElement } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, Award, Radar, ShieldCheck, Target, Zap } from "lucide-react";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishButton } from "@/components/ui/PhishButton";
import { PhishProgress } from "@/components/ui/PhishProgress";

export default function DefenseDashboard({ profile, stats }) {
    const xpRemainder = profile ? profile.xp % 100 : 0;
    const xpToNextLevel = xpRemainder === 0 ? 100 : 100 - xpRemainder;
    const badges = profile?.badges || [];

    return (
        <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <PhishPanel variant="glow" className="p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
                            Defense Dashboard
                        </p>
                        <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.08em] text-white">
                            {stats.completionPercent}% path secured
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                            Track your phishing defense path, profile XP, badge progress and the next
                            action in the DarkNexus loop.
                        </p>
                    </div>

                    <Link to="/profile">
                        <PhishButton tone="slate">
                            Open Profile
                            <ArrowRight className="h-4 w-4" />
                        </PhishButton>
                    </Link>
                </div>

                <div className="mt-6">
                    <PhishProgress value={stats.completedScenarioCount} max={stats.totalScenarios} />
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-4">
                    <DashboardStat icon={Zap} label="XP" value={profile?.xp ?? 0} tone="blue" />
                    <DashboardStat icon={Activity} label="Level" value={profile?.level ?? 1} tone="green" />
                    <DashboardStat icon={Target} label="Remaining" value={stats.remainingScenarioCount} tone="amber" />
                    <DashboardStat icon={Award} label="Badges" value={badges.length} tone="slate" />
                </div>
            </PhishPanel>

            <PhishPanel className="p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
                            Next Action
                        </p>
                        <h3 className="mt-3 text-2xl font-black text-white">
                            {stats.remainingScenarioCount > 0 ? "Continue phishing defense" : "Review your results"}
                        </h3>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-green-300/35 bg-green-400/10 text-green-300">
                        {stats.remainingScenarioCount > 0 ? <Radar className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-blue-400/15 bg-black/30 p-4 font-mono text-sm leading-7">
                    <p className="text-green-300">&gt; profile loaded... [ OK ]</p>
                    <p className="text-blue-200">
                        &gt; rank {profile?.rank || "ROOKIE"} / {profile?.username || "Ghost"}
                    </p>
                    <p className="text-slate-300">&gt; next level in {xpToNextLevel} XP</p>
                    <p className="text-blue-300">root@dark-defend:~$ <span className="terminal-cursor">█</span></p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {stats.remainingScenarioCount > 0 ? (
                        <Link to="/simulator">
                            <PhishButton tone="blue">
                                Continue Simulation
                                <ArrowRight className="h-4 w-4" />
                            </PhishButton>
                        </Link>
                    ) : (
                        <Link to="/results">
                            <PhishButton tone="blue">
                                View Results
                                <ArrowRight className="h-4 w-4" />
                            </PhishButton>
                        </Link>
                    )}
                </div>
            </PhishPanel>
        </section>
    );
}

function DashboardStat({ icon, label, value, tone }) {
    const tones = {
        blue: "border-blue-400/20 bg-blue-400/10 text-blue-300",
        green: "border-green-300/25 bg-green-400/10 text-green-300",
        amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
        slate: "border-blue-400/15 bg-black/25 text-slate-300",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-80">{label}</p>
                {createElement(icon, { className: "h-4 w-4" })}
            </div>
            <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
    );
}
