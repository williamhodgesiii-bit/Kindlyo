import type { ContentStatus } from "@/features/curriculum/schema";

/**
 * The module outline for the whole neighborhood.
 *
 * A "module" is the lesson content; a "world" (src/content/worlds.ts) is the
 * place on the map that hosts it. The flagship module, Meeting People, lives in
 * Hello Garden; each of the other eleven worlds hosts one module of eight
 * lessons (docs/design/MODULE_WORLDS.md, "the twelve worlds").
 *
 * Every entry carrying a `slug` has authored content in `./lessons`; an entry
 * without one is outlined but not yet written, and the learning path shows it as
 * "being written" rather than pretending it exists.
 *
 * A module's `id` doubles as its theme slug for every world after the first: it
 * matches a `[data-module="…"]` block in src/styles/tokens.css and the world's
 * own `id`, so a lesson themes its surface simply by carrying its `moduleId`.
 * Meeting People keeps the historical id `meeting-people`, which tokens.css
 * aliases to the `hello-garden` theme.
 *
 * All curriculum content is draft content until reviewed by qualified humans
 * (CLAUDE.md, "Content status").
 */

export type ModuleLessonEntry = {
  order: number;
  title: string;
  /** Present once the lesson has authored content in `./lessons`. */
  slug?: string;
};

export type CurriculumModule = {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  lessons: readonly ModuleLessonEntry[];
};

export const meetingPeopleModule: CurriculumModule = {
  id: "meeting-people",
  title: "Meeting People",
  description:
    "Eight short lessons about noticing other people, starting a conversation, and leaving one kindly.",
  status: "draft",
  lessons: [
    { order: 1, title: "Saying hello", slug: "saying-hello" },
    { order: 2, title: "Introducing yourself", slug: "introducing-yourself" },
    { order: 3, title: "Remembering and using names", slug: "using-names" },
    { order: 4, title: "Meeting someone new", slug: "meeting-someone-new" },
    { order: 5, title: "Joining a group", slug: "joining-a-group" },
    { order: 6, title: "Listening while someone speaks", slug: "listening" },
    {
      order: 7,
      title: "Leaving a conversation",
      slug: "leaving-a-conversation",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "review-challenge",
    },
  ],
};

export const talkingListeningModule: CurriculumModule = {
  id: "echo-treehouse",
  title: "Talking and Listening",
  description:
    "Eight short lessons about listening well, taking turns, and showing somebody you really heard them.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "Listening with your whole self",
      slug: "echo-treehouse-whole-self-listening",
    },
    {
      order: 2,
      title: "Waiting for a pause",
      slug: "echo-treehouse-waiting-for-a-pause",
    },
    {
      order: 3,
      title: "Taking your turn to talk",
      slug: "echo-treehouse-taking-your-turn",
    },
    {
      order: 4,
      title: "Showing you heard",
      slug: "echo-treehouse-showing-you-heard",
    },
    {
      order: 5,
      title: "When two people talk at once",
      slug: "echo-treehouse-talking-at-once",
    },
    {
      order: 6,
      title: "Asking a good question",
      slug: "echo-treehouse-asking-a-question",
    },
    {
      order: 7,
      title: "When you didn't hear or understand",
      slug: "echo-treehouse-when-you-didnt-hear",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "echo-treehouse-review",
    },
  ],
};

export const makingFriendsModule: CurriculumModule = {
  id: "friendship-forest",
  title: "Making Friends",
  description:
    "Eight short lessons about joining in, inviting others, and making room so everyone belongs.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "Asking to join in",
      slug: "friendship-forest-asking-to-join",
    },
    {
      order: 2,
      title: "Inviting someone in",
      slug: "friendship-forest-inviting-someone-in",
    },
    {
      order: 3,
      title: "Making room for one more",
      slug: "friendship-forest-making-room",
    },
    {
      order: 4,
      title: "Playing side by side",
      slug: "friendship-forest-side-by-side",
    },
    {
      order: 5,
      title: "When someone says “not right now”",
      slug: "friendship-forest-not-right-now",
    },
    {
      order: 6,
      title: "Being a friend when someone is sad",
      slug: "friendship-forest-friend-when-sad",
    },
    {
      order: 7,
      title: "A game everyone can play",
      slug: "friendship-forest-a-game-for-everyone",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "friendship-forest-review",
    },
  ],
};

export const workingTogetherModule: CurriculumModule = {
  id: "build-it-workshop",
  title: "Working Together",
  description:
    "Eight short lessons about planning together, sharing tools and turns, and building something as a team.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "Making a plan together",
      slug: "build-it-workshop-making-a-plan",
    },
    {
      order: 2,
      title: "Asking before you take",
      slug: "build-it-workshop-ask-before-you-take",
    },
    {
      order: 3,
      title: "Taking turns with one tool",
      slug: "build-it-workshop-taking-turns",
    },
    {
      order: 4,
      title: "Offering to help lift",
      slug: "build-it-workshop-offering-to-help",
    },
    {
      order: 5,
      title: "When you both want the same piece",
      slug: "build-it-workshop-both-want-same",
    },
    {
      order: 6,
      title: "The planner takes turns",
      slug: "build-it-workshop-planner-rotates",
    },
    {
      order: 7,
      title: "Finishing it together",
      slug: "build-it-workshop-finishing-together",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "build-it-workshop-review",
    },
  ],
};

