import { Link, useLocation } from "react-router-dom";
import {
    Shield,
    Siren,
    Radar,
    FileWarning,
    Activity,
    Network,
} from "lucide-react";

const items = [
    {
        to: "/soc",
        label: "Overview",
        icon: Shield,
    },
    {
        to: "/soc/alerts",
        label: "Alerts",
        icon: Siren,
    },
    {
        to: "/soc/cases",
        label: "Cases",
        icon: FileWarning,
    },
    {
        to: "/soc/intel",
        label: "Threat Intel",
        icon: Radar,
    },
    {
        to: "/soc/playbooks",
        label: "Playbooks",
        icon: Network,
    },
];

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function SocSidebar() {
    const location = useLocation();

    return (
        <aside className="relative flex h-screen w-[290px] flex-col overflow-hidden border-r border-blue-300/10 bg-[#050816]/96 backdrop-blur-2xl">
            {/* glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.08),transparent_38%)]" />

            {/* grid */}
            <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(16,185,129,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.035)_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-emerald-300/20 via-transparent to-transparent" />

            <div className="relative z-10 flex items-center gap-3 border-b border-white/[0.06] px-6 py-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-300/18 bg-blue-400/[0.08] text-blue-200 shadow-[0_0_25px_rgba(96,165,250,.12)]">
                    <Shield className="h-6 w-6" />
                </div>

                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blue-300">
                        DarkDefend
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                        SOC Core
                    </h2>
                </div>
            </div>

            <div className="relative z-10 flex-1 px-4 py-5">
                <div className="space-y-2">
                    {items.map((item) => {
                        const active =
                            location.pathname === item.to ||
                            location.pathname.startsWith(item.to + "/");

                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    "group flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-200",
                                    active
                                        ? "border-blue-300/20 bg-blue-400/[0.08] text-blue-100 shadow-[0_0_25px_rgba(96,165,250,.08)]"
                                        : "border-transparent text-slate-500 hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-blue-200"
                                )}
                            >
                                <div
                                    className={cn(
                                        "grid h-10 w-10 place-items-center rounded-xl border transition",
                                        active
                                            ? "border-blue-300/20 bg-blue-400/[0.08]"
                                            : "border-white/[0.06] bg-black/30"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-mono text-xs uppercase tracking-[0.18em]">
                                        {item.label}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="relative z-10 border-t border-white/[0.06] p-5">
                <div className="rounded-2xl border border-red-300/14 bg-red-400/[0.05] p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-200">
                            Threat Level
                        </p>

                        <Activity className="h-4 w-4 text-red-300" />
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-black/40">
                        <div className="h-full w-[72%] rounded-full bg-red-400 shadow-[0_0_15px_rgba(248,113,113,.55)]" />
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Elevated hostile activity detected.
                    </p>
                </div>
            </div>
        </aside>
    );
}