import { appendProgressEvent } from "@dark/progress";

const NAMESPACE = "defend";
const SOURCE = "dark-defend";

type DefendEventType =
  | "phishing_analyzed"
  | "incident_generated"
  | "security_check_completed"
  | "soc_escalation";

type EventPayload = Record<string, unknown>;

function recordDefendEvent(
  type: DefendEventType,
  entityId: string,
  payload: EventPayload = {},
) {
  if (!entityId) return null;

  return appendProgressEvent(NAMESPACE, {
    type,
    source: SOURCE,
    namespace: NAMESPACE,
    entityId,
    idempotencyKey: `${NAMESPACE}:${type}:${entityId}`,
    payload: {
      entityId,
      ...payload,
    },
  });
}

export function recordPhishingAnalyzed(
  scenarioId: string | number,
  payload: EventPayload = {},
) {
  return recordDefendEvent("phishing_analyzed", String(scenarioId), payload);
}

export function recordIncidentGenerated(
  incidentId: string,
  payload: EventPayload = {},
) {
  return recordDefendEvent("incident_generated", incidentId, payload);
}

export function recordSecurityCheckCompleted(
  score: string | number,
  payload: EventPayload = {},
) {
  return recordDefendEvent("security_check_completed", String(score), payload);
}

export function recordSocEscalation(
  incidentId: string,
  payload: EventPayload = {},
) {
  return recordDefendEvent("soc_escalation", incidentId, payload);
}
