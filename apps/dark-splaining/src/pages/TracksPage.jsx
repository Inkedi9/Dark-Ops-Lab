import { useMemo, useState } from "react";
import { tracks } from "../data/tracks";
import { useLessonProgress } from "../hooks/useLessonProgress";
import PanelCard from "@dark/ui/components/PanelCard";
import PageHeader from "@dark/ui/components/PageHeader";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import TrackCompletionBadge from "../components/tracks/TrackCompletionBadge";
import {
    getMultiTrackProgress,
    getTrackProgress,
} from "../utils/trackProgress";
import BadgesPanel from "../components/gamification/BadgesPanel";
import { getEarnedBadges } from "../utils/badges";
import { radius, spacing, typography } from "../styles/ui";
import { BadgeCheck } from "lucide-react";

const levelFilters = ["All", "Beginner", "Intermediate", "Advanced"];

export default function TracksPage() {
    const { getLessonStatus, isQuizCompleted } = useLessonProgress();
    const [levelFilter, setLevelFilter] = useState("All");

    const multiTrackProgress = getMultiTrackProgress(tracks, getLessonStatus);
    const badges = getEarnedBadges({ getLessonStatus, isQuizCompleted });
    const visibleTracks = useMemo(
        () =>
            tracks.filter(
                (track) => levelFilter === "All" || track.level === levelFilter
            ),
        [levelFilter]
    );

    const progressStats = [
        {
            label: "Tracks started",
            value: `${multiTrackProgress.startedTracks}/${multiTrackProgress.totalTracks}`,
        },
        {
            label: "Tracks completed",
            value: `${multiTrackProgress.completedTracks}/${multiTrackProgress.totalTracks}`,
        },
        {
            label: "Average progress",
            value: `${multiTrackProgress.averageProgress}%`,
        },
    ];

    return (
        <div className={spacing.page}>
            <PageHeader
                eyebrow="Learning roadmap"
                title="Build cyber skills through guided tracks."
                description="Each track groups lessons into a clear path with skills, badges, certificates and local progress."
                accent="violet"
            />

            <section className="mb-10">
                <PanelCard variant="default" accent="blue" className="p-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        {progressStats.map((stat) => (
                            <PanelCard
                                key={stat.label}
                                variant="subtle"
                                accent="blue"
                                className="p-4"
                            >
                                <p className={`${typography.meta} text-slate-500`}>
                                    {stat.label}
                                </p>

                                <p className="mt-3 text-3xl font-black text-white">
                                    {stat.value}
                                </p>
                            </PanelCard>
                        ))}
                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                        <div
                            className="progress-glow h-full rounded-full bg-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.45)] transition-all duration-700 ease-out"
                            style={{
                                width: `${multiTrackProgress.averageProgress}%`,
                            }}
                        />
                    </div>
                </PanelCard>
            </section>

            {multiTrackProgress.startedTracks > 0 && (
                <section className="mb-10">
                    <PanelCard variant="darkNexus" accent="violet" className="p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
                                    Continue learning
                                </p>

                                <h2 className="mt-2 text-2xl font-black text-white">
                                    Pick up where you left off.
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    Resume your active roadmap and keep building your cyber fundamentals.
                                </p>
                            </div>

                            <AppButton to="/lessons" variant="violet">
                                Resume lessons →
                            </AppButton>
                        </div>
                    </PanelCard>
                </section>
            )}

            <section className="mb-8">
                <BadgesPanel badges={badges} />
            </section>

            <section className="mb-8">
                <PanelCard variant="subtle" accent="violet" className="min-h-fit p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <p className={`${typography.meta} shrink-0 text-slate-500`}>
                            Filter by level
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {levelFilters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setLevelFilter(filter)}
                                    className={[
                                        "shrink-0 rounded-xl border px-4 py-2 text-sm font-bold leading-none transition",
                                        levelFilter === filter
                                            ? "border-violet-300/30 bg-violet-300/[0.10] text-violet-100"
                                            : "border-white/[0.07] bg-white/[0.03] text-slate-300 hover:border-violet-300/20 hover:text-white",
                                    ].join(" ")}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </PanelCard>
            </section>

            <section className={`${spacing.section} grid gap-6 lg:grid-cols-2`}>
                {visibleTracks.map((track) => {
                    const {
                        trackLessons,
                        availableLessons,
                        completedCount,
                        percent: progressPercent,
                        isCompleted: isTrackCompleted,
                    } = getTrackProgress(track, getLessonStatus);

                    const isComingSoon = track.status === "Coming soon";

                    const ctaLabel = isComingSoon
                        ? "Coming soon"
                        : isTrackCompleted
                            ? "Review track"
                            : progressPercent > 0
                                ? "Continue track"
                                : "Start track";

                    const badge = track.badge || {
                        label: "Track",
                        icon: "◆",
                        variant: "violet",
                    };

                    const accent = isTrackCompleted
                        ? "emerald"
                        : isComingSoon
                            ? "none"
                            : badge.variant || "violet";

                    return (
                        <PanelCard
                            key={track.id}
                            variant={isTrackCompleted ? "featured" : "elevated"}
                            accent={accent}
                            hover={!isComingSoon}
                            className={`p-6 ${isComingSoon ? "opacity-60" : ""}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-mono text-xl font-black ring-1 transition ${isComingSoon
                                            ? "bg-white/[0.04] text-slate-500 ring-white/[0.08]"
                                            : isTrackCompleted
                                                ? "bg-gradient-to-br from-emerald-200 to-blue-200 text-slate-950 ring-emerald-200/40 shadow-[0_0_24px_rgba(16,185,129,0.22)]"
                                                : badge.variant === "blue"
                                                    ? "bg-gradient-to-br from-blue-200 to-slate-200 text-slate-950 ring-blue-200/35 shadow-[0_0_24px_rgba(96,165,250,0.18)]"
                                                    : badge.variant === "emerald"
                                                        ? "bg-gradient-to-br from-emerald-200 to-slate-200 text-slate-950 ring-emerald-200/35 shadow-[0_0_24px_rgba(16,185,129,0.18)]"
                                                        : badge.variant === "amber"
                                                            ? "bg-gradient-to-br from-amber-200 to-slate-200 text-slate-950 ring-amber-200/35 shadow-[0_0_24px_rgba(251,191,36,0.18)]"
                                                            : "bg-gradient-to-br from-violet-200 to-blue-200 text-slate-950 ring-violet-200/35 shadow-[0_0_24px_rgba(168,85,247,0.18)]"
                                            }`}
                                    >
                                        {badge.icon}
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap gap-2">
                                            <AppBadge variant={badge.variant || "violet"}>
                                                {badge.label}
                                            </AppBadge>

                                            <AppBadge variant="slate">
                                                {track.standard || "DarkSplaining"}
                                            </AppBadge>
                                        </div>

                                        <h2 className={`mt-4 ${typography.cardTitle}`}>
                                            {track.title}
                                        </h2>

                                        <p className="mt-2 font-mono text-xs text-slate-500">
                                            {track.domain || track.category || "Security"} •{" "}
                                            {track.level}
                                        </p>

                                        <div className="mt-3">
                                            <TrackCompletionBadge
                                                isCompleted={isTrackCompleted}
                                                compact
                                            />
                                        </div>
                                    </div>
                                </div>

                                <AppBadge
                                    variant={
                                        isTrackCompleted
                                            ? "emerald"
                                            : isComingSoon
                                                ? "slate"
                                                : "blue"
                                    }
                                >
                                    {isTrackCompleted
                                        ? "Completed"
                                        : isComingSoon
                                            ? "Soon"
                                            : track.status}
                                </AppBadge>
                            </div>

                            <p className={`mt-5 ${typography.body}`}>
                                {track.description}
                            </p>

                            {track.skills?.length > 0 && (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {track.skills.slice(0, 4).map((skill) => (
                                        <AppBadge key={skill} variant="slate">
                                            {skill}
                                        </AppBadge>
                                    ))}
                                </div>
                            )}

                            <div className={`mt-6 ${radius.card} bg-slate-950/40 p-4 ring-1 ring-white/[0.06]`}>
                                <div className="flex items-center justify-between gap-4">
                                    <p className={`${typography.meta} text-slate-500`}>
                                        Track progress
                                    </p>

                                    <p className="font-mono text-xs text-emerald-300">
                                        {completedCount}/{availableLessons.length}
                                    </p>
                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/80">
                                    <div
                                        className="progress-glow h-full rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)] transition-all duration-700 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>

                                <p className="mt-3 text-sm font-bold text-white">
                                    {isTrackCompleted
                                        ? "Track completed"
                                        : isComingSoon
                                            ? "Not available yet"
                                            : `${progressPercent}% completed`}
                                </p>
                            </div>

                            <div className="mt-6">
                                <p className={`${typography.meta} text-slate-500`}>
                                    Roadmap
                                </p>

                                <div className="mt-4 space-y-3">
                                    {trackLessons.slice(0, 3).map((lesson, index) => {
                                        const lessonStatus =
                                            lesson.status === "Coming soon"
                                                ? "Soon"
                                                : getLessonStatus(lesson.id) === "completed"
                                                    ? "Done"
                                                    : "Open";

                                        const isDone = lessonStatus === "Done";

                                        return (
                                            <div
                                                key={lesson.id}
                                                className="relative flex gap-4"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-black ring-1 transition ${isDone
                                                            ? "bg-gradient-to-br from-emerald-200 to-blue-200 text-slate-950 ring-emerald-200/40 shadow-[0_0_14px_rgba(16,185,129,0.20)]"
                                                            : lessonStatus === "Soon"
                                                                ? "bg-white/[0.035] text-slate-500 ring-white/[0.06]"
                                                                : "bg-blue-300/[0.10] text-blue-200 ring-blue-300/[0.20]"
                                                            }`}
                                                    >
                                                {isDone
                                                            ? <BadgeCheck className="h-4 w-4" />
                                                            : String(index + 1).padStart(2, "0")}
                                                    </span>

                                                    {index < Math.min(trackLessons.length, 3) - 1 && (
                                                        <span className="mt-2 h-8 w-px bg-white/10" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1 bg-slate-950/35 p-3 ring-1 ring-white/[0.05]">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="truncate text-sm font-bold text-slate-200">
                                                            {lesson.title}
                                                        </p>

                                                        <span
                                                            className={`font-mono text-xs ${isDone
                                                                ? "text-emerald-300"
                                                                : lessonStatus === "Soon"
                                                                    ? "text-slate-500"
                                                                    : "text-blue-300"
                                                                }`}
                                                        >
                                                            {lessonStatus}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                                        {lesson.experience?.domain || lesson.category}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {trackLessons.length > 3 && (
                                        <p className="mt-3 font-mono text-xs text-slate-500">
                                            +{trackLessons.length - 3} more lessons inside this track
                                        </p>
                                    )}
                                </div>
                            </div>

                            {isComingSoon ? (
                                <AppButton
                                    disabled
                                    variant="secondary"
                                    className="mt-6 w-full cursor-not-allowed text-slate-500"
                                >
                                    {ctaLabel}
                                </AppButton>
                            ) : (
                                <AppButton
                                    to={`/tracks/${track.id}`}
                                    variant={isTrackCompleted ? "emerald" : "violet"}
                                    className="mt-6 w-full"
                                >
                                    {ctaLabel}
                                </AppButton>
                            )}
                        </PanelCard>
                    );
                })}
            </section>
        </div>
    );
}
