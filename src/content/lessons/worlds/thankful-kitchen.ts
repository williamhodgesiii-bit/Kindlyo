import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 6 — Thankful Kitchen · module "Kindness and Thanks".
 *
 * DRAFT CONTENT (docs/CURRICULUM_PRINCIPLES.md). Not specialist-reviewed; every
 * lesson stays `status: "draft"`.
 *
 * Grounded in gratitude research: a forced "thank you" teaches nothing; real
 * gratitude starts with noticing, is expressed the child's own way (words, a
 * card, a gesture), and is never counted or made public. Kindness here is small
 * and concrete — the pot fills, and nobody keeps score (docs/design/
 * MODULE_WORLDS.md). Recipes rotate cuisines as texture, never as a lesson topic
 * or a punchline.
 *
 * No choice is "correct"; `consequenceType` records what tends to follow. A
 * child may always decline to give, receive, or say thanks a particular way.
 */

const skillArea = "gratitude" as const;
const moduleId = "thankful-kitchen";

export const thankfulKitchenLessons: Lesson[] = [
  {
    id: "thankful-kitchen-noticing-kindness",
    slug: "thankful-kitchen-noticing-kindness",
    moduleId,
    order: 1,
    title: "Noticing something kind",
    description:
      "Someone quietly did something kind for you. Gratitude starts with catching it.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that gratitude begins with noticing what someone did.",
      "Recognise small, quiet kindnesses that are easy to miss.",
      "Name a way to let someone know you noticed.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-saved-seat",
        title: "The saved stool",
        narration:
          "You come into the busy kitchen and every stool at the big pot is taken — except one, which Theo has quietly kept clear for you with his jumper. He does not say anything about it; he just kept it.",
        illustrationKey: "kitchen-pot",
        prompt: "What could you do?",
        choices: [
          {
            id: "notice-and-name",
            text: "Notice it and say, “You saved me a stool — thank you!”",
            consequenceType: "helpful",
            response:
              "You caught the quiet kindness and let Theo know it landed. Noticing is where thankfulness starts — and it tells Theo that his little thoughtful act was seen.",
          },
          {
            id: "sit-without-noticing",
            text: "Sit down without noticing the stool was saved for you.",
            consequenceType: "mixed",
            response:
              "You get your seat, and that is fine. But Theo’s quiet kindness slips by unseen. Kind things are easy to miss when nobody makes a fuss — noticing them is a skill worth having.",
          },
          {
            id: "notice-silently",
            text: "Notice it in your head and give Theo a warm smile.",
            consequenceType: "needs_context",
            response:
              "A smile can absolutely say thank you — no words needed. Noticing on the inside still counts, and a warm look often tells someone you saw what they did.",
          },
        ],
      },
    ],
    principle: {
      title: "Thankfulness starts with noticing",
      body: "Before you can be grateful, you have to catch the kind thing that happened — and lots of kindnesses are quiet and easy to miss. It helps to notice because it makes the kind person feel seen, and it fills your own day with more good things to spot.",
      points: [
        "Many kind acts are quiet; noticing them is a skill you can practise.",
        "Letting someone know you noticed can be words, a smile, or a small sign.",
        "Noticing kindness helps you spot how much of it is around you every day.",
        "Nobody has to perform gratitude on demand — noticing is real even when it is quiet.",
      ],
    },
    practice: {
      prompt: "Someone did a small kind thing. How will you show you noticed?",
      helperText: "Pick whatever feels like you.",
      options: [
        {
          id: "name-it",
          text: "Say what you noticed and thank them",
          encouragement:
            "Naming it tells them their kindness was seen. Lovely.",
        },
        {
          id: "warm-smile",
          text: "Give a warm smile or thumbs up",
          encouragement: "A warm look can say thank you all on its own.",
        },
        {
          id: "notice-inside",
          text: "Notice it and remember it",
          encouragement: "Noticing counts even when it’s quiet. A good habit.",
        },
      ],
      closing:
        "Try noticing one kind thing today. Once you start looking, you will find a lot of them.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, notice one kind thing someone does — even a small, quiet one — and let them know you saw it, your way.",
      parentPrompt:
        "At bedtime, ask your child, “What kind thing did you notice today?” to grow their kindness-spotting.",
      completionQuestion: "What kind thing did you notice, and who did it?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Gratitude grows from noticing, not from being made to say thank you. A daily ‘what did you notice?’ builds the habit gently.",
      tryThis: [
        "Point out quiet kindnesses you see: “Did you notice they held the door?”",
        "Ask what your child noticed, rather than prompting a scripted thank-you.",
        "Let a smile or gesture count as noticing — it doesn’t have to be words.",
      ],
    },
    completion: {
      title: "You finished “Noticing something kind”",
      message:
        "You practised catching a quiet kindness. Noticing is where every thank-you really begins.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson centres noticing over a prescribed phrase, which fits families and cultures that show thanks in many different ways.",
    ],
    accessibilityNotes: [
      "A smile or gesture is offered as an equal way to acknowledge kindness, for children who find words effortful.",
      "The kind act is described in words, not left to be inferred from the illustration.",
    ],
    safetyNotes: [
      "Gratitude is never demanded on cue; noticing quietly is affirmed as real.",
    ],
    version: 1,
  },

  {
    id: "thankful-kitchen-thank-you-your-way",
    slug: "thankful-kitchen-thank-you-your-way",
    moduleId,
    order: 2,
    title: "Saying thank you your way",
    description:
      "There are lots of ways to say thank you. You get to pick the one that is really yours.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a thank-you can be given in many ways, all real.",
      "Name more than one way to thank someone.",
      "Recognise that a thank-you means more when it is genuine than when it is forced.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-shared-cookie",
        title: "The shared cookie",
        narration:
          "Nora breaks her one big kitchen cookie in half and holds out a piece to you with a smile. She does not use words for this — she just offers, and waits.",
        illustrationKey: "kitchen-shelf",
        prompt: "How could you say thank you?",
        choices: [
          {
            id: "genuine-thanks",
            text: "Say a real “thank you, Nora” and mean it.",
            consequenceType: "helpful",
            response:
              "A genuine thank-you, meant and not just mumbled, tells Nora her sharing mattered. When a thank-you is real, the other person can feel the difference.",
          },
          {
            id: "mumbled-thanks",
            text: "Mutter “thanks” without really looking up.",
            consequenceType: "mixed",
            response:
              "The word is there, which is something. But a thank-you that is rushed and flat can feel like a habit rather than a feeling. A little more warmth would let Nora know it landed.",
          },
          {
            id: "thank-your-way",
            text: "Thank her your own way — a big smile, a nod, or a thumbs up.",
            consequenceType: "needs_context",
            response:
              "A warm smile or a thumbs up is a real thank-you. Nora talks with signs herself, so she will read yours easily — thanks travels in lots of ways, and yours is just as valid.",
          },
        ],
      },
    ],
    principle: {
      title: "A real thank-you beats a forced one",
      body: "Thank-you comes in many forms — words, a card, a smile, a sign — and any of them is real when you mean it. It matters because a genuine thank-you tells someone their kindness reached you, while a forced one is just a noise.",
      points: [
        "A thank-you can be words, a smile, a nod, a card, or a sign.",
        "What makes it count is that you mean it, not which form it takes.",
        "You get to thank people the way that feels like you.",
        "You never have to accept a gift or a food you don’t want; ‘no thank you’ is polite too.",
      ],
    },
    practice: {
      prompt: "Someone was kind to you. How will you thank them your way?",
      helperText: "There is no single right thank-you.",
      options: [
        {
          id: "warm-words",
          text: "A warm “thank you”",
          encouragement: "Simple and real. Meaning it is what counts.",
        },
        {
          id: "make-a-card",
          text: "Make or draw a little thank-you",
          encouragement: "A made thank-you can be treasured. Thoughtful.",
        },
        {
          id: "thank-gesture",
          text: "A smile, nod, or thumbs up",
          encouragement:
            "Thanks travels in lots of ways. Yours is just as good.",
        },
      ],
      closing:
        "Say thank you your own way today — and mean it. That is what the other person feels.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, thank someone your own way — words, a drawing, or a gesture — for something they did.",
      parentPrompt:
        "Offer your child ways to say thanks (a card to draw, a gesture) rather than insisting on the words, and model genuine thanks yourself.",
      completionQuestion: "How did you say thank you, and who to?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "A meant thank-you is worth more than a forced one. Offering alternatives — a drawing, a thumbs up — respects a child’s autonomy and still teaches gratitude.",
      tryThis: [
        "When your child resists ‘say thank you,’ offer a card or gesture instead.",
        "Model genuine thanks with warmth, so they hear what real sounds like.",
        "Let ‘no thank you’ to a food or gift be respected — it’s manners too.",
      ],
    },
    completion: {
      title: "You finished “Saying thank you your way”",
      message:
        "You practised thanking people your own way, and meaning it. A real thank-you is one the other person can feel.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Ways of expressing thanks vary widely by culture; the lesson presents many forms as equal and never fixes on one phrase or gesture.",
    ],
    accessibilityNotes: [
      "Non-spoken thanks — a sign, a card, a smile — is fully affirmed, and mirrors Nora’s own way of communicating.",
      "The lesson does not require eye contact or a particular script.",
    ],
    safetyNotes: [
      "The child’s right to decline a gift or food they don’t want is stated, keeping thanks from overriding consent.",
    ],
    version: 1,
  },

  {
    id: "thankful-kitchen-small-helpful-actions",
    slug: "thankful-kitchen-small-helpful-actions",
    moduleId,
    order: 3,
    title: "Small helpful actions",
    description:
      "The big pot needs lots of little jobs. Small helpful things add up to something everyone shares.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that small helpful actions add up and matter.",
      "Name a small way to help without being asked.",
      "Recognise that helping is a choice offered, not a chore forced on others.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-busy-kitchen",
        title: "The busy kitchen",
        narration:
          "Everyone is making the big shared dish. There are little jobs everywhere — spoons to hand out, a spill to wipe, jars to pass. Nobody has asked you to do any of them, but you can see them.",
        illustrationKey: "kitchen-pot",
        prompt: "What could you do?",
        choices: [
          {
            id: "spot-and-help",
            text: "Spot a small job and quietly do it — pass the jars along.",
            consequenceType: "helpful",
            response:
              "You saw a small thing that needed doing and did it. Little helpful actions like this add up, and they make the whole kitchen work — no one has to do it all alone.",
          },
          {
            id: "wait-to-be-asked",
            text: "Wait until someone tells you exactly what to do.",
            consequenceType: "mixed",
            response:
              "Waiting to be asked is not wrong, and sometimes it is the right call. But lots of small jobs go undone when everyone waits — noticing one and doing it is a lovely kind of help.",
          },
          {
            id: "offer-to-help",
            text: "Ask, “What would help most right now?”",
            consequenceType: "needs_context",
            response:
              "A great question — it lets the busy people point you at what is actually needed. Offering rather than taking over is thoughtful, especially in someone else’s kitchen.",
          },
        ],
      },
    ],
    principle: {
      title: "Small helpful things add up",
      body: "A kitchen — or a home, or a classroom — runs on lots of little helpful actions nobody was told to do. It helps because when everyone does a small thing, the big thing gets made together, and no single person is left carrying it all.",
      points: [
        "You can help by noticing a small job and quietly doing it.",
        "Offering — “what would help?” — is kind in someone else’s space.",
        "Small actions add up; help does not have to be big to matter.",
        "Helping is something you offer, not a chore you push onto other people.",
      ],
    },
    practice: {
      prompt: "There are small jobs around you. How will you help?",
      helperText: "Pick a way to pitch in.",
      options: [
        {
          id: "do-a-job",
          text: "Notice a small job and do it",
          encouragement: "Quiet, useful help. It really adds up.",
        },
        {
          id: "ask-whats-needed",
          text: "Ask what would help most",
          encouragement:
            "Offering first is thoughtful, especially in someone’s space.",
        },
        {
          id: "help-together",
          text: "Join in on a job with someone",
          encouragement: "Two on a job makes it lighter and more fun. Nice.",
        },
      ],
      closing:
        "Do one small helpful thing today without being asked. Little actions build big kindness.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, do one small helpful thing at home without being asked — and notice how it helps.",
      parentPrompt:
        "Notice and name your child’s small helps this week (“you cleared your plate — that helped”), so helping feels seen, not scored.",
      completionQuestion: "What small helpful thing did you do?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Naming small helps warmly — without turning them into chores or rewards — grows a genuine urge to pitch in.",
      tryThis: [
        "Notice unprompted help: “That was helpful — thank you.”",
        "Keep help an offer, not a demand, so it stays willing.",
        "Do small helpful things visibly yourself; children copy it.",
      ],
    },
    completion: {
      title: "You finished “Small helpful actions”",
      message:
        "You practised noticing a small job and doing it. Little helpful things add up to something everyone shares.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson frames helping as offered and shared, respecting families with different expectations about chores and children’s roles.",
    ],
    accessibilityNotes: [
      "Asking ‘what would help?’ suits children who prefer clear direction over reading a busy scene.",
      "The lesson does not require initiating unprompted if that is hard; offering counts.",
    ],
    safetyNotes: [
      "Helping is kept an offer, never something forced, preserving a child’s choice.",
    ],
    version: 1,
  },

  {
    id: "thankful-kitchen-people-we-dont-notice",
    slug: "thankful-kitchen-people-we-dont-notice",
    moduleId,
    order: 4,
    title: "Thanking people we don't always notice",
    description:
      "Lots of people help us who we rarely thank. Who kept the kitchen warm and the bowls clean?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that many people help us behind the scenes without being thanked.",
      "Name someone whose help is easy to overlook.",
      "Recognise that thanking these people is a kind and fair thing to do.",
    ],
    skillArea,
    scenes: [
      {
        id: "who-helped",
        title: "Who made this possible?",
        narration:
          "The shared meal is warm and delicious. It is easy to thank the friend beside you — but someone lit the stove, someone washed all these bowls, and someone grew the vegetables. Most of them you will never see.",
        illustrationKey: "kitchen-shelf",
        prompt: "What could you do?",
        choices: [
          {
            id: "thank-the-helper",
            text: "Find the person who cooked or cleaned and thank them too.",
            consequenceType: "helpful",
            response:
              "You looked past the obvious and thanked someone whose help is easy to miss. The people who keep things running rarely get a thank-you — and it means a lot when they do.",
          },
          {
            id: "only-obvious",
            text: "Thank only the friend right next to you.",
            consequenceType: "mixed",
            response:
              "Thanking your friend is lovely and worth doing. But so much of what made the meal happen came from people out of sight. Noticing them too is a fairer, wider kind of thankful.",
          },
          {
            id: "thank-in-heart",
            text: "Quietly feel thankful for everyone who helped, seen or not.",
            consequenceType: "needs_context",
            response:
              "Feeling grateful for the whole chain of helpers is real gratitude, even when you cannot thank each one. When you can, a word to the cook or the cleaner turns that feeling into something they get to feel too.",
          },
        ],
      },
    ],
    principle: {
      title: "Say thank you to the people we don't always see",
      body: "A lot of people help us who we never think to thank — cooks, cleaners, drivers, growers. It matters because their work holds up our whole day, and a thank-you to someone who rarely gets one can make a real difference to them.",
      points: [
        "Behind most nice things is someone whose help is easy to overlook.",
        "Thanking the cook, the cleaner, or the driver is a kind and fair thing to do.",
        "You can feel grateful for helpers you will never meet.",
        "Thanks is given freely to anyone; being helpful is not about someone’s job being ‘lower’ or ‘higher’.",
      ],
    },
    practice: {
      prompt:
        "Someone whose help is easy to miss made your day better. How will you thank them?",
      helperText: "Pick a way that fits.",
      options: [
        {
          id: "thank-in-person",
          text: "Thank them in person when I can",
          encouragement:
            "A word to someone who rarely hears one — that lands big.",
        },
        {
          id: "thank-the-cook",
          text: "Thank whoever made or fixed the thing",
          encouragement: "Looking past the obvious. Fair and kind.",
        },
        {
          id: "grateful-heart",
          text: "Feel grateful for helpers I can’t see",
          encouragement:
            "Real gratitude reaches even the people you’ll never meet.",
        },
      ],
      closing:
        "Thank someone today whose help usually goes unseen. It might be the nicest thing that happens to them.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, thank someone whose help is easy to overlook — a cook, a cleaner, a driver, a shopkeeper.",
      parentPrompt:
        "Point out unseen helpers this week (the bus driver, the person who stacked the shelves) and let your child thank one.",
      completionQuestion: "Who did you thank that you don’t usually notice?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Thanking behind-the-scenes helpers teaches gratitude and respect for everyone’s work equally.",
      tryThis: [
        "Name the invisible helpers together: “Someone grew this, someone drove it here.”",
        "Model thanking service workers warmly and by name when you can.",
        "Keep it respectful and equal — never framed as thanking someone ‘beneath’ you.",
      ],
    },
    completion: {
      title: "You finished “Thanking people we don't always notice”",
      message:
        "You practised looking past the obvious to thank someone whose help is easy to miss. That is a wide, fair kind of thankful.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson treats all helpers as equally deserving of thanks, avoiding any hierarchy of whose work matters more.",
    ],
    accessibilityNotes: [
      "Feeling grateful quietly is offered for children who find approaching strangers hard.",
      "The lesson does not require initiating contact with an unfamiliar adult unsupervised.",
    ],
    safetyNotes: [
      "Thanking unfamiliar helpers is framed as happening with a grown-up present, not as approaching strangers alone.",
    ],
    version: 1,
  },

  {
    id: "thankful-kitchen-giving-without-scoring",
    slug: "thankful-kitchen-giving-without-scoring",
    moduleId,
    order: 5,
    title: "Giving without keeping score",
    description:
      "You did something kind, but nobody clapped. Does a kind thing still count when nobody is counting?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that kindness is not a competition and does not need to be counted.",
      "Recognise that a kind act still matters even when no one notices it.",
      "Understand that giving to be thanked is different from giving to be kind.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-unseen-kindness",
        title: "The quiet good deed",
        narration:
          "You quietly filled up the empty water jug so the next person would not have to. Nobody saw you do it. Part of you wishes someone had, so they would know it was you.",
        illustrationKey: "kitchen-jars",
        prompt: "What do you make of it?",
        choices: [
          {
            id: "counts-anyway",
            text: "Feel good that it will help someone, even though nobody saw.",
            consequenceType: "helpful",
            response:
              "The jug is full and someone’s day is a little easier — that is true whether anyone saw or not. Kindness done quietly is still completely real, and the warm feeling is yours to keep.",
          },
          {
            id: "make-sure-seen",
            text: "Go tell everyone that you were the one who filled it.",
            consequenceType: "mixed",
            response:
              "It is natural to want your kindness noticed. But when we do kind things mainly to be clapped for, they start to be about us, not the other person. The good deed counts even uncelebrated.",
          },
          {
            id: "share-to-encourage",
            text: "Mention it lightly so others remember to fill it too.",
            consequenceType: "needs_context",
            response:
              "Sometimes sharing a kind idea helps it spread — “I topped up the jug, it’s easy to keep it full.” That can be about helping others do it too, not about scoring points, as long as that is really why.",
          },
        ],
      },
    ],
    principle: {
      title: "Kindness is not a competition",
      body: "A kind thing still helps someone whether or not anybody notices you did it. It matters because when kindness turns into keeping score — who did more, who got thanked — it stops being about the other person, and the warm part gets lost.",
      points: [
        "A kind act counts even when nobody sees it.",
        "Doing kind things mainly to be praised makes them about you, not the other person.",
        "There is no scoreboard for kindness, and there does not need to be.",
        "You never owe anyone endless kindness; looking after yourself matters too.",
      ],
    },
    practice: {
      prompt:
        "You did something kind and nobody noticed. What do you tell yourself?",
      helperText: "Pick the thought that feels true and kind.",
      options: [
        {
          id: "still-helped",
          text: "“It still helped someone.”",
          encouragement: "Exactly. The help is real whether it’s seen or not.",
        },
        {
          id: "warm-feeling",
          text: "“I get to keep the warm feeling.”",
          encouragement: "That quiet good feeling is yours. Lovely thought.",
        },
        {
          id: "not-a-race",
          text: "“Kindness isn’t a race.”",
          encouragement: "No scoreboard needed. You’ve got the heart of it.",
        },
      ],
      closing:
        "Do one kind thing today that nobody will know about. Notice the warm feeling — it counts.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, do one kind thing that nobody will notice — and let the warm feeling be enough.",
      parentPrompt:
        "Talk about a quiet kindness you did that no one saw, so your child learns kindness needn’t be counted or clapped.",
      completionQuestion:
        "What quiet kind thing did you do, and how did it feel?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Public praise and reward charts can accidentally teach children to perform kindness. Valuing quiet kindness protects the real thing.",
      tryThis: [
        "Avoid turning kindness into points or public rankings.",
        "Notice the intent quietly: “That was kind — how did it feel inside?”",
        "Model unseen kindness and talk about the warm feeling, not the credit.",
      ],
    },
    completion: {
      title: "You finished “Giving without keeping score”",
      message:
        "You practised the idea that kindness counts even when nobody is counting. The warm feeling is yours to keep.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson deliberately avoids public rankings and moral scoring of kindness (CLAUDE.md principle 5), across all family styles.",
    ],
    accessibilityNotes: [
      "The lesson works entirely through reflection and does not depend on social performance.",
      "No option requires speaking up or being noticed to succeed.",
    ],
    safetyNotes: [
      "The lesson notes a child does not owe endless kindness and that looking after themselves matters, guarding against over-giving.",
    ],
    version: 1,
  },

  {
    id: "thankful-kitchen-receiving-kindly",
    slug: "thankful-kitchen-receiving-kindly",
    moduleId,
    order: 6,
    title: "Taking a kindness kindly",
    description:
      "Someone wants to help you or give you something. Receiving well is a kindness too — and so is a gentle 'no thank you'.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that accepting kindness graciously is a skill of its own.",
      "Recognise that letting someone help can be a gift to them.",
      "Understand that a gentle 'no thank you' is always allowed.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-offer",
        title: "Jun’s offer",
        narration:
          "You are struggling to reach the top shelf for the big mixing bowl. Jun, who loves to help, jumps up and offers to get it down for you. You could reach it yourself if you really tried.",
        illustrationKey: "kitchen-shelf",
        prompt: "What could you do?",
        choices: [
          {
            id: "accept-warmly",
            text: "Let him help and say a warm “thanks, Jun!”",
            consequenceType: "helpful",
            response:
              "You accepted the kindness and thanked him for it. Letting someone help can be a gift to them too — Jun loves being helpful, and you made his day a little brighter by saying yes.",
          },
          {
            id: "refuse-to-prove",
            text: "Insist you can do it yourself and wave him off.",
            consequenceType: "mixed",
            response:
              "It is fine to want to manage things yourself. But brushing off a warm offer can leave the giver feeling shut out. If you do want the help, accepting it is its own kind of kindness.",
          },
          {
            id: "gentle-no-thanks",
            text: "Say, “Thanks for offering — I’d like to try myself.”",
            consequenceType: "needs_context",
            response:
              "A perfect gentle no. You can decline help kindly and still honour the offer. Wanting to do it yourself is completely allowed, and Jun will feel thanked rather than pushed away.",
          },
        ],
      },
    ],
    principle: {
      title: "Receiving well is a kindness too",
      body: "When someone offers you help or a gift, accepting it graciously — or declining it gently — is a skill of its own. It matters because giving feels good, so letting someone give to you can be a gift back to them; and a warm ‘no thank you’ honours the offer either way.",
      points: [
        "Letting someone help can make their day; giving feels good.",
        "A warm “thank you” when you accept tells the giver it mattered.",
        "You can always say a gentle “no thank you, I’d like to try myself”.",
        "You never have to accept help, a gift, or a food you don’t want — your yes and no both count.",
      ],
    },
    practice: {
      prompt:
        "Someone offers to help you or give you something. How will you receive it?",
      helperText: "Any of these is gracious.",
      options: [
        {
          id: "accept-thanks",
          text: "Accept warmly and say thank you",
          encouragement:
            "You let them give, and thanked them. That’s a gift back.",
        },
        {
          id: "gentle-decline",
          text: "Say “thanks for offering” and gently decline",
          encouragement: "A warm no honours the offer. Perfectly kind.",
        },
        {
          id: "accept-and-share",
          text: "Accept, and offer to help them back sometime",
          encouragement: "Kindness flowing both ways. Lovely.",
        },
      ],
      closing:
        "Receiving well is its own kindness. Whether you say yes or a gentle no, thank the offer.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, when someone offers you help or something nice, practise receiving it warmly — or saying a gentle no thank you.",
      parentPrompt:
        "Let your child both accept and decline offers this week, and honour each choice, so receiving and refusing both feel safe.",
      completionQuestion:
        "When someone offered you something, what did you choose, and how did you say it?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Graceful receiving — and a respected ‘no thank you’ — both teach that a child’s yes and no are real.",
      tryThis: [
        "Model accepting help warmly yourself: “Thanks, that’s kind.”",
        "Honour your child’s gentle refusals of food, gifts, or help.",
        "Point out that letting someone help can make their day.",
      ],
    },
    completion: {
      title: "You finished “Taking a kindness kindly”",
      message:
        "You practised receiving kindness warmly — and declining it gently when you want to. Both are their own kind of kind.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Customs around accepting or politely refusing offers vary; the lesson honours both a warm yes and a gentle no.",
    ],
    accessibilityNotes: [
      "The lesson explicitly protects a child’s wish to try things themselves, which matters for building independence.",
      "A gesture-based thanks or refusal fits children who find words hard.",
    ],
    safetyNotes: [
      "The lesson affirms the right to decline help, gifts, or food, reinforcing consent and bodily autonomy.",
    ],
    version: 1,
  },

  {
    id: "thankful-kitchen-passing-it-on",
    slug: "thankful-kitchen-passing-it-on",
    moduleId,
    order: 7,
    title: "Passing kindness on",
    description:
      "Someone was kind to you. What if kindness could keep travelling, one person to the next?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a kindness received can be passed on to someone else.",
      "Name a way to pass kindness along.",
      "Recognise that a chain of small kindnesses can grow from one act.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-chain",
        title: "The kindness that keeps going",
        narration:
          "Maya noticed you looked left out earlier and shared her seat and her snack with you. It made your whole morning better. Now you notice Theo standing on his own at the edge of the kitchen.",
        illustrationKey: "kitchen-pot",
        prompt: "What could you do?",
        choices: [
          {
            id: "pass-it-on",
            text: "Do for Theo what Maya did for you — share your seat and wave him over.",
            consequenceType: "helpful",
            response:
              "You passed the kindness along. One kind act became two, and Theo’s morning just got better the way yours did. Kindness can keep travelling, person to person, as far as we send it.",
          },
          {
            id: "keep-it",
            text: "Enjoy how good Maya’s kindness felt and leave it there.",
            consequenceType: "mixed",
            response:
              "It is lovely to soak up a kindness, and there is nothing wrong with that. But you are also in the perfect spot to send it onward — and passing it to Theo would make the good thing grow.",
          },
          {
            id: "thank-and-pass",
            text: "Thank Maya, then find your own way to be kind to someone.",
            consequenceType: "needs_context",
            response:
              "A double kindness: you close the loop with Maya and open a new one. Passing it on does not have to copy exactly what you received — your own kind idea works just as well.",
          },
        ],
      },
    ],
    principle: {
      title: "Kindness can keep travelling",
      body: "When someone is kind to you, you can send that kindness onward to someone else. It helps because one act can become a whole chain — a good feeling that grows as it moves from person to person, instead of stopping with you.",
      points: [
        "A kindness you received can be passed on to someone new.",
        "Passing it on can copy what you got, or be your own kind idea.",
        "One small act can start a chain that reaches people you will never know.",
        "Pass kindness when you have it to give; it is a gift, not a debt you owe.",
      ],
    },
    practice: {
      prompt: "Someone was kind to you. How will you pass it on?",
      helperText: "Pick a way to send it onward.",
      options: [
        {
          id: "same-kindness",
          text: "Do the same kind thing for someone else",
          encouragement: "One kindness becomes two. That’s how a chain starts.",
        },
        {
          id: "my-own-way",
          text: "Be kind in my own way to someone new",
          encouragement: "Your own kind idea works just as well. Lovely.",
        },
        {
          id: "include-someone",
          text: "Include someone who looks left out",
          encouragement:
            "A warm way to pass it on. Someone’s day just improved.",
        },
      ],
      closing:
        "Pass a kindness on today. See how far one good thing can travel.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, when someone is kind to you, pass a kindness on to someone else your own way.",
      parentPrompt:
        "When your child receives a kindness, wonder aloud together, “Who could we pass some kindness to?”",
      completionQuestion: "What kindness did you pass on, and to whom?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘Pass it on’ turns gratitude into action and shows kindness as something that grows, not a favour to repay.",
      tryThis: [
        "Wonder together who could receive some kindness next.",
        "Keep it a gift, not a debt: passing on is a choice, not a payback.",
        "Notice chains when they happen: “Their kindness led to yours.”",
      ],
    },
    completion: {
      title: "You finished “Passing kindness on”",
      message:
        "You practised sending a kindness onward. One kind act can become a chain that reaches far past you.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson frames kindness as a freely-passed gift rather than a social debt to be repaid, which suits many family values.",
    ],
    accessibilityNotes: [
      "Passing kindness on can be done through inclusion or a gesture, not only words.",
      "The lesson does not require initiating with strangers unsupervised.",
    ],
    safetyNotes: [
      "Kindness is framed as a gift given when you have it to give, not an obligation, guarding against over-giving.",
    ],
    version: 1,
  },

  {
    id: "thankful-kitchen-review",
    slug: "thankful-kitchen-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "The big shared meal is ready. Noticing, thanking, helping, and passing kindness on — all around one table.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together noticing kindness, thanking, helping, and passing it on.",
      "Choose a kindness move that fits a real moment.",
      "Carry one act of thankfulness into the real world.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-shared-meal",
        title: "The meal everyone made",
        narration:
          "The big pot is full and the table is set, made by everyone together. Someone cooked, someone cleaned, a friend shared their seat, and there is one small job left that nobody has to do. It is a whole kitchen of kindness at once.",
        illustrationKey: "kitchen-pot",
        prompt: "What is your kind move right now?",
        choices: [
          {
            id: "thank-and-help",
            text: "Thank whoever cooked, and quietly do the last small job.",
            consequenceType: "helpful",
            response:
              "You noticed the helpers, thanked them, and pitched in — the whole world in one moment. That is what makes a shared meal feel like everyone’s.",
          },
          {
            id: "just-eat",
            text: "Sit down and start eating without noticing any of it.",
            consequenceType: "mixed",
            response:
              "The food is there to enjoy, and that is allowed. But so much kindness went into it — a glance around to notice and thank the helpers would let all of them feel it.",
          },
          {
            id: "pass-it-on",
            text: "Save a good spot at the table for someone who is still on their own.",
            consequenceType: "needs_context",
            response:
              "A lovely way to pass kindness on — making sure nobody eats alone. It works best paired with a thank-you to the people who made the meal, so kindness flows both back and forward.",
          },
        ],
      },
    ],
    principle: {
      title: "Kindness and thanks make a shared table",
      body: "Everything in this world comes together at the table: noticing the kindness around you, saying thank you your way, doing small helpful things, and passing it all on. It helps because a meal — or a home, or a day — feels like everyone’s when kindness moves freely and nobody keeps score.",
      points: [
        "Notice the kindness around you, including the helpers you don’t see.",
        "Say thank you your own way, and mean it.",
        "Do small helpful things, and pass kindness on when you can.",
        "Kindness is a gift, never counted or forced; your yes and no both count.",
      ],
    },
    practice: {
      prompt:
        "Pick the kindness move you want to take out into the real world this week.",
      helperText: "There is no wrong choice — pick what you want to practise.",
      options: [
        {
          id: "practise-noticing",
          text: "Noticing kindness",
          encouragement: "Where all thankfulness starts. Great pick.",
        },
        {
          id: "practise-thanking",
          text: "Thanking someone my way",
          encouragement: "A real thank-you is felt. Lovely to practise.",
        },
        {
          id: "practise-helping",
          text: "Doing small helpful things",
          encouragement: "Little actions add up to big kindness. Nice.",
        },
        {
          id: "practise-passing",
          text: "Passing kindness on",
          encouragement: "See how far one good thing can travel. Warm choice.",
        },
      ],
      closing:
        "Take your one kindness move into your week. A little thankfulness makes the whole table warmer.",
    },
    offlineMission: {
      childPrompt:
        "This week, put it together: notice a kindness, thank someone your way, do a small help, and pass a kindness on.",
      parentPrompt:
        "Over a family meal this week, take turns naming one kindness each of you noticed that day — noticing, out loud, together.",
      completionQuestion:
        "Which kindness did you enjoy most this week — noticing, thanking, helping, or passing it on?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "A shared meal is the perfect lab for this world. A round of ‘what kindness did you notice?’ turns gratitude into a family habit.",
      tryThis: [
        "Start a ‘noticed kindness’ round at a meal this week.",
        "Thank the cook and helpers warmly where your child can see.",
        "Keep it un-scored: no charts, no competition, just noticing.",
      ],
    },
    completion: {
      title: "You finished “Kindness and Thanks”",
      message:
        "You put it all together — noticing, thanking, helping, and passing it on. Take a little thankfulness into your real week.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review keeps thanks un-scripted and un-scored, welcoming many cultural ways of expressing gratitude at the table.",
    ],
    accessibilityNotes: [
      "Every kindness move in the review has a non-verbal form, keeping it open to all children.",
      "Saving a seat offers an inclusion-based way to take part without speaking.",
    ],
    safetyNotes: [
      "The closing principle restates that kindness is a gift, never forced, and that a child’s yes and no both count.",
    ],
    version: 1,
  },
];
