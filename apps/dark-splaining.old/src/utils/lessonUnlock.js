export function arePrerequisitesCompleted(lesson, getLessonStatus) {
  const prerequisites = lesson.prerequisites || [];

  if (prerequisites.length === 0) return true;

  return prerequisites.every(
    (lessonId) => getLessonStatus(lessonId) === "completed",
  );
}

export function isLessonUnlockedInTrack({
  lessonIndex,
  trackLessons,
  getLessonStatus,
}) {
  const lesson = trackLessons[lessonIndex];

  if (!lesson) return false;
  if (lesson.status === "Coming soon") return false;

  const prerequisitesCompleted = arePrerequisitesCompleted(
    lesson,
    getLessonStatus,
  );

  if (!prerequisitesCompleted) return false;

  if (lessonIndex === 0) return true;

  const previousLesson = trackLessons[lessonIndex - 1];

  if (!previousLesson) return false;
  if (previousLesson.status === "Coming soon") return true;

  return getLessonStatus(previousLesson.id) === "completed";
}

export function getNextUnlockedLesson(trackLessons, getLessonStatus) {
  return (
    trackLessons.find((lesson, index) => {
      const isCompleted = getLessonStatus(lesson.id) === "completed";

      const isUnlocked = isLessonUnlockedInTrack({
        lessonIndex: index,
        trackLessons,
        getLessonStatus,
      });

      return !isCompleted && isUnlocked;
    }) || null
  );
}
