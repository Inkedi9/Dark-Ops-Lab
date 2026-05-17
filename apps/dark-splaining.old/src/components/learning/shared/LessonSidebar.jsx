import { useLessonProgress } from "../../../hooks/useLessonProgress";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

const statusLabels = {
    "not-started": "Not started",
    "in-progress": "In progress",
    completed: "Completed",
};

const statusBadgeVariants = {
    "not-started": "slate",
    "in-progress": "amber",
    completed: "emerald",
};

export default function LessonSidebar({ lesson }) {
    const { getLessonStatus } = useLessonProgress();
    const progressStatus = getLessonStatus(lesson.id);

    const progressItems = lesson.progressItems || [
        "Concept",
        "Example",
        "Breakdown",
        "Exercise",
        "Quiz",
    ];

    return (
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <PanelCard variant="elevated" accent="blue" className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <AppBadge variant="blue">Lesson progress</AppBadge>

                    <AppBadge variant={statusBadgeVariants[progressStatus]}>
                        {statusLabels[progressStatus]}
                    </AppBadge>
                </div>

                <div className="mt-5 space-y-3">
                    {progressItems.map((item, index) => (
                        <div
                            key={item}
                            className="flex items-center gap-3 rounded-2xl bg-slate-950/35 p-3 ring-1 ring-white/[0.05]"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-300/[0.10] font-mono text-xs text-blue-200 ring-1 ring-blue-300/[0.22]">
                                {index + 1}
                            </span>

                            <span className="text-sm text-slate-300">{item}</span>
                        </div>
                    ))}
                </div>
            </PanelCard>

            <PanelCard variant="featured" accent="emerald" className="p-5">
                <AppBadge variant="emerald">Safe reminder</AppBadge>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                    This is a mocked learning exercise. No real database, backend or
                    system is being tested.
                </p>
            </PanelCard>

            <PanelCard variant="subtle" className="p-5">
                <AppBadge variant="slate">Key idea</AppBadge>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                    {lesson.content.keyIdea}
                </p>
            </PanelCard>
        </aside>
    );
}
