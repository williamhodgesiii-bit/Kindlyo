import { describe, expect, it } from "vitest";
import {
  genericResetSentMessage,
  genericSignInError,
  genericSignUpError,
  isRateLimitError,
  rateLimitedError,
  toAuthErrorMessage,
} from "./errors";

describe("isRateLimitError", () => {
  it("recognises an HTTP 429", () => {
    expect(isRateLimitError({ status: 429 })).toBe(true);
  });

  it("recognises a rate-limit code or message", () => {
    expect(isRateLimitError({ code: "over_request_rate_limit" })).toBe(true);
    expect(isRateLimitError({ message: "Email rate limit exceeded" })).toBe(
      true,
    );
  });

  it("does not flag ordinary errors", () => {
    expect(isRateLimitError({ status: 400, message: "Invalid login" })).toBe(
      false,
    );
    expect(isRateLimitError(new Error("nope"))).toBe(false);
    expect(isRateLimitError(null)).toBe(false);
    expect(isRateLimitError("string")).toBe(false);
  });
});

describe("toAuthErrorMessage", () => {
  it("returns the caller's generic fallback for an ordinary error", () => {
    expect(
      toAuthErrorMessage(new Error("wrong password"), genericSignInError),
    ).toBe(genericSignInError);
  });

  it("returns the rate-limit notice when the error is a rate limit", () => {
    expect(toAuthErrorMessage({ status: 429 }, genericSignInError)).toBe(
      rateLimitedError,
    );
  });
});

describe("generic messages never enumerate accounts", () => {
  it("say nothing about whether an address exists", () => {
    // The whole point: none of these leaks account existence. If someone later
    // "improves" a message to say "no account found", this fails.
    const forbidden =
      /no account|not found|does(n't| not) exist|already (registered|in use|exists)|unknown (email|user)/i;
    for (const message of [
      genericSignInError,
      genericSignUpError,
      genericResetSentMessage,
    ]) {
      expect(message).not.toMatch(forbidden);
    }
  });

  it("blames the details as a pair, never one field", () => {
    // Sign-in must not reveal which of email/password was wrong: it reports a
    // combined "did not match" rather than singling one out.
    expect(genericSignInError.toLowerCase()).toContain("did not match");
  });
});
