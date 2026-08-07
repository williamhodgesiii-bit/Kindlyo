import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 5 — Bridge Builders Bay · module "Making Things Right".
 *
 * DRAFT CONTENT (docs/CURRICULUM_PRINCIPLES.md). Not specialist-reviewed; every
 * lesson stays `status: "draft"`.
 *
 * Grounded in research on repair over forced apology: a coerced "sorry" teaches
 * performance, not empathy, and children are only reliably empathetic from
 * around 7–8. So these lessons teach repair — checking the person is okay,
 * fixing what broke, naming what you'll do differently — and treat "sorry" as a
 * start, not the whole thing. Crucially, accepting an apology has no deadline,
 * the upset person may need time, and "no" and leaving stay available
 * throughout. Amara is growing in apologies and repair (CHARACTER_BIBLE.md).
 *
 * No choice is "correct"; `consequenceType` records what tends to follow. This
 * module is never used to pressure a child into forgiving.
 */

const skillArea = "repair" as const;
const moduleId = "bridge-builders-bay";

export const bridgeBuildersBayLessons: Lesson[] = [
  {
    id: "bridge-builders-bay-when-it-goes-wrong",
    slug: "bridge-builders-bay-when-it-goes-wrong",
    moduleId,
    order: 1,
    title: "When something goes wrong",
    description:
      "You knocked over Jun's tower by accident. Your tummy drops. What comes first?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that when something goes wrong, checking on the person comes before anything else.",
      "Recognise that accidents happen and are not the same as being bad.",
      "Name a first thing to do after a mistake.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-knocked-tower",
        title: "The tower falls",
        narration:
          "You turned around too fast on the bridge platform and your elbow caught Jun's tall block tower. It clatters down. Jun stares at the pieces, and your tummy drops — you did not mean to.",
        illustrationKey: "bay-platform",
        prompt: "What comes first?",
        choices: [
          {
            id: "check-on-jun",
            text: "Check on Jun: “Oh no — are you okay? I didn’t mean to.”",
            consequenceType: "helpful",
            response:
              "You put the person before the pieces. Checking on Jun tells him you care how he feels, which matters far more than the tower — and it makes the next steps easier.",
          },
          {
            id: "it-was-accident",
            text: "Say quickly, “It was an accident!” and leave it there.",
            consequenceType: "mixed",
            response:
              "It really was an accident — that part is true and worth saying. But if that is all you say, Jun is left with his fallen tower and his feelings. Checking on him first lands very differently.",
          },
          {
            id: "freeze-unsure",
            text: "Freeze, unsure what to do, feeling bad.",
            consequenceType: "needs_context",
            response:
              "Feeling bad after a mistake is normal, and taking a breath is okay. When you are ready, turning to Jun — even just “are you okay?” — is a kind and brave first step out of the frozen feeling.",
          },
        ],
      },
    ],
    principle: {
      title: "The person comes before the pieces",
      body: "When something goes wrong, the first thing is not the broken thing — it is the person. Checking how they are tells them you care about them, not just about not getting in trouble. That is what starts to make things right.",
      points: [
        "Accidents happen to everyone; having one does not make you a bad person.",
        "Checking “are you okay?” puts the person first, before the mess.",
        "Feeling bad is normal — a breath first is fine, then turn toward the person.",
        "If someone is hurt, tell a grown-up straight away; some wrongs need an adult’s help.",
      ],
    },
    practice: {
      prompt:
        "Something has gone wrong and someone is upset. What is your first move?",
      helperText: "Pick the first thing you would do.",
      options: [
        {
          id: "are-you-okay",
          text: "Ask “are you okay?”",
          encouragement: "Person first. That is exactly the right start.",
        },
        {
          id: "take-a-breath",
          text: "Take a breath, then turn to them",
          encouragement:
            "A calm breath helps, then you can be there for them. Good.",
        },
        {
          id: "get-help",
          text: "Get a grown-up if someone is hurt",
          encouragement: "Wise — some things need an adult straight away.",
        },
      ],
      closing:
        "When something goes wrong, start with the person. Everything else gets easier after that.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if something goes wrong, practise checking on the person first — before worrying about the mess.",
      parentPrompt:
        "When a small accident happens this week, model “are you okay?” before anything about the spill or the break.",
      completionQuestion:
        "When something went wrong, how did you check on the person?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Leading with “are you okay?” instead of “who did this?” teaches repair over blame — the foundation of this whole world.",
      tryThis: [
        "React to accidents with concern first, not interrogation.",
        "Separate the deed from the child: “That was an accident, not a bad you.”",
        "Model your own repairs out loud when you get something wrong.",
      ],
    },
    completion: {
      title: "You finished “When something goes wrong”",
      message:
        "You practised putting the person before the pieces. Checking on someone is the first step to making anything right.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson avoids shame and blame framing, which some traditions lean on heavily; it centres care for the person instead.",
    ],
    accessibilityNotes: [
      "Freezing after a mistake is treated with understanding, supporting children who need a moment to regulate.",
      "The situation is fully narrated, not carried by facial cues alone.",
    ],
    safetyNotes: [
      "Children are told to fetch a grown-up if anyone is hurt, so repair never replaces getting real help.",
    ],
    version: 1,
  },

  {
    id: "bridge-builders-bay-more-than-sorry",
    slug: "bridge-builders-bay-more-than-sorry",
    moduleId,
    order: 2,
    title: "More than “sorry”",
    description:
      "“Sorry” is a start — but Jun's tower is still on the floor. What makes an apology mean something?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that repair — fixing or helping — makes an apology mean something.",
      "Name an act of repair you could offer.",
      "Recognise that a repair is offered, and the other person chooses whether to accept.",
    ],
    skillArea,
    scenes: [
      {
        id: "sorry-and-then",
        title: "After “sorry”",
        narration:
          "You have said sorry to Jun for knocking his tower, and you meant it. But the blocks are still scattered, and Jun still looks flat. A word on its own has not put the tower back.",
        illustrationKey: "bay-platform",
        prompt: "What could you do now?",
        choices: [
          {
            id: "offer-to-rebuild",
            text: "Offer: “Can I help you build it back up?”",
            consequenceType: "helpful",
            response:
              "Now your sorry has hands on it. Helping rebuild shows Jun you mean it — a repair you do says far more than a word you say.",
          },
          {
            id: "sorry-is-enough",
            text: "Decide “I said sorry” is enough and go back to your game.",
            consequenceType: "mixed",
            response:
              "You did say sorry, and that counts. But walking off leaves Jun with the mess and the feeling. Offering to help would turn the word into something he can feel.",
          },
          {
            id: "ask-what-helps",
            text: "Ask Jun, “What would help?”",
            consequenceType: "needs_context",
            response:
              "A great question — the person who was upset knows best what would help. Maybe he wants a hand, maybe some space. Asking lets him choose the repair instead of you guessing.",
          },
        ],
      },
    ],
    principle: {
      title: "A repair is a sorry you can see",
      body: "“Sorry” is a good start, but repair is what makes it real — helping fix what broke, or asking what would help. It matters because the other person feels a repair, while a word can float past; doing something says “I care” more loudly than saying it.",
      points: [
        "Repair means an action: helping rebuild, fetching a cloth, checking they’re okay.",
        "Asking “what would help?” lets the upset person choose the repair.",
        "A repair is offered — the other person decides whether to accept it, and when.",
        "You never owe anyone a repair for standing up for your own safety or saying no.",
      ],
    },
    practice: {
      prompt: "You’ve said sorry. What repair could you offer?",
      helperText: "Pick a repair that fits.",
      options: [
        {
          id: "help-fix",
          text: "Offer to help fix what happened",
          encouragement: "Hands-on repair — that’s a sorry someone can feel.",
        },
        {
          id: "ask-what-helps",
          text: "Ask “what would help?”",
          encouragement:
            "Letting them choose the repair is thoughtful and kind.",
        },
        {
          id: "make-something",
          text: "Do a kind thing, like drawing them a card",
          encouragement: "A small kindness can carry a big meaning. Lovely.",
        },
      ],
      closing:
        "Let your next sorry have hands on it. A repair you do means more than a word alone.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you upset someone, offer a repair — help fix it, or ask what would help.",
      parentPrompt:
        "When your child says sorry this week, gently ask, “How could you help make it right?” to add repair to the word.",
      completionQuestion:
        "What repair did you offer, and did the other person accept it?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Research is clear: forced “sorry” teaches performance. Coaching repair — “how can you help?” — builds real empathy instead.",
      tryThis: [
        "Add a repair to apologies: “What could make this better?”",
        "Model your own repairs, not just your apologies.",
        "Let the wronged child choose whether and when to accept — never force it.",
      ],
    },
    completion: {
      title: "You finished “More than ‘sorry’”",
      message:
        "You practised turning a sorry into a repair you can do. That is what makes an apology mean something.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Apology and repair customs vary widely; the lesson favours action-based repair and asking the person, over a single required phrase.",
    ],
    accessibilityNotes: [
      "Non-verbal repairs (helping, making something) are offered for children who find spoken apology hard.",
      "The lesson does not require eye contact or a scripted phrase.",
    ],
    safetyNotes: [
      "Children are told they never owe a repair for protecting their own safety or saying no, so this is not used to guilt them.",
    ],
    version: 1,
  },

  {
    id: "bridge-builders-bay-what-ill-do-differently",
    slug: "bridge-builders-bay-what-ill-do-differently",
    moduleId,
    order: 3,
    title: "Saying what you'll do differently",
    description:
      "The same thing keeps happening. A real apology often includes what you'll try to change.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that naming what you'll do differently helps rebuild trust.",
      "Recognise that a guarantee to try can mean more than the word 'sorry'.",
      "Understand that trying and sometimes slipping is part of learning, not failing.",
    ],
    skillArea,
    scenes: [
      {
        id: "again-the-same",
        title: "The same wobble again",
        narration:
          "You have bumped Theo's careful drawing with your bucket twice now, at the same spot on the crowded platform. Theo is patient, but you can tell he is bracing for it to happen a third time.",
        illustrationKey: "bay-boat",
        prompt: "What could you add to your sorry this time?",
        choices: [
          {
            id: "name-the-change",
            text: "Say, “Sorry — I’ll keep my bucket on the other side from now on.”",
            consequenceType: "helpful",
            response:
              "You told Theo what you’ll do differently, which is what rebuilds trust. A guarantee to try — something he can actually count on — often means more to him than the word ‘sorry’ by itself.",
          },
          {
            id: "just-sorry-again",
            text: "Just say “sorry” again, the same as last time.",
            consequenceType: "mixed",
            response:
              "Saying sorry is not nothing. But if nothing changes, Theo starts to expect a fourth bump. Naming a small change is what tells him it will really be different.",
          },
          {
            id: "ask-how-to-fix",
            text: "Ask Theo, “How can I stop bumping it?”",
            consequenceType: "needs_context",
            response:
              "A humble, useful question — Theo may have the perfect answer, like moving his paper. Asking works well as long as you then actually do the thing you agree on.",
          },
        ],
      },
    ],
    principle: {
      title: "A change you name is a promise they can feel",
      body: "When you say what you’ll do differently, you give the other person something to trust. It helps because it turns “sorry” from a word into a plan — and it is often the plan, not the word, that mends the wobble between you.",
      points: [
        "Naming a small, real change — “I’ll keep my bucket over here” — rebuilds trust.",
        "A guarantee to try can mean more to someone than the word ‘sorry’ alone.",
        "You might slip and have to try again; that is learning, not failing.",
        "Only promise what you can really do; a promise you can’t keep hurts more than none.",
      ],
    },
    practice: {
      prompt: "You want your apology to stick this time. What could you add?",
      helperText: "Pick the kind of thing you might say.",
      options: [
        {
          id: "ill-try",
          text: "Name one thing you’ll try to do differently",
          encouragement:
            "A change they can count on. That’s what rebuilds trust.",
        },
        {
          id: "ask-them",
          text: "Ask them how you could stop it happening",
          encouragement: "Humble and smart — they may know the perfect fix.",
        },
        {
          id: "small-real",
          text: "Promise one small, real thing",
          encouragement: "Small and real beats big and shaky. Good instinct.",
        },
      ],
      closing:
        "A sorry with a plan is a sorry that sticks. Try naming one small change next time.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you say sorry for something that keeps happening, add one small thing you’ll try to do differently.",
      parentPrompt:
        "When apologising to your child, model naming the change: “Sorry I was sharp — I’ll take a breath next time.”",
      completionQuestion:
        "What did you say you’d do differently, and how did it go?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘What will you do differently?’ turns apology into learning. Modelling your own changes teaches it fastest.",
      tryThis: [
        "Add a plan to your own apologies, so children hear the pattern.",
        "Keep changes small and real; celebrate the trying, not perfection.",
        "Treat slip-ups as practice: “You tried — let’s try again.”",
      ],
    },
    completion: {
      title: "You finished “Saying what you'll do differently”",
      message:
        "You practised adding a plan to your sorry. Naming a small change is how trust gets rebuilt.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson emphasises trustworthy change over performance of remorse, which travels across different apology customs.",
    ],
    accessibilityNotes: [
      "Asking the other person how to fix it suits children who find it hard to generate a plan alone.",
      "The lesson frames slip-ups compassionately, supporting children with impulse-control differences.",
    ],
    safetyNotes: [
      "The lesson warns against over-promising, so a child isn’t set up to feel like a failure or a liar.",
    ],
    version: 1,
  },

  {
    id: "bridge-builders-bay-when-someone-says-sorry",
    slug: "bridge-builders-bay-when-someone-says-sorry",
    moduleId,
    order: 4,
    title: "When someone says sorry to you",
    description:
      "Amara says sorry for something that hurt. You are allowed to take your time.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that accepting an apology has no deadline and cannot be demanded.",
      "Name kind ways to respond to an apology, including asking for time.",
      "Recognise that your feelings are yours, and nobody can make you say 'it's fine'.",
    ],
    skillArea,
    scenes: [
      {
        id: "amara-says-sorry",
        title: "Amara’s apology",
        narration:
          "Amara says sorry — she took your spot on the good platform and would not move, and it upset you. Now she means it, and she is waiting to see what you will say. You still feel a bit wobbly about it.",
        illustrationKey: "bay-platform",
        prompt: "What could you say?",
        choices: [
          {
            id: "honest-response",
            text: "Say honestly, “Thanks for saying sorry. I’m still a bit upset, but I hear you.”",
            consequenceType: "helpful",
            response:
              "You accepted her apology without pretending you feel fine. That is honest and kind at once — you can hear a sorry and still need a little time for the wobbly feeling to settle.",
          },
          {
            id: "say-its-fine",
            text: "Say “it’s fine” quickly, even though it still stings.",
            consequenceType: "mixed",
            response:
              "Saying “it’s fine” smooths the moment, and sometimes that is what you want. But if it is not really fine, you do not have to pretend — your feelings are allowed to be honest.",
          },
          {
            id: "ask-for-time",
            text: "Say, “I heard you. I need a little time.”",
            consequenceType: "needs_context",
            response:
              "Completely allowed. Accepting an apology has no clock on it. Taking time is not being mean — it is being honest about needing the feeling to settle before you are ready.",
          },
        ],
      },
    ],
    principle: {
      title: "Accepting an apology has no deadline",
      body: "When someone says sorry, you can hear it, and you can also still be upset — both at once. It matters because your feelings are yours: nobody gets to decide you are ‘over it’, and ‘it’s fine’ should be true when you say it, not just polite.",
      points: [
        "You can accept an apology and still need time; the two go together.",
        "Nobody can make you say “it’s fine” — your feelings are yours to be honest about.",
        "Saying “thank you for saying sorry, I need a bit” is kind and honest.",
        "If someone hurt you on purpose or keeps doing it, you can say no to them and tell a trusted adult — you do not have to forgive to stay safe.",
      ],
    },
    practice: {
      prompt:
        "Someone says sorry, and you still feel wobbly. How could you answer?",
      helperText: "Any honest answer here is okay.",
      options: [
        {
          id: "thanks-and-time",
          text: "“Thanks. I need a little time.”",
          encouragement: "Honest and kind. Your feelings get to be real.",
        },
        {
          id: "hear-you",
          text: "“I hear you” — without pretending it’s all fine",
          encouragement:
            "You can receive a sorry without faking okay. Well said.",
        },
        {
          id: "im-ready",
          text: "“Thanks — I’m okay now” if you really are",
          encouragement:
            "If it’s true, that’s lovely. Only when it’s true, though.",
        },
      ],
      closing:
        "You are allowed to take your time with a sorry. ‘It’s fine’ should be true when you say it.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if someone says sorry, practise answering honestly — even if that means saying you need a little time.",
      parentPrompt:
        "When siblings apologise, don’t rush the “it’s fine.” Let the hurt child take the time they need to mean it.",
      completionQuestion:
        "When someone said sorry, how did you feel, and what did you say?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Never make a child say “it’s okay” before they mean it. Honouring their timing teaches that their feelings and consent are real.",
      tryThis: [
        "Allow “I need time” as a full, respected response.",
        "Don’t coerce reconciliation; let it be genuine.",
        "Make clear that forgiving is never required to be safe from repeated harm.",
      ],
    },
    completion: {
      title: "You finished “When someone says sorry to you”",
      message:
        "You practised answering an apology honestly — including taking your time. Your feelings belong to you, on your clock.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson resists any custom of instant, obligatory forgiveness, centring the wronged child’s honest feelings.",
    ],
    accessibilityNotes: [
      "‘I need time’ is offered for children who process feelings slowly or find quick responses hard.",
      "The lesson does not require a particular phrase or facial expression.",
    ],
    safetyNotes: [
      "Children are told forgiveness is never required to be protected from repeated or deliberate harm, and to tell a trusted adult.",
    ],
    version: 1,
  },

  {
    id: "bridge-builders-bay-when-youre-still-upset",
    slug: "bridge-builders-bay-when-youre-still-upset",
    moduleId,
    order: 5,
    title: "When you're still upset",
    description:
      "The sorry has been said, but the feeling is still big. What can you do with a feeling that hasn't gone yet?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that big feelings take time to settle, even after a repair.",
      "Name a way to look after a big feeling.",
      "Recognise that stepping away to cool down is allowed and healthy.",
    ],
    skillArea,
    scenes: [
      {
        id: "still-big",
        title: "The feeling that stays",
        narration:
          "Everyone has said sorry and the game could carry on. But your chest still feels tight and hot about what happened, and you are not ready to laugh along yet.",
        illustrationKey: "bay-boat",
        prompt: "What could you do with the big feeling?",
        choices: [
          {
            id: "step-away-breathe",
            text: "Step to a quiet spot and take some slow breaths until it settles.",
            consequenceType: "helpful",
            response:
              "You gave the feeling somewhere to go. Stepping away to cool down is not sulking — it is looking after yourself, and you can rejoin when you are ready.",
          },
          {
            id: "push-it-down",
            text: "Push the feeling down and pretend to be fine.",
            consequenceType: "mixed",
            response:
              "You can carry on for now, and sometimes that is okay. But a big feeling that gets stuffed down often pops out later, bigger. Giving it a moment usually helps it settle faster.",
          },
          {
            id: "tell-someone",
            text: "Tell a grown-up or friend how you are feeling.",
            consequenceType: "needs_context",
            response:
              "Naming a feeling to someone you trust can make it smaller. It helps most when you pick someone safe — and it is always okay to ask for that quiet company.",
          },
        ],
      },
    ],
    principle: {
      title: "Big feelings need a little time",
      body: "Even after everyone has made up, a big feeling can still be there — and that is normal. It helps to give it somewhere to go, because feelings that get room settle faster than feelings that get stuffed down.",
      points: [
        "A feeling can stay after a repair; you are not doing it wrong.",
        "Stepping away to breathe or cool down is looking after yourself, not sulking.",
        "Naming a feeling to a trusted person can make it smaller.",
        "You can rejoin whenever you are ready — there is no rush and no deadline.",
      ],
    },
    practice: {
      prompt: "A big feeling is still with you. How will you look after it?",
      helperText: "Pick what helps you feel calmer.",
      options: [
        {
          id: "breathe",
          text: "Take slow breaths in a quiet spot",
          encouragement: "Giving the feeling room and air. That really helps.",
        },
        {
          id: "tell-trusted",
          text: "Tell someone I trust how I feel",
          encouragement: "Naming it to a safe person shrinks it. Good move.",
        },
        {
          id: "cool-down-time",
          text: "Take some cool-down time before rejoining",
          encouragement: "Rejoin when you’re ready — there’s no clock on it.",
        },
      ],
      closing:
        "Big feelings settle when you give them time and room. Try a cool-down spot when one is too big.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, when a feeling gets big, try a cool-down — breaths, a quiet spot, or telling someone — and rejoin when you’re ready.",
      parentPrompt:
        "Set up a comfy ‘cool-down’ spot at home and treat using it as a strength, never a punishment.",
      completionQuestion: "What helped your big feeling settle down?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Cooling down is emotional regulation, still developing at this age. A calm-down spot works best framed as a tool, not a time-out punishment.",
      tryThis: [
        "Offer a cozy calm-down space and use one yourself.",
        "Name feelings without rushing them: “You’re still upset — that’s okay.”",
        "Never force re-joining before a child is ready.",
      ],
    },
    completion: {
      title: "You finished “When you're still upset”",
      message:
        "You practised looking after a big feeling and rejoining when ready. Feelings that get room settle sooner.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Families express and manage feelings differently; the lesson offers several ways to cool down rather than one prescribed method.",
    ],
    accessibilityNotes: [
      "Stepping away to self-regulate is affirmed, which matters for children who become overwhelmed or overstimulated.",
      "The lesson does not require a child to talk about the feeling if they would rather use quiet or breathing.",
    ],
    safetyNotes: [
      "Telling a trusted person is encouraged, and choosing a safe person is named explicitly.",
    ],
    version: 1,
  },

  {
    id: "bridge-builders-bay-fixing-it-together",
    slug: "bridge-builders-bay-fixing-it-together",
    moduleId,
    order: 6,
    title: "Fixing it together",
    description:
      "The bridge broke when you and Maya both pulled. Mending it side by side is its own kind of sorry.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that fixing something together can repair the friendship, not just the object.",
      "Recognise that when both people share a mistake, both can share the repair.",
      "Understand that working side by side can rebuild good feeling after a wobble.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-broken-bridge",
        title: "The bridge gives way",
        narration:
          "You and Maya both grabbed the plank bridge to be first across, pulled opposite ways, and a section popped loose and fell. Neither of you meant to break it. Now it lies in pieces between you, and you are both a bit cross.",
        illustrationKey: "bay-bridge",
        prompt: "What could you do?",
        choices: [
          {
            id: "fix-together",
            text: "Say, “We both pulled — want to fix it together?”",
            consequenceType: "helpful",
            response:
              "You named that it was both of you and offered to mend it side by side. Fixing it together repairs more than the bridge — it puts the good feeling back between you two as well.",
          },
          {
            id: "blame-maya",
            text: "Tell Maya it was her fault and wait for her to fix it.",
            consequenceType: "mixed",
            response:
              "It is tempting to hand the blame over. But you both pulled, and pinning it all on Maya leaves the bridge broken and the crossness sitting there. Sharing the fix would clear both.",
          },
          {
            id: "get-a-grownup",
            text: "Ask a grown-up to help you both put it back safely.",
            consequenceType: "needs_context",
            response:
              "If the bridge is heavy or tricky, asking an adult to help you both rebuild it is sensible. The repair still counts as shared — you are fixing it together, just with a helper.",
          },
        ],
      },
    ],
    principle: {
      title: "Mending it together mends more than the thing",
      body: "When a wobble was down to both of you, fixing it together shares the repair the way you shared the mistake. It helps because working side by side puts the good feeling back — you end up as a team again, not two people blaming each other.",
      points: [
        "When both people share a mistake, both can share the fixing.",
        "Working side by side rebuilds the friendship, not just the object.",
        "Naming “we both did it” is fairer than handing all the blame across.",
        "For anything heavy or breakable, asking a grown-up to help fix it is wise.",
      ],
    },
    practice: {
      prompt:
        "Something broke and it was both of you. How will you make it right?",
      helperText: "Pick the shared-repair move you like.",
      options: [
        {
          id: "fix-side-by-side",
          text: "Offer to fix it together",
          encouragement:
            "Sharing the repair puts the team back together. Lovely.",
        },
        {
          id: "name-both",
          text: "Say “we both did it” and share the fix",
          encouragement: "Fair and honest. That clears the crossness too.",
        },
        {
          id: "ask-helper",
          text: "Ask a grown-up to help you both mend it",
          encouragement: "Smart for anything tricky — still a shared repair.",
        },
      ],
      closing:
        "When a mistake was shared, share the fixing. Mending it together mends you two as well.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if something goes wrong with someone else, try fixing or sorting it out together instead of deciding whose fault it was.",
      parentPrompt:
        "Next shared mishap (a spill, a knocked-over game), invite a joint clean-up rather than a blame hunt.",
      completionQuestion:
        "What did you fix together, and how did it feel afterwards?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘Fix it together’ replaces the courtroom of ‘whose fault?’ with the workshop of repair — and rebuilds the relationship in the process.",
      tryThis: [
        "Invite joint repair instead of assigning blame.",
        "Name shared responsibility fairly when it really was shared.",
        "Help with heavy or tricky fixes, keeping it a team effort.",
      ],
    },
    completion: {
      title: "You finished “Fixing it together”",
      message:
        "You practised mending a shared mistake side by side. Fixing it together puts the friendship back, not just the bridge.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson favours shared repair over blame assignment, avoiding a winner/loser or fault-finding frame.",
    ],
    accessibilityNotes: [
      "Asking an adult to help rebuild is offered without stigma for children who need support with the task.",
      "The scenario is carried in narration, not by tone or expression alone.",
    ],
    safetyNotes: [
      "Children are guided to get adult help for anything heavy or breakable, keeping the physical repair safe.",
    ],
    version: 1,
  },

  {
    id: "bridge-builders-bay-no-and-still-friends",
    slug: "bridge-builders-bay-no-and-still-friends",
    moduleId,
    order: 7,
    title: "Saying no and staying friends",
    description:
      "Your friend wants you to do something you don't want to do. You can say no clearly — and still be friends.",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that saying no to a thing is not the same as rejecting a person.",
      "Name a clear, kind way to say no.",
      "Recognise that a real friend accepts your no, and that some no's are about safety.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-dare",
        title: "The wobbly plank",
        narration:
          "Jun wants you to jump from the high platform to the wobbly plank with him. It looks too far and too shaky, and you do not want to. But Jun is your friend and he is excited for you to do it too.",
        illustrationKey: "bay-platform",
        prompt: "What could you say?",
        choices: [
          {
            id: "clear-kind-no",
            text: "Say clearly, “No, that’s too high for me — but I’ll cheer you on.”",
            consequenceType: "helpful",
            response:
              "You said no to the jump without saying no to Jun. A clear, kind no protects you and keeps the friendship — and offering to cheer shows you are still in it together.",
          },
          {
            id: "do-it-anyway",
            text: "Do it anyway so Jun is not disappointed.",
            consequenceType: "mixed",
            response:
              "You might not want to let Jun down. But doing something that feels unsafe to please a friend is not what friendship is for. Your ‘too high for me’ is a good enough reason all on its own.",
          },
          {
            id: "no-and-suggest",
            text: "Say no, and suggest something you both can enjoy.",
            consequenceType: "needs_context",
            response:
              "A lovely move — a no plus an idea keeps the fun going another way. It works when the other thing genuinely appeals to both of you, not just as a way to soften the no.",
          },
        ],
      },
    ],
    principle: {
      title: "Saying no to a thing is not saying no to a person",
      body: "You can turn down what a friend wants to do and still care about them completely. It matters because a real friend accepts your no — and when something feels unsafe or wrong to you, ‘no’ is always a good enough answer, no reason required.",
      points: [
        "A clear, kind no protects you: “No, that’s too high for me.”",
        "Saying no to the plan is not rejecting the person.",
        "A real friend accepts your no; someone who won’t is not respecting you.",
        "You never have to do something unsafe or uncomfortable to keep a friend — safety comes first, always.",
      ],
    },
    practice: {
      prompt:
        "A friend wants you to do something you don’t want to. How will you say no?",
      helperText: "Pick the no that feels right for you.",
      options: [
        {
          id: "clear-no",
          text: "“No, that’s not for me.”",
          encouragement: "Clear and kind. You don’t owe a long reason.",
        },
        {
          id: "no-cheer",
          text: "Say no, and offer to cheer them on",
          encouragement: "A no that keeps you in it together. Warm.",
        },
        {
          id: "no-and-idea",
          text: "Say no, and suggest another idea",
          encouragement: "A no plus an idea keeps the fun going. Nice.",
        },
      ],
      closing:
        "You can say no and still be a good friend. Your ‘no’ is always enough on its own.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, practise a clear, kind no to something you don’t want to do — and notice you can still be friends.",
      parentPrompt:
        "Honour your child’s ‘no’ to small things this week (a tickle, a food), so they trust their no is respected.",
      completionQuestion:
        "When did you say no, and what happened with your friend?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Practising ‘no’ in low-stakes moments builds the muscle a child needs for high-stakes ones. Respect their no, and they’ll trust it.",
      tryThis: [
        "Accept your child’s ‘no’ to tickles, hugs, or foods without guilt-tripping.",
        "Praise a clear, kind refusal: “You said no so well.”",
        "Make explicit that safety no’s never need a reason and never cost a real friendship.",
      ],
    },
    completion: {
      title: "You finished “Saying no and staying friends”",
      message:
        "You practised a clear, kind no. Saying no to a thing is never saying no to a person — and a real friend respects it.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson supports a child’s right to refuse regardless of peer pressure, a value that holds across cultures.",
    ],
    accessibilityNotes: [
      "A short no, a gesture, or a suggestion are all offered, for children who find long explanations hard.",
      "Offering to cheer on gives a non-participatory way to stay included.",
    ],
    safetyNotes: [
      "This lesson directly teaches refusing unsafe dares, that a safety ‘no’ needs no reason, and that safety always comes before pleasing a friend.",
    ],
    version: 1,
  },

  {
    id: "bridge-builders-bay-review",
    slug: "bridge-builders-bay-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "A real wobble between two friends, from the mistake to the mend. Everything about making things right, together.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together checking on the person, repairing, and honouring feelings.",
      "Choose a repair move that fits a real moment.",
      "Carry one repair skill into a real friendship this week.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-real-wobble",
        title: "A real falling-out",
        narration:
          "You and Amara had a proper falling-out over the last paint pot — words were said, and a picture got smudged. Now the game is quiet and awkward, and you both feel it. Someone has to start the mending.",
        illustrationKey: "bay-bridge",
        prompt: "What is your first step to make it right?",
        choices: [
          {
            id: "check-and-repair",
            text: "Check Amara is okay, own your part, and offer to help fix the smudge.",
            consequenceType: "helpful",
            response:
              "You put the person first, took your share, and offered a real repair — the whole world in one move. That is how a proper wobble gets mended between two friends.",
          },
          {
            id: "wait-for-her",
            text: "Wait for Amara to say sorry first, since she started it.",
            consequenceType: "mixed",
            response:
              "Maybe she did start it. But two people can both have a part, and waiting for the other to go first can leave the awkwardness sitting for ages. Starting the mending is brave, not weak.",
          },
          {
            id: "need-time-first",
            text: "Take a little cool-down time, then come back to sort it out.",
            consequenceType: "needs_context",
            response:
              "If the feeling is still big, cooling down first is wise — you will mend it better calm than hot. Just make sure you do come back to it, so the wobble actually gets mended.",
          },
        ],
      },
    ],
    principle: {
      title: "Making things right is repair, not blame",
      body: "Everything in this world points one way: after a wobble, we mend it — person first, then a real repair, with room for feelings on both sides. It helps because friendships are worth mending, and a repair rebuilds trust far better than working out whose fault it was.",
      points: [
        "Check on the person first; a repair you do beats a word you say.",
        "You can accept a sorry and still take your time; feelings have no deadline.",
        "Cool down big feelings, and come back to mend the wobble.",
        "You never owe a repair for saying no or keeping yourself safe — that always comes first.",
      ],
    },
    practice: {
      prompt:
        "Pick the ‘making things right’ move you want to take out into the real world this week.",
      helperText: "There is no wrong choice — pick what you want to practise.",
      options: [
        {
          id: "practise-person-first",
          text: "Checking on the person first",
          encouragement: "Person before pieces. The heart of every repair.",
        },
        {
          id: "practise-repair",
          text: "Offering a real repair",
          encouragement: "A sorry with hands on it. That’s what mends things.",
        },
        {
          id: "practise-feelings",
          text: "Taking my time with a sorry",
          encouragement:
            "Your feelings are yours, on your clock. Important to practise.",
        },
        {
          id: "practise-no",
          text: "Saying a clear, kind no",
          encouragement:
            "A no that keeps you safe and keeps your friends. Strong choice.",
        },
      ],
      closing:
        "Take your one repair skill into a real friendship this week. Wobbles happen — now you know how to mend them.",
    },
    offlineMission: {
      childPrompt:
        "This week, if there is a wobble with someone, practise making it right — check on them, own your part, and offer a repair.",
      parentPrompt:
        "When a real conflict happens this week, coach the repair rather than refereeing the blame, and let feelings take the time they need.",
      completionQuestion:
        "What wobble did you mend, and which part was hardest?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Real conflicts are the practice ground. Coaching repair — and never forcing a ‘sorry’ or an ‘it’s fine’ — is the whole lesson.",
      tryThis: [
        "When conflict flares, ask “how can we make this right?” not “who started it?”",
        "Let both children’s feelings take their own time; don’t script the ending.",
        "Keep safety refusals protected — never fold them into ‘just say sorry’.",
      ],
    },
    completion: {
      title: "You finished “Making Things Right”",
      message:
        "You put it all together — person first, real repair, honest feelings, and a clear kind no. Take it into your real friendships this week.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review centres repair and honoured feelings over obligatory apology or forgiveness, across differing family customs.",
    ],
    accessibilityNotes: [
      "Cool-down-first is offered for children who need to regulate before they can repair.",
      "Every repair move has a non-verbal or short-phrase form.",
    ],
    safetyNotes: [
      "This safety-adjacent module is flagged for qualified human review before publication; it reaffirms that safety and a child’s ‘no’ always come before repair, and that serious or repeated harm should be told to a trusted adult.",
    ],
    version: 1,
  },
];
