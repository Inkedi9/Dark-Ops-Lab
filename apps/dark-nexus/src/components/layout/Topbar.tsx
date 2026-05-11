"use client";

import { Activity, Database, LogOut, Shield } from "lucide-react";
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
        <nav className="sticky top-4 z-30 rounded-[1.65rem] border border-white/[0.07] bg-[#05070A]/72 px-5 py-4 shadow-[0_24px_90px_rgba(0,0,0,.55)] ring-1 ring-white/[0.045] backdrop-blur-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-blue-300/40 bg-blue-400/10 shadow-[0_0_24px_rgba(0,229,255,.25)]">
                        <Shield className="h-5 w-5 text-blue-300" />
                    </div>

                    <div>
                        <h1 className="bg-gradient-to-r from-white via-blue-300 to-green-300 bg-clip-text text-xl font-semibold uppercase tracking-[0.35em] text-transparent">
                            Dark Nexus
                        </h1>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                            Cyber Command Center
                        </p>
                    </div>
                </Link>

                <div className="flex flex-wrap items-center gap-2">
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
                                    "relative rounded-xl text-sm font-semibold uppercase tracking-[0.14em] transition-all",
                                    item.icon ? "grid h-10 w-10 place-items-center p-0" : "px-4 py-2",
                                    isActive
                                        ? "bg-white/[0.06] text-white ring-1 ring-white/[0.12]"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <span className="absolute -top-1 right-2 h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_12px_rgba(0,229,255,.9)]" />
                                )}
                                {item.icon ? (
                                    <item.icon className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    item.label
                                )}
                            </Link>
                        );
                    })}

                    <Link
                        href="/leaderboard"
                        className="rounded-xl border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-sm font-black text-blue-100 transition hover:bg-blue-400/20"
                    >
                        Ranking
                    </Link>

                    {configured && (
                        <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-2 py-1.5">
                            {loading ? (
                                <AppBadge variant="blue">Sync...</AppBadge>
                            ) : user ? (
                                <>
                                    {avatarUrl ? (
                                        <span
                                            aria-hidden="true"
                                            className="h-8 w-8 rounded-full border border-blue-300/20 bg-blue-400/[0.08] bg-cover bg-center"
                                            style={{ backgroundImage: `url(${avatarUrl})` }}
                                        />
                                    ) : (
                                        <span className="grid h-8 w-8 place-items-center rounded-full border border-blue-300/20 bg-blue-400/[0.08] font-mono text-[10px] text-blue-100">
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
                                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                                        aria-label="Sign out"
                                        title="Sign out"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth"
                                    className="rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-100 transition hover:bg-blue-400/[0.10]"
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    )}

                    <ProfileMenuButton
                        profile={profile}
                        profileHref="/profile"
                        LinkComponent={NextProfileLink}
                        onLogout={onReset}
                    />
                </div>
            </div>
        </nav>
    );
}
