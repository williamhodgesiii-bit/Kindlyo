import type { Lesson } from "@/features/curriculum/schema";

/**
 * World 8 — Community Town · module "Out and About".
 *
 * DRAFT CONTENT (docs/CURRICULUM_PRINCIPLES.md). Not specialist-reviewed; every
 * lesson stays `status: "draft"`.
 *
 * Sharing the places we all use: lines, quiet and loud places, seats, doorways,
 * shared things. Research is clear that waiting relies on impulse control still
 * developing at 5–9, so the lessons teach concrete waiting strategies rather
 * than expecting willpower. Volume and queue norms differ by place, and the
 * safety thread — find a uniformed or trusted helper, stay findable — is
 * explicit (docs/design/MODULE_WORLDS.md §8).
 *
 * No choice is "correct"; `consequenceType` records what tends to follow.
 */

const skillArea = "public-spaces" as const;
const moduleId = "community-town";

export const communityTownLessons: Lesson[] = [
  {
    id: "community-town-waiting-in-line",
    slug: "community-town-waiting-in-line",
    moduleId,
    order: 1,
    title: "Waiting your turn in a line",
    description:
      "The queue for the town fountain is long, and you got here after others. What does a line ask of you?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that a line is a way of taking fair turns in a shared place.",
      "Name a way to make waiting in a line easier.",
      "Recognise that waiting is genuinely hard and there are tricks to help.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-long-queue",
        title: "The line at the fountain",
        narration:
          "There is one water fountain in the town square and quite a few people are waiting for it. You are thirsty, and there is a gap up near the front where you could squeeze in.",
        illustrationKey: "town-square",
        prompt: "What could you do?",
        choices: [
          {
            id: "join-the-back",
            text: "Join the back of the line and wait your turn.",
            consequenceType: "helpful",
            response:
              "You took your fair place. A line works because everyone waits their turn — and the people who got there first do not have their spot taken. Yours will come.",
          },
          {
            id: "squeeze-in-front",
            text: "Squeeze into the gap near the front.",
            consequenceType: "mixed",
            response:
              "You might get your water sooner. But cutting in means someone who waited longer gets pushed back, which does not feel fair to them. A line only works if everyone keeps to it.",
          },
          {
            id: "wait-with-a-game",
            text: "Join the back and play a quiet counting game while you wait.",
            consequenceType: "needs_context",
            response:
              "Clever — waiting is hard, and giving your mind a little game makes the time pass. Counting people, spotting colours, or a quiet song can turn a long wait into an easy one.",
          },
        ],
      },
    ],
    principle: {
      title: "A line shares a place fairly",
      body: "A queue is just a way of taking fair turns for something lots of people want. It helps because it means nobody has to push or worry — the order keeps it fair, and everyone, including you, gets their turn.",
      points: [
        "Joining the back keeps the line fair for the people who waited longer.",
        "Waiting is genuinely hard; a quiet game or counting makes it easier.",
        "Your turn will come — a line is a promise, not a punishment.",
        "If you ever feel unsafe in a crowd, find a uniformed helper or trusted adult and stay where you can be seen.",
      ],
    },
    practice: {
      prompt: "You’re waiting in a line. What will help you wait well?",
      helperText: "Pick a waiting trick you’d use.",
      options: [
        {
          id: "count-something",
          text: "Count people or spot colours while I wait",
          encouragement: "A little game makes the time fly. Clever.",
        },
        {
          id: "quiet-song",
          text: "Hum a quiet song in my head",
          encouragement: "A calm way to pass the wait. Nice.",
        },
        {
          id: "remember-turn",
          text: "Remember my turn is coming",
          encouragement: "A line is a promise. Your turn will come.",
        },
      ],
      closing:
        "Waiting in line is hard — a little game makes it easy. Try one next time you wait.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, wait in a real line — at a shop, a slide, or a door — and try a waiting trick to help.",
      parentPrompt:
        "Next time you queue together, hand your child a waiting game (spot the colour, count the people) rather than expecting stillness.",
      completionQuestion:
        "Where did you wait in a line, and what helped you wait?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Waiting relies on skills still forming at this age. Giving a concrete strategy beats asking a child to ‘be patient’.",
      tryThis: [
        "Offer a waiting game rather than a reminder to wait.",
        "Name the fairness: “Everyone who got here first goes first.”",
        "Praise the waiting, not just the reward at the end.",
      ],
    },
    completion: {
      title: "You finished “Waiting your turn in a line”",
      message:
        "You practised taking your fair place and a trick to wait well. A line keeps things fair for everyone, including you.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Queue norms differ by place and culture; the lesson teaches fair turns while acknowledging waiting customs vary.",
    ],
    accessibilityNotes: [
      "Concrete waiting strategies support children who find abstract waiting or time very hard.",
      "The lesson does not require standing still or silent to succeed.",
    ],
    safetyNotes: [
      "Children are told to find a uniformed helper or trusted adult and stay findable if they feel unsafe in a crowd.",
    ],
    version: 1,
  },

  {
    id: "community-town-quiet-and-loud-places",
    slug: "community-town-quiet-and-loud-places",
    moduleId,
    order: 2,
    title: "Quiet places and loud places",
    description:
      "The park is for big voices; the library is for small ones. How do you know which voice a place wants?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that different places ask for different voices.",
      "Name a place that wants a quiet voice and one that welcomes a loud one.",
      "Recognise that matching your voice to a place is a kindness to others there.",
    ],
    skillArea,
    scenes: [
      {
        id: "into-the-library",
        title: "Into the library corner",
        narration:
          "You have been at the noisy, brilliant playground, shouting and laughing. Now your grown-up takes you into the town’s little library corner, where people are reading quietly and it is calm and hushed.",
        illustrationKey: "town-library",
        prompt: "What could you do?",
        choices: [
          {
            id: "switch-to-quiet",
            text: "Switch to your quiet indoor voice, like the library asks for.",
            consequenceType: "helpful",
            response:
              "You matched your voice to the place. The library is quiet so people can read and think — using a small voice there is a kindness to everyone else in the room.",
          },
          {
            id: "stay-loud",
            text: "Keep using your big playground voice.",
            consequenceType: "mixed",
            response:
              "Your big voice is great outside. But indoors, in a quiet place, it makes it hard for others to read or concentrate. Different places ask for different voices — the library asks for a small one.",
          },
          {
            id: "ask-which-voice",
            text: "Ask your grown-up, “Is this a quiet-voice place?”",
            consequenceType: "needs_context",
            response:
              "A great question when you are not sure. Some places are obviously loud or quiet; others you have to check. Asking helps you learn which voice a new place wants.",
          },
        ],
      },
    ],
    principle: {
      title: "Different places ask for different voices",
      body: "A playground wants big voices; a library, a waiting room, or a bus wants small ones. Matching your voice to the place helps because it lets everyone use the space the way it is meant to be used — loud where loud belongs, calm where calm is needed.",
      points: [
        "Some places welcome loud, happy voices; others need quiet ones.",
        "Switching to a quiet voice indoors is a kindness to people around you.",
        "If you are not sure, you can ask which kind of voice a place wants.",
        "It is always okay to speak up loudly if there is an emergency or you need help.",
      ],
    },
    practice: {
      prompt:
        "You’ve arrived somewhere new. How will you find the right voice?",
      helperText: "Pick what you’d do.",
      options: [
        {
          id: "match-place",
          text: "Match my voice to the place",
          encouragement: "Reading the room like that is a real skill. Nice.",
        },
        {
          id: "look-around",
          text: "Look at how quiet others are",
          encouragement: "A great clue to which voice a place wants.",
        },
        {
          id: "ask-grownup",
          text: "Ask if it’s a quiet-voice place",
          encouragement: "Asking when unsure is smart. Good move.",
        },
      ],
      closing:
        "Match your voice to the place you’re in. It helps everyone use it the way it’s meant.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, notice a quiet-voice place and a loud-voice place you go to, and match your voice to each.",
      parentPrompt:
        "Name the voice before you enter: “This is a quiet-voice place” — so your child can prepare rather than be corrected inside.",
      completionQuestion:
        "Where did you use a quiet voice, and where could you be loud?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Telling children what to expect before entering a place works far better than shushing them once inside.",
      tryThis: [
        "Preview the voice: “Library next — quiet voices.”",
        "Point out loud-voice places too, so quiet isn’t the only message.",
        "Keep the emergency exception clear: loud is right when you need help.",
      ],
    },
    completion: {
      title: "You finished “Quiet places and loud places”",
      message:
        "You practised matching your voice to the place. Loud where loud belongs, quiet where quiet is needed.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Norms about acceptable volume differ by place and culture; the lesson teaches reading a specific place rather than a fixed rule.",
    ],
    accessibilityNotes: [
      "Previewing the expected voice supports children who find transitions or sudden expectations hard.",
      "The emergency exception ensures a child is never taught that quiet outranks calling for help.",
    ],
    safetyNotes: [
      "The lesson explicitly preserves loud voices for emergencies and asking for help.",
    ],
    version: 1,
  },

  {
    id: "community-town-making-room",
    slug: "community-town-making-room",
    moduleId,
    order: 3,
    title: "Making room on the bus",
    description:
      "The bus is filling up, and someone who needs a seat more than you has just got on. What do you do?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that offering space to someone who needs it more is a kindness.",
      "Name a way to make room in a shared space.",
      "Recognise that offering is kind, and it is offered, not forced.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-full-bus",
        title: "The busy bus",
        narration:
          "You are sitting on the town bus with your bag on the seat beside you. At the next stop, an older person with a walking stick gets on, and there are no free seats left.",
        illustrationKey: "town-bus",
        prompt: "What could you do?",
        choices: [
          {
            id: "offer-your-seat",
            text: "Move your bag onto your lap and offer the seat.",
            consequenceType: "helpful",
            response:
              "You made room for someone who needed it more, and it cost you only a bit of lap space. Offering a seat to someone who is finding standing hard is a simple, real kindness.",
          },
          {
            id: "keep-bag-seat",
            text: "Keep your bag on the seat and look out the window.",
            consequenceType: "mixed",
            response:
              "Your bag is comfy there, but a seat with a bag on it is a seat someone standing cannot use. Noticing who needs it and freeing it up is the kinder choice on a full bus.",
          },
          {
            id: "check-with-grownup",
            text: "Check with your grown-up, then offer the seat together.",
            consequenceType: "needs_context",
            response:
              "A sensible move, especially if you are small or unsure. Offering with your grown-up keeps you safe and still does the kind thing. Some people will say “no thank you, you sit” — and that is fine too.",
          },
        ],
      },
    ],
    principle: {
      title: "Make room for someone who needs it more",
      body: "In a shared space like a bus, offering your seat or your space to someone who needs it more is a small, real kindness. It helps because a place we all use works best when we look out for each other — and it usually costs the person offering very little.",
      points: [
        "A bag on a seat is a seat someone standing cannot use.",
        "Offering space to someone finding it hard to stand is a simple kindness.",
        "Offering is kind; the person can say “no thank you”, and that is fine.",
        "Stay with your grown-up on buses and in busy places, and offer together when you are unsure.",
      ],
    },
    practice: {
      prompt:
        "A shared space is filling up and someone needs room. How will you help?",
      helperText: "Pick a way to make room.",
      options: [
        {
          id: "free-a-seat",
          text: "Move my things to free up space",
          encouragement: "A seat freed up is a seat someone can use. Kind.",
        },
        {
          id: "offer-seat",
          text: "Offer my seat to someone who needs it",
          encouragement: "A small cost to you, a big help to them. Lovely.",
        },
        {
          id: "offer-together",
          text: "Offer together with my grown-up",
          encouragement: "Safe and still kind. Great when you’re unsure.",
        },
      ],
      closing:
        "Look out for who needs room in a shared space. A little space from you can help a lot.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, in a shared space, notice someone who needs room and make some for them — with your grown-up if you like.",
      parentPrompt:
        "On a bus or bench this week, point out who might need a seat and let your child offer, together with you.",
      completionQuestion: "Who did you make room for, and what did they say?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Noticing who needs space is empathy in action. Doing it together keeps a young child safe while they learn it.",
      tryThis: [
        "Wonder aloud who might need a seat, then offer together.",
        "Let a declined offer be fine: “They’re okay — the offer was kind.”",
        "Keep young children with you on transport; offer as a team.",
      ],
    },
    completion: {
      title: "You finished “Making room on the bus”",
      message:
        "You practised making room for someone who needed it more. Shared places work best when we look out for each other.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "Customs about offering seats (to elders, to anyone standing) vary; the lesson frames it as a general kindness, not a rigid rule.",
    ],
    accessibilityNotes: [
      "The lesson models awareness of people with mobility needs without pity, framing space as ordinary courtesy.",
      "Offering together with an adult supports younger or less confident children.",
    ],
    safetyNotes: [
      "Children are reminded to stay with their grown-up in busy public places and to offer as a team when unsure.",
    ],
    version: 1,
  },

  {
    id: "community-town-letting-people-pass",
    slug: "community-town-letting-people-pass",
    moduleId,
    order: 4,
    title: "Letting people pass",
    description:
      "You and your friends are having fun right in the middle of the path. Someone needs to get by.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that shared paths and doorways need to stay clear for others.",
      "Name a way to let someone pass.",
      "Recognise that noticing who needs to get by is part of sharing a space.",
    ],
    skillArea,
    scenes: [
      {
        id: "middle-of-the-path",
        title: "Right in the middle",
        narration:
          "You and Jun are crouched down looking at something brilliant on the ground — right in the middle of the narrow path through the square. Someone pushing a pram has come up behind you and cannot get by.",
        illustrationKey: "town-path",
        prompt: "What could you do?",
        choices: [
          {
            id: "step-aside",
            text: "Notice, and shuffle to the side so they can pass.",
            consequenceType: "helpful",
            response:
              "You noticed and moved, and the path is clear again. Shared paths only work when we keep them open for others — a quick shuffle to the side is all it takes.",
          },
          {
            id: "stay-put",
            text: "Stay where you are — you were there first.",
            consequenceType: "mixed",
            response:
              "You were there first, that is true. But a path is for everyone to move along, not to sit in. Being there first does not mean the middle is yours to keep — the pram still needs to pass.",
          },
          {
            id: "move-and-look",
            text: "Move to the side, and carry on looking from there.",
            consequenceType: "needs_context",
            response:
              "Perfect — you cleared the path and kept your fun going from a spot that does not block anyone. Often you can do both: enjoy the moment and keep the way open.",
          },
        ],
      },
    ],
    principle: {
      title: "Keep shared paths open",
      body: "Paths, doorways, and aisles are for everyone to move along. Noticing when someone needs to get by and stepping aside helps because a shared way only works when it stays open — one person blocking it can hold up many.",
      points: [
        "A path or doorway is for moving through, not for staying put in.",
        "A quick step to the side lets people pass and keeps your fun going.",
        "Being somewhere first does not make the middle of a path yours to keep.",
        "Notice prams, wheelchairs, and people carrying things — they especially need a clear way.",
      ],
    },
    practice: {
      prompt: "You’re in a spot where someone needs to pass. What will you do?",
      helperText: "Pick the clear-the-way move.",
      options: [
        {
          id: "shuffle-aside",
          text: "Shuffle to the side",
          encouragement: "Quick and kind. The path is open again.",
        },
        {
          id: "move-and-carry-on",
          text: "Move aside and carry on from there",
          encouragement: "Both at once — fun kept, path clear. Nice.",
        },
        {
          id: "notice-who-needs",
          text: "Notice who needs to get by",
          encouragement: "Noticing is the first step. Well spotted.",
        },
      ],
      closing:
        "Keep the way open for others. A quick step aside is a small, everyday kindness.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, notice when someone needs to get past you on a path or through a door, and let them pass.",
      parentPrompt:
        "In doorways and aisles this week, gently cue “let’s make way” so your child practises noticing and moving.",
      completionQuestion: "When did you step aside to let someone pass?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Spatial awareness of others is a learned skill. Cueing ‘let’s make way’ builds it without shaming.",
      tryThis: [
        "Cue the move kindly: “Someone’s coming — let’s step aside.”",
        "Point out who especially needs room: prams, wheelchairs, heavy bags.",
        "Model holding doors and clearing the way yourself.",
      ],
    },
    completion: {
      title: "You finished “Letting people pass”",
      message:
        "You practised keeping shared paths open. A quick step aside keeps a place working for everyone.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson teaches general courtesy in shared spaces without assuming one culture’s norms about personal space.",
    ],
    accessibilityNotes: [
      "The lesson builds awareness of wheelchair and pram users’ need for clear paths, framed as ordinary courtesy.",
      "It does not require quick reactions; noticing and moving at any pace counts.",
    ],
    safetyNotes: [
      "Moving aside is framed as staying near your group, not wandering off in a busy place.",
    ],
    version: 1,
  },

  {
    id: "community-town-shared-things",
    slug: "community-town-shared-things",
    moduleId,
    order: 5,
    title: "Looking after shared things",
    description:
      "The library books and the park swings belong to everyone. How do we take care of things we all share?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that shared things belong to everyone and need care.",
      "Name a way to look after something shared.",
      "Recognise that caring for shared things means the next person can enjoy them too.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-library-book",
        title: "The library book",
        narration:
          "You have borrowed a lovely book from the town library. You are eating a snack, and there is a wobbly page you could easily fold to keep your place. This book will go back for other children to read.",
        illustrationKey: "town-library",
        prompt: "What could you do?",
        choices: [
          {
            id: "care-for-it",
            text: "Keep it clean, and use a bookmark instead of folding the page.",
            consequenceType: "helpful",
            response:
              "You looked after it for the next reader. Shared things like library books pass through many hands — keeping them nice means the child who borrows it after you gets the same lovely book.",
          },
          {
            id: "not-mine-problem",
            text: "Fold the page and eat over it — it is not really yours to worry about.",
            consequenceType: "mixed",
            response:
              "It is true the book is not yours to keep. But that is exactly why it needs care — it belongs to everyone. A folded, sticky page is a little worse for the next person, and the next.",
          },
          {
            id: "put-back-nicely",
            text: "Finish your snack first, then read with clean hands.",
            consequenceType: "needs_context",
            response:
              "A thoughtful plan — keeping food and shared things apart protects them. Little habits like clean hands and a bookmark keep shared things good for a long time.",
          },
        ],
      },
    ],
    principle: {
      title: "Shared things need everyone's care",
      body: "Library books, park swings, and museum toys belong to everyone, which means everyone helps look after them. It matters because a shared thing passes through many hands — taking care of it means the next person gets to enjoy it just as you did.",
      points: [
        "Shared things are not nobody’s to care for — they are everyone’s.",
        "Small habits — clean hands, a bookmark, putting things back — keep them nice.",
        "Caring for a shared thing is a kindness to the next person who uses it.",
        "If something shared is already broken, tell a grown-up rather than trying to fix or hide it.",
      ],
    },
    practice: {
      prompt:
        "You’re using something lots of people share. How will you look after it?",
      helperText: "Pick a caring habit.",
      options: [
        {
          id: "keep-clean",
          text: "Keep it clean and gentle",
          encouragement:
            "The next person will get the same lovely thing. Kind.",
        },
        {
          id: "put-back",
          text: "Put it back nicely when I’m done",
          encouragement: "Ready for the next person. Thoughtful.",
        },
        {
          id: "tell-if-broken",
          text: "Tell a grown-up if it’s broken",
          encouragement: "Honest and helpful — that’s the right call.",
        },
      ],
      closing:
        "Look after the things we all share. It’s a kindness to everyone who uses them next.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, take good care of one shared thing — a library book, a park toy, a shared game — so the next person can enjoy it.",
      parentPrompt:
        "Name shared things this week — “this belongs to everyone” — and let your child help return them in good shape.",
      completionQuestion: "What shared thing did you look after, and how?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Caring for shared things teaches that public goods depend on all of us. Naming ‘this belongs to everyone’ makes it concrete.",
      tryThis: [
        "Point out shared things: “The library’s books are for everyone.”",
        "Model gentle handling and putting things back.",
        "Teach reporting damage honestly, without fear of blame.",
      ],
    },
    completion: {
      title: "You finished “Looking after shared things”",
      message:
        "You practised caring for something everyone shares. Looking after it means the next person enjoys it too.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson builds a sense of shared, communal responsibility, which resonates across many cultural values.",
    ],
    accessibilityNotes: [
      "The lesson does not depend on fine motor perfection; the point is care and honesty, at any ability.",
      "Reporting damage is framed as helpful, not as risking blame.",
    ],
    safetyNotes: [
      "Children are told to tell a grown-up about broken shared things rather than handling potentially unsafe breakages themselves.",
    ],
    version: 1,
  },

  {
    id: "community-town-asking-for-help",
    slug: "community-town-asking-for-help",
    moduleId,
    order: 6,
    title: "Asking for help when you're stuck",
    description:
      "You're out and about and something has gone wrong — you can't find your grown-up. Who is safe to ask?",
    estimatedMinutes: 6,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that asking for help when stuck or lost is a smart, brave thing to do.",
      "Name who is safe to ask for help in a public place.",
      "Recognise that staying put and findable helps a grown-up find you.",
    ],
    skillArea,
    scenes: [
      {
        id: "cant-find-grownup",
        title: "Where did they go?",
        narration:
          "You were right beside your grown-up in the busy town square, and now, somehow, you cannot see them. Your heart beats a bit faster. There are lots of people around.",
        illustrationKey: "town-square",
        prompt: "What is a good thing to do?",
        choices: [
          {
            id: "find-safe-helper",
            text: "Stay where you are and ask a person in a uniform, or a grown-up with children, for help.",
            consequenceType: "helpful",
            response:
              "That is exactly right. Staying findable and asking a safe helper — someone in a uniform, or a parent with kids — is the smart, brave thing to do. It is how you and your grown-up find each other again.",
          },
          {
            id: "wander-looking",
            text: "Rush off through the crowd to look for them.",
            consequenceType: "mixed",
            response:
              "You want to find them fast — that makes sense. But moving through a big crowd usually makes it harder for a grown-up to find you. Staying in one spot where you can be seen works far better.",
          },
          {
            id: "wait-a-moment",
            text: "Stop, take a breath, and look around for a safe helper before moving.",
            consequenceType: "needs_context",
            response:
              "A calm, sensible start. Stopping and breathing helps you think. Then finding a safe helper — a uniform, a shop worker, a parent with children — is the next good step. Staying put keeps you findable.",
          },
        ],
      },
    ],
    principle: {
      title: "Asking for help is smart and brave",
      body: "When you are stuck, lost, or something is wrong, asking for help is one of the bravest and smartest things you can do. It matters because grown-ups expect to help children — and knowing who is safe to ask, and staying findable, gets you back to your own grown-up quickly.",
      points: [
        "Safe helpers include people in uniforms, shop workers, and grown-ups with their own children.",
        "Staying in one spot where you can be seen makes it easier to be found.",
        "Asking for help is never silly or babyish — it is the clever thing to do.",
        "Your grown-up wants you to ask for help; you will never be in trouble for it.",
      ],
    },
    practice: {
      prompt:
        "You’re stuck or can’t find your grown-up in a public place. What will you do?",
      helperText: "Pick the safe, smart move.",
      options: [
        {
          id: "stay-and-ask",
          text: "Stay put and ask a safe helper",
          encouragement:
            "Exactly right. Staying findable and asking is the brave move.",
        },
        {
          id: "find-uniform",
          text: "Look for someone in a uniform",
          encouragement: "A great safe helper to find. Smart thinking.",
        },
        {
          id: "breathe-first",
          text: "Stop, breathe, then find a helper",
          encouragement: "Calm first, then act. A really sensible plan.",
        },
      ],
      closing:
        "If you’re ever stuck or lost, stay put and ask a safe helper. It’s the bravest, smartest thing to do.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, talk with your grown-up about who safe helpers are where you go, and what to do if you get separated.",
      parentPrompt:
        "Make a simple ‘if we get separated’ plan together — stay put, find a uniform or a parent with kids — and practise spotting safe helpers.",
      completionQuestion:
        "Who did you and your grown-up decide are safe helpers where you go?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "A rehearsed ‘if we get separated’ plan is genuinely protective. Keep it calm and empowering, not frightening.",
      tryThis: [
        "Agree a plan: stay put, ask a uniform or a parent with children.",
        "Reassure them they’ll never be in trouble for getting help.",
        "Point out safe helpers on outings so spotting them becomes familiar.",
      ],
    },
    completion: {
      title: "You finished “Asking for help when you're stuck”",
      message:
        "You practised the smart, brave thing: stay findable and ask a safe helper. Your grown-up always wants you to ask.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson names broadly-recognisable safe helpers while acknowledging families may add their own trusted people.",
    ],
    accessibilityNotes: [
      "The plan is concrete and rehearsable, supporting children who freeze or panic when lost.",
      "It does not rely on reading a complex social scene under stress.",
    ],
    safetyNotes: [
      "This is a core safety lesson: identify safe helpers (uniforms, staff, parents with children), stay put and findable, and know you are never in trouble for asking. It is flagged for careful, calm delivery.",
    ],
    version: 1,
  },

  {
    id: "community-town-being-patient",
    slug: "community-town-being-patient",
    moduleId,
    order: 7,
    title: "When waiting is hard",
    description:
      "The wait is long and boring and your body is wriggly. What can you do with a hard, impatient feeling?",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Explain that impatience is a normal feeling, not bad behaviour.",
      "Name a way to help a wriggly, impatient feeling.",
      "Recognise that everyone finds waiting hard sometimes.",
    ],
    skillArea,
    scenes: [
      {
        id: "the-long-wait",
        title: "The endless wait",
        narration:
          "You have been waiting ages while your grown-up sorts something out at the town office. It is boring, your legs feel wriggly, and the impatient feeling is bubbling up inside you.",
        illustrationKey: "town-square",
        prompt: "What could you do with the wriggly feeling?",
        choices: [
          {
            id: "calm-strategy",
            text: "Try a quiet game or some slow breaths to help the feeling settle.",
            consequenceType: "helpful",
            response:
              "You gave the wriggly feeling something to do. A counting game, spotting shapes, or slow breaths can turn an impatient feeling into a manageable one — waiting really is hard, and tricks help.",
          },
          {
            id: "make-a-fuss",
            text: "Whine and tug at your grown-up to hurry up.",
            consequenceType: "mixed",
            response:
              "The impatient feeling is real, and it is okay to feel it. But whining and tugging usually does not make things faster, and it makes the wait harder for you and your grown-up. A calming trick helps more.",
          },
          {
            id: "name-the-feeling",
            text: "Tell your grown-up, “This is really hard to wait for.”",
            consequenceType: "needs_context",
            response:
              "Naming the feeling out loud can make it smaller, and your grown-up can help — maybe with a game, a snack, or a rough idea of how much longer. Saying how you feel is better than bottling it up.",
          },
        ],
      },
    ],
    principle: {
      title: "Impatience is a feeling, not being bad",
      body: "Feeling wriggly and impatient during a long, boring wait is completely normal — it does not mean you are being naughty. It helps to know this because then you can look after the feeling with a game, a breath, or by naming it, instead of it turning into a meltdown.",
      points: [
        "Everyone finds waiting hard sometimes — the feeling is normal.",
        "A quiet game, counting, or slow breaths can settle a wriggly feeling.",
        "Naming it — “this is hard to wait for” — can make it smaller.",
        "It is okay to ask your grown-up for help with a long wait.",
      ],
    },
    practice: {
      prompt: "A long wait is making you wriggly. What will help?",
      helperText: "Pick what would help you.",
      options: [
        {
          id: "quiet-game",
          text: "Play a quiet game in my head",
          encouragement: "A great way to give the feeling somewhere to go.",
        },
        {
          id: "slow-breaths",
          text: "Take some slow breaths",
          encouragement: "Calming your body helps a lot. Nice.",
        },
        {
          id: "name-it",
          text: "Tell my grown-up it’s hard to wait",
          encouragement: "Naming it can shrink it — and they can help.",
        },
      ],
      closing:
        "Waiting is hard for everyone sometimes. A game, a breath, or naming it all help.",
    },
    offlineMission: {
      childPrompt:
        "Before your next lesson, during a long wait, try one thing to help the impatient feeling — a game, breaths, or telling your grown-up.",
      parentPrompt:
        "Next long wait, offer a coping tool early (a game, a snack, a rough time estimate) rather than waiting for the meltdown.",
      completionQuestion: "What helped you when waiting felt really hard?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "Impatience is developmentally normal, not misbehaviour. Coping tools and empathy work far better than ‘be patient’.",
      tryThis: [
        "Validate the feeling: “Waiting is really hard, isn’t it.”",
        "Offer tools early: a game, a snack, ‘about five more minutes’.",
        "Model your own waiting strategies out loud.",
      ],
    },
    completion: {
      title: "You finished “When waiting is hard”",
      message:
        "You practised looking after a wriggly, impatient feeling. Waiting is hard for everyone — and tricks really help.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The lesson normalises impatience across all children rather than framing calm waiting as a mark of a ‘good’ child.",
    ],
    accessibilityNotes: [
      "It supports children with big feelings or attention differences by offering concrete regulation tools.",
      "Naming feelings aloud is offered as an equal strategy to internal games.",
    ],
    safetyNotes: [
      "The lesson treats impatience without shame, protecting children from being labelled ‘naughty’ for a normal feeling.",
    ],
    version: 1,
  },

  {
    id: "community-town-review",
    slug: "community-town-review",
    moduleId,
    order: 8,
    title: "Review and real-world challenge",
    description:
      "A busy trip into town, using it all: lines, quiet voices, making room, and knowing who to ask.",
    estimatedMinutes: 7,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: [
      "Bring together waiting, matching your voice, making room, and asking for help.",
      "Choose a public-space move that fits a real moment.",
      "Carry one out-and-about skill into a real trip.",
    ],
    skillArea,
    scenes: [
      {
        id: "a-trip-to-town",
        title: "A big trip out",
        narration:
          "You are out in the busy town: a line at the shop, the quiet library to visit, a full bus to ride, and lots of people about. It is a lot of sharing-the-space all in one trip.",
        illustrationKey: "town-square",
        prompt: "The bus is full and someone needs a seat. What do you do?",
        choices: [
          {
            id: "make-room-safely",
            text: "Offer your seat, staying close to your grown-up.",
            consequenceType: "helpful",
            response:
              "You made room for someone who needed it and stayed safe with your grown-up — sharing the space and looking after yourself at once. That is being out and about at its best.",
          },
          {
            id: "ignore-it",
            text: "Pretend not to notice and keep your seat.",
            consequenceType: "mixed",
            response:
              "It is comfy to stay put. But part of sharing a place is noticing who needs room — a small offer would help someone and cost you little. Looking out for each other is what makes a town kind.",
          },
          {
            id: "check-with-grownup",
            text: "Ask your grown-up whether to offer, then do it together.",
            consequenceType: "needs_context",
            response:
              "A sensible, safe way to do a kind thing — checking with your grown-up keeps you close and still helps the person who needs the seat.",
          },
        ],
      },
    ],
    principle: {
      title: "Sharing a place means looking out for each other",
      body: "Everything in this world is one idea: places we all use work when we share them and look out for each other — waiting our turn, matching our voice, making room, caring for shared things, and asking for help when we need it. It helps because a town, a bus, or a library belongs to everyone, including you.",
      points: [
        "Wait your fair turn, and use a game to make waiting easier.",
        "Match your voice to the place, and keep shared paths open.",
        "Make room for people who need it, and care for shared things.",
        "If you are stuck or lost, stay findable and ask a safe helper — you’re never in trouble for it.",
      ],
    },
    practice: {
      prompt:
        "Pick the out-and-about skill you want to take into the real world this week.",
      helperText: "There is no wrong choice — pick what you want to practise.",
      options: [
        {
          id: "practise-waiting",
          text: "Waiting my turn well",
          encouragement: "A waiting trick makes lines easy. Great pick.",
        },
        {
          id: "practise-voice",
          text: "Matching my voice to the place",
          encouragement: "Reading a place like that is a real skill. Nice.",
        },
        {
          id: "practise-room",
          text: "Making room for others",
          encouragement: "Looking out for each other. Kind and grown-up.",
        },
        {
          id: "practise-help",
          text: "Knowing who to ask for help",
          encouragement: "The bravest, smartest skill of all. Strong choice.",
        },
      ],
      closing:
        "Take your one out-and-about skill on a real trip this week. Shared places are everyone’s — you know how to share them now.",
    },
    offlineMission: {
      childPrompt:
        "This week, on a real trip out, practise sharing the space — wait a turn, match your voice, make room, or spot the safe helpers.",
      parentPrompt:
        "On an outing this week, let your child lead one public-space skill (waiting, voice, making room) and rehearse the safe-helper plan.",
      completionQuestion:
        "Where did you go, and which sharing-the-space skill did you use?",
    },
    parentCoaching: {
      title: "For the grown-up alongside",
      prompt:
        "A real outing practises the whole world at once. Rehearse the safe-helper plan every time — it’s the one that matters most.",
      tryThis: [
        "Let your child lead one courtesy on the trip and notice it warmly.",
        "Re-run the ‘if we get separated’ plan before busy outings.",
        "Offer waiting tools proactively; keep public-space skills low-pressure.",
      ],
    },
    completion: {
      title: "You finished “Out and About”",
      message:
        "You put it all together — waiting, voices, making room, caring for shared things, and asking for help. Take it on your next trip out.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: [
      "The review acknowledges that queue and volume norms vary by place, while teaching shared care everywhere.",
    ],
    accessibilityNotes: [
      "Every public-space skill has a concrete, rehearsable form, supporting children who find busy places hard.",
      "Making room together with an adult keeps the kindness safe for younger children.",
    ],
    safetyNotes: [
      "The review re-emphasises the safe-helper plan — stay findable, ask a uniform or a parent with children — as the priority skill.",
    ],
    version: 1,
  },
];
