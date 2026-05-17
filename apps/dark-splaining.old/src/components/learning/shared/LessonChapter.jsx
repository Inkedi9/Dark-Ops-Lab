import AppBadge from "@dark/ui/components/AppBadge";
import { typography } from "../../../styles/ui";

export default function LessonChapter({
    number,
    eyebrow,
    title,
    description,
    accent = "blue",
    children,
}) {
    return (
        <section className="relative">
            <div className="mb-4 flex items-start gap-4">
                <div className="hidden h-full pt-1 md:block">
                    <div className="flex h-10 w-10 items-center justify-center bg-black/70 font-mono text-xs font-bold text-slate-300 ring-1 ring-white/[0.08]">
                        {number}
                    </div>
                </div>

                <div>
                    <AppBadge variant={accent}>{eyebrow}</AppBadge>

                    <h2 className={`mt-3 ${typography.cardTitle}`}>
                        {title}
                    </h2>

                    {description && (
                        <p className={`mt-2 max-w-2xl ${typography.body}`}>
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-6">{children}</div>
        </section>
    );
}
