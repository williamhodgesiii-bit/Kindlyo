import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 3 — Friendship Forest · module "Making Friends".
 *
 * DRAFT CONTENT (see docs/CURRICULUM_PRINCIPLES.md). Not reviewed by a
 * qualified specialist; every lesson stays `status: "draft"`.
 *
 * Friendship here is broad on purpose: joining in, inviting, making room — and
 * also playing quietly side by side, or keeping someone company when they are
 * sad. Parallel play and quiet company count as friendship, not lesser versions
 * of it. Research on joining play favours watching first and easing in over a
 * bare "can I play?"; the lessons teach that. The cast rotates through every
 * role (docs/design/CHARACTER_BIBLE.md): everyone invites, everyone is unsure,
 * everyone sets a boundary at some point.
 *
 * No choice is the "right" one; `consequenceType` records what tends to follow.
 * A "no" to joining is never framed as rejection of the child's worth.
 */

const skillArea = "friendship" as const;
const moduleId = "friendship-forest";

export const friendshipForestLessons: Lesson[] = [
  {
    id: "friendship-forest-asking-to-join",
    slug: "friendship-forest-asking-to-join",
    moduleId,
    order: 1,
    title: "Asking to join in",
    description:
      "Two friends are deep in a game at the stump table. You would love to join. What is the best way in?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that watching a game first helps you find a way to join it.",
      "Name a friendly way to ask to join in.",
      "Recognise that a slow no is not about your worth, and other games are always open.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-stump-game",
        title: "The game at the stump",
        narration:
          "Amara and Jun are building a leaf-and-stone shop at the stump table. They are busy and laughing. You do not know the game yet, but it looks brilliant and you want to be part of it.",
        illustrationKey: "forest-clearing",
        prompt: "What is a good way to join in?",
        choices: [
          {
            id: "watch-then-offer",
            text: "Watch for a moment, then offer: “Can I be a customer?”",
            consequenceType: "helpful",
            response:
              "Watching first told you what the game needed, so your offer fit right in. A job the game already has is one of the easiest ways to be welcomed.",
          },
          {
            id: "take-over",
            text: "Jump in and start changing how the shop works.",
            consequenceType: "mixed",
            response:
              "Your ideas might be great — but arriving and rearranging someone's game can feel like it was taken over. Joining first, then adding ideas, usually goes better.",
          },
          {
            id: "just-ask",
            text: "Ask straight away: “Can I play?”",
            consequenceType: "needs_context",
            response:
              "Asking is honest and often works. Sometimes, though, a busy pair says no simply because the game is full in their heads — watching first and offering a role can make a yes easier.",
          },
        ],
      },
    ],
    principle: {
      title: "Watching first helps you find the way in",
      body: "When you watch a game before you join, you learn what it needs — and asking for a job it already has makes it easy for people to say yes. It helps because you are adding to their game rather than interrupting it.",
      points: [
        "A little watching tells you what part is free to play.",
        "Offering to be part of the game (“can I be a customer?”) is often easier to say yes to than “can I play?”.",
        "If the answer is “not now”, it is about the game being full, not about you — another game is always open.",
        "You never have to change who you are to be let in; the right friends make room for you as you are.",
      ],
    },
    practice: {
      prompt:
        "You want to join a game that is already going. What will you try?",
      helperText: "Pick the way that feels most like you.",
      options: [
        {
          id: "watch-a-bit",
          text: "Watch for a bit to learn the game",
          encouragement:
            "Smart start. Now you will know exactly how to join in.",
        },
        {
          id: "offer-a-role",
          text: "Offer to play a part the game needs",
          encouragement:
            "A job the game already has is one of the easiest ways in.",
        },
        {
          id: "friendly-ask",
          text: "Ask kindly if you can join",
          encouragement: "A friendly ask is honest and often all it takes.",
        },
      ],
      closing:
        "Try watching before you join next time. It makes finding your way in much easier.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, watch a game first, then find a way to join it — or notice someone else trying to join and help them in.",
      parentPrompt:
        "At the park, narrate the strategy quietly: “Let’s watch how their game works, then find a good moment.”",
      completionQuestion: "How did you find your way into the game?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "“Just go ask if you can play” often fails; watching-then-joining is the skill that actually works, and it can be coached from the sidelines.",
      tryThis: [
        "Help your child read the game first: “What do they seem to need?”",
        "If they get a no, name it kindly: “Their game was full — not about you.”",
        "Praise the attempt, not just the success — trying to join is brave.",
      ],
    },
    completion: {
      title: "You finished “Asking to join in”",
      message:
        "You practised watching first and finding your way into a game. That is how a lot of friendships start.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Play customs differ; in some settings children join freely, in others an invitation is expected. The lesson offers a range and does not present one as correct.",
    ],
    accessibilityNotes: [
      "Joining by offering to take a role suits children who find open-ended asking hard.",
      "A no is explained as being about the game, protecting a child from reading rejection into it.",
    ],
    safetyNotes: [
      "The lesson affirms a child never has to change themselves to be included, guarding self-worth and autonomy.",
    ],
    version: 1,
  },

  {
    id: "friendship-forest-inviting-someone-in",
    slug: "friendship-forest-inviting-someone-in",
    moduleId,
    order: 2,
    title: "Inviting someone in",
    description:
      "Someone is standing at the edge of the clearing, watching. A small invitation could change their whole day.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain how being invited feels, and why noticing someone left out matters.",
      "Name a way to invite someone into a game.",
      "Recognise that an invitation is an offer, not a demand — a “no thanks” is fine.",
    ],
    skillArea,
    scenes: [
      {
        id: "at-the-edge",
        title: "Someone at the edge",
        narration:
          "You and Maya are playing a jumping game on the path stones. Theo is standing a little way off, watching, not saying anything. He has not asked to join, and he looks like he is not sure how.",
        illustrationKey: "forest-path",
        prompt: "What could you do?",
        choices: [
          {
            id: "invite-with-role",
            text: "Call over: “Theo, want to be the timer? We need one!”",
            consequenceType: "helpful",
            response:
              "You noticed him and gave him an easy way in. An invitation with a job to do is gentle — Theo can say yes without having to make the first move.",
          },
          {
            id: "keep-playing",
            text: "Keep playing and figure he will ask if he wants to.",
            consequenceType: "mixed",
            response:
              "Some children will ask — but some, like Theo, find asking the hardest part. Waiting for him to make the move might mean he never gets in, even though he wants to.",
          },
          {
            id: "check-first",
            text: "Wave and ask, “Want to join, or watch for now?”",
            consequenceType: "needs_context",
            response:
              "Kind and respectful — you offered and left the choice with him. Some people like to watch before they join, and giving that option is thoughtful, not pushy.",
          },
        ],
      },
    ],
    principle: {
      title: "An invitation can change someone's day",
      body: "When you notice someone on the edge and invite them in, you are telling them they belong here. It helps because the hardest part of joining is often the first move — and you just made it for them.",
      points: [
        "Watch for who is on the edge; being noticed is the first kindness.",
        "An invitation with an easy job — “want to be the timer?” — is gentle to accept.",
        "An invitation is an offer, not an order; “no thanks” or “I’ll just watch” are fine answers.",
        "You never have to include someone who is being unkind to you; inviting is a kindness, not a rule you owe everyone.",
      ],
    },
    practice: {
      prompt: "Someone is on the edge, watching. How will you invite them?",
      helperText: "Choose the invitation you would give.",
      options: [
        {
          id: "offer-a-job",
          text: "Offer them a part in the game",
          encouragement: "An easy yes. A job to do makes joining simple.",
        },
        {
          id: "wave-over",
          text: "Wave them over with a smile",
          encouragement:
            "A warm wave says “there’s room for you” without a word.",
        },
        {
          id: "offer-the-choice",
          text: "Ask if they’d like to join or watch",
          encouragement:
            "Thoughtful — you invite and leave the choice with them.",
        },
      ],
      closing:
        "Look for someone on the edge today, and offer them a way in. It is a small thing that feels big.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, notice someone who is not in the game yet, and invite them in your own way.",
      parentPrompt:
        "Point out the edge-of-the-group child at the park gently, and let your own child decide how to welcome them.",
      completionQuestion: "Who did you invite, and what did they choose to do?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Noticing who is left out is a skill of attention. You can grow it by wondering aloud about others’ feelings.",
      tryThis: [
        "Wonder together: “That child looks like they’d love to join — how could we help?”",
        "Model inviting people yourself, so your child sees it as normal.",
        "Let their invitation be declined gracefully; the kindness was in the offer.",
      ],
    },
    completion: {
      title: "You finished “Inviting someone in”",
      message:
        "You practised noticing someone on the edge and making the first move for them. That is one of the kindest things a friend can do.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "How openly children include newcomers varies by setting; the lesson treats inviting as a kindness rather than a universal rule.",
    ],
    accessibilityNotes: [
      "Theo’s reluctance to ask is portrayed with respect, not as a flaw, and inviting him mirrors real support for shyer or less verbal children.",
      "Offering a watch-first option respects children who observe before joining.",
    ],
    safetyNotes: [
      "The lesson notes a child is never obliged to include someone who is unkind to them, keeping inclusion from overriding their own safety.",
    ],
    version: 1,
  },

  {
    id: "friendship-forest-making-room",
    slug: "friendship-forest-making-room",
    moduleId,
    order: 3,
    title: "Making room for one more",
    description:
      "The circle is already cosy, and one more friend wants in. Can a full circle grow?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a group can almost always make room for one more.",
      "Name a way to widen a circle for a new friend.",
      "Recognise that making room can be a small change, and that fairness includes everyone getting a turn.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-full-circle",
        title: "A cosy circle",
        narration:
          "Four of you are sitting in a tight ring around the stone game, knees almost touching. Nora comes over holding a card that shows she wants to play. There is not much space left in the ring.",
        illustrationKey: "forest-clearing",
        prompt: "What could you do?",
        choices: [
          {
            id: "shuffle-over",
            text: "Shuffle over and open a gap: “Here, come in.”",
            consequenceType: "helpful",
            response:
              "A tiny shuffle and the circle is bigger. Nora is in, and it cost everyone only a few centimetres. Most full circles have room for one more.",
          },
          {
            id: "circle-full",
            text: "Say the circle is full and keep playing.",
            consequenceType: "mixed",
            response:
              "The game keeps going, but Nora is left outside a ring that could easily have stretched. “Full” is often just a habit — the circle usually can grow.",
          },
          {
            id: "new-round",
            text: "Suggest starting the next round so she is in from the start.",
            consequenceType: "needs_context",
            response:
              "A thoughtful idea — bringing her in at a fresh round can feel fairer than mid-game. Just make sure “next round” actually comes soon, so it is not a polite way of saying no.",
          },
        ],
      },
    ],
    principle: {
      title: "A circle can almost always grow",
      body: "Making room means noticing that “full” is usually just a habit, and shuffling over so one more person fits. It helps because belonging is not a limited thing — letting someone in rarely costs the people already there anything real.",
      points: [
        "A small shuffle is often all it takes to widen a circle.",
        "Bringing someone in at a fresh round can feel fair to everyone.",
        "Making room includes making sure the new person gets turns, not just a space to sit.",
        "It is fine to keep a quiet one-on-one sometimes; making room is a kindness, not a rule for every single moment.",
      ],
    },
    practice: {
      prompt: "A friend wants to join your cosy group. How will you make room?",
      helperText: "Pick whatever you would actually do.",
      options: [
        {
          id: "shuffle",
          text: "Shuffle over to open a space",
          encouragement: "A few centimetres, and the circle just grew. Lovely.",
        },
        {
          id: "invite-in",
          text: "Say “come in, there’s room”",
          encouragement: "Simple and warm. Now they know they belong here.",
        },
        {
          id: "fresh-round",
          text: "Start a new round so they’re in from the start",
          encouragement: "A fair, kind idea — just make sure it happens soon.",
        },
      ],
      closing:
        "Next time a circle looks full, try widening it. You will be surprised how much room there is.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, make room for one more person in a group, game, or line — and notice how they get a turn too.",
      parentPrompt:
        "When siblings or friends form a tight group, gently ask, “Is there room to shuffle over?” and let them find it.",
      completionQuestion:
        "How did you make room, and how did it feel for the new person?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "“The circle is full” is a habit children can unlearn. Naming that room usually exists helps them see it.",
      tryThis: [
        "Praise the shuffle: “You made space so easily — that was kind.”",
        "Point out that making room includes sharing turns, not just seats.",
        "Allow that sometimes a quiet pair is okay; this is a kindness, not a rule.",
      ],
    },
    completion: {
      title: "You finished “Making room for one more”",
      message:
        "You practised growing a circle so someone else could belong. Belonging is not a thing that runs out.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson treats inclusion as generous rather than obligatory, respecting that quiet one-on-one friendships are also valid.",
      "Nora joins with a picture card, treated as a full and clear way to ask.",
    ],
    accessibilityNotes: [
      "Making room is framed to include giving turns, which matters for children who need support to take them.",
      "The situation is carried in words; the illustration is decorative.",
    ],
    safetyNotes: [
      "The lesson keeps inclusion from becoming a rule a child owes everyone, preserving their choice of company.",
    ],
    version: 1,
  },

  {
    id: "friendship-forest-side-by-side",
    slug: "friendship-forest-side-by-side",
    moduleId,
    order: 4,
    title: "Playing side by side",
    description:
      "Theo would rather draw quietly than join the loud game. Is sitting near someone, doing your own thing, still being friends?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that quiet, side-by-side company is a real kind of friendship.",
      "Recognise that friends can enjoy different activities in the same space.",
      "Understand that not everyone wants the same amount of noise or togetherness.",
    ],
    skillArea,
    scenes: [
      {
        id: "quiet-and-loud",
        title: "Two kinds of play",
        narration:
          "The big chasing game is loud and brilliant, and most of the group is in it. Theo has found a quiet spot on the log with his notebook. You are not really in the mood for chasing today either.",
        illustrationKey: "forest-log",
        prompt: "What could you do?",
        choices: [
          {
            id: "sit-alongside",
            text: "Sit near Theo and draw your own thing beside him.",
            consequenceType: "helpful",
            response:
              "You two are together without doing the same thing — that is real friendship. Quiet company beside someone can feel just as good as a loud game.",
          },
          {
            id: "pull-him-in",
            text: "Try to pull Theo into the chasing game so he is not “left out.”",
            consequenceType: "mixed",
            response:
              "You mean well. But Theo chose the quiet on purpose — he is not left out, he is content. Deciding he must join can turn a kind idea into a push he did not want.",
          },
          {
            id: "ask-what-he-likes",
            text: "Ask Theo if he would like company or some quiet.",
            consequenceType: "needs_context",
            response:
              "A respectful question. Some people want a friend beside them; some want a little solitude. Asking lets Theo tell you which, instead of you guessing.",
          },
        ],
      },
    ],
    principle: {
      title: "Sitting beside someone is real friendship too",
      body: "Friends do not have to be doing the same thing, or talking, to be together. Playing side by side — each on your own thing, in the same cosy space — is a whole kind of friendship, and it suits some people best.",
      points: [
        "Quiet company counts: drawing beside someone is still being with them.",
        "Friends can like different amounts of noise and togetherness, and that is fine.",
        "Choosing quiet is not the same as being left out; some people prefer it.",
        "Ask what someone wants rather than deciding they need to be pulled into the loud thing.",
      ],
    },
    practice: {
      prompt:
        "A friend is happily doing a quiet thing. How could you be friends right now?",
      helperText: "There is no single right way to be together.",
      options: [
        {
          id: "join-quietly",
          text: "Do my own quiet thing beside them",
          encouragement:
            "Side-by-side company is warm and real. Lovely choice.",
        },
        {
          id: "ask-preference",
          text: "Ask if they want company or quiet",
          encouragement: "Respectful — you let them tell you what they’d like.",
        },
        {
          id: "share-later",
          text: "Give them space and catch up after",
          encouragement:
            "Giving space is kind too. Friendship waits for you both.",
        },
      ],
      closing:
        "You do not have to be loud, or the same, to be good friends. Try quiet company sometime.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, spend some quiet time alongside someone — reading, drawing, or building near each other — without needing to do the same thing.",
      parentPrompt:
        "Model side-by-side time: read your book while your child does their thing nearby, and name it as togetherness.",
      completionQuestion: "What did you each do while you were side by side?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "This lesson protects quieter children from the message that “real” friendship must be loud and constant.",
      tryThis: [
        "Value quiet companionship out loud: “I loved just sitting near you.”",
        "Resist pushing a content child into a louder group — content is not lonely.",
        "Teach asking over assuming: “Do you want company or some space?”",
      ],
    },
    completion: {
      title: "You finished “Playing side by side”",
      message:
        "You practised a gentle kind of friendship: being together without doing the same thing. It counts just as much.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson honours introversion and different social energies rather than treating gregarious play as the standard.",
    ],
    accessibilityNotes: [
      "Side-by-side play is affirming for autistic children and others who find loud group play overwhelming; quiet is presented as a preference, not a deficit.",
      "The lesson does not require speaking or joining a group to succeed.",
    ],
    safetyNotes: [
      "The lesson respects a child’s choice about how much togetherness they want, reinforcing consent in friendship.",
    ],
    version: 1,
  },

  {
    id: "friendship-forest-not-right-now",
    slug: "friendship-forest-not-right-now",
    moduleId,
    order: 5,
    title: "When someone says “not right now”",
    description:
      "You asked to join and heard “not right now.” It stings — but what does it really mean?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that “not right now” is about the moment, not about your worth.",
      "Name a kind way to respond to a no.",
      "Recognise that people are allowed to say no, and so are you.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-no",
        title: "“Not right now”",
        narration:
          "You asked Amara and Jun if you could join their two-person building game, and Amara said, kindly, “Not right now — we’ve nearly finished this bit.” Your tummy does a little flip. You really wanted in.",
        illustrationKey: "forest-clearing",
        prompt: "What could you do?",
        choices: [
          {
            id: "okay-and-elsewhere",
            text: "Say “Okay, maybe later” and find something else for now.",
            consequenceType: "helpful",
            response:
              "You took the no kindly and kept your day going. “Not right now” often turns into “yes” a bit later — and you did not make Amara feel bad for being honest.",
          },
          {
            id: "get-upset",
            text: "Get upset and tell them they are being mean.",
            consequenceType: "mixed",
            response:
              "The sting is real, and it is okay to feel it. But Amara was allowed to say no, and calling it mean can push a “maybe later” into a “no thanks”. Feelings are fine; how we aim them matters.",
          },
          {
            id: "check-later",
            text: "Ask, “Can I check back when you’re done?”",
            consequenceType: "needs_context",
            response:
              "A fair question — it keeps the door open without pushing. Just listen to the answer: if it is still no later, that is allowed too, and another game is always waiting.",
          },
        ],
      },
    ],
    principle: {
      title: "A “no” is about the moment, not about you",
      body: "When someone says “not right now,” it usually means the game is full or the timing is off — not that you are unwanted. It helps to know this because then a no can sting a little without meaning something big and untrue about you.",
      points: [
        "“Not right now” is about the moment; it is rarely about your worth.",
        "People are allowed to say no to playing — and so are you, when you need to.",
        "You can feel disappointed and still be kind about it; both can be true.",
        "If someone is unkind or a game feels bad, you do not have to keep trying to join — find friends who are glad you are there.",
      ],
    },
    practice: {
      prompt:
        "You asked to join and heard “not right now.” What is a kind response?",
      helperText: "Pick the one that fits you.",
      options: [
        {
          id: "maybe-later",
          text: "“Okay, maybe later!”",
          encouragement:
            "Light and kind. You kept the door open for both of you.",
        },
        {
          id: "find-else",
          text: "Find another game for now",
          encouragement: "Your day keeps going. Another game is always open.",
        },
        {
          id: "ask-check-back",
          text: "Ask if you can check back later",
          encouragement:
            "Fair and gentle — just listen to whatever answer comes.",
        },
      ],
      closing:
        "A no can sting and still be okay. Being kind about it keeps the door open for next time.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you hear a “no” or a “not now,” practise taking it kindly — and notice you are still okay.",
      parentPrompt:
        "When your child hears a no this week, help them name the feeling and the truth: “That stung — and it wasn’t about you.”",
      completionQuestion:
        "When did you hear a “not right now,” and how did you handle it?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Handling a no is one of the hardest social skills. The goal is not to squash the feeling but to separate it from “I’m not wanted.”",
      tryThis: [
        "Validate first: “It’s hard to hear no.” Then add: “It wasn’t about you.”",
        "Respect others’ right to say no, so your child learns theirs is respected too.",
        "Notice recovery, not just cheerfulness: “You found another game — that took strength.”",
      ],
    },
    completion: {
      title: "You finished “When someone says ‘not right now’”",
      message:
        "You practised taking a no kindly and staying okay. A no is about the moment — never proof of anything about you.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson upholds everyone’s right to decline, which supports consent norms across cultures and family styles.",
    ],
    accessibilityNotes: [
      "Feelings are validated rather than corrected, which matters for children who feel rejection intensely.",
      "The lesson does not require a spoken response; finding another activity is an equal option.",
    ],
    safetyNotes: [
      "The child’s own right to say no is affirmed alongside others’, and they are told to seek friends who are glad they are there.",
    ],
    version: 1,
  },

  {
    id: "friendship-forest-friend-when-sad",
    slug: "friendship-forest-friend-when-sad",
    moduleId,
    order: 6,
    title: "Being a friend when someone is sad",
    description:
      "Jun is sitting alone, and his usual bounce is gone. How do you be a friend to someone who is upset?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that noticing and staying with a sad friend helps, even without fixing anything.",
      "Name a gentle way to comfort someone.",
      "Recognise that comfort is offered, never forced, and that big problems need a trusted adult.",
    ],
    skillArea,
    scenes: [
      {
        id: "juns-quiet-day",
        title: "Jun’s quiet day",
        narration:
          "Jun is usually the fizziest one in the forest, but today he is sitting on the bench by himself, shoulders low, not playing. Something has made him sad.",
        illustrationKey: "forest-bench",
        prompt: "What could you do?",
        choices: [
          {
            id: "sit-and-ask",
            text: "Sit near him and ask gently, “Do you want to talk, or just company?”",
            consequenceType: "helpful",
            response:
              "You noticed, you came close, and you let him choose. Just being there — without needing to fix it — is often exactly what a sad friend needs.",
          },
          {
            id: "cheer-up-fast",
            text: "Tell him to cheer up and that it is not a big deal.",
            consequenceType: "mixed",
            response:
              "You want him to feel better, which is kind. But “cheer up” can make a sad person feel their feeling is wrong. Sitting with the feeling usually helps more than rushing it away.",
          },
          {
            id: "give-space-tell-adult",
            text: "Give him a bit of space, and let a grown-up know he seems sad.",
            consequenceType: "needs_context",
            response:
              "Sometimes space is the kindest thing, and telling a trusted grown-up is wise — especially if something big is wrong. You do not have to carry a friend’s whole problem alone.",
          },
        ],
      },
    ],
    principle: {
      title: "Being there helps, even without fixing",
      body: "When a friend is sad, you do not need the right words or a solution — you need to notice and stay. It helps because sadness feels lighter with someone beside you, and being allowed to feel it is part of feeling better.",
      points: [
        "Noticing and coming close is already a kindness; you do not have to fix anything.",
        "Ask what they want — to talk, to sit quietly, or to have some space.",
        "“Cheer up” can make a feeling feel wrong; letting the feeling be there usually helps more.",
        "If something big or unsafe is wrong, tell a trusted adult — a friend’s serious problem is not yours to carry alone.",
      ],
    },
    practice: {
      prompt: "A friend is sad. What is a gentle way to be there?",
      helperText: "Pick the way that feels kind to you.",
      options: [
        {
          id: "sit-with",
          text: "Sit quietly beside them",
          encouragement: "Just being there says a lot. Warm and gentle.",
        },
        {
          id: "offer-choice",
          text: "Ask if they want to talk or have quiet",
          encouragement: "You let them choose what they need. Really kind.",
        },
        {
          id: "tell-adult",
          text: "Tell a trusted grown-up they seem sad",
          encouragement:
            "Wise — some sadness needs a grown-up’s help, and that is okay.",
        },
      ],
      closing:
        "You do not need magic words for a sad friend. Noticing and staying is enough.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you notice someone sad, be there for them your own way — and tell a grown-up if it seems big.",
      parentPrompt:
        "Talk about a time you comforted someone by just being there, so your child sees comfort does not require fixing.",
      completionQuestion:
        "How did you show a sad person you were there for them?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Children often think comforting means fixing. Teaching “notice and stay” takes the pressure off and works better.",
      tryThis: [
        "Model sitting with feelings: “You’re sad — I’ll stay right here.”",
        "Avoid “cheer up”; try “that’s hard, I’m with you.”",
        "Teach the limit: some problems are for a trusted adult, and telling one is not tattling.",
      ],
    },
    completion: {
      title: "You finished “Being a friend when someone is sad”",
      message:
        "You practised the quiet superpower of just being there. A sad friend rarely needs fixing — they need company.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Norms about showing and discussing sadness vary; the lesson offers presence, talk, or space so it fits many family styles.",
    ],
    accessibilityNotes: [
      "Comfort without words — sitting nearby — is offered as a full option.",
      "The lesson does not require reading facial expressions alone; the situation is narrated.",
    ],
    safetyNotes: [
      "Children are told to bring big or unsafe problems to a trusted adult, and that they are not responsible for carrying a friend’s serious troubles.",
    ],
    version: 1,
  },

  {
    id: "friendship-forest-a-game-for-everyone",
    slug: "friendship-forest-a-game-for-everyone",
    moduleId,
    order: 7,
    title: "A game everyone can play",
    description:
      "The favourite game leaves Nora out. Could you change it a little so everyone can join?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that changing a game a little can let everyone take part.",
      "Name a way to adapt a game so it includes someone.",
      "Recognise that including people is more fun for everyone, not a favour to one.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-fast-game",
        title: "The running game",
        narration:
          "Everyone loves the fast running-and-catching game. But it moves quickly, and Nora, who is smallest and uses her cards to talk, keeps getting left behind. She has stopped trying to join.",
        illustrationKey: "forest-clearing",
        prompt: "What could you do?",
        choices: [
          {
            id: "tweak-the-rules",
            text: "Suggest a small change so there is a job Nora can do too.",
            consequenceType: "helpful",
            response:
              "A little tweak — maybe Nora holds the “go” card, or there is a safe base — and suddenly everyone is in. Changing a game so it fits more people usually makes it better, not worse.",
          },
          {
            id: "leave-as-is",
            text: "Keep the game exactly as it is; she can watch.",
            consequenceType: "mixed",
            response:
              "The game stays fast and fun for most. But leaving it unchanged means Nora stays out every time — and a game that always leaves the same person out is not really everyone’s game.",
          },
          {
            id: "ask-her-idea",
            text: "Ask Nora how she would like to join in.",
            consequenceType: "needs_context",
            response:
              "The best move of all can be asking the person themselves — they know what would work for them. Inviting Nora to design her own way in respects her instead of deciding for her.",
          },
        ],
      },
    ],
    principle: {
      title: "A small change can let everyone in",
      body: "When a game leaves someone out, you can often change one little rule so it fits them too. It helps because a game everyone can play is more fun for the whole group — including people is not a favour you do for one person, it is better for all of you.",
      points: [
        "One small tweak — a special job, a safe base, a slower round — can open a game up.",
        "The best ideas often come from asking the left-out person what would work for them.",
        "Including people makes a game better for everyone, not worse.",
        "Change games with people, not for them; nobody likes being ‘helped’ without being asked.",
      ],
    },
    practice: {
      prompt:
        "A game keeps leaving one friend out. How could you make it a game for everyone?",
      helperText: "Any of these is a good move.",
      options: [
        {
          id: "add-a-role",
          text: "Add a job that friend can do",
          encouragement:
            "Now there is a way in that fits them. Clever and kind.",
        },
        {
          id: "ask-them",
          text: "Ask them how they’d like to join",
          encouragement: "The best idea of all — they know what would work.",
        },
        {
          id: "slow-round",
          text: "Try a slower or gentler round",
          encouragement: "A small change that can open the game right up.",
        },
      ],
      closing:
        "Look for a game that leaves someone out, and change one small thing. Everyone wins.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, change one small rule in a game so someone who was left out can join — and ask them what they’d like.",
      parentPrompt:
        "Next family game, invite your child to adapt a rule so the youngest or a guest can fully take part.",
      completionQuestion:
        "What did you change, and how did it work for everyone?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Adapting games teaches design-for-everyone thinking — and that inclusion is creative, not a chore.",
      tryThis: [
        "Invite the tweak: “How could we change this so everyone can play?”",
        "Ask the left-out child first, so help never becomes something done to them.",
        "Celebrate the whole group’s fun, so inclusion feels like a win, not charity.",
      ],
    },
    completion: {
      title: "You finished “A game everyone can play”",
      message:
        "You practised changing a game so nobody is left out. A game everyone can play is the most fun kind there is.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Adapting play to include everyone reflects inclusive-play practice and avoids treating any child as the perpetual exception.",
    ],
    accessibilityNotes: [
      "The lesson models adapting activities for a child with different communication and mobility needs (Nora), with her own input central.",
      "‘Change games with people, not for them’ guards against well-meaning but disempowering help.",
    ],
    safetyNotes: [
      "Adaptations are made with the included child’s consent, reinforcing bodily and personal autonomy.",
    ],
    version: 1,
  },

  {
    id: "friendship-forest-review",
    slug: "friendship-forest-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "A new child arrives at the clearing, unsure and alone. Everything you have learned about friendship, in one moment.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together noticing, inviting, making room, and including.",
      "Choose a friendship move that fits a real moment.",
      "Carry one act of friendship into the real world.",
    ],
    skillArea,
    scenes: [
      {
        id: "a-new-arrival",
        title: "A new face",
        narration:
          "A child you have never met is standing at the edge of the clearing, holding the strap of their bag tightly. Your group is mid-game. The new child does not know anyone, and does not know the rules.",
        illustrationKey: "forest-path",
        prompt: "What is your first move?",
        choices: [
          {
            id: "invite-and-explain",
            text: "Wave them over and offer an easy job while you explain the game.",
            consequenceType: "helpful",
            response:
              "You noticed, invited, made room, and helped them in — all the friendship skills at once. The hardest part of a new place just got easier because of you.",
          },
          {
            id: "wait-and-see",
            text: "Carry on and see if they join by themselves.",
            consequenceType: "mixed",
            response:
              "Some children will find their own way in. But a brand-new child, holding their bag tight, may need the first move made for them — and you are just the person to make it.",
          },
          {
            id: "ask-what-they-like",
            text: "Go over and ask what they like to play.",
            consequenceType: "needs_context",
            response:
              "A warm, respectful start — you let them tell you who they are. Just be ready to bring them into the group too, so the chat becomes belonging.",
          },
        ],
      },
    ],
    principle: {
      title: "Friendship is making room for one more",
      body: "Every lesson in this world points the same way: friendship grows when we notice who is on the edge and help them in. Inviting, making room, playing side by side, being there when someone is sad — all of it says the same kind thing: there is space for you here.",
      points: [
        "Notice who is on the edge, and make the first move for them.",
        "Include people by changing a little, and by asking what they would like.",
        "Quiet company and being there for a sad friend are friendship too.",
        "You choose your friends and can say no to unkindness; making room is a kindness, never something forced on you.",
      ],
    },
    practice: {
      prompt:
        "Pick the friendship move you want to take out into the real world this week.",
      helperText: "There is no wrong choice — pick what you want to practise.",
      options: [
        {
          id: "practise-inviting",
          text: "Inviting someone in",
          encouragement:
            "One invitation can change a person’s whole day. Great pick.",
        },
        {
          id: "practise-room",
          text: "Making room for one more",
          encouragement:
            "A small shuffle, a big belonging. Lovely to practise.",
        },
        {
          id: "practise-being-there",
          text: "Being there for someone sad",
          encouragement:
            "A quiet superpower. Someone will be glad you learned it.",
        },
        {
          id: "practise-including",
          text: "Changing a game so everyone can play",
          encouragement: "Inclusion that is creative and fun. Nice one.",
        },
      ],
      closing:
        "Take your one friendship move out into your week. You know how to make room now.",
    },
    offlineMission: {
      childPrompt:
        "This week, welcome someone in — a new child, a left-out friend, or someone on the edge — using what you have learned.",
      parentPrompt:
        "Look for one real chance this week for your child to include someone, and let them lead how they do it.",
      completionQuestion: "Who did you make room for, and what happened?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "The whole world comes down to one habit: noticing who is left out and doing something small about it. That is the mission.",
      tryThis: [
        "Spot real chances together this week and let your child choose the kindness.",
        "Notice the noticing: “You saw they were on their own — that’s the whole thing.”",
        "Keep their right to choose friends intact; inclusion is generous, not owed.",
      ],
    },
    completion: {
      title: "You finished “Making Friends”",
      message:
        "You put it all together — noticing, inviting, making room, and being there. Go make room for someone in the real world this week.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review keeps inclusion generous rather than obligatory, and respects a child’s freedom to choose their friends.",
      "The new child’s background is left open, so the story is about belonging rather than difference.",
    ],
    accessibilityNotes: [
      "Every friendship move in the review has a form that does not require lots of talking, keeping it open to all children.",
      "Quiet company and non-verbal welcome are reaffirmed as full friendship.",
    ],
    safetyNotes: [
      "The closing principle restates a child’s right to say no to unkindness, so inclusion never overrides their safety.",
    ],
    version: 1,
  },
];
