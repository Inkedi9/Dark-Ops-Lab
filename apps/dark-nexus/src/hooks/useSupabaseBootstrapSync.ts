"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bootstrapSupabaseSync } from "@/lib/sync/bootstrapSupabaseSync";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

type BootstrapStatus = "idle" | "running" | "success" | "skipped" | "error";

type BootstrapOptions = {
    force?: boolean;
};

export function useSupabaseBootstrapSync() {
    const { configured, loading, user } = useSupabaseSession();
    const [status, setStatus] = useState<BootstrapStatus>("idle");
    const [result, setResult] = useState<Awaited<ReturnType<typeof bootstrapSupabaseSync>> | null>(null);
    const startedForUserRef = useRef<string | null>(null);

    const runNow = useCallback(async (options: BootstrapOptions = {}) => {
        if (!configured || !user) {
            const skippedResult = await bootstrapSupabaseSync(options);
            setResult(skippedResult);
            setStatus(skippedResult.skipped ? "skipped" : "error");
            return skippedResult;
        }

        setStatus("running");
        const nextResult = await bootstrapSupabaseSync(options);
        setResult(nextResult);
        setStatus(nextResult.skipped ? "skipped" : nextResult.ok ? "success" : "error");
        return nextResult;
    }, [configured, user]);

    useEffect(() => {
        if (loading || !configured || !user) return;
        if (startedForUserRef.current === user.id) return;

        startedForUserRef.current = user.id;
        void runNow();
    }, [configured, loading, runNow, user]);

    return {
        status,
        result,
        runNow,
    };
}
