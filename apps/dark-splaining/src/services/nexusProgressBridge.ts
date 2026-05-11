import { exportProgressDump } from "@dark/progress/debug";

function getNexusBaseUrl() {
  const configuredUrl = import.meta.env.VITE_DARK_NEXUS_URL;
  if (configuredUrl) return String(configuredUrl).replace(/\/$/, "");

  if (globalThis.location?.hostname === "localhost") {
    return "http://localhost:3000";
  }

  return "https://darknexus.vercel.app";
}

function encodePayload(value: unknown) {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

export function getNexusTelemetryImportUrl() {
  const payload = encodePayload(exportProgressDump());
  return `${getNexusBaseUrl()}/telemetry/import#payload=${payload}`;
}

export function getNexusDataSettingsSyncUrl() {
  const payload = encodePayload(exportProgressDump());
  return `${getNexusBaseUrl()}/data-settings#payload=${payload}&autoSync=1&closeOnDone=1`;
}

export function openNexusTelemetryImport() {
  globalThis.location.assign(getNexusTelemetryImportUrl());
}
