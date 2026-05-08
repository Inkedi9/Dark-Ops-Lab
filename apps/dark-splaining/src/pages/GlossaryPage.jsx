import { useState } from "react";
import { Link } from "react-router-dom";
import { glossaryTerms } from "../data/glossary";

const alphabetFilters = ["All", ...Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")];

export default function GlossaryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeLetter, setActiveLetter] = useState("All");

    const filteredTerms = glossaryTerms.filter((term) => {
        const matchesSearch = [term.title, term.shortDescription]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesLetter =
            activeLetter === "All" || term.title.startsWith(activeLetter);

        return matchesSearch && matchesLetter;
    });

    return (
        <div className="py-10">
            <Link
                to="/resources"
                className="mb-6 inline-flex font-mono text-sm text-slate-400 transition hover:text-blue-300"
            >
                ← Back to resources
            </Link>

            <section className="mb-10">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-300">
                    Glossary
                </p>

                <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                    Cyber security terms, explained simply.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                    A lightweight reference for common cyber security words and concepts.
                </p>
            </section>

            <section className="mb-10 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                            {filteredTerms.length} terms found
                        </p>
                    </div>

                    <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search a term..."
                        className="w-full rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-blue-300/40 lg:w-80"
                    />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    {alphabetFilters.map((letter) => {
                        const isActive = activeLetter === letter;

                        return (
                            <button
                                key={letter}
                                type="button"
                                onClick={() => setActiveLetter(letter)}
                                className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${isActive
                                    ? "border-blue-300/40 bg-blue-300/15 text-blue-100"
                                    : "border-white/10 bg-white/[0.035] text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                {letter}
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="space-y-10">
                {filteredTerms.map((term) => (
                    <article key={term.id} className="max-w-4xl">
                        <h2 className="font-mono text-xl font-bold tracking-tight text-slate-300">
                            {term.title}
                        </h2>

                        <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-slate-100">
                            {term.shortDescription}
                        </p>

                        <Link
                            to={`/resources/glossary/${term.id}`}
                            className="mt-2 inline-flex font-mono text-sm text-blue-300 transition hover:text-blue-200"
                        >
                            More →
                        </Link>
                    </article>
                ))}

                {filteredTerms.length === 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center">
                        <p className="font-bold text-white">No term found</p>
                        <p className="mt-2 text-sm text-slate-400">
                            Try another keyword or reset the selected letter.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
