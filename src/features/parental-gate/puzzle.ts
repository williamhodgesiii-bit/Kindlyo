/**
 * The "Ask a grown-up" parental-gate puzzle.
 *
 * The gate's job is to sit in front of any exit to the open web or a purchase so
 * a young child cannot tap through it by accident (docs/design/ACCESSIBILITY.md,
 * "Parental gate"). The mechanism is deliberately not a bright button: it asks
 * for a *written* numeric answer to a small sum whose numbers are spelled out in
 * words — reading the question is itself the barrier for a pre-reader.
 *
 * The numbers are chosen fresh each time the gate opens, so the answer cannot be
 * memorised by a child who has watched a grown-up solve it once. The logic is
 * pure and takes its randomness as an argument, so both the component and its
 * tests stay deterministic.
 */

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
] as const;

/** The spelled-out English word for a whole number in `0..20`. */
export function numberToWord(value: number): string {
  const word = NUMBER_WORDS[value];
  if (word === undefined) {
    throw new RangeError(`No spelled-out word for ${value}`);
  }
  return word;
}

export type GatePuzzle = {
  /** The first addend. */
  a: number;
  /** The second addend. */
  b: number;
  /** The number a grown-up must type to pass. */
  answer: number;
  /** The full question, e.g. "What is seven plus five?". */
  question: string;
};

/** Inclusive integer in `[min, max]` from a `Math.random`-shaped source. */
function pick(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/**
 * Build a fresh gate puzzle. Addends are kept to single digits from two upward,
 * so the words stay short and unambiguous and the sum never exceeds eighteen —
 * trivial for an adult, a real barrier for a child who cannot yet read.
 *
 * Randomness is injected (default `Math.random`) so the component regenerates on
 * every open while tests can pin an exact puzzle.
 */
export function createGatePuzzle(rng: () => number = Math.random): GatePuzzle {
  const a = pick(rng, 2, 9);
  const b = pick(rng, 2, 9);
  return {
    a,
    b,
    answer: a + b,
    question: `What is ${numberToWord(a)} plus ${numberToWord(b)}?`,
  };
}

/**
 * Whether a typed answer passes the gate. Surrounding whitespace is ignored and
 * the entry must be whole digits — anything else (blank, letters, a partial
 * number) simply is not yet correct, never an error the child sees.
 */
export function isAnswerCorrect(input: string, answer: number): boolean {
  const trimmed = input.replace(/\s/g, "");
  if (!/^\d+$/.test(trimmed)) return false;
  return Number(trimmed) === answer;
}
