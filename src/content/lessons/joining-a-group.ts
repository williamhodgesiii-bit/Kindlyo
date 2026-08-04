import type { Lesson } from "@/features/curriculum/schema";

/**
 * Module "Meeting People", lesson 5. DRAFT CONTENT — not yet reviewed by a
 * qualified human. See lesson 1 (`saying-hello.ts`) for the authoring rules
 * that apply to every lesson in this module.
 */
export const joiningAGroup: Lesson = {
  id: "joining-a-group",
  slug: "joining-a-group",
  moduleId: "meeting-people",
  order: 5,
  title: "Joining a group",
  description:
    "Maya, Leo, and Priya are painting a big banner together. This time, you are the one on the outside wanting in.",
  estimatedMinutes: 6,
  ageMin: 5,
  ageMax: 9,
  learningObjectives: [
    "Watch a group first to see what it is doing.",
    "Ask to join in a way that is easy to say yes to.",
    "Know that a “no” or a “not yet” from a group is survivable and not shameful.",
  ],

  scenes: [
    {
      id: "the-banner",
      title: "The banner",
      narration:
        "You arrive a bit late today. Maya, Leo, and Priya are already kneeling around a huge sheet of paper, painting a rainbow banner for the club wall. They are busy and laughing. You would love to help — but there is no obvious space, and nobody has seen you yet.",
      illustrationKey: "group-of-children",
    },
    {
      id: "finding-a-way-in",
      title: "Finding a way in",
      narration:
        "You watch for a moment. Leo is doing clouds, Priya is on the letters, and Maya keeps trotting to the sink to wash brushes. The rainbow itself looks only half done.",
      illustrationKey: "group-of-children",
      prompt: "How could you try to join?",
      choices: [
        {
          id: "watch-then-ask",
          text: "“That looks great — can I do some of the rainbow?”",
          consequenceType: "helpful",
          response:
            "You watched first, so your offer fits what they are actually doing — you asked for the unfinished bit, not somebody's job. Offers like that are easy to say yes to, and groups mostly do.",
        },
        {
          id: "grab-a-brush",
          text: "Kneel down, grab a brush, and start painting.",
          consequenceType: "mixed",
          response:
            "Sometimes this works — busy groups often just absorb one more painter. But you skipped the asking, so nobody chose to have you, and if you paint over someone's plan it can feel like taking, not joining. It is a coin flip where asking was a sure thing.",
        },
        {
          id: "hover-and-hope",
          text: "Stand nearby and hope someone invites you.",
          consequenceType: "needs_context",
          response:
            "Waiting to be noticed sometimes pays off — Maya might look up any second. But busy groups are bad at noticing, so you may wait a long time. If hovering is what you can manage today, that is okay. When you are ready, words work faster than hoping.",
        },
      ],
    },
  ],

  principle: {
    title: "Groups say yes to people who make joining easy",
    body: "A group in the middle of something has its own little world: jobs, plans, jokes. Joining works best when you show you have noticed that world — watch a moment, find the gap, and ask for the gap. You are telling the group: I want to add to your thing, not take it over. That is an easy yes.",
    points: [
      "Watching first is not being slow — it is how you find the door.",
      "Sometimes a group says no, or “after this bit”. That stings, and it is allowed to sting — but it is about their game right now, not about your worth.",
      "You can also be the noticer: when you are in the group, look up sometimes. Someone may be hovering at the edge of your world.",
      "If a group only ever says no to you, or makes fun of you for asking, tell a grown-up you trust. That is not a joining problem; that is unkindness, and it is not yours to fix alone.",
    ],
  },

  practice: {
    prompt: "The banner needs its rainbow. Pick how you would ask.",
    helperText: "Every option here shows the group you noticed their world.",
    options: [
      {
        id: "ask-for-the-gap",
        text: "“Can I do some rainbow?”",
        encouragement:
          "You asked for the unfinished bit. That is the easiest yes there is.",
      },
      {
        id: "offer-help",
        text: "“Want me to wash brushes so Maya can paint?”",
        encouragement:
          "You found the group's actual problem and offered to hold it. Groups remember people like that.",
      },
      {
        id: "compliment-first",
        text: "“That looks brilliant — is there room for one more?”",
        encouragement:
          "You told them their world is good before asking to enter it. Lovely order to do it in.",
      },
    ],
    closing:
      "Next time you are already inside a group, try the other side of this: look up, and be the one who spots who is hovering.",
  },

  offlineMission: {
    childPrompt:
      "Once this week, join something already happening — a game, a build, a conversation — by watching first and asking for the gap.",
    parentPrompt:
      "Playgrounds and family gatherings are full of groups mid-game. Point one out, wonder together where the gap might be, and let your child decide whether to try.",
    completionQuestion:
      "What did you try to join, and what happened when you asked?",
  },

  parentCoaching: {
    title: "For the grown-up sitting alongside",
    prompt:
      "Joining is the socially riskiest skill in this module because it can be declined. The most protective thing you can give your child is not a technique — it is the frame that a “no” is information about the group's moment, not a verdict on them.",
    tryThis: [
      "If a joining attempt is declined, name it lightly: “their game was full just then” — and move on without a post-mortem.",
      "Praise the watching and the asking, whether or not the yes came.",
      "If your child reports being always excluded by the same children, take it seriously — that is a situation for adults, not a skill gap.",
    ],
  },

  completion: {
    title: "You finished “Joining a group”",
    message:
      "You practised finding the door into a busy little world — and learned that a no is about their moment, never your worth.",
  },

  reviewQuestionIds: [],
  status: "draft",

  culturalNotes: [
    "Norms about joining vary: in some settings children are expected to ask an adult first, in others to simply merge into the game.",
    "The 'offer to help' route reflects settings where contribution is the natural entry ticket.",
  ],
  accessibilityNotes: [
    "Hovering is acknowledged as a legitimate stage, not a failure — important for anxious or slow-to-warm children.",
    "No option requires reading facial expressions; the cues used are activity-based (an unfinished rainbow, a busy person).",
  ],
  safetyNotes: [
    "Persistent exclusion or mockery is explicitly routed to a trusted adult rather than framed as the child's problem to solve.",
    "Rejection is normalised without demanding resilience performance from the child.",
  ],
  version: 1,
};
