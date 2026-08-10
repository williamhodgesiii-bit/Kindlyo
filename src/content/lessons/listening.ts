import type { Lesson } from "@/features/curriculum/schema";

/**
 * Module "Meeting People", lesson 6. DRAFT CONTENT — not yet reviewed by a
 * qualified human. See lesson 1 (`saying-hello.ts`) for the authoring rules
 * that apply to every lesson in this module.
 */
export const listening: Lesson = {
  id: "listening",
  slug: "listening",
  moduleId: "meeting-people",
  order: 6,
  title: "Listening while someone speaks",
  description:
    "Leo has a story about his old school. Listening is how you show someone their words landed somewhere.",
  estimatedMinutes: 5,
  ageMin: 5,
  ageMax: 9,
  learningObjectives: [
    "Show someone you are listening, in more than one way.",
    "Let a speaker finish before adding your own story.",
    "Know that listening does not require looking at someone's eyes.",
  ],
  skillArea: "listening",

  scenes: [
    {
      id: "leos-story",
      title: "Leo's story",
      narration:
        "While you paint, Leo starts telling you about his old school — there was a rabbit in his classroom, and it once escaped during assembly. He is talking faster than you have ever heard him talk. You have a rabbit story of your own, and it is excellent.",
      illustrationKey: "two-children-talking",
    },
    {
      id: "while-he-talks",
      title: "While he talks",
      narration:
        "Leo has just got to the part where the rabbit reached the stage. Your own story is pressing at your teeth, wanting out.",
      illustrationKey: "two-children-talking",
      prompt: "What could you do?",
      choices: [
        {
          id: "listen-then-ask",
          text: "Hold your story, and ask “what happened next?”",
          consequenceType: "helpful",
          response:
            "You gave him the whole stage, and “what happened next?” tells him his words are landing somewhere. For quiet Leo, being listened to all the way through might be the best thing that happens at art club today. Your rabbit story will keep — and now he will want to hear it.",
        },
        {
          id: "jump-in",
          text: "“That’s like MY rabbit story—” and tell yours now.",
          consequenceType: "mixed",
          response:
            "Sharing back is how friends connect, so the instinct is a good one — but Leo was mid-leap, and now his rabbit never reaches the stage. Trading stories works best in turns: his ending first, then yours. Same stories, different order, very different feeling for Leo.",
        },
        {
          id: "listen-while-painting",
          text: "Keep your eyes on your painting and say “mm!” and “no way!” as he talks.",
          consequenceType: "needs_context",
          response:
            "This is real listening. Ears do not live in eyes — plenty of people listen best while their hands are busy. Your “no way!” tells Leo you are with him. If he seems unsure you are listening, a quick question does what eye contact never could.",
        },
      ],
    },
  ],

  principle: {
    title: "Listening shows someone their words landed",
    body: "When a person tells you something, they are handing you a small piece of their day. Listening — really letting them finish, and showing you followed — tells them the piece was received. That is what people are checking for when they talk to you. Not your eyes: your attention.",
    points: [
      "You do not have to look at someone's eyes to listen. Nodding, small sounds, and questions all show attention — pick what works for your body.",
      "Letting someone finish is a gift you can feel yourself giving. Your own story gets better for waiting, not worse.",
      "Interrupting matters differently in different homes — in some families, lively overlapping talk IS listening. Notice what the person in front of you seems to need.",
      "You may always interrupt for safety — “stop, that’s dangerous!” does not wait for a pause.",
    ],
  },

  practice: {
    prompt: "Leo is mid-story. Pick your way of showing him you are with him.",
    helperText: "All of these are listening. None of them needs eye contact.",
    options: [
      {
        id: "question",
        text: "Ask “what happened next?”",
        encouragement:
          "A question is proof of listening — you can only ask it if you followed.",
        rehearsalCue:
          "Picture Leo mid-story and the question you would slip in — “what happened next?” Say it under your breath or just imagine it. A question like that shows him you were with him.",
      },
      {
        id: "small-sounds",
        text: "Nod, or say “no way!” at the good bits",
        encouragement: "Small signals, big message: keep going, I'm with you.",
        rehearsalCue:
          "Try a small nod now, or just imagine one — a quiet “mm” or “no way!” if you like. You never have to make a sound you do not want to.",
      },
      {
        id: "busy-hands",
        text: "Listen while your hands keep painting",
        encouragement:
          "Busy hands, open ears — a completely real way to listen. Many people's best way.",
        rehearsalCue:
          "Let your hands keep busy now if you like, or just picture it — and notice your ears can stay wide open at the very same time.",
      },
    ],
    closing:
      "Next conversation you are in, try catching the moment the speaker finishes — and feel the difference between waiting for a turn and taking one.",
  },

  offlineMission: {
    childPrompt:
      "Let one person tell you something all the way to the end this week, and ask them one question about it.",
    parentPrompt:
      "At a meal or bedtime, tell a small story of your own and let your child practise the question. Then swap.",
    completionQuestion: "Who did you listen to, and what question did you ask?",
  },

  parentCoaching: {
    title: "For the grown-up sitting alongside",
    prompt:
      "Children learn listening from being listened to. The strongest move this week is letting your child finish their own sentences — including the slow ones — and asking one real question at the end.",
    tryThis: [
      "Let one of your child's stories run to the end without tidying or hurrying it, then ask a question about it.",
      "Do not require eye contact for listening, in either direction. Watch for their signals instead — stillness, questions, echoes.",
      "If your child interrupts a lot, try a family turn-taking game rather than corrections in the moment.",
    ],
  },

  completion: {
    title: "You finished “Listening while someone speaks”",
    message:
      "You practised receiving someone's words all the way to the end. People remember who really listens to them — it is rarer than it should be.",
  },

  reviewQuestionIds: [],
  status: "draft",

  culturalNotes: [
    "Overlapping, lively talk is normal listening in many families and cultures; the lesson names this rather than treating quiet turn-taking as universal.",
    "Eye contact norms vary by culture as well as by neurotype; attention is taught as the constant, eye contact as optional.",
  ],
  accessibilityNotes: [
    "Listening while looking away or with busy hands is presented as fully valid — central for many autistic and ADHD children.",
    "Small verbal signals are offered for children who show attention non-visually.",
  ],
  safetyNotes: [
    "The lesson explicitly licenses interrupting for safety.",
    "No feedback shames the child for the interrupting instinct; it reframes it as connection with better timing.",
  ],
  version: 1,
};
