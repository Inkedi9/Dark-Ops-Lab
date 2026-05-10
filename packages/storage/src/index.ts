function hasStorage() {
  return typeof globalThis !== "undefined" && "localStorage" in globalThis;
}

export function safeRead<T>(key: string, fallback: T): T {
  try {
    if (!hasStorage()) return fallback;

    const raw = globalThis.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeWrite<T>(key: string, value: T): T {
  try {
    if (!hasStorage()) return value;

    globalThis.localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch {
    return value;
  }
}

export function safeRemove(key: string) {
  try {
    if (hasStorage()) {
      globalThis.localStorage.removeItem(key);
    }
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export function safeMerge<T extends Record<string, unknown>>(
  key: string,
  partial: Partial<T>,
): T {
  const current = safeRead<Partial<T>>(key, {});
  const base =
    current && typeof current === "object" && !Array.isArray(current)
      ? current
      : {};
  const next = {
    ...base,
    ...(partial || {}),
  } as T;

  return safeWrite(key, next);
}

export function safeReset(prefix: string) {
  try {
    if (!hasStorage()) return;

    const keys: string[] = [];
    for (let index = 0; index < globalThis.localStorage.length; index += 1) {
      const key = globalThis.localStorage.key(index);
      if (key?.startsWith(prefix)) {
        keys.push(key);
      }
    }

    keys.forEach((key) => globalThis.localStorage.removeItem(key));
  } catch {
    // Keep reset safe for QA/dev tools.
  }
}
