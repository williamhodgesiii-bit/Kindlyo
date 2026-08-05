/**
 * The shape of a lesson, described for parents.
 *
 * These are the steps `buildLessonSteps` actually produces
 * (`src/features/lessons/steps.ts`), in the order it produces them, which is
 * itself the "Core lesson structure" from docs/CURRICULUM_PRINCIPLES.md. The
 * homepage and the how-it-works page both render this list, so what a visitor
 * is promised stays tied to what the engine does.
 */

export type LoopStep = {
  id: string;
  title: string;
  body: string;
  /** What a grown-up is doing at this point, if anything. */
  parentNote?: string;
};

export const learningLoop: readonly LoopStep[] = [
  {
    id: "situation",
    title: "A situation, not a rule",
    body: "An illustrated scene from an ordinary day — a first morning at a club, a game already in progress, a conversation that needs ending. Short enough to read aloud.",
  },
  {
    id: "decision",
    title: "Your child decides",
    body: "Two or three things they could do. None is marked right, none is marked wrong, and they can pick again as many times as they like.",
  },
  {
    id: "outcome",
    title: "What tends to happen next",
    body: "The lesson describes how that choice usually lands for the other person. It is an observation about the situation, never a verdict on your child.",
  },
  {
    id: "explanation",
    title: "Why it helps somebody else",
    body: "The reason behind the behaviour, plus the qualifiers that make it real: greetings differ between families and countries, nobody owes anyone eye contact or touch, and safety always outranks politeness.",
  },
  {
    id: "practice",
    title: "A turn to rehearse",
    body: "Your child picks the version they would actually use — spoken, waved, nodded, or signed — and is encouraged for whichever one they choose.",
  },
  {
    id: "mission",
    title: "One small thing to try offline",
    body: "A mission for the real world, sized to fit an ordinary day. This is the part that makes the lesson stick.",
    parentNote:
      "You get the same mission, with a suggestion for setting it up.",
  },
  {
    id: "coaching",
    title: "A note for the grown-up",
    body: "A few concrete things to try this week, and the things worth not doing. Short on purpose.",
    parentNote: "Written for you, not for your child.",
  },
];
