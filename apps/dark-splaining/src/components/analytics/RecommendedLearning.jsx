import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";

export default function RecommendedLearning({ lesson }) {
    if (!lesson) return null;

    return (
        <PanelCard variant="featured" accent="violet" className="p-6">
            <AppBadge variant="violet">
                Recommended next action
            </AppBadge>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                Continue with {lesson.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                This is the next best lesson based on your progress.
            </p>

            {/* subtle card preview */}
            <div className="mt-5 rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/[0.06]">
                <p className="text-sm font-semibold text-slate-200">
                    {lesson.category}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    {lesson.level} • {lesson.duration}
                </p>
            </div>

            <AppButton
                to={`/lessons/${lesson.id}`}
                variant="secondary"
                className="mt-5 w-full"
            >
                Continue lesson →
            </AppButton>
        </PanelCard>
    );
}
