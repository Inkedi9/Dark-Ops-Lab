"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { glossaryTerms } from "../data/glossary";
import { lessons } from "../data/lessons";
import { handbookSections } from "../data/handbook";
import PageHeader from "@dark/ui/components/PageHeader";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import SectionHeader from "@dark/ui/components/SectionHeader";
import { radius, spacing, surface, typography } from "../styles/ui";

const categories = [
    "All",
    "Web Security",
    "Identity & Access",
    "SOC / Detection",
    "Secure Coding",
    "Glossary",
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

const resources = [
    {
        title: "Glossary",
        description:
            "Beginner-friendly explanations of common cyber security terms, protocols, attacks and defensive concepts.",
        to: "/learn/resources/glossary",
        status: "Available",
        category: "Glossary",
        level: "Beginner",
        type: "glossary",
        cta: "Open glossary",
    },
    {
        title: "PCI Compliance",
        description:
            "Future notes about payment security, compliance basics and secure handling of cardholder data.",
        to: "/learn/resources/pci-compliance",
        status: "Draft",
        category: "Secure Coding",
        level: "Intermediate",
        type: "external",
        cta: "Open notes",
    },
];

const beginnerLinks = [
    {
        title: "Guided tracks",
        description: "Follow a structured path instead of jumping between isolated concepts.",
        to: "/learn/tracks",
    },
    {
        title: "Lesson catalogue",
        description: "Browse short lessons for web security, identity and detection fundamentals.",
        to: "/learn/lessons",
    },
    {
        title: "Command basics",
        description: "Practice Linux and PowerShell commands in a safe mocked terminal.",
        to: "/learn/command-basics",
    },
];

const operationalBasics = [
    {
        title: "Linux Basics",
        description: "Navigation, file reading, searching, processes and networking commands.",
        to: "/learn/command-basics",
        level: "Beginner",
    },
    {
        title: "PowerShell Basics",
        description: "Core cmdlets for navigation, files, process inspection and connectivity checks.",
        to: "/learn/command-basics",
        level: "Beginner",
    },
];

function getTypeVariant(type) {
    if (type === "command") return "violet";
    if (type === "lesson") return "blue";
    if (type === "glossary") return "emerald";
    return "slate";
}

export default function ResourcesPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [level, setLevel] = useState("All");

    const conceptResources = useMemo(() => {
        return resources;
    }, []);

    const filteredResources = useMemo(() => {
        const query = search.trim().toLowerCase();

        return conceptResources.filter((resource) => {
            const matchesSearch =
                !query ||
                [resource.title, resource.description, resource.category, resource.type]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            const matchesCategory = category === "All" || resource.category === category;
            const matchesLevel = level === "All" || resource.level === level;

            return matchesSearch && matchesCategory && matchesLevel;
        });
    }, [category, conceptResources, level, search]);

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
            value: conceptResources.length,
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

            <section className="mb-12">
                <SectionHeader
                    eyebrow="Recommended for beginners"
                    title="Start from the right place"
                    accent="emerald"
                />

                <div className={`max-w-5xl divide-y divide-white/10 border-y ${surface.divider}`}>
                    {beginnerLinks.map((link) => (
                        <article
                            key={link.title}
                            className="grid gap-4 py-5 md:grid-cols-[1fr_auto] md:items-center"
                        >
                            <div>
                                <h2 className="font-mono text-lg font-bold tracking-tight text-slate-200">
                                    {link.title}
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                    {link.description}
                                </p>
                            </div>

                            <Link href={link.to}
                                className="font-mono text-sm font-bold text-emerald-300 transition hover:text-emerald-200"
                            >
                                Open →
                            </Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mb-12">
                <SectionHeader
                    eyebrow="Operational basics"
                    title="Command-line foundations"
                    accent="violet"
                />

                <div className={`max-w-5xl divide-y divide-white/10 border-y ${surface.divider}`}>
                    {operationalBasics.map((item) => (
                        <article
                            key={item.title}
                            className="grid gap-4 py-5 md:grid-cols-[1fr_auto] md:items-center"
                        >
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="font-mono text-lg font-bold tracking-tight text-slate-200">
                                        {item.title}
                                    </h2>
                                    <AppBadge variant="violet">{item.level}</AppBadge>
                                </div>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                    {item.description}
                                </p>
                            </div>

                            <Link href={item.to}
                                className="font-mono text-sm font-bold text-violet-300 transition hover:text-violet-200"
                            >
                                Practice →
                            </Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mb-14">
                <SectionHeader
                    eyebrow="Concept library"
                    title="Find the concept you need"
                    description="Search lessons, glossary references and command basics without leaving the learning flow."
                    accent="blue"
                />

                <div className={`mb-6 max-w-5xl border-y ${surface.divider} py-4`}>
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                        <label className="block">
                            <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                Search
                            </span>
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search SQL, MFA, Linux, glossary..."
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-300/40 focus:bg-slate-950/70"
                            />
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                                <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                    Category
                                </span>
                                <select
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-300/40"
                                >
                                    {categories.map((item) => (
                                        <option key={item}>{item}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                                    Level
                                </span>
                                <select
                                    value={level}
                                    onChange={(event) => setLevel(event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-300/40"
                                >
                                    {levels.map((item) => (
                                        <option key={item}>{item}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                <div className={`max-w-5xl divide-y divide-white/10 border-y ${surface.divider}`}>
                    {filteredResources.map((resource) => (
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
                                    <AppBadge variant={getTypeVariant(resource.type)}>
                                        {resource.type}
                                    </AppBadge>
                                </div>

                                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                                    {resource.description}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-blue-300/15 bg-blue-300/[0.06] px-3 py-1 font-mono text-xs text-blue-200">
                                        {resource.category}
                                    </span>
                                    <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 font-mono text-xs text-slate-400">
                                        {resource.level}
                                    </span>
                                </div>
                            </div>

                            <Link href={resource.to}
                                className="font-mono text-sm font-bold text-blue-300 transition hover:text-blue-200"
                            >
                                {resource.cta || "Open"} →
                            </Link>
                        </article>
                    ))}

                    {filteredResources.length === 0 && (
                        <div className="py-10">
                            <p className="font-mono text-sm font-bold text-slate-200">
                                No concept found.
                            </p>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                                Try a broader search, switch the category back to All, or reset
                                the level filter.
                            </p>
                        </div>
                    )}
                </div>
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
                                        href={`/learn/resources/handbook/${item.id}`}
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
