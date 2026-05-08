import { Panel } from "@/components/dc-ui/Panel";
import { StatusBadge } from "@/components/dc-ui/StatusBadge";
import { DcButton } from "@/components/dc-ui/DcButton";
import type { ChallengeDefinition } from "@/engine/types";

type FailIntelligencePanelProps = {
    challenge: ChallengeDefinition;
    attempts: number;
    hintsUsed: number;
    solved: boolean;
};

export function FailIntelligencePanel({
    challenge,
    attempts,
    hintsUsed,
    solved,
}: FailIntelligencePanelProps) {
    const shouldShow = !solved && attempts >= 3;
    const shouldSuggestHint = shouldShow && hintsUsed === 0;
    const shouldSuggestLesson =
        shouldShow && Boolean(challenge.relatedLessons?.length);

    if (!shouldShow) return null;

    return (
        <Panel accent="amber">
            <div className="mb-4 flex items-center justify-between gap-4">
                <p className="font-mono text-sm uppercase tracking-[0.3em] text-amber-300">
                    Fail Intelligence
                </p>

                <StatusBadge variant="warning">Struggle detected</StatusBadge>
            </div>

            <p className="text-sm leading-6 text-slate-400">
                Multiple failed attempts detected. The exploit path may require a
                different observation strategy.
            </p>

            <div className="mt-5 space-y-3">
                {shouldSuggestHint && (
                    <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
                            Suggested next move
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                            Reveal the first hint. It will reduce score, but may unblock the
                            mission.
                        </p>
                    </div>
                )}

                {shouldSuggestLesson &&
                    challenge.relatedLessons?.map((lesson) => (
                        <div
                            key={lesson.href}
                            className="rounded-xl border border-slate-800 bg-[#05070d] p-4"
                        >
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                                Related lesson
                            </p>

                            <h3 className="mt-2 font-bold text-white">{lesson.title}</h3>

                            {lesson.description && (
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {lesson.description}
                                </p>
                            )}

                            <DcButton
                                href={lesson.href}
                                variant="ghost"
                                className="mt-4"
                            >
                                Review lesson →
                            </DcButton>
                        </div>
                    ))}
            </div>
        </Panel>
    );
}