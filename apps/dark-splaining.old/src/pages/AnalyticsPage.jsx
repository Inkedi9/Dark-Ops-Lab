import { lessons } from "../data/lessons";
import { tracks } from "../data/tracks";
import { useLessonProgress } from "../hooks/useLessonProgress";
import { getMultiTrackProgress } from "../utils/trackProgress";
import MetricCard from "../components/analytics/MetricCard";
import RecommendedLearning from "../components/analytics/RecommendedLearning";
import PanelCard from "@dark/ui/components/PanelCard";
import MiniBarChart from "../components/analytics/MiniBarChart";
import LearningDistribution from "../components/analytics/LearningDistribution";
import PageHeader from "@dark/ui/components/PageHeader";
import AppBadge from "@dark/ui/components/AppBadge";
import { spacing, typography } from "../styles/ui";
import OwaspCoverageMap from "../components/owasp/OwaspCoverageMap";

export default function AnalyticsPage() {
    const { getLessonStatus, isQuizCompleted } = useLessonProgress();

    const availableLessons = lessons.filter(
        (lesson) => lesson.status !== "Coming soon"
    );

    const completedLessons = availableLessons.filter(
        (lesson) => getLessonStatus(lesson.id) === "completed"
    );

    const startedLessons = availableLessons.filter((lesson) => {
        const status = getLessonStatus(lesson.id);
        return status === "in-progress" || status === "completed";
    });

    const quizLessons = availableLessons.filter((lesson) => lesson.content?.quiz);

    const completedQuizzes = quizLessons.filter((lesson) =>
        isQuizCompleted(lesson.id)
    );

    const globalProgress =
        availableLessons.length > 0
            ? Math.round((completedLessons.length / availableLessons.length) * 100)
            : 0;

    const quizProgress =
        quizLessons.length > 0
            ? Math.round((completedQuizzes.length / quizLessons.length) * 100)
            : 0;

    const multiTrackProgress = getMultiTrackProgress(tracks, getLessonStatus);

    const recommendedLesson =
        availableLessons.find(
            (lesson) => getLessonStatus(lesson.id) !== "completed"
        ) || availableLessons[0];

    const mockedActivity = [
        "Completed SQL Injection quiz",
        "Started Cyber Fundamentals track",
        "Reviewed Access Control exercise",
    ];

    const learningHealth = [
        { label: "Lessons", value: globalProgress },
        { label: "Quizzes", value: quizProgress },
        { label: "Tracks", value: multiTrackProgress.averageProgress },
    ];

    const mockedWeeklyActivity = [
        { label: "Mon", value: 20 },
        { label: "Tue", value: 45 },
        { label: "Wed", value: 35 },
        { label: "Thu", value: 70 },
        { label: "Fri", value: 55 },
    ];

    return (
        <div className={spacing.page}>
            <PageHeader
                eyebrow="Learning analytics"
                title="Track your DarkSplaining progress."
                description="A local, mock analytics dashboard showing learning progress, quiz completion and recommended next actions."
                accent="blue"
            />

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard accent="amber"
                    label="Global progress"
                    value={`${globalProgress}%`}
                    helper={`${completedLessons.length}/${availableLessons.length} lessons completed`}
                />

                <MetricCard accent="violet"
                    label="Lessons started"
                    value={startedLessons.length}
                    helper="Lessons opened or completed locally"
                />

                <MetricCard
                    label="Quiz progress"
                    value={`${quizProgress}%`}
                    helper={`${completedQuizzes.length}/${quizLessons.length} quizzes completed`}
                />

                <MetricCard accent="emerald"
                    label="Tracks completed"
                    value={`${multiTrackProgress.completedTracks}/${multiTrackProgress.totalTracks}`}
                    helper="Based on available tracks"
                />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    <PanelCard variant="default" accent="emerald" className="p-6">
                        <p className={`${typography.meta} text-emerald-300`}>
                            Progress overview
                        </p>

                        <h2 className={`mt-3 ${typography.cardTitle}`}>
                            {globalProgress}% of available lessons completed
                        </h2>

                        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                            <div
                                className="progress-glow h-full rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)] transition-all duration-700 ease-out"
                                style={{ width: `${globalProgress}%` }}
                            />
                        </div>
                    </PanelCard>

                    <div className="grid gap-6 md:grid-cols-2">
                        <MiniBarChart
                            title="Learning health"
                            items={learningHealth}
                            accent="emerald"
                        />

                        <MiniBarChart
                            title="Mock weekly activity"
                            items={mockedWeeklyActivity}
                            accent="blue"
                        />
                    </div>

                    <LearningDistribution getLessonStatus={getLessonStatus} />

                    <OwaspCoverageMap getLessonStatus={getLessonStatus} />

                    <PanelCard variant="elevated" accent="violet" className="p-6">
                        <p className={`${typography.meta} text-violet-300`}>
                            Mock activity
                        </p>

                        <div className="mt-5 space-y-3">
                            {mockedActivity.map((activity, index) => (
                                <div
                                    key={activity}
                                    className="flex items-center gap-4 rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/[0.06]"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-300/[0.10] font-mono text-xs text-violet-200 ring-1 ring-violet-300/[0.22]">
                                        {index + 1}
                                    </span>

                                    <p className="text-sm text-slate-300">
                                        {activity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </PanelCard>
                </div>

                <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                    <RecommendedLearning lesson={recommendedLesson} />

                    <PanelCard variant="subtle" accent="blue" className="p-6">
                        <AppBadge variant="blue">Learning insight</AppBadge>

                        <p className={`mt-4 ${typography.body}`}>
                            This dashboard is intentionally mocked and local-first. It shows
                            how analytics could support learning without requiring a backend.
                        </p>
                    </PanelCard>
                </aside>
            </section>
        </div>
    );
}
