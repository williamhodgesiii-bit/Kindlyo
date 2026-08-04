/**
 * Runtime validation for lesson content.
 *
 * Hand-rolled rather than a schema library. `CLAUDE.md` asks us to avoid
 * unnecessary dependencies, and this validates one small, stable shape that we
 * author ourselves; the rules that actually matter here are curriculum rules
 * (a decision needs at least two options, a principle needs at least one
 * context point, reviewed content needs a reviewer) which a generic library
 * would not give us for free.
 *
 * Every lesson passes through `parseLesson` when `src/content/lessons` is
 * imported, so a malformed lesson fails the build rather than reaching a
 * child's screen. See docs/DECISIONS.md record 018.
 *
 * All issues are collected, not thrown one at a time: fixing content is much
 * quicker when the whole list arrives at once.
 */

import {
  consequenceTypes,
  contentStatuses,
  type ConsequenceType,
  type ContentStatus,
  type Lesson,
  type LessonChoice,
  type LessonPractice,
  type LessonPrinciple,
  type LessonScene,
  type PracticeOption,
} from "./schema";

export class LessonContentError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(
      `Invalid lesson content:\n${issues.map((issue) => `  - ${issue}`).join("\n")}`,
    );
    this.name = "LessonContentError";
    this.issues = issues;
  }
}

export type LessonParseResult =
  { ok: true; lesson: Lesson } | { ok: false; issues: readonly string[] };

type Ctx = { issues: string[] };

function fail(ctx: Ctx, path: string, message: string): void {
  ctx.issues.push(`${path} ${message}`);
}

function readRecord(
  ctx: Ctx,
  path: string,
  value: unknown,
): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(ctx, path, "must be an object");
    return {};
  }
  return value as Record<string, unknown>;
}

/** Strings are required to carry text; "" and "   " are authoring mistakes. */
function readString(ctx: Ctx, path: string, value: unknown): string {
  if (typeof value !== "string") {
    fail(ctx, path, "must be a string");
    return "";
  }
  if (value.trim().length === 0) {
    fail(ctx, path, "must not be empty");
    return "";
  }
  return value;
}

function readOptionalString(
  ctx: Ctx,
  path: string,
  value: unknown,
): string | undefined {
  if (value === undefined) return undefined;
  return readString(ctx, path, value);
}

function readInteger(
  ctx: Ctx,
  path: string,
  value: unknown,
  min: number,
): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    fail(ctx, path, "must be an integer");
    return min;
  }
  if (value < min) {
    fail(ctx, path, `must be at least ${min}`);
    return min;
  }
  return value;
}

function readArray(
  ctx: Ctx,
  path: string,
  value: unknown,
  minLength: number,
): unknown[] {
  if (!Array.isArray(value)) {
    fail(ctx, path, "must be an array");
    return [];
  }
  if (value.length < minLength) {
    fail(ctx, path, `must have at least ${minLength} item(s)`);
  }
  return value;
}

function readStringArray(
  ctx: Ctx,
  path: string,
  value: unknown,
  minLength: number,
): string[] {
  return readArray(ctx, path, value, minLength).map((item, index) =>
    readString(ctx, `${path}[${index}]`, item),
  );
}

function readEnum<T extends string>(
  ctx: Ctx,
  path: string,
  value: unknown,
  allowed: readonly T[],
): T {
  const first = allowed[0] as T;
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    fail(ctx, path, `must be one of: ${allowed.join(", ")}`);
    return first;
  }
  return value as T;
}

/** Ids appear in stored progress and in the DOM, so keep them URL-safe. */
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readId(ctx: Ctx, path: string, value: unknown): string {
  const id = readString(ctx, path, value);
  if (id !== "" && !idPattern.test(id)) {
    fail(ctx, path, "must be lowercase words separated by single hyphens");
  }
  return id;
}

function requireUnique(
  ctx: Ctx,
  path: string,
  ids: readonly string[],
  label: string,
): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) fail(ctx, path, `has a duplicate ${label}: "${id}"`);
    seen.add(id);
  }
}

function parseChoice(ctx: Ctx, path: string, value: unknown): LessonChoice {
  const raw = readRecord(ctx, path, value);
  return {
    id: readId(ctx, `${path}.id`, raw.id),
    text: readString(ctx, `${path}.text`, raw.text),
    response: readString(ctx, `${path}.response`, raw.response),
    consequenceType: readEnum<ConsequenceType>(
      ctx,
      `${path}.consequenceType`,
      raw.consequenceType,
      consequenceTypes,
    ),
  };
}

