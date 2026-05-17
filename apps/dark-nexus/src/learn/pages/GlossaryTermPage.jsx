"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { glossaryTerms, getGlossaryTermById } from "../data/glossary";
import { lessons } from "../data/lessons";
import { recordConceptViewed } from "../services/splainingProgressEvents";

function getRelatedTerms(term) {
    if (!term?.relatedTermIds) return [];

    return term.relatedTermIds
        .map((termId) => glossaryTerms.find((item) => item.id === termId))
        .filter(Boolean);
}

export default function GlossaryTermPage({ termId }) {
    const term = getGlossaryTermById(termId);

    useEffect(() => {
        if (term?.id) {
            recordConceptViewed(term.id, {
                sourcePage: "glossary",
            });
        }
    }, [term?.id]);

    const relatedLessons = lessons.filter((lesson) =>
        lesson.relatedTermIds?.includes(termId)
    );

    const relatedTerms = getRelatedTerms(term);

    if (!term) {
        return (
            <div className="py-10">
                <Link href="/learn/resources/glossary"
                    className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to glossary
                </Link>

                <section className="max-w-3xl">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-300">
                        Not found
                    </p>

                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">
                        Glossary term not found.
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-slate-400">
                        This term does not exist yet. Return to the glossary to choose
                        another definition.
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className="py-10">
            <Link href="/learn/resources/glossary"
                className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to glossary
            </Link>

            <article className="max-w-4xl">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-300">
                    Glossary term
                </p>

                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                    {term.title}
                </h1>

                <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-slate-200">
                    {term.shortDescription}
                </p>

                <div className="mt-10 border-l border-blue-300/30 pl-5">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                        Explanation
                    </p>

                    <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                        {term.description}
                    </p>
                </div>

                {relatedTerms.length > 0 && (
                    <section className="mt-10 border-t border-white/10 pt-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                            Related terms
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            {relatedTerms.map((relatedTerm) => (
                                <Link
                                    key={relatedTerm.id}
                                    href={`/learn/concepts/${relatedTerm.id}`}
                                    className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-sm text-slate-300 transition hover:border-blue-300/30 hover:text-blue-200"
                                >
                                    {relatedTerm.title}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {relatedLessons.length > 0 && (
                    <section className="mt-10 border-t border-white/10 pt-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
                            Used in lessons
                        </p>

                        <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                            {relatedLessons.map((lesson) => (
                                <article
                                    key={lesson.id}
                                    className="grid gap-3 py-4 md:grid-cols-[1fr_auto] md:items-center"
                                >
                                    <div>
                                        <h2 className="font-mono text-base font-bold text-slate-200">
                                            {lesson.title}
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {lesson.description}
                                        </p>
                                    </div>

                                    <Link href={`/learn/lessons/${lesson.id}`}
                                        className="font-mono text-sm font-bold text-blue-300 transition hover:text-blue-200"
                                    >
                                        Open lesson →
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">
                        Beginner note
                    </p>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                        This definition is intentionally short and beginner-friendly. The
                        goal is to understand the concept before going deeper into technical
                        details.
                    </p>
                </div>
            </article>
        </div>
    );
}
