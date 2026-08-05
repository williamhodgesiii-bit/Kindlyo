import { NextResponse } from "next/server";
import { createFixedWindowLimiter } from "@/features/waitlist/rateLimit";
import { getWaitlistSink } from "@/features/waitlist/sink";
import { parseWaitlistSubmission } from "@/features/waitlist/validate";

/**
 * The founding-family waitlist endpoint.
 *
 * All external input is validated before anything is done with it
 * (CLAUDE.md, "Technical expectations"), by the same
 * `parseWaitlistSubmission` the browser form uses, so the two cannot disagree.
 *
 * Where the address actually goes is `getWaitlistSink`'s business. Today that
 * is a server log line, which is a documented placeholder — see
 * `src/features/waitlist/sink.ts`.
 *
 * Error bodies return the validation issues verbatim because they are written
 * for the parent reading them, not for a developer: "That does not look like an
 * email address" is the whole message.
 */

export const dynamic = "force-dynamic";

/** Generous for `{ email, ageBand }` and far below anything worth parsing. */
const maxBodyBytes = 2_000;

const limiter = createFixedWindowLimiter({ limit: 5, windowMs: 60_000 });

const noStore = { "cache-control": "no-store" } as const;

/**
 * Best effort, and spoofable. It is only used to bucket a rate limit, never to
 * identify or store anything about the person submitting.
 */
function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first !== undefined && first !== "" ? first : "unknown";
}

function jsonError(issues: string[], status: number, extra?: HeadersInit) {
  return NextResponse.json(
    { ok: false, issues },
    { status, headers: { ...noStore, ...extra } },
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonError(["Expected a JSON request body."], 415);
  }

  const decision = limiter.check(clientKey(request));
  if (!decision.allowed) {
    return jsonError(
      ["That is a few tries in quick succession. Please wait a moment."],
      429,
      { "retry-after": String(decision.retryAfterSeconds) },
    );
  }

  const raw = await request.text();
  if (raw.length > maxBodyBytes) {
    return jsonError(["That request was too large."], 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError(["That request body was not valid JSON."], 400);
  }

  const parsed = parseWaitlistSubmission(body);
  if (!parsed.ok) {
    return jsonError(parsed.issues, 400);
  }

  await getWaitlistSink().record({
    ...parsed.value,
    // The server owns the timestamp; a browser-supplied one is not evidence.
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true }, { status: 200, headers: noStore });
}
