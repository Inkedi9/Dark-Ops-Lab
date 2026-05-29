"use client";

import { safeRead, safeRemove, safeWrite } from "@dark/storage";
import { STORAGE_SCHEMA_VERSION } from "@dark/types";
import type {
  AppProgressState,
  GlobalProfile,
  ProgressEvent,
  ProgressNamespace as SharedProgressNamespace,
  SyncQueueItem,
} from "@dark/types";

export const progressNamespaces = ["splaining", "defend", "challenges", "nexus"] as const;

export type ProgressNamespace = SharedProgressNamespace;
export type ProgressState = AppProgressState;

export type ProgressTelemetry = {
  lessonsCompleted: number;
  challengesCompleted: number;
  ctfCompleted: number;
  warzoneCompleted: number;
  phishingAnalyses: number;
  quizzesCompleted: number;
  totalXp: number;
  badgesUnlocked: number;
  streak: number;
  lastActivity: string | null;
};

const PROGRESS_PREFIX = "dark:progress:";
const SYNC_QUEUE_KEY = "dark:sync:queue";
const PROFILE_KEY = "dark_profile";

function progressKey(namespace: string) {
  return `${PROGRESS_PREFIX}${namespace}`;
}

function emptyProgress(namespace: string): ProgressState {
  return {
    namespace,
    data: {},
    events: [],
    updatedAt: null,
    schemaVersion: STORAGE_SCHEMA_VERSION,
  };
}

function normalizeNamespace(namespace: ProgressNamespace) {
  return progressNamespaces.includes(namespace as never)
    ? namespace
    : String(namespace || "global");
}

function normalizeProgress(namespace: ProgressNamespace, value: unknown): ProgressState {
  const normalizedNamespace = normalizeNamespace(namespace);

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return emptyProgress(normalizedNamespace);
  }

  const candidate = value as Partial<ProgressState>;

  return {
    namespace: candidate.namespace || normalizedNamespace,
    data:
      candidate.data && typeof candidate.data === "object" && !Array.isArray(candidate.data)
        ? candidate.data
        : {},
    events: Array.isArray(candidate.events) ? candidate.events : [],
    updatedAt: candidate.updatedAt || null,
    schemaVersion: candidate.schemaVersion || STORAGE_SCHEMA_VERSION,
  };
}

function createEvent(namespace: string, event: Partial<ProgressEvent>): ProgressEvent {
  const timestamp = event?.timestamp || new Date().toISOString();
  const type = event?.type || "progress_event";
  const source = event?.source || namespace;
  const entityId = event?.entityId || String(event?.payload?.entityId || event?.payload?.id || event?.id || "global");
  const idempotencyKey =
    event?.idempotencyKey || `${source}:${type}:${namespace}:${entityId}`;

  return {
    id:
      event?.id ||
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    idempotencyKey,
    type,
    source,
    namespace,
    entityId,
    timestamp,
    payload: event?.payload || {},
    schemaVersion: event?.schemaVersion || STORAGE_SCHEMA_VERSION,
  };
}

export function getProgress(namespace: ProgressNamespace): ProgressState {
  const normalizedNamespace = normalizeNamespace(namespace);
  return normalizeProgress(
    normalizedNamespace,
    safeRead(progressKey(normalizedNamespace), emptyProgress(normalizedNamespace)),
  );
}

export function saveProgress(namespace: ProgressNamespace, data: Partial<ProgressState>) {
  const normalizedNamespace = normalizeNamespace(namespace);
  const next = normalizeProgress(normalizedNamespace, {
    ...data,
    namespace: normalizedNamespace,
    updatedAt: new Date().toISOString(),
  });

  return safeWrite(progressKey(normalizedNamespace), next);
}

