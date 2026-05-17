import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import PanelCard from "@dark/ui/components/PanelCard";

function BlueprintLine({
    text,
    green,
}: {
    text: string;
    green?: boolean;
}) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-sm text-slate-300">
            <span className={green ? "text-emerald-300" : "text-blue-200"}>
                ✓
            </span>{" "}
            {text}
        </div>
    );
}

export default function DefendHighlight() {
    return (
        <section className="py-12">
            <PanelCard variant="glass" accent="emerald" hover className="p-8">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

                    {/* LEFT */}
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/[0.07] px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.3em] text-amber-100">
                            <AlertTriangle size={14} /> Defend highlight
                        </div>

                        <h2 className="text-4xl font-black md:text-5xl text-white">
                            Test your security now.
                        </h2>

                        <p className="mt-5 leading-8 text-slate-300">
                            DarkDefend is your differentiator: phishing simulator,
                            weak password awareness and simple advice that users
                            can apply immediately.
                        </p>

                        <Link
                            href="/defend"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-400/[0.08] px-5 py-3 font-black text-emerald-100 transition hover:bg-emerald-400/[0.15]"
                        >
                            Start phishing test <ArrowRight size={18} />
                        </Link>
                    </div>

                    {/* RIGHT */}
                    <div className="grid gap-3 font-mono text-sm text-slate-300">
                        <BlueprintLine text="Identify suspicious sender domains" green />
                        <BlueprintLine text="Spot fake urgency and credential traps" green />
                        <BlueprintLine text="Improve password and 2FA habits" green />
                        <BlueprintLine text="Return to practice with stronger intuition" green />
                    </div>

                </div>
            </PanelCard>
        </section>
    );
}