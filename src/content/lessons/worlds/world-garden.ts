import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 12 — World Garden · module "Many Customs".
 *
 * DRAFT CONTENT — CULTURALLY SENSITIVE. Every lesson is `status: "draft"` and
 * this ENTIRE module REQUIRES review by qualified cultural consultants before it
 * is shown to a child (docs/design/MODULE_WORLDS.md §12). Not reviewed yet.
 *
 * The variation module: customs are parallel gardens, never exotic-vs-normal.
 * Two hard guardrails from docs/design/CHARACTER_BIBLE.md and MODULE_WORLDS §12:
 * (1) no flag or costume clichés, no reducing a people to one trait; and (2) a
 * character's home culture is texture, never the lesson topic. So these lessons
 * teach the CHILD'S STANCE — curiosity over staring, respect over judgement,
 * belonging over othering — using "some families / around the world / different
 * homes" framing rather than cataloguing or performing any specific culture.
 *
 * No choice is "correct"; `consequenceType` records what tends to follow.
 */

const skillArea = "culture" as const;
const moduleId = "world-garden";

export const worldGardenLessons: Lesson[] = [
  {
    id: "world-garden-many-ways-to-say-hello",
    slug: "world-garden-many-ways-to-say-hello",
    moduleId,
    order: 1,
    title: "So many ways to say hello",
    description:
      "In the World Garden, hello sounds and looks a hundred different ways. Every one of them means the same warm thing.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that greetings vary between families and places, and all are real.",
      "Recognise that a new way of greeting is not a strange way.",
      "Name a curious, respectful response to an unfamiliar greeting.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-greeting-beds",
        title: "The greeting beds",
        narration:
          "In the World Garden, every planter grows a different hello. Some families greet with a wave, some with a bow, some with a hand on the heart, some with a special word. A new friend greets you in a way you have not seen before.",
        illustrationKey: "garden-planters",
        prompt: "How could you respond?",
        choices: [
          {
            id: "warm-and-curious",
            text: "Greet them warmly back, and be curious about their way.",
            consequenceType: "helpful",
            response:
              "You met a new greeting with warmth instead of surprise. All these hellos mean the same friendly thing — “I’m glad to see you” — and greeting back kindly shows you understood that, whichever form it took.",
          },
          {
            id: "call-it-strange",
            text: "Laugh and say their greeting is strange.",
            consequenceType: "mixed",
            response:
              "A new greeting can surprise you, and being surprised is okay. But laughing at it can make a friend feel their way is wrong — and it is not. Every family’s hello is a real hello; different is not strange.",
          },
          {
            id: "ask-to-learn",
            text: "Ask them, with interest, to show you how their greeting works.",
            consequenceType: "needs_context",
            response:
              "A lovely, curious response — asking to learn (rather than pointing out how it is different) is warm and respectful. Most people love to share their way when you are genuinely interested.",
          },
        ],
      },
    ],
    principle: {
      title: "Every hello means the same warm thing",
      body: "Around the world and between families, hello comes in many forms — words, waves, bows, a hand on the heart — and they all mean the same friendly thing. It matters because meeting a new greeting with warmth and curiosity, instead of calling it strange, tells a person their way belongs here too.",
      points: [
        "Greetings differ between families and places; all of them are real.",
        "A greeting that is new to you is not a strange one — just new.",
        "Being curious (“show me your way”) is warmer than pointing out the difference.",
        "You can greet warmly your own way, and never have to hug or touch to say hello.",
      ],
    },
    practice: {
      prompt:
        "A friend greets you in a way that’s new to you. How will you respond?",
      helperText: "Pick the warm, curious response.",
      options: [
        {
          id: "greet-warmly",
          text: "Greet them warmly back",
          encouragement: "Warmth over surprise. Their hello belongs here too.",
        },
        {
          id: "ask-about-it",
          text: "Ask them to show me their way",
          encouragement: "Curious and kind. Most people love to share it.",
        },
        {
          id: "notice-not-judge",
          text: "Notice it without judging it",
          encouragement: "Different isn’t strange. You’ve got the idea.",
        },
      ],
      closing:
        "Meet every new hello with warmth. They all mean the same friendly thing.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, notice a different way of greeting — or learn a new hello — and meet it with curiosity, not surprise.",
      parentPrompt:
        "Explore greetings from around the world together with curiosity and respect, framing each as a real, equal way to say hello.",
      completionQuestion:
        "What new way of saying hello did you learn or notice?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Model curiosity, not novelty. Framing greetings as equal ‘ways’ — never as exotic or funny — builds genuine respect for difference.",
      tryThis: [
        "Meet new greetings with interest: “What a lovely way to say hello.”",
        "Avoid treating any custom as odd or a curiosity to gawk at.",
        "Share your own family’s greetings as one among many.",
      ],
    },
    completion: {
      title: "You finished “So many ways to say hello”",
      message:
        "You practised meeting new greetings with warmth. Every hello, in every form, means the same friendly thing.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "CULTURALLY SENSITIVE: greetings are kept general (‘some families’) to avoid reducing any culture to a single gesture or cliché. Requires cultural-consultant review before ship.",
      "The lesson teaches the child’s respectful stance rather than performing or cataloguing specific cultures.",
    ],
    accessibilityNotes: [
      "Non-verbal and non-touch greetings are affirmed as equal, supporting all children.",
      "The lesson does not require eye contact or physical contact.",
    ],
    safetyNotes: [
      "The lesson keeps bodily autonomy intact — no greeting requires touch — even while celebrating varied customs.",
    ],
    version: 1,
  },

  {
    id: "world-garden-different-tables",
    slug: "world-garden-different-tables",
    moduleId,
    order: 2,
    title: "Different tables, different ways",
    description:
      "Every family's table has its own foods, its own ways, its own smells. Curiosity is the kindest guest.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that families eat different foods and in different ways, all valid.",
      "Recognise that an unfamiliar food is not a bad food.",
      "Name a kind, curious response to a food that is new to you.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-new-food",
        title: "A new smell at the table",
        narration:
          "At a friend’s table, there is a dish you have never seen, with a smell that is completely new to you. Your friend’s family loves it and eats it often. Your friend is watching to see what you think.",
        illustrationKey: "garden-table",
        prompt: "What could you do?",
        choices: [
          {
            id: "curious-and-kind",
            text: "Say something kind and curious: “I’ve never had this — what is it?”",
            consequenceType: "helpful",
            response:
              "You met a new food with curiosity instead of a face. A dish that is a family’s favourite deserves a kind hello, even if you are not sure about it yet — and asking about it is warm and respectful.",
          },
          {
            id: "say-yuck",
            text: "Say “ew, that smells yucky” and push it away.",
            consequenceType: "mixed",
            response:
              "A strong new smell can surprise your nose, and you are allowed not to want it. But “yuck” about a food a family loves can really sting. You can say a kind “no thank you” without calling their favourite gross.",
          },
          {
            id: "no-thanks-kindly",
            text: "Say a warm “no thank you” if you’d rather not try it.",
            consequenceType: "needs_context",
            response:
              "Perfectly kind — you do not have to eat anything you do not want, and a warm “no thank you” honours the food and the family. Your body gets a say, and their dish still gets its respect.",
          },
        ],
      },
    ],
    principle: {
      title: "A new food is not a bad food",
      body: "Every family’s table has its own foods and ways, and a dish that is new to you is somebody’s favourite. It matters because meeting a new food with curiosity — or a kind “no thank you” — instead of a “yuck” honours the people whose table it is, while your body still gets its say.",
      points: [
        "Families eat different foods and in different ways; all of them are real meals.",
        "A food that is new or strong-smelling to you is not a bad food.",
        "Curiosity (“what is it?”) is kinder than a “yuck” face.",
        "You never have to eat anything you don’t want; a warm “no thank you” is always fine.",
      ],
    },
    practice: {
      prompt:
        "You’re offered a food that’s completely new to you. How will you respond?",
      helperText: "Pick the kind, curious response.",
      options: [
        {
          id: "ask-what-is-it",
          text: "Ask about it with interest",
          encouragement: "Curious and warm. That honours their table.",
        },
        {
          id: "maybe-try",
          text: "Try a little, if I want to",
          encouragement:
            "Only if you’d like to. Trying with an open mind is lovely.",
        },
        {
          id: "kind-no-thanks",
          text: "Say a warm “no thank you”",
          encouragement: "Kind to them and to yourself. Perfectly polite.",
        },
      ],
      closing:
        "Meet a new food with curiosity, not a ‘yuck’. Their favourite deserves a kind hello.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, meet a new-to-you food with curiosity — ask about it, or try a little — and be kind about it either way.",
      parentPrompt:
        "Explore a food from another culture together with genuine curiosity, and model ‘no thank you’ without ‘yuck’ if it’s not for you.",
      completionQuestion:
        "What new food did you meet, and how did you keep it kind?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘No yuck’ is a powerful table rule — it protects others’ dishes from being called gross while keeping your child’s food consent intact.",
      tryThis: [
        "Teach “no thank you, not yuck” about others’ foods.",
        "Explore unfamiliar foods with curiosity, never as ‘weird’.",
        "Keep trying optional — respect a genuine ‘no’.",
      ],
    },
    completion: {
      title: "You finished “Different tables, different ways”",
      message:
        "You practised meeting a new food with curiosity, not a ‘yuck’. Every family’s table deserves a kind hello.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "CULTURALLY SENSITIVE: foods are kept unnamed and general to avoid exoticising or stereotyping any cuisine. Requires cultural-consultant review, and any specific dishes added later must be reviewed for respectful, accurate portrayal.",
      "Food is treated as beloved and ordinary to the family whose table it is, never as strange.",
    ],
    accessibilityNotes: [
      "This lesson respects sensory food aversions: a warm ‘no thank you’ is fully valid and never framed as rudeness.",
      "The lesson does not require trying or tasting anything.",
    ],
    safetyNotes: [
      "The lesson preserves bodily autonomy over food (no one must eat, taste, or finish) while teaching respect for others’ cuisines.",
    ],
    version: 1,
  },

  {
    id: "world-garden-many-celebrations",
    slug: "world-garden-many-celebrations",
    moduleId,
    order: 3,
    title: "So many things to celebrate",
    description:
      "Families celebrate all sorts of days in all sorts of ways. Learning about someone's special day is a gift.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that families celebrate different days and holidays, all meaningful.",
      "Recognise that a celebration you don't share is still worth respecting.",
      "Name a kind way to respond to someone's special day.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-special-day",
        title: "A friend’s special day",
        narration:
          "A friend is excited because it is a special celebration for their family — one your family does not have. They are dressed up, there is special food, and they want to tell you all about it.",
        illustrationKey: "garden-fountain",
        prompt: "What could you do?",
        choices: [
          {
            id: "share-their-joy",
            text: "Be happy for them and ask them to tell you about their day.",
            consequenceType: "helpful",
            response:
              "You shared in your friend’s joy and let them tell their story. Being interested in someone’s special day — even one you do not celebrate — is a real gift, and it says “what matters to you matters to me.”",
          },
          {
            id: "dismiss-it",
            text: "Say “we don’t do that” and change the subject to your own holiday.",
            consequenceType: "mixed",
            response:
              "It is true you might not share their celebration. But brushing it off can make your friend feel their special day is not welcome here. You can enjoy hearing about theirs and share yours too — both can matter.",
          },
          {
            id: "wish-them-well",
            text: "Wish them a happy celebration, even though you don’t share it.",
            consequenceType: "needs_context",
            response:
              "A warm, kind thing to do — wishing someone joy on their special day, whatever it is, costs nothing and means a lot. If you are not sure how to say it, asking “how do you celebrate?” is lovely too.",
          },
        ],
      },
    ],
    principle: {
      title: "Someone's special day is worth celebrating with them",
      body: "Families celebrate all sorts of days, in all sorts of ways, and a celebration you do not share is still deeply special to the people who do. It matters because being glad for someone’s special day — asking about it, wishing them well — tells them their joy is welcome here, right beside yours.",
      points: [
        "Families celebrate different days and holidays; each is meaningful to them.",
        "A celebration you don’t share is still worth respecting and being glad about.",
        "Asking “how do you celebrate?” shows real, warm interest.",
        "Your celebrations and theirs can both matter — it is not one or the other.",
      ],
    },
    practice: {
      prompt:
        "A friend is excited about a celebration you don’t share. How will you respond?",
      helperText: "Pick the warm response.",
      options: [
        {
          id: "be-happy-for-them",
          text: "Be happy for them and ask about it",
          encouragement: "Sharing their joy is a real gift. Lovely.",
        },
        {
          id: "wish-well",
          text: "Wish them a happy celebration",
          encouragement: "Warm and kind — it costs nothing, means a lot.",
        },
        {
          id: "share-both",
          text: "Enjoy theirs, and share mine too",
          encouragement: "Both can matter. That’s just right.",
        },
      ],
      closing:
        "Be glad for someone’s special day, even if you don’t share it. Their joy is welcome here.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, learn about a celebration a friend or another family has that yours doesn’t — and be glad about it.",
      parentPrompt:
        "Learn about a holiday your family doesn’t celebrate together, with respect and genuine interest, as one of many meaningful days.",
      completionQuestion:
        "What celebration did you learn about, and how did you show you were glad for them?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Being glad for others’ celebrations — not just tolerant — builds real inclusion. Explore holidays as meaningful, never as ‘other people’s odd days’.",
      tryThis: [
        "Learn about a celebration you don’t share, with warmth.",
        "Ask friends “how do you celebrate?” and model interest.",
        "Frame all celebrations as equally meaningful, yours included.",
      ],
    },
    completion: {
      title: "You finished “So many things to celebrate”",
      message:
        "You practised being glad for a celebration you don’t share. Someone’s special day is a gift to hear about.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "CULTURALLY SENSITIVE: celebrations are kept unnamed and general to avoid tokenism, calendar errors, or reducing a holiday to a stereotype. Requires cultural-consultant review; any specific festivals added later must be portrayed accurately and respectfully by consultants.",
      "No celebration is centred as the default against which others are ‘different’.",
    ],
    accessibilityNotes: [
      "The lesson centres a transferable stance (be glad, ask, respect) rather than requiring knowledge of specific holidays.",
      "It does not assume the child’s own family celebrates any particular thing.",
    ],
    safetyNotes: [
      "The lesson keeps participation optional and respectful, never pressuring a child to join a celebration.",
    ],
    version: 1,
  },

  {
    id: "world-garden-asking-with-kindness",
    slug: "world-garden-asking-with-kindness",
    moduleId,
    order: 4,
    title: "Asking with kindness, not staring",
    description:
      "When something about a person is new to you, there's a kind way to be curious — and an unkind way.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain the difference between kind curiosity and unkind staring or pointing.",
      "Name a respectful way to ask about something new.",
      "Recognise that people are not there to be stared at, and it's okay not to ask at all.",
    ],
    skillArea,
    scenes: [
      {
        id: "something-new",
        title: "Something new to you",
        narration:
          "You notice something about a new person that is new to you — maybe how they dress, a way they move, something they wear, or how they speak. You feel curious. They can tell you have noticed.",
        illustrationKey: "garden-planters",
        prompt: "What could you do with your curiosity?",
        choices: [
          {
            id: "kind-question-or-not",
            text: "Ask a kind, quiet question — or just be friendly and not ask at all.",
            consequenceType: "helpful",
            response:
              "Both are respectful. A gentle question (“I like your … — what is it?”) shows warm interest, and simply being friendly without asking is fine too. People are not puzzles to solve — they are just people.",
          },
          {
            id: "stare-and-point",
            text: "Stare, point, and whisper about it to your friend.",
            consequenceType: "mixed",
            response:
              "Noticing is natural. But staring, pointing, and whispering can make a person feel like they are on display, which does not feel kind. Curiosity is welcome; treating someone like a spectacle is not.",
          },
          {
            id: "ask-privately-kindly",
            text: "Wait for a quiet moment and ask gently, ready to hear “I’d rather not say.”",
            consequenceType: "needs_context",
            response:
              "Thoughtful — a quiet, gentle question, ready for any answer, is a kind way to be curious. And remember, people do not owe you an explanation about themselves; “I’d rather not say” is a fine answer to accept.",
          },
        ],
      },
    ],
    principle: {
      title: "Curiosity is kind; staring is not",
      body: "When something about a person is new to you, being kindly curious is welcome — but staring, pointing, and whispering makes someone feel like a spectacle. It matters because people are not puzzles or displays; a gentle question, or simply being friendly, treats them as a person, which is what everyone deserves.",
      points: [
        "A kind, quiet question shows interest; staring and pointing make someone feel on display.",
        "It is completely fine to be friendly and not ask anything at all.",
        "People do not owe you an explanation about themselves.",
        "“I’d rather not say” is always a fine answer to accept.",
      ],
    },
    practice: {
      prompt:
        "Something about someone is new to you and you’re curious. What will you do?",
      helperText: "Pick the kind way to be curious.",
      options: [
        {
          id: "gentle-question",
          text: "Ask one gentle, kind question",
          encouragement: "Warm interest, respectfully. That’s kind curiosity.",
        },
        {
          id: "just-friendly",
          text: "Just be friendly and not ask",
          encouragement: "Perfectly fine. You don’t have to ask at all.",
        },
        {
          id: "accept-their-answer",
          text: "Be ready to accept “I’d rather not say”",
          encouragement: "Respectful — nobody owes an explanation. Well done.",
        },
      ],
      closing:
        "Be kindly curious, never a starer. People are people, not puzzles to solve.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you notice something new about someone, practise kind curiosity — a gentle question or just friendliness — never staring.",
      parentPrompt:
        "Talk about the difference between kind curiosity and staring/pointing, and practise gentle, respectful questions together.",
      completionQuestion:
        "What’s the difference between being curious and staring?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Young children stare and blurt — it’s normal. Teaching the line between kind curiosity and making someone a spectacle is the real skill, especially around disability and difference.",
      tryThis: [
        "Redirect staring gently: “Let’s ask kindly, or just be friendly.”",
        "Model accepting ‘I’d rather not say’ without pushing.",
        "Frame people as people, never as puzzles or displays.",
      ],
    },
    completion: {
      title: "You finished “Asking with kindness, not staring”",
      message:
        "You practised kind curiosity over staring. People are people, not puzzles — a gentle question, or none at all, is the kind way.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "CULTURALLY SENSITIVE: the lesson covers curiosity about visible difference (including disability, dress, and cultural markers) and must be reviewed by cultural and disability consultants to ensure it empowers rather than others.",
      "It centres the observer’s respectful behaviour, never treating any group as the object of study.",
    ],
    accessibilityNotes: [
      "This lesson directly protects disabled and visibly-different children from staring and spectacle, framing them as people owed respect and privacy.",
      "It affirms the right not to explain oneself.",
    ],
    safetyNotes: [
      "The lesson upholds a person’s right to privacy about themselves and to decline questions, reinforcing consent and dignity.",
    ],
    version: 1,
  },

  {
    id: "world-garden-names-from-everywhere",
    slug: "world-garden-names-from-everywhere",
    moduleId,
    order: 5,
    title: "Names from everywhere",
    description:
      "Names come from all over the world. Learning to say someone's name right is a way of saying they matter.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that saying someone's name correctly shows respect.",
      "Name a kind way to learn a name that is new to you.",
      "Recognise that no name is 'hard' or 'weird' — just new to you.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-new-name",
        title: "A name you haven’t heard",
        narration:
          "A new child joins the garden, and their name is one you have not heard before. When you try to say it, it comes out a bit wrong, and you are not sure how to get it right.",
        illustrationKey: "garden-fountain",
        prompt: "What could you do?",
        choices: [
          {
            id: "ask-and-practise",
            text: "Ask them to say it again, and practise until you get it right.",
            consequenceType: "helpful",
            response:
              "That is exactly how you show a name matters. Asking “can you say it again?” and practising tells the new child that their name — and they — are worth getting right.",
          },
          {
            id: "nickname-it",
            text: "Decide it is too hard and give them an easier nickname instead.",
            consequenceType: "mixed",
            response:
              "You might mean it kindly. But changing someone’s name because it is new to you can feel like their real name is not welcome. No name is “too hard” — just new — and it is worth the practice to learn it.",
          },
          {
            id: "ask-how-they-like",
            text: "Ask how they like their name said, and whether there’s a nickname they choose.",
            consequenceType: "needs_context",
            response:
              "A respectful question — some people do have a nickname they prefer, and that is their choice to offer. Asking how they like their name (rather than inventing one) puts the choice where it belongs: with them.",
          },
        ],
      },
    ],
    principle: {
      title: "Getting a name right says “you matter”",
      body: "Names come from all over the world, and saying someone’s name correctly is a small, powerful way of showing respect. It matters because your name is part of who you are — so taking the time to learn it, instead of changing it because it is new to you, tells a person they belong.",
      points: [
        "Asking “can you say it again?” and practising shows a name matters.",
        "No name is “hard” or “weird” — it is just new to you.",
        "Changing someone’s name without asking can feel like it is unwelcome.",
        "If someone offers a nickname they prefer, that is their choice to make.",
      ],
    },
    practice: {
      prompt: "Someone has a name that’s new to you. How will you learn it?",
      helperText: "Pick the respectful way.",
      options: [
        {
          id: "ask-again",
          text: "Ask them to say it again",
          encouragement: "That’s how you show it matters. Well done.",
        },
        {
          id: "practise-it",
          text: "Practise until I get it right",
          encouragement: "Worth the effort — their name is worth it.",
        },
        {
          id: "ask-preference",
          text: "Ask how they like it said",
          encouragement: "Respectful — the choice is theirs. Lovely.",
        },
      ],
      closing:
        "Learn to say a new name right. It’s a small thing that tells someone they matter.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you meet a name that’s new to you, ask how to say it and practise until you get it right.",
      parentPrompt:
        "Model getting names right: ask, repeat, and practise, and never shorten someone’s name for convenience without asking.",
      completionQuestion:
        "Whose name did you learn to say, and how did you get it right?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Mispronouncing or ‘simplifying’ names is a small but real slight. Modelling the effort to learn names teaches respect and belonging.",
      tryThis: [
        "Ask, repeat, and practise names yourself, out loud.",
        "Never rename someone for convenience; let nicknames be their choice.",
        "Frame names as ‘new to us’, never ‘hard’ or ‘weird’.",
      ],
    },
    completion: {
      title: "You finished “Names from everywhere”",
      message:
        "You practised learning a name the respectful way. Getting someone’s name right tells them they matter.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "CULTURALLY SENSITIVE: mispronunciation and ‘anglicising’ of names is a real experience of exclusion; requires cultural-consultant review to keep the lesson affirming, not tokenistic.",
      "Names are kept unspecified to avoid stereotype; the lesson teaches the respectful behaviour, not a list of ‘foreign’ names.",
    ],
    accessibilityNotes: [
      "The lesson centres respect and effort, achievable regardless of the child’s own pronunciation ability.",
      "It affirms the name-holder’s authority over their own name and any nickname.",
    ],
    safetyNotes: [
      "The lesson respects a person’s ownership of their own name, a small but real matter of identity and consent.",
    ],
    version: 1,
  },

  {
    id: "world-garden-what-we-share",
    slug: "world-garden-what-we-share",
    moduleId,
    order: 6,
    title: "What we all share",
    description:
      "Under all the different customs, people want a lot of the same things. The garden has many beds, but one sky.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that beneath different customs, people share the same basic feelings and needs.",
      "Recognise that difference and sameness are both true at once.",
      "Name something people everywhere have in common.",
    ],
    skillArea,
    scenes: [
      {
        id: "many-beds-one-sky",
        title: "Many beds, one sky",
        narration:
          "The World Garden has dozens of planter beds, each growing something different. But they all reach up toward the same sun, drink the same rain, and want the same things to grow. People are a little like that too.",
        illustrationKey: "garden-fountain",
        prompt: "What do you think people everywhere share?",
        choices: [
          {
            id: "same-feelings-needs",
            text: "The same big feelings and needs — to be loved, to belong, to feel safe.",
            consequenceType: "helpful",
            response:
              "Exactly. Under all the different customs, foods, and celebrations, people everywhere want to be loved, to belong, and to feel safe. Difference and sameness are both true — many beds, one sky.",
          },
          {
            id: "everyone-the-same",
            text: "Everyone is really exactly the same, so the differences do not matter.",
            consequenceType: "mixed",
            response:
              "It is warm to see what we share — but saying differences “do not matter” can skip over what makes each person special. The kindest view holds both: we share deep things, and our differences are real and worth celebrating.",
          },
          {
            id: "notice-both",
            text: "Notice both — how people are different, and what they share underneath.",
            consequenceType: "needs_context",
            response:
              "A wise way to see it. Holding both at once — real, lovely differences on top, and shared feelings and needs underneath — is how you respect someone fully. The garden has many beds and one sky, both true.",
          },
        ],
      },
    ],
    principle: {
      title: "Many beds, one sky",
      body: "Under all the different ways people greet, eat, celebrate, and live, everyone shares the same deep things — wanting to be loved, to belong, and to feel safe. It matters because seeing both — real differences and shared humanity — is how you respect a person fully, without erasing what makes them them.",
      points: [
        "Beneath different customs, people share the same big feelings and needs.",
        "Difference and sameness are both true at once.",
        "Seeing what we share does not mean pretending differences don’t matter.",
        "Everyone wants to be loved, to belong, and to feel safe.",
      ],
    },
    practice: {
      prompt:
        "What do people all over the world share, under all their differences?",
      helperText: "Pick what feels true to you.",
      options: [
        {
          id: "want-to-belong",
          text: "Wanting to belong",
          encouragement: "Yes — everyone wants a place they belong.",
        },
        {
          id: "want-to-be-loved",
          text: "Wanting to be loved and safe",
          encouragement: "True everywhere. A deep thing we all share.",
        },
        {
          id: "both-different-same",
          text: "Being different and sharing that",
          encouragement: "Both at once — many beds, one sky. Beautifully put.",
        },
      ],
      closing:
        "Many beds, one sky. People are wonderfully different, and share the deepest things.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, notice one way you and someone quite different from you actually want the same thing.",
      parentPrompt:
        "Talk about ‘many beds, one sky’: what your family and a very different family both want, alongside your real differences.",
      completionQuestion:
        "What did you notice that you and someone different both share?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘Both/and’ is the mature view: celebrate difference AND shared humanity. Avoid ‘we’re all the same’, which can erase identity.",
      tryThis: [
        "Name shared needs and real differences together, not one over the other.",
        "Avoid ‘differences don’t matter’; they do, and so does what we share.",
        "Use the ‘many beds, one sky’ image to hold both.",
      ],
    },
    completion: {
      title: "You finished “What we all share”",
      message:
        "You practised holding both — real differences and shared humanity. Many beds, one sky.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "CULTURALLY SENSITIVE: the lesson deliberately avoids ‘colour-blind’ or ‘we’re all the same’ framings that erase identity, teaching a both/and view instead. Requires cultural-consultant review.",
    ],
    accessibilityNotes: [
      "The ‘many beds, one sky’ metaphor makes an abstract idea concrete for young children.",
      "Shared needs named (love, belonging, safety) are universal and accessible.",
    ],
    safetyNotes: [
      "‘Feeling safe’ is named as a universal need, connecting gently to the safety themes of Brave Basecamp.",
    ],
    version: 1,
  },

  {
    id: "world-garden-room-for-everyone",
    slug: "world-garden-room-for-everyone",
    moduleId,
    order: 7,
    title: "A garden with room for everyone",
    description:
      "The World Garden grows best when every kind of plant has a place. Belonging is something we make together.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a community is richer when everyone belongs.",
      "Recognise that belonging is something people build together.",
      "Name a way to help someone feel they belong.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-new-bed",
        title: "Room for a new bed",
        narration:
          "A new family has just joined the neighborhood, and their customs, foods, and ways are new to some people here. A few children are unsure about them. You could help decide how the garden welcomes its newest bed.",
        illustrationKey: "garden-planters",
        prompt: "What could you do?",
        choices: [
          {
            id: "make-them-belong",
            text: "Welcome them warmly and help others be curious and kind, not wary.",
            consequenceType: "helpful",
            response:
              "You helped make room in the garden. Belonging is not something people just have — it is something a community builds, and by welcoming the new family and inviting others to be curious, you helped build it.",
          },
          {
            id: "go-with-wary",
            text: "Go along with the unsure children and keep your distance too.",
            consequenceType: "mixed",
            response:
              "It is easy to follow the crowd when others are unsure. But going along with wariness leaves a new family on the outside of the garden. One warm welcome from you can start to turn wary into curious.",
          },
          {
            id: "get-to-know",
            text: "Get to know the new family, and share a bit of your own ways too.",
            consequenceType: "needs_context",
            response:
              "A lovely two-way welcome — learning about them and sharing your own customs makes belonging mutual. That is how a garden grows: beds side by side, each adding something, all reaching the same sky.",
          },
        ],
      },
    ],
    principle: {
      title: "Belonging is something we build together",
      body: "A community — like a garden — grows richest when every kind of person has a place in it. It matters because belonging is not something people simply have; it is something we make for each other, with a warm welcome, honest curiosity, and room for one more bed.",
      points: [
        "A community is richer when everyone belongs, not poorer.",
        "Belonging is built by people, with welcomes and curiosity.",
        "One warm welcome can turn wariness into friendship.",
        "You can share your own ways while making room for someone else’s.",
      ],
    },
    practice: {
      prompt:
        "Someone new, with new ways, has arrived. How will you help them belong?",
      helperText: "Pick a way to build belonging.",
      options: [
        {
          id: "warm-welcome",
          text: "Welcome them warmly",
          encouragement: "One warm welcome can change everything. Lovely.",
        },
        {
          id: "invite-curiosity",
          text: "Help others be curious, not wary",
          encouragement: "Turning wary into curious — that builds belonging.",
        },
        {
          id: "share-both-ways",
          text: "Learn theirs and share mine",
          encouragement: "A two-way welcome. That’s how a garden grows.",
        },
      ],
      closing:
        "Belonging is something we build together. Help make room for one more bed in the garden.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, help someone new or different feel they belong — a warm welcome, a shared interest, or standing up for kind curiosity.",
      parentPrompt:
        "Find a real chance this week for your child to help someone feel they belong, and talk about belonging as something we build for each other.",
      completionQuestion: "How did you help someone feel they belong?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Belonging is built, not given. Coaching a child to welcome newcomers and interrupt wariness grows an inclusive instinct.",
      tryThis: [
        "Spot real chances to welcome newcomers together.",
        "Name belonging as something we make: “Let’s help them feel at home.”",
        "Gently interrupt ‘us and them’ talk with curiosity.",
      ],
    },
    completion: {
      title: "You finished “A garden with room for everyone”",
      message:
        "You practised building belonging for someone new. A garden — and a neighborhood — grows best with room for everyone.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "CULTURALLY SENSITIVE: the lesson addresses welcoming newcomers and interrupting wariness of the unfamiliar; requires cultural-consultant review to ensure it empowers belonging without tokenising the ‘new family’.",
      "The new family’s specific background is left open, keeping the focus on the welcomer’s stance.",
    ],
    accessibilityNotes: [
      "Belonging is framed to include all kinds of difference, not culture alone.",
      "Every way to help belong has a form that does not require lots of talking.",
    ],
    safetyNotes: [
      "Welcoming is framed as a kindness a child chooses, and never overrides their own safety or right to set boundaries.",
    ],
    version: 1,
  },

  {
    id: "world-garden-review",
    slug: "world-garden-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "The whole World Garden in bloom — greetings, tables, celebrations, names, and belonging, all in one place.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together curiosity, respect, and belonging across many customs.",
      "Choose a culture-and-kindness move that fits a real moment.",
      "Carry one respectful, welcoming habit into the real world.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-garden-in-bloom",
        title: "The whole garden in bloom",
        narration:
          "The World Garden’s fountain is blooming with a pattern woven from every bed’s flowers. A new friend is here whose greetings, food, celebrations, and name are all new to you — and you want them to feel they belong in the garden.",
        illustrationKey: "garden-fountain",
        prompt: "Putting it all together, what do you do?",
        choices: [
          {
            id: "curious-and-welcoming",
            text: "Meet everything new with warm curiosity, learn their name, and help them belong.",
            consequenceType: "helpful",
            response:
              "You brought the whole garden together: curiosity over staring, respect for their customs, care with their name, and a welcome that builds belonging. That is how many beds make one beautiful garden.",
          },
          {
            id: "keep-distance",
            text: "Keep a polite distance since so much is unfamiliar.",
            consequenceType: "mixed",
            response:
              "Unfamiliar things can make us cautious, and that is human. But polite distance can feel like being left outside the garden. A little warm curiosity — a question, a welcome — turns unfamiliar into friendship.",
          },
          {
            id: "one-warm-thing",
            text: "Start with one warm thing — learning to say their name right.",
            consequenceType: "needs_context",
            response:
              "A lovely place to start — one genuine, warm act, like getting their name right, opens the door. From there, curiosity and welcome can grow the rest of the friendship.",
          },
        ],
      },
    ],
    principle: {
      title: "Many customs, one shared garden",
      body: "Everything in this world is one idea: people do things in wonderfully different ways, and every way belongs in the garden. It matters because meeting difference with curiosity, respect, and welcome — instead of staring, judging, or keeping distance — is how a neighborhood, and a world, becomes a place where everyone belongs.",
      points: [
        "Meet new greetings, foods, and celebrations with curiosity, not judgement.",
        "Get names right, and never treat a person as a spectacle.",
        "Difference and shared humanity are both true — many beds, one sky.",
        "Belonging is something we build together, with room for everyone.",
      ],
    },
    practice: {
      prompt:
        "Pick the many-customs habit you want to take out into the real world this week.",
      helperText: "There is no wrong choice — pick what you want to practise.",
      options: [
        {
          id: "practise-curiosity",
          text: "Kind curiosity, not staring",
          encouragement: "People, not puzzles. A lovely habit to keep.",
        },
        {
          id: "practise-names",
          text: "Getting names right",
          encouragement: "A small thing that says ‘you matter’. Great pick.",
        },
        {
          id: "practise-glad",
          text: "Being glad for others’ celebrations",
          encouragement: "Sharing joy across difference. Warm choice.",
        },
        {
          id: "practise-belonging",
          text: "Helping someone belong",
          encouragement: "Building the garden bigger. Beautiful.",
        },
      ],
      closing:
        "Take your one habit into the real world this week. Many customs, one shared garden — and you help it bloom.",
    },
    offlineMission: {
      childPrompt:
        "This week, meet difference with curiosity and welcome — learn something new about someone, get a name right, or help someone new belong.",
      parentPrompt:
        "Give your child one real chance this week to welcome difference — a new friend, a new custom, a new name — with curiosity and respect, and talk about it together.",
      completionQuestion:
        "What did you learn about someone different from you this week?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "This whole module needs cultural-consultant review before use. In daily life, model curiosity over judgement and belonging over othering — children absorb your stance most of all.",
      tryThis: [
        "Model warm curiosity about difference in everyday life.",
        "Get names and customs right, and admit when you’re learning.",
        "Frame your neighborhood and world as a garden with room for everyone.",
      ],
    },
    completion: {
      title: "You finished “Many Customs”",
      message:
        "You put it all together — curiosity, respect, right names, shared joy, and belonging. Many customs, one shared garden. Go help it bloom.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "CULTURALLY SENSITIVE REVIEW MODULE. This entire module must be reviewed and approved by qualified cultural consultants before it is shown to any child.",
      "It deliberately avoids flag/costume clichés and reducing any people to a single trait, keeps specific cultures unnamed in draft, and teaches the child’s respectful stance rather than performing or cataloguing cultures. Any specific customs added later must be portrayed accurately and respectfully by consultants.",
    ],
    accessibilityNotes: [
      "Every habit in the review has a form that does not require lots of talking, keeping it open to all children.",
      "The lesson frames ‘difference’ broadly (including disability and family shape), not culture alone.",
    ],
    safetyNotes: [
      "The review keeps welcoming a chosen kindness that never overrides a child’s own safety, boundaries, or consent.",
    ],
    version: 1,
  },
];
