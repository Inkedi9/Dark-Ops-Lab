import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmptyState from "@dark/ui/components/EmptyState";
import AppBadge from "@dark/ui/components/AppBadge";
import PanelCard from "@dark/ui/components/PanelCard";
import { getGlossaryTermById, glossaryTerms } from "../data/glossary";
import { lessons } from "../data/lessons";
import { tracks } from "../data/tracks";
import { commandBasics } from "../data/commandBasics";
import { spacing, surface } from "../styles/ui";
import { recordConceptViewed } from "../services/splainingProgressEvents";

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

function resolveRelatedLessons(concept) {
    const explicitLessons = concept.relatedLessons
        .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId));

    const linkedLessons = lessons.filter((lesson) =>
        lesson.relatedTermIds?.includes(concept.id)
    );

    return uniqueById([...explicitLessons, ...linkedLessons]);
}

function resolveRelatedTracks(concept, relatedLessons) {
    const explicitTracks = concept.relatedTracks
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

export default function ConceptDetailPage() {
    const { conceptId } = useParams();
    const concept = getGlossaryTermById(conceptId);

    useEffect(() => {
        if (concept?.id) {
            recordConceptViewed(concept.id, {
                sourcePage: "concept",
            });
        }
    }, [concept?.id]);

    if (!concept) {
        return (
            <div className={spacing.page}>
                <EmptyState
                    eyebrow="Concept not found"
                    title="This concept is not in the library yet."
                    description="Return to resources to browse the available glossary and handbook concepts."
                    actionLabel="Back to resources"
                    actionTo="/resources"
                    accent="amber"
                />
            </div>
        );
    }

    const relatedLessons = resolveRelatedLessons(concept);
    const relatedTracks = resolveRelatedTracks(concept, relatedLessons);
    const relatedCommands = concept.relatedCommands
        .map((commandId) => commandBasics.find((module) => module.id === commandId))
        .filter(Boolean);
    const relatedConcepts = concept.relatedConcepts
        .map((termId) => glossaryTerms.find((term) => term.id === termId))
        .filter(Boolean);
    const accent = getBadgeVariant(concept.category);

    return (
        <div className={spacing.page}>
            <Link
                to="/resources/glossary"
                className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to glossary
            </Link>

            <article className="max-w-5xl">
                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-3">
                        <AppBadge variant={accent}>{concept.category}</AppBadge>
                        <AppBadge variant="slate">{concept.level}</AppBadge>
                    </div>

                    <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-blue-300">
                        Concept detail
                    </p>

                    <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                        {concept.term}
                    </h1>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                        {concept.shortDescription}
                    </p>
                </header>

                <section className={`divide-y divide-white/10 border-y ${surface.divider}`}>
                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                            Definition
                        </p>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                            {concept.definition}
                        </p>
                    </div>

                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                            Why it matters
                        </p>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                            {concept.whyItMatters}
                        </p>
                    </div>

                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
                            How attackers use it
                        </p>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                            {concept.attackerUse}
                        </p>
                    </div>

                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">
                            Defender tip
                        </p>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                            {concept.defenderTip}
                        </p>
                    </div>

                    <div className="py-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
                            Common mistakes
                        </p>
                        <ul className="mt-4 max-w-3xl space-y-3 text-sm leading-7 text-slate-400">
                            {concept.commonMistakes.map((mistake) => (
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

                        {relatedConcepts.map((relatedConcept) => (
                            <LinkRow
                                key={`concept-${relatedConcept.id}`}
                                title={relatedConcept.term}
                                description={relatedConcept.shortDescription}
                                to={`/concepts/${relatedConcept.id}`}
                                cta="Open concept"
                            />
                        ))}

                        {relatedLessons.length === 0 &&
                            relatedTracks.length === 0 &&
                            relatedCommands.length === 0 &&
                            relatedConcepts.length === 0 && (
                                <div className="py-5 text-sm leading-6 text-slate-400">
                                    No linked learning path yet. This concept can still be used as
                                    a quick standalone reference.
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
                        Study note
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                        Keep the definition simple first, then connect it to a lesson,
                        command, or track when you want practice. The goal is understanding
                        before memorization.
                    </p>
                </PanelCard>
            </article>
        </div>
    );
}
