"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";

function getAvatarUrl(user: User | null) {
    const avatar = user?.user_metadata?.avatar_url;
    return typeof avatar === "string" ? avatar : "";
}

function getUserLabel(user: User | null) {
    const userName = user?.user_metadata?.user_name;
    if (typeof userName === "string" && userName) return userName;
    return user?.email || "GitHub user";
}

export default function AuthPage() {
    const [configured, setConfigured] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const timer = window.setTimeout(async () => {
            const isConfigured = hasSupabaseConfig();
            setConfigured(isConfigured);

            if (!isConfigured) return;

            const supabase = createBrowserSupabaseClient();
            if (!supabase) return;

            const { data } = await supabase.auth.getUser();
            setUser(data.user || null);
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    async function handleGithubSignIn() {
        if (!configured) {
            setFeedback("Supabase is not configured yet.");
            return;
        }

        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setFeedback("Supabase is not configured yet.");
            return;
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setFeedback(error.message);
        }
    }

    const avatarUrl = getAvatarUrl(user);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080d1a] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
            <NexusBackground />
            <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col justify-center">
                <Link
                    href="/"
                    className="mb-8 inline-flex w-fit items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back home
                </Link>

                <PanelCard variant="darkNexusHero" accent="blue" className="p-8">
                    <AppBadge variant={configured ? "emerald" : "slate"}>
                        {configured ? "Supabase configured" : "Supabase missing"}
                    </AppBadge>

                    <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
                        Sign in to Dark Nexus
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                        Sync your profile, progress and local Dark ecosystem telemetry.
                    </p>

                    {user ? (
                        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-black/25 p-5">
                            <div className="flex flex-wrap items-center gap-4">
                                {avatarUrl ? (
                                    <div
                                        aria-hidden="true"
                                        className="h-14 w-14 rounded-full border border-blue-300/20 bg-blue-400/[0.08] bg-cover bg-center"
                                        style={{ backgroundImage: `url(${avatarUrl})` }}
                                    />
                                ) : (
                                    <div className="grid h-14 w-14 place-items-center rounded-full border border-blue-300/20 bg-blue-400/[0.08] font-mono text-sm text-blue-100">
                                        NX
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-white">{getUserLabel(user)}</p>
                                    {user.email && (
                                        <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6">
                                <AppButton href="/data-settings" variant="primary">
                                    Go to Data Settings
                                </AppButton>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8 flex flex-wrap gap-3">
                            <AppButton
                                type="button"
                                variant="primary"
                                onClick={handleGithubSignIn}
                                disabled={!configured}
                            >
                                Continue with GitHub
                            </AppButton>
                            <AppButton href="/data-settings" variant="secondary">
                                Data Settings
                            </AppButton>
                        </div>
                    )}

                    {feedback && (
                        <p className="mt-5 rounded-xl border border-red-300/15 bg-red-400/[0.08] p-4 text-sm text-red-200">
                            {feedback}
                        </p>
                    )}
                </PanelCard>
            </section>
        </main>
    );
}
