import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import TopbarSearch from "./TopbarSearch";
import XpBadge from "../xp/XpBadge";
import NexusBackground from "@dark/ui/components/NexusBackground";
import ProfileMenuButton from "@dark/ui/components/ProfileMenuButton";
import { profileService } from "@dark/profile/profileService";
import { BarChart3, BookOpen, Database, GraduationCap, Library, Route, Search, Shield } from "lucide-react";
import { getNexusDataSettingsSyncUrl } from "../../services/nexusProgressBridge";

const navItems = [
    { to: "/", label: "Home", icon: BookOpen },
    { to: "/lessons", label: "Learn", icon: GraduationCap },
    { to: "/tracks", label: "Tracks", icon: Route },
    { to: "/resources", label: "Resources", icon: Library },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const navLinkClass = ({ isActive }) =>
    `relative hidden h-9 items-center rounded-xl px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition md:inline-flex ${isActive
        ? "bg-blue-300/[0.10] text-blue-50 ring-1 ring-blue-300/[0.20] shadow-[inset_0_0_16px_rgba(96,165,250,.05)]"
        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
    }`;

export default function AppShell({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        let mounted = true;

        profileService.getProfile().then((storedProfile) => {
            if (mounted) setProfile(storedProfile);
        });

        return () => {
            mounted = false;
        };
    }, []);

    async function handleLogout() {
        const confirmed = window.confirm("Reset local operator profile?");
        if (!confirmed) return;

        await profileService.resetProfile();
        setProfile(null);
        window.location.assign("/");
    }

    function handleNexusTelemetrySync(event) {
        event.preventDefault();
        setIsMobileMenuOpen(false);

        window.open(
            getNexusDataSettingsSyncUrl(),
            "_blank",
            "noopener,noreferrer",
        );
    }

    return (

        <div className="relative min-h-screen overflow-x-hidden bg-[#080d1a] text-slate-100">
            <NexusBackground />

            <div className="relative z-10 flex min-h-screen flex-col">
                <header className="fixed left-0 right-0 top-0 z-[100] px-4 pt-4 xl:px-6">
                    <div className="relative mx-auto max-w-[92rem] overflow-visible rounded-[1.4rem] border border-blue-200/[0.12] bg-[#050913]/82 shadow-[0_24px_90px_rgba(0,0,0,.58),0_0_34px_rgba(96,165,250,.055)] ring-1 ring-white/[0.05] backdrop-blur-2xl">
                        <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] bg-[radial-gradient(circle_at_12%_0%,rgba(96,165,250,0.12),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(16,185,129,0.08),transparent_28%)]" />
                        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/42 to-emerald-200/24" />
                        <div className="pointer-events-none absolute right-6 top-2 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-blue-200/42 xl:block">
                            DS-LEARN / GUIDED MODE
                        </div>

                        <div className="relative flex items-center gap-4 px-5 py-3.5 md:px-6">
                            <Link
                                to="/"
                                className="group flex shrink-0 items-center gap-3"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-blue-300/24 bg-blue-300/[0.075] text-blue-200 shadow-[inset_0_0_18px_rgba(96,165,250,.055),0_0_26px_rgba(96,165,250,.10)]">
                                    <span className="absolute inset-1 rounded-xl border border-white/[0.045]" />
                                    <GraduationCap className="relative h-5 w-5" />
                                </span>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-lg font-black uppercase tracking-[0.22em] text-transparent">
                                            DarkSplaining
                                        </p>
                                        <span className="hidden rounded-full border border-emerald-300/16 bg-emerald-300/[0.065] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-200 sm:inline">
                                            Study
                                        </span>
                                    </div>
                                    <p className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                        <Shield className="h-3 w-3 text-blue-300/80" />
                                        Guided security learning
                                    </p>
                                </div>
                            </Link>

                            <div className="hidden min-w-0 flex-1 items-center justify-center px-2 lg:flex">
                                <TopbarSearch />
                            </div>

                            <nav className="hidden shrink-0 items-center gap-2 md:flex">
                                <div className="flex h-11 items-center rounded-2xl border border-emerald-300/12 bg-emerald-300/[0.05] px-2">
                                    <XpBadge />
                                </div>

                                <div className="flex items-center gap-1 rounded-2xl border border-white/[0.065] bg-white/[0.035] p-1 shadow-[inset_0_0_18px_rgba(255,255,255,.018)]">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                end={item.to === "/"}
                                                className={navLinkClass}
                                                aria-label={item.label}
                                                title={item.label}
                                            >
                                                <Icon className="h-4 w-4 xl:mr-2" />
                                                <span className="hidden xl:inline">{item.label}</span>
                                            </NavLink>
                                        );
                                    })}
                                </div>

                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleNexusTelemetrySync}
                                    className="grid h-11 w-11 place-items-center rounded-2xl border border-blue-300/14 bg-blue-300/[0.055] text-blue-100 transition hover:border-blue-200/28 hover:bg-blue-300/[0.10]"
                                    aria-label="Sync progress to Nexus telemetry"
                                    title="Sync progress to Nexus telemetry"
                                >
                                    <Database className="h-4 w-4" />
                                </a>

                                <ProfileMenuButton
                                    profile={profile}
                                    profileHref="/profile"
                                    LinkComponent={Link}
                                    onLogout={handleLogout}
                                />

                                <NavLink
                                    to="/lessons/sql-injection"
                                    className={({ isActive }) =>
                                        `rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${isActive
                                            ? "bg-emerald-300/[0.14] text-emerald-100 ring-1 ring-emerald-300/[0.30]"
                                            : "bg-emerald-300/[0.08] text-emerald-200 ring-1 ring-emerald-300/[0.20] hover:bg-emerald-300/[0.13] hover:ring-emerald-300/[0.32]"
                                        }`
                                    }
                                >
                                    Start
                                </NavLink>
                            </nav>

                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen((current) => !current)}
                                className="ml-auto rounded-full bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-slate-300 ring-1 ring-white/[0.08] transition hover:text-blue-200 hover:ring-blue-300/[0.25] md:hidden"
                            >
                                {isMobileMenuOpen ? "Close" : "Menu"}
                            </button>
                        </div>

                        {isMobileMenuOpen && (
                            <div className="px-5 pb-4 md:hidden">
                                <div className="grid gap-3 border-t border-blue-300/10 pt-4">
                                    <TopbarSearch
                                        variant="mobile"
                                        onNavigate={() => setIsMobileMenuOpen(false)}
                                    />

                                    <div className="flex items-center gap-2 rounded-2xl border border-blue-300/10 bg-blue-300/[0.04] px-4 py-3 text-sm font-bold text-blue-100">
                                        <Search className="h-4 w-4" />
                                        Learning search active
                                    </div>

                                    <div className="grid gap-2">
                                        {navItems.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                end={item.to === "/"}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={({ isActive }) =>
                                                    `rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive
                                                        ? "bg-blue-300/[0.10] text-blue-100 ring-1 ring-blue-300/[0.22]"
                                                        : "bg-white/[0.03] text-slate-300 ring-1 ring-white/[0.06]"
                                                    }`
                                                }
                                            >
                                                {item.label}
                                            </NavLink>
                                        ))}

                                        <NavLink
                                            to="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="rounded-2xl bg-white/[0.03] px-4 py-3 text-sm font-bold text-slate-300 ring-1 ring-white/[0.06]"
                                        >
                                            Profile
                                        </NavLink>

                                        <a
                                            href="#"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={handleNexusTelemetrySync}
                                            className="rounded-2xl bg-white/[0.03] px-4 py-3 text-left text-sm font-bold text-slate-300 ring-1 ring-white/[0.06]"
                                        >
                                            Sync Nexus telemetry
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="motion-page mx-auto w-full max-w-7xl flex-1 px-5 pb-8 pt-28 md:px-8">
                    {children}
                </main>

                <footer className="bg-[#050913]/80 ring-1 ring-white/[0.06] backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
                        <div className="grid gap-6 md:grid-cols-2 md:items-center">
                            <div>
                                <p className="text-lg font-extrabold text-white">
                                    DarkSplaining
                                </p>
                                <p className="mt-2 text-sm text-slate-400">
                                    Built for safe cyber security learning. Simple concepts,
                                    visual explanations and interactive mocked exercises.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 md:items-end">
                                <p className="font-mono text-xs text-emerald-300">
                                    FRONTEND ONLY • SAFE SIMULATION
                                </p>
                                <p className="text-xs text-slate-500">
                                    No real systems are targeted or tested.
                                </p>
                                <a
                                    href="https://discord.gg/duAuwShHf"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-blue-300/25 bg-blue-300/10 px-5 py-3 font-bold text-blue-100 transition hover:bg-blue-300/15 hover:shadow-[0_0_24px_rgba(0,229,255,.35)]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="h-5 w-5 fill-indigo-300"
                                    >
                                        <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.445.865-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.2 12.2 0 0 0-.618-1.249.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.028C.534 9.046-.319 13.58.099 18.058a.082.082 0 0 0 .031.056c2.053 1.508 4.041 2.423 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 12.3 12.3 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.011c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.007.128c-.598.342-1.22.644-1.873.891a.076.076 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029c1.961-.607 3.95-1.522 6.002-3.03a.077.077 0 0 0 .031-.055c.5-5.177-.533-9.748-3.581-13.689a.06.06 0 0 0-.031-.028ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419Z" />
                                    </svg>

                                    Join Discord
                                </a>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
                            © {new Date().getFullYear()} Darksplaining — Educational project
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
