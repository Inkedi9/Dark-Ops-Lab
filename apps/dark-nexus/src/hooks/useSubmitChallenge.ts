"use client";

import { useState } from "react";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";

export type ChallengeSubmitResult = {
    correct: boolean;
    xp: number;
    message: string;
};

/**
 * Submits a challenge flag to the dark-api backend for server-side validation.
 *
 * Returns null when the backend is not configured (NEXT_PUBLIC_DARK_API_URL unset)
 * or when the user is not authenticated — callers fall back to local validation.
 */
export function useSubmitChallenge() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submitToApi(
        challengeId: string,
        flag: string
    ): Promise<ChallengeSubmitResult | null> {
        const apiUrl = process.env.NEXT_PUBLIC_DARK_API_URL;
        if (!apiUrl || !hasSupabaseConfig()) return null;

        const supabase = createBrowserSupabaseClient();
        if (!supabase) return null;

        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return null;

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

            if (!res.ok) return null;

            return (await res.json()) as ChallengeSubmitResult;
        } catch {
            return null;
        } finally {
            setIsSubmitting(false);
        }
    }

    return { submitToApi, isSubmitting };
}