export const makingThingsRightModule: CurriculumModule = {
  id: "bridge-builders-bay",
  title: "Making Things Right",
  description:
    "Eight short lessons about what to do after a wobble — repairing, accepting an apology, and saying no kindly.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "When something goes wrong",
      slug: "bridge-builders-bay-when-it-goes-wrong",
    },
    {
      order: 2,
      title: "More than “sorry”",
      slug: "bridge-builders-bay-more-than-sorry",
    },
    {
      order: 3,
      title: "Saying what you'll do differently",
      slug: "bridge-builders-bay-what-ill-do-differently",
    },
    {
      order: 4,
      title: "When someone says sorry to you",
      slug: "bridge-builders-bay-when-someone-says-sorry",
    },
    {
      order: 5,
      title: "When you're still upset",
      slug: "bridge-builders-bay-when-youre-still-upset",
    },
    {
      order: 6,
      title: "Fixing it together",
      slug: "bridge-builders-bay-fixing-it-together",
    },
    {
      order: 7,
      title: "Saying no and staying friends",
      slug: "bridge-builders-bay-no-and-still-friends",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "bridge-builders-bay-review",
    },
  ],
};

export const kindnessThanksModule: CurriculumModule = {
  id: "thankful-kitchen",
  title: "Kindness and Thanks",
  description:
    "Eight short lessons about noticing kindness, saying thank you your own way, and small helpful actions that add up.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "Noticing something kind",
      slug: "thankful-kitchen-noticing-kindness",
    },
    {
      order: 2,
      title: "Saying thank you your way",
      slug: "thankful-kitchen-thank-you-your-way",
    },
    {
      order: 3,
      title: "Small helpful actions",
      slug: "thankful-kitchen-small-helpful-actions",
    },
    {
      order: 4,
      title: "Thanking people we don't always notice",
      slug: "thankful-kitchen-people-we-dont-notice",
    },
    {
      order: 5,
      title: "Giving without keeping score",
      slug: "thankful-kitchen-giving-without-scoring",
    },
    {
      order: 6,
      title: "Taking a kindness kindly",
      slug: "thankful-kitchen-receiving-kindly",
    },
    {
      order: 7,
      title: "Passing kindness on",
      slug: "thankful-kitchen-passing-it-on",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "thankful-kitchen-review",
    },
  ],
};

export const guestsHostsModule: CurriculumModule = {
  id: "welcome-home",
  title: "Guests and Hosts",
  description:
    "Eight short lessons about welcoming visitors, being a thoughtful guest, and how every home has its own ways.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "Welcoming someone in",
      slug: "welcome-home-welcoming-someone-in",
    },
    {
      order: 2,
      title: "Making a guest comfortable",
      slug: "welcome-home-making-a-guest-comfortable",
    },
    {
      order: 3,
      title: "Being a thoughtful guest",
      slug: "welcome-home-being-a-good-guest",
    },
    {
      order: 4,
      title: "Every home has its own ways",
      slug: "welcome-home-every-home-its-ways",
    },
    {
      order: 5,
      title: "Sharing your space and things",
      slug: "welcome-home-sharing-your-space",
    },
    {
      order: 6,
      title: "When you need a break",
      slug: "welcome-home-needing-a-break",
    },
    {
      order: 7,
      title: "Saying goodbye and thank you",
      slug: "welcome-home-saying-goodbye",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "welcome-home-review",
    },
  ],
};

export const outAndAboutModule: CurriculumModule = {
  id: "community-town",
  title: "Out and About",
  description:
    "Eight short lessons about sharing the places we all use — lines, quiet places, seats, and asking for help.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "Waiting your turn in a line",
      slug: "community-town-waiting-in-line",
    },
    {
      order: 2,
      title: "Quiet places and loud places",
      slug: "community-town-quiet-and-loud-places",
    },
    {
      order: 3,
      title: "Making room on the bus",
      slug: "community-town-making-room",
    },
    {
      order: 4,
      title: "Letting people pass",
      slug: "community-town-letting-people-pass",
    },
    {
      order: 5,
      title: "Looking after shared things",
      slug: "community-town-shared-things",
    },
    {
      order: 6,
      title: "Asking for help when you're stuck",
      slug: "community-town-asking-for-help",
    },
    {
      order: 7,
      title: "When waiting is hard",
      slug: "community-town-being-patient",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "community-town-review",
    },
  ],
};

