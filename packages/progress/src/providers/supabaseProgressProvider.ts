import { createBrowserSupabaseClient, hasSupabaseConfig } from "@dark/supabase-client";
import type { AppProgressState, GlobalProfile, ProgressEvent, SyncQueueItem } from "@dark/types";

type ProviderResult<T = unknown> = {
  ok: boolean;
  reason?: string;
  data?: T;
  count?: number;
};

type SupabaseProfileRow = {
  id: string;
  username: string | null;
  xp: number;
  level: number;
  rank: string;
  badges: unknown;
  telemetry: unknown;
  schema_version: number;
  created_at: string;
  updated_at: string;
};

type SupabaseEventRow = {
  id: string;
  idempotency_key: string;
  namespace: string;
  source: string;
  type: string;
  entity_id: string | null;
  payload: Record<string, unknown>;
  schema_version: number;
  created_at: string;
};

type SupabaseSnapshotRow = {
  namespace: string;
  data: Record<string, unknown>;
  schema_version: number;
  updated_at: string;
};

async function getAuthenticatedUserId() {
  if (!hasSupabaseConfig()) {
    return { ok: false as const, reason: "Supabase is not configured." };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { ok: false as const, reason: "Supabase is not configured." };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { ok: false as const, reason: error.message };
  }

  if (!data.user?.id) {
    return { ok: false as const, reason: "No authenticated Supabase user." };
  }

  return { ok: true as const, supabase, userId: data.user.id };
}

function mapProfileToRow(profile: Partial<GlobalProfile>, userId: string) {
  const telemetry = (profile as Partial<GlobalProfile> & { telemetry?: unknown }).telemetry || {};

  return {
    id: userId,
    username: profile.username || "Ghost",
    xp: Number(profile.xp) || 0,
    level: Number(profile.level) || 1,
    rank: profile.rank || "ROOKIE",
    badges: Array.isArray(profile.badges) ? profile.badges : [],
    telemetry,
    schema_version: Number((profile as { schemaVersion?: number }).schemaVersion) || 1,
    updated_at: new Date().toISOString(),
  };
}

function mapProfileFromRow(row: SupabaseProfileRow): GlobalProfile {
  return {
    id: row.id,
    username: row.username || "Ghost",
    xp: Number(row.xp) || 0,
    level: Number(row.level) || 1,
    rank: row.rank || "ROOKIE",
    badges: Array.isArray(row.badges) ? row.badges : [],
    completedLessons: [],
    completedMissions: [],
    completedDefend: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEventToRow(event: ProgressEvent, userId: string) {
  return {
    user_id: userId,
    idempotency_key: event.idempotencyKey,
    namespace: event.namespace,
    source: event.source,
    type: event.type,
    entity_id: event.entityId || null,
    payload: event.payload || {},
    schema_version: event.schemaVersion || 1,
    created_at: event.timestamp || new Date().toISOString(),
  };
}

function mapEventFromRow(row: SupabaseEventRow): ProgressEvent {
  return {
    id: row.id,
    idempotencyKey: row.idempotency_key,
    namespace: row.namespace,
    source: row.source,
    type: row.type,
    entityId: row.entity_id || "global",
    payload: row.payload || {},
    schemaVersion: row.schema_version || 1,
    timestamp: row.created_at,
  };
}

function mapSnapshotToRow(snapshot: AppProgressState, userId: string) {
  return {
    user_id: userId,
    namespace: snapshot.namespace,
    data: {
      ...snapshot.data,
      events: snapshot.events,
      updatedAt: snapshot.updatedAt,
    },
    schema_version: snapshot.schemaVersion || 1,
    updated_at: snapshot.updatedAt || new Date().toISOString(),
  };
}

function mapSnapshotFromRow(row: SupabaseSnapshotRow): AppProgressState {
  const events = Array.isArray(row.data?.events) ? row.data.events : [];

  return {
    namespace: row.namespace,
    data: row.data || {},
    events: events as ProgressEvent[],
    updatedAt: row.updated_at,
    schemaVersion: row.schema_version || 1,
  };
}

export const supabaseProgressProvider = {
  name: "supabase",

  async pushEvents(events: ProgressEvent[]): Promise<ProviderResult> {
    const auth = await getAuthenticatedUserId();
    if (!auth.ok) return auth;

    const rows = events.map((event) => mapEventToRow(event, auth.userId));
    if (rows.length === 0) return { ok: true, count: 0 };

    const { error } = await auth.supabase
      .from("progress_events")
      .upsert(rows, { onConflict: "user_id,idempotency_key", ignoreDuplicates: true });

    if (error) return { ok: false, reason: error.message };
    return { ok: true, count: rows.length };
  },

  async pullEvents(): Promise<ProviderResult<ProgressEvent[]>> {
    const auth = await getAuthenticatedUserId();
    if (!auth.ok) return auth;

    const { data, error } = await auth.supabase
      .from("progress_events")
      .select("id,idempotency_key,namespace,source,type,entity_id,payload,schema_version,created_at")
      .order("created_at", { ascending: true });

    if (error) return { ok: false, reason: error.message };
    return { ok: true, data: ((data || []) as SupabaseEventRow[]).map(mapEventFromRow), count: data?.length || 0 };
  },

  async pushProfile(profile: Partial<GlobalProfile>): Promise<ProviderResult> {
    const auth = await getAuthenticatedUserId();
    if (!auth.ok) return auth;

    const { error } = await auth.supabase
      .from("profiles")
      .upsert(mapProfileToRow(profile, auth.userId), { onConflict: "id" });

    if (error) return { ok: false, reason: error.message };
    return { ok: true, count: 1 };
  },

  async pullProfile(): Promise<ProviderResult<GlobalProfile | null>> {
    const auth = await getAuthenticatedUserId();
    if (!auth.ok) return auth;

    const { data, error } = await auth.supabase
      .from("profiles")
      .select("id,username,xp,level,rank,badges,telemetry,schema_version,created_at,updated_at")
      .eq("id", auth.userId)
      .maybeSingle();

    if (error) return { ok: false, reason: error.message };
    return { ok: true, data: data ? mapProfileFromRow(data as SupabaseProfileRow) : null, count: data ? 1 : 0 };
  },

  async pushSnapshots(snapshots: AppProgressState[]): Promise<ProviderResult> {
    const auth = await getAuthenticatedUserId();
    if (!auth.ok) return auth;

    const rows = snapshots.map((snapshot) => mapSnapshotToRow(snapshot, auth.userId));
    if (rows.length === 0) return { ok: true, count: 0 };

    const { error } = await auth.supabase
      .from("app_progress_snapshots")
      .upsert(rows, { onConflict: "user_id,namespace" });

    if (error) return { ok: false, reason: error.message };
    return { ok: true, count: rows.length };
  },

  async pullSnapshots(): Promise<ProviderResult<AppProgressState[]>> {
    const auth = await getAuthenticatedUserId();
    if (!auth.ok) return auth;

    const { data, error } = await auth.supabase
      .from("app_progress_snapshots")
      .select("namespace,data,schema_version,updated_at")
      .order("updated_at", { ascending: false });

    if (error) return { ok: false, reason: error.message };
    return { ok: true, data: ((data || []) as SupabaseSnapshotRow[]).map(mapSnapshotFromRow), count: data?.length || 0 };
  },

  async pushSyncQueueItems(items: SyncQueueItem[]) {
    return this.pushEvents(items.map((item) => item.payload));
  },
};
