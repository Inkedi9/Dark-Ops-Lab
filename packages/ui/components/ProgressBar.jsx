export default function ProgressBar({ value = 0, className = "" }) {
    const safeValue = Math.max(0, Math.min(100, value));

    return (
        <div className={`h-2 overflow-hidden rounded-full bg-white/[0.06] ${className}`}>
            <div
                className="h-full rounded-full bg-gradient-to-r from-blue-300/75 via-indigo-300/75 to-violet-300/75"
                style={{ width: `${safeValue}%` }}
            />
        </div>
    );
}