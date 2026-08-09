import type { Lesson } from "@/features/curriculum/schema";

/**
 * Module "Meeting People", lesson 1.
 *
 * DRAFT CONTENT. Written to docs/CURRICULUM_PRINCIPLES.md but not reviewed by
 * a qualified human, which is why `status` is "draft" and `reviewedBy` and
 * `reviewedAt` are absent. Nothing here should be described as validated by an
 * educator, psychologist, or clinician, because it has not been.
 *
 * Two things to hold on to if you edit this file:
 *
 * - None of the three choices is wrong. They differ in what tends to follow,
 *   which is what `consequenceType` records. Do not add a "best" answer.
 * - Every greeting form offered in the practice step is presented as equally
 *   valid. Speaking is not the standard that waving falls short of.
 */
export const sayingHello: Lesson = {
  id: "saying-hello",
  slug: "saying-hello",
  moduleId: "meeting-people",
  order: 1,
  title: "Saying hello",
  description:
    "A first morning at art club, and someone you have not met yet looks up. What does a hello actually do?",
  estimatedMinutes: 6,
  ageMin: 5,
  ageMax: 9,
  learningObjectives: [
    "Explain that a greeting tells another person they have been noticed.",
    "Name more than one way to say hello, including ways without words.",
    "Recognise that a greeting never requires touch, eye contact, or speaking.",
  ],
  skillArea: "greeting",

  scenes: [
    {
      id: "art-club-morning",
      title: "The first morning at art club",
      narration:
        "It is your first morning at art club. A girl called Maya is already at the long table, laying out paintbrushes in a row. She looks up when you come in, and then keeps going with the brushes. You have never met her before.",
      illustrationKey: "art-table-morning",
    },
    {
      id: "the-first-moment",
      title: "Maya looks up",
      narration:
        "Maya glances over again. There is a free chair beside her. Right now, she does not know whether you noticed her at all.",
      illustrationKey: "two-children-meeting",
      prompt: "What could you do first?",
      choices: [
        {
          id: "say-hello-and-name",
          text: "Say hello and tell her your name.",
          consequenceType: "helpful",
          response:
            "Now Maya knows two things: you noticed her, and what to call you. That gives her something easy to answer. A hello is short, and it does a lot of work.",
        },
        {
          id: "wait-to-be-greeted",
          text: "Look at the paints and wait for Maya to say something first.",
          consequenceType: "mixed",
          response:
            "This might work. Maya may say hello first, and then you are both fine. It might also mean you each wait for the other, and the quiet gets longer. Waiting is not wrong — it just leaves the first move to someone else.",
        },
        {
          id: "wave-instead",
          text: "Wave, without saying anything.",
          consequenceType: "needs_context",
          response:
            "A wave is a real hello. Some rooms are too loud for words, some days words are hard to find, and some people greet with hands, a nod, or a sign. What matters is that Maya can tell you noticed her. Different situations can need different responses.",
        },
      ],
    },
  ],

  principle: {
    title: "A hello tells someone you noticed them",
    body: "When you greet somebody, you are telling them something useful: I can see you, and I am glad you are here. That is why it helps. It is not about being polite for the sake of it — it is so the other person does not have to wonder whether they were noticed at all.",
    points: [
      "A hello can be words, a wave, a nod, a smile, or a sign.",
      "You can greet people in the way that works for you. You never have to look someone in the eye.",
      "You never have to hug, shake hands, or be touched to say hello, and you can say no to that.",
      "If a person or a place feels unsafe, you do not owe anyone a greeting. Walk away and find a grown-up you trust.",
      "Families and countries greet in different ways, and all of them count.",
    ],
  },

  practice: {
    prompt:
      "Your turn. Maya has just looked up. Which hello feels right for you?",
    helperText:
      "There is no single right answer here. Pick the one you would really use.",
    options: [
      {
        id: "spoken-hello",
        text: "Say “Hi, I’m …” and your name",
        encouragement:
          "Good one. Saying your name gives the other person something to answer with.",
        rehearsalCue:
          "Say it out loud now if you like — “Hi, I’m …” — quietly, or just in your head. Any way you say it makes it easier with a real person later.",
      },
      {
        id: "wave-hello",
        text: "Wave",
        encouragement:
          "A wave carries just as much. Maya can tell straight away that you saw her.",
        rehearsalCue:
          "Give a little wave now, the way you would to Maya — or just picture yourself waving. Both count, and both make the real one easier.",
      },
      {
        id: "smile-and-nod",
        text: "Smile and nod",
        encouragement:
          "That works. A nod is a small hello, and it still reaches the other person.",
        rehearsalCue:
          "Try a small nod now, or imagine one. You never have to hold a smile for anyone — a nod on its own is a hello too.",
      },
      {
        id: "sign-hello",
        text: "Sign or gesture hello",
        encouragement:
          "Hello travels in lots of ways. Anything the other person can notice is a hello.",
        rehearsalCue:
          "Make your sign or gesture now, or picture yourself doing it. Your way of saying hello counts, and practising it makes the real one easier.",
      },
    ],
    closing:
      "However you picked, giving it a go now — even just in your head — makes it easier when it is a real person.",
  },

  offlineMission: {
    childPrompt:
      "Before your next lesson, say hello to one person in your own way. It could be a neighbour, a teacher, a bus driver, or someone at the door.",
    parentPrompt:
      "Give your child one low-stakes chance to greet somebody today, and let them choose how they do it. Going first yourself is usually enough.",
    completionQuestion: "Who did you say hello to, and what happened next?",
  },

  parentCoaching: {
    title: "For the grown-up sitting alongside",
    prompt:
      "Children copy greetings long before they can explain them. The most useful thing you can do this week is greet people out loud where your child can hear you.",
    tryThis: [
      "Greet someone in front of your child, then say what you did: “I said hello so she knew I’d seen her.”",
      "Let your child pick the form. A wave counts. Do not ask for eye contact or a handshake.",
      "Never make a greeting the price of safety, help, or affection — your child may always decline being touched.",
      "If the greeting does not happen, skip the correction and try again another day.",
    ],
  },

  completion: {
    title: "You finished “Saying hello”",
    message:
      "You practised noticing somebody and letting them know it. That is the whole skill, and you can use it tomorrow.",
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
    "Feedback is written to be read aloud by an adult and does not depend on colour or on the illustration.",
    "Illustrations are decorative; the narration carries the whole situation.",
  ],
  safetyNotes: [
    "A child may always decline physical contact, including hugs and handshakes.",
    "Politeness never overrides safety: leaving and finding a trusted adult is stated as an allowed option.",
    "The scenario is set in a supervised group, not a stranger encounter; the lesson does not encourage greeting unknown adults unsupervised.",
  ],

  version: 1,
};
