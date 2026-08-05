/**
 * The browser half of an auth request.
 *
 * The same shape as the waitlist form's `submitToWaitlist`: POST JSON, and fold
 * every outcome — a network failure, a non-JSON error body, a validated
 * rejection — into one small result the form can render. The messages that come
 * back from the server are already generic, so the form shows them verbatim.
 */

export type PostAuthResult =
  { ok: true; data: Record<string, unknown> } | { ok: false; issues: string[] };

const networkFailure =
  "We could not reach the server. Check your connection and try again.";
const serverFallback = "Something went wrong on our end. Please try again.";

function extractIssues(body: unknown): string[] {
  if (
    typeof body === "object" &&
    body !== null &&
    "issues" in body &&
    Array.isArray((body as { issues: unknown }).issues)
  ) {
    return (body as { issues: unknown[] }).issues.filter(
      (issue): issue is string => typeof issue === "string",
    );
  }
  return [];
}

export async function postAuth(
  url: string,
  body: Record<string, unknown>,
): Promise<PostAuthResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, issues: [networkFailure] };
  }

  let parsed: unknown = null;
  try {
    parsed = await response.json();
  } catch {
    parsed = null;
  }

  if (response.ok) {
    const data =
      typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    return { ok: true, data };
  }

  const issues = extractIssues(parsed);
  return { ok: false, issues: issues.length > 0 ? issues : [serverFallback] };
}

/** Reads a string field from a successful response's data, if present. */
export function dataString(
  data: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = data[key];
  return typeof value === "string" ? value : undefined;
}
