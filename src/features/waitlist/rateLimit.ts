/**
 * A fixed-window rate limit for the waitlist endpoint.
 *
 * Honest about what it is: an in-memory counter in one server process. It
 * raises the cost of somebody holding down the submit button, and it does
 * nothing at all against a distributed source or across several instances. It
 * is not a security control, and it is not presented as one — a real one
 * belongs at the edge, and arrives with the hosting configuration rather than
 * here.
 *
 * The clock is injectable so the tests do not have to wait a minute.
 */

export type RateLimitDecision = {
  allowed: boolean;
  /** Whole seconds until the current window ends. */
  retryAfterSeconds: number;
};

export type RateLimiter = {
  check(key: string): RateLimitDecision;
};

export type RateLimiterOptions = {
  limit: number;
  windowMs: number;
  now?: () => number;
  /** Entries are dropped once this many keys are held, oldest window first. */
  maxKeys?: number;
};

type Window = { count: number; startedAt: number };

export function createFixedWindowLimiter({
  limit,
  windowMs,
  now = Date.now,
  maxKeys = 5_000,
}: RateLimiterOptions): RateLimiter {
  const windows = new Map<string, Window>();

  return {
    check(key: string): RateLimitDecision {
      const timestamp = now();
      const existing = windows.get(key);

      if (
        existing === undefined ||
        timestamp - existing.startedAt >= windowMs
      ) {
        // A Map with no bound is a slow memory leak on a public endpoint.
        if (windows.size >= maxKeys) {
          for (const [candidate, window] of windows) {
            if (timestamp - window.startedAt >= windowMs) {
              windows.delete(candidate);
            }
          }
          if (windows.size >= maxKeys) windows.clear();
        }
        windows.set(key, { count: 1, startedAt: timestamp });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      const elapsed = timestamp - existing.startedAt;
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((windowMs - elapsed) / 1000),
      );

      if (existing.count >= limit) {
        return { allowed: false, retryAfterSeconds };
      }

      existing.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
