export default function SkeletonCard({ className = "" }) {
    return (
        <div
            className={`relative overflow-hidden rounded-[1.5rem] bg-white/[0.025] p-6 ring-1 ring-white/[0.05] ${className}`}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="relative space-y-4">
                <div className="h-4 w-24 rounded-full bg-white/[0.06]" />
                <div className="h-6 w-2/3 rounded-full bg-white/[0.08]" />
                <div className="space-y-2">
                    <div className="h-3 w-full rounded-full bg-white/[0.05]" />
                    <div className="h-3 w-5/6 rounded-full bg-white/[0.05]" />
                </div>
                <div className="h-9 w-full rounded-xl bg-white/[0.055]" />
            </div>
        </div>
    );
}
