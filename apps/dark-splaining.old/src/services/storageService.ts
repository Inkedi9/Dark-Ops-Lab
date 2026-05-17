import { safeRead, safeRemove, safeWrite } from "@dark/storage";

export const storageService = {
  get<T>(key: string, fallbackValue: T): T {
    return safeRead(key, fallbackValue);
  },

  set<T>(key: string, value: T) {
    safeWrite(key, value);
  },

  remove(key: string) {
    safeRemove(key);
  },
};
