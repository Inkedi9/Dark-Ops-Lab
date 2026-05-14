"use client";

import { Activity, Command, Database, LogOut, Radar, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileMenuButton from "@dark/ui/components/ProfileMenuButton";
import AppBadge from "@dark/ui/components/AppBadge";
import { useSupabaseBootstrapSync } from "@/hooks/useSupabaseBootstrapSync";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import type { ReactNode } from "react";

type Profile = {
    username: string;
    level: number;
    rank: string;
};

type TopbarProps = {
    profile: Profile;
    onReset: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const navItems = [
    { label: "Command", href: "/" },
    { label: "Learn", href: "/learn" },
    { label: "Practice", href: "/practice" },
    { label: "Defend", href: "/defend" },
    { label: "Telemetry", href: "/telemetry", icon: Activity },
    ...(process.env.NODE_ENV !== "production"
        ? [{ label: "Data & Sync", href: "/data-settings", icon: Database }]
        : []),
];

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

export default function Topbar({
    profile,
    onReset,
}: TopbarProps) {
    const pathname = usePathname() ?? "";
    const {
        configured,
        loading,
        user,
        avatarUrl,
        displayName,
        signOut,
    } = useSupabaseSession();
    const { status: bootstrapStatus } = useSupabaseBootstrapSync();
    const syncBadge =
        bootstrapStatus === "running"
            ? { label: "Syncing", variant: "blue" }
            : bootstrapStatus === "error"
                ? { label: "Sync issue", variant: "amber" }
                : { label: "Synced", variant: "emerald" };

    return (
        <nav className="sticky top-4 z-30 xl:-mx-6 2xl:-mx-14">
            <div className="relative overflow-visible rounded-[1.4rem] border border-blue-200/[0.12] bg-[#020611]/82 px-4 py-3 shadow-[0_26px_90px_rgba(0,0,0,.72),0_0_42px_rgba(59,130,246,.08)] ring-1 ring-white/[0.055] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] bg-[radial-gradient(circle_at_12%_0%,rgba(96,165,250,0.16),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(16,185,129,0.10),transparent_28%)]" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/55 to-emerald-200/30" />
                <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] opacity-[0.16] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="pointer-events-none absolute right-6 top-2 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-blue-200/45 xl:block">
                    NX-COMMAND / TELEMETRY OVERLAY
                </div>

                <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-blue-300/25 bg-blue-300/[0.08] shadow-[inset_0_0_18px_rgba(96,165,250,.06),0_0_30px_rgba(59,130,246,.12)]">
                            <div className="absolute inset-1 rounded-xl border border-white/[0.045]" />
                            <Shield className="relative h-5 w-5 text-blue-200 transition group-hover:text-white" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="font-[var(--font-display)] text-lg font-black uppercase tracking-[0.28em] text-white">
                                    Dark Nexus
                                </h1>
                                <span className="hidden rounded-full border border-emerald-300/18 bg-emerald-300/[0.07] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-200 sm:inline">
                                    Live
                                </span>
                            </div>
                            <p className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                <Command className="h-3 w-3 text-blue-300/80" />
                                Operator ecosystem command
                            </p>
                        </div>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end xl:flex-nowrap">
                        <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-white/[0.065] bg-white/[0.035] p-1 shadow-[inset_0_0_18px_rgba(255,255,255,.018)]">
                            {navItems.map((item) => {
                                const isActive =
                                    item.href === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-label={item.label}
                                        title={item.label}
                                        className={cn(
                                            "relative rounded-xl text-xs font-black uppercase tracking-[0.14em] transition-all",
                                            item.icon ? "grid h-9 w-9 place-items-center p-0" : "px-3 py-2",
                                            isActive
                                                ? "bg-blue-300/[0.12] text-blue-50 shadow-[inset_0_0_16px_rgba(96,165,250,.05)] ring-1 ring-blue-200/20"
                                                : "text-slate-400 hover:bg-white/[0.045] hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <span className="absolute -top-1 right-2 h-1.5 w-1.5 rounded-full bg-blue-200 shadow-[0_0_12px_rgba(147,197,253,.9)]" />
                                        )}
                                        {item.icon ? (
                                            <item.icon className="h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            item.label
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <Link
                            href="/leaderboard"
                            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-violet-300/18 bg-violet-300/[0.075] px-4 text-xs font-black uppercase tracking-[0.14em] text-violet-100 transition hover:border-violet-200/28 hover:bg-violet-300/[0.12]"
                        >
                            <Sparkles className="h-4 w-4" />
                            Ranking
                        </Link>

                        {configured && (
                            <div className="flex h-11 items-center gap-2 rounded-2xl border border-emerald-300/12 bg-emerald-300/[0.055] px-2.5">
                                {loading ? (
                                    <AppBadge variant="blue">Sync...</AppBadge>
                                ) : user ? (
                                    <>
                                        {avatarUrl ? (
                                            <span
                                                aria-hidden="true"
                                                className="h-8 w-8 rounded-xl border border-blue-300/20 bg-blue-400/[0.08] bg-cover bg-center"
                                                style={{ backgroundImage: `url(${avatarUrl})` }}
                                            />
                                        ) : (
                                            <span className="grid h-8 w-8 place-items-center rounded-xl border border-blue-300/20 bg-blue-400/[0.08] font-mono text-[10px] text-blue-100">
                                                NX
                                            </span>
                                        )}
                                        <span className="hidden max-w-28 truncate text-xs font-bold text-slate-200 md:inline">
                                            {displayName || "Synced"}
                                        </span>
                                        <AppBadge variant={syncBadge.variant}>{syncBadge.label}</AppBadge>
                                        <button
                                            type="button"
                                            onClick={() => void signOut()}
                                            className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                                            aria-label="Sign out"
                                            title="Sign out"
                                        >
                                            <LogOut className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/auth"
                                        className="inline-flex h-8 items-center rounded-xl px-3 text-xs font-black uppercase tracking-[0.14em] text-blue-100 transition hover:bg-blue-400/[0.10]"
                                    >
                                        Sign in
                                    </Link>
                                )}
                            </div>
                        )}

                        <div className="flex h-11 items-center gap-2 rounded-2xl border border-white/[0.065] bg-black/20 px-2">
                            <Radar className="hidden h-4 w-4 text-blue-200/80 sm:block" />
                            <ProfileMenuButton
                                profile={profile}
                                profileHref="/operator"
                                LinkComponent={NextProfileLink}
                                onLogout={onReset}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
