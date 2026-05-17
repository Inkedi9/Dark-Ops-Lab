import ChallengeBridgeCard from "./ChallengeBridgeCard";
import DefendBridgeCard from "./DefendBridgeCard";

export default function LessonBridgePanel({ bridges = [] }) {
    if (!bridges.length) return null;

    return (
        <section>
            <div className="mb-4">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                    Ready for practice?
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Keep Splaining focused on understanding, then continue into the
                    right product when you want deeper practice or defense workflow.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {bridges.map((bridge) => {
                    if (bridge.type === "defend") {
                        return (
                            <DefendBridgeCard
                                key={`${bridge.type}-${bridge.to}`}
                                {...bridge}
                            />
                        );
                    }

                    return (
                        <ChallengeBridgeCard
                            key={`${bridge.type}-${bridge.to}`}
                            {...bridge}
                        />
                    );
                })}
            </div>
        </section>
    );
}
