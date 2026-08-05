import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthUser } from "@/features/auth/types";

/**
 * The family routes, at the HTTP boundary.
 *
 * Auth is mocked so a test can be "signed in" as a chosen parent (or nobody);
 * the store underneath is the real in-memory one the routes select offline, so
 * these prove the whole path — parse, resolve the parent's family, scope — not
 * just the handler shell. The cross-family case is the one that matters: parent
 * A holding parent B's real profile id gets a 404 and changes nothing.
 */

let signedInUser: AuthUser | null = null;

vi.mock("@/features/auth/session", () => ({
  getSessionUser: () => Promise.resolve(signedInUser),
}));

const { GET: getFamily } = await import("./route");
const { POST: createProfile } = await import("./profiles/route");
const { DELETE: deleteProfile } = await import("./profiles/[profileId]/route");

const parentA: AuthUser = { id: "rt-a", email: "rt-a@example.com" };
const parentB: AuthUser = { id: "rt-b", email: "rt-b@example.com" };

function createRequest(body: unknown): Request {
  return new Request("http://localhost/api/family/profiles", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function create(nickname: string): Promise<string> {
  const response = await createProfile(
    createRequest({ nickname, ageBand: "5–6" }),
  );
  const body = (await response.json()) as { profile?: { id: string } };
  if (body.profile === undefined) throw new Error("expected a created profile");
  return body.profile.id;
}

async function listNicknames(): Promise<string[]> {
  const response = await getFamily();
  const body = (await response.json()) as {
    profiles: { nickname: string }[];
  };
  return body.profiles.map((profile) => profile.nickname);
}

beforeEach(() => {
  signedInUser = null;
});

describe("the family routes require a session", () => {
  it("answers 401 when nobody is signed in", async () => {
    const response = await getFamily();
    expect(response.status).toBe(401);
  });

  it("refuses to create a profile without a session", async () => {
    const response = await createProfile(createRequest({ nickname: "Ada" }));
    expect(response.status).toBe(401);
  });
});

describe("profiles are scoped to the signed-in parent", () => {
  it("only returns the caller's own children", async () => {
    signedInUser = parentA;
    await create("Ada-scope");

    signedInUser = parentB;
    await create("Ben-scope");
    expect(await listNicknames()).toContain("Ben-scope");
    expect(await listNicknames()).not.toContain("Ada-scope");
  });
});

describe("cross-family access is denied at the route", () => {
  it("cannot delete another family's profile", async () => {
    signedInUser = parentB;
    const bensProfile = await create("Ben-del");

    signedInUser = parentA;
    const response = await deleteProfile(new Request("http://localhost"), {
      params: Promise.resolve({ profileId: bensProfile }),
    });
    expect(response.status).toBe(404);

    // Ben's profile is untouched.
    signedInUser = parentB;
    expect(await listNicknames()).toContain("Ben-del");
  });
});

describe("input is validated", () => {
  it("rejects a body missing the age band", async () => {
    signedInUser = parentA;
    const response = await createProfile(createRequest({ nickname: "Ada" }));
    expect(response.status).toBe(400);
  });
});
