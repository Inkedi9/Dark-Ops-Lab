"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { localProfileAdapter } from "@dark/profile/localProfileAdapter";
import type { DarkProfile, ProfileAdapter } from "./types";

// Only these fields are owned by the profiles table.
// completedLessons / completedMissions / completedDefend live in progress_events.
type SyncedFields = Pick<DarkProfile, "xp" | "level" | "rank" | "badges">;

function toSyncedFields(profile: DarkProfile): SyncedFields {
    return {
        xp: profile.xp,
        level: profile.level,
        rank: profile.rank,
        badges: profile.badges,
    };
}

async function pushToSupabase(supabase: SupabaseClient, profile: DarkProfile): Promise<void> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { error } = await supabase
            .from("profiles")
            .upsert(
                {
                    id: session.user.id,
                    ...toSyncedFields(profile),
                    updated_at: new Date().toISOString(),
                },
                { onConflict: "id" },
            );

        if (error) {
            console.error("[supabaseProfileAdapter] upsert failed:", error.message);
        }
    } catch (err) {
        console.error("[supabaseProfileAdapter] push failed:", err);
    }
}

export function createSupabaseProfileAdapter(supabase: SupabaseClient): ProfileAdapter {
    function push(profile: DarkProfile): void {
        void pushToSupabase(supabase, profile);
    }

    return {
        // Read always comes from localStorage — Supabase is write-only for this adapter.
        // Hydration from Supabase happens once at login via bootstrapSupabaseSync.
        async getProfile() {
            return localProfileAdapter.getProfile();
        },

        async createProfile(username) {
            const profile = await localProfileAdapter.createProfile(username);
            push(profile);
            return profile;
        },

        async updateProfile(profile) {
            const updated = await localProfileAdapter.updateProfile(profile);
            push(updated);
            return updated;
        },

        async addXp(amount) {
            const profile = await localProfileAdapter.addXp(amount);
            push(profile);
            return profile;
        },

        // Reset is local-only: Supabase keeps its state.
        // If the user logs back in, bootstrapSupabaseSync will pull the remote profile.
        async resetProfile() {
            return localProfileAdapter.resetProfile();
        },

        async addBadge(badge) {
            const profile = await localProfileAdapter.addBadge(badge);
            push(profile);
            return profile;
        },

        async completeLesson(lessonId, xp) {
            const profile = await localProfileAdapter.completeLesson(lessonId, xp);
            push(profile);
            return profile;
        },

        async completeMission(missionId, xp) {
            const profile = await localProfileAdapter.completeMission(missionId, xp);
            push(profile);
            return profile;
        },

        async completeDefend(defendId, xp) {
            const profile = await localProfileAdapter.completeDefend(defendId, xp);
            push(profile);
            return profile;
        },
    };
}
