"use client";

import { Link, useLocation } from "react-router-dom";
import {
    BarChart3,
    BookOpen,
    FileText,
    Inbox,
    LayoutDashboard,
    ShieldCheck,
} from "lucide-react";
import DefendBackground from "../../defend/DefendBackground";

const navItems = [
    { to: "/soc", label: "Dashboard", icon: LayoutDashboard },
    { to: "/soc/alerts", label: "Alert queue", icon: Inbox },
    { to: "/soc/playbooks", label: "Playbooks", icon: BookOpen },
    { to: "/soc/reports", label: "Case reports", icon: FileText },
    { to: "/", label: "Back to Defend", icon: ShieldCheck },
];

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function SocLayout({ children }) {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#05070A] text-slate-100">
            <DefendBackground />

            <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-72 border-r border-blue-300/10 bg-[#071120]/88 px-5 py-6 backdrop-blur-2xl lg:block">
                <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(16,185,129,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.035)_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-emerald-300/20 via-transparent to-transparent" />
                <Link to="/defend" className="mb-10 flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/25 bg-blue-400/[0.08] text-blue-200">
                        <BarChart3 size={22} />
                    </div>

                    <div>
                        <p className="font-black text-white">DarkDefend SOC</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                            analyst console
                        </p>
                    </div>
                </Link>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active =
                            item.to === "/soc"
                                ? pathname === "/soc"
                                : pathname.startsWith(item.to);

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold transition",
                                    active
                                        ? "border-blue-300/25 bg-blue-400/[0.08] text-emerald-100"
                                        : "border-transparent text-slate-400 hover:border-white/[0.07] hover:bg-white/[0.035] hover:text-white"
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-6 left-5 right-5 rounded-2xl border border-blue-300/15 bg-blue-400/[0.06] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-200">
                        SOC status
                    </p>

                    <div className="mt-3 space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Alerts</span>
                            <span className="text-red-300">18 active</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Agents</span>
                            <span className="text-emerald-300">12 online</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">SIEM</span>
                            <span className="text-blue-300">stable</span>
                        </div>
                    </div>
                </div>
            </aside>

            <section className="relative z-10 min-h-screen px-5 py-8 lg:ml-72 lg:px-8 xl:px-10 2xl:px-12">
                <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-bold text-slate-300"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {children}
            </section>
        </main>
    );
}