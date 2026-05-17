import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";

export default function NextLessonCard({ lesson }) {
    if (!lesson) return null;

    return (
        <PanelCard variant="featured" accent="violet" className="p-6">
            <AppBadge variant="violet">Next lesson</AppBadge>

            <h2 className="mt-4 text-xl font-extrabold tracking-tight text-white">
                {lesson.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {lesson.description}
            </p>

            <AppButton
                to={`/lessons/${lesson.id}`}
                variant="violet"
                className="mt-5"
            >
                Continue →
            </AppButton>
        </PanelCard>
    );
}
