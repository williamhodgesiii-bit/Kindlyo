import type { Lesson } from "@/features/curriculum/schema";

/**
 * Module "Meeting People", lesson 1.
 *
 * DRAFT CONTENT. Written to docs/CURRICULUM_PRINCIPLES.md but not reviewed by
 * a qualified human, which is why `status` is "draft" and `reviewedBy` and
 * `reviewedAt` are absent. Nothing here should be described as validated by an
 * educator, psychologist, or clinician, because it has not been.
 *
 * Version 2 rewrote the child-facing copy shorter and more concrete for ages
 * 5-9 (short sentences, one idea each, concrete high-frequency words), on the
 * age-appropriate-reading-level research gathered for the lesson revamp. The
 * lesson's meaning, structure, ids, and every safety point are unchanged; only
 * the wording is tighter. Three things to hold on to if you edit this file:
 *
 * - None of the three choices is wrong. They differ in what tends to follow,
 *   which is what `consequenceType` records. Do not add a "best" answer.
 * - Every greeting form offered in the practice step is presented as equally
 *   valid. Speaking is not the standard that waving falls short of.
 * - The safety spine lives in `principle.points` (and `parentCoaching.tryThis`):
 *   greetings can be silent, need no eye contact, never require being touched,
 *   can be declined, give way to safety, and vary by culture. Those points are
 *   kept as discrete, affirmatively-framed lines on purpose — do not fold them
 *   into prose or shorten them away. `saying-hello.safety.test.ts` guards them.
 */