function parseScene(ctx: Ctx, path: string, value: unknown): LessonScene {
  const raw = readRecord(ctx, path, value);

  const illustrationKey = readId(
    ctx,
    `${path}.illustrationKey`,
    raw.illustrationKey,
  );
  // Belt and braces against a remote image sneaking in as a "key".
  if (illustrationKey.includes("//") || /^https?:/i.test(illustrationKey)) {
    fail(ctx, `${path}.illustrationKey`, "must be a local key, not a URL");
  }

  const scene: LessonScene = {
    id: readId(ctx, `${path}.id`, raw.id),
    title: readString(ctx, `${path}.title`, raw.title),
    narration: readString(ctx, `${path}.narration`, raw.narration),
    illustrationKey,
  };

  const prompt = readOptionalString(ctx, `${path}.prompt`, raw.prompt);
  if (prompt !== undefined) scene.prompt = prompt;

  if (raw.choices !== undefined) {
    // Two is the minimum that makes a decision a decision.
    const choices = readArray(ctx, `${path}.choices`, raw.choices, 2).map(
      (choice, index) => parseChoice(ctx, `${path}.choices[${index}]`, choice),
    );
    requireUnique(
      ctx,
      `${path}.choices`,
      choices.map((choice) => choice.id),
      "choice id",
    );
    if (prompt === undefined) {
      fail(ctx, `${path}.prompt`, "is required when a scene offers choices");
    }
    scene.choices = choices;
  }

  return scene;
}

function parsePrinciple(
  ctx: Ctx,
  path: string,
  value: unknown,
): LessonPrinciple {
  const raw = readRecord(ctx, path, value);
  return {
    title: readString(ctx, `${path}.title`, raw.title),
    body: readString(ctx, `${path}.body`, raw.body),
    // At least one qualifier: etiquette is never taught as an absolute rule
    // (docs/CURRICULUM_PRINCIPLES.md, "Content philosophy").
    points: readStringArray(ctx, `${path}.points`, raw.points, 1),
  };
}

function parsePracticeOption(
  ctx: Ctx,
  path: string,
  value: unknown,
): PracticeOption {
  const raw = readRecord(ctx, path, value);
  return {
    id: readId(ctx, `${path}.id`, raw.id),
    text: readString(ctx, `${path}.text`, raw.text),
    encouragement: readString(ctx, `${path}.encouragement`, raw.encouragement),
  };
}

function parsePractice(ctx: Ctx, path: string, value: unknown): LessonPractice {
  const raw = readRecord(ctx, path, value);
  const options = readArray(ctx, `${path}.options`, raw.options, 2).map(
    (option, index) =>
      parsePracticeOption(ctx, `${path}.options[${index}]`, option),
  );
  requireUnique(
    ctx,
    `${path}.options`,
    options.map((option) => option.id),
    "option id",
  );

  const practice: LessonPractice = {
    prompt: readString(ctx, `${path}.prompt`, raw.prompt),
    options,
    closing: readString(ctx, `${path}.closing`, raw.closing),
  };

  const helperText = readOptionalString(
    ctx,
    `${path}.helperText`,
    raw.helperText,
  );
  if (helperText !== undefined) practice.helperText = helperText;

  return practice;
}

