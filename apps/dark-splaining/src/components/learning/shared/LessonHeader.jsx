import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import { typography } from "../../../styles/ui";
import DomainBadge from "../../security/DomainBadge";
import { getLessonIdentity } from "../../../utils/lessonIdentity";

export default function LessonHeader({ lesson }) {
    const identity = getLessonIdentity(lesson);

    return (
        <PanelCard
            variant="hero"
            accent={identity.accent}
            animated
            className="md:p-10"
        >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <DomainBadge value={lesson.experience?.standard} />
                        <DomainBadge value={lesson.experience?.domain} />
                        <DomainBadge value={lesson.experience?.pillar} />

                        <AppBadge variant="emerald">{lesson.level}</AppBadge>
                        <AppBadge variant="violet">{lesson.duration}</AppBadge>
                    </div>

                    <h1 className={`mt-6 max-w-4xl ${typography.heroTitle}`}>
                        {lesson.title}
                    </h1>

                    <p className={`mt-6 max-w-2xl ${typography.bodyLarge}`}>
                        {lesson.description}
                    </p>
                </div>

                <div className="hidden min-w-52 bg-black/35 p-5 ring-1 ring-white/[0.08] lg:block">
                    <div
                        className={`flex h-14 w-14 items-center justify-center font-mono text-xl font-black ${identity.accent === "emerald"
                            ? "bg-emerald-300 text-slate-950"
                            : identity.accent === "violet"
                                ? "bg-violet-300 text-slate-950"
                                : identity.accent === "amber"
                                    ? "bg-amber-300 text-slate-950"
                                    : "bg-blue-300 text-slate-950"
                            }`}
                    >
                        {identity.symbol}
                    </div>

                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        lesson.identity
                    </p>

                    <p className="mt-2 font-mono text-sm font-black text-white">
                        {identity.code}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        {identity.mood}
                    </p>
                </div>
            </div>

            <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </PanelCard>
    );
}
