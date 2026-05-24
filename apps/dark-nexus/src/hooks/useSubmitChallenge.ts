"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";

export type SubmitOutcome =
    | { status: "correct"; xp: number; message: string }
    | { status: "incorrect"; message: string }
    | { status: "unauthenticated" }
    | { status: "error" };

export function useSubmitChallenge() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            if (!process.env.NEXT_PUBLIC_DARK_API_URL || !hasSupabaseConfig()) {
                setAuthChecked(true);
                return;
            }
            const supabase = createBrowserSupabaseClient();
            if (!supabase) {
                setAuthChecked(true);
                return;
            }
            const { data } = await supabase.auth.getSession();
            setIsAuthenticated(!!data.session);
            setAuthChecked(true);
        }

        checkAuth();
    }, []);

    async function submitToApi(challengeId: string, flag: string): Promise<SubmitOutcome> {
        const apiUrl = process.env.NEXT_PUBLIC_DARK_API_URL;
        if (!apiUrl || !hasSupabaseConfig()) return { status: "error" };

        const supabase = createBrowserSupabaseClient();
        if (!supabase) return { status: "error" };

        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return { status: "unauthenticated" };

        setIsSubmitting(true);
        try {
            const res = await fetch(`${apiUrl}/v1/challenges/${challengeId}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ flag }),
            });

            if (!res.ok) return { status: "error" };

            const body = await res.json() as { correct: boolean; xp: number; message: string };
            return body.correct
                ? { status: "correct", xp: body.xp, message: body.message }
                : { status: "incorrect", message: body.message };
        } catch {
            return { status: "error" };
        } finally {
            setIsSubmitting(false);
        }
    }

    return { submitToApi, isSubmitting, isAuthenticated, authChecked };
}
