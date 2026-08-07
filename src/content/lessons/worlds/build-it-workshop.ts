import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 4 — Build-It Workshop · module "Working Together".
 *
 * DRAFT CONTENT (docs/CURRICULUM_PRINCIPLES.md). Not specialist-reviewed; every
 * lesson stays `status: "draft"`.
 *
 * Cooperation for 5–9s is give-and-take: sharing tools, taking turns, asking
 * before taking, and rotating the "planner" so nobody is the boss. Research
 * notes that full sharing is still developing until around 7–8, so turn-taking
 * with a timer and clear language does more than expecting instant generosity.
 * Amara loves a plan and is growing in leaving room for others' ideas; the
 * lessons let the planner role rotate (docs/design/CHARACTER_BIBLE.md).
 *
 * No choice is "correct"; `consequenceType` records what tends to follow. Asking
 * before taking a tool is framed around consent, not obedience.
 */

const skillArea = "cooperation" as const;
const moduleId = "build-it-workshop";

export const buildItWorkshopLessons: Lesson[] = [
  {
    id: "build-it-workshop-making-a-plan",
    slug: "build-it-workshop-making-a-plan",
    moduleId,
    order: 1,
    title: "Making a plan together",
    description:
      "Four of you want to build something at the workshop table — but everyone pictures something different. Where do you start?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that agreeing a plan first helps a group build together.",
      "Name a way to include everyone's idea in a plan.",
      "Recognise that a good plan leaves room for more than one person's vision.",
    ],
    skillArea,
    scenes: [
      {
        id: "four-ideas",
        title: "Four different pictures",
        narration:
          "There is a big pile of blocks and planks on the workshop table. You want to build a tower, Jun wants a bridge, Amara wants a castle, and Theo has quietly started sorting the pieces by size. Everyone is reaching for the same blocks.",
        illustrationKey: "workshop-table",
        prompt: "How could you help the group start?",
        choices: [
          {
            id: "agree-first",
            text: "Suggest everyone says their idea, then pick one plan to try first.",
            consequenceType: "helpful",
            response:
              "Now the group is building one thing together instead of four things at once. Hearing every idea first means nobody feels their picture was ignored.",
          },
          {
            id: "just-build-mine",
            text: "Start building your tower fast before the blocks run out.",
            consequenceType: "mixed",
            response:
              "You might get your tower. But if everyone grabs for their own idea, the blocks get split four ways and nothing quite works. A quick plan would have got more built.",
          },
          {
            id: "combine-ideas",
            text: "Ask if you could build a castle with a bridge and a tower.",
            consequenceType: "needs_context",
            response:
              "Sometimes ideas combine into something better than any one of them. It works when the group has time and pieces — and it still helps to agree who does which part.",
          },
        ],
      },
    ],
    principle: {
      title: "A plan lets a group build one thing, not four",
      body: "When a group agrees a plan before it starts, everyone is pulling the same way. It helps because building together needs a shared picture — otherwise four good ideas end up as one messy pile, and someone feels left out.",
      points: [
        "Hearing every idea first means nobody's picture gets ignored.",
        "Picking one plan to try does not throw the other ideas away — they can come next.",
        "Sometimes ideas combine into something better than any single one.",
        "A plan can be changed; if it is not working, the group can stop and agree a new one.",
      ],
    },
    practice: {
      prompt:
        "Your group is about to build together. How will you help make a plan?",
      helperText: "Pick the move that suits you.",
      options: [
        {
          id: "share-round",
          text: "Ask everyone to share their idea first",
          encouragement:
            "Now every idea is on the table. A fair place to start.",
        },
        {
          id: "pick-one",
          text: "Suggest trying one plan first",
          encouragement: "One shared plan gets more built. Good thinking.",
        },
        {
          id: "combine",
          text: "See if the ideas can join into one",
          encouragement:
            "Combining ideas can make something even better. Creative!",
        },
      ],
      closing:
        "Next time a group builds, try agreeing a plan first. It saves a lot of tangled blocks.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, make a plan with someone before you build, cook, or tidy something together.",
      parentPrompt:
        "Before a shared task at home, pause and ask, “What’s our plan?” and let your child help shape it.",
      completionQuestion:
        "What did you plan together, and did the plan change as you went?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Planning together is the root of cooperation. Letting children shape the plan — not just follow yours — is where the skill grows.",
      tryThis: [
        "Ask “what’s our plan?” before shared tasks, and take their ideas seriously.",
        "Show plans can change: “That’s not working — new plan?”",
        "Make sure quieter contributors (like a Theo) get their idea heard too.",
      ],
    },
    completion: {
      title: "You finished “Making a plan together”",
      message:
        "You practised agreeing a shared plan so a group can build one thing together. That is the start of real teamwork.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson values every group member’s idea and shared decision-making, rather than one child directing the rest.",
    ],
    accessibilityNotes: [
      "Theo’s quiet contribution (sorting pieces) is valued, showing planning does not require being the loudest.",
      "The situation is carried by narration; the illustration is decorative.",
    ],
    safetyNotes: [
      "A plan is framed as changeable and shared, not a rule imposed by one child on others.",
    ],
    version: 1,
  },

  {
    id: "build-it-workshop-ask-before-you-take",
    slug: "build-it-workshop-ask-before-you-take",
    moduleId,
    order: 2,
    title: "Asking before you take",
    description:
      "The tool you need is right there — but Theo is using it. What do you do?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain why asking before taking respects the other person.",
      "Name a way to ask for something someone else is using.",
      "Recognise that others can say no, and that includes your things too.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-one-hammer",
        title: "The one soft hammer",
        narration:
          "There is one soft rubber hammer, and you need it to tap your planks in place. Theo is using it right now, carefully, on his own build.",
        illustrationKey: "workshop-tools",
        prompt: "What could you do?",
        choices: [
          {
            id: "ask-when-done",
            text: "Ask, “Can I use it when you’re done?”",
            consequenceType: "helpful",
            response:
              "Now Theo knows you want it and can pass it over when he finishes. Asking first respects that he had it — and he is far more likely to hand it over happily.",
          },
          {
            id: "just-grab",
            text: "Take it from him — you only need it for a second.",
            consequenceType: "mixed",
            response:
              "You might get your tap done fast. But grabbing tells Theo his turn did not matter, and next time he may hold on tighter. A quick question keeps things friendly.",
          },
          {
            id: "find-another-way",
            text: "Use your hand or another block to tap while you wait.",
            consequenceType: "needs_context",
            response:
              "Good problem-solving — sometimes there is another way that does not need the shared tool at all. Waiting patiently and finding a work-around is a real option.",
          },
        ],
      },
    ],
    principle: {
      title: "Asking first respects the person using it",
      body: "When you ask before taking something someone is using, you are treating their turn as real. It helps because being asked feels completely different from being grabbed from — and people share far more happily with someone who asks.",
      points: [
        "“Can I use it when you’re done?” lets someone finish and plan the hand-over.",
        "Grabbing tells a person their turn did not count, so they hold on tighter next time.",
        "Sometimes there is another way that does not need the shared tool at all.",
        "Others are allowed to say “not yet” — and so are you when it is your turn with your things.",
      ],
    },
    practice: {
      prompt: "You need something a friend is using. How will you ask?",
      helperText: "Choose the words that feel like you.",
      options: [
        {
          id: "when-done",
          text: "“Can I have it when you’re finished?”",
          encouragement: "Clear and kind. Now they can plan the hand-over.",
        },
        {
          id: "swap",
          text: "“Want to swap when you’re ready?”",
          encouragement: "A friendly swap can suit you both. Nice idea.",
        },
        {
          id: "another-way",
          text: "Find another way while I wait",
          encouragement:
            "Clever — sometimes you don’t need the shared tool at all.",
        },
      ],
      closing:
        "Asking first is a small habit that makes sharing easy. Try it the next time you need something.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, when you want something someone else is using, ask first — and notice how they answer.",
      parentPrompt:
        "Model asking at home: “Are you using that? May I have it when you’re done?” so your child hears the habit.",
      completionQuestion:
        "What did you ask for, and what did the other person say?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Asking before taking is consent in miniature. Model it constantly, and honour your child’s “not yet” with their own things.",
      tryThis: [
        "Ask your child before borrowing their things, and wait for a real yes.",
        "When they grab, calmly rewind: “Let’s ask first — try again.”",
        "Let them say no to lending sometimes; forced sharing undercuts consent.",
      ],
    },
    completion: {
      title: "You finished “Asking before you take”",
      message:
        "You practised asking first instead of grabbing. People share happily with someone who respects their turn.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Norms about sharing and ownership vary by family; the lesson centres asking and consent rather than a rule that everything must be shared instantly.",
    ],
    accessibilityNotes: [
      "A non-verbal alternative (finding another way, or a swap gesture) is available for children who find asking aloud hard.",
      "The lesson does not rely on colour or the illustration to make its point.",
    ],
    safetyNotes: [
      "The lesson affirms a child’s right to say ‘not yet’ about their own belongings, reinforcing consent and autonomy.",
    ],
    version: 1,
  },

  {
    id: "build-it-workshop-taking-turns",
    slug: "build-it-workshop-taking-turns",
    moduleId,
    order: 3,
    title: "Taking turns with one tool",
    description:
      "There is one pulley wheel and two of you want it. How can you both get a fair go?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that turn-taking lets two people share one thing fairly.",
      "Name a tool that helps make turns fair, like a timer or a marker.",
      "Recognise that waiting is hard and there are ways to make it easier.",
    ],
    skillArea,
    scenes: [
      {
        id: "one-pulley",
        title: "One pulley, two builders",
        narration:
          "The workshop has one pulley wheel, and both you and Maya want to use it to lift your buckets of blocks. You both reach for it at the same time.",
        illustrationKey: "workshop-pulley",
        prompt: "How could you share it fairly?",
        choices: [
          {
            id: "timer-turns",
            text: "Suggest taking turns, using the sand timer for each go.",
            consequenceType: "helpful",
            response:
              "The timer makes turns fair without anyone arguing about “too long”. You both get a proper go, and the wheel keeps moving between you.",
          },
          {
            id: "keep-it-longer",
            text: "Get it first and keep it until you are completely finished.",
            consequenceType: "mixed",
            response:
              "You get your lifting done — but Maya is left waiting a long time with no idea when her turn comes. A “done in a minute” with no end can feel like forever.",
          },
          {
            id: "work-together",
            text: "Ask if you could use the pulley together, one loading, one lifting.",
            consequenceType: "needs_context",
            response:
              "Lovely idea — some jobs are actually better with two. Working together beats taking turns when the task has a part for each of you. It is worth checking Maya wants to team up, though.",
          },
        ],
      },
    ],
    principle: {
      title: "Turns share one thing fairly between two",
      body: "Taking turns means one thing can belong to both of you, a bit at a time. It helps because it turns a tug-of-war into a fair share — and a timer or a clear “your turn next” makes the waiting bearable.",
      points: [
        "A timer or a clear marker makes turns fair, so nobody argues about “too long”.",
        "Waiting is genuinely hard; knowing when your turn comes makes it easier.",
        "Some jobs are better done together than taken in turns — it is worth asking.",
        "Turn-taking is for shared things; you do not have to give away something that is your own.",
      ],
    },
    practice: {
      prompt: "Two of you want one thing. How will you make turns fair?",
      helperText: "Pick the fair-sharing idea you like.",
      options: [
        {
          id: "use-timer",
          text: "Use a timer for each turn",
          encouragement: "A timer keeps it fair for both of you. Smart.",
        },
        {
          id: "you-then-me",
          text: "Agree “you go, then me”",
          encouragement:
            "Now you both know the order. That makes waiting easier.",
        },
        {
          id: "team-up",
          text: "Try doing the job together",
          encouragement: "Two-person jobs can beat taking turns. Nice idea.",
        },
      ],
      closing:
        "Turns make one thing enough for two. Try a timer next time you share.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, take fair turns with someone using a timer or a clear “your turn next.”",
      parentPrompt:
        "Bring out a visible timer for a shared toy or the swing this week, so turns are fair without a referee.",
      completionQuestion:
        "What did you take turns with, and did the timer help?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Waiting relies on skills still developing at this age. A visible timer does the hard part, so it is not about willpower.",
      tryThis: [
        "Use a sand timer or app so turns end fairly, not by argument.",
        "Name the next turn out loud: “After this, it’s Mia’s.”",
        "Notice patient waiting — it is genuinely hard and worth praising.",
      ],
    },
    completion: {
      title: "You finished “Taking turns with one tool”",
      message:
        "You practised sharing one thing fairly between two. A timer and a clear order make turns feel fair, not endless.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson treats turn-taking as one tool among several, including collaboration, rather than the only correct way to share.",
    ],
    accessibilityNotes: [
      "A visible timer supports children who struggle with abstract waiting or time.",
      "Teaming up offers an alternative for children who find waiting especially hard.",
    ],
    safetyNotes: [
      "The lesson distinguishes shared things from personal belongings, so turn-taking never overrides a child’s ownership or consent.",
    ],
    version: 1,
  },

  {
    id: "build-it-workshop-offering-to-help",
    slug: "build-it-workshop-offering-to-help",
    moduleId,
    order: 4,
    title: "Offering to help lift",
    description:
      "Nora is struggling to carry a big plank on her own. Some jobs just need two.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that offering help with a hard job is a kind, useful thing.",
      "Recognise that help is offered, not forced, and it is polite to ask first.",
      "Understand that accepting help is a choice, and doing it yourself is allowed.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-big-plank",
        title: "The big plank",
        narration:
          "Nora is trying to carry a long plank to the build-table, but it is nearly as big as she is. It keeps tipping, and she is gripping it hard, determined to manage.",
        illustrationKey: "workshop-plank",
        prompt: "What could you do?",
        choices: [
          {
            id: "offer-to-help",
            text: "Ask, “Want a hand? I could take the other end.”",
            consequenceType: "helpful",
            response:
              "You offered without grabbing, and left the choice with Nora. If she says yes, a two-person job gets easy; if she says she’s got it, you respected that too.",
          },
          {
            id: "take-over",
            text: "Take the plank from her to carry it yourself.",
            consequenceType: "mixed",
            response:
              "You solved the carrying — but you also took away Nora’s job without asking. Being ‘helped’ like that can feel like being told you couldn’t do it. Asking first makes all the difference.",
          },
          {
            id: "cheer-her-on",
            text: "Let her keep trying, and stay close in case she wants help.",
            consequenceType: "needs_context",
            response:
              "Sometimes people want to manage it themselves, and staying nearby respects that. Just keep an eye out — if it becomes unsafe or she asks, you are right there.",
          },
        ],
      },
    ],
    principle: {
      title: "Help is an offer, not a takeover",
      body: "Offering to help with a hard job says “I’ve got your back” — but asking first keeps it help, not a takeover. It matters because being helped without being asked can feel like being told you were not capable.",
      points: [
        "“Want a hand?” offers help and leaves the choice with the other person.",
        "Taking over without asking can feel like being told you couldn’t do it.",
        "Some people want to manage a thing themselves; staying nearby is help too.",
        "If a job is genuinely unsafe for someone, it is right to step in and get an adult.",
      ],
    },
    practice: {
      prompt: "Someone is struggling with a hard job. How will you help?",
      helperText: "Pick the kind of help that fits.",
      options: [
        {
          id: "ask-a-hand",
          text: "Ask “want a hand?” first",
          encouragement: "Offering and asking first — exactly right.",
        },
        {
          id: "stay-close",
          text: "Stay close in case they want help",
          encouragement: "Ready-to-help is help too. Respectful of their try.",
        },
        {
          id: "get-adult",
          text: "Get an adult if it looks unsafe",
          encouragement: "Wise — some jobs need a grown-up, and that is okay.",
        },
      ],
      closing:
        "Offering a hand is kind. Asking first makes sure it is the help they actually want.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, offer to help with something heavy or hard — and ask first, so it’s their choice.",
      parentPrompt:
        "Give your child a real two-person job with you (carrying, folding a big sheet) and let them feel how teamwork lightens it.",
      completionQuestion:
        "Who did you offer to help, and did they want a hand?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "‘Ask before helping’ protects a child’s sense of competence — the same courtesy adults appreciate.",
      tryThis: [
        "Model asking: “Would you like help, or do you want to try?”",
        "Resist rescuing too fast; struggling a little builds capability.",
        "Praise the offer and the asking, not just the lifting.",
      ],
    },
    completion: {
      title: "You finished “Offering to help lift”",
      message:
        "You practised offering a hand and letting the other person choose. That is help that feels good to receive.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson balances helpfulness with respect for autonomy, which matters across cultures with differing norms about independence.",
    ],
    accessibilityNotes: [
      "‘Ask before helping’ directly protects disabled children from unwanted help, a real and important courtesy.",
      "The lesson lets a child manage a task themselves rather than being helped by default.",
    ],
    safetyNotes: [
      "The lesson keeps a genuine-danger exception, where stepping in and fetching an adult is right.",
    ],
    version: 1,
  },

  {
    id: "build-it-workshop-both-want-same",
    slug: "build-it-workshop-both-want-same",
    moduleId,
    order: 5,
    title: "When you both want the same piece",
    description:
      "There is exactly one bright red block, and you and Jun both want it. Now what?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a want-clash can be solved by finding something you both agree to.",
      "Name a fair way to sort out who gets a single special thing.",
      "Recognise that both people's feelings are real, and a solution beats a winner.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-red-block",
        title: "The one red block",
        narration:
          "Every other block is plain wood, but there is one bright red one, and it is perfect for both your builds. You and Jun both put a hand on it at the same moment and freeze.",
        illustrationKey: "workshop-blocks",
        prompt: "What could you do?",
        choices: [
          {
            id: "find-a-deal",
            text: "Talk it out: maybe one uses it now, the other next build — or you find a way to share it.",
            consequenceType: "helpful",
            response:
              "You looked for something you both agree to, instead of a winner and a loser. That is real cooperation — the block becomes a problem you solve together, not a fight.",
          },
          {
            id: "tug-it",
            text: "Hold on tight until Jun lets go.",
            consequenceType: "mixed",
            response:
              "You might end up with the block. But a tug-of-war leaves one of you upset, and Jun will remember it. Winning the block can cost the good feeling of building together.",
          },
          {
            id: "let-it-go",
            text: "Let Jun have it and use a different block.",
            consequenceType: "needs_context",
            response:
              "Letting it go can be generous and easy, and sometimes that feels fine. Just check it does not always have to be you who gives way — fair means it goes both ways over time.",
          },
        ],
      },
    ],
    principle: {
      title: "Look for a solution, not a winner",
      body: "When two people want the same thing, the best fix is one you both agree to — a turn each, a trade, or a way to share. It helps because a solution keeps you both building together, while a winner leaves someone behind.",
      points: [
        "Talking it out — “you now, me next” or a trade — beats a tug-of-war.",
        "Both people’s wanting is real; it is not about who deserves it more.",
        "Letting it go can be kind, but fairness means it should not always be the same person giving way.",
        "If you cannot agree, asking a grown-up to help is a good move, not a failure.",
      ],
    },
    practice: {
      prompt: "You both want the one special piece. How will you sort it out?",
      helperText: "Pick a fair way you would try.",
      options: [
        {
          id: "turns-deal",
          text: "Agree who uses it now and who’s next",
          encouragement: "A fair share over time. Both of you get a go.",
        },
        {
          id: "trade",
          text: "Offer a trade for something else good",
          encouragement: "A trade can make you both happy. Clever.",
        },
        {
          id: "ask-help",
          text: "Ask a grown-up to help us decide",
          encouragement: "Getting help to be fair is a smart, grown-up move.",
        },
      ],
      closing:
        "A want-clash is a problem to solve together. Try finding a deal you both like.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, if you and someone both want the same thing, look for a solution you both agree to.",
      parentPrompt:
        "Next sibling squabble over one item, coach the solution: “What could work for both of you?” instead of deciding for them.",
      completionQuestion:
        "What did you both want, and how did you sort it out?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "The lifelong skill here is ‘solve it together’ rather than ‘who wins’. Coaching the negotiation beats refereeing it.",
      tryThis: [
        "Ask “what would work for both of you?” and let them find it.",
        "Validate both wants: “You both really want it — that makes sense.”",
        "Watch that the same child isn’t always the one giving way.",
      ],
    },
    completion: {
      title: "You finished “When you both want the same piece”",
      message:
        "You practised finding a solution instead of a winner. A shared deal keeps you both building together.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson frames conflict as a shared problem to solve, avoiding a competition or blame frame.",
    ],
    accessibilityNotes: [
      "Asking an adult to help decide is offered without stigma, supporting children who find negotiation hard.",
      "The scenario is fully described in words.",
    ],
    safetyNotes: [
      "The lesson steers away from physical tug-of-war and models words and help instead.",
    ],
    version: 1,
  },

  {
    id: "build-it-workshop-planner-rotates",
    slug: "build-it-workshop-planner-rotates",
    moduleId,
    order: 6,
    title: "The planner takes turns",
    description:
      "Amara is brilliant at plans — but she has been the boss every time. Should the planner job move around?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that sharing the leader role lets everyone's ideas get a turn.",
      "Recognise that being good at something does not mean always being in charge.",
      "Name a way to pass the planner role to someone else.",
    ],
    skillArea,
    scenes: [
      {
        id: "always-the-boss",
        title: "Whose turn to plan?",
        narration:
          "Amara always has the plan ready, and her plans are good. But today Theo has an idea he has been quietly holding for three builds now, and Amara has already started telling everyone what to do.",
        illustrationKey: "workshop-table",
        prompt: "What could you say?",
        choices: [
          {
            id: "pass-the-role",
            text: "Suggest, “Amara, your plans are great — could Theo’s be the plan this time?”",
            consequenceType: "helpful",
            response:
              "You honoured Amara and opened the door for Theo. Sharing the planner job means every builder gets to see their idea come to life sometimes, not just the fastest planner.",
          },
          {
            id: "let-amara-lead",
            text: "Just go with Amara’s plan again — it is easier.",
            consequenceType: "mixed",
            response:
              "Amara’s plan will probably work. But if the same person always leads, quieter builders like Theo stop offering ideas — and the group misses out on them.",
          },
          {
            id: "ask-everyone",
            text: "Ask, “Whose turn is it to be the planner today?”",
            consequenceType: "needs_context",
            response:
              "A fair question that shares the role without singling anyone out. It works best if the group actually keeps track, so it does not drift back to the same leader every time.",
          },
        ],
      },
    ],
    principle: {
      title: "Sharing the lead shares the ideas",
      body: "When the planner role moves around, everyone’s ideas get a turn to be built. It helps because being good at plans does not mean someone should always be in charge — and quieter people have great ideas that only come out when there is room.",
      points: [
        "Being good at something does not mean always being the boss of it.",
        "Passing the role lets quieter builders see their idea come to life.",
        "You can honour a great planner and still make room for someone else.",
        "Taking turns to lead is fair; nobody should have to fight to be heard.",
      ],
    },
    practice: {
      prompt: "The same person always leads. How could you share the role?",
      helperText: "Pick a fair way to pass it around.",
      options: [
        {
          id: "whose-turn",
          text: "Ask whose turn it is to plan",
          encouragement: "A fair question that shares the lead. Nice.",
        },
        {
          id: "invite-someone",
          text: "Invite a quieter person’s idea to lead",
          encouragement: "You just gave someone’s idea a chance to shine.",
        },
        {
          id: "take-my-turn",
          text: "Offer to try being the planner myself",
          encouragement:
            "Stepping up is great too — your ideas deserve a turn.",
        },
      ],
      closing:
        "Great teams pass the lead around. Try sharing the planner job next time.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, help the leader role move around — offer someone else a turn to decide, or take a turn yourself.",
      parentPrompt:
        "Let your child be the planner for a family activity this week, and take a turn following their lead.",
      completionQuestion:
        "Whose turn was it to lead, and how did their idea turn out?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "This lesson gently interrupts the ‘natural leader always leads’ pattern, so every child practises both leading and following.",
      tryThis: [
        "Rotate who decides at home — dinner, the game, the route.",
        "Follow your child’s lead sometimes, and let them feel it.",
        "Affirm strong planners while making room for quieter ideas.",
      ],
    },
    completion: {
      title: "You finished “The planner takes turns”",
      message:
        "You practised sharing the lead so everyone’s ideas get a turn. A team where the leader rotates is a team where everyone belongs.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson supports shared leadership and avoids casting one child as the permanent leader, per the cast’s rotation rule.",
    ],
    accessibilityNotes: [
      "Making room for a quieter builder’s idea supports children who need space and time to contribute.",
      "The lesson does not require assertiveness to take part — inviting others counts.",
    ],
    safetyNotes: [
      "Fair turns to lead are framed as everyone’s due, so no child has to fight or dominate to be heard.",
    ],
    version: 1,
  },

  {
    id: "build-it-workshop-finishing-together",
    slug: "build-it-workshop-finishing-together",
    moduleId,
    order: 7,
    title: "Finishing it together",
    description:
      "The build is nearly done but it is getting boring, and the tidy-up is still ahead. Do you see it through together?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that finishing and tidying together is part of working as a team.",
      "Recognise that sharing the credit and the clean-up both matter.",
      "Understand that it is okay to need a break, and to come back.",
    ],
    skillArea,
    scenes: [
      {
        id: "nearly-done",
        title: "The boring last bit",
        narration:
          "The group build is nearly finished — just the fiddly roof and then the big tidy-up of scattered blocks. Jun has drifted off to something new, and the roof and the mess are left to whoever stays.",
        illustrationKey: "workshop-build",
        prompt: "What could you do?",
        choices: [
          {
            id: "see-it-through",
            text: "Stay to finish the roof, and ask others to help tidy together.",
            consequenceType: "helpful",
            response:
              "You saw the job through and shared the clean-up. Finishing together — including the boring bits — is what turns a pile of blocks into something the whole group is proud of.",
          },
          {
            id: "leave-the-mess",
            text: "Leave the roof and mess for someone else and go play.",
            consequenceType: "mixed",
            response:
              "The fun part is over, so drifting off is tempting. But if everyone leaves the tidy-up, it lands on one person — and the build never quite gets finished or shared.",
          },
          {
            id: "quick-break",
            text: "Take a short break, then come back to help finish.",
            consequenceType: "needs_context",
            response:
              "Needing a breather is completely fine — long jobs are tiring. A break works when you actually come back, so the finishing does not quietly become someone else’s whole job.",
          },
        ],
      },
    ],
    principle: {
      title: "Finishing together is part of the teamwork",
      body: "A team job includes the fiddly end and the tidy-up, not just the exciting middle. It helps because when everyone stays for the boring bits, no one person gets stuck with them — and the finished thing belongs to all of you.",
      points: [
        "The last bit and the tidy-up are part of the job, not extra.",
        "Sharing the clean-up means it does not all land on one person.",
        "It is fine to need a break from a long job — the key is coming back.",
        "Everyone who built it shares the credit; nobody has to have done the ‘best’ part.",
      ],
    },
    practice: {
      prompt:
        "A shared job has a boring last bit. How will you help finish it?",
      helperText: "Pick what you would really do.",
      options: [
        {
          id: "finish-it",
          text: "Stay and finish the last part",
          encouragement: "Seeing it through is a real team skill. Well done.",
        },
        {
          id: "share-tidy",
          text: "Ask everyone to help tidy together",
          encouragement: "Sharing the clean-up is fair to everyone. Good call.",
        },
        {
          id: "break-return",
          text: "Take a short break, then come back",
          encouragement:
            "Breaks are fine — the trick is coming back. Nice balance.",
        },
      ],
      closing:
        "The end of a job counts as much as the start. Try finishing something together this week.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, help finish and tidy up a shared job — the whole way to the end.",
      parentPrompt:
        "Do a project with your child and stay together through the clean-up, naming it as part of the job well done.",
      completionQuestion:
        "What did you finish together, and who helped tidy up?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Finishing and tidying are where cooperation is tested. Doing the clean-up together, cheerfully, teaches it best.",
      tryThis: [
        "Tidy alongside them rather than assigning it — teamwork to the end.",
        "Allow breaks, and hold the expectation of coming back.",
        "Share the credit for the whole thing, boring bits included.",
      ],
    },
    completion: {
      title: "You finished “Finishing it together”",
      message:
        "You practised seeing a shared job all the way through — including the tidy-up. That is what real teammates do.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson frames shared responsibility for clean-up without singling out any child, reflecting the rotation rule.",
    ],
    accessibilityNotes: [
      "Permission to take a break supports children who tire or overload on long tasks, without excusing them from the team.",
      "The lesson does not depend on stamina alone; contributing to the finish, in any part, counts.",
    ],
    safetyNotes: [
      "Taking a needed break is affirmed, so persistence never overrides a child’s limits.",
    ],
    version: 1,
  },

  {
    id: "build-it-workshop-review",
    slug: "build-it-workshop-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "One big group build, from the first plan to the last tidy-up. Everything about working together, in one project.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together planning, asking, turn-taking, and sharing the lead.",
      "Choose a cooperation move that fits a real moment.",
      "Carry one teamwork skill into a real shared job.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-big-build",
        title: "The clubhouse sign",
        narration:
          "The whole group is making a big wooden sign for the clubhouse. There is one plan to agree, tools to share, a want-clash over the gold paint, and a tidy-up at the end. It is a lot of teamwork all at once.",
        illustrationKey: "workshop-build",
        prompt: "Where do you help first?",
        choices: [
          {
            id: "get-a-plan",
            text: "Help the group agree one plan, making sure everyone’s idea is heard.",
            consequenceType: "helpful",
            response:
              "You started with the thing that holds teamwork together: a shared plan where nobody is left out. Everything else — sharing tools, the paint, the tidy-up — gets easier from there.",
          },
          {
            id: "grab-gold-paint",
            text: "Grab the gold paint before anyone else can.",
            consequenceType: "mixed",
            response:
              "You get the paint — but the want-clash just became a bad feeling, and the plan is still not agreed. Sorting the plan and sharing the paint fairly would set the whole build up better.",
          },
          {
            id: "help-quiet-builder",
            text: "Check whether a quieter builder has an idea before the group decides.",
            consequenceType: "needs_context",
            response:
              "A thoughtful first move — making sure the quiet ideas are in before the plan is set. Just be ready to help the group actually agree, so it does not stall.",
          },
        ],
      },
    ],
    principle: {
      title: "Working together is give-and-take, all the way through",
      body: "Every lesson in this world is one idea: a team works when people give and take — sharing the plan, the tools, the lead, and the tidy-up. It helps because a group can build far more than one person can, but only when everyone gets a turn and nobody gets grabbed from.",
      points: [
        "Agree a shared plan first, with every idea heard.",
        "Ask before you take, take fair turns, and share the lead around.",
        "Finish and tidy together, and share the credit.",
        "Asking before taking respects consent; you can always say ‘not yet’ about your own things.",
      ],
    },
    practice: {
      prompt:
        "Pick the teamwork move you want to take out into the real world this week.",
      helperText: "There is no wrong choice — pick what you want to practise.",
      options: [
        {
          id: "practise-planning",
          text: "Making a plan together",
          encouragement:
            "A shared plan makes everything else work. Great pick.",
        },
        {
          id: "practise-asking",
          text: "Asking before I take",
          encouragement: "A small habit that makes sharing easy. Lovely.",
        },
        {
          id: "practise-turns",
          text: "Taking fair turns",
          encouragement: "Turns turn one thing into enough for everyone. Nice.",
        },
        {
          id: "practise-lead",
          text: "Sharing the lead",
          encouragement:
            "Passing the lead shares the ideas. A grown-up thing to practise.",
        },
      ],
      closing:
        "Take your one teamwork move into a real shared job this week. You know how to build together now.",
    },
    offlineMission: {
      childPrompt:
        "This week, do a real job with other people — cooking, tidying, building — and practise giving and taking all the way to the end.",
      parentPrompt:
        "Give your child one genuine shared project this week where they plan, share, and finish with others, and let them lead parts of it.",
      completionQuestion:
        "What did you make together, and which teamwork part was trickiest?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "A real shared project — cooking dinner, building flat-pack, a garden job — teaches every skill in this world at once.",
      tryThis: [
        "Pick one genuine team job this week and let your child own parts of it.",
        "Narrate the give-and-take as it happens: planning, asking, sharing, finishing.",
        "Share the credit for the finished thing across everyone who helped.",
      ],
    },
    completion: {
      title: "You finished “Working Together”",
      message:
        "You put it all together — planning, asking, turn-taking, sharing the lead, and finishing as a team. Take it into a real project this week.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review models shared leadership and fair process without a single boss, honouring the rotation rule.",
    ],
    accessibilityNotes: [
      "Making sure quiet ideas are heard is built into the review, keeping teamwork open to all communication styles.",
      "Every teamwork move has a form that does not depend on being the loudest.",
    ],
    safetyNotes: [
      "The closing principle restates that asking before taking respects consent and a child’s right to say ‘not yet’.",
    ],
    version: 1,
  },
];
