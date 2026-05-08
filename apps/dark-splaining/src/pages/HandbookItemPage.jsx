import { Link, useParams } from "react-router-dom";
import {
    getHandbookItemById,
    getRelatedHandbookItems,
} from "../data/handbook";

export default function HandbookItemPage() {
    const { itemId } = useParams();

    const item = getHandbookItemById(itemId);
    const relatedItems = getRelatedHandbookItems(item);

    if (!item) {
        return (
            <div className="py-10">
                <Link
                    to="/resources"
                    className="mb-8 inline-flex font-mono text-sm text-slate-400 transition hover:text-blue-300"
                >
                    ← Back to resources
                </Link>

                <section className="max-w-3xl">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-300">
                        Not found
                    </p>

                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">
                        Handbook concept not found.
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-slate-400">
                        This concept does not exist yet. Return to resources to choose
                        another handbook item.
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className="py-10">
            <Link
                to="/resources"
                className="mb-8 inline-flex font-mono text-sm text-slate-400 transition hover:text-blue-300"
            >
                ← Back to resources
            </Link>

            <article className="max-w-4xl">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-300">
                    Handbook / {item.sectionTitle}
                </p>

                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                    {item.title}
                </h1>

                <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-slate-200">
                    {item.shortDescription}
                </p>

                <div className="mt-10 border-l border-violet-300/30 pl-5">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                        Explanation
                    </p>

                    <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                        {item.description}
                    </p>
                </div>

                {relatedItems.length > 0 && (
                    <section className="mt-10 border-t border-white/10 pt-8">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                            Related handbook concepts
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            {relatedItems.map((relatedItem) => (
                                <Link
                                    key={relatedItem.id}
                                    to={`/resources/handbook/${relatedItem.id}`}
                                    className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-sm text-slate-300 transition hover:border-blue-300/30 hover:text-blue-200"
                                >
                                    {relatedItem.title}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">
                        Beginner note
                    </p>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                        This handbook note is intentionally short. The goal is to build a
                        clear mental model before going deeper into technical details.
                    </p>
                </div>
            </article>
        </div>
    );
}
