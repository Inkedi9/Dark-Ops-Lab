import { safeRead, safeWrite } from "@dark/storage";
import type { ProgressEvent, ProgressNamespace } from "@dark/types";
import { appendProgressEvent, getProgress } from "./index";

const MIGRATION_KEY = "dark:migrations:v1";

type LegacyEventDraft = Partial<ProgressEvent> & {
  namespace: ProgressNamespace;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function getLegacyStatus(value: unknown) {
  return typeof value === "string" ? value.toLowerCase() : null;
}

function isLegacyCompleted(progress: Record<string, unknown>) {
  const status = getLegacyStatus(progress.status);

  return (
    progress.completed === true ||
    progress.solved === true ||
    status === "completed" ||
    status === "done" ||
    status === "captured"
  );
}

function legacyEvent({
  namespace,
  type,
  source,
  entityId,
  payload = {},
}: {
  namespace: ProgressNamespace;
  type: string;
  source: string;
  entityId: string;
  payload?: Record<string, unknown>;
}): LegacyEventDraft {
  return {
    namespace,
    type,
    source,
    entityId,
    idempotencyKey: `${namespace}:${type}:${entityId}`,
    payload: {
      ...payload,
      legacy: true,
    },
  };
}

export function previewLegacyMigration() {
  const drafts: LegacyEventDraft[] = [];

  const splainingXp = safeRead<number>("darksplaining:xp", 0);
  if (splainingXp > 0) {
    drafts.push(
      legacyEvent({
        namespace: "splaining",
        type: "xp_awarded",
        source: "legacy:darksplaining",
        entityId: "local-xp",
        payload: { xp: splainingXp },
      }),
    );
  }

  const lessonProgress = asRecord(safeRead("darksplaining.lessonProgress", {}));
  Object.entries(lessonProgress).forEach(([lessonId, value]) => {
    const progress = asRecord(value);
    const status = typeof value === "string" ? value : progress.status;

    if (progress.quizCompleted) {
      drafts.push(
        legacyEvent({
          namespace: "splaining",
          type: "quiz_completed",
          source: "legacy:darksplaining",
          entityId: lessonId,
          payload: { lessonId },
        }),
      );
    }

    if (status === "completed") {
      drafts.push(
        legacyEvent({
          namespace: "splaining",
          type: "lesson_completed",
          source: "legacy:darksplaining",
          entityId: lessonId,
          payload: { lessonId },
        }),
      );
    }
  });

  const challengeGlobal = asRecord(safeRead("dc_global_progress", {}));
  const challengeXp = Number(challengeGlobal.totalXp || 0);
  if (challengeXp > 0) {
    drafts.push(
      legacyEvent({
        namespace: "challenges",
        type: "xp_awarded",
        source: "legacy:darkchallenges",
        entityId: "local-xp",
        payload: { xp: challengeXp },
      }),
    );
  }

  asArray(safeRead("darkchallenges:progress", [])).forEach((item) => {
    const progress = asRecord(item);
    if (!isLegacyCompleted(progress) || !progress.challengeId) return;

    drafts.push(
      legacyEvent({
        namespace: "challenges",
        type: "challenge_completed",
        source: "legacy:darkchallenges",
        entityId: String(progress.challengeId),
        payload: {
          challengeId: progress.challengeId,
          xp: progress.bestScore,
          attempts: progress.attempts,
          hintsUsed: progress.hintsUsed,
          solvedAt: progress.solvedAt,
        },
      }),
    );
  });

  asArray(safeRead("darkchallenges:ctf-progress", [])).forEach((item) => {
    const progress = asRecord(item);
    if (!isLegacyCompleted(progress) || !progress.ctfId) return;

    drafts.push(
      legacyEvent({
        namespace: "challenges",
        type: "ctf_completed",
        source: "legacy:darkchallenges",
        entityId: `ctf:${String(progress.ctfId)}`,
        payload: {
          kind: "ctf",
          challengeId: progress.ctfId,
          completedAt: progress.completedAt,
        },
      }),
    );
  });

  asArray(safeRead("darkchallenges:warzone-progress", [])).forEach((item) => {
    const progress = asRecord(item);
    if (!isLegacyCompleted(progress) || !progress.warzoneId) return;

    drafts.push(
      legacyEvent({
        namespace: "challenges",
        type: "warzone_completed",
        source: "legacy:darkchallenges",
        entityId: `warzone:${String(progress.warzoneId)}`,
        payload: {
          kind: "warzone",
          challengeId: progress.warzoneId,
          completedAt: progress.completedAt,
          actionsCount: progress.actionsCount,
        },
      }),
    );
  });

  asArray(safeRead("phishscope-results", [])).forEach((item, index) => {
    const result = asRecord(item);
    const scenarioId = result.scenarioId || result.emailId || `analysis-${index}`;

    drafts.push(
      legacyEvent({
        namespace: "defend",
        type: "phishing_analyzed",
        source: "legacy:darkdefend",
        entityId: String(scenarioId),
        payload: result,
      }),
    );
  });

  asArray(safeRead("darkdefend-incidents", [])).forEach((item) => {
    const incident = asRecord(item);
    if (!incident.id) return;

    drafts.push(
      legacyEvent({
        namespace: "defend",
        type: "incident_generated",
        source: "legacy:darkdefend",
        entityId: String(incident.id),
        payload: incident,
      }),
    );
  });

  const securityCheck = asRecord(safeRead("darkdefend-security-check", {}));
  if (Object.keys(securityCheck).length > 0) {
    drafts.push(
      legacyEvent({
        namespace: "defend",
        type: "security_check_completed",
        source: "legacy:darkdefend",
        entityId: "security-check",
        payload: { answers: securityCheck },
      }),
    );
  }

  return {
    alreadyMigrated: Boolean(safeRead(MIGRATION_KEY, null)),
    events: drafts,
  };
}

export function migrateLegacyProgress() {
  const migrationState = safeRead(MIGRATION_KEY, null);
  if (migrationState) {
    return {
      migrated: false,
      alreadyMigrated: true,
      eventsWritten: 0,
    };
  }

  const preview = previewLegacyMigration();
  let eventsWritten = 0;

  preview.events.forEach((event) => {
    const before = getProgress(event.namespace).events.length;
    const existing = appendProgressEvent(event.namespace, event);
    const after = getProgress(event.namespace).events.length;

    if (existing.idempotencyKey === event.idempotencyKey && after > before) {
      eventsWritten += 1;
    }
  });

  safeWrite(MIGRATION_KEY, {
    schemaVersion: 1,
    migratedAt: new Date().toISOString(),
    eventsWritten,
  });

  return {
    migrated: true,
    alreadyMigrated: false,
    eventsWritten,
  };
}