export function updateProgress(
  namespace: ProgressNamespace,
  updater: Partial<ProgressState> | ((current: ProgressState) => Partial<ProgressState>),
) {
  const current = getProgress(namespace);
  const nextValue =
    typeof updater === "function" ? updater(current) : { ...current, ...updater };

  return saveProgress(namespace, nextValue);
}

export function resetProgress(namespace: ProgressNamespace) {
  safeRemove(progressKey(normalizeNamespace(namespace)));
}

export function appendProgressEvent(namespace: ProgressNamespace, event: Partial<ProgressEvent>) {
  const current = getProgress(namespace);
  const nextEvent = createEvent(current.namespace, event);
  const existingEvent = current.events.find(
    (item) => item.idempotencyKey === nextEvent.idempotencyKey,
  );

  if (existingEvent) {
    return existingEvent;
  }

  saveProgress(current.namespace, {
    ...current,
    events: [...current.events, nextEvent],
    updatedAt: nextEvent.timestamp,
  });

  enqueueSyncItem({
    eventId: nextEvent.id,
    idempotencyKey: nextEvent.idempotencyKey,
    namespace: current.namespace,
    payload: nextEvent,
  });

  return nextEvent;
}

export function getSyncQueue(): SyncQueueItem[] {
  const queue = safeRead<SyncQueueItem[]>(SYNC_QUEUE_KEY, []);
  return Array.isArray(queue) ? queue : [];
}

