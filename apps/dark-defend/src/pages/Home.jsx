import { createElement, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    ArrowRight,
    Brain,
    MailWarning,
    ShieldCheck,
    Activity,
    Radar,
    Terminal,
    ShieldAlert,
    UserCheck,
} from "lucide-react";
import Header from "../components/Header";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishBadge } from "@/components/ui/PhishBadge";
import { PhishButton } from "@/components/ui/PhishButton";
import DefenseDashboard from "@/components/DefenseDashboard";
import { scenarios } from "@/data/scenarios";
import {
    getDarkProfile,
    getDefendStats,
} from "@/lib/defend/defendProgressService";
import PhishFooter from "../components/layout/PhishFooter";

export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const incidentId = params.get("incident");

        if (incidentId) {
            navigate(`/simulator${location.search}`, { replace: true });
        }
    }, [location.search, navigate]);

    useEffect(() => {
        getDarkProfile().then(setProfile);
    }, []);

    const defendStats = {
        ...getDefendStats(profile, scenarios.length),
        totalScenarios: scenarios.length,
    };

    return (
        <>
            <Header />

            <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
                <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
                            <Activity className="h-3.5 w-3.5" />
                            Learn • Hack • Defend
                        </div>

                        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl xl:text-7xl">
                            Train your human firewall.
                            <span className="block bg-gradient-to-r from-blue-200 via-white to-green-300 bg-clip-text text-transparent">
                                Stop phishing attacks.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
                            Interactive phishing training for analysts and teams.
                            Analyze real-world emails, detect deception patterns, and build instinctive decision-making under pressure.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2 font-mono">
                            <PhishBadge tone="blue">Realistic scenarios</PhishBadge>
                            <PhishBadge tone="slate">SOC-driven training</PhishBadge>
                            <PhishBadge tone="green">Human-layer defense</PhishBadge>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/simulator">
                                <PhishButton tone="blue">
                                    Start training
                                    <ArrowRight className="h-4 w-4" />
                                </PhishButton>
                            </Link>

                            <Link to="/soc">
                                <PhishButton tone="slate">
                                    Open SOC mode
                                </PhishButton>
                            </Link>

                            <Link to="/security-check">
                                <PhishButton tone="slate">
                                    Security check
                                </PhishButton>
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <PhishPanel className="relative min-h-[560px] overflow-hidden p-6">
                            <div className="pointer-events-none absolute -right-28 -bottom-32 opacity-25 scale-90">
                                <NexusOrb />
                            </div>

                            <div className="relative z-10">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                                            Training Console
                                        </p>
                                        <h2 className="mt-2 text-2xl font-black text-white">
                                            Human-risk defense active
                                        </h2>
                                    </div>

                                    <div className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-3 text-blue-300">
                                        <MailWarning className="h-6 w-6" />
                                    </div>
                                </div>

                                <div className="mb-5 rounded-2xl border border-blue-400/15 bg-black/40 p-4 font-mono text-sm leading-7 text-green-300 backdrop-blur-xl">
                                    <p>&gt; boot_phishing_lab</p>
                                    <p className="text-blue-200">[INFO] Scenario engine connected</p>
                                    <p>[READY] Analyst training session live</p>
                                    <p className="text-amber-300">[TASK] Inspect sender, links, tone, and intent</p>
                                    <p className="text-blue-300">
                                        root@dark-defend:~${" "}
                                        <span className="terminal-cursor">█</span>
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <ScenarioCard
                                        icon={MailWarning}
                                        label="Phishing Attempt"
                                        title="Password reset request from unknown sender"
                                        tone="red"
                                    />

                                    <ScenarioCard
                                        icon={ShieldCheck}
                                        label="Trusted Message"
                                        title="Internal meeting reminder from verified domain"
                                        tone="green"
                                    />

                                    <ScenarioCard
                                        icon={Brain}
                                        label="Analyst Judgment"
                                        title="Classify the signal before the user clicks."
                                        tone="amber"
                                    />
                                </div>
                            </div>
                        </PhishPanel>
                    </div>
                </section>

                <section className="mt-14 grid gap-4 md:grid-cols-3">
                    <ConsoleModule
                        icon={Terminal}
                        title="Investigate"
                        text="Read headers, body language, links and sender context."
                    />
                    <ConsoleModule
                        icon={Radar}
                        title="Classify"
                        text="Decide legitimate, suspicious or phishing with feedback."
                        green
                    />
                    <ConsoleModule
                        icon={ShieldCheck}
                        title="Defend"
                        text="Turn each mistake into sharper human-layer detection."
                    />
                </section>

                <section className="mt-8 grid gap-5 md:grid-cols-2">
                    <DefenseModeCard
                        icon={ShieldAlert}
                        label="SOC Mode"
                        title="Investigate alerts like a blue-team analyst."
                        text="Triage suspicious activity, inspect artifacts, review indicators and classify incidents."
                        to="/soc"
                        tone="blue"
                    />

                    <DefenseModeCard
                        icon={UserCheck}
                        label="Security Check"
                        title="Measure your personal defense posture."
                        text="Answer practical questions and receive a risk score with targeted recommendations."
                        to="/security-check"
                        tone="green"
                    />
                </section>

                <DefenseDashboard profile={profile} stats={defendStats} />
            </main>
            <PhishFooter />
        </>
    );
}

