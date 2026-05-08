import { NavLink } from "react-router-dom";
import { Shield, User } from "lucide-react";

export default function Header() {
    const navClass = ({ isActive }) =>
        [
            "relative rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] transition",
            isActive
                ? "border-blue-300/40 bg-blue-400/10 text-blue-200 shadow-[0_0_22px_rgba(0,229,255,0.12)]"
                : "border-transparent text-slate-400 hover:border-blue-400/20 hover:bg-blue-400/5 hover:text-blue-200",
        ].join(" ");
    const profileClass = ({ isActive }) =>
        [
            "grid h-10 w-10 place-items-center rounded-xl border transition",
            isActive
                ? "border-blue-300/50 bg-blue-400/15 text-blue-100 shadow-[0_0_22px_rgba(0,229,255,0.14)]"
                : "border-blue-400/25 bg-blue-400/10 text-blue-200 hover:border-blue-300/45 hover:bg-blue-400/15",
        ].join(" ");

    return (
        <header className="sticky top-0 z-50 px-4 pt-4 md:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-blue-400/20 bg-black/35 px-4 py-3 shadow-[0_0_40px_rgba(0,229,255,0.08)] backdrop-blur-xl">
                <NavLink
                    to="/"
                    className="flex items-center gap-3"
                >
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-300/40 bg-blue-400/10 text-blue-300 shadow-[0_0_24px_rgba(0,229,255,0.22)]">
                        <Shield className="h-5 w-5" />
                    </span>
                    <span>
                        <span className="block text-xl font-semibold uppercase tracking-[0.32em] text-white">
                            Dark <span className="text-blue-300">Defend</span>
                        </span>
                        <span className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                            Learn • Hack • Defend
                        </span>
                    </span>
                </NavLink>

                <nav className="hidden items-center gap-2 md:flex">
                    <NavLink to="/" className={navClass}>
                        Home
                    </NavLink>
                    <NavLink to="/simulator" className={navClass}>
                        Simulator
                    </NavLink>
                    <NavLink to="/results" className={navClass}>
                        Results
                    </NavLink>
                    <NavLink to="/about" className={navClass}>
                        About
                    </NavLink>
                </nav>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] text-slate-400 lg:flex">
                        <span className="text-green-300">System Secure •</span>
                        <span>AES-256</span>
                        <span>Connected</span>
                    </div>

                    <NavLink
                        to="/profile"
                        aria-label="Open profile"
                        className={profileClass}
                    >
                        <User className="h-5 w-5" />
                    </NavLink>
                </div>
            </div>
        </header>
    );
}
