"use client";

import { AppShell } from "@/components/layout/AppShell";
import PanelCard from "@dark/ui/components/PanelCard";
import AppButton from "@dark/ui/components/AppButton";
import AppBadge from "@dark/ui/components/AppBadge";
import ProgressBar from "@dark/ui/components/ProgressBar";
import { getAllWarzones } from "@/challenges/warzone/registry";
import { useWarzoneProgressSnapshot } from "@/hooks/useLocalProgressSnapshots";
import PageHeader from "@dark/ui/components/PageHeader";

export default function WarzonePage() {
    const warzones = getAllWarzones();
    const progress = useWarzoneProgressSnapshot();

    return (
        <AppShell>
            <PageHeader
                eyebrow="Warzone protocol"
                title="Enter hostile"
                highlight="live combat simulations."
                description="High-pressure offensive environments with adaptive defenses, active detection systems and escalating hostile responses."
                mode="nexus"
                accent="danger"
                badges={[
                    { label: "Live hostile signals", variant: "danger" },
                    { label: "Adaptive WAF", variant: "amber" },
                    { label: "Detection risk", variant: "danger" },
                ]}
                action={
                    <div className="rounded-2xl border border-red-300/20 bg-red-400/[0.07] px-5 py-4 shadow-[0_0_30px_rgba(248,113,113,.08)]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-200">
                            Threat level
                        </p>

                        <p className="mt-2 text-3xl font-black text-white">
                            CRITICAL
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            hostile activity detected
                        </p>
                    </div>
                }
            />

            <section className="grid gap-6 md:grid-cols-2">
                {warzones.map((warzone) => {
                    const saved = progress.find((item) => item.warzoneId === warzone.id);
                    const completion = saved
                        ? Math.round(
                            (saved.state.objectivesCompleted.length /
                                warzone.objectives.length) *
                            100
                        )
                        : 0;

                    return (
                        <PanelCard
                            key={warzone.id}
                            variant="danger"
                            accent="danger"
                            hover
                            className="relative overflow-hidden p-6"
                        >
                            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />

                            <div className="relative z-10">
                                <div className="mb-4 flex items-center justify-between">
                                    <AppBadge variant={saved?.completed ? "emerald" : "danger"}>
                                        {saved?.completed ? "Zone cleared" : "Hostile zone"}
                                    </AppBadge>

                                    <AppBadge variant="danger">{warzone.difficulty}</AppBadge>
                                </div>

                                <h2 className="text-3xl font-black text-white">{warzone.title}</h2>

                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    {warzone.description}
                                </p>

                                <div className="mt-6 grid grid-cols-3 gap-2">
                                    {["Breach", "Evade", "Extract"].map((step, index) => (
                                        <div
                                            key={step}
                                            className={[
                                                "rounded-xl border px-3 py-3 text-center font-mono text-[10px] uppercase tracking-[0.2em]",
                                                saved?.completed
                                                    ? "border-emerald-300/18 bg-emerald-400/[0.06] text-emerald-200"
                                                    : index === 0
                                                        ? "border-red-300/25 bg-red-400/[0.08] text-red-200"
                                                        : "border-white/[0.07] bg-white/[0.03] text-slate-500",
                                            ].join(" ")}
                                        >
                                            {step}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <div className="mb-2 flex items-center justify-between font-mono text-xs text-slate-400">
                                        <span>Zone control</span>
                                        <span>{completion}%</span>
                                    </div>
                                    <ProgressBar value={completion} className="h-2" />
                                </div>

                                <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                                    <span>{warzone.objectives.length} objectives</span>
                                    <span>{warzone.rewardXp} XP reward</span>
                                </div>

                                <AppButton
                                    href={`/challenges/warzone/${warzone.slug}`}
                                    variant={saved?.completed ? "emerald" : "danger"}
                                    className="mt-6 w-full"
                                >
                                    {saved?.completed ? "Review cleared zone" : "Enter warzone"}
                                </AppButton>
                            </div>
                        </PanelCard>
                    );
                })}
            </section>
        </AppShell>
    );
}
