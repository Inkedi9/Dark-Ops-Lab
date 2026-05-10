import AppBadge from "@dark/ui/components/AppBadge";

type TrackCompletionBadgeProps = {
    isCompleted?: boolean;
    compact?: boolean;
};

export default function TrackCompletionBadge({
    isCompleted,
    compact = false,
}: TrackCompletionBadgeProps) {
    if (!isCompleted) return null;

    return (
        <div className="inline-flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-300 text-[10px] font-black text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                ✓
            </span>

            <AppBadge
                variant="emerald"
                className={compact ? "px-2 py-0.5 text-[10px]" : ""}
            >
                Track completed
            </AppBadge>
        </div>
    );
}
