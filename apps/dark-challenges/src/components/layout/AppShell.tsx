"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { getGlobalProgress } from "@/store/global-progress";
import ProgressBar from "@dark/ui/components/ProgressBar";
import ChallengeTopbar from "@/components/layout/ChallengeTopbar";
import NexusBackground from "@dark/ui/components/NexusBackground";
import ChallengeFooter from "@/components/layout/ChallengeFooter";

type AppShellProps = {
    children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
    const [global] = useState(() => getGlobalProgress());

    const pathname = usePathname();

    function navClass(href: string) {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

        return [
            "rounded-xl border px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-all duration-200",
            active
                ? "border-red-300/25 bg-red-400/10 text-red-100 shadow-[0_0_18px_rgba(248,113,113,.08)]"
                : "border-transparent text-slate-400 hover:border-red-300/20 hover:bg-white/[0.03] hover:text-red-100",
        ].join(" ");
    }

    return (
        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#05070A] text-slate-100">

            <NexusBackground />
            <ChallengeTopbar level={global.level} rank={global.rank} />

            <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-6 pt-32 pb-8">
                <div className="mb-8 max-w-3xl rounded-2xl border border-red-300/10 bg-black/25 p-4 backdrop-blur-xl">
                    <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
                        <span>Offensive operator progression</span>
                        <span className="text-red-200">{global.totalXp} XP</span>
                    </div>
                    <ProgressBar value={(global.totalXp % 1000) / 10} />
                </div>

                <nav className="mb-8 grid grid-cols-2 gap-2 md:hidden">
                    <Link href="/" className={navClass("/")}>Home</Link>
                    <Link href="/challenges" className={navClass("/challenges")}>Missions</Link>
                    <Link href="/ctf" className={navClass("/ctf")}>CTF</Link>
                    <Link href="/warzone" className={navClass("/warzone")}>Warzone</Link>
                    <Link href="/profile" className={navClass("/profile")}>Profile</Link>
                </nav>

                {children}
            </div>
            <ChallengeFooter />
        </main>
    );
}
