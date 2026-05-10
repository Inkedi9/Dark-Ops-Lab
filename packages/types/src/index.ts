export type AppTone =
  | "blue"
  | "emerald"
  | "violet"
  | "amber"
  | "danger"
  | "slate"
  | "default";

export type RouteTarget = string | ((id: string) => string);

export const STORAGE_SCHEMA_VERSION = 1;

export type ProgressNamespace = "splaining" | "defend" | "challenges" | "nexus" | string;

export type GlobalProfile = {
  id: string;
  username: string;
  xp: number;
  level: number;
  rank: string;
  badges: string[];
  completedLessons: string[];
  completedMissions: string[];
  completedDefend: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProgressEvent = {
  id: string;
  idempotencyKey: string;
  type:
    | "lesson_completed"
    | "challenge_completed"
    | "phishing_analyzed"
    | "incident_generated"
    | "badge_awarded"
    | "quiz_completed"
    | "track_started"
    | "xp_awarded"
    | string;
  source: string;
  namespace: ProgressNamespace;
  entityId: string;
  timestamp: string;
  payload: Record<string, unknown>;
  schemaVersion: number;
};

export type AppProgressState = {
  namespace: ProgressNamespace;
  data: Record<string, unknown>;
  events: ProgressEvent[];
  updatedAt: string | null;
  schemaVersion: number;
};

export type Lesson = {
  id: string;
  title: string;
  status?: string;
  track?: string;
  category?: string;
  level?: string;
  duration?: string;
};

export type Track = {
  id: string;
  title: string;
  status?: string;
  lessonIds?: string[];
  certificate?: boolean;
};

export type Challenge = {
  id: string;
  slug: string;
  title: string;
  difficulty?: string;
  rewardXp?: number;
};

export type DefendIncident = {
  id: string;
  scenarioId?: string | number;
  title: string;
  severity: string;
  status: string;
  createdAt: string;
};

export type SyncQueueItem = {
  id: string;
  eventId: string;
  idempotencyKey: string;
  namespace: ProgressNamespace;
  status: "pending" | "synced";
  createdAt: string;
  syncedAt?: string;
  attempts: number;
  payload: ProgressEvent;
  schemaVersion: number;
};

export type SocAlert = {
  id: string;
  title: string;
  severity: string;
  category?: string;
  status?: string;
  timestamp?: string;
};
