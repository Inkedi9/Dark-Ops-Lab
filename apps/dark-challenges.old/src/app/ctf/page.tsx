"use client";

import { AppShell } from "@/components/layout/AppShell";
import { getAllMiniCtfs } from "@/ctf/registry";
import { useCtfProgressSnapshot } from "@/hooks/useLocalProgressSnapshots";
import PageHeader from "@dark/ui/components/PageHeader";
import PanelCard from "@dark/ui/components/PanelCard";
import AppButton from "@dark/ui/components/AppButton";
import AppBadge from "@dark/ui/components/AppBadge";


export default function CtfPage() {
    const ctfs = getAllMiniCtfs();
    const progress = useCtfProgressSnapshot();

    return (
        <AppShell>
            <PageHeader
                eyebrow="CTF mode"
                title="Recover fragments."
                highlight="Capture the final flag."
                description="Follow chained offensive scenarios, recover flag fragments, assemble proof and unlock XP rewards."
                mode="nexus"
            />

            <section className="grid gap-6 md:grid-cols-2">
                {ctfs.map((ctf) => {
                    const saved = progress.find((item) => item.ctfId === ctf.id);
                    const completed = Boolean(saved?.completed);
                    const solvedSteps = saved?.solvedStepIds.length ?? 0;

                    return (
                        <PanelCard
                            key={ctf.id}
                            variant="darkNexus"
                            accent={completed ? "emerald" : "blue"}
                            hover
                            className={completed ? "p-6" : "p-6 opacity-90"}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <AppBadge variant={completed ? "emerald" : "blue"}>
                                    {completed ? "Completed" : "Operation"}
                                </AppBadge>

                                <AppBadge variant={ctf.difficulty === "advanced" ? "danger" : "amber"}>
                                    {ctf.difficulty}
                                </AppBadge>
                            </div>

                            <h2 className="text-3xl font-black">{ctf.title}</h2>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                {ctf.description}
                            </p>

                            {saved?.completed && (
                                <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                                        Local leaderboard
                                    </p>

                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-slate-500">Best time</p>
                                            <p className="font-mono text-white">
                                                {saved.bestTimeSeconds ?? "-"}s
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-500">Attempts</p>
                                            <p className="font-mono text-white">
                                                {saved.bestAttempts ?? "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                                <span>{ctf.steps.length} steps</span>
                                <span>{ctf.rewardXp} XP reward</span>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-2">
                                {["Trace", "Recover", "Capture"].map((step, index) => (
                                    <div
                                        key={step}
                                        className={[
                                            "rounded-xl border px-3 py-3 text-center font-mono text-[10px] uppercase tracking-[0.2em]",
                                            completed
                                                ? "border-emerald-300/18 bg-emerald-400/[0.06] text-emerald-200"
                                                : index === Math.min(solvedSteps, 2)
                                                    ? "border-blue-300/22 bg-blue-400/[0.07] text-blue-200"
                                                    : "border-white/[0.07] bg-white/[0.03] text-slate-500",
                                        ].join(" ")}
                                    >
                                        {step}
                                    </div>
                                ))}
                            </div>

                            <AppButton
                                href={`/ctf/${ctf.slug}`}
                                variant={completed ? "emerald" : "secondary"}
                                className="mt-6 w-full"
                            >
                                {completed ? "Review operation" : "Start operation"}
                            </AppButton>
                        </PanelCard>
                    );
                })}
            </section>
        </AppShell>
    );
}
