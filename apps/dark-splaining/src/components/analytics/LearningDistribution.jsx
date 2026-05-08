import { lessons } from "../../data/lessons";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

export default function LearningDistribution({ getLessonStatus }) {
    const categories = [...new Set(lessons.map((lesson) => lesson.category))];

    const distribution = categories.map((category) => {
        const categoryLessons = lessons.filter(
            (lesson) =>
                lesson.category === category && lesson.status !== "Coming soon"
        );

        const completedLessons = categoryLessons.filter(
            (lesson) => getLessonStatus(lesson.id) === "completed"
        );

        const percent =
            categoryLessons.length > 0
                ? Math.round((completedLessons.length / categoryLessons.length) * 100)
                : 0;

        return {
            category,
            completed: completedLessons.length,
            total: categoryLessons.length,
            percent,
        };
    });

    return (
        <PanelCard variant="elevated" accent="violet" className="p-6">
            <AppBadge variant="violet">Learning distribution</AppBadge>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                Progress by category
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {distribution.map((item) => (
                    <div
                        key={item.category}
                        className="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/[0.06]"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-bold text-white">
                                    {item.category}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {item.completed}/{item.total} lessons completed
                                </p>
                            </div>

                            <p className="font-mono text-sm text-violet-300">
                                {item.percent}%
                            </p>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                            <div
                                className="h-full rounded-full bg-violet-300 shadow-[0_0_12px_rgba(168,85,247,0.35)] transition-all duration-700 ease-out"
                                style={{ width: `${item.percent}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </PanelCard>
    );
}
