import { describe, expect, it } from "vitest";
import { isDevRouteEnabled } from "./devOnly";

describe("isDevRouteEnabled", () => {
  it("allows the route while developing", () => {
    expect(isDevRouteEnabled("development")).toBe(true);
  });

  it("blocks the route in production and preview builds", () => {
    expect(isDevRouteEnabled("production")).toBe(false);
    expect(isDevRouteEnabled("test")).toBe(false);
  });

  it("blocks the route when the environment is unset", () => {
    // Failing closed matters more than failing loudly here: an unknown
    // environment must never expose internal tooling.
    expect(isDevRouteEnabled(undefined)).toBe(false);
    expect(isDevRouteEnabled("")).toBe(false);
  });
});
