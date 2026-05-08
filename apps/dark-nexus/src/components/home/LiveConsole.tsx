"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import PanelCard from "@dark/ui/components/PanelCard";

function StatCard({
    label,
    value,
    green,
}: {
    label: string;
    value: string | number;
    green?: boolean;
}) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                {label}
            </p>
            <p className={`mt-2 text-2xl font-black ${green ? "text-emerald-300" : "text-white"}`}>
                {value}
            </p>
        </div>
    );
}

export default function LiveConsole() {
    const logs = [
        { type: "HUB", text: "Training route initialized", color: "text-blue-200" },
        { type: "LEARN", text: "DarkSplaining concepts connected", color: "text-blue-100" },
        { type: "PRACTICE", text: "DarkChallenges labs linked", color: "text-emerald-300" },
        { type: "DEFEND", text: "DarkDefend simulations ready", color: "text-amber-300" },
        { type: "NEXT", text: "Choose the next best action", color: "text-blue-100" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
        >
            <PanelCard variant="darkNexusHero" accent="blue" hover>
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-blue-200">
                    <Terminal className="h-4 w-4" />
                    <span>Live Console</span>
                </div>

                <div className="space-y-4 font-mono text-sm">
                    <p className="text-slate-400">$ initialize_dark_ecosystem</p>

                    {logs.map((log) => (
                        <p key={log.text} className={log.color}>
                            [{log.type}] {log.text}
                        </p>
                    ))}

                    <p className="text-blue-200">
                        root@dark-nexus:~$ <span className="terminal-cursor" />
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                    <StatCard label="modules" value="4" />
                    <StatCard label="mode" value="hub" />
                    <StatCard label="route" value="guided" green />
                </div>
            </PanelCard>
        </motion.div>
    );
}