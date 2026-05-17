"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crosshair, Flag, Flame, RadioTower, Shield, Swords } from "lucide-react";
import AppBadge from "@dark/ui/components/AppBadge";
import ProfileMenuButton from "@dark/ui/components/ProfileMenuButton";
import type { ReactNode } from "react";

type Props = {
    level: number;
    rank: string;
};

const navItems = [
    { href: "/challenges/missions", label: "Missions", icon: Crosshair },
    { href: "/challenges/ctf", label: "CTF", icon: Flag },
    { href: "/challenges/warzone", label: "Warzone", icon: Flame },
    { href: "/", label: "Nexus", icon: RadioTower },
];

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function NextProfileLink({
    to,
    children,
    ...props
}: {
    to: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <Link href={to} {...props}>
            {children}
        </Link>
    );
}

export default function ChallengeTopbar({ level, rank }: Props) {
    const pathname = usePathname();

    function handleLogout() {
        const confirmed = window.confirm("Reset local offensive profile?");
        if (!confirmed) return;

        localStorage.removeItem("dc_global_progress");
        localStorage.removeItem("darkchallenges:progress");
        localStorage.removeItem("darkchallenges:ctf-progress");
        localStorage.removeItem("darkchallenges:warzone-progress");
        window.location.assign("/challenges");
    }

    function navClass(href: string) {
        const active = (pathname?.startsWith(href) ?? false) && (href !== "/" || pathname === "/");

        return [
            "relative rounded-xl text-xs font-black uppercase tracking-[0.14em] transition-all",
            active
                ? "bg-red-300/[0.13] text-red-50 shadow-[inset_0_0_16px_rgba(248,113,113,.055)] ring-1 ring-red-200/24"
                : "text-slate-400 hover:bg-white/[0.045] hover:text-white",
        ].join(" ");
    }

    return (
        <header className="fixed left-0 right-0 top-0 z-[100] px-4 pt-4 xl:px-6">
            <div className="relative mx-auto max-w-[92rem] overflow-visible rounded-[1.4rem] border border-red-200/[0.13] bg-[#080309]/84 shadow-[0_26px_90px_rgba(0,0,0,.72),0_0_42px_rgba(248,113,113,.08)] ring-1 ring-white/[0.05] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] bg-[radial-gradient(circle_at_12%_0%,rgba(248,113,113,0.16),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(251,191,36,0.10),transparent_28%)]" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-red-200/50 to-amber-200/30" />
                <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] opacity-[0.15] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="pointer-events-none absolute right-6 top-2 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-red-200/45 xl:block">
                    DC-OPS / MISSION OVERLAY
                </div>

                <div className="relative flex items-center gap-4 px-5 py-3.5 md:px-6">
                    <Link href="/challenges" className="group flex shrink-0 items-center gap-3">
                        <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-red-300/25 bg-red-300/[0.08] text-red-100 shadow-[inset_0_0_18px_rgba(248,113,113,.06),0_0_30px_rgba(248,113,113,.12)]">
                            <span className="absolute inset-1 rounded-xl border border-white/[0.045]" />
                            <Swords className="relative h-5 w-5 transition group-hover:text-white" />
                        </span>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                            <p className="font-[var(--font-display)] text-lg font-black uppercase tracking-[0.22em] text-white">
                                DarkChallenges
                            </p>
                                <span className="hidden rounded-full border border-amber-300/18 bg-amber-300/[0.07] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200 sm:inline">
                                    Armed
                                </span>
                            </div>
                            <p className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                <Shield className="h-3 w-3 text-red-300/80" />
                                Offensive operations center
                            </p>
                        </div>
                    </Link>

                    <nav className="ml-auto hidden items-center gap-2 md:flex">
                        <div className="flex items-center gap-1 rounded-2xl border border-white/[0.065] bg-white/[0.035] p-1 shadow-[inset_0_0_18px_rgba(255,255,255,.018)]">
                            {navItems.map((item) => {
                                const active = (pathname?.startsWith(item.href) ?? false) && (item.href !== "/" || pathname === "/");
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-label={item.label}
                                        title={item.label}
                                        className={cn(navClass(item.href), "grid h-9 w-9 place-items-center p-0 xl:w-auto xl:px-3")}
                                    >
                                        {active && (
                                            <span className="absolute -top-1 right-2 h-1.5 w-1.5 rounded-full bg-red-200 shadow-[0_0_12px_rgba(254,202,202,.9)]" />
                                        )}
                                        <Icon className="h-4 w-4 xl:mr-2" aria-hidden="true" />
                                        <span className="hidden xl:inline">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="ml-2 flex h-11 items-center gap-2 rounded-2xl border border-amber-300/12 bg-amber-300/[0.055] px-2.5">
                            <AppBadge variant="amber">LVL {level}</AppBadge>
                            <AppBadge variant="danger">{rank.toUpperCase()}</AppBadge>
                        </div>
                        <div className="flex h-11 items-center rounded-2xl border border-white/[0.065] bg-black/20 px-2">
                            <ProfileMenuButton
                                profile={{
                                    username: "Offensive Operator",
                                    level,
                                    rank: rank.toUpperCase(),
                                }}
                                profileHref="/operator"
                                LinkComponent={NextProfileLink}
                                onLogout={handleLogout}
                            />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
