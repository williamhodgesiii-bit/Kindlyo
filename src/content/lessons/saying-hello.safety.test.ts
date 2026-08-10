import { describe, expect, it } from "vitest";
import { sayingHello } from "./saying-hello";

/**
 * Safety-spine guard for "Saying hello".
 *
 * The lesson's copy is deliberately short, and shortening curriculum copy is
 * exactly where a consent or safety line can quietly go missing — or, worse, be
 * inverted while keeping its keywords. These assertions pin the *direction* of
 * each boundary, not a token: a bare `/eye/` or `/touch/` would pass an inverted
 * rule ("always look them in the eye"), so each concept also asserts that a
 * negation survives and that no inversion word ("always", "must", "only",
 * "best") appears in the point that carries it.
 *
 * These pin boundaries that docs/PRIVACY_AND_SAFETY.md and
 * docs/CURRICULUM_PRINCIPLES.md require this lesson to keep teaching. If one
 * fails, restore the missing boundary in the content — never weaken the test.
 * This is not human review, and it does not license any content-status change.
 */

const points = sayingHello.principle.points.map((p) => p.toLowerCase());
const principleText = points.join("\n");
const parentText = sayingHello.parentCoaching.tryThis.join("\n").toLowerCase();

/** The single principle point carrying a concept, so direction is checkable. */
function pointWith(re: RegExp): string {
  return points.find((p) => re.test(p)) ?? "";
}

describe("saying-hello safety spine", () => {
  it("keeps non-speaking greetings equal, not fallbacks", () => {
    const p = pointWith(/wave|nod|sign/);
    expect(p).toMatch(/wave/);
    expect(p).toMatch(/nod/);
    expect(p).toMatch(/sign/);
    // Never demoted to "only when you can't speak" / "words are best".
    expect(p).not.toMatch(/only|instead|can'?t|cannot|fallback|best|better/);
  });

  it("keeps eye contact optional, never required", () => {
    const p = pointWith(/eye/);
    expect(p).not.toBe("");
    expect(p).toMatch(/never|without|not\b|no\b|don'?t/);
    expect(p).not.toMatch(/always|must\b/);
  });

  it("keeps bodily autonomy: a hello never requires being touched", () => {
    const p = pointWith(/touch/);
    expect(p).not.toBe("");
    expect(p).toMatch(/never|not\b|no\b|don'?t/);
    // The required negation above pins direction; this catches an inverted rule
    // ("you must be touched", "let them touch you") that carries no negation.
    expect(p).not.toMatch(/must\b|let .*touch|always .*touch/);
  });

  it("keeps the child's refusal unconditional (can always say no)", () => {
    expect(principleText).toMatch(/always say no/);
  });

  it("keeps safety above politeness: unsafe means walk away to a trusted grown-up", () => {
    const p = pointWith(/unsafe|walk away/);
    expect(p).toMatch(/unsafe/);
    expect(p).toMatch(/walk away/);
    expect(p).toMatch(/grown-?up|adult|trust/);
    // Never "greet them anyway" / "still be polite".
    expect(p).not.toMatch(/still|anyway|be polite/);
  });

  it("keeps greetings culturally varied and all valid", () => {
    const p = pointWith(/famil|countr|different ways/);
    expect(p).not.toBe("");
    // The "all count" half of the idea must survive, not just "they differ".
    expect(p).toMatch(/all (of them )?count|all .*valid|all of them/);
    expect(p).not.toMatch(/ours|best|right way|polite way|proper/);
  });

  it("keeps the parent-facing consent guidance (a child may always decline touch)", () => {
    expect(parentText).toMatch(/touch/);
    expect(parentText).toMatch(
      /always say no|may always|never make a greeting the price/,
    );
  });
});
