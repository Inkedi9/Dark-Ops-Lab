import { Link, useParams } from "react-router-dom";
import { lessons } from "../../../data/lessons";
import { tracks } from "../../../data/tracks";
import { isLessonUnlockedInTrack } from "../../../utils/lessonUnlock";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";

function getTrackForLesson(lesson) {
    return tracks.find((track) => track.lessonIds.includes(lesson.id));
}

function getTrackLessons(track) {
    return track.lessonIds
        .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
        .filter(Boolean);
}

export default function CourseNavigation({ lesson, getLessonStatus }) {
    const { lessonId } = useParams();

    const track = getTrackForLesson(lesson);

    if (!track) return null;

    const trackLessons = getTrackLessons(track);
    const availableLessons = trackLessons.filter(
        (trackLesson) => trackLesson.status !== "Coming soon"
    );

    const completedCount = availableLessons.filter(
        (trackLesson) => getLessonStatus(trackLesson.id) === "completed"
    ).length;

    const progressPercent =
        availableLessons.length > 0
            ? Math.round((completedCount / availableLessons.length) * 100)
            : 0;

    return (
        <aside className="hidden lg:block">
            <div className="space-y-4">
                <PanelCard variant="featured" accent="violet" className="p-5">
                    <AppBadge variant="violet">Course navigation</AppBadge>

                    <h2 className="mt-4 text-xl font-extrabold tracking-tight text-white">
                        {track.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        {track.description}
                    </p>

                    <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="font-mono text-xs text-slate-500">
                                Progress
                            </p>

                            <p className="font-mono text-xs text-emerald-300">
                                {completedCount}/{availableLessons.length}
                            </p>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                            <div
                                className="progress-glow h-full rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)] transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </PanelCard>

                <PanelCard variant="subtle" className="p-3">
                    <nav className="space-y-2">
                        {trackLessons.map((trackLesson, index) => {
                            const status = getLessonStatus(trackLesson.id);
                            const isActive = trackLesson.id === lessonId;
                            const isCompleted = status === "completed";
                            const isComingSoon =
                                trackLesson.status === "Coming soon";

                            const isUnlocked = isLessonUnlockedInTrack({
                                lessonIndex: index,
                                trackLessons: availableLessons,
                                getLessonStatus,
                            });

                            const label = isComingSoon
                                ? "Soon"
                                : isCompleted
                                    ? "Done"
                                    : isUnlocked
                                        ? "Open"
                                        : "Locked";

                            const content = (
                                <div
                                    className={`rounded-2xl p-4 ring-1 transition ${isActive
                                        ? "bg-blue-300/[0.10] ring-blue-300/[0.28]"
                                        : isCompleted
                                            ? "bg-emerald-300/[0.055] ring-emerald-300/[0.16]"
                                            : isUnlocked
                                                ? "bg-slate-950/35 ring-white/[0.05] hover:bg-white/[0.045] hover:ring-blue-300/[0.18]"
                                                : "bg-slate-950/25 opacity-55 ring-white/[0.04]"
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-mono text-xs text-slate-500">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <span
                                            className={`font-mono text-xs ${isCompleted
                                                ? "text-emerald-300"
                                                : isActive
                                                    ? "text-blue-200"
                                                    : isUnlocked
                                                        ? "text-slate-400"
                                                        : "text-slate-600"
                                                }`}
                                        >
                                            {label}
                                        </span>
                                    </div>

                                    <p
                                        className={`mt-2 text-sm font-bold ${isActive
                                            ? "text-blue-100"
                                            : "text-slate-200"
                                            }`}
                                    >
                                        {trackLesson.title}
                                    </p>
                                </div>
                            );

                            if (isComingSoon || !isUnlocked) {
                                return <div key={trackLesson.id}>{content}</div>;
                            }

                            return (
                                <Link
                                    key={trackLesson.id}
                                    to={`/lessons/${trackLesson.id}`}
                                >
                                    {content}
                                </Link>
                            );
                        })}
                    </nav>
                </PanelCard>

                <AppButton
                    to={`/tracks/${track.id}`}
                    variant="violet"
                    className="w-full"
                >
                    View full track →
                </AppButton>
            </div>
        </aside>
    );
}
