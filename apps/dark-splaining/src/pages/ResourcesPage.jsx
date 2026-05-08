import { Link } from "react-router-dom";
import { glossaryTerms } from "../data/glossary";
import { lessons } from "../data/lessons";
import { handbookSections } from "../data/handbook";
import PageHeader from "@dark/ui/components/PageHeader";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import { radius, spacing, surface, typography } from "../styles/ui";

const resources = [
    {
        title: "Glossary",
        description:
            "Beginner-friendly explanations of common cyber security terms, protocols, attacks and defensive concepts.",
        to: "/resources/glossary",
        status: "Available",
    },
    {
        title: "PCI Compliance",
        description:
            "Future notes about payment security, compliance basics and secure handling of cardholder data.",
        to: "/resources/pci-compliance",
        status: "Draft",
    },
];

export default function ResourcesPage() {
    const learningLinksCount = lessons.reduce((total, lesson) => {
        return total + (lesson.relatedTermIds?.length || 0);
    }, 0);

    const stats = [
        {
            label: "Glossary terms",
            value: glossaryTerms.length,
        },
        {
            label: "Learning links",
            value: learningLinksCount,
        },
        {
            label: "Resources",
            value: resources.length,
        },
    ];

    return (
        <div className={spacing.page}>
            <PageHeader
                eyebrow="Resources"
                title="Reference materials for cyber learning."
                description="Quick, beginner-friendly references connected to lessons, tracks and practical exercises."
            />

            <section className="mb-12 grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <PanelCard
                        key={stat.label}
                        variant="subtle"
                        accent="blue"
                        className="p-5"
                    >
                        <p className={`${typography.meta} text-slate-500`}>
                            {stat.label}
                        </p>

                        <p className="mt-3 text-3xl font-extrabold text-white">
                            {stat.value}
                        </p>
                    </PanelCard>
                ))}
            </section>

            <section className={`max-w-5xl divide-y divide-white/10 border-y ${surface.divider}`}>
                {resources.map((resource) => (
                    <article
                        key={resource.title}
                        className="grid gap-5 py-7 md:grid-cols-[1fr_auto] md:items-center"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="font-mono text-2xl font-bold tracking-tight text-slate-200">
                                    {resource.title}
                                </h2>

                                <AppBadge
                                    variant={resource.status === "Available" ? "emerald" : "slate"}
                                >
                                    {resource.status}
                                </AppBadge>
                            </div>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                                {resource.description}
                            </p>
                        </div>

                        <Link
                            to={resource.to}
                            className="font-mono text-sm font-bold text-blue-300 transition hover:text-blue-200"
                        >
                            Open →
                        </Link>
                    </article>
                ))}
            </section>

            <section className="mt-14">
                <div className="mb-8 max-w-3xl">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-300">
                        Handbook
                    </p>

                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
                        Structured cyber concepts.
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-slate-400">
                        Explore grouped concepts across networking, identity, web architecture and
                        detection. These notes are short, beginner-friendly and designed to
                        support the lessons.
                    </p>
                </div>

                <div className="space-y-10">
                    {handbookSections.map((section) => (
                        <section key={section.id}>
                            <div className="mb-4 flex items-end justify-between gap-4">
                                <div>
                                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                        Section
                                    </p>

                                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                                        {section.title}
                                    </h3>
                                </div>

                                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 font-mono text-xs text-slate-400">
                                    {section.items.length} concepts
                                </span>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/resources/handbook/${item.id}`}
                                        className={`block ${radius.panel} border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/[0.055]`}
                                    >
                                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
                                            {section.title}
                                        </p>

                                        <h4 className="mt-4 text-xl font-extrabold tracking-tight text-white">
                                            {item.title}
                                        </h4>

                                        <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">
                                            {item.shortDescription}
                                        </p>

                                        <div className="mt-5 border-t border-white/10 pt-4">
                                            <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                                                {item.description}
                                            </p>
                                        </div>

                                        {item.related?.length > 0 && (
                                            <div className="mt-5 flex flex-wrap gap-2">
                                                {item.related.slice(0, 3).map((relatedId) => (
                                                    <span
                                                        key={relatedId}
                                                        className="rounded-full border border-blue-300/15 bg-blue-300/[0.06] px-3 py-1 font-mono text-xs text-blue-200"
                                                    >
                                                        {relatedId}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p className="mt-5 font-mono text-sm font-bold text-blue-300">
                                            Open concept →
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </section>
        </div>
    );
}
