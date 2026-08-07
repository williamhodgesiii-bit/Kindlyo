import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 9 — Sunny Table Café · module "Eating Together".
 *
 * DRAFT CONTENT (docs/CURRICULUM_PRINCIPLES.md). Not specialist-reviewed; every
 * lesson stays `status: "draft"`.
 *
 * Sharing a table: passing kindly, waiting for others, talking and listening,
 * and helping clear up. Two anchors from docs/design/MODULE_WORLDS.md §9: sensory
 * food aversions are respected — "no thank you" is table manners too — and no
 * utensil is the correct one; forks, hands, and chopsticks all appear as equal
 * family customs. Nora's "no thank you" wave is canon here.
 *
 * No choice is "correct"; `consequenceType` records what tends to follow. A child
 * is never pressured to eat, taste, or finish anything.
 */

const skillArea = "dining" as const;
const moduleId = "sunny-table-cafe";

export const sunnyTableCafeLessons: Lesson[] = [
  {
    id: "sunny-table-cafe-coming-to-the-table",
    slug: "sunny-table-cafe-coming-to-the-table",
    moduleId,
    order: 1,
    title: "Coming to the table",
    description:
      "The café table is being set for everyone. Coming to a shared meal has a gentle rhythm of its own.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a shared meal is something everyone arrives at together.",
      "Name a way to help get ready for a meal.",
      "Recognise that helping set up is part of sharing a table.",
    ],
    skillArea,
    scenes: [
      {
        id: "setting-up",
        title: "Under the big umbrella",
        narration:
          "Everyone is gathering at the round café table under the big umbrella. Plates and cups still need putting out, and there is a spot for you. Some friends are already helping set up.",
        illustrationKey: "cafe-table",
        prompt: "What could you do as you come to the table?",
        choices: [
          {
            id: "help-set-up",
            text: "Help put out the plates and cups before you sit down.",
            consequenceType: "helpful",
            response:
              "You joined in getting the table ready. A shared meal is something everyone makes together, and helping set up — even a little — is a warm way to arrive at it.",
          },
          {
            id: "sit-and-wait",
            text: "Sit straight down and wait to be served.",
            consequenceType: "mixed",
            response:
              "Sitting down is fine, and sometimes you are a guest who is meant to. But when everyone else is setting up, lending a hand is friendlier — a table comes together faster when a few people help.",
          },
          {
            id: "ask-how-to-help",
            text: "Ask, “What can I help put out?”",
            consequenceType: "needs_context",
            response:
              "A lovely question — it lets whoever is organising point you at what is needed. Offering to help is especially kind at someone else’s table, where you might not know where things go.",
          },
        ],
      },
    ],
    principle: {
      title: "A shared meal is something we arrive at together",
      body: "Coming to the table is not just sitting down — it is joining in getting ready and settling in with everyone. It helps because a meal you all set up feels like everyone’s, and lending a hand is a warm, easy way to be part of it.",
      points: [
        "Helping put things out gets the table ready faster.",
        "Offering — “what can I help with?” — is kind, especially as a guest.",
        "Coming to the table is a shared moment, not just your seat.",
        "If you need something to feel comfortable at the table, it is fine to ask.",
      ],
    },
    practice: {
      prompt: "You’re coming to a shared meal. How will you join in?",
      helperText: "Pick a warm way to arrive.",
      options: [
        {
          id: "put-out",
          text: "Help put things on the table",
          encouragement: "A warm way to arrive. The table’s ready faster too.",
        },
        {
          id: "offer-help",
          text: "Ask what I can help with",
          encouragement: "Offering is kind, especially at someone’s table.",
        },
        {
          id: "settle-in",
          text: "Settle in and greet everyone",
          encouragement: "A friendly hello to the table is a lovely start.",
        },
      ],
      closing:
        "Join in coming to the table this week. A meal you help set up feels like everyone’s.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, help get a meal ready at home — set out plates, cups, or napkins — before you sit down.",
      parentPrompt:
        "Give your child one setting-up job before a meal this week, so coming to the table means joining in, not just being served.",
      completionQuestion: "What did you help put on the table?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Small setting-up jobs turn a child from a served guest into a participant, which is where table manners begin.",
      tryThis: [
        "Give a real setting-up role: napkins, cups, calling everyone.",
        "Model helping and thanking helpers at the table.",
        "Keep it low-key at others’ tables, where offering is enough.",
      ],
    },
    completion: {
      title: "You finished “Coming to the table”",
      message:
        "You practised joining in as a meal comes together. A shared table is something we all arrive at.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Who sets up and who is served varies by family and culture; the lesson offers helping and offering without prescribing one custom.",
    ],
    accessibilityNotes: [
      "Asking what’s needed suits children who prefer direction to reading a busy scene.",
      "The lesson invites asking for what a child needs to be comfortable at the table.",
    ],
    safetyNotes: [
      "A child’s comfort at the table is centred, and asking for what they need is welcomed.",
    ],
    version: 1,
  },

  {
    id: "sunny-table-cafe-passing-kindly",
    slug: "sunny-table-cafe-passing-kindly",
    moduleId,
    order: 2,
    title: "Passing things kindly",
    description:
      "The jug of juice is at the far end and you're thirsty. Reaching across, or asking? There's a kinder way.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that asking for things to be passed keeps a table calm and safe.",
      "Name a kind way to ask for and pass something at the table.",
      "Recognise that passing kindly helps everyone share the food.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-far-jug",
        title: "The juice at the far end",
        narration:
          "The big jug of juice is right down at the other end of the round table. You are thirsty, and if you stretch right across, your sleeve would go through Amara’s plate to get there.",
        illustrationKey: "cafe-pitcher",
        prompt: "What could you do?",
        choices: [
          {
            id: "ask-to-pass",
            text: "Ask, “Could you pass the juice, please?”",
            consequenceType: "helpful",
            response:
              "You asked instead of reaching, so nothing got knocked and nobody got an elbow. Asking for things to be passed keeps the table calm — and the juice comes to you the safe, easy way.",
          },
          {
            id: "reach-across",
            text: "Stretch across the table to grab it yourself.",
            consequenceType: "mixed",
            response:
              "You might reach it. But a long stretch across plates often means a knocked cup or a sleeve in someone’s food. Asking someone to pass it is safer and kinder to everyone in the way.",
          },
          {
            id: "ask-and-offer",
            text: "Ask for it, and offer to pass things to others too.",
            consequenceType: "needs_context",
            response:
              "Lovely — passing works both ways. Asking for what you need and offering to pass to others keeps everything moving kindly round the table, so nobody has to stretch.",
          },
        ],
      },
    ],
    principle: {
      title: "Ask for it to be passed",
      body: "When something is out of reach, asking for it to be passed keeps the table calm and safe. It helps because a long stretch across everyone’s plates often ends in a spill or an elbow — and asking lets the food move round the table so everyone can share it.",
      points: [
        "“Could you pass the …, please?” is safer and kinder than reaching across.",
        "Passing works both ways — offer to pass things to others too.",
        "Keeping arms out of other people’s plates keeps the table calm.",
        "It is always fine to ask for what you need at a table.",
      ],
    },
    practice: {
      prompt:
        "Something you want is out of reach at the table. What will you do?",
      helperText: "Pick the kind way.",
      options: [
        {
          id: "please-pass",
          text: "Ask “please could you pass it?”",
          encouragement: "Safe and kind. The food comes to you the easy way.",
        },
        {
          id: "offer-to-pass",
          text: "Offer to pass things to others too",
          encouragement: "Passing both ways keeps the table flowing. Lovely.",
        },
        {
          id: "wait-turn",
          text: "Wait for it to come round, then take some",
          encouragement: "Patient and calm. That works nicely too.",
        },
      ],
      closing:
        "Ask for things to be passed this week. It keeps the table calm and everyone sharing.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, at a meal, practise asking for things to be passed — and offer to pass things to others too.",
      parentPrompt:
        "Model passing at meals: “Could you pass the water?” and thank the passer, so your child hears the rhythm.",
      completionQuestion:
        "What did you ask to be passed, and did you pass something to someone else?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘Ask, don’t reach’ keeps meals calm and models turn-taking. Passing both ways makes it mutual, not just a request.",
      tryThis: [
        "Model asking and thanking for passes at the table.",
        "Invite your child to be the passer sometimes.",
        "Keep it warm, not a rule to police — it’s about flow and care.",
      ],
    },
    completion: {
      title: "You finished “Passing things kindly”",
      message:
        "You practised asking for things to be passed. It keeps the table calm and the food moving round to everyone.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Table service styles vary (family-style, plated, shared platters); the lesson teaches asking and passing without assuming one setup.",
    ],
    accessibilityNotes: [
      "Asking for help reaching supports children with shorter reach or motor differences, framed as ordinary.",
      "The lesson does not require perfect coordination; asking is the skill.",
    ],
    safetyNotes: [
      "Asking to pass avoids reaching over hot dishes or knocking items, a small real safety benefit at the table.",
    ],
    version: 1,
  },

  {
    id: "sunny-table-cafe-waiting-for-everyone",
    slug: "sunny-table-cafe-waiting-for-everyone",
    moduleId,
    order: 3,
    title: "Waiting until everyone has some",
    description:
      "Your food is in front of you and it smells amazing — but others don't have theirs yet. When does the meal begin?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that starting together is a way of sharing a meal.",
      "Recognise that families and places have different customs about when to start.",
      "Name a kind thing to do while others are still being served.",
    ],
    skillArea,
    scenes: [
      {
        id: "food-first",
        title: "Yours arrives first",
        narration:
          "Your plate lands first, and it smells wonderful. Around the table, Jun, Theo, and Nora are still waiting for theirs. Your tummy is rumbling and the food is right there.",
        illustrationKey: "cafe-table",
        prompt: "What could you do?",
        choices: [
          {
            id: "wait-together",
            text: "Wait until everyone has theirs, so you can start together.",
            consequenceType: "helpful",
            response:
              "You waited so the meal could begin together. Starting as a group is a warm way to share a table — nobody has to watch others eat while they wait for theirs.",
          },
          {
            id: "dig-in",
            text: "Start eating straight away while it is hot.",
            consequenceType: "mixed",
            response:
              "Hot food is best fresh, and in some families it is fine to start when yours arrives. But if others are still waiting, digging in first can feel a bit lonely for them — waiting a moment is kinder.",
          },
          {
            id: "ask-the-table",
            text: "Ask the table, “Shall we wait, or is it okay to start?”",
            consequenceType: "needs_context",
            response:
              "A great question, because tables really do differ. Some families say “start while it’s hot!”, others wait for everyone or for a grown-up. Asking lets you follow this table’s way.",
          },
        ],
      },
    ],
    principle: {
      title: "Starting together shares the meal",
      body: "Waiting until everyone has their food, so you can start together, is one way of sharing a table. It helps because nobody likes to watch others eat while they wait — though different families and places have different customs, and asking is how you learn this table’s way.",
      points: [
        "Starting together means no one eats alone while others wait.",
        "Some families say “start while it’s hot”; others wait for everyone or for an elder.",
        "If you are not sure, ask what this table does.",
        "You never have to eat something you don’t want, whenever the meal starts.",
      ],
    },
    practice: {
      prompt:
        "Your food is here but others are still waiting. What will you do?",
      helperText: "Pick what feels kind to you.",
      options: [
        {
          id: "wait-for-all",
          text: "Wait so we can start together",
          encouragement: "A warm way to share a table. Nobody eats alone.",
        },
        {
          id: "ask-custom",
          text: "Ask if we should wait or start",
          encouragement: "Smart — tables really do differ. Good to check.",
        },
        {
          id: "chat-while-wait",
          text: "Chat with the table while we wait",
          encouragement: "A lovely way to fill the wait together. Nice.",
        },
      ],
      closing:
        "Starting together shares a meal. When unsure, just ask what your table does.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, at a meal, notice your family’s custom about when to start — and follow it kindly.",
      parentPrompt:
        "Name your family’s ‘when to start’ custom out loud this week, and mention that other families do it differently.",
      completionQuestion:
        "Does your table wait for everyone, or start when the food is hot?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "This is a custom, not a universal rule. Naming your family’s way — and that others differ — teaches flexibility, not rigidity.",
      tryThis: [
        "State your family’s norm clearly: “We wait for everyone,” or “Start while it’s hot.”",
        "Mention other families do it differently, and that’s fine.",
        "Never use ‘wait’ to make a hungry young child suffer — keep it kind.",
      ],
    },
    completion: {
      title: "You finished “Waiting until everyone has some”",
      message:
        "You practised starting a meal together. It’s a warm way to share a table — and every table has its own way.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "When a meal begins — all together, after grace, after elders, or when served — varies widely; the lesson presents these as equal customs.",
    ],
    accessibilityNotes: [
      "Asking the table’s custom supports children who find unspoken rules hard to read.",
      "The lesson does not force a hungry child to wait uncomfortably long.",
    ],
    safetyNotes: [
      "The lesson affirms a child never has to eat something they don’t want, regardless of when the meal starts.",
    ],
    version: 1,
  },

  {
    id: "sunny-table-cafe-no-thank-you",
    slug: "sunny-table-cafe-no-thank-you",
    moduleId,
    order: 4,
    title: "“No thank you” is table manners too",
    description:
      "There's a food you really don't want to eat. Saying 'no thank you' kindly is good manners, not bad ones.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that declining a food kindly is polite, and your body's 'no' is valid.",
      "Name a kind way to say 'no thank you' to a food.",
      "Recognise that nobody has to eat something they don't want.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-food-you-dont-want",
        title: "The food you don’t want",
        narration:
          "Someone kindly offers you a dish you really do not want — maybe the smell is too strong, or the texture makes your mouth feel funny. They are being generous, and they are looking at you, waiting.",
        illustrationKey: "cafe-menu",
        prompt: "What could you do?",
        choices: [
          {
            id: "kind-no-thanks",
            text: "Say warmly, “No thank you, but it looks lovely.”",
            consequenceType: "helpful",
            response:
              "A kind “no thank you” is good table manners, not bad ones. You honoured the person’s generosity and your own ‘no’ at the same time — nobody has to eat a food that does not feel right for them.",
          },
          {
            id: "force-it-down",
            text: "Eat it anyway so you do not upset them.",
            consequenceType: "mixed",
            response:
              "You do not want to seem ungrateful, which is thoughtful. But your body’s ‘no’ to a food is real and worth listening to — a warm “no thank you” lets you be polite without eating something that feels wrong.",
          },
          {
            id: "no-thanks-nora-wave",
            text: "Give a friendly “no thank you” — words, or Nora’s no-thank-you wave.",
            consequenceType: "needs_context",
            response:
              "A “no thank you” can be a word or a gentle wave, like Nora’s. Both are polite. However you say it, declining a food kindly is completely allowed — your body gets a say in what it eats.",
          },
        ],
      },
    ],
    principle: {
      title: "“No thank you” to a food is good manners",
      body: "Saying no to a food you do not want — kindly — is polite, not rude. It matters because your body gets a say in what goes in it: strong smells, textures, or tastes can feel genuinely wrong, and a warm “no thank you” honours both the person offering and yourself.",
      points: [
        "A kind “no thank you” is table manners, not bad manners.",
        "Your body’s ‘no’ to a food is real; you never have to eat something that feels wrong.",
        "You can decline with words or a gentle wave — both are polite.",
        "Nobody should make you eat, taste, or finish a food you don’t want.",
      ],
    },
    practice: {
      prompt:
        "You’re offered a food you don’t want. How will you say no kindly?",
      helperText: "Pick your kind no.",
      options: [
        {
          id: "no-thanks-lovely",
          text: "“No thank you — it looks lovely though.”",
          encouragement: "Warm and polite. You honoured them and yourself.",
        },
        {
          id: "no-thanks-wave",
          text: "A friendly ‘no thank you’ wave",
          encouragement: "A wave says it too. Perfectly polite.",
        },
        {
          id: "maybe-small",
          text: "“Maybe just a little, thank you” if I want to try",
          encouragement:
            "Only if you want to. Trying is your choice, never a must.",
        },
      ],
      closing:
        "A kind ‘no thank you’ is good manners. Your body always gets a say in what it eats.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you’re offered a food you don’t want, practise a warm ‘no thank you’ — words or a wave.",
      parentPrompt:
        "Honour your child’s ‘no thank you’ to a food this week without pressure, so they learn their body’s no is respected.",
      completionQuestion:
        "When did you say ‘no thank you’ to a food, and how did it go?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Never force tastes or clean plates. Respecting a child’s food ‘no’ protects bodily autonomy and reduces mealtime battles.",
      tryThis: [
        "Accept ‘no thank you’ to foods without guilt or pressure.",
        "Offer, never impose, tastes — “you can try it or not”.",
        "Name sensory reasons kindly; a food ‘no’ is not fussiness to shame.",
      ],
    },
    completion: {
      title: "You finished “‘No thank you’ is table manners too”",
      message:
        "You practised declining a food kindly. Your body’s ‘no’ is real, and a warm ‘no thank you’ is good manners.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Pressure to eat what is offered is strong in some food cultures; the lesson respectfully centres the child’s bodily consent while keeping gratitude.",
    ],
    accessibilityNotes: [
      "This lesson directly supports children with sensory food aversions and ARFID-type needs; a food ‘no’ is validated, not pathologised.",
      "Non-verbal declining (a wave) is offered, mirroring Nora.",
    ],
    safetyNotes: [
      "The lesson affirms bodily autonomy over food — no one may force a child to eat, taste, or finish — a core consent principle.",
    ],
    version: 1,
  },

  {
    id: "sunny-table-cafe-talk-and-listen",
    slug: "sunny-table-cafe-talk-and-listen",
    moduleId,
    order: 5,
    title: "Talking and listening at the table",
    description:
      "A table is for talking as well as eating. How do you share the chat so everyone gets a turn?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that mealtime talk works best when turns are shared.",
      "Name a way to include quieter people in table conversation.",
      "Recognise that listening is part of table talk, not just talking.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-table-chat",
        title: "All the news at once",
        narration:
          "Everyone at the table has news to share, and it is all coming out at once. Jun is telling a big story, you have something exciting too, and Theo, who is quieter, has not managed to say anything yet.",
        illustrationKey: "cafe-table",
        prompt: "What could you do?",
        choices: [
          {
            id: "share-and-include",
            text: "Wait for a pause to share yours, then ask Theo about his day.",
            consequenceType: "helpful",
            response:
              "You took your turn and made room for a quieter one. Table talk is best when it goes round to everyone — sharing your news and drawing others in keeps the whole table in the conversation.",
          },
          {
            id: "talk-over",
            text: "Jump in loudly so your story gets heard first.",
            consequenceType: "mixed",
            response:
              "Your story is worth telling. But if everyone talks over everyone, nobody really hears anyone, and quiet people like Theo drop out. A pause and a turn each keeps the table together.",
          },
          {
            id: "mostly-listen",
            text: "Mostly listen, and enjoy hearing everyone’s news.",
            consequenceType: "needs_context",
            response:
              "Listening is a lovely part of table talk, and if that suits you today, it is completely fine. Just know your news is welcome too — you can share whenever you would like a turn.",
          },
        ],
      },
    ],
    principle: {
      title: "Table talk is for sharing round",
      body: "A meal is for talking and listening, and it works best when the chat goes round so everyone gets a turn. It helps because a table is one of the nicest places to feel included — and taking turns, plus drawing in quieter people, keeps everyone part of it.",
      points: [
        "Waiting for a pause lets each person share their news.",
        "Asking a quieter person about their day draws them in.",
        "Listening is part of table talk, not just talking.",
        "You can share whenever you like, and it is fine to mostly listen too.",
      ],
    },
    practice: {
      prompt: "The table is full of chat. How will you share it well?",
      helperText: "Pick what fits you.",
      options: [
        {
          id: "wait-and-share",
          text: "Wait for a pause, then share",
          encouragement: "A turn each keeps the table together. Nice.",
        },
        {
          id: "ask-someone",
          text: "Ask a quieter person about their day",
          encouragement: "Drawing someone in — that’s lovely table talk.",
        },
        {
          id: "enjoy-listening",
          text: "Enjoy listening to everyone",
          encouragement:
            "Listening is a real part of it. Your turn’s there when you want it.",
        },
      ],
      closing:
        "Share the table talk round this week. A table is a lovely place for everyone to be included.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, at a meal, share something and ask someone else about their day — so the talk goes round.",
      parentPrompt:
        "Start a ‘round the table’ share this week — each person tells one thing about their day, quieter ones invited in.",
      completionQuestion:
        "Whose news did you hear at the table, and what did you share?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Mealtimes are golden for conversation skills. A simple ‘round the table’ ritual shares the talk and includes quieter members.",
      tryThis: [
        "Run a ‘one thing about your day’ round at a meal.",
        "Draw in quieter children by name, gently.",
        "Let listening count; don’t force reluctant talkers to perform.",
      ],
    },
    completion: {
      title: "You finished “Talking and listening at the table”",
      message:
        "You practised sharing the table talk round to everyone. A table is a lovely place for all to be heard.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Norms about children’s talk at meals vary (lively chat vs quiet meals); the lesson honours both talking and listening as valid.",
    ],
    accessibilityNotes: [
      "Listening is affirmed as full participation, supporting children who find table talk demanding.",
      "The turn-taking builds on the Echo Treehouse skills without requiring speech.",
    ],
    safetyNotes: [
      "No child is pressured to talk; mostly listening is presented as a fine choice.",
    ],
    version: 1,
  },

  {
    id: "sunny-table-cafe-forks-hands-chopsticks",
    slug: "sunny-table-cafe-forks-hands-chopsticks",
    moduleId,
    order: 6,
    title: "Forks, hands, and chopsticks",
    description:
      "Around the table, people eat in different ways. Which one is the 'right' way? None — and all.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that there are many correct ways to eat, varying by food and culture.",
      "Recognise that a different way of eating is not a wrong way.",
      "Name a respectful response to an unfamiliar way of eating.",
    ],
    skillArea,
    scenes: [
      {
        id: "many-ways-to-eat",
        title: "Around the table",
        narration:
          "At the big shared meal, Amara is eating with her hands, Jun is using chopsticks, and you have a fork. All the food is going in happily, just in different ways. Someone new looks around, unsure which is ‘right’.",
        illustrationKey: "cafe-table",
        prompt: "What could you say or do?",
        choices: [
          {
            id: "all-ways-fine",
            text: "Say, “Everyone eats their own way here — hands, forks, chopsticks, all good.”",
            consequenceType: "helpful",
            response:
              "You made it clear there is no single ‘right’ way to eat. Forks, hands, and chopsticks are all proper ways — which one fits depends on the food and the family, and every one of them belongs at the table.",
          },
          {
            id: "call-one-wrong",
            text: "Tell Amara she should use a fork like you.",
            consequenceType: "mixed",
            response:
              "You know your way, and that is good. But telling someone their way is wrong turns a difference into a put-down. Eating with hands is correct for lots of foods and families — different is not wrong.",
          },
          {
            id: "curious-question",
            text: "Ask Jun, with curiosity, how the chopsticks work.",
            consequenceType: "needs_context",
            response:
              "A lovely, curious question — interested, not judging. Asking to learn about a way of eating (rather than calling it odd) is a warm way to meet something new, and Jun will probably love to show you.",
          },
        ],
      },
    ],
    principle: {
      title: "There is no single right way to eat",
      body: "People eat with forks, spoons, hands, chopsticks, bread, and more — and which is ‘right’ depends on the food and the family, not on one rule. It matters because calling someone’s way wrong turns a rich difference into a put-down, when really every one of these ways belongs at the table.",
      points: [
        "Forks, hands, chopsticks, and more are all proper ways to eat.",
        "Which way fits depends on the food and the family.",
        "A different way of eating is not a wrong way.",
        "Being curious about a new way — not judging it — is the kind response.",
      ],
    },
    practice: {
      prompt: "Someone eats in a way that’s new to you. How will you respond?",
      helperText: "Pick the respectful response.",
      options: [
        {
          id: "all-good",
          text: "Know that all these ways are fine",
          encouragement: "Every way belongs at the table. You’ve got it.",
        },
        {
          id: "ask-curious",
          text: "Ask about it with curiosity",
          encouragement:
            "Interested, not judging. A warm way to meet something new.",
        },
        {
          id: "try-their-way",
          text: "Maybe try their way, if invited",
          encouragement:
            "Trying with an open mind is lovely — only if you’d like to.",
        },
      ],
      closing:
        "There’s no one right way to eat. Meet different ways with curiosity, not judgement.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, notice a different way of eating — maybe try eating something with your hands or chopsticks — and remember all the ways are fine.",
      parentPrompt:
        "Share a meal or food eaten a different way this week, and talk about how forks, hands, and chopsticks are all correct.",
      completionQuestion: "What different way of eating did you notice or try?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Framing eating styles as equal, food-dependent choices heads off ‘that’s weird’ reactions and builds respect for difference.",
      tryThis: [
        "Name eating styles as equal: “Hands are right for this; chopsticks for that.”",
        "Try foods eaten different ways together, with curiosity.",
        "Correct ‘that’s wrong’ gently to ‘that’s their way’.",
      ],
    },
    completion: {
      title: "You finished “Forks, hands, and chopsticks”",
      message:
        "You practised meeting different ways of eating with curiosity. There’s no single right way — they all belong at the table.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "This lesson directly affirms that eating with hands, chopsticks, or utensils are all correct, food- and culture-dependent — never ranking one as proper.",
      "It is flagged for cultural sensitivity and avoids exoticising any way of eating.",
    ],
    accessibilityNotes: [
      "Openness to different eating tools also supports children who use adapted utensils or eat in non-standard ways.",
      "The lesson does not require mastering any particular utensil.",
    ],
    safetyNotes: [
      "The lesson keeps trying new ways optional, never pressured, preserving the child’s choice.",
    ],
    version: 1,
  },

  {
    id: "sunny-table-cafe-helping-clear-up",
    slug: "sunny-table-cafe-helping-clear-up",
    moduleId,
    order: 7,
    title: "Helping clear up",
    description:
      "The meal is over and the table is a happy mess. Sharing the clear-up is part of sharing the meal.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that helping clear up is part of sharing a meal.",
      "Name a way to help after a meal.",
      "Recognise that thanking whoever cooked completes the shared meal.",
    ],
    skillArea,
    scenes: [
      {
        id: "after-the-meal",
        title: "The happy mess",
        narration:
          "The meal was delicious and now the table is covered in plates, cups, and crumbs. Everyone is full and comfy, and it would be easy to just wander off and leave it. Someone made all this food.",
        illustrationKey: "cafe-table",
        prompt: "What could you do?",
        choices: [
          {
            id: "help-clear",
            text: "Carry your plate over and help clear a few things, and thank the cook.",
            consequenceType: "helpful",
            response:
              "You helped clear up and thanked whoever cooked — the meal shared right to the end. Clearing up together means it does not all land on one person, and a thank-you finishes it warmly.",
          },
          {
            id: "wander-off",
            text: "Wander off and leave the whole table for someone else.",
            consequenceType: "mixed",
            response:
              "You are full and comfy, so drifting off is tempting. But if everyone leaves, the clear-up lands on one tired person — usually whoever also did the cooking. A little help shares that load.",
          },
          {
            id: "ask-how-to-help",
            text: "Ask, “What can I do to help clear up?”",
            consequenceType: "needs_context",
            response:
              "A kind offer, especially at someone else’s table where you might not know the routine. Whoever cooked can point you to the useful job — stacking plates, wiping, or carrying things through.",
          },
        ],
      },
    ],
    principle: {
      title: "Clearing up shares the meal to the end",
      body: "A shared meal includes the clear-up, not just the eating. It helps because someone cooked and set it all up — and everyone lending a hand at the end, plus a thank-you, means the whole thing was shared, and no one person is left with the mess.",
      points: [
        "Carrying your own plate over is an easy first help.",
        "Clearing up together stops it all landing on one tired person.",
        "Thanking whoever cooked completes the shared meal.",
        "Offering to help is kind at someone else’s table, where routines differ.",
      ],
    },
    practice: {
      prompt: "The meal is over and there’s a mess. How will you help?",
      helperText: "Pick a way to pitch in.",
      options: [
        {
          id: "carry-plate",
          text: "Carry my own plate over",
          encouragement: "An easy, real help. A good start.",
        },
        {
          id: "thank-cook",
          text: "Thank whoever cooked",
          encouragement: "That completes the meal warmly. Lovely.",
        },
        {
          id: "offer-clear",
          text: "Ask what I can do to clear up",
          encouragement: "Offering is kind, especially at someone’s table.",
        },
      ],
      closing:
        "Share the clear-up this week. A meal is shared right to the last plate.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, after a meal, help clear up — carry your plate, wipe, or stack — and thank whoever cooked.",
      parentPrompt:
        "Make clearing up a shared, cheerful routine this week, and let your child thank the cook as part of it.",
      completionQuestion:
        "How did you help clear up, and did you thank the cook?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Sharing the clear-up teaches that a meal is a whole team effort. Doing it together beats assigning it as a chore.",
      tryThis: [
        "Clear up together, cheerfully, rather than assigning it.",
        "Build in thanking the cook as part of the routine.",
        "Give an age-right job: carrying, wiping, stacking.",
      ],
    },
    completion: {
      title: "You finished “Helping clear up”",
      message:
        "You practised sharing the clear-up and thanking the cook. A meal is shared right to the last plate.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Who clears and how varies by family; the lesson frames pitching in and thanking as shared, without prescribing a routine.",
    ],
    accessibilityNotes: [
      "Offering and asking what to do supports children who need a clear job rather than reading the scene.",
      "Any level of help — even carrying one plate — is counted.",
    ],
    safetyNotes: [
      "Clearing up is kept age-appropriate; the lesson doesn’t imply children handle hot or heavy items unsupervised.",
    ],
    version: 1,
  },

  {
    id: "sunny-table-cafe-review",
    slug: "sunny-table-cafe-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "One whole shared meal, from setting up to clearing away — everything about eating together.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together passing, waiting, table talk, and respecting food choices.",
      "Choose a dining move that fits a real moment.",
      "Carry one eating-together skill into a real meal.",
    ],
    skillArea,
    scenes: [
      {
        id: "a-whole-meal",
        title: "The whole shared meal",
        narration:
          "A big meal is happening under the café umbrella. There is setting up, passing dishes round, waiting for everyone, lots of table talk, different ways of eating, a food you would rather not have — and the clear-up to come. It is all of eating together, at once.",
        illustrationKey: "cafe-table",
        prompt:
          "Someone offers you a food you don’t want, mid-meal. What do you do?",
        choices: [
          {
            id: "kind-no-and-pass",
            text: "Say a warm “no thank you”, and offer to pass it on to someone who’d like it.",
            consequenceType: "helpful",
            response:
              "You honoured your own ‘no’ and kept the table flowing — declining kindly and passing the dish along. That is eating together at its best: your body’s say and everyone’s share, both respected.",
          },
          {
            id: "eat-to-please",
            text: "Eat it to avoid seeming rude.",
            consequenceType: "mixed",
            response:
              "You do not want to seem ungrateful, which is kind. But a warm “no thank you” is good manners too — your body gets a say, and you can be polite without eating something that feels wrong.",
          },
          {
            id: "no-and-curious",
            text: "Say “no thank you” for now, and ask what’s in it, curious.",
            consequenceType: "needs_context",
            response:
              "A lovely balance — you kept your ‘no’ and stayed curious and warm about the food and whoever made it. You can always learn about a dish without having to eat it.",
          },
        ],
      },
    ],
    principle: {
      title: "Eating together shares a table in every way",
      body: "Everything in this world comes together at the table: setting up, passing kindly, waiting for each other, sharing the talk, honouring different ways of eating, and clearing up. It helps because a shared meal is one of the warmest things people do — and it works when everyone shares, and everyone’s body and choices are respected.",
      points: [
        "Help set up, pass kindly, and share the clear-up.",
        "Take turns in the table talk, and draw quieter people in.",
        "All ways of eating belong; different is not wrong.",
        "“No thank you” to a food is good manners, and no one may make you eat.",
      ],
    },
    practice: {
      prompt:
        "Pick the eating-together skill you want to take out into the real world this week.",
      helperText: "There is no wrong choice — pick what you want to practise.",
      options: [
        {
          id: "practise-passing",
          text: "Passing things kindly",
          encouragement: "Keeps the table calm and flowing. Great pick.",
        },
        {
          id: "practise-talk",
          text: "Sharing the table talk",
          encouragement: "A table where everyone’s heard. Lovely.",
        },
        {
          id: "practise-ways",
          text: "Respecting all ways of eating",
          encouragement: "Curiosity over judgement. A kind thing to practise.",
        },
        {
          id: "practise-no-thanks",
          text: "A kind ‘no thank you’ to food",
          encouragement: "Your body’s say, said politely. Strong choice.",
        },
      ],
      closing:
        "Take your one eating-together skill to a real meal this week. A shared table is yours to share now.",
    },
    offlineMission: {
      childPrompt:
        "This week, at a real shared meal, put it together: help set up, pass kindly, share the talk, and clear up — your body’s ‘no’ always respected.",
      parentPrompt:
        "Give your child a full role at one shared meal this week — setting up, passing, table talk, clear-up — and honour any food ‘no’ without pressure.",
      completionQuestion:
        "Which part of eating together did you enjoy most this week?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "One relaxed shared meal exercises this whole world. Keep food choices under the child’s consent and it stays a warm place, not a battleground.",
      tryThis: [
        "Give a full mealtime role and let them own it.",
        "Run a ‘round the table’ share and a shared clear-up.",
        "Never pressure eating; a food ‘no’ is always respected.",
      ],
    },
    completion: {
      title: "You finished “Eating Together”",
      message:
        "You put it all together — setting up, passing, waiting, talking, respecting every way, and clearing up. Take it to a real table this week.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review keeps table customs — when to start, how to eat, what to offer — as equal and varied, never ranked.",
    ],
    accessibilityNotes: [
      "Every dining skill has a form that respects sensory needs and does not require speaking or a particular utensil.",
      "A food ‘no’ and mostly-listening are both fully valid routes through the review.",
    ],
    safetyNotes: [
      "The closing principle reaffirms bodily autonomy over food — no one may make a child eat, taste, or finish anything.",
    ],
    version: 1,
  },
];
