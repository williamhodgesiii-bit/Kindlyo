import { describe, expect, it } from "vitest";
import {
  characterStateNames,
  characterStates,
  expressionNames,
  expressions,
} from "./states";

/**
 * The animation-state contract is a promise to the rest of the system, so these
 * specs guard its shape and — most importantly — its vocabulary.
 */
describe("the character-state contract", () => {
  it("names every state in the library, each one unique", () => {
    // The bible's prose says "31 states", but its state sheet and the prototype
    // both enumerate 32; the contract is "implement exactly these names", so we
    // follow the enumeration rather than the miscounted header.
    expect(characterStateNames).toHaveLength(32);
    expect(new Set(characterStateNames).size).toBe(32);
  });

  it("never names a state as a verdict on the child", () => {
    // docs/design/CHARACTER_BIBLE.md: no state is ever named correct, wrong,
    // failure, bad, or rude — a character never expresses a judgement.
    for (const name of characterStateNames) {
      expect(name).not.toMatch(/correct|wrong|fail|bad|rude/i);
    }
  });

  it("gives every state a full pose", () => {
    for (const name of characterStateNames) {
      const def = characterStates[name];
      expect(def.pose.eyes).toBeTruthy();
      expect(def.pose.mouth).toBeTruthy();
      expect(typeof def.pose.tilt).toBe("number");
      expect(typeof def.pose.rotL).toBe("number");
      expect(typeof def.pose.rotR).toBe("number");
      expect(def.token).toBeTruthy();
      expect(def.reducedMotion).toBeTruthy();
    }
  });

  it("offers the six head-only expressions", () => {
    expect(expressionNames).toHaveLength(6);
    for (const name of expressionNames) {
      expect(expressions[name].eyes).toBeTruthy();
      expect(expressions[name].mouth).toBeTruthy();
    }
  });
});
