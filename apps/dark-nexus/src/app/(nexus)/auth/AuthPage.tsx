"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import NexusBackground from "@dark/ui/components/NexusBackground";
import PanelCard from "@dark/ui/components/PanelCard";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

export default function AuthPage() {
    const [feedback, setFeedback] = useState("");
    const {
        configured,
        loading,
        user,
        avatarUrl,
        displayName,
        email,
        signOut,
    } = useSupabaseSession();

    async function handleGithubSignIn() {
        if (!configured && !hasSupabaseConfig()) {
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

                <PanelCard variant="darkOpsHero" accent="blue" className="p-8">
                    <AppBadge variant={configured ? "emerald" : "slate"}>
                        {configured ? "Supabase configured" : "Supabase missing"}
                    </AppBadge>

                    <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
                        Sign in to Dark Ops
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                        Sync your profile, progress and local Dark ecosystem telemetry.
                    </p>
                    <p className="mt-3 text-sm text-slate-400">
                        Local-first mode remains available without sign in.
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
                                    <p className="font-bold text-white">{displayName || "GitHub user"}</p>
                                    {email && (
                                        <p className="mt-1 text-sm text-slate-400">{email}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <AppButton href="/data-settings" variant="primary">
                                    Go to Data Settings
                                </AppButton>
                                <AppButton
                                    type="button"
                                    variant="secondary"
                                    onClick={() => void signOut()}
                                >
                                    Sign out
                                </AppButton>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8 flex flex-wrap gap-3">
                            <AppButton
                                type="button"
                                variant="primary"
                                onClick={handleGithubSignIn}
                                disabled={loading || !configured}
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
