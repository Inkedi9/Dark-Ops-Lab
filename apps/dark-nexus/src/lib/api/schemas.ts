import * as v from "valibot";

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/**
 * Runs safeParse and logs a warning on mismatch.
 * Returns null instead of throwing so callers can fall through to their
 * own error state without crashing the UI.
 */
export function parseOrWarn<
    TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(
    schema: TSchema,
    data: unknown,
    label: string,
): v.InferOutput<TSchema> | null {
    const result = v.safeParse(schema, data);
    if (!result.success) {
        console.warn(`[schema:${label}] unexpected response shape`, result.issues);
        return null;
    }
    return result.output;
}

// ---------------------------------------------------------------------------
// dark-api: POST /v1/challenges/{id}/submit
// ---------------------------------------------------------------------------

export const SubmitResponseSchema = v.object({
    correct: v.boolean(),
    xp: v.optional(v.number()),
    message: v.string(),
});

export type SubmitResponse = v.InferOutput<typeof SubmitResponseSchema>;

// ---------------------------------------------------------------------------
// dark-api: POST /v1/warzone/{id}/complete
// ---------------------------------------------------------------------------

export const WarzoneCompleteResponseSchema = v.object({
    valid: v.boolean(),
    xp: v.optional(v.number()),
    message: v.string(),
});

export type WarzoneCompleteResponse = v.InferOutput<typeof WarzoneCompleteResponseSchema>;

// ---------------------------------------------------------------------------
// dark-api: GET /v1/leaderboard
// ---------------------------------------------------------------------------

export const LeaderboardEntrySchema = v.object({
    position: v.number(),
    id: v.string(),
    // username can be null from the DB — fall back to an empty string for display
    username: v.pipe(
        v.union([v.string(), v.null_()]),
        v.transform((v) => v ?? ""),
    ),
    xp: v.fallback(v.number(), 0),
    level: v.fallback(v.number(), 1),
    rank: v.fallback(v.string(), "ROOKIE"),
});

export type LeaderboardEntry = v.InferOutput<typeof LeaderboardEntrySchema>;

export const LeaderboardResponseSchema = v.array(LeaderboardEntrySchema);

// ---------------------------------------------------------------------------
// Supabase: profiles table
// ---------------------------------------------------------------------------

export const SupabaseProfileSchema = v.object({
    id: v.string(),
    username: v.nullish(v.string()),
    // xp/level/rank may be null on a brand-new profile row
    xp: v.fallback(v.number(), 0),
    level: v.fallback(v.number(), 1),
    rank: v.fallback(v.string(), "ROOKIE"),
    badges: v.fallback(v.array(v.unknown()), []),
    // telemetry is free-form JSON; we only care that it is an object
    telemetry: v.fallback(v.record(v.string(), v.unknown()), {}),
    schema_version: v.fallback(v.number(), 1),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
});

export type ValidatedSupabaseProfile = v.InferOutput<typeof SupabaseProfileSchema>;
