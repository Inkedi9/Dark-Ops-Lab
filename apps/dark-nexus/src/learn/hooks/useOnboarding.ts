"use client";

import { useState } from "react";
import { storageService } from "../services/storageService";

const ONBOARDING_STORAGE_KEY = "darksplaining:onboarding-completed";

export function useOnboarding() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !storageService.get(
      ONBOARDING_STORAGE_KEY,
      false,
    );
  });

  function completeOnboarding() {
    storageService.set(ONBOARDING_STORAGE_KEY, true);
    setIsOnboardingOpen(false);
  }

  function reopenOnboarding() {
    setIsOnboardingOpen(true);
  }

  function resetOnboarding() {
    storageService.remove(ONBOARDING_STORAGE_KEY);
    setIsOnboardingOpen(true);
  }

  return {
    isOnboardingOpen,
    completeOnboarding,
    reopenOnboarding,
    resetOnboarding,
  };
}
