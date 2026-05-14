import { ArrowRight, BookOpen, Database, RadioTower, ShieldCheck, Swords } from "lucide-react";
import type { ElementType } from "react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppButton from "@dark/ui/components/AppButton";

export default function CommandBriefing() {
    return (
        <PanelCard
            variant="darkNexusHero"
            accent="blue"
            className="relative overflow-hidden border-blue-300/14 bg-[radial-gradient(circle_at_15%_0%,rgba(96,165,250,0.16),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(16,185,129,0.10),transparent_32%),linear-gradient(180deg,rgba(5,12,26,0.96),rgba(3,7,18,0.86))]"
        >
            <div className="pointer-events-none absolute inset-0 opacity-[0.17] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/45 to-emerald-200/25" />

            <div className="relative mb-6 flex items-center justify-between">
                <div>
                    <p className="font-mono text-xs font-black uppercase tracking-[0.35em] text-blue-300">
                        Command Briefing
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-white">
                        Recommended next action
                    </h3>
                </div>
                <span className="rounded-full border border-green-300/30 bg-green-400/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                    Ready
                </span>
            </div>

            <div className="relative mb-4 grid gap-3 sm:grid-cols-3">
                <BriefingSignal icon={RadioTower} label="Signal" value="Live route" />
                <BriefingSignal icon={Database} label="Telemetry" value="Tracking" />
                <BriefingSignal icon={ShieldCheck} label="Identity" value="Operator" />
            </div>

            <div className="relative rounded-2xl border border-blue-300/20 bg-black/30 p-5 shadow-[inset_0_0_26px_rgba(96,165,250,.035)]">
                <div className="mb-4 flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-300/30 bg-blue-400/10 text-blue-300">
                        <BookOpen size={22} />
                    </div>
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                            Start here
                        </p>
                        <h4 className="text-2xl font-black text-white">
                            SQL Injection Basics
                        </h4>
                    </div>
                </div>

                <p className="text-sm leading-6 text-slate-300">
                    Learn how unsafe database queries expose accounts, then unlock the
                    Login Bypass mission in DarkChallenges.
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <MiniStep icon={BookOpen} label="Learn" text="Understand SQLi" active />
                    <MiniStep icon={Swords} label="Practice" text="Bypass login" />
                    <MiniStep icon={ShieldCheck} label="Defend" text="Spot weak auth" />
                </div>

                <div className="mt-6">
                    <AppButton href="https://darksplaining.vercel.app" variant="primary">
                        Start SQLi lesson <ArrowRight size={16} />
                    </AppButton>
                </div>
            </div>
        </PanelCard>
    );
}

function BriefingSignal({
    icon: Icon,
    label,
    value,
}: {
    icon: ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
            <Icon className="mb-2 h-4 w-4 text-blue-200" />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-black text-white">{value}</p>
        </div>
    );
}

function MiniStep({
    icon: Icon,
    label,
    text,
    active = false,
}: {
    icon: ElementType;
    label: string;
    text: string;
    active?: boolean;
}) {
    return (
        <div
            className={[
                "rounded-xl border p-4",
                active
                    ? "border-blue-300/40 bg-blue-400/10"
                    : "border-white/10 bg-white/[0.03]",
            ].join(" ")}
        >
            <Icon className={active ? "text-blue-300" : "text-slate-500"} size={18} />
            <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>
            <p className="mt-1 text-sm font-bold text-white">{text}</p>
        </div>
    );
}
