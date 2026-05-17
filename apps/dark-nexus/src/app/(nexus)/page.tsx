"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  BookOpen,
  Database,
  Fingerprint,
  RadioTower,
  Route,
  ShieldCheck,
  Swords,
  User,
} from "lucide-react";
import { profileService } from "@dark/profile/profileService";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import Topbar from "@/components/layout/Topbar";
import ModuleCard from "@/components/home/ModuleCard";
import FlowStep from "@/components/home/FlowStep";
import ContinueJourney from "@/components/home/ContinueJourney";
import ProfileSummary from "@/components/home/ProfileSummary";
import PathCard from "@/components/home/PathCard";
import DefendHighlight from "@/components/home/DefendHighlight";
import ConnectionBlueprint from "@/components/home/ConnectionBlueprint";
import BrandPill from "@/components/home/BrandPill";
import Footer from "@/components/layout/Footer";
import AppButton from "@dark/ui/components/AppButton";
import CommandBriefing from "@/components/home/CommandBriefing";
import NexusAIButton from "@/components/assistant/NexusAIButton";
import TacticalRouteMap from "@/components/home/TacticalRouteMap";
import NexusActivityFeed from "@/components/home/NexusActivityFeed";
import UnlockCenter from "@/components/home/UnlockCenter";
import NextActionsPanel from "@/components/home/NextActionsPanel";
import OperatorStatusPanel from "@/components/home/OperatorStatusPanel";
import LiveTacticalLayer from "@/components/home/LiveTacticalLayer";


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

type Module = {
  key: string;
  name: string;
  role: string;
  title: string;
  short: string;
  description: string;
  href: string;
  icon: React.ElementType;
  status: string;
  badge: string;
  cta: string;
  stats: string[];
  tone: "blue" | "green";
};

const modules: Module[] = [
  {
    key: "learn",
    name: "DarkSplaining",
    role: "LEARN",
    title: "Learn the flaw before you exploit it.",
    short: "Understand",
    description:
      "Beginner-friendly cyber lessons: SQLi, XSS, authentication, OAuth, logging and defensive basics.",
    href: "/learn",
    icon: BookOpen,
    status: "ONLINE",
    badge: "START HERE",
    cta: "Enter lessons",
    stats: ["9 lessons", "7 categories", "guided"],
    tone: "blue",
  },
  {
    key: "practice",
    name: "DarkChallenges",
    role: "PRACTICE",
    title: "Exploit a fake login. Capture the flag.",
    short: "Exploit safely",
    description:
      "Safe mocked labs, CTF operations and warzone-style offensive simulations with local-first progression.",
    href: "/challenges",
    icon: Swords,
    status: "READY",
    badge: "HANDS-ON",
    cta: "Open mission board",
    stats: ["CTF", "Warzone", "XP"],
    tone: "green",
  },
  {
    key: "defend",
    name: "DarkDefend",
    role: "DEFEND",
    title: "Analyze suspicious emails before users click.",
    short: "Protect",
    description:
      "Phishing simulations, security checks, password hygiene and simple defensive advice for real users.",
    href: "/defend",
    icon: ShieldCheck,
    status: "CONNECT",
    badge: "REAL-WORLD",
    cta: "Open defense lab",
    stats: ["phishing", "security check", "advice"],
    tone: "blue",
  },
];

const flowSteps: Array<{
  key: string;
  role: string;
  short: string;
  name: string;
  icon: React.ElementType;
  tone: "blue" | "green";
}> = [
  { key: "learn", role: "LEARN", short: "Understand", name: "Lessons and concepts", icon: BookOpen, tone: "blue" },
  { key: "practice", role: "PRACTICE", short: "Exploit safely", name: "Labs, CTF and missions", icon: Swords, tone: "green" },
  { key: "defend", role: "DEFEND", short: "Reduce risk", name: "Phishing and human defense", icon: ShieldCheck, tone: "blue" },
  { key: "track", role: "TRACK", short: "Progress", name: "XP, badges and next actions", icon: Route, tone: "blue" },
];

const paths = [
  {
    id: "sqli",
    title: "SQL Injection Path",
    label: "Recommended",
    steps: ["Learn SQLi", "Login Bypass", "Fix unsafe queries"],
    progress: 67,
    href: "/learn",
  },
  {
    id: "xss",
    title: "XSS Path",
    label: "Next unlock",
    steps: ["Learn XSS", "Reflected/Stored XSS", "Escape & sanitize"],
    progress: 42,
    href: "/learn",
  },
  {
    id: "phishing",
    title: "Phishing Defense Path",
    label: "Defend focus",
    steps: ["Learn red flags", "Phishing simulator", "Security checklist"],
    progress: 20,
    href: "/defend",
  },
];