function ScenarioCard({ icon, label, title, tone = "blue" }) {
    const tones = {
        red: "border-red-500/30 bg-red-500/10 text-red-300",
        green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em]">
                        {label}
                    </p>
                    <p className="mt-2 text-sm font-bold text-white">{title}</p>
                </div>

                {createElement(icon, { className: "h-5 w-5" })}
            </div>
        </div>
    );
}

function ConsoleModule({ icon, title, text, green = false }) {
    return (
        <div className="rounded-2xl border border-blue-400/20 bg-black/30 p-5 shadow-[0_0_24px_rgba(0,229,255,0.05)] backdrop-blur-xl">
            <div
                className={`mb-4 grid h-11 w-11 place-items-center rounded-xl border ${green
                    ? "border-green-300/50 text-green-300"
                    : "border-blue-300/50 text-blue-300"
                    }`}
            >
                {createElement(icon, { className: "h-5 w-5" })}
            </div>

            <h3
                className={`font-bold uppercase tracking-[0.2em] ${green ? "text-green-300" : "text-blue-300"
                    }`}
            >
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
        </div>
    );
}

function NexusOrb() {
    return (
        <div className="relative aspect-square w-[320px] animate-[pulseGlow_3s_ease-in-out_infinite] md:w-[420px]">
            <div className="absolute inset-0 rounded-full border-[3px] border-blue-300/60 border-l-transparent border-b-green-300/70 shadow-[0_0_38px_rgba(0,229,255,.28)] animate-[rotateSlow_8s_linear_infinite]" />
            <div className="absolute inset-[8%] rounded-full border border-dashed border-green-300/45 animate-[rotateReverse_13s_linear_infinite]" />
            <div className="absolute inset-[16%] rounded-full border border-blue-300/25" />
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,transparent_0deg,transparent_225deg,rgba(0,229,255,.42),rgba(57,255,20,.48),transparent_310deg)] [mask:radial-gradient(circle,transparent_56%,black_59%,black_68%,transparent_72%)] animate-[rotateSlow_3.2s_linear_infinite]" />

            <svg
                className="absolute inset-[12%] h-[76%] w-[76%]"
                viewBox="0 0 400 400"
            >
                <defs>
                    <linearGradient id="nexusGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#00e5ff" />
                        <stop offset="100%" stopColor="#39ff14" />
                    </linearGradient>

                    <filter id="nexusGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g
                    filter="url(#nexusGlow)"
                    stroke="url(#nexusGrad)"
                    strokeWidth="3"
                    fill="none"
                >
                    <polygon
                        className="dn-line"
                        points="200,64 318,132 318,268 200,336 82,268 82,132"
                    />
                    <line
                        className="dn-line"
                        x1="200"
                        y1="64"
                        x2="200"
                        y2="336"
                        style={{ animationDelay: ".2s" }}
                    />
                    <line
                        className="dn-line"
                        x1="82"
                        y1="132"
                        x2="318"
                        y2="268"
                        style={{ animationDelay: ".4s" }}
                    />
                    <line
                        className="dn-line"
                        x1="318"
                        y1="132"
                        x2="82"
                        y2="268"
                        style={{ animationDelay: ".6s" }}
                    />
                </g>

                <g
                    filter="url(#nexusGlow)"
                    fill="#05070A"
                    stroke="url(#nexusGrad)"
                    strokeWidth="8"
                >
                    {[
                        [200, 64],
                        [318, 132],
                        [318, 268],
                        [200, 336],
                        [82, 268],
                        [82, 132],
                    ].map(([cx, cy], i) => (
                        <circle
                            key={i}
                            className="dn-node"
                            cx={cx}
                            cy={cy}
                            r="12"
                            style={{ animationDelay: `${i * 0.12}s` }}
                        />
                    ))}

                    <circle className="dn-node" cx="200" cy="200" r="7" />
                </g>

                <g
                    filter="url(#nexusGlow)"
                    fill="rgba(5,7,10,.78)"
                    stroke="url(#nexusGrad)"
                    strokeWidth="8"
                >
                    <path d="M200 145 L248 166 V213 C248 247 228 275 200 289 C172 275 152 247 152 213 V166 Z" />
                    <circle cx="200" cy="210" r="14" fill="none" />
                    <path d="M200 224 L190 252 H210 Z" fill="none" />
                </g>
            </svg>
        </div>
    );
}

function DefenseModeCard({ icon, label, title, text, to, tone = "blue" }) {
    const isGreen = tone === "green";

    return (
        <Link
            to={to}
            className="group block rounded-2xl border border-blue-400/15 bg-black/30 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.035]"
        >
            <div className="mb-5 flex items-center justify-between">
                <div
                    className={`grid h-12 w-12 place-items-center rounded-xl border ${isGreen
                        ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
                        : "border-blue-300/30 bg-blue-400/10 text-blue-200"
                        }`}
                >
                    {createElement(icon, { className: "h-5 w-5" })}
                </div>

                <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </div>

            <p
                className={`font-mono text-xs font-bold uppercase tracking-[0.26em] ${isGreen ? "text-emerald-300" : "text-blue-300"
                    }`}
            >
                {label}
            </p>

            <h3 className="mt-3 text-2xl font-black text-white">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {text}
            </p>
        </Link>
    );
}