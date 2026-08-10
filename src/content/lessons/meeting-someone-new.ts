import type { Lesson } from "@/features/curriculum/schema";

/**
 * Module "Meeting People", lesson 4. DRAFT CONTENT — not yet reviewed by a
 * qualified human. See lesson 1 (`saying-hello.ts`) for the authoring rules
 * that apply to every lesson in this module.
 */
export const meetingSomeoneNew: Lesson = {
  id: "meeting-someone-new",
  slug: "meeting-someone-new",
  moduleId: "meeting-people",
  order: 4,
  title: "Meeting someone new",
  description:
    "Maya brings her friend Priya to art club. Meeting a friend's friend is its own small adventure.",
  estimatedMinutes: 5,
  ageMin: 5,
  ageMax: 9,
  learningObjectives: [
    "Put together a hello and an introduction when meeting somebody new.",
    "Notice how a new person might be feeling.",
    "Know that warming up slowly to new people is allowed.",
  ],
  skillArea: "including",

  scenes: [
    {
      id: "priya-arrives",
      title: "Maya brings a friend",
      narration:
        "Today Maya arrives with another girl. “This is Priya,” she says. “She’s my friend from swimming.” Priya holds her bag with both hands and looks around the room. She does not know anyone here except Maya.",
      illustrationKey: "two-children-talking",
    },
    {
      id: "meeting-priya",
      title: "Meeting Priya",
      narration:
        "Maya sits down in her usual spot, and Priya stands beside the table, not sure where to go.",
      illustrationKey: "two-children-meeting",
      prompt: "What could you do?",
      choices: [
        {
          id: "greet-and-introduce",
          text: "“Hi Priya — I’m Sam. You can sit here.”",
          consequenceType: "helpful",
          response:
            "Three small moves at once: her name, your name, and a place to belong. For someone standing in a room of strangers, that last part — “you can sit here” — can be the biggest hello of all.",
        },
        {
          id: "talk-only-to-maya",
          text: "Keep talking to Maya about the paints.",
          consequenceType: "mixed",
          response:
            "Nothing unkind happened — but Priya is still standing there, and now the two people she is nearest to are talking past her. Being new mostly feels like being invisible. One look or one word toward her would change that.",
        },
        {
          id: "smile-and-wait",
          text: "Smile at Priya and go on with your painting.",
          consequenceType: "needs_context",
          response:
            "A smile is a real welcome, and warming up slowly is allowed — for you and for her. Some new people want a quiet start. Just keep the door open: if she stays standing, a “you can sit here” finishes what your smile began.",
        },
      ],
    },
  ],

  principle: {
    title: "New people are mostly wondering if there is room for them",
    body: "When somebody new arrives, the question in their head is rarely about paint or games. It is: “is there space here for me?” Everything you already know — hello, your name, their name — works because it answers that question with yes. That is what meeting someone new really is: answering the question they are too shy to ask.",
    points: [
      "You can be welcoming at your own speed. A smile or a nod is a real welcome too.",
      "Nobody has to become friends. Welcoming somebody and befriending them are different things, and only the first one is the kind thing to offer everyone.",
      "Some children take a long time to feel at ease with new people. That is a way of being, not a fault — in you or in them.",
      "If a new person — child or adult — makes you feel unsafe or strange, you do not owe them a welcome. Move away and tell a grown-up you trust.",
    ],
  },

  practice: {
    prompt: "Priya is standing by the table. Pick your welcome.",
    helperText:
      "All of these answer her real question — “is there room for me?”",
    options: [
      {
        id: "full-welcome",
        text: "“Hi Priya, I’m … — you can sit here.”",
        encouragement:
          "Name, name, place. You answered the question she could not ask.",
        rehearsalCue:
          "Try the whole welcome now if you like — a hello, your name, and “you can sit here.” Out loud or just in your head; saying it once makes the real welcome easier.",
      },
      {
        id: "small-welcome",
        text: "Smile and pat the chair next to you",
        encouragement:
          "Not one word needed, and she still knows there is room for her. That is a whole welcome.",
        rehearsalCue:
          "Picture the quiet welcome now — a pat on the chair beside you, and a smile if it is yours to give. No words needed, and it still says there is room. You never have to hold a smile you do not feel.",
      },
      {
        id: "shared-thing",
        text: "“Do you want the blue? It’s the best one.”",
        encouragement:
          "You gave her a thing to do together, which is how most friendships actually start.",
        rehearsalCue:
          "Run it through now, aloud or in your head — offering the blue, or whatever you would share. Handing someone a thing to do together is how a lot of friendships actually start.",
      },
    ],
    closing:
      "Notice how every option makes space rather than demands anything from her. That is the shape of a good welcome.",
  },

  offlineMission: {
    childPrompt:
      "Next time someone new appears — at school, at a club, at the park — do one welcoming thing: a hello, a smile, or making room for them.",
    parentPrompt:
      "When your child meets someone new this week, resist managing the moment. Afterwards, ask what the new person might have been feeling.",
    completionQuestion:
      "Who was new, and what did you do to make room for them?",
  },

  parentCoaching: {
    title: "For the grown-up sitting alongside",
    prompt:
      "The leap in this lesson is perspective-taking: the new person has feelings too. You can grow that with one question, asked casually after any meeting: “what do you think that was like for them?”",
    tryThis: [
      "After meeting anyone new together, wonder aloud how it felt from their side.",
      "Praise welcoming moves you actually saw — “you made room for her” — rather than general niceness.",
      "If your child is the slow-to-warm one, say plainly that warming up slowly is allowed. They will meet plenty of pressure to perform; they should not meet it from this.",
    ],
  },

  completion: {
    title: "You finished “Meeting someone new”",
    message:
      "You practised answering the question every new person is silently asking. There is room for you here — it is a powerful thing to be able to say.",
  },

  reviewQuestionIds: [],
  status: "draft",

  culturalNotes: [
    "How children are expected to greet a friend-of-a-friend varies widely by culture and setting; the lesson offers forms, not rules.",
    "Offering a seat or shared materials is used as a culturally broad welcome signal.",
  ],
  accessibilityNotes: [
    "A wordless welcome (smile, patting a chair) is presented as fully equal.",
    "Slow-to-warm temperaments are named as a way of being, not a deficit.",
  ],
  safetyNotes: [
    "The lesson explicitly separates welcoming a peer from trusting strangers, and licenses moving away plus telling a trusted adult.",
    "No obligation to physical contact anywhere.",
  ],
  version: 1,
};
