"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppBadge from "@dark/ui/components/AppBadge";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = window.setTimeout(async () => {
            if (hasSupabaseConfig()) {
                const supabase = createBrowserSupabaseClient();
                await supabase?.auth.getSession();
            }

            router.replace("/data-settings");
        }, 0);

        return () => window.clearTimeout(timer);
    }, [router]);

    return (
        <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#080d1a] px-4 text-slate-100">
            <NexusBackground />
            <PanelCard variant="darkOps" accent="blue" className="relative z-10 max-w-lg p-8 text-center">
                <AppBadge variant="blue">Auth callback</AppBadge>
                <h1 className="mt-4 text-2xl font-black text-white">Finalizing sign in</h1>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                    Redirecting to Data Settings.
                </p>
            </PanelCard>
        </main>
    );
}
