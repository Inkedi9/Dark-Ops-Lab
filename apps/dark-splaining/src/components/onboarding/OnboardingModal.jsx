import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";

const onboardingSteps = [
    {
        number: "01",
        title: "Understand the flaw",
        description:
            "Each lesson starts with a simple mental model: what the vulnerability is, where it appears, and why it matters.",
    },
    {
        number: "02",
        title: "Break a safe mock app",
        description:
            "Practice in a controlled sandbox. No real targets, no backend risk, just realistic security logic.",
    },
    {
        number: "03",
        title: "Fix it and earn XP",
        description:
            "Compare the vulnerable behavior with the secure version, complete the quiz, and save your local progress.",
    },
];

export default function OnboardingModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
            <PanelCard
                variant="hero"
                accent="blue"
                className="relative w-full max-w-3xl p-6 md:p-8"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <AppBadge variant="blue">Welcome to DarkSplaining</AppBadge>

                        <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
                            Learn cyber security by breaking safe simulations.
                        </h2>

                        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                            DarkSplaining turns common web vulnerabilities into guided, beginner-friendly labs:
                            understand the concept, exploit a mock scenario, then learn the secure fix.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 rounded-full bg-white/[0.04] px-3 py-2 font-mono text-xs text-slate-400 ring-1 ring-white/[0.08] transition hover:text-blue-200 hover:ring-blue-300/[0.25]"
                    >
                        Skip
                    </button>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {onboardingSteps.map((step) => (
                        <PanelCard
                            key={step.number}
                            variant="subtle"
                            accent="violet"
                            className="p-5"
                        >
                            <p className="font-mono text-xs text-violet-300">
                                {step.number}
                            </p>

                            <h3 className="mt-3 text-lg font-extrabold text-white">
                                {step.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                {step.description}
                            </p>
                        </PanelCard>
                    ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <AppButton to="/tracks" onClick={onClose} variant="primary">
                        Start learning →
                    </AppButton>

                    <AppButton to="/resources" onClick={onClose} variant="secondary">
                        Explore resources
                    </AppButton>
                </div>

                <p className="mt-5 font-mono text-xs text-slate-600">
                    Your progress is saved locally in this browser. No account required.
                </p>
            </PanelCard>
        </div>
    );
}
