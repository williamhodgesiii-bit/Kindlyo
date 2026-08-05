// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  assertLocalAuthAllowed,
  localUserId,
  signSession,
  verifySession,
} from "./localSession";

describe("localUserId", () => {
  it("is deterministic and case-insensitive in the email", () => {
    expect(localUserId("Parent@Example.com")).toBe(
      localUserId("parent@example.com"),
    );
  });
});

describe("signSession / verifySession", () => {
  const session = {
    id: "local:parent@example.com",
    email: "parent@example.com",
  };

  it("round-trips a session it signed", async () => {
    const token = await signSession(session);
    expect(await verifySession(token)).toEqual(session);
  });

  it("rejects a tampered payload", async () => {
    const token = await signSession(session);
    const parts = token.split(".");
    // Re-sign nothing: just swap the payload for a different one, same signature.
    const forged = await signSession({
      id: "local:evil@example.com",
      email: "evil@example.com",
    });
    const stitched = `${forged.split(".")[0]}.${parts[1]}`;
    expect(await verifySession(stitched)).toBeNull();
  });

  it("rejects a wrong signature", async () => {
    const token = await signSession(session);
    const payload = token.split(".")[0];
    expect(await verifySession(`${payload}.not-the-signature`)).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signSession(session, "some-other-secret");
    expect(await verifySession(token)).toBeNull();
  });

  it("rejects malformed and missing tokens", async () => {
    expect(await verifySession(undefined)).toBeNull();
    expect(await verifySession("")).toBeNull();
    expect(await verifySession("no-dot")).toBeNull();
    expect(await verifySession("a.b.c")).toBeNull();
  });
});

describe("assertLocalAuthAllowed", () => {
  it("permits the local environment", () => {
    expect(() => assertLocalAuthAllowed("local")).not.toThrow();
  });

  it("refuses deployed environments", () => {
    expect(() => assertLocalAuthAllowed("preview")).toThrow();
    expect(() => assertLocalAuthAllowed("production")).toThrow();
  });
});
