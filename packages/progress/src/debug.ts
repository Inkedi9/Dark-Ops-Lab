import { safeRead, safeRemove, safeReset, safeWrite } from "@dark/storage";
import {
  appendProgressEvent,
  getProgress,
  getProgressTelemetry,
  progressNamespaces,
  saveProgress,
} from "./index";

const PROGRESS_PREFIX = "dark:progress:";
const PROFILE_KEY = "dark_profile";
const SYNC_QUEUE_KEY = "dark:sync:queue";
const MIGRATION_PREFIX = "dark:migrations:";
const LEGACY_KEYS = [
  "darksplaining:xp",
  "darksplaining.lessonProgress",
  "dc_global_progress",
  "darkchallenges:progress",
  "darkchallenges:ctf-progress",
  "darkchallenges:warzone-progress",
  "phishscope-results",
  "darkdefend-incidents",
  "darkdefend-security-check",
];

export function exportProgressDump() {
  const progress = Object.fromEntries(
    progressNamespaces.map((namespace) => [namespace, getProgress(namespace)]),
  );

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    progress,
    telemetry: getProgressTelemetry(),
  };
}

export function importProgressDump(dump: string | Record<string, unknown>) {
  const parsed = typeof dump === "string" ? safeParseDump(dump) : dump;
  const progress =
    parsed?.progress && typeof parsed.progress === "object"
      ? (parsed.progress as Record<string, unknown>)
      : {};

  progressNamespaces.forEach((namespace) => {
    const incoming = progress[namespace];
    if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
      return;
    }

    const incomingState = incoming as {
      data?: Record<string, unknown>;
      events?: unknown[];
      updatedAt?: string | null;
      schemaVersion?: number;
    };
    const current = getProgress(namespace);
    const incomingData =
      incomingState.data && typeof incomingState.data === "object" && !Array.isArray(incomingState.data)
        ? incomingState.data
        : {};

    if (Object.keys(incomingData).length > 0) {
      saveProgress(namespace, {
        ...current,
        data: {
          ...current.data,
          ...incomingData,
        },
        updatedAt: incomingState.updatedAt || current.updatedAt,
        schemaVersion: incomingState.schemaVersion || current.schemaVersion,
      });
    }

    if (Array.isArray(incomingState.events)) {
      incomingState.events.forEach((event) => {
        if (event && typeof event === "object" && !Array.isArray(event)) {
          appendProgressEvent(namespace, event);
        }
      });
    }
  });

  return exportProgressDump();
}

export function clearAllProgress() {
  safeReset(PROGRESS_PREFIX);
}

export function exportAllDarkData() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    darkProfile: safeRead(PROFILE_KEY, null),
    progress: Object.fromEntries(
      progressNamespaces.map((namespace) => [namespace, getProgress(namespace)]),
    ),
    syncQueue: safeRead(SYNC_QUEUE_KEY, []),
    migrations: readPrefixedData(MIGRATION_PREFIX),
  };
}

export function importAllDarkData(data: string | Record<string, unknown>) {
  const parsed = typeof data === "string" ? safeParseDump(data) : data;
  if (!parsed || typeof parsed !== "object") {
    return exportAllDarkData();
  }

  if ("darkProfile" in parsed) {
    safeWrite(PROFILE_KEY, parsed.darkProfile);
  }

  const progress =
    parsed.progress && typeof parsed.progress === "object"
      ? (parsed.progress as Record<string, unknown>)
      : {};
  Object.entries(progress).forEach(([namespace, value]) => {
    safeWrite(`${PROGRESS_PREFIX}${namespace}`, value);
  });

  if ("syncQueue" in parsed) {
    safeWrite(SYNC_QUEUE_KEY, parsed.syncQueue);
  }

  const migrations =
    parsed.migrations && typeof parsed.migrations === "object"
      ? (parsed.migrations as Record<string, unknown>)
      : {};
  Object.entries(migrations).forEach(([key, value]) => {
    safeWrite(key, value);
  });

  return exportAllDarkData();
}

export function clearDarkData(options: { includeLegacy?: boolean } = {}) {
  safeRemove(PROFILE_KEY);
  safeRemove(SYNC_QUEUE_KEY);
  safeReset(PROGRESS_PREFIX);
  safeReset(MIGRATION_PREFIX);

  if (options.includeLegacy) {
    LEGACY_KEYS.forEach((key) => safeRemove(key));
  }
}

function readPrefixedData(prefix: string) {
  const data: Record<string, unknown> = {};

  try {
    if (!("localStorage" in globalThis)) return data;

    for (let index = 0; index < globalThis.localStorage.length; index += 1) {
      const key = globalThis.localStorage.key(index);
      if (key?.startsWith(prefix)) {
        data[key] = safeRead(key, null);
      }
    }
  } catch {
    return data;
  }

  return data;
}

function safeParseDump(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}
