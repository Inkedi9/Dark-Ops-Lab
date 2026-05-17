import { appendProgressEvent, getProgress } from "@dark/progress";
import { addGlobalXp } from "@dark/profile";

const NAMESPACE = "splaining";
const SOURCE = "dark-splaining";

type SplainingEventType =
  | "lesson_started"
  | "lesson_completed"
  | "quiz_completed"
  | "exercise_completed"
  | "track_started"
  | "track_completed"
  | "command_module_completed"
  | "concept_viewed"
  | "xp_awarded";

type EventPayload = Record<string, unknown>;

function buildIdempotencyKey(type: SplainingEventType, entityId: string) {
  return `splaining:${type}:${entityId}`;
}

function hasRecordedEvent(type: SplainingEventType, entityId: string) {
  const idempotencyKey = buildIdempotencyKey(type, entityId);

  try {
    return getProgress(NAMESPACE).events.some(
      (event) => event.idempotencyKey === idempotencyKey,
    );
  } catch {
    return false;
  }
}

function recordSplainingEvent(
  type: SplainingEventType,
  entityId: string,
  payload: EventPayload = {},
) {
  if (!entityId) return null;

  try {
    return appendProgressEvent(NAMESPACE, {
      type,
      source: SOURCE,
      namespace: NAMESPACE,
      entityId,
      idempotencyKey: buildIdempotencyKey(type, entityId),
      payload: {
        entityId,
        ...payload,
      },
    });
  } catch {
    return null;
  }
}

function awardSplainingXp(amount: number, sourceType: SplainingEventType, entityId: string) {
  const safeAmount = Math.max(0, Number(amount) || 0);
  if (!safeAmount || !entityId) return null;

  const xpEntityId = `${sourceType}:${entityId}`;
  const alreadyAwarded = hasRecordedEvent("xp_awarded", xpEntityId);

  recordSplainingEvent("xp_awarded", xpEntityId, {
    xp: safeAmount,
    sourceType,
  });

  if (alreadyAwarded) return null;

  try {
    return addGlobalXp(safeAmount, SOURCE, xpEntityId);
  } catch {
    return null;
  }
}

function recordRewardedEvent(
  type: SplainingEventType,
  entityId: string,
  xpAwarded = 0,
  payload: EventPayload = {},
) {
  const event = recordSplainingEvent(type, entityId, {
    awardedXp: xpAwarded,
    ...payload,
  });

  awardSplainingXp(xpAwarded, type, entityId);

  return event;
}

export function recordLessonStarted(lessonId: string, xpAwarded = 0) {
  return recordRewardedEvent("lesson_started", lessonId, xpAwarded);
}

export function recordExerciseCompleted(lessonId: string, xpAwarded = 0) {
  return recordRewardedEvent("exercise_completed", lessonId, xpAwarded);
}

export function recordQuizCompleted(lessonId: string, xpAwarded = 0) {
  return recordRewardedEvent("quiz_completed", lessonId, xpAwarded);
}

export function recordLessonCompleted(lessonId: string, xpAwarded = 0) {
  return recordRewardedEvent("lesson_completed", lessonId, xpAwarded);
}

export function recordTrackStarted(trackId: string) {
  return recordSplainingEvent("track_started", trackId);
}

export function recordTrackCompleted(trackId: string) {
  return recordSplainingEvent("track_completed", trackId);
}

export function recordCommandModuleCompleted(moduleId: string) {
  return recordSplainingEvent("command_module_completed", moduleId);
}

export function recordConceptViewed(conceptId: string, payload: EventPayload = {}) {
  return recordSplainingEvent("concept_viewed", conceptId, payload);
}
