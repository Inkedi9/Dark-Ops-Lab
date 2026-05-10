import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

const pathItems = [
    ["Prerequisite", "prerequisite"],
    ["Goal", "goal"],
    ["Next step", "nextStep"],
];

const defenderItems = [
    ["Why it matters", "whyItMatters"],
    ["How attackers abuse it", "attackerAbuse"],
    ["How defenders detect it", "detection"],
    ["Common mistake", "commonMistake"],
    ["Fix pattern", "fixPattern"],
];

export default function LessonGuidancePanel({ lesson }) {
    const learningPath = lesson?.learningPath;
    const defenderNotes = lesson?.defenderNotes;

    if (!learningPath && !defenderNotes) return null;

    return (
        <PanelCard variant="darkNexus" accent="blue" className="p-5">
            <div className="mb-5 flex flex-wrap items-center gap-2">
                <AppBadge variant="blue">Lesson guidance</AppBadge>
                <AppBadge variant="slate">defender context</AppBadge>
            </div>

            {learningPath && (
                <section>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                        Learning path
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {pathItems.map(([label, key]) => (
                            learningPath[key] && (
                                <InfoBox
                                    key={key}
                                    label={label}
                                    value={learningPath[key]}
                                />
                            )
                        ))}
                    </div>
                </section>
            )}

            {defenderNotes && (
                <section className={learningPath ? "mt-6" : ""}>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                        Defender notes
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {defenderItems.map(([label, key]) => (
                            defenderNotes[key] && (
                                <InfoBox
                                    key={key}
                                    label={label}
                                    value={defenderNotes[key]}
                                />
                            )
                        ))}
                    </div>
                </section>
            )}
        </PanelCard>
    );
}

function InfoBox({ label, value }) {
    return (
        <div className="rounded-xl border border-blue-300/12 bg-blue-400/[0.04] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
                {value}
            </p>
        </div>
    );
}
