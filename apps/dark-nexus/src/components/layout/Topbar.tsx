"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileMenuButton from "@dark/ui/components/ProfileMenuButton";
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
    ...(process.env.NODE_ENV !== "production"
        ? [{ label: "Data", href: "/data-settings" }]
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
                                className={cn(
                                    "relative rounded-xl px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] transition-all",
                                    isActive
                                        ? "bg-white/[0.06] text-white ring-1 ring-white/[0.12]"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <span className="absolute -top-1 right-2 h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_12px_rgba(0,229,255,.9)]" />
                                )}
                                {item.label}
                            </Link>
                        );
                    })}

                    <Link
                        href="/leaderboard"
                        className="rounded-xl border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-sm font-black text-blue-100 transition hover:bg-blue-400/20"
                    >
                        Ranking
                    </Link>

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