export default function DarkOpsHub() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const storedProfile = await profileService.getProfile();
      setProfile(storedProfile);
    }

    loadProfile();
  }, []);

  async function handleCreateProfile() {
    if (!username.trim()) return;
    const newProfile = await profileService.createProfile(username.trim());
    setProfile(newProfile);
  }

  async function handleAddXp() {
    const updatedProfile = await profileService.addXp(50);
    setProfile(updatedProfile);
  }

  async function handleResetProfile() {
    await profileService.resetProfile();
    setProfile(null);
    setUsername("");
  }

  if (!profile) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#05070A] px-5 text-slate-100">
        <NexusBackground />
        <LiveTacticalLayer />
        <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center py-10">
          <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <BrandPill />
              <h1 className="font-[var(--font-display)] text-6xl font-black tracking-tight">
                Dark Ops
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
                Create your operator profile and start your cyber journey from zero: learn, practice safely, then defend for real.
              </p>
            </div>

            <GlassPanel title="Operator Login" icon={<User className="h-4 w-4" />}>
              <p className="mb-4 text-sm leading-6 text-slate-400">
                Create a local operator profile to track XP, level and badges. Supabase-ready later.
              </p>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateProfile();
                }}
                placeholder="Enter your alias..."
                className="mb-3 w-full rounded-xl border border-blue-400/20 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-300/60"
              />
              <button
                onClick={handleCreateProfile}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-400/10 px-4 py-3 font-semibold text-blue-200 transition hover:bg-blue-400/20"
              >
                Initialize Profile <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </GlassPanel>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070A] text-slate-100 selection:bg-blue-300 selection:text-black">
      <NexusBackground />
      <LiveTacticalLayer />

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-5 md:px-8 xl:py-8">

        <Topbar
          profile={profile}
          onReset={handleResetProfile}
        />

        <header className="relative grid items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-blue-200/25 to-transparent lg:block" />
          <div className="pointer-events-none absolute -left-8 top-24 hidden h-40 w-px bg-gradient-to-b from-transparent via-emerald-200/20 to-transparent lg:block" />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <BrandPill />
            <div className="mt-5 flex flex-wrap gap-2">
              <CommandChip icon={RadioTower} label="Ecosystem live" value="4 modules" tone="blue" />
              <CommandChip icon={Database} label="Telemetry" value="Local-first" tone="emerald" />
              <CommandChip icon={Fingerprint} label="Operator" value={profile.rank} tone="violet" />
            </div>
            <h2 className="mt-6 max-w-4xl text-6xl font-black leading-[0.95] tracking-tight text-white md:text-8xl">
              Continue your
              <span className="block text-slate-300">operator path.</span>
              <span className="block bg-gradient-to-b from-blue-200 to-slate-400 bg-clip-text text-transparent">
                Learn. Exploit. Defend.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              DarkOps tells you exactly what to do next: learn the concept, complete the lab,
              then prove you can recognize the same attack from the defender side.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <AppButton href="#next-action" variant="primary">
                Start recommended action →
              </AppButton>

              <AppButton href="#paths" variant="secondary">
                View operator routes
              </AppButton>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <HeroMetric label="Lessons" value={profile.completedLessons.length} />
              <HeroMetric label="Missions" value={profile.completedMissions.length} />
              <HeroMetric label="Defend" value={profile.completedDefend.length} />
            </div>
          </motion.div>

          <CommandBriefing />
        </header>

        <section className="py-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {flowSteps.map((module, index) => (
              <FlowStep key={module.key} module={module} index={index} />
            ))}
          </div>
        </section>

        <OperatorStatusPanel profile={profile} />
        <ContinueJourney profile={profile} />
        <NextActionsPanel profile={profile} />
        <TacticalRouteMap profile={profile} />

        <div className="grid gap-6 py-8 lg:grid-cols-2">
          <NexusActivityFeed />
          <UnlockCenter />
        </div>

        <section id="launch" className="grid gap-5 py-12 lg:grid-cols-3">
          {modules.map((module, index) => (
            <ModuleCard key={module.key} module={module} index={index} />
          ))}
        </section>

        <section id="paths" className="grid gap-6 py-12 lg:grid-cols-[0.8fr_1.2fr]">
          <ProfileSummary profile={profile} onAddXp={handleAddXp} onReset={handleResetProfile} />

          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/30 bg-blue-400/10 text-blue-300">
                <Route size={22} />
              </div>
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-300">Recommended paths</p>
                <h2 className="text-3xl font-black text-white">Choose your next route.</h2>
              </div>
            </div>
            <div className="grid gap-4">
              {paths.map((path) => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          </div>
        </section>

        <DefendHighlight />
        <ConnectionBlueprint />

        <Footer />
      </section>
      <NexusAIButton />
    </main>
  );
}

function CommandChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: "blue" | "emerald" | "violet";
}) {
  const styles =
    tone === "emerald"
      ? "border-emerald-300/16 bg-emerald-300/[0.055] text-emerald-200"
      : tone === "violet"
        ? "border-violet-300/16 bg-violet-300/[0.055] text-violet-200"
        : "border-blue-300/16 bg-blue-300/[0.055] text-blue-200";

  return (
    <div className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 ${styles}`}>
      <Icon className="h-4 w-4" />
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <span className="text-xs font-black text-white">{value}</span>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-blue-300/12 bg-black/24 p-4 shadow-[inset_0_0_22px_rgba(96,165,250,.025)]">
      <div className="mb-3 flex items-center gap-2 text-blue-200">
        <Activity className="h-4 w-4" />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function GlassPanel({
  title,
  icon,
  children,
  variant = "nexus",
  accent = "blue",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "nexus" | "nexusHero" | "darkOps" | "darkOpsHero" | "glass";
  accent?: "none" | "blue" | "green" | "danger" | "violet" | "amber" | "emerald";
}) {
  return (
    <PanelCard variant={variant} accent={accent} hover>
      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-blue-300">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </PanelCard>
  );
}
