import { describe, expect, it } from "vitest";
import { makeTestLesson } from "./fixtures";
import type { Lesson } from "./schema";
import { LessonContentError, parseLesson, safeParseLesson } from "./validate";

/** Produces the invalid shapes without lying to TypeScript about them. */
function withField(field: string, value: unknown): unknown {
  return { ...makeTestLesson(), [field]: value };
}

describe("safeParseLesson", () => {
  it("accepts a complete lesson", () => {
    const result = safeParseLesson(makeTestLesson());

    expect(result.ok).toBe(true);
  });

  it("rejects anything that is not an object", () => {
    for (const value of [null, undefined, 42, "lesson", []]) {
      expect(safeParseLesson(value).ok).toBe(false);
    }
  });

  it("reports every problem at once, with the path to each", () => {
    const result = safeParseLesson({
      ...makeTestLesson(),
      title: "",
      estimatedMinutes: "six",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues).toHaveLength(2);
    expect(result.issues.join("\n")).toContain(".title");
    expect(result.issues.join("\n")).toContain(".estimatedMinutes");
  });

  it("rejects a string that is only whitespace", () => {
    expect(safeParseLesson(withField("description", "   ")).ok).toBe(false);
  });

  it("rejects an unknown consequence type", () => {
    const lesson = makeTestLesson();
    const [, decision] = lesson.scenes;
    const scenes = [
      lesson.scenes[0],
      {
        ...decision,
        choices: [
          { ...decision?.choices?.[0], consequenceType: "correct" },
          decision?.choices?.[1],
        ],
      },
    ];

    const result = safeParseLesson({ ...lesson, scenes });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain("consequenceType");
  });

  it("rejects a decision with only one option", () => {
    const lesson = makeTestLesson();
    const decision = lesson.scenes[1];
    const result = safeParseLesson({
      ...lesson,
      scenes: [
        lesson.scenes[0],
        { ...decision, choices: [decision?.choices?.[0]] },
      ],
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain("at least 2 item(s)");
  });

  it("requires a prompt on a scene that offers choices", () => {
    const lesson = makeTestLesson();
    const decision = { ...lesson.scenes[1] };
    delete decision.prompt;

    const result = safeParseLesson({
      ...lesson,
      scenes: [lesson.scenes[0], decision],
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain(
      "is required when a scene offers choices",
    );
  });

  it("requires at least one scene with a decision in it", () => {
    const lesson = makeTestLesson();
    const decision = { ...lesson.scenes[1] };
    delete decision.choices;
    delete decision.prompt;

    const result = safeParseLesson({
      ...lesson,
      scenes: [lesson.scenes[0], decision],
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain(
      "at least one scene with choices",
    );
  });

  it("rejects duplicate scene ids", () => {
    const lesson = makeTestLesson();
    const result = safeParseLesson({
      ...lesson,
      scenes: [lesson.scenes[1], lesson.scenes[1]],
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain("duplicate scene id");
  });

  it("rejects duplicate choice ids inside a scene", () => {
    const lesson = makeTestLesson();
    const decision = lesson.scenes[1];
    const first = decision?.choices?.[0];
    const result = safeParseLesson({
      ...lesson,
      scenes: [lesson.scenes[0], { ...decision, choices: [first, first] }],
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain("duplicate choice id");
  });

  it("requires a principle to carry at least one context point", () => {
    const lesson = makeTestLesson();
    const result = safeParseLesson({
      ...lesson,
      principle: { ...lesson.principle, points: [] },
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain("principle.points");
  });

  it("requires cultural, accessibility, and safety notes", () => {
    for (const field of [
      "culturalNotes",
      "accessibilityNotes",
      "safetyNotes",
    ]) {
      const result = safeParseLesson(withField(field, []));

      expect(result.ok, field).toBe(false);
      if (result.ok) continue;
      expect(result.issues.join("\n")).toContain(field);
    }
  });

  it("refuses to call content reviewed without a named reviewer and date", () => {
    const result = safeParseLesson(withField("status", "published"));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain(
      'must stay "draft" until reviewedBy and reviewedAt are recorded',
    );
  });

  it("accepts published content that records who reviewed it and when", () => {
    const result = safeParseLesson({
      ...makeTestLesson(),
      status: "published",
      reviewedBy: "A. Reviewer",
      reviewedAt: "2026-08-04T09:00:00.000Z",
    });

    expect(result.ok).toBe(true);
  });

  it("rejects a review date that is not a date", () => {
    const result = safeParseLesson({
      ...makeTestLesson(),
      status: "reviewed",
      reviewedBy: "A. Reviewer",
      reviewedAt: "last Tuesday",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain("ISO 8601");
  });

  it("rejects an illustration key that is a remote URL", () => {
    const lesson = makeTestLesson();
    const result = safeParseLesson({
      ...lesson,
      scenes: [
        {
          ...lesson.scenes[0],
          illustrationKey: "https://example.com/scene.png",
        },
        lesson.scenes[1],
      ],
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain("illustrationKey");
  });

  it("rejects an ageMax below ageMin", () => {
    const result = safeParseLesson({
      ...makeTestLesson(),
      ageMin: 9,
      ageMax: 5,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.join("\n")).toContain("ageMax");
  });

  it("keeps optional fields absent rather than undefined", () => {
    const result = safeParseLesson(makeTestLesson());

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect("reviewedBy" in result.lesson).toBe(false);
  });
});

describe("parseLesson", () => {
  it("returns the lesson when it is valid", () => {
    const lesson: Lesson = parseLesson(makeTestLesson());

    expect(lesson.slug).toBe("test-lesson");
  });

  it("throws a LessonContentError listing the issues", () => {
    expect(() => parseLesson(withField("title", ""))).toThrow(
      LessonContentError,
    );

    try {
      parseLesson(withField("title", ""));
    } catch (error) {
      expect(error).toBeInstanceOf(LessonContentError);
      expect((error as LessonContentError).issues).toHaveLength(1);
    }
  });
});
