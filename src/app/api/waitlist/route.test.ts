import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WaitlistEntry } from "@/features/waitlist/types";

const recorded: WaitlistEntry[] = [];

vi.mock("@/features/waitlist/sink", () => ({
  getWaitlistSink: () => ({
    record: (entry: WaitlistEntry) => {
      recorded.push(entry);
      return Promise.resolve();
    },
  }),
}));

const { POST } = await import("./route");

/**
 * Each test uses its own forwarded address. The route's rate limit is
 * module-level state shared across this file, and a shared key would make the
 * sixth test in the file fail for a reason that has nothing to do with it.
 */
let nextClient = 0;
function post(body: unknown, init?: { contentType?: string | null }) {
  nextClient += 1;
  const headers = new Headers({ "x-forwarded-for": `10.0.0.${nextClient}` });
  const contentType =
    init?.contentType === undefined ? "application/json" : init.contentType;
  if (contentType !== null) headers.set("content-type", contentType);

  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    recorded.length = 0;
  });

  it("records a valid submission", async () => {
    const response = await POST(post({ email: "parent@example.com" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(recorded).toHaveLength(1);
    expect(recorded[0]?.email).toBe("parent@example.com");
  });

  it("keeps an optional age band", async () => {
    await POST(post({ email: "parent@example.com", ageBand: "5–6" }));

    expect(recorded[0]?.ageBand).toBe("5–6");
  });

  it("timestamps the entry on the server", async () => {
    await POST(post({ email: "parent@example.com" }));

    const receivedAt = recorded[0]?.receivedAt ?? "";
    expect(Number.isNaN(Date.parse(receivedAt))).toBe(false);
  });

  it("rejects a malformed address without recording anything", async () => {
    const response = await POST(post({ email: "not-an-email" }));

    expect(response.status).toBe(400);
    const body: unknown = await response.json();
    expect(body).toMatchObject({ ok: false });
    expect(recorded).toHaveLength(0);
  });

  it("returns the validation issues so the form can show them", async () => {
    const response = await POST(post({ email: "not-an-email" }));
    const body = (await response.json()) as { issues: string[] };

    expect(body.issues.join(" ")).toMatch(/email address/i);
  });

  it("does not throw on a body that is not JSON", async () => {
    const response = await POST(post("{ not json"));

    expect(response.status).toBe(400);
    expect(recorded).toHaveLength(0);
  });

  it("refuses a request that is not sent as JSON", async () => {
    const response = await POST(
      post({ email: "parent@example.com" }, { contentType: "text/plain" }),
    );

    expect(response.status).toBe(415);
    expect(recorded).toHaveLength(0);
  });

  it("refuses an oversized body", async () => {
    const response = await POST(
      post({ email: `${"a".repeat(5000)}@example.com` }),
    );

    expect(response.status).toBe(413);
    expect(recorded).toHaveLength(0);
  });

  it("rejects a field the form does not have", async () => {
    const response = await POST(
      post({ email: "parent@example.com", childName: "Ada" }),
    );

    expect(response.status).toBe(400);
    expect(recorded).toHaveLength(0);
  });

  it("rate limits repeated submissions from one address", async () => {
    const send = () =>
      POST(
        new Request("http://localhost/api/waitlist", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": "203.0.113.9",
          },
          body: JSON.stringify({ email: "parent@example.com" }),
        }),
      );

    const statuses: number[] = [];
    for (let attempt = 0; attempt < 7; attempt += 1) {
      statuses.push((await send()).status);
    }

    expect(statuses.filter((status) => status === 200).length).toBe(5);
    expect(statuses.filter((status) => status === 429).length).toBe(2);
  });

  it("tells a rate-limited caller when to try again", async () => {
    const send = () =>
      POST(
        new Request("http://localhost/api/waitlist", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": "203.0.113.10",
          },
          body: JSON.stringify({ email: "parent@example.com" }),
        }),
      );

    let response = await send();
    for (let attempt = 0; attempt < 5; attempt += 1) response = await send();

    expect(response.status).toBe(429);
    expect(Number(response.headers.get("retry-after"))).toBeGreaterThan(0);
  });

  it("never caches a response", async () => {
    const response = await POST(post({ email: "parent@example.com" }));

    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
