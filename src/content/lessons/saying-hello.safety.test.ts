import { describe, expect, it } from "vitest";
import { sayingHello } from "./saying-hello";

/**
 * Safety-spine guard for "Saying hello".
 *
 * The lesson's copy is deliberately short, and shortening curriculum copy is
 * exactly where a consent or safety line can quietly go missing. These are not
 * style assertions: each pins a boundary that docs/PRIVACY_AND_SAFETY.md and
 * docs/CURRICULUM_PRINCIPLES.md require this lesson to keep teaching, however the
 * wording is later revised. They match on the *concept*, not an exact phrase, so
 * an editor may reword freely — but cannot delete the idea.
 *
 * If one of these fails, the fix is to restore the missing boundary in the
 * content, never to weaken the test.
 */

const principlePoints = sayingHello.principle.points.join("\n").toLowerCase();
const parentTryThis = sayingHello.parentCoaching.tryThis
  .join("\n")
  .toLowerCase();

describe("saying-hello safety spine", () => {
  it("keeps non-speaking greetings equal (wave, nod, sign)", () => {
    expect(principlePoints).toMatch(/wave/);
    expect(principlePoints).toMatch(/nod/);
    expect(principlePoints).toMatch(/sign/);
  });

  it("keeps eye contact optional", () => {
    expect(principlePoints).toMatch(/eye/);
  });

  it("keeps bodily autonomy: a hello never requires touch, and can be declined", () => {
    expect(principlePoints).toMatch(/touch/);
    // A boundary is only real if the child can say no to it.
    expect(principlePoints).toMatch(/\bno\b/);
  });

  it("keeps safety above politeness: unsafe means walk away to a trusted grown-up", () => {
    expect(principlePoints).toMatch(/unsafe/);
    expect(principlePoints).toMatch(/walk away/);
    expect(principlePoints).toMatch(/grown-?up|adult|trust/);
  });

  it("keeps greetings culturally varied and all valid", () => {
    expect(principlePoints).toMatch(/famil|countr|different ways/);
  });

  it("keeps the parent-facing consent guidance (a child may decline being touched)", () => {
    expect(parentTryThis).toMatch(/touch/);
    expect(parentTryThis).toMatch(/\bno\b|decline/);
  });
});