export const eatingTogetherModule: CurriculumModule = {
  id: "sunny-table-cafe",
  title: "Eating Together",
  description:
    "Eight short lessons about sharing a table — passing things kindly, waiting for others, and “no thank you” as good manners too.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "Coming to the table",
      slug: "sunny-table-cafe-coming-to-the-table",
    },
    {
      order: 2,
      title: "Passing things kindly",
      slug: "sunny-table-cafe-passing-kindly",
    },
    {
      order: 3,
      title: "Waiting until everyone has some",
      slug: "sunny-table-cafe-waiting-for-everyone",
    },
    {
      order: 4,
      title: "“No thank you” is table manners too",
      slug: "sunny-table-cafe-no-thank-you",
    },
    {
      order: 5,
      title: "Talking and listening at the table",
      slug: "sunny-table-cafe-talk-and-listen",
    },
    {
      order: 6,
      title: "Forks, hands, and chopsticks",
      slug: "sunny-table-cafe-forks-hands-chopsticks",
    },
    {
      order: 7,
      title: "Helping clear up",
      slug: "sunny-table-cafe-helping-clear-up",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "sunny-table-cafe-review",
    },
  ],
};

export const kindOnScreensModule: CurriculumModule = {
  id: "pixel-plaza",
  title: "Kind on Screens",
  description:
    "Eight short lessons about being kind on screens — friendly messages, asking before sharing, and telling a trusted adult.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "Kind words on a screen",
      slug: "pixel-plaza-kind-words-on-a-screen",
    },
    {
      order: 2,
      title: "Asking before you share a photo",
      slug: "pixel-plaza-asking-before-you-share",
    },
    {
      order: 3,
      title: "Keeping private things private",
      slug: "pixel-plaza-private-things-private",
    },
    {
      order: 4,
      title: "When a message feels wrong",
      slug: "pixel-plaza-when-a-message-feels-wrong",
    },
    {
      order: 5,
      title: "Screens have an off button",
      slug: "pixel-plaza-screens-have-an-off-button",
    },
    {
      order: 6,
      title: "Saying no on a screen",
      slug: "pixel-plaza-saying-no-online",
    },
    {
      order: 7,
      title: "Being kind to someone left out",
      slug: "pixel-plaza-kind-to-someone-left-out",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "pixel-plaza-review",
    },
  ],
};

export const safeAndBraveModule: CurriculumModule = {
  id: "brave-basecamp",
  title: "Safe and Brave",
  description:
    "Eight short lessons about your body belonging to you, saying no, trusted adults, and safety always coming before politeness.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "Your body belongs to you",
      slug: "brave-basecamp-your-body-is-yours",
    },
    {
      order: 2,
      title: "Saying no, and meaning it",
      slug: "brave-basecamp-saying-no-and-meaning-it",
    },
    {
      order: 3,
      title: "Safe and unsafe feelings",
      slug: "brave-basecamp-safe-and-unsafe-feelings",
    },
    {
      order: 4,
      title: "Secrets that should never be kept",
      slug: "brave-basecamp-secrets-to-never-keep",
    },
    {
      order: 5,
      title: "Your trusted adults",
      slug: "brave-basecamp-your-trusted-adults",
    },
    {
      order: 6,
      title: "Asking for help",
      slug: "brave-basecamp-asking-for-help",
    },
    {
      order: 7,
      title: "Safety comes before politeness",
      slug: "brave-basecamp-safety-before-politeness",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "brave-basecamp-review",
    },
  ],
};

export const manyCustomsModule: CurriculumModule = {
  id: "world-garden",
  title: "Many Customs",
  description:
    "Eight short lessons about the many ways families do things — greetings, tables, and celebrations — met with curiosity and respect.",
  status: "draft",
  lessons: [
    {
      order: 1,
      title: "So many ways to say hello",
      slug: "world-garden-many-ways-to-say-hello",
    },
    {
      order: 2,
      title: "Different tables, different ways",
      slug: "world-garden-different-tables",
    },
    {
      order: 3,
      title: "So many things to celebrate",
      slug: "world-garden-many-celebrations",
    },
    {
      order: 4,
      title: "Asking with kindness, not staring",
      slug: "world-garden-asking-with-kindness",
    },
    {
      order: 5,
      title: "Names from everywhere",
      slug: "world-garden-names-from-everywhere",
    },
    {
      order: 6,
      title: "What we all share",
      slug: "world-garden-what-we-share",
    },
    {
      order: 7,
      title: "A garden with room for everyone",
      slug: "world-garden-room-for-everyone",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "world-garden-review",
    },
  ],
};

/**
 * Every module, in map order (docs/design/MODULE_WORLDS.md). Hello Garden's
 * Meeting People first, then one module per world along the neighborhood path.
 */
export const curriculumModules: readonly CurriculumModule[] = [
  meetingPeopleModule,
  talkingListeningModule,
  makingFriendsModule,
  workingTogetherModule,
  makingThingsRightModule,
  kindnessThanksModule,
  guestsHostsModule,
  outAndAboutModule,
  eatingTogetherModule,
  kindOnScreensModule,
  safeAndBraveModule,
  manyCustomsModule,
];

const modulesById: ReadonlyMap<string, CurriculumModule> = new Map(
  curriculumModules.map((module) => [module.id, module]),
);

/** Returns undefined for an unknown module id. */
export function getModuleById(id: string): CurriculumModule | undefined {
  return modulesById.get(id);
}
