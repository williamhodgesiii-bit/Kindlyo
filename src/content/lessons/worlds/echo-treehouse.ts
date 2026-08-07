import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 2 — Echo Treehouse · module "Talking and Listening".
 *
 * DRAFT CONTENT. Written to docs/CURRICULUM_PRINCIPLES.md and the deep-research
 * notes for this content pass, but NOT reviewed by a qualified educator or
 * clinician — which is why every lesson is `status: "draft"` with no
 * `reviewedBy`/`reviewedAt`. Nothing here is validated by a specialist, because
 * it has not been.
 *
 * The cast is the neighborhood's own (docs/design/CHARACTER_BIBLE.md): Theo
 * listens deeply and finds eye contact optional; Jun is growing in waiting for a
 * pause; Nora speaks with picture cards, waves, and short bursts — her cards are
 * a language, never a limitation. Everyone takes every kind of turn across the
 * eight lessons (the rotation rule).
 *
 * Two things to hold if you edit this file:
 * - No choice is the "right" one. `consequenceType` records what tends to
 *   follow, not a verdict. Do not add a best answer.
 * - Eye contact, speaking, and sitting still are never required. Waiting styles
 *   differ by family and both are named as styles, not errors.
 */

const skillArea = "conversation" as const;
const moduleId = "echo-treehouse";

