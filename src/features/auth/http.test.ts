// @vitest-environment node
import { describe, expect, it } from "vitest";
import { bodyField, clientKey, safeNextPath } from "./http";

describe("safeNextPath", () => {
  it("allows same-origin relative paths", () => {
    expect(safeNextPath("/parent")).toBe("/parent");
    expect(safeNextPath("/learn/lesson/saying-hello")).toBe(
      "/learn/lesson/saying-hello",
    );
  });

  it("rejects protocol-relative and absolute URLs (open redirect)", () => {
    expect(safeNextPath("//evil.example")).toBe("/parent");
    expect(safeNextPath("https://evil.example")).toBe("/parent");
    expect(safeNextPath("http://evil.example")).toBe("/parent");
  });

  it("rejects non-paths and empty input, using the fallback", () => {
    expect(safeNextPath(null)).toBe("/parent");
    expect(safeNextPath(undefined)).toBe("/parent");
    expect(safeNextPath("")).toBe("/parent");
    expect(safeNextPath("relative")).toBe("/parent");
  });

  it("honours a custom fallback", () => {
    expect(safeNextPath(null, "/login")).toBe("/login");
  });
});

describe("bodyField", () => {
  it("reads a field from an object", () => {
    expect(bodyField({ email: "a@b.co" }, "email")).toBe("a@b.co");
  });

  it("returns undefined for non-objects or missing keys", () => {
    expect(bodyField(null, "email")).toBeUndefined();
    expect(bodyField("nope", "email")).toBeUndefined();
    expect(bodyField({}, "email")).toBeUndefined();
  });
});

describe("clientKey", () => {
  it("uses the first x-forwarded-for entry", () => {
    const request = new Request("https://kindlyo.example/api/auth/signin", {
      headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" },
    });
    expect(clientKey(request)).toBe("203.0.113.7");
  });

  it("falls back to a constant when the header is absent", () => {
    const request = new Request("https://kindlyo.example/api/auth/signin");
    expect(clientKey(request)).toBe("unknown");
  });
});
