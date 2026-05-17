import { lessons } from "../data/lessons";
import { tracks } from "../data/tracks";
import { getTrackProgress } from "./trackProgress";

function countCompletedByDomain(completedLessons, domain) {
  return completedLessons.filter(
    (lesson) => lesson.experience?.domain === domain,
  ).length;
}

function countCompletedByPillar(completedLessons, pillar) {
  return completedLessons.filter(
    (lesson) => lesson.experience?.pillar === pillar,
  ).length;
}

export function getEarnedBadges({ getLessonStatus, isQuizCompleted }) {
  const availableLessons = lessons.filter(
    (lesson) => lesson.status !== "Coming soon",
  );

  const completedLessons = availableLessons.filter(
    (lesson) => getLessonStatus(lesson.id) === "completed",
  );

  const completedTracks = tracks.filter((track) => {
    const progress = getTrackProgress(track, getLessonStatus);
    return track.status !== "Coming soon" && progress.isCompleted;
  });

  const quizLessons = availableLessons.filter((lesson) => lesson.content?.quiz);

  const completedQuizzes = quizLessons.filter((lesson) =>
    isQuizCompleted(lesson.id),
  );

  return [
    {
      id: "first-lesson",
      title: "First Lesson",
      description: "Complete your first lesson.",
      earned: completedLessons.length >= 1,
    },
    {
      id: "first-exercise",
      title: "First Fix",
      description: "Complete your first practical sandbox.",
      earned: completedLessons.length >= 1,
    },
    {
      id: "injection-rookie",
      title: "Injection Rookie",
      description: "Complete an Injection lesson.",
      earned: countCompletedByDomain(completedLessons, "Injection") >= 1,
    },
    {
      id: "web-security",
      title: "Web Security Explorer",
      description: "Complete at least two Web Security lessons.",
      earned: countCompletedByPillar(completedLessons, "Web Security") >= 2,
    },
    {
      id: "auth-analyst",
      title: "Auth Analyst",
      description: "Complete an Authentication or Identity lesson.",
      earned:
        countCompletedByDomain(completedLessons, "Authentication") >= 1 ||
        countCompletedByPillar(completedLessons, "Identity") >= 1,
    },
    {
      id: "authorization-guard",
      title: "Authorization Guard",
      description: "Complete an Access Control or Authorization lesson.",
      earned:
        countCompletedByDomain(completedLessons, "Access Control") >= 1 ||
        countCompletedByPillar(completedLessons, "Authorization") >= 1,
    },
    {
      id: "first-track",
      title: "Track Starter",
      description: "Complete your first learning track.",
      earned: completedTracks.length >= 1,
    },
    {
      id: "fundamentals",
      title: "Fundamentals Clear",
      description: "Complete the Cyber Fundamentals track.",
      earned: completedTracks.some((track) => track.id === "fundamentals"),
    },
    {
      id: "quiz-master",
      title: "Quiz Master",
      description: "Answer every available lesson quiz correctly.",
      earned:
        quizLessons.length > 0 &&
        completedQuizzes.length === quizLessons.length,
    },
    {
      id: "owasp-explorer",
      title: "OWASP Explorer",
      description: "Complete lessons mapped to at least three OWASP areas.",
      earned:
        new Set(
          completedLessons
            .map((lesson) => lesson.experience?.owaspId)
            .filter(Boolean),
        ).size >= 3,
    },
  ];
}
