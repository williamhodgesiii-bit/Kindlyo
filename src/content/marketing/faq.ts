/**
 * Frequently asked questions for the public site.
 *
 * One array, rendered on the page and emitted as `FAQPage` structured data, so
 * the two can never drift apart.
 *
 * Answers are plain strings on purpose: structured data must carry text rather
 * than markup, and holding a single copy means the answer a search engine reads
 * is the answer a parent reads.
 *
 * The rules these answers are written to (CLAUDE.md, "Content status" and
 * "Definition of done"):
 *
 * - Nothing here claims a result the product has been shown to produce.
 * - Nothing here implies professional, educational, or clinical review, because
 *   none has happened. The review question is answered with a plain no.
 * - Nothing here invents a price, a launch date, or a number of users.
 */

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

export const faqEntries: readonly FaqEntry[] = [
  {
    id: "what-is-it",
    question: "What is Kindlyo?",
    answer:
      "A learning platform where children ages 5 to 9 practise everyday social situations — greeting someone, joining a group, listening, ending a conversation — through short illustrated stories where they choose what to do and read what tends to follow. Each lesson finishes with one small thing to try offline with a grown-up.",
  },
  {
    id: "beta-status",
    question: "Can I use it today?",
    answer:
      "Not yet. Kindlyo is in private beta and is not open to the public. You can join the founding-family waitlist to hear when places open, and you can play a sample scenario on this site right now without an account.",
  },
  {
    id: "expert-review",
    question: "Has the content been reviewed by educators or psychologists?",
    answer:
      "No. Every lesson currently on the site is draft content, written against our published curriculum principles but not yet reviewed by qualified specialists. We label it as draft wherever it appears, and we will not describe it as validated until that review has actually happened.",
  },
  {
    id: "child-account",
    question: "Does my child need their own login?",
    answer:
      "No, and they cannot have one. A parent or guardian owns the account. Child profiles live inside it and are chosen by whoever is holding the device. There are no child passwords and no child email addresses.",
  },
  {
    id: "child-data",
    question: "What do you store about my child?",
    answer:
      "A nickname, an age band, an optional drawn character, and which lessons they have worked through. There is nowhere in the product to enter a surname, a birthday, an email address, or a photograph. We do not collect precise location, contacts, voice recordings, or face data.",
  },
  {
    id: "no-social",
    question: "Can children see or message each other?",
    answer:
      "No. There is no child-to-child messaging, no public profile, no feed, and no leaderboard. Children only ever see their own lessons and their own progress.",
  },
  {
    id: "advertising",
    question: "Are there advertisements?",
    answer:
      "No. There is no advertising anywhere in Kindlyo, no third-party advertising code, and no behavioural advertising. We do not sell personal information.",
  },
  {
    id: "lesson-length",
    question: "How long does a lesson take?",
    answer:
      "Around five minutes on screen, plus an offline mission that usually takes a moment in the course of an ordinary day. Lessons are designed to be stopped partway and picked back up.",
  },
  {
    id: "no-scores",
    question: "Does it score or grade my child?",
    answer:
      "No. There are no marks, no percentages, no streaks, and no comparison between siblings. Choices are not right or wrong — the lesson shows what tends to follow from each one. The parent view describes what has been practised, never how well a child performed.",
  },
  {
    id: "quiet-children",
    question: "What if my child does not like speaking or making eye contact?",
    answer:
      "Then Kindlyo should still work for them. Waving, nodding, and signing are taught as real greetings rather than as substitutes for a better one. No lesson requires eye contact, speaking, or physical touch, and every lesson states that a child may decline to be touched.",
  },
  {
    id: "safety-first",
    question: "Does it teach children to be polite to everyone?",
    answer:
      "No, and that distinction matters to us. Politeness never outranks safety, consent, or a child's control over their own body. Lessons say directly that a child may say no, leave a situation that feels wrong, interrupt in an emergency, and find a trusted adult.",
  },
  {
    id: "pricing",
    question: "What will it cost?",
    answer:
      "We have not set pricing. The plan is a single family subscription covering the whole household, with a free trial, but the numbers are not decided and we would rather say nothing than quote a figure we might change. Founding families on the waitlist will hear before anything is charged.",
  },
];
