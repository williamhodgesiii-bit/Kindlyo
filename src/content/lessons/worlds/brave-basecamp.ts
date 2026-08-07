import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 11 — Brave Basecamp · module "Safe and Brave".
 *
 * DRAFT CONTENT — SAFETY-CRITICAL. Every lesson is `status: "draft"` and this
 * ENTIRE module REQUIRES review by qualified child-safeguarding specialists
 * before it is ever shown to a child (docs/design/MODULE_WORLDS.md §11; CLAUDE.md
 * "Content status"). Nothing here is validated by a specialist yet.
 *
 * Grounded in the NSPCC "Talk PANTS" approach (body belongs to you; no means no;
 * private is private; talk about secrets that upset you; speak up, someone can
 * help). Following that model, the tone is calm and matter-of-fact, uses no
 * frightening language, names no abuse explicitly, and keeps every scenario to
 * everyday, non-graphic situations (a hug, a tickle, a secret, a photo). Safety
 * choices are never timed and never pressured; this is the calmest module in the
 * app. The "helpful" option is the safe, empowered one; the "mixed" option only
 * ever validates a common feeling (worry, uncertainty) while gently pointing to
 * telling a trusted adult — never a genuinely unsafe action shown as acceptable.
 *
 * Nora's confident "no thank you" and boundary-setting are canon here
 * (docs/design/CHARACTER_BIBLE.md).
 */

const skillArea = "safety" as const;
const moduleId = "brave-basecamp";

