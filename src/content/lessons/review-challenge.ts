import type { Lesson } from "@/features/curriculum/schema";

/**
 * Module "Meeting People", lesson 8 — the review lesson and real-world
 * challenge from the MVP scope. DRAFT CONTENT — not yet reviewed by a
 * qualified human.
 *
 * This is the module's "one simple review activity": two decision scenes that
 * revisit the earlier principles inside one new story, using the standard
 * schema rather than new quiz machinery. Its offline mission is the module's
 * real-world challenge. Spaced review via `reviewQuestionIds` is a later
 * slice.
 */
export const reviewChallenge: Lesson = {
  id: "review-challenge",
  slug: "review-challenge",
  moduleId: "meeting-people",
  order: 8,
  title: "Review and real-world challenge",
  description:
    "Maya's cousin Amara visits art club, and everything you have practised happens at once.",
  estimatedMinutes: 6,
  ageMin: 5,
  ageMax: 9,
  learningObjectives: [
    "Put the module's skills together in one situation: greet, introduce, make room, listen.",
    "Choose a first move with a brand-new person without being told which one.",
    "Carry one full meeting — hello to goodbye — into the real world.",
  ],
  skillArea: "review",

  scenes: [
    {
      id: "amara-visits",
      title: "A visitor",
      narration:
        "It is the last art club before the holidays, and Maya has brought her cousin Amara, visiting from another town. Amara knows exactly one person in this room. You know what that feels like now — a few weeks ago, it was you.",
      illustrationKey: "art-table-morning",
    },
    {
      id: "the-first-moment-again",
      title: "The first moment, again",
      narration:
        "Maya gets pulled away to help hang the finished banner. Amara is left standing by the table, holding her coat, looking at the door Maya disappeared through.",
      illustrationKey: "two-children-meeting",
      prompt: "You know this moment. What could you do first?",
      choices: [
        {
          id: "greet-introduce-room",
          text: "“Hi, I’m Sam — Maya sits here, and you can have this spot.”",
          consequenceType: "helpful",
          response:
            "That was three lessons in one breath: a hello, your name, and room made for her. Amara's question — is there space here for me? — just got answered before she had to ask it.",
        },
        {
          id: "wave-from-seat",
          text: "Wave at her from your seat.",
          consequenceType: "needs_context",
          response:
            "A wave is a real hello — that was true in lesson one and it is true now. Whether it is enough depends on Amara: if she smiles and comes over, it worked. If she stays put by the door, she may need the second half — a name, or a place to sit.",
        },
        {
          id: "wait-for-maya",
          text: "Wait for Maya to come back and introduce her.",
          consequenceType: "mixed",
          response:
            "Maya will come back — but banners take a while, and Amara is spending that whole time as a stranger in a room of talking children. Waiting is not wrong. It just leaves her alone in the meantime, when you already know every move that would change that.",
        },
      ],
    },
    {
      id: "amaras-story",
      title: "Amara's story",
      narration:
        "Amara sits down next to you and, once she gets going, tells you her town has a museum with a real dinosaur skeleton. You have been to a dinosaur museum too. Your story is ready to burst out, and Amara has just reached the part about the teeth.",
      illustrationKey: "two-children-talking",
      prompt: "You know this one too. What could you do?",
      choices: [
        {
          id: "finish-then-share",
          text: "Let her get to the end, ask about the teeth, then tell yours.",
          consequenceType: "helpful",
          response:
            "Her ending, your question, then your story — the whole listening lesson, in the right order. Now it is not two children talking at each other; it is a conversation about dinosaurs, which is the best kind.",
        },
        {
          id: "trade-immediately",
          text: "“I’ve seen a dinosaur too!” — and launch into yours.",
          consequenceType: "mixed",
          response:
            "You are connecting, which is the point of stories — but her dinosaur lost its teeth mid-sentence. Same two stories, told in turns, would have given you both a whole ending each.",
        },
        {
          id: "listen-hands-busy",
          text: "Keep drawing while she talks, saying “whoa” at the good bits.",
          consequenceType: "needs_context",
          response:
            "Busy hands, open ears — still real listening. If Amara knows you are with her, this is perfect. If she trails off unsure, one question — “how big were the teeth?” — shows her exactly where your attention was.",
        },
      ],
    },
  ],

  principle: {
    title: "All of it was one skill in the end",
    body: "Hello, your name, their name, making room, joining, listening, goodbye — seven lessons, but really one idea wearing different coats: let people know they have been noticed, and that there is space for them. Every move you practised is a way of saying that. You will never need a script, because you know the thing the scripts were for.",
    points: [
      "Different moments need different moves — a wave here, a name there. You now have a whole pocketful to choose from.",
      "None of it requires eye contact, touch, or big words. Your versions of these moves count.",
      "Safety still outranks all of it: anyone or anywhere that feels wrong, you leave, no goodbye needed, and tell a grown-up you trust.",
      "Other children are practising too, badly and bravely, same as everyone. Kindness includes letting them wobble.",
    ],
  },

  practice: {
    prompt:
      "Art club ends and Amara says “bye, Sam.” One last move — pick your goodbye.",
    helperText: "You know all of these. There is no wrong door out.",
    options: [
      {
        id: "goodbye-next-time",
        text: "“Bye Amara — come back after the holidays!”",
        encouragement:
          "Name, goodbye, and a door held open to next time. The full set, worn lightly.",
        rehearsalCue:
          "Try the full goodbye now if you like — a name, a “bye,” and a “come back!” — out loud or just in your head. You have all the pieces now.",
      },
      {
        id: "goodbye-wave",
        text: "A big wave and “bye!”",
        encouragement:
          "Where this module started — and it is still a complete, warm goodbye.",
        rehearsalCue:
          "Give a big wave now, or just picture it, with a “bye!” if you want one. It is the very first thing you learned here, and still whole all on its own.",
      },
      {
        id: "goodbye-callback",
        text: "“Bye! Tell me if the museum gets more dinosaurs.”",
        encouragement:
          "A goodbye made out of listening — you kept a piece of her story and handed it back. That is how people know they were really heard.",
        rehearsalCue:
          "Run it through now, out loud or just in your head — a goodbye that hands back a piece of their story. It is the whole module in one warm line.",
      },
    ],
    closing:
      "That is the module. The last part does not happen on a screen — it happens the next time a real person looks up as you come in.",
  },

  offlineMission: {
    childPrompt:
      "The real-world challenge: at your next club, party, or family visit, do one whole meeting — hello, your name, listen to something, and a goodbye that points to next time.",
    parentPrompt:
      "Find one occasion for the full chain and name it as the challenge beforehand. Afterwards, ask which part felt easiest and which felt biggest — both answers are wins.",
    completionQuestion:
      "Where did you try your whole meeting, and which part are you proudest of?",
  },

  parentCoaching: {
    title: "For the grown-up sitting alongside",
    prompt:
      "This is the consolidation week. The goal is not a perfect performance of all the skills — it is your child noticing that they now have moves where they used to have fog. Point at what worked, lightly, and let the rest keep growing.",
    tryThis: [
      "After any social moment this week, name one specific move you saw: “you made room for him.”",
      "Retell one of their wins at dinner, briefly, so it becomes part of the family story.",
      "Skip scoring the challenge. One real hello in the world outranks a flawless rehearsal at home.",
    ],
  },

  completion: {
    title: "You finished “Meeting People”",
    message:
      "Eight lessons, one idea: people want to know they have been noticed and that there is room for them — and you now know how to tell them, in your own way. Take it somewhere real.",
  },

  reviewQuestionIds: [],
  status: "draft",

  culturalNotes: [
    "The review deliberately re-offers multiple valid forms (spoken, waved, minimal) rather than converging on one 'best' performance.",
    "Family visits and clubs are used as broadly shared settings for the real-world challenge.",
  ],
  accessibilityNotes: [
    "Every recapped skill keeps its non-speaking variant; the challenge can be completed without eye contact or speech.",
    "The final coaching explicitly declines scoring, to protect children for whom parts of the chain are effortful.",
  ],
  safetyNotes: [
    "The safety-over-politeness rule is restated in the review principle so it is the last thing the module says about rules.",
    "The challenge is framed within known, supervised settings.",
  ],
  version: 1,
};
