"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import AppBadge from "@dark/ui/components/AppBadge";
import ProfileMenuButton from "@dark/ui/components/ProfileMenuButton";
import type { ReactNode } from "react";


type Props = {
    level: number;
    rank: string;
};

const navItems = [
    { href: "/", label: "Home" },
    { href: "/challenges", label: "Missions" },
    { href: "/ctf", label: "CTF" },
    { href: "/warzone", label: "Warzone" },
    { href: "https://dark-nexus.vercel.app", label: "Nexus", external: true },
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

export default function ChallengeTopbar({ level, rank }: Props) {
    const pathname = usePathname();

    function handleLogout() {
        const confirmed = window.confirm("Reset local offensive profile?");
        if (!confirmed) return;

        localStorage.removeItem("dc_global_progress");
        localStorage.removeItem("darkchallenges:progress");
        localStorage.removeItem("darkchallenges:ctf-progress");
        localStorage.removeItem("darkchallenges:warzone-progress");
        window.location.assign("/");
    }

    function navClass(href: string) {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

        return [
            "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition",
            active
                ? "bg-white/[0.06] text-white ring-1 ring-white/[0.12]"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
        ].join(" ");
    }

    return (
        <header className="fixed left-0 right-0 top-0 z-[100] px-4 pt-4">
            <div className="mx-auto max-w-7xl overflow-visible rounded-[1.65rem] border border-white/[0.07] bg-[#05070A]/72 shadow-[0_24px_90px_rgba(0,0,0,.55)] ring-1 ring-white/[0.045] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/25 to-indigo-200/15" />

                <div className="flex items-center gap-4 px-5 py-4 md:px-6">
                    <Link href="/" className="group flex shrink-0 items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-blue-100 shadow-[inset_0_0_18px_rgba(96,165,250,.035)]">
                            <Shield className="h-5 w-5" />
                        </span>

                        <div>
                            <p className="font-[var(--font-display)] text-lg font-black tracking-tight text-white">
                                DarkChallenges
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                Offensive operations center
                            </p>
                        </div>
                    </Link>



                    <nav className="ml-auto hidden items-center gap-2 md:flex">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} className={navClass(item.href)}>
                                {item.label}
                            </Link>

                        ))}

                        <div className="ml-3 flex items-center gap-2">
                            <AppBadge variant="blue">LVL {level}</AppBadge>
                            <AppBadge variant="emerald">{rank.toUpperCase()}</AppBadge>
                        </div>
                        <ProfileMenuButton
                            profile={{
                                username: "Offensive Operator",
                                level,
                                rank: rank.toUpperCase(),
                            }}
                            profileHref="/profile"
                            LinkComponent={NextProfileLink}
                            onLogout={handleLogout}
                            className="ml-2"
                        />
                    </nav>
                </div>
            </div>
        </header>
    );
}
