import { describe, expect, it } from "vitest";
import {
  FALLBACK_ARCHETYPE,
  illustrationKeyArchetypes,
  resolveSceneArchetype,
  sceneArchetypes,
} from "./sceneArchetypes";
import { lessons } from "@/content/lessons";

/**
 * The archetype layer decides what *place* a lesson beat looks like. These
 * specs keep it honest in the three ways that matter: every authored key has a
 * deliberate home (so a new world can't silently fall back to the garden), the
 * resolver never throws, and it reads nothing but the key — never a choice.
 */
describe("scene archetypes", () => {
  const authoredKeys = Array.from(
    new Set(
      lessons.flatMap((lesson) =>
        lesson.scenes.map((scene) => scene.illustrationKey),
      ),
    ),
  ).sort();

  it("has at least one authored key to check", () => {
    expect(authoredKeys.length).toBeGreaterThan(0);
  });

  it("maps every authored illustrationKey explicitly — no silent fallback", () => {
    const unmapped = authoredKeys.filter(
      (key) => !(key in illustrationKeyArchetypes),
    );
    // A newly authored key with no archetype fails here rather than collapsing
    // onto the neutral gathering scene in production.
    expect(unmapped).toEqual([]);
  });

  it("only ever maps keys to members of the closed archetype set", () => {
    for (const archetype of Object.values(illustrationKeyArchetypes)) {
      expect(sceneArchetypes).toContain(archetype);
    }
  });

  it("falls back to the neutral gathering place for unknown or missing keys", () => {
    expect(resolveSceneArchetype(undefined)).toBe(FALLBACK_ARCHETYPE);
    expect(resolveSceneArchetype("")).toBe(FALLBACK_ARCHETYPE);
    expect(resolveSceneArchetype("no-such-key")).toBe(FALLBACK_ARCHETYPE);
    expect(FALLBACK_ARCHETYPE).toBe("gathering");
  });

  it("is a pure function of the key — same key, same archetype", () => {
    for (const key of authoredKeys) {
      expect(resolveSceneArchetype(key)).toBe(resolveSceneArchetype(key));
    }
  });
});
