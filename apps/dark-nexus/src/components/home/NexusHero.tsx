import Link from "next/link";
import { Crosshair, Database, Flag, Flame, RadioTower, ShieldAlert } from "lucide-react";
import AppButton from "@dark/ui/components/AppButton";
import AppBadge from "@dark/ui/components/AppBadge";
import PanelCard from "@dark/ui/components/PanelCard";

type NexusHeroProps = {
    nextMission?: {
        slug: string;
        title: string;
    };
    global?: {
        level: number;
    };
    completion?: number;
};

export function NexusHero({ nextMission, global, completion = 0 }: NexusHeroProps) {
    return (

        <section className="relative grid min-h-[610px] items-center gap-8 pt-6 lg:grid-cols-[1.02fr_0.98fr] xl:gap-12">
            <div className="pointer-events-none absolute inset-x-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-red-200/25 to-transparent lg:block" />
            <div className="pointer-events-none absolute left-[-1rem] top-28 hidden h-40 w-px bg-gradient-to-b from-transparent via-amber-200/20 to-transparent lg:block" />

            <div className="pt-4">
                <div className="mt-4 flex flex-wrap gap-2">
                    <AppBadge variant="danger">Offensive labs</AppBadge>
                    <AppBadge variant="amber">Mission briefing</AppBadge>
                    <AppBadge variant="emerald">Safe targets</AppBadge>
                </div>

                <p className="mb-5 mt-6 font-mono text-sm uppercase tracking-[0.45em] text-red-200">
                    DarkChallenges / tactical operation deck
                </p>

                <h1 className="max-w-5xl text-6xl font-black leading-[0.92] tracking-tight md:text-8xl">
                    <span className="text-white">Real attack logic.</span>
                    <span className="block text-slate-300">Launch the next</span>
                    <span className="block bg-gradient-to-b from-red-100 via-amber-200 to-slate-400 bg-clip-text text-transparent">
                        operation.
                    </span>
                </h1>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                    Enter safe offensive operations: recon the target, exploit the weakness,
                    capture proof, and build real attacker intuition without touching real systems.
                </p>

                <div className="mt-12 flex flex-wrap gap-4">
                    <AppButton to="/challenges" variant="danger">
                        Launch your first exploit →
                    </AppButton>
                    <AppButton to="/challenges/warzone" variant="secondary">
                        Enter warzone
                    </AppButton>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <OperationMeta icon={Crosshair} label="Objective" value={nextMission?.title || "Mission board"} tone="danger" />
                    <OperationMeta icon={Flame} label="Clearance" value={`LVL ${global?.level ?? 1}`} tone="amber" />
                    <OperationMeta icon={Database} label="Campaign" value={`${completion}% cleared`} tone="blue" />
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    <ModePill
                        icon={<Crosshair className="h-5 w-5" />}
                        title="Missions"
                        text="Focused exploit labs."
                        href="/challenges"
                    />
                    <ModePill
                        icon={<Flag className="h-5 w-5" />}
                        title="CTF"
                        text="Chained flag scenarios."
                        href="/challenges/ctf"
                    />
                    <ModePill
                        icon={<RadioTower className="h-5 w-5" />}
                        title="Warzone"
                        text="Live hostile simulations."
                        href="/challenges/warzone"
                        danger
                    />
                </div>
            </div>

            <PanelCard
                variant="danger"
                accent="danger"
                hover
                className="relative overflow-hidden border-red-300/16 bg-[radial-gradient(circle_at_50%_8%,rgba(248,113,113,0.16),transparent_36%),radial-gradient(circle_at_88%_16%,rgba(251,191,36,0.10),transparent_28%),linear-gradient(180deg,rgba(18,5,8,0.96),rgba(3,7,18,0.88))] p-5 md:p-6"
            >
                <div className="pointer-events-none absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-red-200/50 to-amber-200/30" />
                <div className="pointer-events-none absolute right-5 top-5 hidden rounded-2xl border border-red-300/12 bg-red-300/[0.05] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-red-100 lg:block">
                    Target Core / Armed
                </div>

                <div className="relative z-10 flex h-full min-h-[480px] flex-col items-center justify-center">
                    <NexusOrb />

                    <div className="mt-8 text-center">
                        <p className="font-mono text-xs uppercase tracking-[0.45em] text-slate-500">
                            Operation Core
                        </p>

                        <h2 className="mt-3 bg-gradient-to-r from-white via-red-200 to-amber-200 bg-clip-text text-5xl font-black uppercase tracking-[0.22em] text-transparent md:text-6xl">
                            Armed
                        </h2>

                        <p className="mt-4 font-mono text-sm uppercase tracking-[0.32em] text-slate-400">
                            Recon <span className="text-red-300">/</span> Exploit{" "}
                            <span className="text-amber-300">/</span> Capture
                        </p>
                    </div>
                    {nextMission && (
                        <TargetBriefing
                            nextMission={nextMission}
                            global={global}
                            completion={completion}
                        />
                    )}
                </div>
            </PanelCard>
        </section>

    );
}

function OperationMeta({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    tone: "danger" | "amber" | "blue";
}) {
    const classes =
        tone === "danger"
            ? "border-red-300/16 bg-red-300/[0.055] text-red-200"
            : tone === "amber"
                ? "border-amber-300/16 bg-amber-300/[0.055] text-amber-200"
                : "border-blue-300/14 bg-blue-300/[0.045] text-blue-200";

    return (
        <div className={`rounded-2xl border p-4 ${classes}`}>
            <div className="mb-3 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
            </div>
            <p className="line-clamp-2 text-sm font-black text-white">{value}</p>
        </div>
    );
}

