"use client";

import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";

export default function CertificateCard({ track, isUnlocked, compact = false }) {
    const certificate = track.certificate;

    if (!certificate) return null;

    const issuedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const badge = track.badge || {
        label: "Track Badge",
        icon: "◆",
        variant: "emerald",
    };

    return (
        <PanelCard
            variant={isUnlocked ? "featured" : "subtle"}
            accent={isUnlocked ? badge.variant : "none"}
            className={`p-6 ${!isUnlocked ? "opacity-70" : ""}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl font-mono text-lg font-black ${isUnlocked
                            ? "bg-emerald-300 text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.30)]"
                            : "bg-white/[0.04] text-slate-500 ring-1 ring-white/[0.08]"
                            }`}
                    >
                        {badge.icon}
                    </div>

                    <div>
                        <AppBadge variant={isUnlocked ? badge.variant : "slate"}>
                            {badge.label}
                        </AppBadge>

                        <p className="mt-2 font-mono text-xs text-slate-500">
                            {track.standard || "DarkSplaining"} • {track.domain || track.title}
                        </p>
                    </div>
                </div>

                <span
                    className={`font-mono text-xs ${isUnlocked ? "text-emerald-300" : "text-slate-500"
                        }`}
                >
                    {isUnlocked ? "Unlocked" : "Locked"}
                </span>
            </div>

            <h2
                className={`mt-5 font-extrabold tracking-tight text-white ${compact ? "text-xl" : "text-3xl"
                    }`}
            >
                {certificate.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {certificate.description}
            </p>

            {track.skills?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                    {track.skills.slice(0, compact ? 3 : 6).map((skill) => (
                        <AppBadge key={skill} variant="slate">
                            {skill}
                        </AppBadge>
                    ))}
                </div>
            )}

            <div className="mt-6 grid gap-3 rounded-xl bg-slate-950/45 p-4 ring-1 ring-white/[0.06]">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-slate-500">Track</span>
                    <span className="text-right text-sm font-bold text-slate-200">
                        {track.title}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-slate-500">Status</span>
                    <span
                        className={`font-mono text-xs ${isUnlocked ? "text-emerald-300" : "text-slate-500"
                            }`}
                    >
                        {isUnlocked ? "Unlocked" : "Locked"}
                    </span>
                </div>

                {isUnlocked && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-xs text-slate-500">Issued</span>
                        <span className="font-mono text-xs text-slate-300">
                            {issuedDate}
                        </span>
                    </div>
                )}
            </div>

            {isUnlocked ? (
                <AppButton
                    to={`/learn/certificates/${track.id}`}
                    variant="secondary"
                    className="mt-5 w-full hover:ring-emerald-300/[0.28] hover:text-emerald-200"
                >
                    View certificate →
                </AppButton>
            ) : (
                <AppButton
                    disabled
                    variant="secondary"
                    className="mt-5 w-full cursor-not-allowed text-slate-500"
                >
                    Complete track to unlock
                </AppButton>
            )}
        </PanelCard>
    );
}
