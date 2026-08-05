import { describe, expect, it } from "vitest";
import { minPasswordLength } from "./types";
import {
  parseEmail,
  parseNewPassword,
  parseSignInCredentials,
  parseSignUpCredentials,
} from "./validate";

describe("parseEmail", () => {
  it("accepts a well-formed address, trimmed", () => {
    expect(parseEmail("  parent@example.com ")).toEqual({
      ok: true,
      value: "parent@example.com",
    });
  });

  it("rejects a missing address", () => {
    expect(parseEmail(undefined).ok).toBe(false);
    expect(parseEmail("").ok).toBe(false);
  });

  it("rejects something that is not email-shaped", () => {
    const result = parseEmail("not-email");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]).toMatch(/does not look like an email/i);
    }
  });
});

describe("parseNewPassword", () => {
  it("accepts a password at the minimum length", () => {
    const password = "x".repeat(minPasswordLength);
    expect(parseNewPassword(password)).toEqual({ ok: true, value: password });
  });

  it("rejects a password below the minimum length", () => {
    const result = parseNewPassword("x".repeat(minPasswordLength - 1));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]).toMatch(
        new RegExp(`at least ${minPasswordLength}`),
      );
    }
  });

  it("rejects a non-string", () => {
    expect(parseNewPassword(12345678).ok).toBe(false);
  });
});

describe("parseSignInCredentials", () => {
  it("accepts a shaped email and a present password of any length", () => {
    expect(
      parseSignInCredentials({ email: "parent@example.com", password: "a" }),
    ).toEqual({
      ok: true,
      value: { email: "parent@example.com", password: "a" },
    });
  });

  it("does not apply the length rule on sign-in", () => {
    // An older, short password must still be allowed through to the provider.
    const result = parseSignInCredentials({
      email: "parent@example.com",
      password: "short",
    });
    expect(result.ok).toBe(true);
  });

  it("collects issues from both fields at once", () => {
    const result = parseSignInCredentials({ email: "nope", password: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toHaveLength(2);
    }
  });

  it("rejects a non-object body", () => {
    expect(parseSignInCredentials("nope").ok).toBe(false);
  });

  it("ignores extra fields such as redirectTo", () => {
    const result = parseSignInCredentials({
      email: "parent@example.com",
      password: "secret123",
      redirectTo: "/parent",
    });
    expect(result).toEqual({
      ok: true,
      value: { email: "parent@example.com", password: "secret123" },
    });
  });
});

describe("parseSignUpCredentials", () => {
  it("applies the new-password length rule", () => {
    const result = parseSignUpCredentials({
      email: "parent@example.com",
      password: "short",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => /at least/.test(issue))).toBe(true);
    }
  });

  it("accepts a shaped email and a long-enough password", () => {
    expect(
      parseSignUpCredentials({
        email: "parent@example.com",
        password: "longenough1",
      }),
    ).toEqual({
      ok: true,
      value: { email: "parent@example.com", password: "longenough1" },
    });
  });
});
