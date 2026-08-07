import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 7 — Welcome Home · module "Guests and Hosts".
 *
 * DRAFT CONTENT (docs/CURRICULUM_PRINCIPLES.md). Not specialist-reviewed; every
 * lesson stays `status: "draft"`.
 *
 * Being a guest and a host, both ways. The through-line is that every home has
 * its own ways — shoes on or off, who greets whom first, what a guest waits to
 * be offered — and none is the "right" one; they are each family's way
 * (docs/design/MODULE_WORLDS.md §7). "Home" is drawn neutrally: apartment or
 * house. Maya is a natural host and is growing in asking before hugs
 * (CHARACTER_BIBLE.md).
 *
 * No choice is "correct"; `consequenceType` records what tends to follow. Guest
 * and host customs are shown as parallel, never ranked.
 */

const skillArea = "hosting" as const;
const moduleId = "welcome-home";

export const welcomeHomeLessons: Lesson[] = [
  {
    id: "welcome-home-welcoming-someone-in",
    slug: "welcome-home-welcoming-someone-in",
    moduleId,
    order: 1,
    title: "Welcoming someone in",
    description:
      "A friend has arrived at your door for the first time. The first minute can make them feel at home.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a warm welcome helps a guest feel at ease.",
      "Name a way to welcome someone at the door.",
      "Recognise that a welcome is offered in each family's own way.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-first-visit",
        title: "Theo at the door",
        narration:
          "Theo has come to your home to play for the first time. He is standing just inside the door, holding his bag, not sure where to go or what to do. Everything here is new to him.",
        illustrationKey: "home-door",
        prompt: "What could you do?",
        choices: [
          {
            id: "warm-welcome",
            text: "Say “Come in, I’m glad you’re here!” and show him where to put his bag.",
            consequenceType: "helpful",
            response:
              "A warm hello and a “here’s where things go” melts the first-visit nerves. Theo can relax now — he knows he is welcome and he knows what to do with his bag.",
          },
          {
            id: "wander-off",
            text: "Say “hi” and wander off to your room, leaving him at the door.",
            consequenceType: "mixed",
            response:
              "A quick hi is a start, but leaving Theo stranded at the door keeps him unsure and stuck. A guest feels at home much faster when the host stays and shows them in.",
          },
          {
            id: "check-comfort",
            text: "Welcome him and ask if he’d like to leave his shoes on or off.",
            consequenceType: "needs_context",
            response:
              "Thoughtful — you welcomed him and checked what fits your home and his comfort. Every home does shoes differently, and asking is a kind way to sort it out.",
          },
        ],
      },
    ],
    principle: {
      title: "A warm welcome helps a guest settle",
      body: "The first minute at the door can decide whether a guest feels at home or on edge. A warm welcome — a glad hello and showing them where things go — helps because arriving somewhere new is a little nerve-wracking, and you have the power to make it easy.",
      points: [
        "A glad hello and showing a guest around helps them relax.",
        "Telling a guest where to put their things takes away the ‘what do I do?’ worry.",
        "Every home welcomes its own way; there is no single correct greeting.",
        "A welcome never has to include a hug — ask first, and let your guest choose.",
      ],
    },
    practice: {
      prompt: "A guest arrives at your home. How will you welcome them?",
      helperText: "Pick a warm welcome that fits you.",
      options: [
        {
          id: "glad-hello",
          text: "“Come in — I’m glad you’re here!”",
          encouragement: "A glad hello sets a guest at ease straight away.",
        },
        {
          id: "show-around",
          text: "Show them where to put their things",
          encouragement: "Now they know what to do. That’s a real comfort.",
        },
        {
          id: "ask-comfort",
          text: "Ask what would make them comfy",
          encouragement: "Checking what they’d like is thoughtful hosting.",
        },
      ],
      closing:
        "Give a warm welcome the next time someone visits. The first minute matters most.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, when someone visits your home, welcome them your way and help them feel at home.",
      parentPrompt:
        "Give your child a real role next time you have a guest: greeting them at the door and showing them in.",
      completionQuestion:
        "Who did you welcome, and how did you help them feel at home?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Hosting is learned by doing. A small real job — being the door-greeter — teaches welcome better than a talk about it.",
      tryThis: [
        "Give your child a genuine welcoming role with guests.",
        "Model your own warm welcomes and name your home’s ways out loud.",
        "Keep hugs optional for both host and guest — ask first.",
      ],
    },
    completion: {
      title: "You finished “Welcoming someone in”",
      message:
        "You practised making a guest feel at home in the first minute. A warm welcome is a real gift.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Welcome customs differ hugely — words, gestures, offering food or tea first; the lesson keeps them parallel and un-ranked.",
      "‘Home’ is kept neutral (apartment or house), avoiding one default picture of family life.",
    ],
    accessibilityNotes: [
      "The lesson does not require a hug or eye contact to welcome someone; a spoken or gestured welcome suffices.",
      "The situation is carried in narration, not by expression alone.",
    ],
    safetyNotes: [
      "The lesson states a welcome never has to include a hug, reinforcing bodily autonomy for host and guest.",
    ],
    version: 1,
  },

  {
    id: "welcome-home-making-a-guest-comfortable",
    slug: "welcome-home-making-a-guest-comfortable",
    moduleId,
    order: 2,
    title: "Making a guest comfortable",
    description:
      "Your guest is in, but a bit stiff. Small offers — a drink, a seat, a game — help them settle.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that small offers help a guest feel comfortable.",
      "Name a way to look after a guest.",
      "Recognise that a guest may say no to offers, and that is fine.",
    ],
    skillArea,
    scenes: [
      {
        id: "guest-a-bit-stiff",
        title: "Settling in",
        narration:
          "Amara is sitting a little stiffly on the edge of the sofa. She is your guest, and she does not quite know if she is allowed to relax, ask for a drink, or pick a game.",
        illustrationKey: "home-sofa",
        prompt: "What could you do to help her settle?",
        choices: [
          {
            id: "offer-comforts",
            text: "Offer: “Would you like a drink? And you can pick what we play.”",
            consequenceType: "helpful",
            response:
              "Little offers like these tell Amara she is welcome to relax and to choose. A guest settles fast when the host makes it clear they can ask for things and help decide.",
          },
          {
            id: "do-your-own-thing",
            text: "Start doing your favourite thing and let her watch.",
            consequenceType: "mixed",
            response:
              "You are having fun, but Amara is left perched and unsure. A guest often will not ask for anything unless you offer first — so the offering is the kind part.",
          },
          {
            id: "let-her-choose",
            text: "Ask what she’d like to do, and check she’s comfy where she is.",
            consequenceType: "needs_context",
            response:
              "Lovely hosting — you handed her some choices instead of deciding for her. Some guests love to pick; some would rather you suggest. Offering the choice lets her tell you which.",
          },
        ],
      },
    ],
    principle: {
      title: "Small offers help a guest relax",
      body: "A guest often will not ask for a drink, a seat, or a say in the game unless the host offers first. Making small offers helps because it tells your guest they belong here and are allowed to relax — they do not have to guess what is okay.",
      points: [
        "Offering a drink, a comfy seat, or a choice of game helps a guest settle.",
        "Guests often wait to be offered rather than ask — so the offering matters.",
        "Letting your guest help choose what to do makes them feel at home.",
        "A guest can say “no thank you” to any offer, and that is completely fine.",
      ],
    },
    practice: {
      prompt:
        "Your guest seems unsure. How will you help them feel comfortable?",
      helperText: "Pick a warm offer.",
      options: [
        {
          id: "offer-drink",
          text: "Offer a drink or a snack",
          encouragement: "A classic kindness. It tells them they can relax.",
        },
        {
          id: "offer-choice",
          text: "Let them help choose what to do",
          encouragement: "Sharing the choice makes a guest feel at home.",
        },
        {
          id: "check-comfy",
          text: "Check they’re comfy where they are",
          encouragement: "Thoughtful — you’re looking after them. Lovely.",
        },
      ],
      closing:
        "Make a small offer to your next guest. It tells them they are welcome to relax.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, when someone visits, make them one comfy offer — a drink, a seat, or the first choice of game.",
      parentPrompt:
        "Coach your child to offer a guest a drink or a choice, and let them handle it, stepping in only if needed.",
      completionQuestion:
        "What did you offer your guest, and did it help them settle?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Teaching a child to offer — rather than wait — is the core of hosting. Let them practise it for real.",
      tryThis: [
        "Prompt an offer, then step back: “Would Amara like a drink?”",
        "Model offering choices to guests where your child can see.",
        "Let guests decline offers freely, so your child learns ‘no thanks’ is okay.",
      ],
    },
    completion: {
      title: "You finished “Making a guest comfortable”",
      message:
        "You practised small offers that help a guest relax. Good hosts make guests feel free to ask.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "What is offered a guest — tea, water, food, sweets — varies by culture; the lesson keeps the offer generic and warm.",
    ],
    accessibilityNotes: [
      "Offering choices supports guests who find open-ended situations hard, and hosts who prefer to suggest.",
      "The lesson relies on narration, not on reading subtle body language.",
    ],
    safetyNotes: [
      "A guest’s right to decline any offer is affirmed, reinforcing consent.",
    ],
    version: 1,
  },

  {
    id: "welcome-home-being-a-good-guest",
    slug: "welcome-home-being-a-good-guest",
    moduleId,
    order: 3,
    title: "Being a thoughtful guest",
    description:
      "You are the visitor this time, in someone else's home. A thoughtful guest asks before, not after.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a guest asks before helping themselves in someone else's home.",
      "Name a way to be a thoughtful guest.",
      "Recognise that homes have different rules, and asking is how you learn them.",
    ],
    skillArea,
    scenes: [
      {
        id: "at-junes-house",
        title: "At Jun’s house",
        narration:
          "You are at Jun’s home for the first time. You are thirsty and you spot the snack cupboard, and there is a shelf of interesting toys you would love to explore.",
        illustrationKey: "home-interior",
        prompt: "What could you do?",
        choices: [
          {
            id: "ask-first",
            text: "Ask Jun or his grown-up, “Please may I have a drink?”",
            consequenceType: "helpful",
            response:
              "Asking first is what a thoughtful guest does. Every home has its own rules about food and toys, and asking is how you find out — and it makes your hosts glad they invited you.",
          },
          {
            id: "help-yourself",
            text: "Help yourself to a snack and start opening the toy boxes.",
            consequenceType: "mixed",
            response:
              "At your own home this might be fine. But in someone else’s, helping yourself can bump into rules you did not know about. A quick “may I?” keeps you on the right side of them.",
          },
          {
            id: "wait-and-watch",
            text: "Wait, and see how Jun does things in his home first.",
            consequenceType: "needs_context",
            response:
              "Watching your host is a smart way to learn a new home’s ways — do they take shoes off, wait for a grown-up, eat only at the table? Following their lead, plus asking, works well.",
          },
        ],
      },
    ],
    principle: {
      title: "A thoughtful guest asks first",
      body: "In someone else’s home, asking before you help yourself is the kind thing to do. It matters because every home has its own rules you cannot see — about food, about toys, about shoes — and asking is how you honour them instead of accidentally crossing them.",
      points: [
        "Ask before eating, exploring, or borrowing in someone else’s home.",
        "Watching how your host does things helps you learn their home’s ways.",
        "Different homes have different rules, and none of them is wrong.",
        "If anything at a home ever makes you uncomfortable, you can say so and tell your grown-up.",
      ],
    },
    practice: {
      prompt: "You’re a guest and you want something. What will you do?",
      helperText: "Pick the thoughtful-guest move.",
      options: [
        {
          id: "please-may-i",
          text: "Ask “please may I?” first",
          encouragement: "The heart of being a good guest. Well done.",
        },
        {
          id: "follow-host",
          text: "Watch and follow how my host does things",
          encouragement: "A smart way to learn a new home’s ways.",
        },
        {
          id: "wait-offered",
          text: "Wait to be offered",
          encouragement:
            "Patient and polite. Your host will likely offer soon.",
        },
      ],
      closing:
        "Ask first the next time you’re a guest. It’s how you honour a home you don’t know yet.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you visit someone’s home, practise asking before you help yourself to anything.",
      parentPrompt:
        "Before a visit, chat with your child about asking first, and let them lead the asking while you are there.",
      completionQuestion:
        "When you were a guest, what did you remember to ask about?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘Ask first’ in others’ homes teaches respect for different rules — and keeps your child comfortable in unfamiliar places.",
      tryThis: [
        "Prep before visits: “Their home might do things differently — we ask first.”",
        "Let your child do the asking; it builds the habit.",
        "Reassure them that if a home feels uncomfortable, they can tell you anytime.",
      ],
    },
    completion: {
      title: "You finished “Being a thoughtful guest”",
      message:
        "You practised asking first in someone else’s home. That is how a guest honours a home they don’t know yet.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "House rules — shoes, food, where children may go — differ widely by family and culture; the lesson treats asking as the universal, not any one rule.",
    ],
    accessibilityNotes: [
      "Watching and following the host offers a route for guests who find asking aloud hard.",
      "The lesson does not require a scripted phrase or eye contact.",
    ],
    safetyNotes: [
      "Children are told they can voice discomfort at a home and tell a trusted adult, keeping guest manners under safety.",
    ],
    version: 1,
  },

  {
    id: "welcome-home-every-home-its-ways",
    slug: "welcome-home-every-home-its-ways",
    moduleId,
    order: 4,
    title: "Every home has its own ways",
    description:
      "Shoes off at the door? Grandparents greeted first? Different homes do things differently — and none is wrong.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that different homes and families have different customs, all valid.",
      "Recognise that a different way is not a wrong way.",
      "Name a respectful way to respond to a custom that is new to you.",
    ],
    skillArea,
    scenes: [
      {
        id: "shoes-at-the-door",
        title: "Shoes at the door",
        narration:
          "At Amara’s home, there is a neat row of shoes by the door, and everyone takes theirs off before coming in. At your home, people usually keep shoes on. This is new to you.",
        illustrationKey: "home-door",
        prompt: "What could you do?",
        choices: [
          {
            id: "follow-their-way",
            text: "Take your shoes off too, following how Amara’s family does it.",
            consequenceType: "helpful",
            response:
              "You followed the home’s custom without any fuss. Different homes have different ways, and slipping into theirs is a warm, respectful thing to do — no home’s way is the ‘right’ one.",
          },
          {
            id: "call-it-weird",
            text: "Say “that’s weird, we don’t do that” and keep your shoes on.",
            consequenceType: "mixed",
            response:
              "It is new to you, and being surprised is okay — but calling a family’s way ‘weird’ can sting. Different is not wrong; following their custom would have felt much kinder to Amara.",
          },
          {
            id: "ask-about-it",
            text: "Ask, “Should I take my shoes off too?”",
            consequenceType: "needs_context",
            response:
              "A perfect question — you noticed the difference and asked instead of guessing. Asking with curiosity, rather than deciding it is odd, is how you honour a home that does things its own way.",
          },
        ],
      },
    ],
    principle: {
      title: "A different way is not a wrong way",
      body: "Homes and families do things differently — shoes on or off, who is greeted first, when you start eating — and each way makes sense to the people who live it. It matters because ‘we don’t do that’ can easily become ‘that’s wrong’, and following or asking about a custom keeps it kind.",
      points: [
        "Different customs are each family’s way, not a mistake.",
        "Following the home’s way, or asking about it, shows respect.",
        "‘Different’ and ‘wrong’ are not the same thing.",
        "You can honour a custom and still keep your own boundaries — you never have to do something that feels unsafe.",
      ],
    },
    practice: {
      prompt:
        "A home does something differently from yours. How will you respond?",
      helperText: "Pick the respectful response.",
      options: [
        {
          id: "follow-along",
          text: "Follow their way",
          encouragement:
            "Slipping into a home’s custom is warm and respectful.",
        },
        {
          id: "ask-kindly",
          text: "Ask about it with curiosity",
          encouragement: "A curious question honours their way. Lovely.",
        },
        {
          id: "just-notice",
          text: "Notice it without judging it",
          encouragement: "Different isn’t wrong. You’ve got the idea.",
        },
      ],
      closing:
        "When a home does things its own way, follow it or ask about it. Different is just different.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, notice one way a friend’s home or family does something differently from yours — and be curious, not surprised, about it.",
      parentPrompt:
        "Talk about a custom another family has that differs from yours, framing it as ‘their way’, interesting and equal.",
      completionQuestion:
        "What did you notice a different home does its own way?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Children absorb ‘different = wrong’ early. Naming other families’ customs as equal ‘ways’ heads that off.",
      tryThis: [
        "Talk about customs as ‘their way’, never as odd or wrong.",
        "Share your own family’s ways as one option among many.",
        "Model curiosity over judgement when you meet something new.",
      ],
    },
    completion: {
      title: "You finished “Every home has its own ways”",
      message:
        "You practised meeting a new custom with respect. Different homes, different ways — and none of them is wrong.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "This lesson directly teaches that family and cultural customs are parallel, not ranked, and models curiosity over ‘othering’.",
      "Examples (shoes off, greeting elders first) are shown as ordinary variation, never as exotic.",
    ],
    accessibilityNotes: [
      "Asking about a custom is offered for children who prefer clarity to guessing.",
      "The lesson does not require adopting any custom that conflicts with a child’s needs or safety.",
    ],
    safetyNotes: [
      "The lesson makes clear that honouring a custom never means doing something unsafe or uncomfortable, keeping consent intact.",
    ],
    version: 1,
  },

  {
    id: "welcome-home-sharing-your-space",
    slug: "welcome-home-sharing-your-space",
    moduleId,
    order: 5,
    title: "Sharing your space and things",
    description:
      "A guest wants to play with your most special toy. Sharing as a host has a kind middle path.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a host shares, and can also keep a few special things aside.",
      "Name a kind way to handle a guest wanting something precious.",
      "Recognise that sharing and personal boundaries can both be true.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-special-toy",
        title: "The most special toy",
        narration:
          "Your guest, Nora, has spotted your very favourite, most special toy — the one you worry about getting broken. She points to it, hoping to play. You want to be a good host, but this one is precious.",
        illustrationKey: "home-interior",
        prompt: "What could you do?",
        choices: [
          {
            id: "offer-alternative",
            text: "Offer lots of other things to share, and keep the special one for careful times.",
            consequenceType: "helpful",
            response:
              "You shared generously and kept your one precious thing safe. A good host shares — and it is also okay to set aside a few special things. You found the kind middle path.",
          },
          {
            id: "refuse-everything",
            text: "Say no to sharing anything, just in case.",
            consequenceType: "mixed",
            response:
              "Protecting your special toy makes sense. But a host who shares nothing leaves a guest with little to do. Keeping one thing aside while sharing the rest is kinder to you both.",
          },
          {
            id: "share-with-care",
            text: "Let Nora play with it, showing her how to be gentle with it.",
            consequenceType: "needs_context",
            response:
              "Generous — and it can work if you are okay with the risk and Nora is careful. Only share your precious things when you truly want to; it is fine to keep them aside instead.",
          },
        ],
      },
    ],
    principle: {
      title: "Share generously, and keep a few things aside",
      body: "A good host shares — and it is also okay to keep a few precious things safe. It matters because sharing makes a guest welcome, but you do not have to risk something that means a lot to you; both kindness and your own boundaries can be true at once.",
      points: [
        "Sharing lots of things helps a guest feel welcome.",
        "You are allowed to keep a few special things aside — that is not unkind.",
        "Offering other choices is a warm way to say no to one thing.",
        "Your things are yours; a guest does not get to decide what you must share.",
      ],
    },
    practice: {
      prompt:
        "A guest wants your precious thing. How will you handle it kindly?",
      helperText: "Pick the kind middle path you’d take.",
      options: [
        {
          id: "share-lots-else",
          text: "Share lots of other things",
          encouragement: "Generous host, safe treasure. The kind middle path.",
        },
        {
          id: "keep-one-aside",
          text: "Keep the special one aside, gently",
          encouragement: "You’re allowed to. Keeping one thing safe is okay.",
        },
        {
          id: "share-carefully",
          text: "Share it, showing how to be gentle",
          encouragement: "Generous — only if you truly want to. Your choice.",
        },
      ],
      closing:
        "Share generously, and it’s okay to keep a few things safe. Both can be kind.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, practise being a sharing host — share plenty, and it’s okay to put one or two precious things safely aside.",
      parentPrompt:
        "Before a playdate, let your child choose a couple of special toys to put away, and share the rest freely.",
      completionQuestion:
        "What did you share, and did you keep anything special aside?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘Share everything’ can clash with a child’s real attachment and consent. ‘Share lots, keep a few aside’ teaches generosity and boundaries together.",
      tryThis: [
        "Let your child put a few treasures away before guests arrive.",
        "Praise generous sharing and respect the kept-aside items equally.",
        "Never force a child to hand over something precious to keep the peace.",
      ],
    },
    completion: {
      title: "You finished “Sharing your space and things”",
      message:
        "You practised sharing generously while keeping a few things safe. Kindness and your own boundaries can both be true.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson balances hospitality norms with a child’s ownership, respecting families that emphasise sharing strongly.",
    ],
    accessibilityNotes: [
      "Offering alternatives supports children who struggle with all-or-nothing sharing.",
      "The lesson does not require verbal negotiation; showing other choices works too.",
    ],
    safetyNotes: [
      "A child’s right to keep their own things is affirmed, so hosting never overrides consent and ownership.",
    ],
    version: 1,
  },

  {
    id: "welcome-home-needing-a-break",
    slug: "welcome-home-needing-a-break",
    moduleId,
    order: 6,
    title: "When you need a break",
    description:
      "Even a lovely visit can get to be a lot. Needing a quiet moment — as guest or host — is allowed.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that needing a quiet break during a visit is normal and okay.",
      "Name a kind way to ask for a moment to yourself.",
      "Recognise that a guest's or host's need for space should be respected.",
    ],
    skillArea,
    scenes: [
      {
        id: "getting-to-be-a-lot",
        title: "A lot of fun, and a lot",
        narration:
          "The visit has been brilliant — loud games, lots of talking, non-stop. But now your head feels full and buzzy, and you would love a few quiet minutes, even though you are having a good time.",
        illustrationKey: "home-sofa",
        prompt: "What could you do?",
        choices: [
          {
            id: "ask-for-a-moment",
            text: "Say kindly, “I’m having fun — I just need a quiet minute.”",
            consequenceType: "helpful",
            response:
              "You asked for what you needed without it being anyone’s fault. Needing a break from lots of fun is normal, and saying so kindly lets everyone understand — the fun can carry on after.",
          },
          {
            id: "push-through",
            text: "Push through even though your head is buzzing.",
            consequenceType: "mixed",
            response:
              "You can keep going for a while, and sometimes that is okay. But a full, buzzy head often tips into grumpy or tearful. A short quiet break usually helps you enjoy the rest much more.",
          },
          {
            id: "quiet-activity",
            text: "Suggest a calmer thing for a bit, like drawing side by side.",
            consequenceType: "needs_context",
            response:
              "A lovely idea — switching to something calm can give everyone a breather without stopping the visit. It works when your guest or host is up for it too, so it is worth suggesting gently.",
          },
        ],
      },
    ],
    principle: {
      title: "Needing a quiet moment is okay",
      body: "Even a wonderful visit can get to be a lot, and needing a quiet break is normal — for a guest or a host. It matters because a short breather helps you enjoy the rest, and it is far kinder than pushing on until you feel grumpy or overwhelmed.",
      points: [
        "You can love a visit and still need a quiet minute — both are true.",
        "Asking kindly — “I just need a moment” — is not rude; it is honest.",
        "Switching to something calm can give everyone a breather.",
        "A guest’s or host’s need for space should be respected, not taken personally.",
      ],
    },
    practice: {
      prompt:
        "A visit is getting to be a lot. How will you take care of yourself?",
      helperText: "Pick what would help you.",
      options: [
        {
          id: "ask-quiet",
          text: "Ask kindly for a quiet minute",
          encouragement:
            "Honest and kind. A little break helps the rest be fun.",
        },
        {
          id: "calmer-thing",
          text: "Suggest a calmer activity for a bit",
          encouragement: "A gentle breather for everyone. Nice idea.",
        },
        {
          id: "step-aside",
          text: "Step somewhere quiet for a moment",
          encouragement: "Looking after yourself. Completely okay to do.",
        },
      ],
      closing:
        "Needing a break is normal. Ask for a quiet moment kindly, and the fun will still be there.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if a visit or a busy time gets to be a lot, practise asking for a quiet minute kindly.",
      parentPrompt:
        "Give your child permission and a quiet spot to retreat to during busy visits, and honour it without fuss.",
      completionQuestion:
        "When did you need a break, and how did you ask for it?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Recognising and asking for a break prevents meltdowns and models emotional self-care — for guests and hosts alike.",
      tryThis: [
        "Name the option in advance: “If it gets too much, you can have a quiet minute.”",
        "Honour a request for space without treating it as rude.",
        "Model taking your own breaks: “I need five quiet minutes.”",
      ],
    },
    completion: {
      title: "You finished “When you need a break”",
      message:
        "You practised asking for a quiet moment when a visit gets to be a lot. Looking after yourself keeps the fun going.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson respects different family norms about togetherness while affirming everyone’s need for occasional space.",
    ],
    accessibilityNotes: [
      "This lesson directly supports children who become overstimulated, framing a break as a healthy, ordinary need.",
      "It does not require staying socially ‘on’ for the whole visit.",
    ],
    safetyNotes: [
      "A guest’s or host’s need for space is framed as something to respect, reinforcing consent and self-care.",
    ],
    version: 1,
  },

  {
    id: "welcome-home-saying-goodbye",
    slug: "welcome-home-saying-goodbye",
    moduleId,
    order: 7,
    title: "Saying goodbye and thank you",
    description:
      "The visit is ending. A warm goodbye and a thank-you leave everyone glad it happened.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a warm goodbye and thank-you round off a visit kindly.",
      "Name a way to say goodbye as a guest or a host.",
      "Recognise that goodbyes can be given in each person's own way.",
    ],
    skillArea,
    scenes: [
      {
        id: "time-to-go",
        title: "Time to go",
        narration:
          "It is the end of a lovely afternoon at your friend’s home, and your grown-up says it is time to leave. Your friend and their family are by the door to see you off.",
        illustrationKey: "home-door",
        prompt: "What could you do as you go?",
        choices: [
          {
            id: "warm-goodbye-thanks",
            text: "Say “Thank you for having me — I had a great time!” and wave goodbye.",
            consequenceType: "helpful",
            response:
              "A warm thank-you and goodbye leaves everyone glad you came, and glad to have you back. It is a small thing that rounds off a visit and makes the next invitation easy.",
          },
          {
            id: "slip-away",
            text: "Slip out quickly without saying much.",
            consequenceType: "mixed",
            response:
              "Goodbyes can feel awkward, so slipping away is tempting. But a quiet exit can leave your hosts unsure if you enjoyed it. A quick thank-you would let them know it mattered.",
          },
          {
            id: "goodbye-your-way",
            text: "Say goodbye your own way — a wave, a card, or a thumbs up.",
            consequenceType: "needs_context",
            response:
              "A goodbye does not need a speech. A wave, a thumbs up, or a little card all say “thanks, I had fun”. Nora often says goodbye with a wave, and it lands warmly every time.",
          },
        ],
      },
    ],
    principle: {
      title: "A warm goodbye rounds off a visit",
      body: "A thank-you and a goodbye at the end tell your hosts the visit mattered and that you would love to come again. It helps because a warm ending leaves everyone glad it happened — and it makes the next invitation easy to give.",
      points: [
        "“Thank you for having me” tells a host their welcome was felt.",
        "A goodbye can be words, a wave, a thumbs up, or a little card.",
        "As a host, seeing your guest off warmly is kind too.",
        "You never have to give a goodbye hug; a wave or a word is a full goodbye.",
      ],
    },
    practice: {
      prompt: "A visit is ending. How will you say goodbye?",
      helperText: "Pick your kind of goodbye.",
      options: [
        {
          id: "thanks-for-having",
          text: "“Thank you for having me!”",
          encouragement: "Warm and simple. Your hosts will be glad you came.",
        },
        {
          id: "wave-goodbye",
          text: "A friendly wave goodbye",
          encouragement: "A wave says plenty. Perfectly warm.",
        },
        {
          id: "little-card",
          text: "Leave or send a little thank-you",
          encouragement: "A made thank-you can be treasured. Thoughtful.",
        },
      ],
      closing:
        "End your next visit with a warm goodbye, your way. It makes everyone glad it happened.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, at the end of a visit, say goodbye and thank you your own way.",
      parentPrompt:
        "Cue the goodbye gently as you leave, and let your child do it their way — words, wave, or card — rather than scripting it.",
      completionQuestion:
        "How did you say goodbye and thank you at the end of your visit?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Warm goodbyes are learned by watching. Model them, and let your child choose their form rather than forcing a hug or a line.",
      tryThis: [
        "Model “thank you for having us” warmly as you leave.",
        "Let a wave or thumbs up count; never force a goodbye hug.",
        "Notice a warm goodbye afterwards: “That was a lovely way to say bye.”",
      ],
    },
    completion: {
      title: "You finished “Saying goodbye and thank you”",
      message:
        "You practised a warm goodbye and thank-you. A kind ending leaves everyone glad the visit happened.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Goodbye customs vary; the lesson keeps them open — words, wave, card — and never fixes on one gesture.",
    ],
    accessibilityNotes: [
      "Non-spoken goodbyes are affirmed as full, mirroring Nora’s wave.",
      "The lesson does not require eye contact or a hug.",
    ],
    safetyNotes: [
      "The lesson states goodbyes never require a hug, reinforcing bodily autonomy.",
    ],
    version: 1,
  },

  {
    id: "welcome-home-review",
    slug: "welcome-home-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "A whole visit, both ways — welcoming, guesting, respecting a home's ways, and a warm goodbye.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together welcoming, guesting, respecting customs, and boundaries.",
      "Choose a guest-or-host move that fits a real moment.",
      "Carry one hosting or guesting skill into a real visit.",
    ],
    skillArea,
    scenes: [
      {
        id: "a-whole-visit",
        title: "The whole visit",
        narration:
          "A new friend is coming to your home, and their family does things a little differently from yours. You want them to feel welcome, to be comfortable, and to have a lovely time from the door to the goodbye.",
        illustrationKey: "home-door",
        prompt: "What is your first move as host?",
        choices: [
          {
            id: "welcome-and-check",
            text: "Welcome them warmly and check what would make them comfy.",
            consequenceType: "helpful",
            response:
              "You welcomed them and put their comfort first — the whole world of hosting in one move. From here, sharing, respecting each other’s ways, and a warm goodbye all come easily.",
          },
          {
            id: "assume-same",
            text: "Assume they like everything exactly the way you do.",
            consequenceType: "mixed",
            response:
              "You mean well, but guessing they are just like you can miss what they actually need. A quick “what would make you comfy?” welcomes the real person, not the one you imagined.",
          },
          {
            id: "ask-their-ways",
            text: "Ask if their family does anything you should know, like shoes off.",
            consequenceType: "needs_context",
            response:
              "A thoughtful, curious start — you are ready to honour their ways as well as share yours. Just pair it with a warm welcome so it feels like care, not a checklist.",
          },
        ],
      },
    ],
    principle: {
      title: "Good visits go both ways",
      body: "Everything in this world is about the same kindness from two sides: welcoming a guest and being a thoughtful one, sharing and keeping boundaries, honouring each home’s ways and your own. It helps because a good visit is something two people make together, and you know how to do your part now.",
      points: [
        "Welcome warmly, and be a thoughtful guest who asks first.",
        "Every home has its own ways; follow them or ask, and share your own.",
        "Share generously, and keep your boundaries — both are kind.",
        "You never have to hug, share a treasure, or skip a needed break; your comfort and consent come first.",
      ],
    },
    practice: {
      prompt:
        "Pick the guest-or-host move you want to take out into the real world this week.",
      helperText: "There is no wrong choice — pick what you want to practise.",
      options: [
        {
          id: "practise-welcoming",
          text: "Welcoming a guest warmly",
          encouragement: "The first minute matters most. Great pick.",
        },
        {
          id: "practise-guesting",
          text: "Being a thoughtful guest",
          encouragement: "Asking first honours a home you don’t know. Lovely.",
        },
        {
          id: "practise-customs",
          text: "Respecting a home’s own ways",
          encouragement:
            "Different is just different. A kind thing to practise.",
        },
        {
          id: "practise-boundaries",
          text: "Sharing while keeping my boundaries",
          encouragement:
            "Kindness and your own limits, both true. Strong choice.",
        },
      ],
      closing:
        "Take your one visiting skill into a real visit this week. You know how to make it go well, both ways.",
    },
    offlineMission: {
      childPrompt:
        "This week, be a great host or a thoughtful guest for real — welcome someone, or visit kindly, honouring each home’s ways.",
      parentPrompt:
        "Give your child a real hosting or visiting role this week and let them lead their part, from welcome to goodbye.",
      completionQuestion: "Were you a host or a guest, and what went well?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "A real visit ties the whole world together. Let your child own their part and debrief warmly afterwards.",
      tryThis: [
        "Give a genuine host or guest role and step back.",
        "Frame other families’ ways as equal, and share yours as one option.",
        "Keep hugs, sharing treasures, and breaks under your child’s consent.",
      ],
    },
    completion: {
      title: "You finished “Guests and Hosts”",
      message:
        "You put it all together — welcoming, guesting, respecting each home’s ways, and warm goodbyes. Take it into a real visit this week.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review centres respect for differing family customs as equal, and models curiosity over assumption.",
      "‘Home’ and family are kept neutral and varied throughout.",
    ],
    accessibilityNotes: [
      "Every visiting skill has a form that does not require hugs, eye contact, or constant socialising.",
      "Asking about customs supports children who prefer clarity to guessing.",
    ],
    safetyNotes: [
      "The closing principle reaffirms that comfort and consent — hugs, treasures, breaks — always come before politeness.",
    ],
    version: 1,
  },
];
