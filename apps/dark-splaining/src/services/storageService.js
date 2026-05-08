export const storageService = {
  get(key, fallbackValue = null) {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return fallbackValue;
      }

      return JSON.parse(value);
    } catch {
      return fallbackValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can fail in private mode or restricted browsers.
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage can fail in private mode or restricted browsers.
    }
  },
};
