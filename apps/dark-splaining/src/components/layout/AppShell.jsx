import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import TopbarSearch from "./TopbarSearch";
import XpBadge from "../xp/XpBadge";
import NexusBackground from "@dark/ui/components/NexusBackground";
import { Shield } from "lucide-react";

const mobileNavClass = ({ isActive }) =>
    `rounded-2xl px-4 py-3 text-sm font-semibold transition ring-1 ${isActive
        ? "bg-blue-300/[0.10] text-blue-100 ring-blue-300/[0.24]"
        : "bg-white/[0.025] text-slate-300 ring-white/[0.06] hover:bg-white/[0.055]"
    }`;

const navItems = [
    { to: "/", label: "Home" },
    { to: "/lessons", label: "Learn" },
    { to: "/tracks", label: "Tracks" },
    { to: "/resources", label: "Resources" },
    { to: "/analytics", label: "Analytics" },
];

const navLinkClass = ({ isActive }) =>
    `hidden rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition md:inline-flex ${isActive
        ? "bg-blue-300/[0.10] text-blue-200 ring-1 ring-blue-300/[0.22] shadow-[0_0_18px_rgba(0,229,255,.10)]"
        : "text-slate-400 hover:bg-white/[0.035] hover:text-blue-300 hover:ring-1 hover:ring-blue-300/[0.14]"
    }`;

export default function AppShell({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (

        <div className="relative min-h-screen overflow-x-hidden bg-[#070b16] text-slate-100">
            <NexusBackground />
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_32%)]" />
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.18]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(96,165,250,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.18)_1px,transparent_1px)] bg-[size:42px_42px]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,11,22,0.9))]" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col">
                <header className="fixed left-0 right-0 top-0 z-[100] px-4 pt-4">
                    <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-blue-400/20 bg-black/35 shadow-[0_0_42px_rgba(0,229,255,.08),0_22px_80px_rgba(0,0,0,.45)] ring-1 ring-white/[0.06] backdrop-blur-2xl">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-emerald-300/40" />

                        <div className="flex items-center gap-4 px-5 py-4 md:px-6">
                            <Link
                                to="/"
                                className="group flex shrink-0 items-center gap-3"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-300/40 bg-blue-400/10 text-blue-300 shadow-[0_0_24px_rgba(0,229,255,0.22)]">
                                    <Shield className="h-5 w-5" />
                                </span>

                                <div>
                                    <p className="bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-lg font-black uppercase tracking-[0.22em] text-transparent">
                                        DarkSplaining
                                    </p>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                        Learn • Practice • Defend
                                    </p>
                                </div>
                            </Link>

                            <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
                                <TopbarSearch />
                            </div>

                            <nav className="hidden shrink-0 items-center gap-2 md:flex">
                                <XpBadge />

                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.to === "/"}
                                        className={navLinkClass}
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}

                                <NavLink
                                    to="/profile"
                                    end
                                    aria-label="Profile"
                                    title="Profile"
                                    className={({ isActive }) =>
                                        `flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm transition ${isActive
                                            ? "bg-blue-300/[0.14] text-blue-100 ring-1 ring-blue-300/[0.35]"
                                            : "bg-white/[0.04] text-slate-300 ring-1 ring-white/[0.08] hover:text-blue-200 hover:ring-blue-300/[0.25]"
                                        }`
                                    }
                                >
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                                        <path
                                            d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        />
                                        <path
                                            d="M4.75 20a7.25 7.25 0 0 1 14.5 0"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </NavLink>

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