export function enqueueSyncItem(item: Partial<SyncQueueItem>) {
  const queue = getSyncQueue();
  const event = item.payload;
  const idempotencyKey = item.idempotencyKey || event?.idempotencyKey;

  if (!event || !idempotencyKey) {
    return null;
  }

  const existing = queue.find((queueItem) => queueItem.idempotencyKey === idempotencyKey);
  if (existing) return existing;

  const nextItem: SyncQueueItem = {
    id:
      item.id ||
      globalThis.crypto?.randomUUID?.() ||
      `sync-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    eventId: item.eventId || event.id,
    idempotencyKey,
    namespace: item.namespace || event.namespace,
    status: item.status || "pending",
    createdAt: item.createdAt || new Date().toISOString(),
    attempts: item.attempts || 0,
    payload: event,
    schemaVersion: item.schemaVersion || STORAGE_SCHEMA_VERSION,
  };

  safeWrite(SYNC_QUEUE_KEY, [...queue, nextItem]);
  return nextItem;
}

export function markSyncItemSynced(id: string) {
  const now = new Date().toISOString();
  const queue = getSyncQueue().map((item) =>
    item.id === id
      ? {
          ...item,
          status: "synced" as const,
          syncedAt: now,
        }
      : item,
  );

  safeWrite(SYNC_QUEUE_KEY, queue);
}

export function clearSyncQueue() {
  safeRemove(SYNC_QUEUE_KEY);
}

function getAllEvents() {
  return progressNamespaces.flatMap((namespace) => getProgress(namespace).events);
}

function getPayloadXp(event: ProgressEvent) {
  const payload = event.payload || {};
  return Number(payload.xp ?? payload.xpAwarded ?? payload.amount ?? 0) || 0;
}

function isChallengeCompletionEvent(event: ProgressEvent) {
  return (
    event.namespace === "challenges" &&
    event.type === "challenge_completed" &&
    event.payload?.kind !== "ctf" &&
    event.payload?.kind !== "warzone" &&
    !String(event.entityId || "").startsWith("ctf:") &&
    !String(event.entityId || "").startsWith("warzone:")
  );
}

function isCtfCompletionEvent(event: ProgressEvent) {
  return (
    event.namespace === "challenges" &&
    (event.type === "ctf_completed" ||
      (event.type === "challenge_completed" &&
        (event.payload?.kind === "ctf" || String(event.entityId || "").startsWith("ctf:"))))
  );
}

function isWarzoneCompletionEvent(event: ProgressEvent) {
  return (
    event.namespace === "challenges" &&
    (event.type === "warzone_completed" ||
      (event.type === "challenge_completed" &&
        (event.payload?.kind === "warzone" || String(event.entityId || "").startsWith("warzone:"))))
  );
}

function getActivityStreak(events: ProgressEvent[]) {
  const activeDays = new Set(
    events
      .map((event) => event.timestamp?.slice(0, 10))
      .filter(Boolean),
  );
  let streak = 0;
  const cursor = new Date();

  while (activeDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getProgressTelemetry(): ProgressTelemetry {
  const events = getAllEvents();
  const badgeIds = new Set();

  events.forEach((event) => {
    if (event.type === "badge_awarded") {
      badgeIds.add(event.payload?.id || event.payload?.badge || event.id);
    }
  });

  const lastActivity =
    events
      .map((event) => event.timestamp)
      .filter(Boolean)
      .sort()
      .at(-1) || null;

  return {
    lessonsCompleted: events.filter((event) => event.type === "lesson_completed").length,
    challengesCompleted: events.filter(isChallengeCompletionEvent).length,
    ctfCompleted: events.filter(isCtfCompletionEvent).length,
    warzoneCompleted: events.filter(isWarzoneCompletionEvent).length,
    phishingAnalyses: events.filter((event) => event.type === "phishing_analyzed").length,
    quizzesCompleted: events.filter((event) => event.type === "quiz_completed").length,
    totalXp: events.reduce((total, event) => total + getPayloadXp(event), 0),
    badgesUnlocked: badgeIds.size,
    streak: getActivityStreak(events),
    lastActivity,
  };
}

type SupabaseSyncMode = "push" | "pull" | "both";
type SupabaseProviderResult<T = unknown> = {
  ok: boolean;
  reason?: string;
  data?: T;
  count?: number;
};

type SupabaseSyncResult = {
  provider: "supabase";
  mode: SupabaseSyncMode;
  profile?: SupabaseProviderResult;
  events?: SupabaseProviderResult;
  snapshots?: SupabaseProviderResult;
  pushedQueueItems?: number;
  pull?: SupabaseSyncResult;
};

export async function syncProgressWithSupabase(
  options: { mode?: SupabaseSyncMode } = {},
): Promise<SupabaseSyncResult> {
  const { supabaseProgressProvider } = await import("./providers/supabaseProgressProvider");
  const mode = options.mode || "push";

  if (mode === "pull") {
    const [profile, events, snapshots] = await Promise.all([
      supabaseProgressProvider.pullProfile(),
      supabaseProgressProvider.pullEvents(),
      supabaseProgressProvider.pullSnapshots(),
    ]);

    return {
      provider: "supabase",
      mode,
      profile,
      events,
      snapshots,
    };
  }

  const queue = getSyncQueue();
  const pendingQueue = queue.filter((item) => item.status !== "synced");
  const profile = safeRead<Partial<GlobalProfile> | null>(PROFILE_KEY, null);
  const snapshots = progressNamespaces.map((namespace) => getProgress(namespace));

  const profileResult = profile
    ? await supabaseProgressProvider.pushProfile(profile)
    : { ok: true, count: 0, reason: "No local profile to push." };

  const eventsResult = await supabaseProgressProvider.pushSyncQueueItems(pendingQueue);
  const snapshotsResult = await supabaseProgressProvider.pushSnapshots(snapshots);

  if (eventsResult.ok) {
    pendingQueue.forEach((item) => markSyncItemSynced(item.id));
  }

  const pushResult: SupabaseSyncResult = {
    provider: "supabase",
    mode,
    profile: profileResult,
    events: eventsResult,
    snapshots: snapshotsResult,
    pushedQueueItems: eventsResult.ok ? pendingQueue.length : 0,
  };

  if (mode === "both") {
    const pullResult = await syncProgressWithSupabase({ mode: "pull" });
    return {
      ...pushResult,
      pull: pullResult,
    };
  }

  return pushResult;
}
