"use client";

import Link from "next/link";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";

function getCoachState({
    lesson,
    nextLesson,
    progressStatus,
    quizCompleted,
    exerciseCompleted,
}) {
    if (!exerciseCompleted) {
        return {
            done: false,
            title: "Complete the sandbox exercise",
            description:
                "Practice the concept in the safe mocked lab before moving on.",
            ctaLabel: "Go to practice",
            anchor: "#practice",
        };
    }

    if (!quizCompleted) {
        return {
            done: false,
            title: "Complete the quiz",
            description:
                "Validate the idea while it is fresh, then lock in the lesson progress.",
            ctaLabel: "Go to quiz",
            anchor: "#practice",
        };
    }

    if (lesson?.learningPath?.nextStep) {
        return {
            done: progressStatus === "completed",
            title: "Next learning move",
            description: lesson.learningPath.nextStep,
            ctaLabel: nextLesson ? "Continue track" : "Browse lessons",
            to: nextLesson ? `/learn/lessons/${nextLesson.id}` : "/learn/lessons",
        };
    }

    if (nextLesson) {
        return {
            done: progressStatus === "completed",
            title: "Continue with the next lesson",
            description: `Next up: ${nextLesson.title}.`,
            ctaLabel: "Open next lesson",
            to: `/learn/lessons/${nextLesson.id}`,
        };
    }

    return {
        done: progressStatus === "completed",
        title: "Review related concepts",
        description:
            "Revisit the lesson library and connect this concept with adjacent topics.",
        ctaLabel: "Browse lessons",
        to: "/learn/lessons",
    };
}

export default function LearningCoachCard({
    lesson,
    nextLesson,
    progressStatus,
    quizCompleted,
    exerciseCompleted,
}) {
    const state = getCoachState({
        lesson,
        nextLesson,
        progressStatus,
        quizCompleted,
        exerciseCompleted,
    });

    return (
        <PanelCard
            variant="darkOps"
            accent={state.done ? "emerald" : "blue"}
            className="p-5"
        >
            <AppBadge variant={state.done ? "emerald" : "blue"}>
                Learning coach
            </AppBadge>

            <h2 className="mt-4 text-xl font-black tracking-tight text-white">
                {state.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {state.description}
            </p>

            {state.anchor ? (
                <a href={state.anchor} className="mt-5 inline-flex w-full">
                    <AppButton variant="primary" className="w-full">
                        {state.ctaLabel}
                    </AppButton>
                </a>
            ) : (
                <Link href={state.to} className="mt-5 inline-flex w-full">
                    <AppButton
                        variant={state.done ? "emerald" : "secondary"}
                        className="w-full"
                    >
                        {state.ctaLabel}
                    </AppButton>
                </Link>
            )}
        </PanelCard>
    );
}
