import type { Lesson } from "@/features/curriculum/schema";

/**
 * Module "Meeting People", lesson 2. DRAFT CONTENT — not yet reviewed by a
 * qualified human. See lesson 1 (`saying-hello.ts`) for the authoring rules
 * that apply to every lesson in this module.
 */
export const introducingYourself: Lesson = {
  id: "introducing-yourself",
  slug: "introducing-yourself",
  moduleId: "meeting-people",
  order: 2,
  title: "Introducing yourself",
  description:
    "Maya said hi back. Now she is wondering what to call you — and an introduction is how you tell her.",
  estimatedMinutes: 5,
  ageMin: 5,
  ageMax: 9,
  learningObjectives: [
    "Explain that an introduction gives someone your name and something to talk to you about.",
    "Introduce yourself with a name and one small thing about you.",
    "Recognise that you choose what to share about yourself.",
  ],
  skillArea: "introducing",

  scenes: [
    {
      id: "back-at-the-table",
      title: "Back at the table",
      narration:
        "You said hello, and Maya said hi back. Now you are sitting at the long table together. She slides the blue paint over to you, and you realise she still does not know your name.",
      illustrationKey: "two-children-talking",
    },
    {
      id: "telling-her-who-you-are",
      title: "Telling her who you are",
      narration:
        "Maya looks at your paper and asks, “What are you painting?” This is a good moment — she is already talking to you.",
      illustrationKey: "two-children-meeting",
      prompt: "What could you say?",
      choices: [
        {
          id: "name-and-something",
          text: "“A dog. I’m Sam — I like drawing animals.”",
          consequenceType: "helpful",
          response:
            "Now Maya has your name and something to ask you about. An introduction is a small gift: it gives the other person somewhere to start.",
        },
        {
          id: "answer-only",
          text: "“A dog,” and keep painting.",
          consequenceType: "mixed",
          response:
            "You answered her, which is friendly. But she still has to call you “um, you”, and it is harder for her to start the next bit of talking. The door is open a crack instead of wide.",
        },
        {
          id: "ask-hers-first",
          text: "Ask her name before saying yours.",
          consequenceType: "needs_context",
          response:
            "Asking about the other person can be a lovely way in — most people like being asked. Just remember to say your own name too at some point, or Maya ends up knowing you without anything to call you.",
        },
      ],
    },
  ],

  principle: {
    title: "An introduction gives people a way to reach you",
    body: "Your name is like a handle. When you tell someone your name, and one small thing about you, you make it easy for them to talk to you again — today and next time. That is why introductions help: they are for the other person as much as for you.",
    points: [
      "You choose what to share. One small thing is plenty; nobody is owed your whole story.",
      "You do not have to shake hands or stand a special way to introduce yourself.",
      "Some children use a nickname, and that counts as their name.",
      "If someone makes you feel unsafe, you do not have to tell them anything about yourself — find a grown-up you trust.",
      "In some families, children are introduced by an adult first. Both ways are fine.",
    ],
  },

  practice: {
    prompt:
      "Try it now. Maya just asked about your painting. Which introduction feels like you?",
    helperText:
      "Say it out loud if you like — or just pick the one you would use.",
    options: [
      {
        id: "name-plus-like",
        text: "“I’m … — I like …”",
        encouragement:
          "That is the whole skill in one breath: a name, and a door for the next question.",
        rehearsalCue:
          "Try your version now if you like — “I’m … and I like …” — aloud, whispered, or just in your head. However you run it, the real one comes easier.",
      },
      {
        id: "just-name",
        text: "“I’m …”, and nothing else yet",
        encouragement:
          "Short works. Your name alone is already a real introduction; the rest can come later.",
        rehearsalCue:
          "Say just your name now if you like, out loud or inside your head — “I’m …”. A quiet go now makes it easier to start for real.",
      },
      {
        id: "ask-then-tell",
        text: "“What’s your name? I’m …”",
        encouragement:
          "Nice — you asked and you told. Now you both have handles.",
        rehearsalCue:
          "Picture asking first and then telling — “What’s your name? I’m …” — or murmur it now if you like. Trying it that way once helps it come out in order later.",
      },
    ],
    closing:
      "Whichever you picked, the important part is the same: after it, the other person knows what to call you.",
  },

  offlineMission: {
    childPrompt:
      "This week, introduce yourself to one person using your name and one small thing about you — “I’m …, I like …”.",
    parentPrompt:
      "Set up one easy introduction — a family friend, a librarian, another child at the park — and let your child decide what small thing to share.",
    completionQuestion:
      "Who did you introduce yourself to, and what did you tell them?",
  },

  parentCoaching: {
    title: "For the grown-up sitting alongside",
    prompt:
      "Children learn introductions by hearing them. Introduce yourself out loud in front of your child this week, with your name and one small detail, so the pattern is something they have heard, not just been told.",
    tryThis: [
      "Model it: “Hi, I’m Alex — I’m Sam’s dad.” Then name what you did.",
      "Let your child pick what they share about themselves; do not correct their choice of detail.",
      "Never pressure a child to perform an introduction for an audience — one real person is worth more than a party trick.",
    ],
  },

  completion: {
    title: "You finished “Introducing yourself”",
    message:
      "You practised giving someone your name and a little doorway into talking with you. That is how strangers start becoming friends.",
  },

  reviewQuestionIds: [],
  status: "draft",

  culturalNotes: [
    "Introduction customs differ: some cultures lead with family names, some with given names, and in some settings an adult introduces the child.",
    "Nicknames are treated as fully valid names.",
  ],
  accessibilityNotes: [
    "No handshake, eye contact, or posture is required or implied.",
    "The practice options include a minimal one-word-plus-name form for children who find speech effortful.",
  ],
  safetyNotes: [
    "The lesson states that a child chooses what to share and owes strangers nothing when they feel unsafe.",
    "The scenario is a supervised group with a familiar peer, not an unknown adult.",
  ],
  version: 1,
};
