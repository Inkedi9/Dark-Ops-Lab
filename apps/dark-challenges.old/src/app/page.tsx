"use client";

import Link from "next/link";
import { getAllChallenges } from "@/challenges/registry";
import {
  useChallengeProgressSnapshot,
  useGlobalProgressSnapshot,
} from "@/hooks/useLocalProgressSnapshots";
import { AppShell } from "@/components/layout/AppShell";
import { NexusHero } from "@/components/home/NexusHero";
import PanelCard from "@dark/ui/components/PanelCard";

export default function HomePage() {
  const challenges = getAllChallenges();
  const global = useGlobalProgressSnapshot();
  const progressState = useChallengeProgressSnapshot();

  const solvedCount = progressState.filter((item) => item.solved).length;
  const totalChallenges = challenges.length;
  const completion =
    totalChallenges === 0 ? 0 : Math.round((solvedCount / totalChallenges) * 100);

  const nextMission =
    challenges.find(
      (challenge) =>
        !progressState.find((item) => item.challengeId === challenge.id)?.solved
    ) ?? challenges[0];

  return (
    <AppShell>

      <div className="relative z-10 mx-auto max-w-7xl">

        <NexusHero
          nextMission={nextMission ? { slug: nextMission.slug, title: nextMission.title } : undefined}
          global={global}
          completion={completion}
        />

        <section className="mt-14">
          <TargetMap completion={completion} />
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <PanelCard variant="darkNexus" accent="blue">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-300">
              Available missions
            </p>
            <p className="mt-3 text-4xl font-black">{totalChallenges}</p>
          </PanelCard>

          <PanelCard variant="darkNexus" accent="danger">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-200">
              Breached
            </p>
            <p className="mt-3 text-4xl font-black">{solvedCount}</p>
          </PanelCard>

          <PanelCard variant="darkNexus" accent="amber">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-300">
              Current objective
            </p>
            <p className="mt-3 text-xl font-black">
              {nextMission?.title ?? "All missions completed"}
            </p>
          </PanelCard>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <Link href="/ctf" className="group block transition hover:-translate-y-1">
            <PanelCard variant="nexus" accent="danger" hover className="h-full p-7">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-300">
                CTF Mode
              </p>

              <h2 className="mt-4 text-3xl font-black text-white">
                Capture flags through chained scenarios.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
                Scenario-based operations with dedicated steps, hidden fragments,
                final flag submission, XP rewards and special badges.
              </p>

              <div className="mt-6 inline-flex rounded-xl border border-slate-700 bg-[#0f1623] px-5 py-3 text-sm font-medium text-slate-200 transition group-hover:border-[rgba(var(--dc-accent),0.4)] group-hover:text-blue-200">
                Open CTF operations →
              </div>
            </PanelCard>
          </Link>

          <Link href="/warzone" className="group block transition hover:-translate-y-1">
            <PanelCard variant="danger" accent="danger" hover className="h-full p-7">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-300">
                Warzone Mode
              </p>

              <h2 className="mt-4 text-3xl font-black text-white">
                Enter live attack simulations.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
                Dynamic environments with timers, hostile events, detection risk,
                evolving objectives and pressure-based offensive decision making.
              </p>

              <div className="mt-6 inline-flex rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-medium text-red-100 transition group-hover:border-red-300/50 group-hover:bg-red-400/15">
                Enter warzone →
              </div>
            </PanelCard>
          </Link>
        </section>
      </div>
    </AppShell>
  );
}

function TargetMap({ completion }: { completion: number }) {
  const steps = ["Recon", "Inject", "Bypass", "Extract"];

  return (
    <section className="mt-4">
      <PanelCard variant="darkNexus" accent="danger" className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-200">
              Attack route
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Simulated breach chain · safe mocked environment
            </p>
          </div>

          <div className="grid flex-1 grid-cols-4 gap-2 md:max-w-2xl">
            {steps.map((step, index) => (
              <div
                key={step}
                className={[
                  "rounded-xl border px-3 py-3 text-center font-mono text-[10px] uppercase tracking-widest",
                  index === 0
                    ? "border-red-300/24 bg-red-400/[0.07] text-red-200"
                    : "border-white/[0.06] bg-white/[0.025] text-slate-500",
                ].join(" ")}
              >
                {step}
              </div>
            ))}
          </div>

          <span className="font-mono text-xs text-slate-500">
            {completion}% cleared
          </span>
        </div>
      </PanelCard>
    </section>
  );
}