function ModePill({
    icon,
    title,
    text,
    href,
    danger = false,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
    href: string;
    danger?: boolean;
}) {
    return (
        <Link
            href={href}
            className={[
                "group rounded-2xl border bg-black/25 p-4 backdrop-blur-xl transition hover:-translate-y-1",
                danger
                    ? "border-red-300/14 hover:border-red-300/24 hover:shadow-[0_18px_60px_rgba(0,0,0,.45)]"
                    : "border-blue-300/12 hover:border-blue-300/22 hover:shadow-[0_18px_60px_rgba(0,0,0,.45)]",
            ].join(" ")}
        >
            <div
                className={[
                    "mb-3 flex h-11 w-11 items-center justify-center rounded-xl border bg-black/35",
                    danger
                        ? "border-red-300/18 text-red-200"
                        : "border-blue-300/18 text-blue-200",
                ].join(" ")}
            >
                {icon}
            </div>

            <h3 className="font-black text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
        </Link>
    );
}

function NexusOrb() {
    return (
        <div className="relative aspect-square w-[260px] animate-[pulseGlow_3s_ease-in-out_infinite] md:w-[340px]">
            <div className="absolute inset-0 rounded-full border-[3px] border-red-300/60 border-b-amber-300/70 border-l-transparent animate-[rotateSlow_8s_linear_infinite] shadow-[0_0_38px_rgba(248,113,113,.30)]" />
            <div className="absolute inset-[8%] rounded-full border border-dashed border-amber-300/45 animate-[rotateReverse_13s_linear_infinite]" />
            <div className="absolute inset-[16%] rounded-full border border-red-300/25" />
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,transparent_0deg,transparent_225deg,rgba(248,113,113,.42),rgba(251,191,36,.48),transparent_310deg)] [mask:radial-gradient(circle,transparent_56%,black_59%,black_68%,transparent_72%)] animate-[rotateSlow_3.2s_linear_infinite]" />

            <svg className="absolute inset-[12%] w-[76%] h-[76%]" viewBox="0 0 400 400">
                <defs>
                    <linearGradient id="nexusGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                    <filter id="nexusGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <g filter="url(#nexusGlow)" stroke="url(#nexusGrad)" strokeWidth="3" fill="none">
                    <polygon className="dn-line" points="200,64 318,132 318,268 200,336 82,268 82,132" />
                    <line className="dn-line" x1="200" y1="64" x2="200" y2="336" style={{ animationDelay: ".2s" }} />
                    <line className="dn-line" x1="82" y1="132" x2="318" y2="268" style={{ animationDelay: ".4s" }} />
                    <line className="dn-line" x1="318" y1="132" x2="82" y2="268" style={{ animationDelay: ".6s" }} />
                </g>
                <g filter="url(#nexusGlow)" fill="#05070A" stroke="url(#nexusGrad)" strokeWidth="8">
                    {[[200, 64], [318, 132], [318, 268], [200, 336], [82, 268], [82, 132]].map(([cx, cy], i) => (
                        <circle key={i} className="dn-node" cx={cx} cy={cy} r="12" style={{ animationDelay: `${i * .12}s` }} />
                    ))}
                    <circle className="dn-node" cx="200" cy="200" r="7" />
                </g>
                <g filter="url(#nexusGlow)" fill="rgba(5,7,10,.78)" stroke="url(#nexusGrad)" strokeWidth="8">
                    <path d="M200 96 L232 152 L296 166 L252 214 L258 282 L200 254 L142 282 L148 214 L104 166 L168 152 Z" opacity=".28" />
                    <path d="M200 145 L248 166 V213 C248 247 228 275 200 289 C172 275 152 247 152 213 V166 Z" />
                    <circle cx="200" cy="210" r="14" fill="none" />
                    <path d="M200 224 L190 252 H210 Z" fill="none" />
                </g>
            </svg>
        </div>
    );
}

function TargetBriefing({
    nextMission,
    global,
    completion,
}: Required<Pick<NexusHeroProps, "nextMission">> &
    Pick<NexusHeroProps, "global" | "completion">) {
    return (
        <div className="mt-6 w-full rounded-2xl border border-red-300/14 bg-black/35 p-4 text-left shadow-[inset_0_0_24px_rgba(248,113,113,.035)]">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-200">
                Target briefing
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
                {nextMission.title}
            </h2>

            <div className="mt-5 grid gap-2 text-sm">
                <BriefRow label="Status" value="Unsolved" />
                <BriefRow label="Reward" value="+50 XP" />
                <BriefRow label="Operator level" value={`LVL ${global?.level ?? 1}`} />
                <BriefRow label="Campaign" value={`${completion}%`} />
            </div>

            <div className="mt-5 rounded-xl border border-red-300/12 bg-red-400/[0.045] p-4">
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-red-200">
                    <ShieldAlert className="h-4 w-4" />
                    Recon signals
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    <li>› Authentication surface detected</li>
                    <li>› User-controlled input available</li>
                    <li>› Validation weakness suspected</li>
                </ul>
            </div>

            <AppButton
                to={`/challenges/${nextMission.slug}`}
                variant="danger"
                className="mt-5 w-full"
            >
                Start breach →
            </AppButton>
        </div>
    );
}

function BriefRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <span className="text-slate-500">{label}</span>
            <span className="font-mono text-slate-200">{value}</span>
        </div>
    );
}
