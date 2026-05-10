import { useState, useEffect } from "react";
import { lessons } from "../data/lessons";
import LessonCard from "../components/learning/LessonCard";
import PanelCard from "@dark/ui/components/PanelCard";
import { useLessonProgress } from "../hooks/useLessonProgress";
import PageHeader from "@dark/ui/components/PageHeader";
import SectionHeader from "@dark/ui/components/SectionHeader";
import AppButton from "@dark/ui/components/AppButton";
import AppBadge from "@dark/ui/components/AppBadge";
import EmptyState from "@dark/ui/components/EmptyState";
import { spacing, typography } from "../styles/ui";

const filters = [
    "All",
    "Web Security",
    "Identity",
    "Authorization",
    "System Security",
];

export default function LessonsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [confirmReset, setConfirmReset] = useState(false);
    const [showResetToast, setShowResetToast] = useState(false);
    const [progressFilter, setProgressFilter] = useState("All");

    useEffect(() => {
        if (!confirmReset) return;

        const timeoutId = window.setTimeout(() => {
            setConfirmReset(false);
        }, 3000);

        return () => window.clearTimeout(timeoutId);
    }, [confirmReset]);

    const { getLessonStatus, resetProgress } = useLessonProgress();

    function handleResetProgress() {
        if (!confirmReset) {
            setConfirmReset(true);
            return;
        }

        resetProgress();
        setConfirmReset(false);
        setShowResetToast(true);

        window.setTimeout(() => {
            setShowResetToast(false);
        }, 2200);
    }

    const availableLessons = lessons.filter(
        (lesson) => lesson.status !== "Coming soon"
    );

    const filteredLessons = lessons.filter((lesson) => {
        const matchesFilter =
            activeFilter === "All" || lesson.category === activeFilter;

        const searchableText = [
            lesson.title,
            lesson.category,
            lesson.description,
            lesson.level,
            lesson.track,
            lesson.status,
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchableText.includes(searchQuery.toLowerCase());

        const status = getLessonStatus(lesson.id);

        const matchesProgress =
            progressFilter === "All" ||
            progressFilter === status;

        return matchesFilter && matchesSearch && matchesProgress;
    });

    const stats = [
        { label: "Total lessons", value: lessons.length },
        { label: "Available", value: availableLessons.length },
        {
            label: "Categories",
            value: new Set(lessons.map((lesson) => lesson.category)).size,
        },
    ];

    const completableLessons = lessons.filter(
        (lesson) => lesson.status !== "Coming soon"
    );

    const completedCount = completableLessons.filter(
        (lesson) => getLessonStatus(lesson.id) === "completed"
    ).length;

    const progressPercent =
        completableLessons.length > 0
            ? Math.round((completedCount / completableLessons.length) * 100)
            : 0;

    return (
        <div className={spacing.page}>
            <PageHeader
                eyebrow="Lesson library"
                title="Explore all DarkSplaining lessons."
                description="Browse every available lesson, from beginner-friendly fundamentals to future advanced cyber security concepts."
                accent="blue"
                action={
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                        {stats.map((stat) => (
                            <PanelCard
                                key={stat.label}
                                variant="subtle"
                                accent="blue"
                                className="min-w-32 p-4"
                            >
                                <p className={`${typography.meta} text-slate-500`}>
                                    {stat.label}
                                </p>

                                <p className="mt-2 text-2xl font-extrabold text-white">
                                    {stat.value}
                                </p>
                            </PanelCard>
                        ))}
                    </div>
                }
            />

            <div className="flex flex-wrap gap-2">
                {[
                    ["All", "All progress"],
                    ["not-started", "Not started"],
                    ["in-progress", "In progress"],
                    ["completed", "Completed"],
                ].map(([value, label]) => {
                    const isActive = progressFilter === value;

                    return (
                        <button
                            key={value}
                            onClick={() => setProgressFilter(value)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
                                ? "bg-emerald-300/[0.12] text-emerald-100 ring-1 ring-emerald-300/[0.24]"
                                : "bg-white/[0.025] text-slate-400 ring-1 ring-white/[0.05] hover:bg-white/[0.055] hover:text-slate-200"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <section className="mb-10">
                <PanelCard variant="default" accent="emerald" className="p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className={`${typography.meta} text-emerald-300`}>
                                Learning progress
                            </p>

                            <h2 className={`mt-3 ${typography.cardTitle}`}>
                                {progressPercent}% completed
                            </h2>

                            <p className={`mt-2 ${typography.body}`}>
                                {completedCount} of {completableLessons.length} available
                                lessons completed.
                            </p>
                        </div>

                        <AppButton
                            type="button"
                            onClick={handleResetProgress}
                            variant={confirmReset ? "danger" : "secondary"}
                        >
                            {confirmReset ? "Confirm reset" : "Reset progress"}
                        </AppButton>
                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-950/70 ring-1 ring-white/[0.05]">
                        <div
                            className="h-full rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.45)] transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </PanelCard>
            </section>

            <section>
                <SectionHeader
                    eyebrow={`${filteredLessons.length} lessons found`}
                    title="Browse the catalog"
                    accent="blue"
                    action={
                        <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
                            <input
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Search a lesson..."
                                className="w-full rounded-full bg-white/[0.035] px-4 py-2 text-sm text-slate-200 outline-none ring-1 ring-white/[0.06] transition placeholder:text-slate-500 focus:bg-white/[0.06] focus:ring-blue-300/[0.24] md:w-80"
                            />

                            <div className="flex flex-wrap gap-2">
                                {filters.map((filter) => {
                                    const isActive = activeFilter === filter;
                                    const count =
                                        filter === "All"
                                            ? lessons.length
                                            : lessons.filter(
                                                (lesson) =>
                                                    lesson.category === filter
                                            ).length;

                                    return (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
                                                ? "bg-blue-300/[0.12] text-blue-100 ring-1 ring-blue-300/[0.24]"
                                                : "bg-white/[0.025] text-slate-400 ring-1 ring-white/[0.05] hover:bg-white/[0.055] hover:text-slate-200 hover:ring-white/[0.10]"
                                                }`}
                                        >
                                            {filter}
                                            <span className="ml-1 font-mono text-xs opacity-60">
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    }
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredLessons.map((lesson, index) => (
                        <LessonCard key={lesson.id} lesson={lesson} index={index} />
                    ))}
                </div>

                {filteredLessons.length === 0 && (
                    <EmptyState
                        eyebrow="No result"
                        title="No lesson found"
                        description="Try another keyword or reset the selected filter."
                        accent="blue"
                    />
                )}
            </section>

            {showResetToast && (
                <div className="fixed bottom-6 right-6 z-50">
                    <PanelCard
                        variant="elevated"
                        accent="emerald"
                        className="px-5 py-4"
                    >
                        <AppBadge variant="emerald">Progress reset</AppBadge>

                        <p className="mt-3 text-sm text-slate-300">
                            Your local learning progress has been cleared.
                        </p>
                    </PanelCard>
                </div>
            )}
        </div>
    );
}
