import { Link } from "react-router-dom";
import { getGlossaryTermById } from "../../../data/glossary";

export default function GlossaryTooltip({ termId, children }) {
    const term = getGlossaryTermById(termId);

    if (!term) {
        return <span>{children}</span>;
    }

    return (
        <span className="group relative inline-flex align-baseline">
            <button
                type="button"
                className="rounded-md bg-blue-300/[0.06] px-1.5 py-0.5 font-semibold text-blue-200 underline decoration-blue-300/40 underline-offset-4 ring-1 ring-blue-300/[0.16] transition hover:bg-blue-300/[0.10] hover:ring-blue-300/[0.28] focus:outline-none focus:ring-blue-300/[0.40]"
                aria-describedby={`glossary-tooltip-${term.id}`}
            >
                {children}
            </button>

            <span
                id={`glossary-tooltip-${term.id}`}
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-[80] mt-2 hidden w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl bg-slate-950/95 p-4 text-left shadow-2xl shadow-blue-950/30 ring-1 ring-white/[0.08] backdrop-blur-xl group-hover:block group-focus-within:block md:left-0 md:translate-x-0"
            >
                <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-blue-300">
                    Glossary preview
                </span>

                <span className="mt-2 block text-sm font-extrabold leading-5 text-white">
                    {term.title}
                </span>

                <span className="mt-2 block text-xs leading-5 text-slate-300">
                    {term.shortDescription}
                </span>

                <Link
                    to={`/concepts/${term.id}`}
                    className="pointer-events-auto mt-3 inline-flex font-mono text-xs font-bold text-blue-300 transition hover:text-blue-200 focus:outline-none focus:text-blue-100"
                >
                    Open glossary →
                </Link>
            </span>
        </span>
    );
}