export function safeParseLesson(value: unknown): LessonParseResult {
  const ctx: Ctx = { issues: [] };
  const raw = readRecord(ctx, "lesson", value);
  const label =
    typeof raw.slug === "string" ? `lesson "${raw.slug}"` : "lesson";

  const scenes = readArray(ctx, `${label}.scenes`, raw.scenes, 1).map(
    (scene, index) => parseScene(ctx, `${label}.scenes[${index}]`, scene),
  );
  requireUnique(
    ctx,
    `${label}.scenes`,
    scenes.map((scene) => scene.id),
    "scene id",
  );
  // The lesson structure in docs/CURRICULUM_PRINCIPLES.md is situation ->
  // decision -> outcome. A lesson with no decision is not a lesson yet.
  if (!scenes.some((scene) => scene.choices !== undefined)) {
    fail(
      ctx,
      `${label}.scenes`,
      "must include at least one scene with choices",
    );
  }

  const ageMin = readInteger(ctx, `${label}.ageMin`, raw.ageMin, 0);
  const ageMax = readInteger(ctx, `${label}.ageMax`, raw.ageMax, 0);
  if (ageMax < ageMin) {
    fail(ctx, `${label}.ageMax`, "must not be lower than ageMin");
  }

  const status = readEnum<ContentStatus>(
    ctx,
    `${label}.status`,
    raw.status,
    contentStatuses,
  );
  const reviewedBy = readOptionalString(
    ctx,
    `${label}.reviewedBy`,
    raw.reviewedBy,
  );
  const reviewedAt = readOptionalString(
    ctx,
    `${label}.reviewedAt`,
    raw.reviewedAt,
  );
  // Never imply review that has not happened (CLAUDE.md, "Content status").
  if (
    status !== "draft" &&
    (reviewedBy === undefined || reviewedAt === undefined)
  ) {
    fail(
      ctx,
      `${label}.status`,
      'must stay "draft" until reviewedBy and reviewedAt are recorded',
    );
  }
  if (reviewedAt !== undefined && Number.isNaN(Date.parse(reviewedAt))) {
    fail(ctx, `${label}.reviewedAt`, "must be an ISO 8601 date");
  }

  const missionPath = `${label}.offlineMission`;
  const mission = readRecord(ctx, missionPath, raw.offlineMission);
  const coachingPath = `${label}.parentCoaching`;
  const coaching = readRecord(ctx, coachingPath, raw.parentCoaching);
  const completionPath = `${label}.completion`;
  const completion = readRecord(ctx, completionPath, raw.completion);

  const lesson: Lesson = {
    id: readId(ctx, `${label}.id`, raw.id),
    slug: readId(ctx, `${label}.slug`, raw.slug),
    moduleId: readId(ctx, `${label}.moduleId`, raw.moduleId),
    order: readInteger(ctx, `${label}.order`, raw.order, 1),
    title: readString(ctx, `${label}.title`, raw.title),
    description: readString(ctx, `${label}.description`, raw.description),
    estimatedMinutes: readInteger(
      ctx,
      `${label}.estimatedMinutes`,
      raw.estimatedMinutes,
      1,
    ),
    ageMin,
    ageMax,
    learningObjectives: readStringArray(
      ctx,
      `${label}.learningObjectives`,
      raw.learningObjectives,
      1,
    ),
    scenes,
    principle: parsePrinciple(ctx, `${label}.principle`, raw.principle),
    practice: parsePractice(ctx, `${label}.practice`, raw.practice),
    offlineMission: {
      childPrompt: readString(
        ctx,
        `${missionPath}.childPrompt`,
        mission.childPrompt,
      ),
      parentPrompt: readString(
        ctx,
        `${missionPath}.parentPrompt`,
        mission.parentPrompt,
      ),
      completionQuestion: readString(
        ctx,
        `${missionPath}.completionQuestion`,
        mission.completionQuestion,
      ),
    },
    parentCoaching: {
      title: readString(ctx, `${coachingPath}.title`, coaching.title),
      prompt: readString(ctx, `${coachingPath}.prompt`, coaching.prompt),
      tryThis: readStringArray(
        ctx,
        `${coachingPath}.tryThis`,
        coaching.tryThis,
        1,
      ),
    },
    completion: {
      title: readString(ctx, `${completionPath}.title`, completion.title),
      message: readString(ctx, `${completionPath}.message`, completion.message),
    },
    reviewQuestionIds: readArray(
      ctx,
      `${label}.reviewQuestionIds`,
      raw.reviewQuestionIds,
      0,
    ).map((id, index) =>
      readId(ctx, `${label}.reviewQuestionIds[${index}]`, id),
    ),
    status,
    // Curriculum review requires these notes to exist, so an empty array is an
    // authoring gap rather than a valid state.
    culturalNotes: readStringArray(
      ctx,
      `${label}.culturalNotes`,
      raw.culturalNotes,
      1,
    ),
    accessibilityNotes: readStringArray(
      ctx,
      `${label}.accessibilityNotes`,
      raw.accessibilityNotes,
      1,
    ),
    safetyNotes: readStringArray(
      ctx,
      `${label}.safetyNotes`,
      raw.safetyNotes,
      1,
    ),
    version: readInteger(ctx, `${label}.version`, raw.version, 1),
  };

  if (reviewedBy !== undefined) lesson.reviewedBy = reviewedBy;
  if (reviewedAt !== undefined) lesson.reviewedAt = reviewedAt;

  if (ctx.issues.length > 0) return { ok: false, issues: ctx.issues };
  return { ok: true, lesson };
}

/** Throws `LessonContentError` when the content is not usable. */
export function parseLesson(value: unknown): Lesson {
  const result = safeParseLesson(value);
  if (!result.ok) throw new LessonContentError(result.issues);
  return result.lesson;
}
