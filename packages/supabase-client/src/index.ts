import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

type SupabaseEnv = {
  url: string;
  publishableKey: string;
};

type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | undefined>;
};

let browserClient: SupabaseClient | null = null;

function readViteEnv(key: string) {
  try {
    return (import.meta as ImportMetaWithEnv).env?.[key] || "";
  } catch {
    return "";
  }
}

function readNextEnv(key: string) {
  if (key === "NEXT_PUBLIC_SUPABASE_URL") {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  }

  if (key === "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") {
    return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
  }

  return "";
}

export function getSupabaseEnv(): SupabaseEnv {
  return {
    url:
      readViteEnv("VITE_SUPABASE_URL") ||
      readNextEnv("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey:
      readViteEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ||
      readNextEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  };
}

export function hasSupabaseConfig() {
  const env = getSupabaseEnv();
  return Boolean(env.url && env.publishableKey);
}

export function createBrowserSupabaseClient(): SupabaseClient | null {
  const env = getSupabaseEnv();

  if (!env.url || !env.publishableKey) {
    return null;
  }

  if (typeof window !== "undefined" && browserClient) {
    return browserClient;
  }

  const client = createClient(env.url, env.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  if (typeof window !== "undefined") {
    browserClient = client;
  }

  return client;
}
