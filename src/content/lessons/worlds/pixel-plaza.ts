import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 10 — Pixel Plaza · module "Kind on Screens".
 *
 * DRAFT CONTENT (docs/CURRICULUM_PRINCIPLES.md). Not specialist-reviewed; every
 * lesson stays `status: "draft"`.
 *
 * Age-appropriate digital citizenship for supervised 5–9s (no child accounts,
 * messaging, or social feeds are implied — CLAUDE.md MVP restrictions). Grounded
 * in research: kindness online, ask permission before sharing a photo, keep
 * private things private, and tell a trusted adult about a message that feels
 * wrong — and it is never the child's fault. Screen rules belong to each family.
 * Tone is never colour-alone: every message pairs with a word (MODULE_WORLDS §10).
 *
 * No choice is "correct"; `consequenceType` records what tends to follow.
 */

const skillArea = "digital" as const;
const moduleId = "pixel-plaza";

export const pixelPlazaLessons: Lesson[] = [
  {
    id: "pixel-plaza-kind-words-on-a-screen",
    slug: "pixel-plaza-kind-words-on-a-screen",
    moduleId,
    order: 1,
    title: "Kind words on a screen",
    description:
      "On the plaza kiosk, words appear without a face or a voice. How do you make sure yours land kindly?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that words on a screen can be read differently without a face or voice.",
      "Name a way to make a screen message kind and clear.",
      "Recognise that there is a real person reading on the other side.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-kiosk-message",
        title: "A message on the kiosk",
        narration:
          "On the plaza’s big shared screen, you want to send a message to Jun about his drawing. But on a screen there is no smile and no voice to hear — just the words. You could type “that’s different.”",
        illustrationKey: "plaza-kiosk",
        prompt: "How could you make your message land kindly?",
        choices: [
          {
            id: "clear-and-kind",
            text: "Type something clearly warm: “I really like the colours in your drawing!”",
            consequenceType: "helpful",
            response:
              "With no face or voice, warm words do the work. A clear, kind message cannot be read the wrong way — Jun knows exactly that you meant something nice.",
          },
          {
            id: "ambiguous-message",
            text: "Type “that’s different” and let Jun work out what you mean.",
            consequenceType: "mixed",
            response:
              "You might mean “interesting and cool”. But on a screen, without your smile, “that’s different” could land as “that’s weird”. When there is no face to show you are kind, the words have to.",
          },
          {
            id: "add-a-label",
            text: "Add a friendly word or a clear happy note so your tone shows.",
            consequenceType: "needs_context",
            response:
              "A good idea — a warm word makes your tone clear, since a picture alone can be misread. Pairing your message with plain kind words means nobody has to guess how you meant it.",
          },
        ],
      },
    ],
    principle: {
      title: "On a screen, the words carry your kindness",
      body: "When you write to someone on a screen, they cannot see your smile or hear your voice — so your words have to carry all the kindness. It matters because a real person is reading, and a warm, clear message makes sure they feel what you meant, not something you did not.",
      points: [
        "Without a face or voice, a message can be read differently than you meant.",
        "Clear, warm words make your kindness impossible to miss.",
        "There is always a real person reading on the other side.",
        "Show tone with words, not just a picture or colour — so nobody has to guess.",
      ],
    },
    practice: {
      prompt:
        "You’re sending someone a message. How will you make it land kindly?",
      helperText: "Pick the kind, clear choice.",
      options: [
        {
          id: "warm-words",
          text: "Use clear, warm words",
          encouragement: "Warm words can’t be misread. That’s the skill.",
        },
        {
          id: "reread-first",
          text: "Read it back before I send",
          encouragement:
            "A quick re-read catches anything that could sting. Smart.",
        },
        {
          id: "picture-a-person",
          text: "Picture the real person reading it",
          encouragement: "Remembering there’s a person keeps messages kind.",
        },
      ],
      closing:
        "On a screen, your words carry your kindness. Make them warm and clear.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you send a message (with your grown-up), make it clearly kind — and picture the real person reading it.",
      parentPrompt:
        "When helping your child message a relative, talk through the words together: “How will Grandma read this?”",
      completionQuestion: "What kind message did you send, and who was it for?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Digital kindness starts on shared, supervised screens. Talking through messages together teaches tone-without-a-face early.",
      tryThis: [
        "Co-write messages to family and discuss how they’ll be read.",
        "Point out that a screen hides your smile, so words must be warm.",
        "Model kind, clear messaging on your own devices.",
      ],
    },
    completion: {
      title: "You finished “Kind words on a screen”",
      message:
        "You practised making a screen message warm and clear. There’s a real person on the other side — your words carry your kindness.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson keeps digital norms general and family-guided rather than assuming any particular platform or culture of use.",
    ],
    accessibilityNotes: [
      "Tone is conveyed by words, never colour or emoji alone, so meaning does not rely on visual cues — the core a11y rule of this world.",
      "The lesson does not assume a child has their own device; it centres supervised, shared use.",
    ],
    safetyNotes: [
      "Messaging is framed as supervised and with a grown-up, consistent with no independent child messaging.",
    ],
    version: 1,
  },

  {
    id: "pixel-plaza-asking-before-you-share",
    slug: "pixel-plaza-asking-before-you-share",
    moduleId,
    order: 2,
    title: "Asking before you share a photo",
    description:
      "You took a funny photo of your friend. Before it goes anywhere, there's one important question to ask.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a photo of someone should be shared only with their permission.",
      "Name the question to ask before sharing a picture of someone.",
      "Recognise that people have a say over pictures of themselves.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-funny-photo",
        title: "The funny photo",
        narration:
          "On the plaza screen, you have a really funny photo of Amara pulling a silly face. You want to send it to everyone because it would make them laugh. Amara has not seen it yet.",
        illustrationKey: "plaza-screen",
        prompt: "What could you do?",
        choices: [
          {
            id: "ask-permission",
            text: "Ask Amara first: “Is it okay if I share this photo of you?”",
            consequenceType: "helpful",
            response:
              "You asked before sharing, which is exactly right. A picture of Amara is a bit hers too — checking “do we have permission?” means she gets a say in where her face goes.",
          },
          {
            id: "share-anyway",
            text: "Send it to everyone — it is just a funny picture.",
            consequenceType: "mixed",
            response:
              "It might be a great laugh. But Amara might feel silly or upset seeing her face sent around without warning. A picture of someone is partly theirs, and once it is out, it is hard to take back.",
          },
          {
            id: "ask-and-respect",
            text: "Ask, and if she says no, keep it just for the two of you.",
            consequenceType: "needs_context",
            response:
              "Perfect — you asked and you are ready to honour her answer. “No” means it stays private, and that is completely fair. People get to decide where pictures of themselves go.",
          },
        ],
      },
    ],
    principle: {
      title: "Ask before you share someone's picture",
      body: "Before a photo of someone goes anywhere, the question is “do we have permission from everyone in it?” It matters because a picture of a person is partly theirs — they have a say in where their face goes, and once something is shared it is very hard to take back.",
      points: [
        "Ask “is it okay to share this?” before sending a photo of someone.",
        "A picture of a person is partly theirs; they get a say.",
        "If they say no, it stays private — and that is fair.",
        "Once a picture is shared it is hard to un-share, so ask first.",
      ],
    },
    practice: {
      prompt:
        "You want to share a photo with someone in it. What will you do first?",
      helperText: "Pick the respectful move.",
      options: [
        {
          id: "ask-first",
          text: "Ask everyone in it first",
          encouragement: "Permission first. That’s exactly right.",
        },
        {
          id: "respect-no",
          text: "Keep it private if they say no",
          encouragement: "Honouring their ‘no’. Completely fair.",
        },
        {
          id: "ask-grownup",
          text: "Check with my grown-up too",
          encouragement: "A grown-up helps decide what’s safe to share. Smart.",
        },
      ],
      closing:
        "Ask before sharing a picture of someone. Their face is partly theirs to decide about.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you want to share a photo of someone, ask them first — and check with your grown-up.",
      parentPrompt:
        "Model photo consent at home: “Shall I send this one of you to Grandad?” so your child sees asking as normal.",
      completionQuestion:
        "When did you ask before sharing a picture, and what did they say?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Photo consent is a foundational digital-consent habit. Model asking before you post or send pictures of your child and others.",
      tryThis: [
        "Ask your child before sharing photos of them, and mean it.",
        "Teach the question: “Do we have permission from everyone in it?”",
        "Keep sharing decisions with a grown-up for now.",
      ],
    },
    completion: {
      title: "You finished “Asking before you share a photo”",
      message:
        "You practised asking permission before sharing a photo of someone. Their face is partly theirs to decide about.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson applies photo consent universally, while acknowledging families set their own rules about sharing images.",
    ],
    accessibilityNotes: [
      "The consent question works regardless of platform or device and does not assume independent posting.",
      "The lesson is carried in plain language, not visual cues.",
    ],
    safetyNotes: [
      "Photo-sharing is kept under grown-up guidance, and consent over one’s own image is taught as a right.",
    ],
    version: 1,
  },

  {
    id: "pixel-plaza-private-things-private",
    slug: "pixel-plaza-private-things-private",
    moduleId,
    order: 3,
    title: "Keeping private things private",
    description:
      "A screen might ask for your name, your address, or where you go to school. Some things stay private.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that some information is private and not for sharing on screens.",
      "Name a kind of information to keep private.",
      "Recognise that checking with a trusted adult before sharing keeps you safe.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-form",
        title: "The screen asks a question",
        narration:
          "A game on the plaza screen pops up a box asking you to type your full name, your home address, and the name of your school to “win a prize”. It looks exciting, and the box is blinking.",
        illustrationKey: "plaza-screen",
        prompt: "What could you do?",
        choices: [
          {
            id: "check-with-adult",
            text: "Stop, and check with a trusted grown-up before typing anything.",
            consequenceType: "helpful",
            response:
              "Exactly right. Your name, address, and school are private, and a screen asking for them is a moment to pause and ask a grown-up. Checking first keeps your private things private.",
          },
          {
            id: "type-it-in",
            text: "Type it all in quickly to get the prize.",
            consequenceType: "mixed",
            response:
              "The prize sounds exciting. But private things — your address, your school — are not for typing into a screen without a grown-up. Real prizes never need to know where you live. Pausing to check is the safe move.",
          },
          {
            id: "close-it",
            text: "Close the box and tell a grown-up what popped up.",
            consequenceType: "needs_context",
            response:
              "A great instinct — closing it and telling a grown-up is exactly the kind of thing to do. You are not in trouble; you spotted something and were smart about it. A grown-up can decide what is safe.",
          },
        ],
      },
    ],
    principle: {
      title: "Some things stay private",
      body: "Your full name, your home address, your school, and passwords are private — not for typing into screens without a trusted grown-up. It matters because private information is yours to protect, and a grown-up can tell the difference between something safe and something that just looks exciting.",
      points: [
        "Private things include your address, your school, and passwords.",
        "A screen asking for private things is a moment to pause and ask a grown-up.",
        "Real prizes and games do not need to know where you live.",
        "You are never in trouble for checking first or telling a grown-up.",
      ],
    },
    practice: {
      prompt: "A screen asks for something private. What will you do?",
      helperText: "Pick the safe move.",
      options: [
        {
          id: "ask-adult",
          text: "Check with a trusted grown-up first",
          encouragement: "Pause and ask. That’s exactly the safe move.",
        },
        {
          id: "keep-private",
          text: "Keep private things to myself",
          encouragement: "Your private info is yours to protect. Well done.",
        },
        {
          id: "tell-what-popped",
          text: "Tell a grown-up what popped up",
          encouragement: "Smart — a grown-up can decide what’s safe.",
        },
      ],
      closing:
        "Keep private things private, and check with a grown-up. You’re never in trouble for asking.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, talk with your grown-up about what counts as private — and agree to always check before typing it anywhere.",
      parentPrompt:
        "Make a short list together of ‘private things’ (name, address, school, passwords) and agree the rule: check with a grown-up first.",
      completionQuestion:
        "What did you and your grown-up decide counts as private?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Keep this concrete and calm: a simple ‘check with me first’ rule protects children without scaring them.",
      tryThis: [
        "Agree a ‘private things’ list and a ‘check first’ rule together.",
        "Reassure them they’re never in trouble for asking or telling.",
        "Model pausing at forms yourself: “I’ll check if this is safe.”",
      ],
    },
    completion: {
      title: "You finished “Keeping private things private”",
      message:
        "You practised pausing and checking before sharing private things. You’re never in trouble for asking a grown-up first.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson keeps ‘private information’ universal while leaving specific screen rules to each family.",
    ],
    accessibilityNotes: [
      "The rule is simple and concrete (‘check first’), supporting all children regardless of reading level.",
      "It does not rely on judging a website’s trustworthiness alone — it routes to a grown-up.",
    ],
    safetyNotes: [
      "Core online-safety lesson: keep private info private, pause on requests for it, and always tell a trusted adult; never in trouble for checking. Flagged for careful delivery.",
    ],
    version: 1,
  },

  {
    id: "pixel-plaza-when-a-message-feels-wrong",
    slug: "pixel-plaza-when-a-message-feels-wrong",
    moduleId,
    order: 4,
    title: "When a message feels wrong",
    description:
      "A message on the screen gives you a yucky, uh-oh feeling. That feeling is worth listening to.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that an uncomfortable feeling about a message is worth telling an adult.",
      "Recognise that a mean or strange message is never the reader's fault.",
      "Name what to do when a message feels wrong.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-uh-oh-message",
        title: "The uh-oh feeling",
        narration:
          "A message appears on the plaza screen that makes your tummy feel funny — maybe it is unkind, or strange, or asks you to keep a secret. You are not sure why, but it does not feel right.",
        illustrationKey: "plaza-kiosk",
        prompt: "What could you do?",
        choices: [
          {
            id: "tell-trusted-adult",
            text: "Tell a trusted grown-up about the message and how it felt.",
            consequenceType: "helpful",
            response:
              "That is exactly the right thing. A message that gives you an uh-oh feeling is one to share with a trusted grown-up. It is not your fault it arrived, and telling someone is the brave, smart move.",
          },
          {
            id: "keep-it-secret",
            text: "Keep it to yourself, in case you get in trouble.",
            consequenceType: "mixed",
            response:
              "You might worry you did something wrong — but you did not. A strange or unkind message is never the reader’s fault. Keeping it secret leaves you carrying the yucky feeling alone; telling a grown-up lifts it.",
          },
          {
            id: "dont-reply-tell",
            text: "Don’t reply, and show a grown-up straight away.",
            consequenceType: "needs_context",
            response:
              "A strong instinct — not replying and showing a grown-up is just right. You do not owe a reply to a message that feels wrong, and a trusted grown-up can help decide what to do next.",
          },
        ],
      },
    ],
    principle: {
      title: "An uh-oh feeling is worth telling",
      body: "If a message gives you a yucky, uh-oh feeling, that feeling is worth listening to — and telling a trusted grown-up. It matters because a mean, strange, or secret-asking message is never your fault, and you should never have to carry that feeling on your own.",
      points: [
        "A message that feels wrong is one to tell a trusted grown-up about.",
        "It is never your fault that an unkind or strange message arrived.",
        "You do not owe anyone a reply, especially to something that feels wrong.",
        "Any message that asks you to keep a secret from your grown-ups is one to tell them about.",
      ],
    },
    practice: {
      prompt: "A message gives you an uh-oh feeling. What will you do?",
      helperText: "Pick the brave, safe move.",
      options: [
        {
          id: "tell-grownup",
          text: "Tell a trusted grown-up",
          encouragement: "The brave, smart move. You never carry it alone.",
        },
        {
          id: "dont-reply",
          text: "Don’t reply to it",
          encouragement:
            "You owe no reply to something that feels wrong. Good.",
        },
        {
          id: "not-my-fault",
          text: "Remember it’s not my fault",
          encouragement: "Exactly right. The message isn’t on you.",
        },
      ],
      closing:
        "If a message feels wrong, tell a trusted grown-up. It’s never your fault, and you’re never alone with it.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, agree with your grown-up: if any message ever gives you an uh-oh feeling, you’ll tell them straight away.",
      parentPrompt:
        "Tell your child clearly: they can always come to you about any message, and they’ll never be in trouble for it.",
      completionQuestion:
        "Who are the trusted grown-ups you’d tell if a message felt wrong?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "The single most protective message: ‘you can always tell me, and you’ll never be in trouble.’ Say it explicitly and often.",
      tryThis: [
        "Promise, clearly, that they can bring you anything, blame-free.",
        "Name the ‘uh-oh feeling’ as a signal worth trusting.",
        "React calmly if they do tell you — calm keeps the door open.",
      ],
    },
    completion: {
      title: "You finished “When a message feels wrong”",
      message:
        "You practised trusting the uh-oh feeling and telling a grown-up. A wrong message is never your fault — and you’re never alone with it.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson keeps ‘trusted grown-ups’ open to each family’s network of safe adults.",
    ],
    accessibilityNotes: [
      "It centres a felt sense (‘uh-oh feeling’) that all children can access, not a rule requiring reading skill.",
      "The response is simple and rehearsable: don’t reply, tell a grown-up.",
    ],
    safetyNotes: [
      "Core safety lesson: trust discomfort, don’t reply, tell a trusted adult, it’s never the child’s fault, and secret-keeping requests are red flags. Flagged for careful, calm, qualified review before ship.",
    ],
    version: 1,
  },

  {
    id: "pixel-plaza-screens-have-an-off-button",
    slug: "pixel-plaza-screens-have-an-off-button",
    moduleId,
    order: 5,
    title: "Screens have an off button",
    description:
      "Screens are fun, and it can be hard to stop. Taking breaks is part of being a good screen-user.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that taking breaks from screens is healthy and normal.",
      "Recognise that it is genuinely hard to stop, and that is by design.",
      "Name a kind way to handle the end of screen time.",
    ],
    skillArea,
    scenes: [
      {
        id: "hard-to-stop",
        title: "Just one more",
        narration:
          "You have been on the plaza screen for a while and it has been brilliant. Your grown-up says it is time to stop, but the game keeps saying “just one more level!” and your body really does not want to put it down.",
        illustrationKey: "plaza-kiosk",
        prompt: "What could you do?",
        choices: [
          {
            id: "finish-and-stop",
            text: "Take a breath, finish the bit you’re on, and turn it off.",
            consequenceType: "helpful",
            response:
              "You noticed the pull and stopped anyway — that is real strength. Screens are made to be hard to leave, so choosing to take a break is a skill, and it leaves time for other good things too.",
          },
          {
            id: "just-one-more",
            text: "Keep going with “just one more” again and again.",
            consequenceType: "mixed",
            response:
              "One more is so tempting — the game is built to make you feel that. But “just one more” can go on forever, and the rest of your day waits. Stopping when it is time is hard, and worth practising.",
          },
          {
            id: "ask-for-warning",
            text: "Next time, ask for a “five minutes left” warning to help you stop.",
            consequenceType: "needs_context",
            response:
              "A clever idea — a heads-up makes stopping much easier than a sudden ‘off’. Planning how screen time ends, with your grown-up, helps your body get ready to put it down.",
          },
        ],
      },
    ],
    principle: {
      title: "Taking a break is a screen skill",
      body: "Screens are designed to be hard to stop, so choosing to take a break is a real skill — not a sign you are bad at it. It matters because your body and your day need other things too, and a warning or a plan makes the stopping easier for everyone.",
      points: [
        "It is genuinely hard to stop; screens are built that way, so it is not just you.",
        "A “five minutes left” warning makes stopping much easier.",
        "Breaks leave room for the other good things in your day.",
        "Screen rules belong to each family; your grown-ups help set them with you.",
      ],
    },
    practice: {
      prompt:
        "Screen time is ending and you don’t want to stop. What will help?",
      helperText: "Pick what would help you.",
      options: [
        {
          id: "warning-first",
          text: "Ask for a few-minutes warning",
          encouragement: "A heads-up makes stopping so much easier. Smart.",
        },
        {
          id: "finish-and-off",
          text: "Finish the bit I’m on, then turn it off",
          encouragement:
            "Noticing the pull and stopping anyway — real strength.",
        },
        {
          id: "plan-next-good-thing",
          text: "Plan a fun thing to do next",
          encouragement:
            "Something to move toward makes the switch easier. Nice.",
        },
      ],
      closing:
        "Taking a break is a screen skill. A warning and a next-good-thing make stopping easier.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, practise ending screen time kindly — ask for a warning, then turn it off when it’s time.",
      parentPrompt:
        "Give a ‘five minutes left’ warning before screen time ends this week, and notice a calm stop with warmth.",
      completionQuestion: "What helped you stop screen time when it was time?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Stopping is hard by design, not defiance. Warnings, routines, and a next activity work better than a sudden ‘off’.",
      tryThis: [
        "Give a clear countdown before screen time ends.",
        "Name the pull honestly: “Games make it hard to stop — you did it.”",
        "Set family screen rules with your child, not just for them.",
      ],
    },
    completion: {
      title: "You finished “Screens have an off button”",
      message:
        "You practised taking a break when it was time. Stopping is hard by design — choosing to is a real skill.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson explicitly leaves screen-time rules to each family rather than prescribing an amount.",
    ],
    accessibilityNotes: [
      "Warnings and transition planning support children who find stopping activities especially hard.",
      "The lesson frames difficulty stopping as design, reducing shame.",
    ],
    safetyNotes: [
      "The lesson supports healthy screen habits without moralising, and keeps rule-setting with families.",
    ],
    version: 1,
  },

  {
    id: "pixel-plaza-saying-no-online",
    slug: "pixel-plaza-saying-no-online",
    moduleId,
    order: 6,
    title: "Saying no on a screen",
    description:
      "On a screen, someone asks you to do something you don't want to. You can say no here too.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that you can decline requests on screens, just like in person.",
      "Recognise that you do not owe anyone a reply or a yes online.",
      "Name what to do if someone keeps pushing after a no.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-online-ask",
        title: "The push on the screen",
        narration:
          "On the plaza screen, someone keeps asking you to send them a photo, or to keep playing when you want to stop, or to say something mean about another kid. You do not want to, but they keep asking.",
        illustrationKey: "plaza-screen",
        prompt: "What could you do?",
        choices: [
          {
            id: "clear-no-online",
            text: "Say no clearly — “No, I don’t want to” — and stop replying if they push.",
            consequenceType: "helpful",
            response:
              "Your no works on a screen just as much as in person. You do not owe anyone a photo, more play, or a mean word — and if they keep pushing after your no, you can stop replying and tell a grown-up.",
          },
          {
            id: "give-in",
            text: "Give in so they will stop asking.",
            consequenceType: "mixed",
            response:
              "Giving in makes the asking stop for now, and that pressure is real. But you did something you did not want to — and someone who keeps pushing past a no is not being a good friend. Your no is allowed to be final.",
          },
          {
            id: "no-and-tell",
            text: "Say no, and tell a grown-up that someone keeps pushing.",
            consequenceType: "needs_context",
            response:
              "A strong move — a clear no plus telling a grown-up. If someone will not accept your no on a screen, that is exactly the kind of thing a trusted grown-up should know about.",
          },
        ],
      },
    ],
    principle: {
      title: "Your no works on a screen too",
      body: "On a screen, just like in person, you can say no — to a photo, to more play, to being mean, to anything you do not want. It matters because you do not owe anyone a yes or even a reply, and someone who keeps pushing past your no is the problem, not you.",
      points: [
        "You can say a clear no on a screen, and you do not owe a reason.",
        "You do not owe anyone a reply, a photo, or a yes.",
        "If someone keeps pushing after your no, you can stop replying.",
        "Someone who will not take no for an answer is a good reason to tell a grown-up.",
      ],
    },
    practice: {
      prompt:
        "Someone on a screen wants something you don’t want to do. How will you say no?",
      helperText: "Pick your no.",
      options: [
        {
          id: "clear-no",
          text: "“No, I don’t want to.”",
          encouragement: "Clear and final. Your no counts online too.",
        },
        {
          id: "stop-replying",
          text: "Stop replying if they keep pushing",
          encouragement: "You owe no reply. Walking away is allowed.",
        },
        {
          id: "no-tell-adult",
          text: "Say no and tell a grown-up",
          encouragement:
            "A clear no plus telling a grown-up — strong and safe.",
        },
      ],
      closing:
        "Your no works on a screen too. You never owe a yes — and pushing past a no is worth telling a grown-up.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, talk with your grown-up about what to do if someone on a screen keeps pushing after you say no.",
      parentPrompt:
        "Agree with your child that they can always say no on screens and come to you if someone won’t accept it.",
      completionQuestion:
        "What will you do if someone on a screen won’t take no for an answer?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘No’ online is the same right as ‘no’ offline. Reinforce that pushing past a no is a red flag to bring to you.",
      tryThis: [
        "Affirm that no needs no reason, on a screen or off it.",
        "Make ‘won’t take no’ an explicit reason to tell you.",
        "Practise walking away from pushy requests together.",
      ],
    },
    completion: {
      title: "You finished “Saying no on a screen”",
      message:
        "You practised a clear no online. You never owe a yes — and someone who won’t accept your no is worth telling a grown-up about.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson upholds a child’s right to refuse on screens regardless of peer or platform pressure.",
    ],
    accessibilityNotes: [
      "A short no and stopping replies are offered, not requiring elaborate justification.",
      "The lesson does not assume a specific app; it teaches a transferable right.",
    ],
    safetyNotes: [
      "Teaches online refusal, that pushing past a no is a warning sign, and to tell a trusted adult; flagged for careful review as safety-adjacent.",
    ],
    version: 1,
  },

  {
    id: "pixel-plaza-kind-to-someone-left-out",
    slug: "pixel-plaza-kind-to-someone-left-out",
    moduleId,
    order: 7,
    title: "Being kind to someone left out",
    description:
      "On screens, it's easy for someone to be left out — and easy to be the one who includes them.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that people can be left out on screens, and including them is kind.",
      "Recognise that joining in on unkindness online hurts a real person.",
      "Name a way to be kind or stand up for someone on a screen.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-left-out-kid",
        title: "Left out on the screen",
        narration:
          "On the plaza screen, a group is sharing a joke that is really about leaving Theo out, and a couple of people have added laughing faces. Theo can see it. You could join in and get a laugh, or do something else.",
        illustrationKey: "plaza-kiosk",
        prompt: "What could you do?",
        choices: [
          {
            id: "be-kind-instead",
            text: "Skip the mean joke and send Theo something friendly instead.",
            consequenceType: "helpful",
            response:
              "You chose kindness over an easy laugh. On a screen it can feel like the mean joke is just words — but Theo is a real person reading it, and your friendly message tells him he is not alone.",
          },
          {
            id: "join-the-joke",
            text: "Add a laughing face too, so you are part of the group.",
            consequenceType: "mixed",
            response:
              "It is tempting to join in so you fit in. But every laughing face lands on Theo, who is really reading this. Being part of leaving someone out hurts them just as much through a screen.",
          },
          {
            id: "tell-and-support",
            text: "Tell a grown-up, and check Theo is okay.",
            consequenceType: "needs_context",
            response:
              "A caring, strong choice — supporting Theo and letting a grown-up know. Unkindness on a screen is worth telling an adult about, and checking on the person makes a real difference.",
          },
        ],
      },
    ],
    principle: {
      title: "There's a real person behind the screen",
      body: "It is easy to leave someone out or pile onto a joke on a screen, because you cannot see their face — but there is always a real person reading. It matters because online unkindness hurts just as much, and one friendly message, or one person who does not join in, can change everything for them.",
      points: [
        "Joining in on leaving someone out hurts a real person, even through a screen.",
        "A friendly message tells someone they are not alone.",
        "Choosing not to add to the unkindness is itself a kind, brave act.",
        "Mean things happening on a screen are worth telling a trusted grown-up about.",
      ],
    },
    practice: {
      prompt:
        "Someone is being left out or teased on a screen. How will you be kind?",
      helperText: "Pick the kind move.",
      options: [
        {
          id: "friendly-message",
          text: "Send them something friendly",
          encouragement: "One kind message says ‘you’re not alone’. Lovely.",
        },
        {
          id: "dont-join",
          text: "Choose not to join the mean joke",
          encouragement: "Not adding to it is brave and kind. Well done.",
        },
        {
          id: "tell-and-check",
          text: "Tell a grown-up and check they’re okay",
          encouragement: "Caring and strong. That really helps.",
        },
      ],
      closing:
        "There’s a real person behind every screen. One kind message can change their whole day.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you see someone left out — on a screen or in person — do one kind thing to include them.",
      parentPrompt:
        "Talk about online kindness this week: “There’s always a real person reading” — and praise choosing kindness over a laugh.",
      completionQuestion:
        "How did you include or support someone who was being left out?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Empathy for the person behind the screen is the heart of digital citizenship. Naming ‘a real person is reading’ makes it concrete.",
      tryThis: [
        "Remind them: “Behind every message is a real person.”",
        "Praise not joining in, and kind upstander choices.",
        "Make telling a grown-up about online meanness normal, not tattling.",
      ],
    },
    completion: {
      title: "You finished “Being kind to someone left out”",
      message:
        "You practised choosing kindness on a screen. There’s a real person behind every message — and yours can change their day.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson keeps online kindness universal and does not assume a particular platform or peer culture.",
    ],
    accessibilityNotes: [
      "The lesson centres a clear empathy principle accessible to all children, not a platform-specific skill.",
      "Kind actions offered include non-verbal support and telling an adult.",
    ],
    safetyNotes: [
      "The lesson names online unkindness as tell-a-grown-up territory and frames upstanding as safe and supported.",
    ],
    version: 1,
  },

  {
    id: "pixel-plaza-review",
    slug: "pixel-plaza-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "Everything about being kind and safe on screens, brought together on the plaza's big mosaic.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together kind messages, permission, privacy, and telling a trusted adult.",
      "Choose a screen-sense move that fits a real moment.",
      "Carry one digital-kindness or safety skill into real screen time.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-mosaic",
        title: "The plaza mosaic",
        narration:
          "The plaza’s big screen is building a mosaic out of everyone’s messages. You want to add a kind one, someone is asking for a photo, a pop-up wants private info, and there is a message that gives you an uh-oh feeling. It is all of screen life at once.",
        illustrationKey: "plaza-screen",
        prompt:
          "The message that feels wrong is bothering you most. What do you do?",
        choices: [
          {
            id: "tell-and-be-kind",
            text: "Don’t reply to the wrong-feeling message, tell a grown-up, and add your kind message to the mosaic.",
            consequenceType: "helpful",
            response:
              "You trusted the uh-oh feeling, told a grown-up, and still chose kindness — the whole world in one move. Being safe and being kind on screens go together, and you did both.",
          },
          {
            id: "ignore-and-scroll",
            text: "Ignore the funny feeling and just keep adding messages.",
            consequenceType: "mixed",
            response:
              "The mosaic is fun, and it is tempting to scroll past the yucky feeling. But an uh-oh feeling is worth listening to — telling a grown-up lifts it, and it is never your fault it arrived.",
          },
          {
            id: "check-photo-permission",
            text: "First check if the person said yes to their photo being shared.",
            consequenceType: "needs_context",
            response:
              "A thoughtful move — permission matters. Just do not let the wrong-feeling message get lost; that one is worth telling a grown-up about too, alongside sorting the photo.",
          },
        ],
      },
    ],
    principle: {
      title: "Kind and safe go together on screens",
      body: "Everything in this world is one idea: on a screen, be kind — there is a real person reading — and be safe — trust your uh-oh feeling and tell a grown-up. It helps because screens connect you to real people, and a little kindness and a little care keep those connections good.",
      points: [
        "Make messages warm and clear, and ask before sharing someone’s photo.",
        "Keep private things private, and check with a grown-up first.",
        "Trust an uh-oh feeling, don’t reply, and tell a trusted grown-up — it’s never your fault.",
        "Your no works on a screen, and screen rules belong to your family.",
      ],
    },
    practice: {
      prompt:
        "Pick the screen-sense skill you want to take into your real screen time this week.",
      helperText: "There is no wrong choice — pick what you want to practise.",
      options: [
        {
          id: "practise-kind",
          text: "Kind, clear messages",
          encouragement: "Warm words for a real person. Great pick.",
        },
        {
          id: "practise-permission",
          text: "Asking before sharing photos",
          encouragement: "Permission first. A key habit.",
        },
        {
          id: "practise-private",
          text: "Keeping private things private",
          encouragement: "Check first, stay safe. Smart choice.",
        },
        {
          id: "practise-tell",
          text: "Telling a grown-up about a wrong-feeling message",
          encouragement: "The most important one of all. Strong choice.",
        },
      ],
      closing:
        "Take your one screen skill into real screen time this week. Kind and safe go together — you know how to do both.",
    },
    offlineMission: {
      childPrompt:
        "This week, use screens with your grown-up and practise being kind and safe — a warm message, asking permission, or telling them about anything that feels wrong.",
      parentPrompt:
        "Do one supervised screen activity together this week and talk through kindness, permission, privacy, and the ‘tell me anything’ rule.",
      completionQuestion:
        "Which screen skill did you practise, and did anything feel worth telling a grown-up?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Supervised, side-by-side screen time is the best classroom here. Reinforce the ‘you can always tell me, blame-free’ rule above all.",
      tryThis: [
        "Use screens together and narrate kind, safe choices.",
        "Repeat the blame-free ‘tell me anything’ promise often.",
        "Set family screen rules jointly, and revisit them.",
      ],
    },
    completion: {
      title: "You finished “Kind on Screens”",
      message:
        "You put it all together — kind messages, permission, privacy, and telling a grown-up. Take kind-and-safe into your real screen time.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review keeps screen rules with families and does not assume any device, platform, or level of access.",
    ],
    accessibilityNotes: [
      "Every skill is conveyed in plain words, not colour or icon alone, honouring this world’s core a11y rule.",
      "Responses are simple and rehearsable, supporting all reading levels.",
    ],
    safetyNotes: [
      "This digital-safety module is flagged for qualified human review before publication; it centres trusting discomfort, telling a trusted adult, blame-free reporting, consent, and privacy, all under grown-up guidance.",
    ],
    version: 1,
  },
];
