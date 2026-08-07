import { describe, expect, it } from "vitest";
import { createGatePuzzle, isAnswerCorrect, numberToWord } from "./puzzle";

/** A stubbed `Math.random` that yields each value in turn, then repeats the last. */
function sequence(values: number[]): () => number {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)] ?? 0;
}

describe("numberToWord", () => {
  it("spells out the numbers the gate can produce", () => {
    expect(numberToWord(2)).toBe("two");
    expect(numberToWord(7)).toBe("seven");
    expect(numberToWord(12)).toBe("twelve");
    expect(numberToWord(18)).toBe("eighteen");
  });

  it("refuses a value it has no word for", () => {
    expect(() => numberToWord(21)).toThrow(RangeError);
  });
});

describe("createGatePuzzle", () => {
  it("builds a spelled-out sum whose answer is the total", () => {
    // rng 0 -> the low end of each 2..9 range: two plus two.
    const puzzle = createGatePuzzle(sequence([0, 0]));
    expect(puzzle).toEqual({
      a: 2,
      b: 2,
      answer: 4,
      question: "What is two plus two?",
    });
  });

  it("uses words, never digits, in the question", () => {
    // rng ~1 -> the high end: nine plus nine.
    const puzzle = createGatePuzzle(sequence([0.999, 0.999]));
    expect(puzzle.a).toBe(9);
    expect(puzzle.b).toBe(9);
    expect(puzzle.answer).toBe(18);
    expect(puzzle.question).toBe("What is nine plus nine?");
    expect(puzzle.question).not.toMatch(/\d/);
  });

  it("keeps addends in the single-digit range on real randomness", () => {
    for (let i = 0; i < 100; i++) {
      const { a, b, answer } = createGatePuzzle();
      expect(a).toBeGreaterThanOrEqual(2);
      expect(a).toBeLessThanOrEqual(9);
      expect(b).toBeGreaterThanOrEqual(2);
      expect(b).toBeLessThanOrEqual(9);
      expect(answer).toBe(a + b);
    }
  });
});

describe("isAnswerCorrect", () => {
  it("accepts the exact number", () => {
    expect(isAnswerCorrect("12", 12)).toBe(true);
  });

  it("ignores surrounding whitespace", () => {
    expect(isAnswerCorrect("  12 ", 12)).toBe(true);
  });

  it("rejects the wrong number", () => {
    expect(isAnswerCorrect("11", 12)).toBe(false);
  });

  it("rejects a blank or non-numeric entry", () => {
    expect(isAnswerCorrect("", 12)).toBe(false);
    expect(isAnswerCorrect("   ", 12)).toBe(false);
    expect(isAnswerCorrect("twelve", 12)).toBe(false);
    expect(isAnswerCorrect("1a", 12)).toBe(false);
  });
});
