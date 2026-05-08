import { useState } from "react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";

export default function CompletionCard({
    lesson,
    nextLesson,
    progressStatus,
    quizCompleted,
    onComplete,
}) {
    const canComplete = quizCompleted && progressStatus !== "completed";
    const [showReward, setShowReward] = useState(false);

    const isCompleted = progressStatus === "completed";

    function handleComplete() {
        onComplete(lesson.id);
        setShowReward(true);

        window.setTimeout(() => {
            setShowReward(false);
        }, 1800);
    }

    return (
        <PanelCard
            variant={isCompleted ? "featured" : "elevated"}
            accent="emerald"
            className="p-6"
        >
            <AppBadge variant="emerald">Lesson completion</AppBadge>

            <h2 className="mt-4 text-xl font-extrabold tracking-tight text-white">
                {isCompleted ? "Lesson completed" : "Ready to complete this lesson?"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {isCompleted
                    ? "Nice work. Exercise and quiz are completed. Your progress has been saved locally."
                    : quizCompleted
                        ? "Quiz completed. Complete the exercise to finish this lesson automatically."
                        : "Complete the exercise and answer the quiz correctly to finish this lesson."}
            </p>

            {showReward && (
                <div className="motion-reward mt-5 rounded-2xl bg-emerald-300/[0.10] p-4 ring-1 ring-emerald-300/[0.24]">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">
                        Progress saved
                    </p>

                    <p className="mt-2 text-sm text-emerald-100">
                        Nice work. This lesson has been marked as completed.
                    </p>
                </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
                <AppButton
                    type="button"
                    onClick={handleComplete}
                    disabled={!canComplete}
                    variant={
                        isCompleted
                            ? "secondary"
                            : quizCompleted
                                ? "emerald"
                                : "secondary"
                    }
                    className={
                        isCompleted || !quizCompleted
                            ? "cursor-not-allowed text-slate-500"
                            : ""
                    }
                >
                    {isCompleted ? "Completed ✓" : "Mark as completed"}
                </AppButton>

                {isCompleted && nextLesson && (
                    <AppButton
                        to={`/lessons/${nextLesson.id}`}
                        variant="violet"
                    >
                        Continue to next lesson →
                    </AppButton>
                )}

                {isCompleted && !nextLesson && (
                    <AppButton to="/lessons" variant="secondary">
                        Back to lesson library
                    </AppButton>
                )}
            </div>
        </PanelCard>
    );
}
