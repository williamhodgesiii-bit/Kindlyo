import type { LessonProgress } from "@/features/lessons/lessonMachine";
import type { MissionStatus } from "@/features/lessons/progressStorage";
import {
  ageBands,
  isAvatarId,
  type AgeBand,
  type AvatarId,
  type ProfileDraft,
} from "@/features/profiles/types";

/**
 * Parsing the untrusted request bodies the family and progress routes receive.
 *
 * Every field a browser sends is validated before the service sees it
 * (CLAUDE.md, "Validate all external input"), the same posture as the waitlist
 * endpoint. These check shape and membership of the closed unions only; the
 * service enforces authorization, and the stores enforce the product rules
 * (the three-profile cap, nickname trimming). A `childProfileId` is never
 * accepted from a body — it is always a path segment the service re-checks.
 */

export type Parsed<T> = { ok: true; value: T } | { ok: false };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAgeBand(value: unknown): value is AgeBand {
  return typeof value === "string" && (ageBands as string[]).includes(value);
}

function parseAvatar(
  value: unknown,
): { ok: true; value: AvatarId | null } | { ok: false } {
  if (value === undefined || value === null) return { ok: true, value: null };
  if (isAvatarId(value)) return { ok: true, value };
  return { ok: false };
}

/** A create body: a nickname and an age band, with an optional avatar. */
export function parseProfileDraft(body: unknown): Parsed<ProfileDraft> {
  if (!isRecord(body)) return { ok: false };
  if (typeof body.nickname !== "string") return { ok: false };
  if (!isAgeBand(body.ageBand)) return { ok: false };
  const avatar = parseAvatar(body.avatarId);
  if (!avatar.ok) return { ok: false };

  const draft: ProfileDraft = {
    nickname: body.nickname,
    ageBand: body.ageBand,
  };
  if (avatar.value !== null) draft.avatarId = avatar.value;
  return { ok: true, value: draft };
}

/** An edit body: any subset of the fields, where `avatarId: null` clears it. */
export function parseProfilePatch(
  body: unknown,
): Parsed<Partial<ProfileDraft>> {
  if (!isRecord(body)) return { ok: false };
  const patch: Partial<ProfileDraft> = {};

  if (body.nickname !== undefined) {
    if (typeof body.nickname !== "string") return { ok: false };
    patch.nickname = body.nickname;
  }
  if (body.ageBand !== undefined) {
    if (!isAgeBand(body.ageBand)) return { ok: false };
    patch.ageBand = body.ageBand;
  }
  if (body.avatarId !== undefined) {
    const avatar = parseAvatar(body.avatarId);
    if (!avatar.ok) return { ok: false };
    patch.avatarId = avatar.value;
  }
  return { ok: true, value: patch };
}

/** `{ profileId: string | null }`; null clears the selection. */
export function parseSelection(body: unknown): Parsed<string | null> {
  if (!isRecord(body)) return { ok: false };
  if (body.profileId === null) return { ok: true, value: null };
  if (typeof body.profileId === "string")
    return { ok: true, value: body.profileId };
  return { ok: false };
}

function parseLessonProgress(value: unknown): LessonProgress | null {
  if (!isRecord(value)) return null;
  const { stepIndex, choiceBySceneId, practiceOptionId, completedAt } = value;
  if (typeof stepIndex !== "number" || !Number.isInteger(stepIndex))
    return null;
  if (!isRecord(choiceBySceneId)) return null;
  if (practiceOptionId !== null && typeof practiceOptionId !== "string")
    return null;
  if (completedAt !== null && typeof completedAt !== "string") return null;

  const choices: Record<string, string> = {};
  for (const [sceneId, choiceId] of Object.entries(choiceBySceneId)) {
    if (typeof choiceId === "string") choices[sceneId] = choiceId;
  }
  return { stepIndex, choiceBySceneId: choices, practiceOptionId, completedAt };
}

export type RunBody = {
  lessonId: string;
  lessonVersion: number;
  state: LessonProgress;
};

export function parseRunBody(body: unknown): Parsed<RunBody> {
  if (!isRecord(body)) return { ok: false };
  if (typeof body.lessonId !== "string" || body.lessonId === "")
    return { ok: false };
  if (typeof body.lessonVersion !== "number") return { ok: false };
  const state = parseLessonProgress(body.state);
  if (state === null) return { ok: false };
  return {
    ok: true,
    value: {
      lessonId: body.lessonId,
      lessonVersion: body.lessonVersion,
      state,
    },
  };
}

export type CompletionBody = {
  lessonId: string;
  lessonVersion: number;
  completedAt: string;
};

export function parseCompletionBody(body: unknown): Parsed<CompletionBody> {
  if (!isRecord(body)) return { ok: false };
  if (typeof body.lessonId !== "string" || body.lessonId === "")
    return { ok: false };
  if (typeof body.lessonVersion !== "number") return { ok: false };
  if (typeof body.completedAt !== "string" || body.completedAt === "") {
    return { ok: false };
  }
  return {
    ok: true,
    value: {
      lessonId: body.lessonId,
      lessonVersion: body.lessonVersion,
      completedAt: body.completedAt,
    },
  };
}

export type MissionBody = { lessonId: string; status: MissionStatus | null };

export function parseMissionBody(body: unknown): Parsed<MissionBody> {
  if (!isRecord(body)) return { ok: false };
  if (typeof body.lessonId !== "string" || body.lessonId === "")
    return { ok: false };
  if (body.status !== "done" && body.status !== null) return { ok: false };
  return { ok: true, value: { lessonId: body.lessonId, status: body.status } };
}
