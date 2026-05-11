"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppBadge from "@dark/ui/components/AppBadge";
import PanelCard from "@dark/ui/components/PanelCard";
import NexusBackground from "@dark/ui/components/NexusBackground";
import { importProgressDump } from "@dark/progress/debug";

function decodePayload(payload: string) {
    const binary = atob(payload);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
}

export default function TelemetryImportPage() {
    const router = useRouter();
    const [message, setMessage] = useState("Importing local progress...");

    useEffect(() => {
        const timer = window.setTimeout(() => {
            try {
                const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
                const payload = hash.get("payload");

                if (!payload) {
                    setMessage("No progress payload found.");
                    window.setTimeout(() => router.replace("/telemetry"), 1200);
                    return;
                }

                importProgressDump(decodePayload(payload));
                setMessage("Progress imported into Nexus telemetry.");
                window.setTimeout(() => router.replace("/telemetry"), 600);
            } catch {
                setMessage("Progress import failed.");
                window.setTimeout(() => router.replace("/telemetry"), 1400);
            }
        }, 0);

        return () => window.clearTimeout(timer);
    }, [router]);

    return (
        <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#080d1a] px-5 text-slate-100">
            <NexusBackground />
            <PanelCard variant="darkNexusHero" accent="blue" className="relative z-10 max-w-lg p-8 text-center">
                <AppBadge variant="blue">Telemetry bridge</AppBadge>
                <h1 className="mt-5 text-3xl font-black tracking-tight text-white">
                    Syncing progress
                </h1>
                <p className="mt-4 text-sm leading-6 text-slate-400">{message}</p>
            </PanelCard>
        </main>
    );
}
