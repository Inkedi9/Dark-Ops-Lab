import AppBadge from "@dark/ui/components/AppBadge";
import SectionHeader from "@dark/ui/components/SectionHeader";
import DomainBadge from "../../security/DomainBadge";
import { getLessonIdentity } from "../../../utils/lessonIdentity";

export default function LessonHeader({ lesson }) {
    const identity = getLessonIdentity(lesson);

    return (
        <section>
            <SectionHeader
                eyebrow="Lesson module"
                title={lesson.title}
                description={lesson.description}
                accent={identity.accent}
                mode="nexus"
                className="mb-5"
                action={
                    <div className="hidden min-w-52 rounded-2xl border border-white/[0.08] bg-black/25 p-5 backdrop-blur ring-1 ring-white/[0.04] lg:block">
                        <div
                            className={`flex h-14 w-14 items-center justify-center rounded-xl font-mono text-xl font-black ${identity.accent === "emerald"
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
                }
            />

            <div className="flex flex-wrap items-center gap-3">
                <DomainBadge value={lesson.experience?.standard} />
                <DomainBadge value={lesson.experience?.domain} />
                <DomainBadge value={lesson.experience?.pillar} />

                <AppBadge variant="emerald">{lesson.level}</AppBadge>
                <AppBadge variant="violet">{lesson.duration}</AppBadge>
            </div>

            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/25 p-4 backdrop-blur ring-1 ring-white/[0.04] lg:hidden">
                <div className="flex items-start gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-lg font-black ${identity.accent === "emerald"
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

                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                            lesson.identity
                        </p>
                        <p className="mt-1 font-mono text-sm font-black text-white">
                            {identity.code}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                            {identity.mood}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
