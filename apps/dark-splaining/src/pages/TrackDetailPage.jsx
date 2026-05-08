import { Link, useParams } from "react-router-dom";
import { lessons } from "../data/lessons";
import { tracks } from "../data/tracks";
import { useLessonProgress } from "../hooks/useLessonProgress";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import DarkAssistant from "../components/assistant/DarkAssistant";
import TrackCompletionBadge from "../components/tracks/TrackCompletionBadge";
import {
    getNextUnlockedLesson,
    isLessonUnlockedInTrack,
} from "../utils/lessonUnlock";
import CertificateCard from "../components/certificates/CertificateCard";
import DomainBadge from "../components/security/DomainBadge";
import { getLessonIdentity } from "../utils/lessonIdentity";

function getTrackById(trackId) {
    return tracks.find((track) => track.id === trackId);
}

function getTrackLessons(track) {
    return track.lessonIds
        .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
        .filter(Boolean);
}

export default function TrackDetailPage() {
    const { trackId } = useParams();
    const { getLessonStatus } = useLessonProgress();

    const track = getTrackById(trackId);

    if (!track) {
        return (
            <div className="py-10">
                <Link
                    to="/tracks"
                    className="mb-6 inline-flex font-mono text-sm text-slate-400 transition hover:text-violet-300"
                >
                    ← Back to tracks
                </Link>

                <PanelCard variant="elevated" accent="danger" className="p-8">
                    <AppBadge variant="amber">Track not found</AppBadge>

                    <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
                        This track does not exist.
                    </h1>
                </PanelCard>
            </div>
        );
    }

    const trackLessons = getTrackLessons(track);
    const availableLessons = trackLessons.filter(
        (lesson) => lesson.status !== "Coming soon"
    );

    const completedCount = availableLessons.filter(
        (lesson) => getLessonStatus(lesson.id) === "completed"
    ).length;

    const progressPercent =
        availableLessons.length > 0
            ? Math.round((completedCount / availableLessons.length) * 100)
            : 0;

    const isComingSoon = track.status === "Coming soon";
    const isTrackCompleted =
        availableLessons.length > 0 && completedCount === availableLessons.length;

    const nextLesson = getNextUnlockedLesson(availableLessons, getLessonStatus);

    const ctaLabel = isComingSoon
        ? "Coming soon"
        : isTrackCompleted
            ? "Review first lesson"
            : progressPercent > 0
                ? "Continue track"
                : "Start track";

    const badge = track.badge || {
        label: "Track",
        icon: "◆",
        variant: "violet",
    };

    return (
        <div className="py-10">
            <Link
                to="/tracks"
                className="mb-6 inline-flex font-mono text-sm text-slate-400 transition hover:text-violet-300"
            >
                ← Back to tracks
            </Link>

            <PanelCard
                variant="hero"
                accent={isTrackCompleted ? "emerald" : badge.variant || "violet"}
                animated
                className="p-7 md:p-10"
            >
                <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
                    <div>
                        <div className="flex flex-wrap gap-3">
                            <AppBadge variant={badge.variant || "violet"}>
                                {badge.label}
                            </AppBadge>

                            <AppBadge variant="slate">
                                {track.standard || "DarkSplaining"}
                            </AppBadge>

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

                        <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                            {track.title}
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                            {track.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {(track.skills || []).map((skill) => (
                                <AppBadge key={skill} variant="slate">
                                    {skill}
                                </AppBadge>
                            ))}
                        </div>

                        <div className="mt-5">
                            <TrackCompletionBadge isCompleted={isTrackCompleted} />
                        </div>
                    </div>

                    <div className="bg-black/45 p-6 ring-1 ring-white/[0.08]">
                        <div
                            className={`flex h-20 w-20 items-center justify-center font-mono text-3xl font-black ${isTrackCompleted
                                ? "bg-emerald-300 text-slate-950"
                                : badge.variant === "blue"
                                    ? "bg-blue-300 text-slate-950"
                                    : badge.variant === "amber"
                                        ? "bg-amber-300 text-slate-950"
                                        : badge.variant === "emerald"
                                            ? "bg-emerald-300 text-slate-950"
                                            : "bg-violet-300 text-slate-950"
                                }`}
                        >
                            {badge.icon}
                        </div>

                        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                            track.domain
                        </p>

                        <p className="mt-2 text-lg font-black text-white">
                            {track.domain || track.title}
                        </p>

                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                            <div
                                className="h-full rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)] transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <p className="mt-3 font-mono text-xs text-slate-500">
                            {progressPercent}% complete
                        </p>
                    </div>
                </div>
            </PanelCard>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                    {trackLessons.map((lesson, index) => {
                        const identity = getLessonIdentity(lesson);
                        const lessonStatus = getLessonStatus(lesson.id);
                        const isLessonCompleted = lessonStatus === "completed";
                        const isLessonComingSoon = lesson.status === "Coming soon";

                        const isUnlocked = isLessonUnlockedInTrack({
                            lessonIndex: index,
                            trackLessons: availableLessons,
                            getLessonStatus,
                        });

                        const lessonLabel = isLessonComingSoon
                            ? "Soon"
                            : isLessonCompleted
                                ? "Done"
                                : isUnlocked
                                    ? "Open"
                                    : "Locked";

                        const lessonAccent = isLessonCompleted
                            ? "emerald"
                            : isUnlocked
                                ? identity.accent
                                : "none";

                        return (
                            <PanelCard
                                key={lesson.id}
                                variant={isLessonCompleted ? "elevated" : "default"}
                                accent={lessonAccent}
                                hover={isUnlocked && !isLessonComingSoon}
                                className={`p-5 ${!isUnlocked || isLessonComingSoon ? "opacity-70" : ""
                                    }`}
                            >
                                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <span
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center font-mono text-xs font-black ring-1 ${isLessonCompleted
                                                    ? "bg-emerald-300 text-slate-950 ring-emerald-300/30"
                                                    : isUnlocked
                                                        ? "bg-blue-300/[0.10] text-blue-200 ring-blue-300/[0.22]"
                                                        : "bg-white/[0.035] text-slate-500 ring-white/[0.06]"
                                                    }`}
                                            >
                                                {isLessonCompleted
                                                    ? "✓"
                                                    : String(index + 1).padStart(2, "0")}
                                            </span>

                                            {index < trackLessons.length - 1 && (
                                                <span className="mt-3 h-12 w-px bg-white/10" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap gap-2">
                                                <DomainBadge
                                                    value={lesson.experience?.domain}
                                                    compact
                                                />

                                                <AppBadge variant="slate">
                                                    {lesson.duration}
                                                </AppBadge>

                                                <AppBadge variant="slate">
                                                    {identity.code}
                                                </AppBadge>
                                            </div>

                                            <h2 className="mt-3 text-xl font-black tracking-tight text-white">
                                                {lesson.title}
                                            </h2>

                                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                                {lesson.description}
                                            </p>

                                            <p
                                                className={`mt-3 font-mono text-xs ${lessonLabel === "Done"
                                                    ? "text-emerald-300"
                                                    : lessonLabel === "Open"
                                                        ? "text-blue-300"
                                                        : "text-slate-500"
                                                    }`}
                                            >
                                                {lessonLabel} • {identity.mood}
                                            </p>
                                        </div>
                                    </div>

                                    {isLessonComingSoon ? (
                                        <AppButton
                                            disabled
                                            variant="secondary"
                                            className="text-slate-500"
                                        >
                                            Soon
                                        </AppButton>
                                    ) : !isUnlocked ? (
                                        <AppButton
                                            disabled
                                            variant="secondary"
                                            className="text-slate-500"
                                        >
                                            Locked
                                        </AppButton>
                                    ) : (
                                        <AppButton
                                            to={`/lessons/${lesson.id}`}
                                            variant={
                                                isLessonCompleted ? "secondary" : "primary"
                                            }
                                        >
                                            {isLessonCompleted ? "Review" : "Open lesson"}
                                        </AppButton>
                                    )}
                                </div>
                            </PanelCard>
                        );
                    })}
                </div>

                <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    <PanelCard variant="featured" accent="emerald" className="p-5">
                        <AppBadge variant="emerald">Track progress</AppBadge>

                        <h2 className="mt-4 text-4xl font-black text-white">
                            {progressPercent}%
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            {completedCount} of {availableLessons.length} lessons completed.
                        </p>

                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                            <div
                                className="progress-glow h-full rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)] transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </PanelCard>

                    <CertificateCard
                        track={track}
                        isUnlocked={isTrackCompleted}
                        compact
                    />

                    <DarkAssistant trackId={track.id} compact />

                    <PanelCard variant="elevated" accent="violet" className="p-5">
                        <AppBadge variant="violet">Recommended action</AppBadge>

                        <p className="mt-4 text-sm leading-6 text-slate-400">
                            {isTrackCompleted
                                ? "You completed this track. You can review any lesson to refresh the concepts."
                                : "Follow the lessons in order for the clearest learning experience."}
                        </p>

                        {isComingSoon || !nextLesson ? (
                            <AppButton
                                disabled
                                variant="secondary"
                                className="mt-5 w-full cursor-not-allowed text-slate-500"
                            >
                                {ctaLabel}
                            </AppButton>
                        ) : (
                            <AppButton
                                to={`/lessons/${nextLesson.id}`}
                                variant="violet"
                                className="mt-5 w-full"
                            >
                                {ctaLabel}
                            </AppButton>
                        )}
                    </PanelCard>
                </aside>
            </section>
        </div>
    );
}
