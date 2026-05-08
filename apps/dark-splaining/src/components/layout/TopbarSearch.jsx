import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { lessons } from "../../data/lessons";
import { tracks } from "../../data/tracks";
import { glossaryTerms } from "../../data/glossary";
import AppBadge from "@dark/ui/components/AppBadge";

const staticResources = [
    {
        type: "Resources",
        title: "Resources",
        description: "Documentation hub and reference materials.",
        to: "/resources",
    },
    {
        type: "Resources",
        title: "Glossary",
        description: "Beginner-friendly cyber security definitions.",
        to: "/resources/glossary",
    },
    {
        type: "Resources",
        title: "PCI Compliance",
        description: "Introductory payment security notes.",
        to: "/resources/pci-compliance",
    },
];

const resultOrder = ["Lessons", "Tracks", "Glossary", "Resources"];

function isTypingTarget(element) {
    const tagName = element?.tagName?.toLowerCase();

    return (
        tagName === "input" ||
        tagName === "textarea" ||
        element?.isContentEditable
    );
}

function groupResults(results) {
    return resultOrder
        .map((type) => ({
            type,
            items: results.filter((item) => item.type === type),
        }))
        .filter((group) => group.items.length > 0);
}

export default function TopbarSearch({ variant = "desktop", onNavigate }) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const isMobile = variant === "mobile";

    const searchableItems = useMemo(() => {
        const lessonItems = lessons.map((lesson) => ({
            type: "Lessons",
            title: lesson.title,
            description: lesson.description,
            to: `/lessons/${lesson.id}`,
        }));

        const trackItems = tracks.map((track) => ({
            type: "Tracks",
            title: track.title,
            description: track.description,
            to: `/tracks/${track.id}`,
        }));

        const glossaryItems = glossaryTerms.map((term) => ({
            type: "Glossary",
            title: term.title,
            description: term.shortDescription,
            to: `/resources/glossary/${term.id}`,
        }));

        return [...lessonItems, ...trackItems, ...glossaryItems, ...staticResources];
    }, []);

    const results = searchableItems
        .filter((item) => {
            const searchableText = [item.type, item.title, item.description]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query.toLowerCase());
        })
        .slice(0, isMobile ? 10 : 12);

    const groupedResults = groupResults(results);

    function closeSearch() {
        setIsOpen(false);
        setQuery("");
    }

    function handleNavigate() {
        closeSearch();
        onNavigate?.();
    }

    useEffect(() => {
        if (isMobile) return;

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                closeSearch();
                inputRef.current?.blur();
            }

            if (event.key === "/" && !isTypingTarget(document.activeElement)) {
                event.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
        }

        function handlePointerDown(event) {
            if (!searchRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isMobile]);

    return (
        <div
            ref={searchRef}
            className={isMobile ? "w-full" : "relative hidden w-72 lg:block"}
        >
            <div className="relative">
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search lessons, glossary..."
                    className="w-full rounded-2xl bg-white/[0.035] px-4 py-3 pr-10 font-mono text-xs text-slate-200 outline-none ring-1 ring-white/[0.06] transition placeholder:text-slate-500 focus:bg-white/[0.065] focus:ring-blue-300/[0.28] lg:rounded-full lg:py-2"
                />

                {!isMobile && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-white/[0.035] px-1.5 py-0.5 font-mono text-[10px] text-slate-500 ring-1 ring-white/[0.06]">
                        /
                    </span>
                )}
            </div>

            {isOpen && query.trim().length > 0 && (
                <div
                    className={
                        isMobile
                            ? "ui-enter mt-3 overflow-hidden rounded-3xl bg-slate-950/75 ring-1 ring-white/[0.08]"
                            : "ui-enter absolute right-0 top-full z-50 mt-3 w-[28rem] overflow-hidden rounded-3xl bg-slate-950/95 shadow-2xl shadow-blue-950/30 ring-1 ring-white/[0.08] backdrop-blur-xl"
                    }
                >
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                            Search results
                        </p>

                        <button
                            type="button"
                            onClick={closeSearch}
                            className="rounded-full bg-white/[0.035] px-2 py-1 font-mono text-[10px] text-slate-400 ring-1 ring-white/[0.06] transition hover:text-blue-200 hover:ring-blue-300/[0.22]"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto p-2">
                        {groupedResults.length > 0 ? (
                            groupedResults.map((group) => (
                                <section key={group.type} className="py-2">
                                    <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                                        {group.type}
                                    </p>

                                    <div className="space-y-1">
                                        {group.items.map((item) => (
                                            <Link
                                                key={`${item.type}-${item.title}`}
                                                to={item.to}
                                                onClick={handleNavigate}
                                                className="block rounded-2xl px-4 py-3 transition hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/30"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="font-bold text-white">
                                                        {item.title}
                                                    </p>

                                                    <AppBadge variant="blue">
                                                        {item.type}
                                                    </AppBadge>
                                                </div>

                                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                                                    {item.description}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <p className="font-bold text-white">
                                    No result found
                                </p>
                                <p className="mt-2 text-sm text-slate-400">
                                    Try another keyword.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
