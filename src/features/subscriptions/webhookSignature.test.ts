import { describe, expect, it } from "vitest";
import {
  computeStripeSignature,
  verifyStripeSignature,
} from "./webhookSignature";

const secret = "whsec_test_secret";
const payload = JSON.stringify({
  id: "evt_1",
  type: "customer.subscription.updated",
});
const now = 1_700_000_000;

function headerFor(
  body: string,
  timestamp: number,
  withSecret: string = secret,
): string {
  return `t=${timestamp},v1=${computeStripeSignature(body, withSecret, timestamp)}`;
}

describe("verifyStripeSignature", () => {
  it("accepts a correctly signed, timely payload", () => {
    const result = verifyStripeSignature({
      payload,
      header: headerFor(payload, now),
      secret,
      nowSeconds: now,
    });
    expect(result.ok).toBe(true);
  });

  it("accepts when one of several v1 signatures matches (key rotation)", () => {
    const good = computeStripeSignature(payload, secret, now);
    const header = `t=${now},v1=deadbeef,v1=${good}`;
    expect(
      verifyStripeSignature({ payload, header, secret, nowSeconds: now }).ok,
    ).toBe(true);
  });

  it("rejects a tampered payload", () => {
    const header = headerFor(payload, now);
    const result = verifyStripeSignature({
      payload: payload + " ",
      header,
      secret,
      nowSeconds: now,
    });
    expect(result).toEqual({ ok: false, reason: "no-match" });
  });

  it("rejects a signature made with the wrong secret", () => {
    const header = headerFor(payload, now, "whsec_attacker");
    const result = verifyStripeSignature({
      payload,
      header,
      secret,
      nowSeconds: now,
    });
    expect(result).toEqual({ ok: false, reason: "no-match" });
  });

  it("rejects a timestamp outside the tolerance (replay)", () => {
    const result = verifyStripeSignature({
      payload,
      header: headerFor(payload, now - 10_000),
      secret,
      nowSeconds: now,
    });
    expect(result).toEqual({ ok: false, reason: "timestamp-out-of-tolerance" });
  });

  it("reports a missing header", () => {
    expect(
      verifyStripeSignature({ payload, header: null, secret, nowSeconds: now }),
    ).toEqual({ ok: false, reason: "missing-header" });
  });

  it("reports a malformed header", () => {
    expect(
      verifyStripeSignature({
        payload,
        header: "not-a-signature",
        secret,
        nowSeconds: now,
      }),
    ).toEqual({ ok: false, reason: "malformed-header" });
  });

  it("refuses to verify without a configured secret", () => {
    expect(
      verifyStripeSignature({
        payload,
        header: headerFor(payload, now),
        secret: "",
        nowSeconds: now,
      }),
    ).toEqual({ ok: false, reason: "missing-secret" });
  });
});
