"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, MailWarning, Radar, Shield, ShieldCheck } from "lucide-react";
import ProfileMenuButton from "@dark/ui/components/ProfileMenuButton";
import { profileService } from "../lib/profile/profileService";

function NextProfileLink({ to, children, ...props }) {
    return (
        <Link href={to} {...props}>
            {children}
        </Link>
    );
}

export default function Header() {
    const [profile, setProfile] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        let mounted = true;
        profileService.getProfile().then((storedProfile) => {
            if (mounted) setProfile(storedProfile);
        });
        return () => { mounted = false; };
    }, []);

    async function handleLogout() {
        const confirmed = window.confirm("Reset local operator profile?");
        if (!confirmed) return;
        await profileService.resetProfile();
        setProfile(null);
        window.location.assign("/defend");
    }

    const navItems = [
        { href: "/defend", label: "Home", icon: Activity, exact: true },
        { href: "/defend/simulator", label: "Simulator", icon: MailWarning },
        { href: "/defend/results", label: "Results", icon: BarChart3 },
    ];

    function navClass(href, exact) {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return [
            "relative inline-flex h-9 items-center rounded-xl px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition",
            isActive
                ? "bg-emerald-300/[0.12] text-emerald-50 ring-1 ring-emerald-300/22 shadow-[inset_0_0_16px_rgba(16,185,129,.055)]"
                : "text-slate-400 hover:bg-white/[0.045] hover:text-white",
        ].join(" ");
    }

    const profileIsActive = pathname.startsWith("/defend/defense-profile");

    return (
        <header className="sticky top-0 z-50 px-4 pt-4 md:px-8 xl:px-6">
            <div className="relative mx-auto flex max-w-[92rem] items-center justify-between overflow-visible rounded-[1.4rem] border border-emerald-200/[0.13] bg-[#03100d]/84 px-4 py-3 shadow-[0_26px_90px_rgba(0,0,0,.70),0_0_38px_rgba(16,185,129,.075)] ring-1 ring-white/[0.05] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] bg-[radial-gradient(circle_at_12%_0%,rgba(16,185,129,0.14),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(96,165,250,0.08),transparent_28%)]" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/48 to-blue-200/24" />
                <div className="pointer-events-none absolute right-6 top-2 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-emerald-200/42 xl:block">
                    DD-SOC / SIGNAL CONSOLE
                </div>
                <Link href="/defend" className="relative flex items-center gap-3">
                    <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/24 bg-emerald-300/[0.075] text-emerald-200 shadow-[inset_0_0_18px_rgba(16,185,129,.055),0_0_26px_rgba(16,185,129,.10)]">
                        <span className="absolute inset-1 rounded-xl border border-white/[0.045]" />
                        <ShieldCheck className="relative h-5 w-5" />
                    </span>
                    <span>
                        <span className="block text-xl font-black uppercase tracking-[0.26em] text-white">
                            Dark <span className="text-blue-300">Defend</span>
                        </span>
                        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                            <Shield className="h-3 w-3 text-emerald-300/80" />
                            Analyst defense console
                        </span>
                    </span>
                </Link>

                <nav className="relative hidden items-center gap-1 rounded-2xl border border-white/[0.065] bg-white/[0.035] p-1 shadow-[inset_0_0_18px_rgba(255,255,255,.018)] md:flex">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href} className={navClass(item.href, item.exact)} title={item.label}>
                                <Icon className="h-4 w-4 xl:mr-2" />
                                <span className="hidden xl:inline">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="relative flex items-center gap-3">
                    <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] text-slate-400 lg:flex">
                        <span className="text-emerald-300">Signals live</span>
                        <span>Confidence 92%</span>
                    </div>

                    <Link
                        href="/defend/defense-profile"
                        aria-label="Open defense profile"
                        className={[
                            "grid h-11 w-11 place-items-center rounded-2xl border transition",
                            profileIsActive
                                ? "border-emerald-300/45 bg-emerald-300/[0.12] text-emerald-100 shadow-[0_0_22px_rgba(16,185,129,0.14)]"
                                : "border-emerald-300/18 bg-emerald-300/[0.06] text-emerald-200 hover:border-emerald-300/35 hover:bg-emerald-300/[0.10]",
                        ].join(" ")}
                    >
                        <Radar className="h-5 w-5" />
                    </Link>

                    <ProfileMenuButton
                        profile={profile}
                        profileHref="/operator"
                        LinkComponent={NextProfileLink}
                        onLogout={handleLogout}
                    />
                </div>
            </div>
        </header>
    );
}
