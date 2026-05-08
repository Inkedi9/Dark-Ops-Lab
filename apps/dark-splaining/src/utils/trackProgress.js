import { lessons } from "../data/lessons";

export function getTrackLessons(track) {
  return track.lessonIds
    .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
    .filter(Boolean);
}

export function getTrackProgress(track, getLessonStatus) {
  const trackLessons = getTrackLessons(track);

  const availableLessons = trackLessons.filter(
    (lesson) => lesson.status !== "Coming soon",
  );

  const completedCount = availableLessons.filter(
    (lesson) => getLessonStatus(lesson.id) === "completed",
  ).length;

  const startedCount = availableLessons.filter((lesson) => {
    const status = getLessonStatus(lesson.id);
    return status === "in-progress" || status === "completed";
  }).length;

  const percent =
    availableLessons.length > 0
      ? Math.round((completedCount / availableLessons.length) * 100)
      : 0;

  return {
    trackLessons,
    availableLessons,
    completedCount,
    startedCount,
    total: availableLessons.length,
    percent,
    isStarted: startedCount > 0,
    isCompleted:
      availableLessons.length > 0 && completedCount === availableLessons.length,
  };
}

export function getMultiTrackProgress(tracks, getLessonStatus) {
  const availableTracks = tracks.filter(
    (track) => track.status !== "Coming soon",
  );

  const trackSummaries = availableTracks.map((track) => ({
    track,
    progress: getTrackProgress(track, getLessonStatus),
  }));

  const startedTracks = trackSummaries.filter(
    ({ progress }) => progress.isStarted,
  ).length;

  const completedTracks = trackSummaries.filter(
    ({ progress }) => progress.isCompleted,
  ).length;

  const averageProgress =
    trackSummaries.length > 0
      ? Math.round(
          trackSummaries.reduce(
            (total, { progress }) => total + progress.percent,
            0,
          ) / trackSummaries.length,
        )
      : 0;

  return {
    availableTracks,
    trackSummaries,
    startedTracks,
    completedTracks,
    totalTracks: availableTracks.length,
    averageProgress,
  };
}
