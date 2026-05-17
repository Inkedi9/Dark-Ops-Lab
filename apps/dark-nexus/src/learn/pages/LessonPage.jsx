"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import LessonGuidancePanel from "../components/learning/shared/LessonGuidancePanel";
import RelatedConcepts from "../components/learning/shared/RelatedConcepts";
import LearningCoachCard from "../components/learning/shared/LearningCoachCard";
import AttackFlowBlock from "../components/learning/shared/AttackFlowBlock";
import LessonBridgePanel from "../components/learning/shared/LessonBridgePanel";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import LessonChapter from "../components/learning/shared/LessonChapter";
import { spacing, typography } from "../styles/ui";
import { ArrowLeft } from "lucide-react";

export default function LessonPage({ lessonId }) {


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
    }, [lesson, startLesson]);

    useEffect(() => {
        if (!lesson?.id) return;
        if (progressStatus === "completed") return;
        if (!quizCompleted || !exerciseCompleted) return;

        function finishLesson() {
            completeLesson(lesson.id);
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
    }, [lesson, progressStatus, quizCompleted, exerciseCompleted, completeLesson]);

    if (!lesson || lesson.status === "Coming soon") {
        return (
            <div className={spacing.page}>
                <Link href="/learn/lessons"
                    className="mb-6 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to lessons
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
            <Link href="/learn/lessons"
                className="mb-6 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to lessons
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

                        <LessonGuidancePanel lesson={lesson} />

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

                        {lesson.attackFlow && (
                            <AttackFlowBlock {...lesson.attackFlow} />
                        )}

                        <ExploitFixBlock
                            exploit={lesson.content.exploit}
                            fix={lesson.content.fix}
                        />
                    </LessonChapter>

                    <div id="practice">
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
                    </div>

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

                        <LessonBridgePanel bridges={lesson.bridges} />
                    </LessonChapter>
                </div>

                <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                    <LearningCoachCard
                        lesson={lesson}
                        nextLesson={nextLesson}
                        progressStatus={progressStatus}
                        quizCompleted={quizCompleted}
                        exerciseCompleted={exerciseCompleted}
                    />

                    <PanelCard variant="darkOps" accent="blue" className="p-5">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                            Learning mode
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Read the concept, inspect the breakdown, complete the sandbox, then validate with the quiz.
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <AppBadge variant={exerciseCompleted ? "emerald" : "slate"}>
                                Exercise {exerciseCompleted ? "done" : "open"}
                            </AppBadge>

                            <AppBadge variant={quizCompleted ? "emerald" : "slate"}>
                                Quiz {quizCompleted ? "done" : "open"}
                            </AppBadge>
                        </div>
                    </PanelCard>

                    <CourseNavigation
                        lesson={lesson}
                        getLessonStatus={getLessonStatus}
                    />

                    <LessonSidebar lesson={lesson} />

                    <RelatedConcepts concepts={lesson.relatedConcepts} />
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
