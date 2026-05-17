import PanelCard from "@dark/ui/components/PanelCard";

function BlueprintLine({
    prefix,
    text,
}: {
    prefix: string;
    text: string;
}) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-sm text-slate-300">
            <span className="font-mono text-blue-200">{prefix}</span> {text}
        </div>
    );
}

export default function ConnectionBlueprint() {
    return (
        <section className="py-12">
            <PanelCard variant="darkOps" accent="blue" hover className="p-8">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.45em] text-blue-200">
                            Connection blueprint
                        </p>

                        <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
                            The flow should never feel like 3 random websites.
                        </h2>

                        <p className="mt-5 leading-8 text-slate-300">
                            Every lesson, mission and defense simulation should send the user
                            to the next logical step with a clear CTA.
                        </p>
                    </div>

                    <div className="grid gap-3 font-mono text-sm text-slate-300">
                        <BlueprintLine
                            prefix="01"
                            text="DarkSplaining lesson → Practice this vulnerability"
                        />
                        <BlueprintLine
                            prefix="02"
                            text="DarkChallenges mission → Understand how to defend"
                        />
                        <BlueprintLine
                            prefix="03"
                            text="DarkDefend simulation → Train again / improve score"
                        />
                        <BlueprintLine
                            prefix="04"
                            text="Hub profile → XP, badges, recent activity, next recommended path"
                        />
                    </div>
                </div>
            </PanelCard>
        </section>
    );
}