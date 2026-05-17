import { getProgress } from "@dark/progress";

function getNexusBaseUrl() {
  const configuredUrl = import.meta.env.VITE_DARK_NEXUS_URL;
  if (configuredUrl) return String(configuredUrl).replace(/\/$/, "");

  if (globalThis.location?.hostname === "localhost") {
    return "http://localhost:3000";
  }

  return "https://darknexus.vercel.app";
}

function encodePayload(value) {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

export function buildNexusTelemetryImportUrl(payload) {
  return `${getNexusBaseUrl()}/telemetry/import#payload=${encodePayload(payload)}`;
}

function readDarkProfile() {
  try {
    const raw = globalThis.localStorage?.getItem("dark_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getDefendTelemetryPayload() {
  const defendProgress = getProgress("defend");

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: "dark-defend",
    progress: {
      defend: defendProgress,
    },
    darkProfile: readDarkProfile(),
  };
}

export function getDefendTelemetryImportUrl() {
  return buildNexusTelemetryImportUrl(getDefendTelemetryPayload());
}

export function hasDefendTelemetryEvents() {
  return getProgress("defend").events.length > 0;
}
