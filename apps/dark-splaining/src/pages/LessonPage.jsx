import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLessonById, getNextLesson } from "../data/lessons";
import LessonHeader from "../components/learning/shared/LessonHeader";
import ConceptBlock from "../components/learning/shared/ConceptBlock";
import BreakdownSteps from "../components/learning/shared/BreakdownSteps";
import LessonSidebar from "../components/learning/shared/LessonSidebar";
import ExerciseRenderer from "../components/learning/shared/ExerciseRenderer";
import LearningOutcomes from "../components/learning/shared/LearningOutcomes";
import NextLessonCard from "../components/learning/shared/NextLessonCard";
import { useLessonProgress } from "../hooks/useLessonProgress";
import CompletionCard from "../components/learning/shared/CompletionCard";
import DarkAssistant from "../components/assistant/DarkAssistant";
import QuizCard from "../components/quiz/QuizCard";
import RelatedResources from "../components/learning/shared/RelatedResources";
import LessonConceptContent from "../components/learning/shared/LessonConceptContent";
import { renderGlossaryText } from "../utils/renderGlossaryText";
import ExploitFixBlock from "../components/learning/shared/ExploitFixBlock";
import CourseNavigation from "../components/learning/shared/CourseNavigation";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import LessonChapter from "../components/learning/shared/LessonChapter";
import { spacing, typography } from "../styles/ui";
import { profileService } from "@dark/profile/profileService";

export default function LessonPage() {
    const { lessonId } = useParams();

    const lesson = getLessonById(lessonId);
    const nextLesson = getNextLesson(lesson);

    const {
        startLesson,
        completeLesson,
        completeQuiz,
        completeExercise,
        isQuizCompleted,
        isExerciseCompleted,
        getLessonStatus,
    } = useLessonProgress();

    const exerciseCompleted = lesson ? isExerciseCompleted(lesson.id) : false;
    const progressStatus = lesson ? getLessonStatus(lesson.id) : "not-started";
    const quizCompleted = lesson ? isQuizCompleted(lesson.id) : false;

    const [showCompletionToast, setShowCompletionToast] = useState(false);

    useEffect(() => {
        if (lesson && lesson.status !== "Coming soon") {
            startLesson(lesson.id);
        }
    }, [lesson?.id]);

    useEffect(() => {
        if (!lesson?.id) return;
        if (progressStatus === "completed") return;
        if (!quizCompleted || !exerciseCompleted) return;

        async function finishLesson() {
            completeLesson(lesson.id);

            // XP global
            await profileService.addXp(25);
        }

        finishLesson();

        const showTimeoutId = window.setTimeout(() => {
            setShowCompletionToast(true);
        }, 0);

        const hideTimeoutId = window.setTimeout(() => {
            setShowCompletionToast(false);
        }, 2400);

        return () => {
            window.clearTimeout(showTimeoutId);
            window.clearTimeout(hideTimeoutId);
        };
    }, [lesson?.id, progressStatus, quizCompleted, exerciseCompleted]);

    if (!lesson || lesson.status === "Coming soon") {
        return (
            <div className={spacing.page}>
                <Link
                    to="/lessons"
                    className="mb-6 inline-flex font-mono text-sm text-slate-400 transition hover:text-blue-300"
                >
                    ← Back to lessons
                </Link>

                <PanelCard variant="elevated" accent="danger" className="p-8">
                    <AppBadge variant="amber">Lesson unavailable</AppBadge>

                    <h1 className={`mt-4 ${typography.sectionTitle}`}>
                        This lesson is not ready yet.
                    </h1>

                    <p className={`mt-4 ${typography.body}`}>
                        Go back to the lesson list and choose an available module.
                    </p>
                </PanelCard>
            </div>
        );
    }

    return (
        <div className={spacing.page}>
            <Link
                to="/lessons"
                className="mb-6 inline-flex font-mono text-sm text-slate-400 transition hover:text-blue-300"
            >
                ← Back to lessons
            </Link>

            <LessonHeader lesson={lesson} />

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
                <div className="space-y-12">
                    <LessonChapter
                        number="01"
                        eyebrow="Understanding"
                        title="Understand the concept"
                        description="Start with the core idea, useful terms, and a clear example before touching the sandbox."
                        accent="blue"
                    >
                        <LearningOutcomes items={lesson.content.outcomes} />

                        <DarkAssistant lessonId={lesson.id} />

                        <RelatedResources termIds={lesson.relatedTermIds} />

                        <ConceptBlock title={lesson.content.concept.title}>
                            <LessonConceptContent lesson={lesson} />
                        </ConceptBlock>

                        <ConceptBlock title={lesson.content.example.title}>
                            <p>
                                {renderGlossaryText(
                                    lesson.content.example.text,
                                    lesson.content.example.glossaryLinks
                                )}
                            </p>
                        </ConceptBlock>
                    </LessonChapter>

                    <LessonChapter
                        number="02"
                        eyebrow="Breakdown"
                        title="See what goes wrong"
                        description="Break the issue into steps, then compare the unsafe behavior with the safer fix."
                        accent="violet"
                    >
                        <BreakdownSteps steps={lesson.content.steps} />

                        <ExploitFixBlock
                            exploit={lesson.content.exploit}
                            fix={lesson.content.fix}
                        />
                    </LessonChapter>

                    <LessonChapter
                        number="03"
                        eyebrow="Practice"
                        title="Use the sandbox"
                        description="Try the mocked exercise, check your understanding, and complete the quiz."
                        accent="emerald"
                    >
                        <ExerciseRenderer
                            lesson={lesson}
                            onCompleteExercise={() => completeExercise(lesson.id)}
                        />

                        {lesson.content.quiz && (
                            <QuizCard
                                {...lesson.content.quiz}
                                onCorrectAnswer={() => completeQuiz(lesson.id)}
                            />
                        )}
                    </LessonChapter>

                    <LessonChapter
                        number="04"
                        eyebrow="Wrap-up"
                        title="Finish and continue"
                        description="Save your progress and move to the next lesson when you are ready."
                        accent="amber"
                    >
                        <CompletionCard
                            lesson={lesson}
                            nextLesson={nextLesson}
                            progressStatus={progressStatus}
                            quizCompleted={quizCompleted}
                            onComplete={completeLesson}
                        />

                        <NextLessonCard lesson={nextLesson} />
                    </LessonChapter>
                </div>

                <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                    <CourseNavigation
                        lesson={lesson}
                        getLessonStatus={getLessonStatus}
                    />

                    <LessonSidebar lesson={lesson} />
                </aside>
            </div>

            {showCompletionToast && (
                <div className="motion-reward fixed bottom-6 right-6 z-50">
                    <PanelCard
                        variant="elevated"
                        accent="emerald"
                        className="px-5 py-4"
                    >
                        <AppBadge variant="emerald">Lesson completed</AppBadge>

                        <p className="mt-3 text-sm text-slate-300">
                            Nice work. Your local progress has been updated.
                        </p>
                    </PanelCard>
                </div>
            )}
        </div>
    );
}