export const echoTreehouseLessons: Lesson[] = [
  {
    id: "echo-treehouse-whole-self-listening",
    slug: "echo-treehouse-whole-self-listening",
    moduleId,
    order: 1,
    title: "Listening with your whole self",
    description:
      "Amara is explaining the treehouse plan. How do you let her know her words are reaching you?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that listening well tells the speaker their words were received.",
      "Name more than one way to show you are listening.",
      "Recognise that showing you listen never requires eye contact or sitting still.",
    ],
    skillArea,
    scenes: [
      {
        id: "amaras-plan",
        title: "Up in the treehouse",
        narration:
          "Amara has a plan for the new rope ladder, and she is telling you all of it, counting the steps on her fingers. You are still holding your collection of leaves from the climb up.",
        illustrationKey: "treehouse-canopy",
      },
      {
        id: "showing-you-listen",
        title: "Amara keeps counting",
        narration:
          "She is on step three of five. She glances at you to check you are still with her.",
        illustrationKey: "two-on-cushions",
        prompt: "How can you show Amara you are listening?",
        choices: [
          {
            id: "turn-and-nod",
            text: "Turn toward her, rest the leaves in your lap, and nod when you follow.",
            consequenceType: "helpful",
            response:
              "Now Amara can tell her words are landing. Facing her and going still with your hands says “I am with you” without you having to say anything.",
          },
          {
            id: "keep-sorting",
            text: "Keep sorting your leaves into big and small while she talks.",
            consequenceType: "mixed",
            response:
              "You might catch every word — some people listen well while their hands are busy. But Amara cannot tell whether you heard, so she may stop, unsure if the plan reached you.",
          },
          {
            id: "listen-eyes-down",
            text: "Listen closely, but look at the floor instead of her face.",
            consequenceType: "needs_context",
            response:
              "This can be real listening. Looking away helps some people concentrate, and you never owe anyone eye contact. A small nod now and then lets Amara know you are still following.",
          },
        ],
      },
    ],
    principle: {
      title: "Listening lets someone know their words reached you",
      body: "When you show you are listening, you are telling the other person something kind: what you said matters, and it got to me. That is what makes them feel heard, and it is why they can keep going instead of wondering whether to bother.",
      points: [
        "Whole-self listening can be turning toward someone, resting busy hands, or a small nod.",
        "You never have to look someone in the eye to listen. Some people listen best while looking away or moving.",
        "A nod, a thumbs up, or a picture card can all show you heard — words are not the only way.",
        "If what someone is saying frightens or upsets you, you can stop listening, walk away, and tell a trusted adult.",
      ],
    },
    practice: {
      prompt:
        "Your turn. Someone is telling you something. Which way of showing you are listening feels right for you?",
      helperText: "There is no single right way. Pick the one you would use.",
      options: [
        {
          id: "face-them",
          text: "Turn your body toward them",
          encouragement:
            "That is a clear signal. Facing someone says you are ready to listen.",
        },
        {
          id: "nod-along",
          text: "Nod when you understand",
          encouragement:
            "A nod is a small, kind way to say “I am with you” without interrupting.",
        },
        {
          id: "still-hands",
          text: "Rest your hands so they are still",
          encouragement:
            "Settling your hands can help you and the other person focus. Nice choice.",
        },
        {
          id: "quiet-mmhm",
          text: "Give a quiet “mm-hm”",
          encouragement:
            "A soft sound lets them know you are following, even from behind them.",
        },
      ],
      closing:
        "Try your way the next time someone tells you something. Listening shows on the outside, and that is what helps them.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, let someone tell you about their day and show them, in your own way, that you are listening.",
      parentPrompt:
        "Give your child one short chance to be the listener today — tell them a small story and let them practise showing they heard.",
      completionQuestion: "How did you show them you were listening?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Children learn listening by being listened to. The most useful thing this week is to show your child what being heard feels like.",
      tryThis: [
        "When your child talks, put your phone down and face them — then name it: “I’m listening.”",
        "Let them show they heard their own way. A nod counts; do not require eye contact.",
        "Notice good listening out loud: “You waited and looked at me — I could tell you heard.”",
      ],
    },
    completion: {
      title: "You finished “Listening with your whole self”",
      message:
        "You practised showing someone their words reached you. That is the start of every good conversation.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "How much eye contact is polite varies widely by culture and family; in some, a child looking away from an adult is the respectful choice. The lesson never treats eye contact as required.",
      "Some children listen best while moving or fidgeting; this is presented as a valid way to listen, not a failure to.",
    ],
    accessibilityNotes: [
      "Eye contact is named as optional throughout, mirroring Theo, whose eye contact is always optional.",
      "Non-spoken ways to show listening — nods, thumbs up, picture cards — are offered as equals.",
      "Feedback reads aloud and does not rely on colour or the illustration.",
    ],
    safetyNotes: [
      "The child is told they may stop listening and leave if what they hear is frightening or upsetting, and tell a trusted adult.",
      "No lesson requires a child to keep listening to something that makes them uncomfortable.",
    ],
    version: 1,
  },

  {
    id: "echo-treehouse-waiting-for-a-pause",
    slug: "echo-treehouse-waiting-for-a-pause",
    moduleId,
    order: 2,
    title: "Waiting for a pause",
    description:
      "You have something exciting to say — and Nora is still finishing her sentence. What do you do with your idea?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a pause is the signal that it is someone else's turn to speak.",
      "Name a way to hold on to an idea until it is your turn.",
      "Recognise that overlapping talk is a family style for some, and that emergencies are different.",
    ],
    skillArea,
    scenes: [
      {
        id: "bursting-idea",
        title: "A bursting idea",
        narration:
          "Nora is telling everyone about the bird she saw, using her picture cards and a few words. Right in the middle, you think of the best name ever for the treehouse. It is so good you can barely keep it in.",
        illustrationKey: "listening-leaves",
        prompt: "What can you do while Nora finishes?",
        choices: [
          {
            id: "wait-for-gap",
            text: "Hold your idea and wait for the little gap when she is done.",
            consequenceType: "helpful",
            response:
              "Nora gets to finish her thought, and your idea is still there when the gap comes. Waiting for the pause means both of you get heard, not just the loudest one.",
          },
          {
            id: "talk-over",
            text: "Say your idea now, over the top — it is too good to wait.",
            consequenceType: "mixed",
            response:
              "Your idea gets out, but Nora loses the end of hers, and she may not go back to it. When two voices race, one usually gets covered up.",
          },
          {
            id: "signal-then-wait",
            text: "Raise your hand a little to show you have something, then wait.",
            consequenceType: "needs_context",
            response:
              "A friendly signal can work — it says “I have something” without cutting in. In some families and classes, warm overlapping is normal too. What matters is that Nora still gets to finish.",
          },
        ],
      },
    ],
    principle: {
      title: "The pause is how a turn gets passed",
      body: "When you wait for the gap at the end of what someone is saying, you are handing the turn back and forth like a ball. It helps because everyone gets to finish a thought — nobody has to shout to be the one who is heard.",
      points: [
        "The little pause after someone speaks is the sign that it is your turn.",
        "You can hold an idea in your head, or give a small hand-raise, until the gap comes.",
        "Some families and cultures talk with warm overlap, finishing each other's sentences — that is a style, not bad manners.",
        "An emergency is different: if someone is hurt or in danger, you may interrupt straight away.",
      ],
    },
    practice: {
      prompt:
        "You have something to say and someone else is still talking. How will you hold your turn?",
      helperText: "Pick whatever would actually help you wait.",
      options: [
        {
          id: "hold-in-head",
          text: "Keep the idea in my head until the pause",
          encouragement:
            "Good plan. Ideas can wait a few seconds and still be just as good.",
        },
        {
          id: "quiet-hand",
          text: "Give a small hand-raise to show I have something",
          encouragement:
            "A quiet signal lets people know you are next without cutting in.",
        },
        {
          id: "hand-on-arm",
          text: "Rest a hand gently near them to show I am waiting",
          encouragement:
            "A gentle signal can say “I am here with something” — kind and patient.",
        },
        {
          id: "picture-card",
          text: "Hold up a card or point to show my turn is coming",
          encouragement:
            "That works well, and it is a real way to take a turn without words.",
        },
      ],
      closing:
        "Waiting for the pause is hard, and it gets easier with practice. Try it once today.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, notice one time when you want to talk and someone else is still speaking. Wait for the pause, then take your turn.",
      parentPrompt:
        "At dinner or in the car, name the pauses: “I’m finished — your turn.” It makes the invisible gap easy to hear.",
      completionQuestion:
        "What did you want to say, and how did it feel to wait for the pause?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Waiting for a pause needs impulse control that is still growing at this age, so it takes lots of gentle practice — not reminders in the moment.",
      tryThis: [
        "Make the gap obvious: pause and say “your turn” so the signal is easy to spot.",
        "If your child cuts in, skip the telling-off and just say “I’ll finish, then it’s you.”",
        "Let warm overlap be okay at home if that is your family’s style — this is about being heard, not silence.",
      ],
    },
    completion: {
      title: "You finished “Waiting for a pause”",
      message:
        "You practised holding on to your turn until the gap. That is how a conversation shares itself out.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Conversational overlap and pause length differ by culture and family: some talk with lively overlap, others leave long gaps. Both are named as styles, never errors.",
      "Nora communicates with picture cards and short bursts; her turn is treated as equal to a spoken one.",
    ],
    accessibilityNotes: [
      "Taking a turn without speech — a hand-raise, pointing, a card — is offered alongside spoken options.",
      "The lesson does not depend on hearing tone; the pause is described in words.",
    ],
    safetyNotes: [
      "The child is explicitly told they may interrupt straight away in an emergency; waiting for a pause never overrides safety.",
    ],
    version: 1,
  },

  {
    id: "echo-treehouse-taking-your-turn",
    slug: "echo-treehouse-taking-your-turn",
    moduleId,
    order: 3,
    title: "Taking your turn to talk",
    description:
      "The talk is fast and happy, and you have not said anything yet. How do you get your idea in?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that your ideas deserve a turn as much as anyone's.",
      "Name a gentle way to enter a busy conversation.",
      "Recognise that passing your turn, or asking for help to get one, are both fine.",
    ],
    skillArea,
    scenes: [
      {
        id: "busy-talk",
        title: "A happy jumble",
        narration:
          "Maya and Jun are trading ideas fast about the treehouse flag. Theo has an idea too, but the talk keeps rolling and he has not found a way in. You have an idea as well.",
        illustrationKey: "treehouse-canopy",
        prompt: "How can you take your turn?",
        choices: [
          {
            id: "pause-and-open",
            text: "Wait for a pause, then say “I have an idea too.”",
            consequenceType: "helpful",
            response:
              "A short opener in the gap makes room for you. Now your idea is in the mix — and Theo can see there was a way in after all.",
          },
          {
            id: "wait-to-be-asked",
            text: "Wait and hope someone asks you what you think.",
            consequenceType: "mixed",
            response:
              "Sometimes a friend will notice and ask — and that is lovely. But busy talk can roll right past, and your good idea might stay unheard when it did not need to.",
          },
          {
            id: "ask-for-space",
            text: "Catch a grown-up's eye, or hold up Glim's wonder card, to help make space.",
            consequenceType: "needs_context",
            response:
              "When a group is loud and fast, asking for a hand to get a turn is a smart move, not a weakness. A grown-up can open a gap so quieter voices get in.",
          },
        ],
      },
    ],
    principle: {
      title: "Your idea is worth a turn",
      body: "Speaking up shares what is in your head so others can enjoy it or build on it. It matters because a group is better when more than the two fastest talkers get heard — including you, and including whoever is still waiting for a way in.",
      points: [
        "A pause plus a short opener — “I have an idea too” — is usually enough to get in.",
        "You can ask a grown-up or a friend to help make space when the talk is fast.",
        "You never have to speak. Passing your turn is always allowed, and staying quiet is not the same as having nothing to say.",
        "Helping someone quieter get their turn is a kind thing to do while you wait for yours.",
      ],
    },
    practice: {
      prompt: "The talk is busy and you want in. How will you take your turn?",
      helperText: "Choose the one that feels like you.",
      options: [
        {
          id: "short-opener",
          text: "Use a short opener in the next gap",
          encouragement:
            "“I have an idea too” is small and friendly, and it works.",
        },
        {
          id: "ask-a-friend",
          text: "Ask a friend to help me get a turn",
          encouragement:
            "Friends can open a gap for you. Asking is a good move.",
        },
        {
          id: "show-a-card",
          text: "Hold up a card or object to show I have something",
          encouragement:
            "A clear signal takes a turn without needing the loudest voice.",
        },
        {
          id: "pass-for-now",
          text: "Pass for now and share later",
          encouragement:
            "Passing is completely fine. Your idea keeps until you are ready.",
        },
      ],
      closing:
        "Getting a word in takes practice. Try your way, and remember passing is a real choice too.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, find one busy conversation and take your turn in it your own way — or help someone quieter take theirs.",
      parentPrompt:
        "In a lively family chat, leave a deliberate gap and glance at your child, so there is an easy opening for them to step into.",
      completionQuestion:
        "Whose turn did you help happen — yours or someone else's?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Some children need the room made a little quieter before they will step in. Making space works better than “speak up”.",
      tryThis: [
        "Open a gap and invite them by name: “Sam, what do you think?”",
        "Never make speaking the price of being included — passing is always okay.",
        "Praise the quiet skill too: “You helped Theo get a turn — that was kind.”",
      ],
    },
    completion: {
      title: "You finished “Taking your turn to talk”",
      message:
        "You practised stepping into a busy conversation — and helping others step in too. Your ideas belong there.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Norms about children speaking up around adults differ by culture; the lesson frames speaking as allowed, never as required, and honours quieter styles.",
    ],
    accessibilityNotes: [
      "Entering a conversation without speech — a card, an object, a signal — is offered as equal.",
      "Passing a turn is presented as a full choice, not a lesser one, for children for whom speaking is hard.",
    ],
    safetyNotes: [
      "No child is pushed to speak; the freedom to pass and to stay quiet is stated plainly.",
    ],
    version: 1,
  },

  {
    id: "echo-treehouse-showing-you-heard",
    slug: "echo-treehouse-showing-you-heard",
    moduleId,
    order: 4,
    title: "Showing you heard",
    description:
      "Maya has just told you a long, fast story. How do you let her know it landed?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that reflecting a little of what you heard shows the speaker they mattered.",
      "Name a way to show you heard, with or without words.",
      "Recognise that a small sign can carry as much as a sentence.",
    ],
    skillArea,
    scenes: [
      {
        id: "mayas-story",
        title: "Maya's kite story",
        narration:
          "Maya talks fast when she is excited, and she has just told you the whole tale of her kite getting stuck in the tallest tree and the neighbour who helped get it down.",
        illustrationKey: "two-on-cushions",
        prompt: "How can you show Maya you really heard her?",
        choices: [
          {
            id: "say-it-back",
            text: "Say one bit back: “So the kite got stuck right at the top?”",
            consequenceType: "helpful",
            response:
              "Saying a piece back proves it reached you, and it gives Maya something to carry on with. She feels heard, not just talked at.",
          },
          {
            id: "cool-then-me",
            text: "Say “cool” and start telling your own story.",
            consequenceType: "mixed",
            response:
              "Your story might be great too. But jumping straight to it can make Maya feel hers was a doorway to yours, rather than something you were interested in.",
          },
          {
            id: "thumbs-and-smile",
            text: "Give a big thumbs up and a smile.",
            consequenceType: "needs_context",
            response:
              "A warm sign can absolutely show you heard — no words needed. If talking is tiring right now, this still tells Maya her story landed with you.",
          },
        ],
      },
    ],
    principle: {
      title: "Showing you heard tells someone they mattered",
      body: "When you reflect back a little of what someone said, you are telling them their words were worth catching. It helps because being heard is one of the best feelings there is — and it costs you only a moment.",
      points: [
        "Saying back one small piece — “so the kite got stuck?” — shows you were really there.",
        "A nod, a thumbs up, or a picture card can show you heard just as well as a sentence.",
        "Asking one little question about their story keeps it going and shows you cared.",
        "You do not have to agree with someone to show you heard them.",
      ],
    },
    practice: {
      prompt:
        "Someone finishes telling you something. How will you show it landed?",
      helperText: "Any of these works. Pick yours.",
      options: [
        {
          id: "reflect-back",
          text: "Say back one thing they told me",
          encouragement:
            "That is a powerful little move — it proves you were listening.",
        },
        {
          id: "ask-one-thing",
          text: "Ask one small question about it",
          encouragement:
            "A gentle question says “tell me more”. Kind and curious.",
        },
        {
          id: "warm-sign",
          text: "Give a nod, a smile, or a thumbs up",
          encouragement:
            "A warm sign carries the message without a single word.",
        },
      ],
      closing:
        "Try showing someone their words reached you today. Watch how it changes their face.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, when someone tells you something, say one little bit of it back to them.",
      parentPrompt:
        "Model it first: say back a piece of what your child tells you (“So the tower fell right at the end?”) so they hear how being heard sounds.",
      completionQuestion:
        "What did you say back, and how did the other person seem?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Reflecting back is a skill adults forget to model. Doing it for your child teaches it faster than explaining it.",
      tryThis: [
        "Catch and return one detail of what they say: “The frog was bright green?”",
        "Let a nod or a thumbs up count when words are hard — it is real listening.",
        "Avoid turning their story into a lesson; just show it landed.",
      ],
    },
    completion: {
      title: "You finished “Showing you heard”",
      message:
        "You practised proving that someone's words reached you. That small move makes people feel really listened to.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Ways of showing you heard vary; some cultures favour quiet acknowledgement, others lively response. The lesson offers a range without ranking them.",
    ],
    accessibilityNotes: [
      "Non-spoken acknowledgement is offered as equal, supporting children for whom speaking is effortful.",
      "The skill does not rely on tone of voice; signs and short phrases are both shown.",
    ],
    safetyNotes: [
      "The lesson notes you can show you heard without agreeing, so a child never feels forced to agree to be polite.",
    ],
    version: 1,
  },

  {
    id: "echo-treehouse-talking-at-once",
    slug: "echo-treehouse-talking-at-once",
    moduleId,
    order: 5,
    title: "When two people talk at once",
    description:
      "You and Jun start talking at the exact same moment, stop, then both start again. Now what?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that talking at once happens to everyone and is easy to untangle.",
      "Name a friendly way to sort out who goes first.",
      "Recognise that offering someone else the first turn is a kind move you will get back.",
    ],
    skillArea,
    scenes: [
      {
        id: "same-moment",
        title: "At the same moment",
        narration:
          "Glim's light flickers as you and Jun both start a sentence together. You both stop. You both start again. You both stop again, and Jun laughs.",
        illustrationKey: "listening-leaves",
        prompt: "What could you do?",
        choices: [
          {
            id: "you-first",
            text: "Smile and say “You go first” — then really listen.",
            consequenceType: "helpful",
            response:
              "The tangle unwinds in a second. Jun takes his turn, and because you offered, he will almost certainly pass it back to you next.",
          },
          {
            id: "both-louder",
            text: "Keep going, a bit louder, until one of you wins.",
            consequenceType: "mixed",
            response:
              "One voice might get through, but nobody really hears either idea, and the loudest-wins habit is not much fun for anyone. There is an easier way out.",
          },
          {
            id: "laugh-and-wave-on",
            text: "Both laugh, and wave each other on at the same time.",
            consequenceType: "needs_context",
            response:
              "This friendly muddle is how lots of families sort it out, and it works fine. Someone just needs to actually go — so you could gently say “okay, you.”",
          },
        ],
      },
    ],
    principle: {
      title: "Talking at once is easy to untangle",
      body: "When two voices start together, offering “you go first” is a tiny gift that costs nothing. It helps because it turns a bump into a turn, and the person you let go first will nearly always let you go next.",
      points: [
        "Talking at the same time happens to everyone — it is not rude, just a tangle.",
        "Offering the first turn untangles it faster than getting louder.",
        "Some families sort it out with a laugh and a wave, and that is fine too.",
        "You will get your turn — going second does not mean going without.",
      ],
    },
    practice: {
      prompt: "You and someone start talking together. What is your move?",
      helperText: "Pick the one you would really do.",
      options: [
        {
          id: "offer-first",
          text: "Say “you go first”",
          encouragement:
            "A generous little move — and your turn comes right after.",
        },
        {
          id: "wave-on",
          text: "Wave them on with a smile",
          encouragement:
            "No words needed. A friendly wave passes the turn along.",
        },
        {
          id: "take-it",
          text: "Say “I’ll go, then you” so it is clear",
          encouragement:
            "Naming the order works too — now you both know what happens next.",
        },
      ],
      closing:
        "Next time you both start at once, try offering the first turn. It is a small kindness people remember.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you and someone talk at once, try being the one who says “you go first.”",
      parentPrompt:
        "When it happens at home, model the untangle out loud: “Oops, we both went — you first, then me.”",
      completionQuestion: "Who went first, and what happened next?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "This is a low-stakes skill with a big payoff — it teaches generosity in tiny doses.",
      tryThis: [
        "Model offering the first turn to your child, then thank them when they do it back.",
        "Keep it light; talking at once is funny, not naughty.",
        "Let a family’s natural overlap be okay — the aim is that everyone gets heard.",
      ],
    },
    completion: {
      title: "You finished “When two people talk at once”",
      message:
        "You practised the easiest fix in any conversation: “you go first.” It turns a bump into a turn.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Comfort with overlap differs by culture and family; lively simultaneous talk is affectionate in many homes. The lesson treats overlap as a style, not a fault.",
    ],
    accessibilityNotes: [
      "A wave or gesture is offered as a way to pass the turn without speaking.",
      "The situation is carried by narration, not by audio of overlapping voices.",
    ],
    safetyNotes: [
      "The lesson gently steers away from a “loudest wins” habit without shaming a child who gets loud.",
    ],
    version: 1,
  },

  {
    id: "echo-treehouse-asking-a-question",
    slug: "echo-treehouse-asking-a-question",
    moduleId,
    order: 6,
    title: "Asking a good question",
    description:
      "Theo says he built something at home, then goes quiet. A good question could open the door.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a question shows interest and gives the other person room to share.",
      "Recognise that open questions keep a conversation going.",
      "Understand that some people need wait-time, and nobody must answer.",
    ],
    skillArea,
    scenes: [
      {
        id: "theo-goes-quiet",
        title: "Theo's something",
        narration:
          "Theo says, “I built something at home this weekend.” Then he stops, the way he does, thinking of his next few words. Theo likes a bit of quiet before he carries on.",
        illustrationKey: "two-on-cushions",
        prompt: "What could you do?",
        choices: [
          {
            id: "open-question",
            text: "Ask an open question: “What did you build?”",
            consequenceType: "helpful",
            response:
              "That opens the door without pushing. “What” and “how” questions give Theo room to say as much or as little as he likes.",
          },
          {
            id: "change-subject",
            text: "Say nothing and start talking about your own weekend.",
            consequenceType: "mixed",
            response:
              "Your weekend matters too. But Theo had just opened a door, and moving straight past it means his something stays unshared when he wanted to tell you.",
          },
          {
            id: "give-wait-time",
            text: "Wait quietly and give him a moment before asking.",
            consequenceType: "needs_context",
            response:
              "For someone like Theo, a little quiet is not empty — it is thinking time. Giving the pause first, then asking gently, is a kind and patient way to help him share.",
          },
        ],
      },
    ],
    principle: {
      title: "A good question makes room for someone",
      body: "Asking about what someone said tells them you are interested and gives them space to say more. It helps because a question is an open door — the other person gets to walk through it at their own pace.",
      points: [
        "Open questions that start with “what” or “how” give people room to answer their own way.",
        "Some people, like Theo, need wait-time — a quiet pause is part of how they talk, not a gap to fill.",
        "One good question is often better than lots of quick ones in a row.",
        "Nobody has to answer. If someone would rather not, “that’s okay” is the kind reply.",
      ],
    },
    practice: {
      prompt:
        "Someone shares a little and you want to hear more. What question will you try?",
      helperText: "Pick a question you might really ask.",
      options: [
        {
          id: "what-question",
          text: "“What was it like?”",
          encouragement: "An open door. They can answer big or small.",
        },
        {
          id: "how-question",
          text: "“How did you do it?”",
          encouragement: "A lovely question — it invites the whole story.",
        },
        {
          id: "favourite-part",
          text: "“What was your favourite part?”",
          encouragement: "Warm and easy to answer. Good pick.",
        },
        {
          id: "give-time-first",
          text: "Wait a moment first, then ask",
          encouragement:
            "Giving time before the question is a patient, kind move.",
        },
      ],
      closing:
        "One good question can open a whole conversation. Try one today, then really listen to the answer.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, ask someone one open question about something they did — and listen to the answer.",
      parentPrompt:
        "Swap “How was your day?” for something openable: “What made you laugh today?” and give them time to answer.",
      completionQuestion: "What did you ask, and what did you find out?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Open questions and wait-time are the two things that most help a child share. Both take patience from us first.",
      tryThis: [
        "Ask one open question, then count silently to five before adding another.",
        "Let “I don’t want to talk about it” be a fine answer — do not push.",
        "Model curiosity: wonder aloud about things, and your child will start to as well.",
      ],
    },
    completion: {
      title: "You finished “Asking a good question”",
      message:
        "You practised opening a door with a question and giving people room to answer. That is how conversations grow.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "What counts as a friendly question versus a nosy one varies by family and culture; the lesson favours open, gentle questions and honours the right not to answer.",
    ],
    accessibilityNotes: [
      "Wait-time is named as a valid communication need, mirroring Theo, and framed positively.",
      "The lesson does not require the questioner or answerer to make eye contact.",
    ],
    safetyNotes: [
      "The child learns that nobody must answer a question, protecting a child's right to keep private things private.",
    ],
    version: 1,
  },

  {
    id: "echo-treehouse-when-you-didnt-hear",
    slug: "echo-treehouse-when-you-didnt-hear",
    moduleId,
    order: 7,
    title: "When you didn't hear or understand",
    description:
      "The treehouse was noisy and you missed part of Amara's plan. Asking again is easier than it feels.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that not hearing something is not a mistake, and asking again helps everyone.",
      "Name a way to ask someone to repeat, with or without words.",
      "Recognise that people hear and understand in different ways.",
    ],
    skillArea,
    scenes: [
      {
        id: "missed-the-plan",
        title: "A noisy moment",
        narration:
          "Amara just said which branch the flag goes on, but the wind was loud in the leaves and you only caught half of it. Everyone else starts moving. You are not sure where to go.",
        illustrationKey: "treehouse-canopy",
        prompt: "What can you do?",
        choices: [
          {
            id: "ask-again",
            text: "Say “Could you say that again? It was noisy.”",
            consequenceType: "helpful",
            response:
              "Now you know the plan, and so does anyone else who missed it. Asking again fixes it in a second — and it was the noise, not you.",
          },
          {
            id: "nod-and-guess",
            text: "Nod like you understood and guess where to go.",
            consequenceType: "mixed",
            response:
              "You might guess right. But if you guess wrong, the flag ends up on the wrong branch, and everyone has to start over — a quick “say that again?” would have saved it.",
          },
          {
            id: "signal-say-again",
            text: "Cup your ear or hold up a “say again” card.",
            consequenceType: "needs_context",
            response:
              "Asking without words works well, especially when it is loud. Some people lip-read or need things written or signed — there are lots of good ways to ask again.",
          },
        ],
      },
    ],
    principle: {
      title: "Asking again is never silly",
      body: "When you did not catch something, asking for it again helps you and often helps someone else who missed it too. It matters because pretending to understand usually leads to a muddle later — a quick question now saves it.",
      points: [
        "Not hearing is normal — rooms are noisy, and everyone misses things.",
        "You can ask with words, cup your ear, hold up a card, or ask someone to write it down.",
        "Some people are Deaf or hard of hearing and use signing, lip-reading, or captions — all real ways to understand.",
        "Nobody should be made to feel silly for asking again, and you should not make anyone else feel that way either.",
      ],
    },
    practice: {
      prompt: "You missed what someone said. How will you ask again?",
      helperText: "Choose whatever feels easiest for you.",
      options: [
        {
          id: "say-again-please",
          text: "“Could you say that again, please?”",
          encouragement: "Simple and clear. Most people are happy to.",
        },
        {
          id: "which-part",
          text: "“I caught some — can you say the last part?”",
          encouragement: "Even better: you tell them exactly what you need.",
        },
        {
          id: "cup-ear",
          text: "Cup my ear to show I didn’t catch it",
          encouragement: "A clear signal, no words needed. Nice.",
        },
        {
          id: "ask-to-write",
          text: "Ask them to show or write it",
          encouragement: "A great option when it is loud or words are tricky.",
        },
      ],
      closing:
        "Asking again is a brave, useful thing. Try it the next time you miss something.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you miss what someone says, ask them to say it again — your own way.",
      parentPrompt:
        "Model it yourself today: “Sorry, I missed that — say it again?” so your child sees grown-ups ask too.",
      completionQuestion: "When did you ask someone to say something again?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Children hide not-understanding to avoid looking silly. Showing that adults ask again, all the time, removes the shame.",
      tryThis: [
        "Ask people to repeat things in front of your child, cheerfully.",
        "Never sigh at a repeated question — answer it plainly.",
        "If your child guesses wrong, treat it as a missed word, not a failing.",
      ],
    },
    completion: {
      title: "You finished “When you didn't hear or understand”",
      message:
        "You practised asking again instead of guessing. That keeps everyone on the same plan — and it is never silly.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Willingness to ask an adult to repeat themselves varies by culture; the lesson makes asking-again safe and ordinary for everyone.",
    ],
    accessibilityNotes: [
      "Deaf and hard-of-hearing ways of understanding — signing, lip-reading, captions, written notes — are named as equal and valid.",
      "Asking again without speech is offered directly.",
    ],
    safetyNotes: [
      "Clear communication is framed as a shared responsibility, so a child never feels at fault for not catching an instruction.",
    ],
    version: 1,
  },

  {
    id: "echo-treehouse-review",
    slug: "echo-treehouse-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "A whole conversation in the treehouse, using everything: waiting, listening, and showing you heard.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together waiting for a pause, showing you heard, and asking a good question.",
      "Choose a listening move that fits a real moment.",
      "Carry one conversation skill into a real conversation away from the screen.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-whole-chat",
        title: "The whole conversation",
        narration:
          "Everyone is up in the treehouse deciding what to name it. Jun is mid-sentence, you have an idea, Nora is holding up a card, and Theo has gone quiet with a thought. It is a lot at once.",
        illustrationKey: "treehouse-canopy",
        prompt: "What is your first move in all this?",
        choices: [
          {
            id: "wait-then-check-nora",
            text: "Let Jun finish, then check what Nora's card says.",
            consequenceType: "helpful",
            response:
              "You waited for the pause and made sure the quietest voice got noticed. That is listening and including at the same time.",
          },
          {
            id: "jump-in-loud",
            text: "Jump in with your idea before you lose it.",
            consequenceType: "mixed",
            response:
              "Your idea is good and it gets heard — but Jun's tail-end and Nora's card get lost in the rush. A short wait would have kept everyone in.",
          },
          {
            id: "ask-theo-later",
            text: "Make a mental note to ask Theo what he was thinking.",
            consequenceType: "needs_context",
            response:
              "Lovely — you noticed Theo's quiet. Coming back to him once the noise settles gives him the wait-time he likes. Just remember to actually circle back.",
          },
        ],
      },
    ],
    principle: {
      title: "Good conversation shares itself out",
      body: "Everything in this world adds up to one idea: a conversation works best when it is shared, not won. Waiting, showing you heard, asking a question, and making room for quieter voices all do the same job — they help everyone get to be part of it.",
      points: [
        "Wait for the pause; the gap is how a turn gets passed.",
        "Show you heard with a word, a nod, or a card — and ask one good question.",
        "Notice who has not had a turn, and help make room for them.",
        "Eye contact, speaking, and sitting still are never required, and an emergency always comes first.",
      ],
    },
    practice: {
      prompt:
        "Pick the one conversation skill you want to take out into the real world this week.",
      helperText: "There is no wrong pick — choose what you want to practise.",
      options: [
        {
          id: "practise-waiting",
          text: "Waiting for the pause",
          encouragement:
            "A great one to practise. Real gaps are everywhere once you listen for them.",
        },
        {
          id: "practise-showing",
          text: "Showing I heard",
          encouragement:
            "People love to feel heard. This one makes a real difference.",
        },
        {
          id: "practise-questions",
          text: "Asking a good question",
          encouragement:
            "One open question can grow a whole conversation. Nice choice.",
        },
        {
          id: "practise-including",
          text: "Making room for a quieter voice",
          encouragement:
            "A kind and grown-up thing to practise. Someone will be glad you did.",
        },
      ],
      closing:
        "Take your one skill into a real conversation this week. You already have everything you need.",
    },
    offlineMission: {
      childPrompt:
        "Have a real conversation this week where you wait for a pause, show you heard, and ask one good question — all in the same chat.",
      parentPrompt:
        "Sit down for one unhurried conversation with your child and let them lead it, so all three skills get a real outing.",
      completionQuestion:
        "Which part of listening was easiest, and which was hardest?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "This review works best as a real conversation, not a quiz. The mission is the lesson.",
      tryThis: [
        "Have one screen-free chat this week and notice their listening out loud afterwards.",
        "Point out when they made room for a quieter person — that is the hardest skill here.",
        "Keep it warm; listening grows in conversations children enjoy.",
      ],
    },
    completion: {
      title: "You finished “Talking and Listening”",
      message:
        "You put it all together — waiting, listening, showing you heard, and making room for others. Take it into your real conversations this week.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review honours different family conversation styles — overlap or long pauses — and does not present one as correct.",
      "Nora's card use is treated as a full voice in the group, never as something the others speak over.",
    ],
    accessibilityNotes: [
      "Every skill in the review has a non-spoken form, so a child who does not speak much can complete it fully.",
      "Wait-time and optional eye contact are reaffirmed in the closing principle.",
    ],
    safetyNotes: [
      "The review restates that safety and emergencies always come before waiting for a pause.",
    ],
    version: 1,
  },
];
