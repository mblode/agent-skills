const WINDOW_MS = 60_000;
const LIMIT = 120;

const windows = new Map();

export const limiter = {
  limit: LIMIT,
  take(key, now = Date.now()) {
    let window = windows.get(key);
    if (!window || now >= window.resetAt) {
      window = { used: 0, resetAt: now + WINDOW_MS };
      windows.set(key, window);
    }
    window.used += 1;
    return {
      allowed: window.used <= LIMIT,
      remaining: Math.max(0, LIMIT - window.used),
      resetAt: window.resetAt,
    };
  },
};
