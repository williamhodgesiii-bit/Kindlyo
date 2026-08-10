import type { Lesson } from "@/features/curriculum/schema";

/**
 * Module "Meeting People", lesson 7. DRAFT CONTENT — not yet reviewed by a
 * qualified human. See lesson 1 (`saying-hello.ts`) for the authoring rules
 * that apply to every lesson in this module.
 */
export const leavingAConversation: Lesson = {
  id: "leaving-a-conversation",
  slug: "leaving-a-conversation",
  moduleId: "meeting-people",
  order: 7,
  title: "Leaving a conversation",
  description:
    "Your grown-up is at the door, and Maya is mid-story. Endings need a little care too.",
  estimatedMinutes: 5,
  ageMin: 5,
  ageMax: 9,
  learningObjectives: [
    "End a conversation without leaving the other person wondering.",
    "Use a short goodbye that points to next time.",
    "Know that you may leave any situation that feels wrong, goodbye or no goodbye.",
  ],
  skillArea: "ending",

  scenes: [
    {
      id: "home-time",
      title: "Home time",
      narration:
        "Art club is ending. Your grown-up is at the door with your coat. But Maya is halfway through telling you about her dog's birthday party — there was a cake made of dog biscuits — and she is nowhere near the end.",
      illustrationKey: "waving-goodbye",
    },
    {
      id: "saying-goodbye",
      title: "Saying goodbye",
      narration:
        "Your grown-up waves at you. Maya keeps talking. Both things are happening at once, the way they always do.",
      illustrationKey: "waving-goodbye",
      prompt: "How could you go?",
      choices: [
        {
          id: "pause-and-goodbye",
          text: "“I have to go — tell me the rest next week!”",
          consequenceType: "helpful",
          response:
            "Short, warm, and it does the two jobs of a goodbye: Maya knows why you are going, and she knows the story — and you — have a next time. She gets to keep her ending, and you get to keep your grown-up un-kept-waiting.",
        },
        {
          id: "just-leave",
          text: "Slip away while she is talking.",
          consequenceType: "mixed",
          response:
            "You got to the door — but Maya is now telling a dog-cake story to an empty chair. She may wonder if she said something wrong, because disappearing leaves the other person to invent the reason. Ten words would have carried you out just as fast.",
        },
        {
          id: "stay-silently",
          text: "Stay until the story ends, even though your grown-up is waiting.",
          consequenceType: "needs_context",
          response:
            "Letting people finish is kind — you learned that last lesson — but kindness has more than one direction, and someone is waiting for you. Sometimes a conversation cannot be stayed for, and “sorry, I have to go!” is not rude. It is just true.",
        },
      ],
    },
  ],

  principle: {
    title: "A goodbye tells someone the ending is not about them",
    body: "When you leave without a word, the other person writes their own reason — and people mostly write worrying ones. A goodbye, even three words of one, hands them the real reason: I am going because it is home time, not because of you. Add a “see you next week” and the ending turns into a door instead of a wall.",
    points: [
      "A goodbye can be words, a wave, or both. Short is fine; pointing to next time is the warm part.",
      "You do not owe anyone your staying. Needing to go is a real reason, and saying it is enough.",
      "If a person or a place feels unsafe or wrong, leave without a goodbye. Politeness is for endings that are safe; getting away comes first, always.",
      "In some families and cultures, goodbyes are long and involve everyone; in others they are quick. Both are goodbyes.",
    ],
  },

  practice: {
    prompt:
      "Your grown-up is at the door, Maya is mid-story. Pick your goodbye.",
    helperText: "Short is allowed. Warm is the aim.",
    options: [
      {
        id: "next-time-goodbye",
        text: "“Got to go — finish it next week?”",
        encouragement:
          "You turned an interruption into an appointment. Maya keeps her ending and you keep it warm.",
        rehearsalCue:
          "Try it now if you like, out loud or in your head — “Got to go — finish it next week?” Turning an ending into a next-time is worth one quiet run-through.",
      },
      {
        id: "wave-goodbye",
        text: "Wave and say “bye, Maya!”",
        encouragement:
          "Quick and clear. She knows you left for home, not away from her.",
        rehearsalCue:
          "Give a little wave now, or just picture it, with a “bye!” if you want one. A wave is a whole goodbye on its own, and practising it makes leaving feel easier.",
      },
      {
        id: "honest-goodbye",
        text: "“Sorry — my grown-up’s waiting!”",
        encouragement:
          "You gave the real reason, and real reasons are the whole point of goodbyes.",
        rehearsalCue:
          "Say the real reason now, aloud or just inside your head — “my grown-up’s waiting!” Real reasons are the point of a goodbye, and they come easier once you have said one.",
      },
    ],
    closing:
      "Endings are the part people re-run in their heads afterwards. A ten-second goodbye is cheap for what it buys.",
  },

  offlineMission: {
    childPrompt:
      "End one conversation on purpose this week: say why you are going, and point to next time — “see you tomorrow!”",
    parentPrompt:
      "Departures from school, clubs, and visits are daily practice slots. Give a two-minute warning so the goodbye is not a surprise, then let your child run it.",
    completionQuestion: "Who did you say goodbye to, and what did you say?",
  },

  parentCoaching: {
    title: "For the grown-up sitting alongside",
    prompt:
      "Leaving is a skill sandwiched between two pressures — the person talking and the person waiting. Children handle it better when departures are predictable, so the goodbye is a step and not an ambush.",
    tryThis: [
      "Give a “two more minutes” warning before departures, so the goodbye has room to happen.",
      "Model tiny goodbyes with reasons: “we’re off, dinner’s waiting — see you Thursday!”",
      "Tell your child directly, once, that if anywhere ever feels wrong they can leave with no goodbye at all and come straight to you. That sentence outranks this whole lesson.",
    ],
  },

  completion: {
    title: "You finished “Leaving a conversation”",
    message:
      "You practised endings — the part people remember longest. A small goodbye that points to next time turns leaving into looking forward.",
  },

  reviewQuestionIds: [],
  status: "draft",

  culturalNotes: [
    "Goodbye customs range from a quick wave to greeting every person present; the lesson presents both as complete.",
    "The 'reason plus next time' pattern is offered as a broadly portable form, not the only polite one.",
  ],
  accessibilityNotes: [
    "A wave-based goodbye keeps the skill available without speech.",
    "The competing-demands scenario (speaker vs waiting adult) is made explicit rather than assumed readable from context.",
  ],
  safetyNotes: [
    "Leaving unsafe situations without any goodbye is stated as the rule that beats all etiquette.",
    "The parent coaching asks the adult to say this aloud to the child once, directly.",
  ],
  version: 1,
};
