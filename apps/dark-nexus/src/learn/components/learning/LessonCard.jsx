"use client";

import Link from "next/link";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import { useLessonProgress } from "../../hooks/useLessonProgress";
import DomainBadge from "../security/DomainBadge";
import { getLessonIdentity } from "../../utils/lessonIdentity";

function formatTrack(track) {
    if (!track) return "General";
    return track.replace("-", " ");
}

const progressLabels = {
    "not-started": "Not started",
    "in-progress": "In progress",
    completed: "Completed",
};

const progressVariants = {
    "not-started": "slate",
    "in-progress": "amber",
    completed: "emerald",
};

export default function LessonCard({ lesson, index }) {
    const isDisabled = lesson.status === "Coming soon";
    const { getLessonStatus } = useLessonProgress();
    const progressStatus = getLessonStatus(lesson.id);
    const identity = getLessonIdentity(lesson);

    return (
        <PanelCard
            variant="elevated"
            accent={identity.accent}
            hover={!isDisabled}
            className={`group relative overflow-hidden p-5 ${isDisabled ? "opacity-60" : ""
                }`}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-mono text-xs text-slate-500">
                        LESSON {String(index + 1).padStart(2, "0")}
                    </p>

                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
                        {identity.code}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`flex h-8 w-8 items-center justify-center font-mono text-xs font-black ${identity.accent === "emerald"
                            ? "bg-emerald-300 text-slate-950"
                            : identity.accent === "violet"
                                ? "bg-violet-300 text-slate-950"
                                : identity.accent === "amber"
                                    ? "bg-amber-300 text-slate-950"
                                    : "bg-blue-300 text-slate-950"
                            }`}
                    >
                        {identity.symbol}
                    </span>

                    <AppBadge
                        variant={
                            lesson.status === "New"
                                ? "emerald"
                                : lesson.status === "Available"
                                    ? "blue"
                                    : "slate"
                        }
                    >
                        {lesson.status}
                    </AppBadge>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <DomainBadge value={lesson.experience?.standard} compact />
                <DomainBadge value={lesson.experience?.domain} compact />
                <AppBadge variant="slate">{formatTrack(lesson.track)}</AppBadge>
            </div>

            <h3 className="mt-5 text-lg font-extrabold tracking-tight text-white">
                {lesson.title}
            </h3>

            <p className="mt-3 min-h-[3rem] text-sm leading-6 text-slate-400">
                {lesson.description}
            </p>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>
                        {lesson.level} • {lesson.duration}
                    </span>

                    <AppBadge variant={progressVariants[progressStatus]}>
                        {progressLabels[progressStatus]}
                    </AppBadge>
                </div>

                {isDisabled ? (
                    <button
                        disabled
                        className="w-full cursor-not-allowed rounded-lg bg-white/[0.03] py-2 text-sm font-bold text-slate-500 ring-1 ring-white/[0.06]"
                    >
                        Coming soon
                    </button>
                ) : (
                    <Link href={`/learn/lessons/${lesson.id}`}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-blue-300/14 bg-blue-400/[0.055] py-2.5 text-sm font-bold text-blue-100 transition hover:border-blue-300/25 hover:bg-blue-400/[0.08]"
                    >
                        Open lesson →
                    </Link>
                )}
            </div>
        </PanelCard>
    );
}
