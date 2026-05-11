import { getProgress } from "@dark/progress";

function getNexusBaseUrl() {
    const configuredUrl = process.env.NEXT_PUBLIC_DARK_NEXUS_URL;
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

function readDarkProfile() {
    try {
        const raw = globalThis.localStorage?.getItem("dark_profile");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function buildNexusTelemetryImportUrl(payload: unknown) {
    return `${getNexusBaseUrl()}/telemetry/import#payload=${encodePayload(payload)}`;
}

export function getChallengesTelemetryPayload() {
    const challengesProgress = getProgress("challenges");

    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        source: "dark-challenges",
        progress: {
            challenges: challengesProgress,
        },
        darkProfile: readDarkProfile(),
    };
}

export function getChallengesTelemetryImportUrl() {
    return buildNexusTelemetryImportUrl(getChallengesTelemetryPayload());
}

export function hasChallengesTelemetryEvents() {
    return getProgress("challenges").events.length > 0;
}
