"use client";

import type { ReactNode } from "react";
import AppShell from "@/learn/components/layout/AppShell";
import CommandPaletteProvider from "@/learn/components/layout/CommandPaletteProvider";
import { ToastProvider } from "@dark/ui/components/ToastContext";
import OnboardingModal from "@/learn/components/onboarding/OnboardingModal";
import { useOnboarding } from "@/learn/hooks/useOnboarding";
import ScrollToTop from "@/learn/components/layout/ScrollToTop";

function LearnProviders({ children }: { children: ReactNode }) {
    const { isOnboardingOpen, completeOnboarding } = useOnboarding();

    return (
        <CommandPaletteProvider>
            <ToastProvider>
                <AppShell>
                    <ScrollToTop />
                    {children}
                    <OnboardingModal
                        isOpen={isOnboardingOpen}
                        onClose={completeOnboarding}
                    />
                </AppShell>
            </ToastProvider>
        </CommandPaletteProvider>
    );
}

export default function LearnLayout({ children }: { children: ReactNode }) {
    return <LearnProviders>{children}</LearnProviders>;
}
