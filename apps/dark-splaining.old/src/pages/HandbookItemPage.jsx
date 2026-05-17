import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmptyState from "@dark/ui/components/EmptyState";
import AppBadge from "@dark/ui/components/AppBadge";
import PanelCard from "@dark/ui/components/PanelCard";
import {
    getHandbookItemById,
    getRelatedHandbookItems,
} from "../data/handbook";
import { lessons } from "../data/lessons";
import { tracks } from "../data/tracks";
import { commandBasics } from "../data/commandBasics";
import { spacing, surface } from "../styles/ui";

function uniqueById(items) {
    return Array.from(new Map(items.filter(Boolean).map((item) => [item.id, item])).values());
}

function getBadgeVariant(category) {
    if (category === "Identity & Access") return "violet";
    if (category === "SOC / Detection") return "emerald";
    if (category === "Secure Coding") return "amber";
    if (category === "Command Basics") return "slate";
    return "blue";
}

function resolveRelatedLessons(item) {
    const explicitLessons = item.relatedLessons
        .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId));

    const linkedLessons = lessons.filter((lesson) =>
        lesson.relatedConcepts?.includes(item.id)
    );

    return uniqueById([...explicitLessons, ...linkedLessons]);
}

function resolveRelatedTracks(item, relatedLessons) {
    const explicitTracks = item.relatedTracks
        .map((trackId) => tracks.find((track) => track.id === trackId));

    const lessonIds = relatedLessons.map((lesson) => lesson.id);
    const linkedTracks = tracks.filter((track) =>
        track.lessonIds?.some((lessonId) => lessonIds.includes(lessonId))
    );

    return uniqueById([...explicitTracks, ...linkedTracks]);
}

function LinkRow({ title, description, to, cta = "Open" }) {
    return (
        <article className="grid gap-3 py-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
                <h3 className="font-mono text-base font-bold text-slate-200">
                    {title}
                </h3>
                {description && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                        {description}
                    </p>
                )}
            </div>

            <Link
                to={to}
                className="font-mono text-sm font-bold text-blue-300 transition hover:text-blue-200"
            >
                {cta} →
            </Link>
        </article>
    );
}

export default function HandbookItemPage() {
    const { itemId } = useParams();

    const item = getHandbookItemById(itemId);

    if (!item) {
        return (
            <div className={spacing.page}>
                <EmptyState
                    eyebrow="Handbook concept not found"
                    title="This handbook concept is not available yet."
                    description="Return to resources to browse the current structured cyber concepts."
                    actionLabel="Back to resources"
                    actionTo="/resources"
                    accent="amber"
                />
            </div>
        );
    }

    const relatedItems = getRelatedHandbookItems(item);
    const relatedLessons = resolveRelatedLessons(item);
    const relatedTracks = resolveRelatedTracks(item, relatedLessons);
    const relatedCommands = item.relatedCommands
        .map((commandId) => commandBasics.find((module) => module.id === commandId))
        .filter(Boolean);
    const accent = getBadgeVariant(item.category);

    return (
        <div className={spacing.page}>
            <Link
                to="/resources"
                className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to resources
            </Link>

            <article className="max-w-5xl">
                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-3">
                        <AppBadge variant={accent}>{item.category}</AppBadge>
                        <AppBadge variant="slate">{item.level}</AppBadge>
                    </div>

                    <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-violet-300">
                        Handbook / {item.sectionTitle}
                    </p>

                    <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                        {item.title}
                    </h1>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                        {item.shortDescription}
                    </p>
                </header>

                <section className={`divide-y divide-white/10 border-y ${surface.divider}`}>
                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                            Definition
                        </p>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                            {item.definition}
                        </p>
                    </div>

                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                            Why it matters
                        </p>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                            {item.whyItMatters}
                        </p>
                    </div>

                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
                            How attackers use it
                        </p>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                            {item.attackerUse}
                        </p>
                    </div>

                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">
                            Defender tip
                        </p>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                            {item.defenderTip}
                        </p>
                    </div>

                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
                            Common mistakes
                        </p>
                        <ul className="mt-4 max-w-3xl space-y-3 text-sm leading-7 text-slate-400">
                            {item.commonMistakes.map((mistake) => (
                                <li key={mistake} className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300/70" />
                                    <span>{mistake}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="mt-10">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                        Related learning
                    </p>

                    <div className={`mt-5 divide-y divide-white/10 border-y ${surface.divider}`}>
                        {relatedLessons.map((lesson) => (
                            <LinkRow
                                key={`lesson-${lesson.id}`}
                                title={lesson.title}
                                description={lesson.description}
                                to={`/lessons/${lesson.id}`}
                                cta="Open lesson"
                            />
                        ))}

                        {relatedTracks.map((track) => (
                            <LinkRow
                                key={`track-${track.id}`}
                                title={track.title}
                                description={track.description}
                                to={`/tracks/${track.id}`}
                                cta="Open track"
                            />
                        ))}

                        {relatedCommands.map((module) => (
                            <LinkRow
                                key={`command-${module.id}`}
                                title={module.title}
                                description={module.description}
                                to="/command-basics"
                                cta="Practice"
                            />
                        ))}

                        {relatedItems.map((relatedItem) => (
                            <LinkRow
                                key={`handbook-${relatedItem.id}`}
                                title={relatedItem.title}
                                description={relatedItem.shortDescription}
                                to={`/resources/handbook/${relatedItem.id}`}
                                cta="Open concept"
                            />
                        ))}

                        {relatedLessons.length === 0 &&
                            relatedTracks.length === 0 &&
                            relatedCommands.length === 0 &&
                            relatedItems.length === 0 && (
                                <div className="py-5 text-sm leading-6 text-slate-400">
                                    No linked learning path yet. This handbook item can still
                                    be used as a standalone reference.
                                </div>
                            )}
                    </div>
                </section>

                <PanelCard
                    variant="subtle"
                    accent={accent}
                    className="mt-10 p-5"
                >
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                        Handbook note
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                        This note is designed to build a mental model first. Use the
                        related learning links when you want to turn the concept into
                        practice.
                    </p>
                </PanelCard>
            </article>
        </div>
    );
}
