"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";
import { parseOrWarn, SupabaseProfileSchema } from "@/lib/api/schemas";

// SupabaseProfile is kept as an explicit type for consumers that import it.
// It mirrors the schema output — if the DB schema changes, the schema
// validator will warn before this type becomes stale.
export type SupabaseProfile = {
    id: string;
    username: string | null | undefined;
    xp: number;
    level: number;
    rank: string;
    badges: unknown[];
    telemetry: Record<string, unknown>;
    schema_version: number;
    created_at?: string;
    updated_at?: string;
};

function getAvatarUrl(user: User | null) {
    const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    return typeof avatar === "string" ? avatar : "";
}

function getDisplayName(user: User | null) {
    const userName = user?.user_metadata?.user_name;
    if (typeof userName === "string" && userName) return userName;

    const fullName = user?.user_metadata?.full_name;
    if (typeof fullName === "string" && fullName) return fullName;

    return user?.email || "";
}

export function useSupabaseSession() {
    const [configured, setConfigured] = useState(false);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<SupabaseProfile | null>(null);

    const refreshProfile = useCallback(async (nextUser: User | null = null) => {
        if (!nextUser || !hasSupabaseConfig()) {
            setProfile(null);
            return null;
        }

        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
            setProfile(null);
            return null;
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", nextUser.id)
            .maybeSingle();

        if (error) {
            setProfile(null);
            return null;
        }

        if (data === null) {
            setProfile(null);
            return null;
        }

        const profile = parseOrWarn(SupabaseProfileSchema, data, "profiles") as SupabaseProfile | null;
        setProfile(profile);
        return profile;
    }, []);

    const signOut = useCallback(async () => {
        const supabase = createBrowserSupabaseClient();
        if (supabase) {
            await supabase.auth.signOut();
        }

        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        let mounted = true;
        let unsubscribe: (() => void) | undefined;

        const timer = window.setTimeout(async () => {
            const isConfigured = hasSupabaseConfig();
            if (!mounted) return;

            setConfigured(isConfigured);

            if (!isConfigured) {
                setSession(null);
                setUser(null);
                setProfile(null);
                setLoading(false);
                return;
            }

            const supabase = createBrowserSupabaseClient();
            if (!supabase) {
                setLoading(false);
                return;
            }

            const { data } = await supabase.auth.getSession();
            if (!mounted) return;

            setSession(data.session || null);
            setUser(data.session?.user || null);
            await refreshProfile(data.session?.user || null);
            if (mounted) setLoading(false);

            const subscription = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
                if (!mounted) return;

                setSession(nextSession || null);
                setUser(nextSession?.user || null);
                await refreshProfile(nextSession?.user || null);
                if (mounted) setLoading(false);
            });

            unsubscribe = () => subscription.data.subscription.unsubscribe();
        }, 0);

        return () => {
            mounted = false;
            window.clearTimeout(timer);
            unsubscribe?.();
        };
    }, [refreshProfile]);

    return {
        configured,
        loading,
        session,
        user,
        profile,
        avatarUrl: getAvatarUrl(user),
        displayName: getDisplayName(user),
        email: user?.email || "",
        refreshProfile,
        signOut,
    };
}
