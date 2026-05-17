export default function ProgressBar({ current, total }) {
    const width = total ? (current / total) * 100 : 0;

    return (
        <div className="mb-6">
            <div className="mb-2 flex justify-between font-mono text-xs uppercase tracking-[0.18em] text-muted">
                <span>Progress</span>
                <span>
                    {current}/{total}
                </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full border border-blue-400/20 bg-black/50">
                <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#00e5ff,#39ff14)] shadow-[0_0_18px_rgba(0,229,255,0.35)] transition-all"
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}
