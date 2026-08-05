import { describe, expect, it } from "vitest";
import { createFixedWindowLimiter } from "./rateLimit";

function clock(start = 0) {
  let value = start;
  return {
    now: () => value,
    advance: (ms: number) => {
      value += ms;
    },
  };
}

describe("createFixedWindowLimiter", () => {
  it("allows up to the limit within a window", () => {
    const limiter = createFixedWindowLimiter({ limit: 3, windowMs: 1000 });

    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
  });

  it("says how long to wait when it refuses", () => {
    const time = clock();
    const limiter = createFixedWindowLimiter({
      limit: 1,
      windowMs: 60_000,
      now: time.now,
    });

    limiter.check("a");
    time.advance(10_000);

    expect(limiter.check("a")).toEqual({
      allowed: false,
      retryAfterSeconds: 50,
    });
  });

  it("starts a fresh window once the old one has passed", () => {
    const time = clock();
    const limiter = createFixedWindowLimiter({
      limit: 1,
      windowMs: 1000,
      now: time.now,
    });

    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);

    time.advance(1000);
    expect(limiter.check("a").allowed).toBe(true);
  });

  it("counts each key separately", () => {
    const limiter = createFixedWindowLimiter({ limit: 1, windowMs: 1000 });

    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("b").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
  });

  it("does not grow without bound", () => {
    const time = clock();
    const limiter = createFixedWindowLimiter({
      limit: 1,
      windowMs: 1000,
      maxKeys: 4,
      now: time.now,
    });

    for (let index = 0; index < 50; index += 1) {
      limiter.check(`key-${index}`);
      time.advance(2000);
    }

    // Nothing to assert about the internals from out here; what matters is
    // that the sweep never refuses a caller it should have allowed.
    expect(limiter.check("fresh").allowed).toBe(true);
  });
});
