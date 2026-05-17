import { useState } from "react";
import { storageService } from "../services/storageService";
import { getLevelFromXp } from "../data/rewards";

export const XP_KEY = "darksplaining:xp";

export function useXp() {
  const [xp, setXp] = useState(() => storageService.get(XP_KEY, 0));

  function addXp(amount: number) {
    if (!amount || amount <= 0) return;

    setXp((currentXp) => {
      const nextXp = currentXp + amount;
      storageService.set(XP_KEY, nextXp);
      return nextXp;
    });
  }

  function setTotalXp(nextXp: number) {
    storageService.set(XP_KEY, nextXp);
    setXp(nextXp);
  }

  function resetXp() {
    storageService.remove(XP_KEY);
    setXp(0);
  }

  const level = getLevelFromXp(xp);

  return {
    xp,
    level,
    addXp,
    setTotalXp,
    resetXp,
  };
}