export const braveBasecampLessons: Lesson[] = [
  {
    id: "brave-basecamp-your-body-is-yours",
    slug: "brave-basecamp-your-body-is-yours",
    moduleId,
    order: 1,
    title: "Your body belongs to you",
    description:
      "At Basecamp, the very first flag says something important: your body is yours. What does that mean?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that your body belongs to you and you get a say over it.",
      "Recognise that you can choose whether to hug, be tickled, or be touched.",
      "Name that a grown-up you trust can help if someone doesn't listen.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-hello-hug",
        title: "The hello hug",
        narration:
          "At a family gathering, a relative you do not know very well opens their arms for a big hug hello. You would rather not — a wave feels much more comfortable to you. Everyone is watching, smiling.",
        illustrationKey: "basecamp-tent",
        prompt: "What could you do?",
        choices: [
          {
            id: "choose-a-wave",
            text: "Give a friendly wave or a high-five instead of a hug.",
            consequenceType: "helpful",
            response:
              "Your body is yours, so you get to choose. A wave is a warm, polite hello — you do not have to hug anyone to be kind. Choosing what feels right for your body is always allowed.",
          },
          {
            id: "hug-to-please",
            text: "Have the hug even though you don’t want to, so nobody feels bad.",
            consequenceType: "mixed",
            response:
              "It is common to worry about upsetting a grown-up, and that feeling makes sense. But you never have to be hugged to be polite — your body is yours. A grown-up you trust can help everyone understand that a wave is a lovely hello too.",
          },
          {
            id: "ask-grownup-help",
            text: "Look to your own trusted grown-up and let them help.",
            consequenceType: "needs_context",
            response:
              "A great idea — your trusted grown-up can help by saying “she prefers a wave” for you. Asking your safe person to back you up is a strong, sensible thing to do whenever a “no” feels hard to say alone.",
          },
        ],
      },
    ],
    principle: {
      title: "Your body belongs to you",
      body: "Your body is your own, which means you get a say over who touches it and how. It matters because being able to choose — a hug, a wave, or neither — is how you stay comfortable and safe, and a kind grown-up will always respect your choice.",
      points: [
        "You can choose whether to hug, high-five, be tickled, or wave — your body, your say.",
        "You never have to be touched to be polite; a wave is a lovely hello.",
        "A trusted grown-up can help others understand your choice.",
        "This is true with everyone — family, friends, and grown-ups alike.",
      ],
    },
    practice: {
      prompt:
        "Someone wants to greet you with a hug and you’d rather not. What can you do?",
      helperText: "Every one of these is okay. Pick what feels like you.",
      options: [
        {
          id: "offer-wave",
          text: "Offer a wave or high-five instead",
          encouragement: "A warm hello that fits you. Your body, your choice.",
        },
        {
          id: "say-prefer",
          text: "Say “I’d rather not hug, but hello!”",
          encouragement: "Clear and friendly. You can say no to a hug kindly.",
        },
        {
          id: "ask-my-adult",
          text: "Ask my trusted grown-up to help",
          encouragement: "Your safe person can back you up. A strong move.",
        },
      ],
      closing:
        "Your body belongs to you. Choosing how you say hello is always your right.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, talk with your trusted grown-up about how you like to say hello — and know a wave is always okay.",
      parentPrompt:
        "Tell your child, clearly, that they never have to hug or be touched to be polite, and back their choice with relatives this week.",
      completionQuestion:
        "How do you like to say hello, and who will help you if a grown-up forgets?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Never make a child hug or kiss anyone ‘to be polite’. Backing their bodily choice — even with well-meaning relatives — is foundational safeguarding.",
      tryThis: [
        "Offer alternatives: “You can wave, high-five, or hug — your choice.”",
        "Back your child up with relatives: “She prefers a wave.”",
        "Say it plainly: “Your body belongs to you.”",
      ],
    },
    completion: {
      title: "You finished “Your body belongs to you”",
      message:
        "You practised the most important idea at Basecamp: your body is yours, and you get a say. A wave is always a lovely hello.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Greeting customs (hugs, kisses, bows, handshakes) vary by family and culture; the lesson upholds the child’s bodily choice within any of them, without judging the custom.",
      "Requires review with safeguarding specialists to ensure culturally-sensitive, non-frightening delivery.",
    ],
    accessibilityNotes: [
      "Non-touch greetings are affirmed as equal, supporting children who are touch-averse or find physical contact overwhelming.",
      "Eye contact is not required; a wave or a trusted adult’s help suffices.",
    ],
    safetyNotes: [
      "SAFETY-CRITICAL: teaches bodily autonomy (NSPCC PANTS ‘your body belongs to you’). Must be reviewed by qualified child-protection specialists before ship. Keeps to everyday, non-graphic situations; names a trusted adult as backup.",
    ],
    version: 1,
  },

  {
    id: "brave-basecamp-saying-no-and-meaning-it",
    slug: "brave-basecamp-saying-no-and-meaning-it",
    moduleId,
    order: 2,
    title: "Saying no, and meaning it",
    description:
      "A confident 'no' is a superpower. At Basecamp, everyone practises it — because no means no.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that you are allowed to say no, clearly, to things that feel wrong.",
      "Practise a confident no with body and voice.",
      "Recognise that a real no should be respected by others.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-tickle",
        title: "The tickle that’s too much",
        narration:
          "A game of tickling started out fun with an older cousin, but now it is too much and you want it to stop. You are laughing on the outside, but inside you really want it to end.",
        illustrationKey: "basecamp-flag",
        prompt: "What could you do?",
        choices: [
          {
            id: "clear-stop",
            text: "Say clearly, “Stop, I don’t like that,” and move your body away.",
            consequenceType: "helpful",
            response:
              "You used a strong, clear “stop” with your voice and your body — that is exactly how a no works. Even in a game, when you want it to stop, your no should be listened to straight away.",
          },
          {
            id: "keep-laughing",
            text: "Keep laughing and hope they stop on their own.",
            consequenceType: "mixed",
            response:
              "Laughing can happen even when you are not enjoying something — bodies are funny like that. But others cannot read your mind, so a clear “stop” tells them what your laugh cannot. Your no is allowed, even mid-game.",
          },
          {
            id: "no-and-tell",
            text: "Say “stop”, and if they don’t, tell a trusted grown-up.",
            consequenceType: "needs_context",
            response:
              "Just right. A clear “stop” first — and if someone does not listen to your no, that is exactly when to tell a trusted grown-up. Someone who won’t stop when you say stop is the problem, never you.",
          },
        ],
      },
    ],
    principle: {
      title: "No means no",
      body: "You are allowed to say no — with your voice and your body — to anything that feels like too much or feels wrong, even in a game. It matters because your no is how you protect your own comfort, and anyone kind will stop the moment you say it.",
      points: [
        "A strong no uses clear words and your body: “Stop, I don’t like that.”",
        "You can say no even in the middle of a game that started out fun.",
        "A real no should be respected straight away.",
        "If someone won’t stop when you say stop, tell a trusted grown-up — it’s not your fault.",
      ],
    },
    practice: {
      prompt: "Practise your no. Which strong no will you try out loud?",
      helperText: "Practising now makes it easier when it’s real. Pick one.",
      options: [
        {
          id: "stop-dont-like",
          text: "“Stop — I don’t like that.”",
          encouragement: "Clear and strong. That’s a no that gets heard.",
        },
        {
          id: "no-thank-you",
          text: "A firm “no thank you” and step back",
          encouragement: "Voice and body together. Nora would be proud.",
        },
        {
          id: "im-done",
          text: "“I’m done now” and move away",
          encouragement: "Simple and clear. You get to end a game.",
        },
      ],
      closing:
        "Your no is a superpower. Practising it out loud makes it ready when you need it.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, practise your strong ‘no’ out loud with your trusted grown-up, so it’s ready when you need it.",
      parentPrompt:
        "Play a gentle ‘practise your no’ game, and always stop tickling or roughhousing the instant your child says stop.",
      completionQuestion: "What does your strong ‘no’ sound like?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Always stop tickling/roughhousing the instant a child says stop — that’s where they learn their no works. Practise ‘no’ in play, low-stakes.",
      tryThis: [
        "Stop immediately, every time, when they say stop.",
        "Practise a strong ‘no’ together as a game.",
        "Make clear: someone ignoring their ‘no’ is always tell-a-grown-up.",
      ],
    },
    completion: {
      title: "You finished “Saying no, and meaning it”",
      message:
        "You practised a strong, clear no. No means no — and anyone kind will stop the moment you say it.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson upholds a child’s no across all relationships and settings; requires safeguarding review for tone and phrasing.",
    ],
    accessibilityNotes: [
      "A no can be voice, body, or both; the lesson does not require a particular volume or eye contact.",
      "Practising in play suits children who need rehearsal to access a skill under pressure.",
    ],
    safetyNotes: [
      "SAFETY-CRITICAL (NSPCC PANTS ‘no means no’). Must be reviewed by qualified specialists. Notably teaches that laughing does not mean consent, that a no stands mid-game, and that an ignored no is always tell-a-trusted-adult.",
    ],
    version: 1,
  },

  {
    id: "brave-basecamp-safe-and-unsafe-feelings",
    slug: "brave-basecamp-safe-and-unsafe-feelings",
    moduleId,
    order: 3,
    title: "Safe and unsafe feelings",
    description:
      "Your body can give you an 'uh-oh' feeling when something is not right. That feeling is worth trusting.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that an 'uh-oh' feeling is the body's way of noticing something is off.",
      "Recognise that this feeling is worth listening to and telling someone about.",
      "Name what to do when you get an uh-oh feeling.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-uh-oh",
        title: "The uh-oh feeling",
        narration:
          "Sometimes your body feels calm and easy — a safe feeling. Other times your tummy goes tight, your heart beats faster, or something just feels off, even if you can’t say why. That is your uh-oh feeling.",
        illustrationKey: "basecamp-compass",
        prompt: "When you get an uh-oh feeling, what is a good thing to do?",
        choices: [
          {
            id: "listen-and-tell",
            text: "Listen to it, and tell a trusted grown-up about the feeling.",
            consequenceType: "helpful",
            response:
              "That is exactly right. Your uh-oh feeling is your body noticing that something might not be okay. You do not have to know why — just telling a trusted grown-up about the feeling is the smart, brave move.",
          },
          {
            id: "ignore-it",
            text: "Ignore it and hope the feeling goes away.",
            consequenceType: "mixed",
            response:
              "It is common to want a funny feeling to just disappear. But your uh-oh feeling is useful information, like a compass — it is worth paying attention to. Telling a grown-up helps you work out what it means.",
          },
          {
            id: "get-to-safe-adult",
            text: "Move toward a trusted grown-up or a safe place.",
            consequenceType: "needs_context",
            response:
              "A strong instinct — when something feels off, moving toward a safe person or place is a great choice. Your uh-oh feeling is allowed to move your feet, even before you can explain it.",
          },
        ],
      },
    ],
    principle: {
      title: "Your uh-oh feeling is worth trusting",
      body: "Your body can tell you when something is not right, with a tight tummy, a fast heart, or a just-off feeling. It matters because this uh-oh feeling is like a compass pointing to “tell someone” — you do not need to understand it to trust it and share it with a trusted grown-up.",
      points: [
        "A safe feeling is calm and easy; an uh-oh feeling is tight, fast, or just off.",
        "You do not have to know why you feel it — the feeling is enough.",
        "An uh-oh feeling is worth telling a trusted grown-up about.",
        "You can move toward a safe person or place whenever something feels wrong.",
      ],
    },
    practice: {
      prompt: "You get an uh-oh feeling. What will you do?",
      helperText: "Pick the safe, brave move.",
      options: [
        {
          id: "tell-my-adult",
          text: "Tell a trusted grown-up about it",
          encouragement: "The feeling is enough of a reason. Well done.",
        },
        {
          id: "go-to-safe",
          text: "Go to a safe person or place",
          encouragement: "Your feeling can move your feet. Smart and brave.",
        },
        {
          id: "trust-it",
          text: "Trust the feeling even if I can’t explain it",
          encouragement: "Exactly. You don’t need a reason to listen to it.",
        },
      ],
      closing:
        "Your uh-oh feeling is your compass. Trust it, and tell a trusted grown-up.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, talk with your trusted grown-up about your ‘safe’ and ‘uh-oh’ feelings, and agree to tell them about any uh-oh feeling.",
      parentPrompt:
        "Help your child name body signals of ‘safe’ and ‘uh-oh’, and promise you always want to hear about the uh-oh ones.",
      completionQuestion: "What does an uh-oh feeling feel like in your body?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Naming body-based ‘safe’ vs ‘uh-oh’ feelings gives children a pre-verbal safety tool. Promise you always want to hear the uh-oh ones, blame-free.",
      tryThis: [
        "Help them locate feelings in the body: “Where do you feel uh-oh?”",
        "Validate the feeling as information, never as silliness.",
        "Promise: “You can always tell me about an uh-oh feeling.”",
      ],
    },
    completion: {
      title: "You finished “Safe and unsafe feelings”",
      message:
        "You practised trusting your uh-oh feeling and telling a grown-up. Your body’s compass is worth listening to.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson centres a universal, body-based felt sense rather than culturally-specific scenarios; requires safeguarding review.",
    ],
    accessibilityNotes: [
      "Body-based feelings are accessible to non-verbal and pre-literate children and to those who process language slowly.",
      "The lesson does not require explaining or justifying the feeling.",
    ],
    safetyNotes: [
      "SAFETY-CRITICAL: teaches trusting the ‘early warning’ feeling and telling a trusted adult (a widely-used body-safety concept). Must be reviewed by qualified specialists. Kept calm and non-frightening.",
    ],
    version: 1,
  },

  {
    id: "brave-basecamp-secrets-to-never-keep",
    slug: "brave-basecamp-secrets-to-never-keep",
    moduleId,
    order: 4,
    title: "Secrets that should never be kept",
    description:
      "A happy surprise is fun to keep. But a secret that gives you an uh-oh feeling is one to tell.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain the difference between a happy surprise and a secret that feels bad.",
      "Recognise that a secret making you feel worried or scared should be told.",
      "Name that telling such a secret is never getting anyone into trouble wrongly.",
    ],
    skillArea,
    scenes: [
      {
        id: "two-kinds-of-secrets",
        title: "Two kinds of secrets",
        narration:
          "A surprise birthday party is a happy secret — you keep it, and soon everyone is happy and it comes out. But sometimes a secret sits heavy and gives you an uh-oh feeling, especially if someone says you must never, ever tell a grown-up.",
        illustrationKey: "basecamp-tent",
        prompt: "What do you do with a secret that gives you an uh-oh feeling?",
        choices: [
          {
            id: "tell-a-trusted-adult",
            text: "Tell a trusted grown-up, even if you were told to keep it.",
            consequenceType: "helpful",
            response:
              "Exactly right. A happy surprise is fun and comes out soon. But a secret that feels heavy — especially one you are told to never tell — is one to share with a trusted grown-up. You will not be in trouble for telling.",
          },
          {
            id: "keep-because-told",
            text: "Keep it, because you were told you must never tell.",
            consequenceType: "mixed",
            response:
              "Being told to keep a secret can feel very serious, and it makes sense to worry. But no grown-up should ask you to keep a secret that gives you an uh-oh feeling. Telling a trusted grown-up is always allowed — and always okay.",
          },
          {
            id: "check-the-feeling",
            text: "Notice how the secret makes you feel, then decide to tell.",
            consequenceType: "needs_context",
            response:
              "A wise way to sort it out — a happy surprise feels light and exciting; a bad secret feels heavy or scary. If a secret gives you that heavy, uh-oh feeling, that is your sign to tell a trusted grown-up.",
          },
        ],
      },
    ],
    principle: {
      title: "Tell secrets that give you an uh-oh feeling",
      body: "There are happy surprises, which are fun and soon shared, and there are secrets that sit heavy and make you feel worried or scared. It matters because you should never have to keep a secret that upsets you — telling a trusted grown-up is always allowed, and you will never be in trouble for it.",
      points: [
        "A happy surprise is light and comes out soon; a bad secret feels heavy.",
        "A secret that gives you an uh-oh feeling is one to tell a trusted grown-up.",
        "No one should tell you to keep a secret from your safe grown-ups.",
        "You are never in trouble for telling a grown-up about a secret that upset you.",
      ],
    },
    practice: {
      prompt: "A secret gives you a heavy, uh-oh feeling. What will you do?",
      helperText: "Pick the brave, safe move.",
      options: [
        {
          id: "tell-anyway",
          text: "Tell a trusted grown-up, even if I was told not to",
          encouragement:
            "Exactly right. That kind of secret is always okay to tell.",
        },
        {
          id: "notice-feeling",
          text: "Check if it feels heavy or scary",
          encouragement: "The feeling is your clue. Heavy means tell.",
        },
        {
          id: "not-in-trouble",
          text: "Remember I won’t be in trouble for telling",
          encouragement: "True — telling is never wrong. Good to remember.",
        },
      ],
      closing:
        "Happy surprises are fun to keep. A secret that feels bad is always one to tell a trusted grown-up.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, talk with your trusted grown-up about happy surprises and uh-oh secrets — and that you can always tell them anything.",
      parentPrompt:
        "Explain the difference between a surprise and a secret, and promise your child they can always tell you anything, with no trouble ever.",
      completionQuestion:
        "What’s the difference between a happy surprise and a secret you should tell?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Distinguish ‘surprises’ (temporary, happy) from ‘secrets’ (that they’re told never to tell). The promise ‘you can always tell me, blame-free’ is protective.",
      tryThis: [
        "Teach ‘surprise vs secret’ with the party example.",
        "Promise, explicitly and often, they’ll never be in trouble for telling.",
        "Avoid asking children to keep secrets from your co-parent/other safe adults.",
      ],
    },
    completion: {
      title: "You finished “Secrets that should never be kept”",
      message:
        "You practised the difference between a happy surprise and a secret to tell. A secret that feels bad is always one to share.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The surprise/secret distinction is kept universal; requires safeguarding review for phrasing that fits diverse families.",
    ],
    accessibilityNotes: [
      "The heavy/light feeling distinction is accessible without advanced language, using body-based cues.",
      "The lesson does not require the child to articulate the secret’s content.",
    ],
    safetyNotes: [
      "SAFETY-CRITICAL (NSPCC PANTS ‘talk about secrets that upset you’). Must be reviewed by qualified specialists. Teaches that secret-keeping demands are a red flag and that telling is always blame-free.",
    ],
    version: 1,
  },

  {
    id: "brave-basecamp-your-trusted-adults",
    slug: "brave-basecamp-your-trusted-adults",
    moduleId,
    order: 5,
    title: "Your trusted adults",
    description:
      "A trusted adult is a grown-up you can always go to. At Basecamp, you name your own.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain what a trusted adult is and why having some matters.",
      "Name more than one trusted adult a child could go to.",
      "Recognise that if one trusted adult can't help, you go to another.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-trusted-board",
        title: "The trusted-adults board",
        narration:
          "At Basecamp there is a board where you pin the grown-ups you trust — the ones who listen, keep you safe, and never make you feel small for asking. You get to choose who goes on your own board.",
        illustrationKey: "basecamp-board",
        prompt: "How could you build your list of trusted grown-ups?",
        choices: [
          {
            id: "name-several",
            text: "Think of a few grown-ups you trust, in different places — home, school, family.",
            consequenceType: "helpful",
            response:
              "That is exactly it. Having a few trusted grown-ups — one at home, one at school, one in your family — means there is always someone to go to, wherever you are.",
          },
          {
            id: "just-one",
            text: "Pick just one grown-up and rely only on them.",
            consequenceType: "mixed",
            response:
              "Having one trusted grown-up is a wonderful start. But that one person is not always there — at school, or out and about. Having a few, in different places, means you are never stuck without someone to tell.",
          },
          {
            id: "ask-what-makes-trusted",
            text: "Think about what makes a grown-up a trusted one.",
            consequenceType: "needs_context",
            response:
              "A thoughtful question. A trusted grown-up listens, helps keep you safe, and never makes you feel bad for asking or telling. Knowing what to look for helps you choose the right people for your board.",
          },
        ],
      },
    ],
    principle: {
      title: "You can have a team of trusted adults",
      body: "A trusted adult is a grown-up who listens, keeps you safe, and never makes you feel small for asking. It matters because having a few of them — in different places — means that wherever you are and whatever happens, there is always someone you can go to.",
      points: [
        "A trusted adult listens, keeps you safe, and doesn’t make you feel bad for asking.",
        "Having a few, in different places, means there is always someone nearby.",
        "If one trusted adult is not there or can’t help, you go to another.",
        "You get to choose who your trusted adults are.",
      ],
    },
    practice: {
      prompt: "Who could be on your list of trusted grown-ups?",
      helperText: "Think of real people. Pick a kind to start with.",
      options: [
        {
          id: "home-adult",
          text: "A grown-up at home",
          encouragement: "A great first name for your list. Who is it?",
        },
        {
          id: "school-adult",
          text: "A grown-up at school",
          encouragement: "Perfect — someone for when you’re at school.",
        },
        {
          id: "family-adult",
          text: "Another family grown-up",
          encouragement: "Lovely — another safe person for your team.",
        },
      ],
      closing:
        "Build your team of trusted grown-ups. Wherever you are, one of them can help.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, name your trusted grown-ups with your grown-up — a few, in different places — so you always know who to go to.",
      parentPrompt:
        "Help your child name 3–5 trusted adults across settings (home, school, extended family), and confirm each would want to help.",
      completionQuestion: "Who are the trusted grown-ups on your list?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Help your child name several trusted adults across settings — a ‘safety network’ is standard safeguarding practice, so there’s always someone reachable.",
      tryThis: [
        "Build a list of 3–5 trusted adults together, in different places.",
        "Confirm each named adult would genuinely help.",
        "Revisit the list as their world (new school, clubs) grows.",
      ],
    },
    completion: {
      title: "You finished “Your trusted adults”",
      message:
        "You named your team of trusted grown-ups. Wherever you are, there’s always someone you can go to.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson lets each family define its own trusted-adult network (extended family, community, faith, school); requires safeguarding review.",
    ],
    accessibilityNotes: [
      "Naming concrete people supports children who need specific, not abstract, safety plans.",
      "The lesson does not assume a particular family structure.",
    ],
    safetyNotes: [
      "SAFETY-CRITICAL: building a ‘safety network’ of multiple trusted adults is core safeguarding practice. Must be reviewed by qualified specialists; ensure named adults are genuinely safe and available.",
    ],
    version: 1,
  },

  {
    id: "brave-basecamp-asking-for-help",
    slug: "brave-basecamp-asking-for-help",
    moduleId,
    order: 6,
    title: "Asking for help",
    description:
      "Asking for help is brave, not babyish. And if one grown-up doesn't listen, you keep telling until someone does.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that asking for help is a brave and smart thing to do.",
      "Recognise that if one adult doesn't listen, you tell another.",
      "Name that you keep telling until someone helps.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-first-no-listen",
        title: "When the first grown-up is busy",
        narration:
          "Something is worrying you, and you finally get brave enough to tell a grown-up — but they are rushing and say “not now, later.” The worry is still there, sitting heavy in your tummy.",
        illustrationKey: "basecamp-trail",
        prompt: "What could you do?",
        choices: [
          {
            id: "tell-another",
            text: "Tell another trusted grown-up from your list.",
            consequenceType: "helpful",
            response:
              "That is exactly the brave thing to do. If one grown-up is busy or does not hear you, you go to another trusted grown-up — and you keep telling until someone really listens and helps.",
          },
          {
            id: "give-up",
            text: "Decide it is not worth it and stop trying.",
            consequenceType: "mixed",
            response:
              "It is disappointing when a grown-up is too busy, and it makes sense to feel like giving up. But your worry matters, and one busy grown-up does not mean nobody will help. Keep telling — the next person might be just the one.",
          },
          {
            id: "say-its-important",
            text: "Say clearly, “This is important, I need help now.”",
            consequenceType: "needs_context",
            response:
              "A strong move — using clear words like “this is important” helps a busy grown-up understand it cannot wait. And if they still cannot help right then, you can go to another trusted grown-up.",
          },
        ],
      },
    ],
    principle: {
      title: "Keep asking until someone helps",
      body: "Asking for help is one of the bravest, smartest things you can do — never babyish. It matters because you deserve to be heard, and if the first grown-up is too busy or does not listen, that is not the end: you go to another trusted grown-up and keep telling until someone helps.",
      points: [
        "Asking for help is brave and clever, not babyish.",
        "If one grown-up doesn’t listen, tell another from your list.",
        "Clear words — “this is important, I need help” — help grown-ups understand.",
        "Keep telling until someone really listens and helps you.",
      ],
    },
    practice: {
      prompt: "You need help and the first grown-up is busy. What will you do?",
      helperText: "Pick the brave, keep-going move.",
      options: [
        {
          id: "next-adult",
          text: "Tell another trusted grown-up",
          encouragement:
            "Keep going to the next person. That’s the brave thing.",
        },
        {
          id: "say-important",
          text: "Say “this is important, I need help”",
          encouragement: "Clear words help them understand it can’t wait.",
        },
        {
          id: "keep-telling",
          text: "Keep telling until someone listens",
          encouragement: "Exactly. You deserve to be heard. Don’t give up.",
        },
      ],
      closing:
        "Asking for help is brave. If one grown-up doesn’t listen, tell another — keep going until someone helps.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, agree with your grown-up: if you ever need help and the first person is busy, you’ll tell the next trusted grown-up.",
      parentPrompt:
        "Reassure your child that asking for help is always welcome, and that ‘keep telling until someone listens’ is exactly right.",
      completionQuestion:
        "If the first grown-up is too busy, who would you tell next?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘Keep telling until someone listens’ is vital — children often stop after one brush-off. Reassure them persistence is right, and try never to be the brush-off.",
      tryThis: [
        "Teach ‘if one adult can’t help, tell another’.",
        "When your child brings you something, pause and truly listen.",
        "Praise help-seeking as brave and smart, never babyish.",
      ],
    },
    completion: {
      title: "You finished “Asking for help”",
      message:
        "You practised the brave skill of asking — and keeping on asking until someone listens. You always deserve to be heard.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson respects that help-seeking norms vary, while affirming every child’s right to be heard; requires safeguarding review.",
    ],
    accessibilityNotes: [
      "‘Keep telling until someone helps’ is a concrete, rehearsable plan for children who give up easily or are dismissed.",
      "Clear scripted phrases support children who struggle to advocate in the moment.",
    ],
    safetyNotes: [
      "SAFETY-CRITICAL: ‘keep telling until someone listens’ is essential safeguarding, since children are often dismissed once. Must be reviewed by qualified specialists.",
    ],
    version: 1,
  },

  {
    id: "brave-basecamp-safety-before-politeness",
    slug: "brave-basecamp-safety-before-politeness",
    moduleId,
    order: 7,
    title: "Safety comes before politeness",
    description:
      "Sometimes being safe means not being polite — and that's allowed. Safety always wins.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that safety always comes before being polite.",
      "Recognise that a child may be loud, say no, or leave to stay safe.",
      "Name that this is the rule every other lesson bends to.",
    ],
    skillArea,
    scenes: [
      {
        id: "safety-wins",
        title: "When safety wins",
        narration:
          "Almost everything you learn is about being kind and polite. But sometimes staying safe means doing the opposite — being loud, saying no to a grown-up, or leaving without saying a proper goodbye. At Basecamp, safety always wins.",
        illustrationKey: "basecamp-compass",
        prompt: "If something feels unsafe, what are you allowed to do?",
        choices: [
          {
            id: "loud-no-leave",
            text: "Be loud, say no, and leave to get to a safe grown-up — even if it isn’t polite.",
            consequenceType: "helpful",
            response:
              "Exactly right, and this is the most important rule at Basecamp. When something feels unsafe, you are allowed to be loud, say no, and leave — politeness never comes before your safety, ever.",
          },
          {
            id: "stay-polite",
            text: "Stay quiet and polite so you don’t seem rude.",
            consequenceType: "mixed",
            response:
              "Being polite is a good habit most of the time, so it is understandable to worry about seeming rude. But if something feels unsafe, your safety matters far more than good manners. You are allowed to break the politeness rule to stay safe.",
          },
          {
            id: "trust-and-act",
            text: "Trust your uh-oh feeling and get to a trusted grown-up straight away.",
            consequenceType: "needs_context",
            response:
              "A strong, sensible plan — your uh-oh feeling plus getting to a safe grown-up is exactly the right response. You never have to explain or be polite first; getting safe comes before everything else.",
          },
        ],
      },
    ],
    principle: {
      title: "Safety always comes before politeness",
      body: "Nearly everything you learn is about kindness and good manners — but this is the one rule that beats all the others: if something feels unsafe, your safety comes first. It matters because being polite should never stop you from protecting yourself; you are allowed to be loud, say no, and leave.",
      points: [
        "If something feels unsafe, you can be loud, say no, and leave.",
        "You never have to be polite to a grown-up who is doing something that feels wrong.",
        "You don’t have to explain or say a proper goodbye to get safe.",
        "This rule beats every other lesson — safety always wins.",
      ],
    },
    practice: {
      prompt: "Something feels unsafe. What are you allowed to do?",
      helperText: "Every one of these is allowed. Pick one to remember.",
      options: [
        {
          id: "be-loud",
          text: "Be loud and call for help",
          encouragement: "Yes — loud is right when you need help.",
        },
        {
          id: "say-no-leave",
          text: "Say no and leave",
          encouragement: "Allowed, even to a grown-up. Safety first.",
        },
        {
          id: "get-to-safe",
          text: "Get to a trusted grown-up straight away",
          encouragement: "The most important move. Safe first, always.",
        },
      ],
      closing:
        "Safety always beats politeness. You’re allowed to be loud, say no, and leave to stay safe.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, talk with your grown-up about the big rule: if something feels unsafe, safety comes before being polite — always.",
      parentPrompt:
        "Tell your child directly that they may be loud, say no, or leave to stay safe — even with a grown-up — and you’ll always back them.",
      completionQuestion:
        "What are you allowed to do if something feels unsafe, even if it isn’t polite?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Explicitly give permission to be ‘impolite’ for safety — loud, refusing, leaving, even with adults. Children over-learn politeness; this rule must be louder.",
      tryThis: [
        "Say it plainly: “If you feel unsafe, safety beats manners.”",
        "Give permission to say no and leave, even with grown-ups.",
        "Promise you’ll always back a safety choice, never scold it.",
      ],
    },
    completion: {
      title: "You finished “Safety comes before politeness”",
      message:
        "You learned the biggest rule at Basecamp: safety always wins. You’re allowed to be loud, say no, and leave to stay safe.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "This lesson may sit in tension with strong deference-to-elders norms; it must be reviewed with safeguarding specialists to affirm child safety respectfully across cultures.",
    ],
    accessibilityNotes: [
      "Permission to be loud/leave supports children who otherwise freeze under politeness conditioning.",
      "The rule is stated simply and absolutely, without conditions to weigh under stress.",
    ],
    safetyNotes: [
      "SAFETY-CRITICAL: ‘safety over politeness’ is a cornerstone of child protection (CLAUDE.md principle 4). Must be reviewed by qualified specialists. Explicitly overrides all other etiquette lessons in the app.",
    ],
    version: 1,
  },

  {
    id: "brave-basecamp-review",
    slug: "brave-basecamp-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "Plant your own flag at Basecamp: 'I can say no. I can get help.' Everything about staying safe and brave.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together body autonomy, saying no, trusting feelings, and telling a trusted adult.",
      "Choose a safety move that fits a real moment.",
      "Carry one safety skill and a trusted-adult plan into the real world.",
    ],
    skillArea,
    scenes: [
      {
        id: "plant-your-flag",
        title: "Planting your flag",
        narration:
          "At the top of Basecamp, you get to plant your very own flag. On it are the things you have learned: my body is mine, no means no, I can trust my uh-oh feeling, and I can always get help. This is your flag now.",
        illustrationKey: "basecamp-flag",
        prompt:
          "Something gives you an uh-oh feeling. Putting it all together, what do you do?",
        choices: [
          {
            id: "no-leave-tell",
            text: "Say no, get to a trusted grown-up, and tell them — safety before politeness.",
            consequenceType: "helpful",
            response:
              "You put the whole flag together: your body is yours, your no counts, your feeling is trusted, and getting help comes before being polite. That is exactly how you stay safe and brave.",
          },
          {
            id: "wait-and-see",
            text: "Wait and hope the feeling passes before doing anything.",
            consequenceType: "mixed",
            response:
              "It is common to hope a funny feeling will just go away. But your uh-oh feeling is worth acting on — telling a trusted grown-up, even about a feeling you can’t explain, is always the safe and brave choice.",
          },
          {
            id: "go-to-my-adult",
            text: "Go straight to a trusted grown-up from your list.",
            consequenceType: "needs_context",
            response:
              "A strong, simple plan — going straight to a trusted grown-up is exactly right. From there they can help you work out what your uh-oh feeling means and what to do next.",
          },
        ],
      },
    ],
    principle: {
      title: "I can say no. I can get help.",
      body: "Every lesson at Basecamp lives on one flag: my body is mine, no means no, I can trust my uh-oh feeling, and I can always get help — and safety comes before politeness. It matters because you deserve to be safe, and you now know that staying safe is always allowed, always brave, and never your fault.",
      points: [
        "Your body belongs to you, and you can say no — to anyone.",
        "Trust your uh-oh feeling, and tell a trusted grown-up, even if you can’t explain it.",
        "A secret that feels bad is one to tell; you’re never in trouble for telling.",
        "Safety comes before politeness, and you keep asking until someone helps.",
      ],
    },
    practice: {
      prompt:
        "Pick the safe-and-brave skill you want to carry with you always.",
      helperText:
        "There is no wrong choice — pick what feels most important to you.",
      options: [
        {
          id: "practise-my-body",
          text: "My body belongs to me",
          encouragement: "The first flag on the pole. Carry it always.",
        },
        {
          id: "practise-no",
          text: "Saying a strong no",
          encouragement: "Your no is a superpower. Keep it ready.",
        },
        {
          id: "practise-feeling",
          text: "Trusting my uh-oh feeling",
          encouragement: "Your compass. Always worth listening to.",
        },
        {
          id: "practise-help",
          text: "Getting help from a trusted grown-up",
          encouragement: "The bravest skill of all. You’re never alone.",
        },
      ],
      closing:
        "Plant your flag: I can say no, I can get help. Carry it with you everywhere — safety always wins.",
    },
    offlineMission: {
      childPrompt:
        "This week, with your trusted grown-up, go over your flag: my body is mine, no means no, I trust my uh-oh feeling, and I can always get help — and name your trusted grown-ups again.",
      parentPrompt:
        "Revisit the whole safety plan warmly this week: bodily autonomy, no, feelings, secrets, trusted adults, and safety-over-politeness — and reconfirm your child can always come to you, blame-free.",
      completionQuestion:
        "What does your Basecamp flag say, and who are your trusted grown-ups?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "This whole module needs qualified safeguarding review before use. Revisit body-safety messages regularly, calmly, and keep the blame-free ‘tell me anything’ promise front and centre.",
      tryThis: [
        "Revisit the safety plan often, in small, calm doses.",
        "Keep the ‘you can always tell me, no trouble ever’ promise loud.",
        "Re-name trusted adults as your child’s world changes.",
      ],
    },
    completion: {
      title: "You finished “Safe and Brave”",
      message:
        "You planted your flag: I can say no, I can get help. Your body is yours, your feelings count, and safety always wins.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review keeps trusted-adult networks and greeting customs open to each family, and must be reviewed with safeguarding specialists for culturally-respectful delivery.",
    ],
    accessibilityNotes: [
      "The flag summarises the module in four simple, body-based, memorable statements accessible to all children.",
      "Every skill has a form that does not require speech, eye contact, or explaining oneself.",
    ],
    safetyNotes: [
      "SAFETY-CRITICAL REVIEW MODULE. This entire module must be reviewed and approved by qualified child-safeguarding specialists before it is shown to any child. It consolidates NSPCC-PANTS-aligned body-safety concepts: bodily autonomy, ‘no means no’, trusting the early-warning feeling, telling secrets that upset you, a trusted-adult network, persistent help-seeking, and safety over politeness — all delivered calmly, non-graphically, and blame-free.",
    ],
    version: 1,
  },
];
