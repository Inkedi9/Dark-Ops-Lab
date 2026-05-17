import { glossaryTerms } from "../../../data/glossary";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import { Link } from "react-router-dom";

export default function RelatedResources({ termIds = [] }) {
    const relatedTerms = termIds
        .map((termId) => glossaryTerms.find((term) => term.id === termId))
        .filter(Boolean);

    if (relatedTerms.length === 0) return null;

    return (
        <PanelCard variant="elevated" accent="blue" className="p-6">
            <AppBadge variant="blue">Related resources</AppBadge>

            <h2 className="mt-4 text-xl font-extrabold tracking-tight text-white">
                Useful glossary terms
            </h2>

            <div className="mt-5 space-y-3">
                {relatedTerms.map((term) => (
                    <div
                        key={term.id}
                        className="grid gap-3 rounded-2xl bg-slate-950/35 p-4 ring-1 ring-white/[0.05] md:grid-cols-[1fr_auto] md:items-center"
                    >
                        <div>
                            <h3 className="font-mono text-base font-bold text-slate-200">
                                {term.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                {term.shortDescription}
                            </p>
                        </div>

                        <Link
                            to={`/concepts/${term.id}`}
                            className="font-mono text-sm font-bold text-blue-300 transition hover:text-blue-200"
                        >
                            More →
                        </Link>
                    </div>
                ))}
            </div>
        </PanelCard>
    );
}

