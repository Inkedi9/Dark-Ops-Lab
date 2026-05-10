import { ArrowRight, BookOpen, ShieldCheck, Swords } from "lucide-react";
import type { ElementType } from "react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppButton from "@dark/ui/components/AppButton";

export default function CommandBriefing() {
    return (
        <PanelCard variant="darkNexusHero" accent="blue">
            <div className="mb-6 flex items-center justify-between">
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

            <div className="rounded-2xl border border-blue-300/20 bg-black/30 p-5">
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
