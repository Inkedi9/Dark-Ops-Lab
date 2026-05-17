import { createElement } from "react";
import AppBadge from "@dark/ui/components/AppBadge";
import {
    BookOpenCheck,
    Bug,
    Flag,
    KeyRound,
    Layers,
    LockKeyhole,
    Route,
    ShieldCheck,
    Sparkles,
    Trophy,
} from "lucide-react";

const badgeIcons = {
    "first-lesson": BookOpenCheck,
    "first-exercise": Sparkles,
    "injection-rookie": Bug,
    "web-security": ShieldCheck,
    "auth-analyst": KeyRound,
    "authorization-guard": LockKeyhole,
    "first-track": Route,
    fundamentals: Layers,
    "quiz-master": Trophy,
    "owasp-explorer": Flag,
};

function getBadgeIcon(badgeId) {
    return badgeIcons[badgeId] || Trophy;
}

export default function BadgeCard({ badge }) {
    const Icon = getBadgeIcon(badge.id);

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl p-4 ring-1 transition ${badge.earned
                ? "bg-emerald-300/[0.075] ring-emerald-300/[0.20] shadow-[0_0_24px_rgba(16,185,129,0.10)] hover:bg-emerald-300/[0.10]"
                : "bg-slate-950/35 opacity-60 ring-white/[0.05]"
                }`}
        >
            {badge.earned && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent opacity-0 transition group-hover:opacity-100" />
            )}

            <div className="flex items-start gap-3">
                <span
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 transition ${badge.earned
                        ? "bg-gradient-to-br from-emerald-200 to-blue-200 text-slate-950 ring-emerald-200/45 shadow-[0_0_22px_rgba(16,185,129,0.18)]"
                        : "bg-white/[0.035] text-slate-500 ring-white/[0.06]"
                        }`}
                >
                    {createElement(Icon, { className: "h-5 w-5" })}
                    {badge.earned && (
                        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-slate-950 bg-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                    )}
                </span>

                <div>
                    <p className="font-bold text-white">{badge.title}</p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                        {badge.description}
                    </p>

                    <div className="mt-3">
                        <AppBadge variant={badge.earned ? "emerald" : "slate"}>
                            {badge.earned ? "Earned" : "Locked"}
                        </AppBadge>
                    </div>
                </div>
            </div>
        </div>
    );
}
