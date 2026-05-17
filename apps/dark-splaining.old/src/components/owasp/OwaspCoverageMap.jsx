import { lessons } from "../../data/lessons";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

const owaspItems = [
    { id: "A01", title: "Broken Access Control" },
    { id: "A02", title: "Cryptographic Failures" },
    { id: "A03", title: "Injection" },
    { id: "A04", title: "Insecure Design" },
    { id: "A05", title: "Security Misconfiguration" },
    { id: "A06", title: "Vulnerable Components" },
    { id: "A07", title: "Identification & Authentication" },
    { id: "A08", title: "Software & Data Integrity" },
    { id: "A09", title: "Logging & Monitoring" },
    { id: "A10", title: "SSRF" },
];

export default function OwaspCoverageMap({ getLessonStatus }) {
    const coverage = owaspItems.map((item) => {
        const matchedLessons = lessons.filter(
            (lesson) => lesson.experience?.owaspId === item.id
        );

        const completed = matchedLessons.filter(
            (lesson) => getLessonStatus?.(lesson.id) === "completed"
        ).length;

        const percent =
            matchedLessons.length > 0
                ? Math.round((completed / matchedLessons.length) * 100)
                : 0;

        return {
            ...item,
            total: matchedLessons.length,
            completed,
            percent,
        };
    });

    return (
        <PanelCard variant="elevated" accent="violet" className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <AppBadge variant="violet">OWASP coverage map</AppBadge>

                    <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                        Coverage by security category
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                        A visual map of how your lessons connect to OWASP-style security
                        domains.
                    </p>
                </div>

                <AppBadge variant="slate">Portfolio signal</AppBadge>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
                {coverage.map((item) => {
                    const isCovered = item.total > 0;

                    return (
                        <div
                            key={item.id}
                            className={`rounded-xl bg-slate-950/40 p-4 ring-1 transition ${isCovered
                                    ? "ring-violet-300/[0.16]"
                                    : "opacity-55 ring-white/[0.05]"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-mono text-xs text-violet-300">
                                        {item.id}
                                    </p>

                                    <p className="mt-1 font-bold text-white">
                                        {item.title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {isCovered
                                            ? `${item.completed}/${item.total} lessons completed`
                                            : "No lesson mapped yet"}
                                    </p>
                                </div>

                                <p
                                    className={`font-mono text-sm ${isCovered ? "text-violet-300" : "text-slate-600"
                                        }`}
                                >
                                    {item.percent}%
                                </p>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                                <div
                                    className="h-full rounded-full bg-violet-300 shadow-[0_0_12px_rgba(168,85,247,0.35)] transition-all duration-700 ease-out"
                                    style={{ width: `${item.percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </PanelCard>
    );
}
