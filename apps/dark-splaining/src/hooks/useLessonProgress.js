import { useState } from "react";
import { storageService } from "../services/storageService";
import { XP_KEY } from "./useXp";
import { XP_REWARDS } from "../data/rewards";

const PROGRESS_STORAGE_KEY = "darksplaining.lessonProgress";

function normalizeLessonProgress(value) {
  if (typeof value === "object" && value !== null) {
    return {
      status: value.status || "not-started",
      quizCompleted: Boolean(value.quizCompleted),
      exerciseCompleted: Boolean(value.exerciseCompleted),
      rewardsClaimed: value.rewardsClaimed || {},
    };
  }

  return {
    status: value || "not-started",
    quizCompleted: false,
    exerciseCompleted: false,
    rewardsClaimed: {},
  };
}

function addXpOnce({ lessonProgress, rewardKey, amount }) {
  if (lessonProgress.rewardsClaimed?.[rewardKey]) {
    return {
      lessonProgress,
      xpAdded: 0,
    };
  }

  return {
    lessonProgress: {
      ...lessonProgress,
      rewardsClaimed: {
        ...lessonProgress.rewardsClaimed,
        [rewardKey]: true,
      },
    },
    xpAdded: amount,
  };
}

function incrementStoredXp(amount) {
  if (!amount || amount <= 0) return;

  const currentXp = storageService.get(XP_KEY, 0);
  storageService.set(XP_KEY, currentXp + amount);
}

export function useLessonProgress() {
  const [progress, setProgress] = useState(() => {
    return storageService.get(PROGRESS_STORAGE_KEY, {});
  });

  function writeProgress(nextProgress) {
    storageService.set(PROGRESS_STORAGE_KEY, nextProgress);
  }

  function updateLessonProgress(lessonId, updater) {
    setProgress((currentProgress) => {
      const currentLessonProgress = normalizeLessonProgress(
        currentProgress[lessonId],
      );

      const { nextLessonProgress, xpAdded = 0 } = updater(
        currentLessonProgress,
      );

      const updatedProgress = {
        ...currentProgress,
        [lessonId]: nextLessonProgress,
      };

      writeProgress(updatedProgress);
      incrementStoredXp(xpAdded);

      return updatedProgress;
    });
  }

  function startLesson(lessonId) {
    updateLessonProgress(lessonId, (currentLessonProgress) => {
      if (currentLessonProgress.status === "completed") {
        return { nextLessonProgress: currentLessonProgress };
      }

      const { lessonProgress, xpAdded } = addXpOnce({
        lessonProgress: currentLessonProgress,
        rewardKey: "startLesson",
        amount: XP_REWARDS.START_LESSON,
      });

      return {
        nextLessonProgress: {
          ...lessonProgress,
          status:
            lessonProgress.status === "not-started"
              ? "in-progress"
              : lessonProgress.status,
        },
        xpAdded,
      };
    });
  }

  function completeExercise(lessonId) {
    updateLessonProgress(lessonId, (currentLessonProgress) => {
      const { lessonProgress, xpAdded } = addXpOnce({
        lessonProgress: currentLessonProgress,
        rewardKey: "completeExercise",
        amount: XP_REWARDS.COMPLETE_EXERCISE,
      });

      return {
        nextLessonProgress: {
          ...lessonProgress,
          status:
            lessonProgress.status === "completed" ? "completed" : "in-progress",
          exerciseCompleted: true,
        },
        xpAdded,
      };
    });
  }

  function completeQuiz(lessonId) {
    updateLessonProgress(lessonId, (currentLessonProgress) => {
      const { lessonProgress, xpAdded } = addXpOnce({
        lessonProgress: currentLessonProgress,
        rewardKey: "completeQuiz",
        amount: XP_REWARDS.COMPLETE_QUIZ,
      });

      return {
        nextLessonProgress: {
          ...lessonProgress,
          status:
            lessonProgress.status === "completed" ? "completed" : "in-progress",
          quizCompleted: true,
        },
        xpAdded,
      };
    });
  }

  function completeLesson(lessonId) {
    updateLessonProgress(lessonId, (currentLessonProgress) => {
      if (currentLessonProgress.status === "completed") {
        return { nextLessonProgress: currentLessonProgress };
      }

      const { lessonProgress, xpAdded } = addXpOnce({
        lessonProgress: currentLessonProgress,
        rewardKey: "completeLesson",
        amount: XP_REWARDS.COMPLETE_LESSON,
      });

      return {
        nextLessonProgress: {
          ...lessonProgress,
          status: "completed",
        },
        xpAdded,
      };
    });
  }

  function resetProgress() {
    storageService.remove(PROGRESS_STORAGE_KEY);
    setProgress({});
  }

  function getLessonProgress(lessonId) {
    return normalizeLessonProgress(progress[lessonId]);
  }

  function getLessonStatus(lessonId) {
    return getLessonProgress(lessonId).status || "not-started";
  }

  function isQuizCompleted(lessonId) {
    return getLessonProgress(lessonId).quizCompleted;
  }

  function isExerciseCompleted(lessonId) {
    return getLessonProgress(lessonId).exerciseCompleted;
  }

  function hasClaimedReward(lessonId, rewardKey) {
    return Boolean(getLessonProgress(lessonId).rewardsClaimed?.[rewardKey]);
  }

  return {
    progress,
    startLesson,
    completeLesson,
    resetProgress,
    getLessonProgress,
    getLessonStatus,
    completeQuiz,
    isQuizCompleted,
    completeExercise,
    isExerciseCompleted,
    hasClaimedReward,
  };
}
