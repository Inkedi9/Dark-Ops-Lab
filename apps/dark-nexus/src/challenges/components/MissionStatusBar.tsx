import { StatusBadge } from "@/components/dc-ui/StatusBadge";

type MissionStatusBarProps = {
    challengeId: string;
    solved: boolean;
    attempts: number;
    score: number;
};

export function MissionStatusBar({
    challengeId,
    solved,
    attempts,
    score,
}: MissionStatusBarProps) {
    return (
        <div
            className={[
                "mb-8 rounded-2xl border px-6 py-4",
                solved
                    ? "border-green-400/40 bg-green-400/10 shadow-[0_0_45px_rgba(88,240,167,0.08)]"
                    : "border-[rgba(var(--dc-accent),0.4)] bg-[#0b101a]",
            ].join(" ")}
        >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge variant={solved ? "success" : "active"}>
                        {solved ? "BREACHED" : "ACTIVE"}
                    </StatusBadge>

                    <span className="font-mono text-sm uppercase tracking-[0.25em] text-slate-400">
                        {challengeId}
                    </span>
                </div>

                <div className="flex flex-wrap gap-5 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>attempts: {attempts}</span>
                    <span>reward: {score} XP</span>
                    <span>{solved ? "session compromised" : "awaiting exploit"}</span>
                </div>
            </div>
        </div>
    );
}