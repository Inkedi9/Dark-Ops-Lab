import { Lock, ShieldCheck, Skull, Trophy } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

type BadgeCardProps = {
    title: string;
    description: string;
    unlocked: boolean;
};

export function BadgeCard({ title, description, unlocked }: BadgeCardProps) {
    const lowerTitle = title.toLowerCase();

    const isCtf = ["breacher", "ghost", "takeover", "ctf"].some((name) =>
        lowerTitle.includes(name)
    );

    const isWarzone = lowerTitle.includes("warzone");

    const accent = unlocked
        ? isWarzone
            ? "danger"
            : isCtf
                ? "blue"
                : "emerald"
        : "none";

    const Icon = unlocked
        ? isWarzone
            ? Skull
            : isCtf
                ? Trophy
                : ShieldCheck
        : Lock;

    return (
        <PanelCard
            variant={isWarzone && unlocked ? "danger" : "darkNexus"}
            accent={accent}
            hover={unlocked}
            className={`relative p-5 ${unlocked ? "" : "opacity-50"}`}
        >
            <div className="mb-4 flex items-center justify-between">
                <div
                    className={[
                        "grid h-14 w-14 place-items-center rounded-xl border bg-black/45 transition",
                        isWarzone
                            ? "border-red-300/20 text-red-200"
                            : isCtf
                                ? "border-blue-300/20 text-blue-200"
                                : "border-emerald-300/20 text-emerald-200",
                        !unlocked && "border-white/[0.06] text-slate-600",
                        unlocked && isWarzone && "shadow-[0_0_24px_rgba(248,113,113,.12)]",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    <Icon size={22} />
                </div>

                <AppBadge variant={unlocked ? accent || "emerald" : "default"}>
                    {unlocked ? "Unlocked" : "Locked"}
                </AppBadge>
            </div>

            <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                {isWarzone ? "Warzone badge" : isCtf ? "CTF badge" : "Mission badge"}
            </p>

            <h3 className="mt-2 text-lg font-black text-white">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
            </p>
        </PanelCard>
    );
}