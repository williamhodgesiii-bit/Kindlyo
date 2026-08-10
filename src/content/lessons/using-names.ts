import type { Lesson } from "@/features/curriculum/schema";

/**
 * Module "Meeting People", lesson 3. DRAFT CONTENT — not yet reviewed by a
 * qualified human. See lesson 1 (`saying-hello.ts`) for the authoring rules
 * that apply to every lesson in this module.
 */
export const usingNames: Lesson = {
  id: "using-names",
  slug: "using-names",
  moduleId: "meeting-people",
  order: 3,
  title: "Remembering and using names",
  description:
    "A new boy called Leo joined art club last week. Using someone's name tells them they were worth remembering.",
  estimatedMinutes: 5,
  ageMin: 5,
  ageMax: 9,
  learningObjectives: [
    "Explain why hearing your own name feels good.",
    "Use a person's name in a greeting.",
    "Know that forgetting a name is normal, and asking again is fine.",
  ],
  skillArea: "introducing",

  scenes: [
    {
      id: "leo-joined",
      title: "The new boy",
      narration:
        "Last week a new boy joined art club. He told everyone his name was Leo, and he seemed a bit quiet. Today he is hanging up his coat as you come in.",
      illustrationKey: "art-table-morning",
    },
    {
      id: "greeting-leo",
      title: "Greeting Leo",
      narration:
        "Leo looks over. You remember him from last week — the boy who drew the rocket.",
      illustrationKey: "two-children-meeting",
      prompt: "How could you greet him?",
      choices: [
        {
          id: "hello-with-name",
          text: "“Hi Leo!”",
          consequenceType: "helpful",
          response:
            "One word plus a name, and look what it carries: you remembered him. For someone new and a bit quiet, hearing his own name says “you are already part of this place”.",
        },
        {
          id: "hello-without-name",
          text: "“Hi!” — without his name",
          consequenceType: "mixed",
          response:
            "Still a real greeting, and Leo will take it kindly. A name would just carry a little more: “hi” says I see you, “hi Leo” says I remember you.",
        },
        {
          id: "forgot-the-name",
          text: "“Hi — sorry, I forgot your name?”",
          consequenceType: "needs_context",
          response:
            "Completely fine, and honestly quite brave. Everyone forgets names. Asking again shows you want to get it right, which matters more than getting it first time. Most people would much rather be asked than be nobody.",
        },
      ],
    },
  ],

  principle: {
    title: "A name says “you were worth remembering”",
    body: "People carry their names everywhere. When you use someone's name, you are telling them that they stayed in your head after they left the room — that they made an impression. That is why it warms people up, and why it helps most with someone new, who is still wondering whether anyone here knows they exist.",
    points: [
      "Forgetting a name is normal. Asking again is respectful, not rude.",
      "Say a name the way its owner says it. If you are not sure, ask them — they are the expert.",
      "Some people have names from languages you have not heard before. Practising them is a kindness, not a chore.",
      "You never owe your own name to someone who makes you feel unsafe.",
      "In some families and places, children use titles like “Auntie” or “Mr” — that is another way of using a name with care.",
    ],
  },

  practice: {
    prompt: "Leo is hanging up his coat. Try greeting him.",
    helperText: "There is no wrong pick — even the forgetting one.",
    options: [
      {
        id: "name-hello",
        text: "“Hi Leo!”",
        encouragement:
          "He heard his own name in a new place. That lands warmer than you might guess.",
        rehearsalCue:
          "Try it now, out loud or just in your head — a hello with the name tucked in, “Hi Leo!” Hearing their own name is the warm part, and one practice helps it land.",
      },
      {
        id: "ask-again",
        text: "“Hi — can you tell me your name again?”",
        encouragement:
          "Asking again is caring about getting it right. That is the part people remember.",
        rehearsalCue:
          "Say it now, quietly or just imagined — “can you tell me your name again?” Asking again is caring about getting it right, and it is easier the next time for having tried it once.",
      },
      {
        id: "wave-and-name",
        text: "Wave and say “Leo!”",
        encouragement:
          "A wave plus a name — no full sentence needed. He knows he was remembered.",
        rehearsalCue:
          "Give a little wave now, or picture it, and add the name if you like — “Leo!” A wave plus a name is a whole greeting; no full sentence needed.",
      },
    ],
    closing:
      "Try saying the name of someone you know out loud right now, in a hello. Feel how it turns a greeting into their greeting.",
  },

  offlineMission: {
    childPrompt:
      "Greet one person by name this week — “Hi …!” — someone at school, a neighbour, or someone who helps you often.",
    parentPrompt:
      "Before a familiar situation, quietly remind your child of one person's name, then let the greeting happen or not happen on its own.",
    completionQuestion: "Whose name did you use, and how did they react?",
  },

  parentCoaching: {
    title: "For the grown-up sitting alongside",
    prompt:
      "Use names warmly in front of your child — including your child's own name in greetings — and let them hear you ask for a name again when you forget one. Being caught forgetting, and asking cheerfully, is the most useful demonstration there is.",
    tryThis: [
      "Greet people by name where your child can hear it.",
      "When you forget a name, ask again out loud and without embarrassment.",
      "If your child's own name is often mispronounced, rehearse together how they can help people say it right — if they want to.",
    ],
  },

  completion: {
    title: "You finished “Remembering and using names”",
    message:
      "You practised the smallest big thing: using a name. Every time you do it, someone learns they were worth remembering.",
  },

  reviewQuestionIds: [],
  status: "draft",

  culturalNotes: [
    "Name customs vary: given names, family names, honorifics, and titles are used differently across cultures and families.",
    "The lesson treats learning to pronounce unfamiliar names as ordinary care, not as a burden.",
  ],
  accessibilityNotes: [
    "A wave-plus-name option keeps the practice available to children who prefer minimal speech.",
    "Forgetting names is framed as universal, never as a failing — important for children with memory or attention differences.",
  ],
  safetyNotes: [
    "The lesson notes a child never owes their name to someone who feels unsafe.",
    "All scenarios stay within a supervised, familiar group.",
  ],
  version: 1,
};
