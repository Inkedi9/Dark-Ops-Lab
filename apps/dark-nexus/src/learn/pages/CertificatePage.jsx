"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { tracks } from "../data/tracks";
import { useLessonProgress } from "../hooks/useLessonProgress";
import { getTrackProgress } from "../utils/trackProgress";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import PanelCard from "@dark/ui/components/PanelCard";

export default function CertificatePage({ trackId }) {

    const { getLessonStatus } = useLessonProgress();
    const [copied, setCopied] = useState(null);

    const track = tracks.find((item) => item.id === trackId);
    const progress = track ? getTrackProgress(track, getLessonStatus) : null;

    if (!track || !track.certificate) {
        return (
            <div className="py-10">
                <Link href="/learn/tracks" className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300">
                    <ArrowLeft className="h-4 w-4" />
                    Back to tracks
                </Link>

                <PanelCard variant="elevated" accent="danger" className="max-w-3xl p-8">
                    <AppBadge variant="amber">Not found</AppBadge>
                    <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
                        Certificate not found.
                    </h1>
                </PanelCard>
            </div>
        );
    }

    if (!progress.isCompleted) {
        return (
            <div className="py-10">
                <Link href={`/learn/tracks/${track.id}`} className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300">
                    <ArrowLeft className="h-4 w-4" />
                    Back to track
                </Link>

                <PanelCard variant="elevated" accent="violet" className="p-8">
                    <AppBadge variant="slate">Certificate locked</AppBadge>
                    <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white">
                        Complete this track to unlock the certificate.
                    </h1>
                </PanelCard>
            </div>
        );
    }

    const issuedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const badge = track.badge || {
        label: "Track Badge",
        icon: "◆",
        variant: "emerald",
    };

    const certificateUrl = window.location.href;

    const credentialText = `I completed the ${track.certificate.title} on DarkSplaining.

Track: ${track.title}
Domain: ${track.domain || "Security"}
Standard: ${track.standard || "DarkSplaining Core"}
Lessons: ${progress.completedCount}/${progress.total}
Issued: ${issuedDate}
Skills: ${(track.skills || []).join(", ")}`;

    async function copyValue(type, value) {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(type);
            window.setTimeout(() => setCopied(null), 1600);
        } catch {
            setCopied(null);
        }
    }

    return (
        <div className="py-10">
                <Link href={`/learn/tracks/${track.id}`} className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300">
                    <ArrowLeft className="h-4 w-4" />
                    Back to track
                </Link>

            <PanelCard variant="hero" accent={badge.variant || "emerald"} animated className="p-8 md:p-12">
                <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <AppBadge variant={badge.variant || "emerald"}>
                                DarkSplaining Certificate
                            </AppBadge>
                            <AppBadge variant="slate">
                                {track.standard || "DarkSplaining Core"}
                            </AppBadge>
                        </div>

                        <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                            {track.certificate.title}
                        </h1>

                        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                            This certifies completion of the{" "}
                            <span className="font-bold text-emerald-200">{track.title}</span>{" "}
                            track, including guided concepts, safe mock exploitation,
                            secure fixes, quizzes and local progress validation.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-2">
                            {(track.skills || []).map((skill) => (
                                <AppBadge key={skill} variant="slate">
                                    {skill}
                                </AppBadge>
                            ))}
                        </div>
                    </div>

                    <div className="relative bg-black/45 p-6 ring-1 ring-white/[0.08]">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

                        <div className="mx-auto flex h-24 w-24 items-center justify-center bg-emerald-300 font-mono text-4xl font-black text-slate-950 shadow-[0_0_35px_rgba(16,185,129,0.35)]">
                            {badge.icon}
                        </div>

                        <p className="mt-5 text-center font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">
                            {badge.label}
                        </p>

                        <p className="mt-3 text-center text-sm leading-6 text-slate-400">
                            {track.domain || track.title}
                        </p>
                    </div>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-4">
                    <PanelCard variant="subtle" accent="emerald" className="p-5">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">Status</p>
                        <p className="mt-3 text-2xl font-extrabold text-emerald-200">Completed</p>
                    </PanelCard>

                    <PanelCard variant="subtle" className="p-5">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">Lessons</p>
                        <p className="mt-3 text-2xl font-extrabold text-white">
                            {progress.completedCount}/{progress.total}
                        </p>
                    </PanelCard>

                    <PanelCard variant="subtle" className="p-5">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">Domain</p>
                        <p className="mt-3 text-xl font-extrabold text-white">
                            {track.domain || "Security"}
                        </p>
                    </PanelCard>

                    <PanelCard variant="subtle" className="p-5">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">Issued</p>
                        <p className="mt-3 text-xl font-extrabold text-white">
                            {issuedDate}
                        </p>
                    </PanelCard>
                </div>

                <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
                    <PanelCard variant="featured" accent="emerald" className="p-5">
                        <AppBadge variant="emerald">Credential note</AppBadge>

                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            This is a local portfolio credential generated by DarkSplaining.
                            It represents completion of a safe, frontend-only learning track
                            built around explanation, sandbox practice, secure remediation and
                            quiz validation.
                        </p>

                        <div className="mt-5">
                            <AppButton to={`/learn/tracks/${track.id}`} variant="secondary" className="hover:ring-emerald-300/[0.28] hover:text-emerald-200">
                                Review track →
                            </AppButton>
                        </div>
                    </PanelCard>

                    <PanelCard variant="elevated" accent="blue" className="p-5">
                        <AppBadge variant="blue">Share credential</AppBadge>

                        <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                            Portfolio-ready share card.
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Copy your credential summary or certificate URL for your portfolio,
                            README, LinkedIn notes, or project demo.
                        </p>

                        <div className="mt-5 space-y-3">
                            <button
                                type="button"
                                onClick={() => copyValue("text", credentialText)}
                                className="w-full bg-white/[0.035] px-4 py-3 text-left font-mono text-xs font-bold text-slate-300 ring-1 ring-white/[0.07] transition hover:text-blue-200 hover:ring-blue-300/[0.24]"
                            >
                                {copied === "text" ? "Copied credential text ✓" : "Copy credential text"}
                            </button>

                            <button
                                type="button"
                                onClick={() => copyValue("url", certificateUrl)}
                                className="w-full bg-white/[0.035] px-4 py-3 text-left font-mono text-xs font-bold text-slate-300 ring-1 ring-white/[0.07] transition hover:text-blue-200 hover:ring-blue-300/[0.24]"
                            >
                                {copied === "url" ? "Copied certificate URL ✓" : "Copy certificate URL"}
                            </button>
                        </div>
                    </PanelCard>
                </section>
                <PanelCard variant="elevated" accent="blue" className="mt-6 p-5">
                    <AppBadge variant="blue">DarkChallenges unlocked</AppBadge>

                    <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                        Continue with unguided missions.
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                        This certificate proves guided learning. DarkChallenges lets you validate the
                        same skills through mini CTF operations, warzone simulations and mission boards.
                    </p>

                    <div className="mt-5">
                        <AppButton
                            href="/challenges"
                            variant="secondary"
                            className="hover:text-blue-200 hover:ring-blue-300/[0.24]"
                        >
                            Open DarkChallenges →
                        </AppButton>
                    </div>
                </PanelCard>
            </PanelCard>
        </div>
    );
}
