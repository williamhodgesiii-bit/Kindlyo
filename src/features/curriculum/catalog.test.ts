import { describe, expect, it } from "vitest";
import { meetingPeopleModule } from "@/content/modules";
import {
  getLessonBySlug,
  isLessonVisible,
  listLessons,
  listModules,
} from "./catalog";
import { makeTestLesson } from "./fixtures";

/**
 * These tests double as the content check: importing the catalog imports the
 * registry, which validates every authored lesson. A malformed lesson fails
 * here before it fails a build.
 */

describe("the authored curriculum", () => {
  it("validates every authored lesson on import", () => {
    expect(listLessons().length).toBeGreaterThan(0);
  });

  it("has content for lesson one of the MVP module", () => {
    const lesson = getLessonBySlug("saying-hello");

    expect(lesson?.title).toBe("Saying hello");
    expect(lesson?.moduleId).toBe(meetingPeopleModule.id);
    expect(lesson?.order).toBe(1);
  });

  it("offers three choices at the decision point", () => {
    const lesson = getLessonBySlug("saying-hello");
    const decision = lesson?.scenes.find(
      (scene) => scene.choices !== undefined,
    );

    expect(decision?.choices).toHaveLength(3);
  });

  it("never presents one choice as the right answer", () => {
    const lesson = getLessonBySlug("saying-hello");

    for (const scene of lesson?.scenes ?? []) {
      for (const choice of scene.choices ?? []) {
        expect(["helpful", "mixed", "needs_context"]).toContain(
          choice.consequenceType,
        );
      }
    }
  });

  it("stays draft until a qualified human has reviewed it", () => {
    for (const lesson of listLessons()) {
      expect(lesson.status).toBe("draft");
      expect(lesson.reviewedBy).toBeUndefined();
    }
  });

  it("keeps every module lesson entry either written or clearly unwritten", () => {
    for (const curriculumModule of listModules()) {
      for (const entry of curriculumModule.lessons) {
        if (entry.slug === undefined) continue;
        expect(getLessonBySlug(entry.slug), entry.slug).toBeDefined();
      }
    }
  });

  it("lists the eight lesson titles from the MVP scope", () => {
    expect(meetingPeopleModule.lessons).toHaveLength(8);
    expect(meetingPeopleModule.lessons.map((entry) => entry.order)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
  });
});

describe("draft visibility", () => {
  it("hides draft lessons from a viewer who may not see drafts", () => {
    const draft = makeTestLesson({ status: "draft" });

    expect(isLessonVisible(draft, false)).toBe(false);
    expect(isLessonVisible(draft, true)).toBe(true);
  });

  it("always shows published lessons", () => {
    const published = makeTestLesson({
      status: "published",
      reviewedBy: "A. Reviewer",
      reviewedAt: "2026-08-04T09:00:00.000Z",
    });

    expect(isLessonVisible(published, false)).toBe(true);
  });

  it("returns nothing for a lesson the viewer may not see", () => {
    expect(getLessonBySlug("saying-hello", false)).toBeUndefined();
  });

  it("returns nothing for an unknown slug", () => {
    expect(getLessonBySlug("not-a-lesson")).toBeUndefined();
  });
});
