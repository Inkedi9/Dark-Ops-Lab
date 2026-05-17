import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lessons } from "../../data/lessons";
import { tracks } from "../../data/tracks";
import { glossaryTerms } from "../../data/glossary";
import { handbookSections } from "../../data/handbook";

const staticPages = [
    { type: "Page", title: "Home", to: "/" },
    { type: "Page", title: "Lessons", to: "/lessons" },
    { type: "Page", title: "Tracks", to: "/tracks" },
    { type: "Page", title: "Resources", to: "/resources" },
    { type: "Page", title: "Glossary", to: "/resources/glossary" },
    { type: "Page", title: "Analytics", to: "/analytics" },
];

export default function CommandPalette({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const inputRef = useRef(null);
    const navigate = useNavigate();

    const items = useMemo(() => {
        const handbookItems = handbookSections.flatMap((section) =>
            section.items.map((item) => ({
                type: "Handbook",
                title: item.title,
                description: item.shortDescription,
                to: `/resources/handbook/${item.id}`,
            }))
        );

        return [
            ...staticPages,
            ...lessons.map((lesson) => ({
                type: "Lesson",
                title: lesson.title,
                description: lesson.description,
                to: `/lessons/${lesson.id}`,
            })),
            ...tracks.map((track) => ({
                type: "Track",
                title: track.title,
                description: track.description,
                to: `/tracks/${track.id}`,
            })),
            ...glossaryTerms.map((term) => ({
                type: "Glossary",
                title: term.title,
                description: term.shortDescription,
                to: `/concepts/${term.id}`,
            })),
            ...handbookItems,
        ];
    }, []);

    const results = items
        .filter((item) => {
            const text = [item.type, item.title, item.description || ""]
                .join(" ")
                .toLowerCase();

            return text.includes(query.toLowerCase());
        })
        .slice(0, 10);

    const closePalette = useCallback(function closePalette() {
        setQuery("");
        setActiveIndex(0);
        onClose();
    }, [onClose]);

    const openResult = useCallback(function openResult(item) {
        if (!item) return;

        navigate(item.to);
        closePalette();
    }, [closePalette, navigate]);

    useEffect(() => {
        if (!isOpen) return;

        window.setTimeout(() => {
            setQuery("");
            setActiveIndex(0);
            inputRef.current?.focus();
        }, 0);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                event.preventDefault();
                closePalette();
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((current) =>
                    results.length === 0 ? 0 : (current + 1) % results.length
                );
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((current) =>
                    results.length === 0
                        ? 0
                        : (current - 1 + results.length) % results.length
                );
            }

            if (event.key === "Enter") {
                event.preventDefault();
                openResult(results[activeIndex]);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, results, activeIndex, closePalette, openResult]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 backdrop-blur-md"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    closePalette();
                }
            }}
        >
            <section className="mt-24 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-blue-300/20 bg-slate-950/95 shadow-2xl shadow-blue-950/30">
                <div className="border-b border-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-blue-300">⌘K</span>

                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setActiveIndex(0);
                            }}
                            placeholder="Search lessons, tracks, glossary..."
                            className="w-full bg-transparent font-mono text-sm text-slate-100 outline-none placeholder:text-slate-600"
                        />

                        <button
                            type="button"
                            onClick={closePalette}
                            className="rounded-full border border-white/10 bg-white/[0.035] px-2 py-1 font-mono text-[10px] text-slate-400 transition hover:text-blue-200"
                        >
                            Esc
                        </button>
                    </div>
                </div>

                <div className="max-h-[28rem] overflow-y-auto p-2">
                    {results.length > 0 ? (
                        results.map((item, index) => {
                            const isActive = index === activeIndex;

                            return (
                                <button
                                    key={`${item.type}-${item.title}`}
                                    type="button"
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => openResult(item)}
                                    className={`w-full rounded-2xl px-4 py-3 text-left transition ${isActive
                                        ? "bg-blue-300/10 ring-1 ring-blue-300/30"
                                        : "hover:bg-white/[0.05]"
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-bold text-white">{item.title}</p>

                                        <span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-2 py-1 font-mono text-[10px] text-blue-200">
                                            {item.type}
                                        </span>
                                    </div>

                                    {item.description && (
                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                                            {item.description}
                                        </p>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="px-4 py-8 text-center">
                            <p className="font-bold text-white">No result found</p>
                            <p className="mt-2 text-sm text-slate-400">
                                Try another keyword.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                        ↑ ↓ Navigate
                    </p>

                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                        Enter Open
                    </p>
                </div>
            </section>
        </div>
    );
}