export const sayingHello: Lesson = {
  id: "saying-hello",
  slug: "saying-hello",
  moduleId: "meeting-people",
  order: 1,
  title: "Saying hello",
  description:
    "It is your first day at art club. Someone looks up. What does a hello really do?",
  estimatedMinutes: 5,
  ageMin: 5,
  ageMax: 9,
  learningObjectives: [
    "Understand that a hello tells someone they were noticed.",
    "Name more than one way to say hello, including ways without words.",
    "Know that a hello can be silent and never needs touch or eye contact.",
  ],
  skillArea: "greeting",

  scenes: [
    {
      id: "art-club-morning",
      title: "Your first day at art club",
      narration:
        "It is your first day at art club. A girl is already there. Her name is Maya. She looks up, then goes back to setting out the paintbrushes. You have not met her before.",
      illustrationKey: "art-table-morning",
    },
    {
      id: "the-first-moment",
      title: "Maya looks up",
      narration:
        "Maya looks over again. There is an empty chair next to her. She does not know yet if you saw her.",
      illustrationKey: "two-children-meeting",
      prompt: "What could you do first?",
      choices: [
        {
          id: "say-hello-and-name",
          text: "Say hello and tell her your name.",
          consequenceType: "helpful",
          response:
            "Now Maya knows you saw her, and what to call you. That makes it easy for her to answer back. A short hello did a lot.",
        },
        {
          // Waiting is the situational choice: whether it works depends on
          // whether Maya greets first. Framed as "it depends", never as wrong —
          // this is the beat the parent dashboard offers as a conversation.
          id: "wait-to-be-greeted",
          text: "Wait, and let Maya speak first.",
          consequenceType: "needs_context",
          response:
            "This can work. Maya might say hello first. Or you both wait, and it stays quiet for a while. Waiting is okay. It just lets someone else go first.",
        },
        {
          // A wave is affirmed exactly like a spoken hello ("That helps"), so
          // the one silent option in the scene never reads as the lesser
          // choice — non-speaking greetings are equal, not fallbacks. The
          // situational "it depends" beat sits on *waiting* below instead, which
          // is also what the parent dashboard surfaces as a talking point.
          id: "wave-instead",
          text: "Wave, without saying anything.",
          consequenceType: "helpful",
          response:
            "A wave is a real hello. Some rooms are too loud for words. Some people greet with a nod or a sign. What matters is Maya knows you saw her.",
        },
      ],
    },
  ],

  principle: {
    title: "A hello tells someone you see them",
    body: "A hello tells someone: I see you, and I am glad you are here. That way they do not have to wonder if anyone noticed them.",
    points: [
      // Non-speaking forms lead, so waving/nodding/signing never read as a
      // fallback to words. The two highest-stakes boundaries — refusing touch,
      // and walking away if unsafe — hold the last two (most-remembered) slots.
      "A hello can be a wave, a nod, a sign, or words.",
      "You can greet in the way that feels right for you.",
      "You never have to look someone in the eye to say hello.",
      "Families and countries greet in different ways. All of them count.",
      "You never have to be touched to say hello. You can always say no.",
      "If a place feels unsafe, walk away and find a grown-up you trust.",
    ],
  },

  practice: {
    prompt: "Your turn. Maya just looked up. Which hello feels right for you?",
    helperText:
      "There is no single right answer. Pick the one you would really use.",
    options: [
      {
        id: "spoken-hello",
        text: "Say “Hi, I’m …” and your name",
        encouragement: "Nice. Your name gives them something to answer with.",
        rehearsalCue:
          "Try it now: say “Hi, I’m …” out loud, or just in your head.",
      },
      {
        id: "wave-hello",
        text: "Wave",
        encouragement:
          "A wave says it just as well. Maya sees that you noticed her.",
        rehearsalCue:
          "Give a little wave now, or picture yourself waving. Both count.",
      },
      {
        id: "smile-and-nod",
        text: "Smile and nod",
        encouragement: "A nod is a small hello, and it still reaches someone.",
        rehearsalCue:
          "Try a small nod now, or imagine one. A nod on its own is a hello too.",
      },
      {
        id: "sign-hello",
        text: "Sign or gesture hello",
        encouragement:
          "Hello travels in lots of ways. Anything someone can notice is a hello.",
        rehearsalCue:
          "Make your sign or gesture now, or picture it. Your way counts.",
      },
    ],
    closing:
      "However you said it, trying it now makes it easier with a real person.",
  },

  offlineMission: {
    childPrompt:
      "Before your next lesson, say hello to one person in your own way, with your grown-up nearby. It could be a neighbour, a teacher, or a bus driver.",
    parentPrompt:
      "Give your child one low-key chance to greet someone today. Let them choose how. Going first yourself is usually enough.",
    completionQuestion: "Who did you say hello to, and what happened next?",
  },

  parentCoaching: {
    title: "For the grown-up sitting alongside",
    prompt:
      "Children copy greetings long before they can explain them. The best thing you can do this week: greet people out loud where your child can hear.",
    tryThis: [
      "Greet someone where your child can see. Then say why: “I said hello so she knew I saw her.”",
      "Let your child pick how. A wave counts. Don’t ask for eye contact or a handshake.",
      "If the hello does not happen, skip the correction. Try again another day.",
      "Never make a greeting the price of help or affection. Your child may always say no to being touched.",
    ],
  },

  completion: {
    title: "You finished “Saying hello”",
    message:
      "You practised noticing someone and letting them know. That is the whole skill. You can use it tomorrow.",
  },

  reviewQuestionIds: [],

  status: "draft",

  culturalNotes: [
    "Greeting customs vary widely: volume, formality, whether children greet adults first, and whether a greeting is expected at all differ by family and culture.",
    "The lesson deliberately avoids naming one greeting as standard, and avoids handshakes, which are not universal.",
    "Names are used as an example of a spoken greeting, not a requirement; some children are taught to use titles instead.",
  ],
  accessibilityNotes: [
    "Eye contact is never required, and is named explicitly as optional.",
    "Non-speaking greetings — waving, nodding, signing — are presented as equal, not as fallbacks.",
    "Copy uses short sentences with one idea each, and reads aloud cleanly for a parent alongside a pre-reader.",
    "Feedback is written to be read aloud by an adult and does not depend on colour or on the illustration.",
    "Illustrations are decorative; the narration carries the whole situation.",
  ],
  safetyNotes: [
    "A child may always decline physical contact, including hugs and handshakes.",
    "Politeness never overrides safety: leaving and finding a trusted adult is stated as an allowed option.",
    "The scenario is set in a supervised group, not a stranger encounter; the lesson does not encourage greeting unknown adults unsupervised.",
  ],

  version: 2,
};
