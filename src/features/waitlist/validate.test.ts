import { describe, expect, it } from "vitest";
import { maxEmailLength } from "./types";
import { isEmailShaped, parseWaitlistSubmission } from "./validate";

describe("isEmailShaped", () => {
  const accepted = [
    "parent@example.com",
    "a@b.co",
    "first.last@example.co.uk",
    "parent+kindlyo@example.com",
    "PARENT@EXAMPLE.COM",
    "p@sub.domain.example.org",
  ];

  const rejected = [
    "",
    "parent",
    "parent@",
    "@example.com",
    "parent@example",
    "parent@@example.com",
    "parent@example..com",
    "parent@-example.com",
    "parent@example-.com",
    "parent@example.c",
    "parent@example.1234",
    "par ent@example.com",
    "parent@exa mple.com",
    ".parent@example.com",
    "parent.@example.com",
    "par..ent@example.com",
  ];

  for (const value of accepted) {
    it(`accepts ${value}`, () => {
      expect(isEmailShaped(value)).toBe(true);
    });
  }

  for (const value of rejected) {
    it(`rejects ${JSON.stringify(value)}`, () => {
      expect(isEmailShaped(value)).toBe(false);
    });
  }
});

describe("parseWaitlistSubmission", () => {
  it("accepts an email on its own", () => {
    const result = parseWaitlistSubmission({ email: "parent@example.com" });

    expect(result).toEqual({
      ok: true,
      value: { email: "parent@example.com" },
    });
  });

  it("trims surrounding whitespace", () => {
    const result = parseWaitlistSubmission({
      email: "  parent@example.com \n",
    });

    expect(result.ok && result.value.email).toBe("parent@example.com");
  });

  it("accepts a known age band", () => {
    const result = parseWaitlistSubmission({
      email: "parent@example.com",
      ageBand: "7–9",
    });

    expect(result).toEqual({
      ok: true,
      value: { email: "parent@example.com", ageBand: "7–9" },
    });
  });

  it("treats an absent, null, or empty age band as unanswered", () => {
    for (const ageBand of [undefined, null, ""]) {
      const result = parseWaitlistSubmission({
        email: "parent@example.com",
        ageBand,
      });

      expect(result.ok).toBe(true);
      expect(result.ok && "ageBand" in result.value).toBe(false);
    }
  });

  it("rejects an age band it does not recognise", () => {
    const result = parseWaitlistSubmission({
      email: "parent@example.com",
      ageBand: "10-12",
    });

    expect(result.ok).toBe(false);
    expect(!result.ok && result.issues.join(" ")).toMatch(/age/i);
  });

  it("rejects a missing email", () => {
    for (const value of [{}, { email: "" }, { email: "   " }, { email: 7 }]) {
      const result = parseWaitlistSubmission(value);
      expect(result.ok).toBe(false);
    }
  });

  it("rejects an email longer than the RFC limit", () => {
    const local = "a".repeat(maxEmailLength);
    const result = parseWaitlistSubmission({ email: `${local}@example.com` });

    expect(result.ok).toBe(false);
    expect(!result.ok && result.issues.join(" ")).toMatch(/too long/i);
  });

  it("rejects anything that is not an object", () => {
    for (const value of [null, undefined, "parent@example.com", 7, []]) {
      expect(parseWaitlistSubmission(value).ok).toBe(false);
    }
  });

  it("rejects fields it was not expecting", () => {
    // A form with nowhere to put a child's name should also be an endpoint
    // with nowhere to put one.
    const result = parseWaitlistSubmission({
      email: "parent@example.com",
      childName: "Ada",
    });

    expect(result.ok).toBe(false);
    expect(!result.ok && result.issues.join(" ")).toMatch(/childName/);
  });

  it("reports every problem at once rather than the first", () => {
    const result = parseWaitlistSubmission({ email: "nope", ageBand: "12" });

    expect(result.ok).toBe(false);
    expect(!result.ok && result.issues).toHaveLength(2);
  });
});
