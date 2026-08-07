import {
  guestsHostsModule,
  eatingTogetherModule,
  kindnessThanksModule,
  kindOnScreensModule,
  makingFriendsModule,
  makingThingsRightModule,
  manyCustomsModule,
  meetingPeopleModule,
  outAndAboutModule,
  safeAndBraveModule,
  talkingListeningModule,
  workingTogetherModule,
} from "./modules";

/**
 * The Neighborhood — the twelve module worlds of the learning map
 * (docs/design/MODULE_WORLDS.md).
 *
 * A "world" is the place on the map; a "module" is the lesson content that
 * lives there. Every world now hosts an authored module of eight lessons, so
 * each carries a `moduleId` and a `pathHref` into its learning path. New worlds
 * open a little at a time on the map (COMPONENT_STATES.md §03); an unstarted
 * world reads as "a little later", never as a demerit.
 *
 * `id` is the theme slug: it matches a `[data-module="…"]` block in
 * src/styles/tokens.css, so wrapping a node in `data-module={world.id}` themes
 * it with that world's accent/tint. For every world after Hello Garden the
 * module `id` is the same slug, so a lesson themes itself just by carrying its
 * `moduleId`; Meeting People keeps the historical id `meeting-people`, which
 * tokens.css aliases to the `hello-garden` theme, and Hello Garden's path stays
 * at `/learn`. `motif` is the world's single motif shape (DESIGN.md §6).
 * Adjacent worlds never share a hue family (MODULE_WORLDS.md §3).
 */

export type NeighborhoodWorld = {
  /** Theme slug; matches a [data-module] block and the map node's accent. */
  id: string;
  order: number;
  title: string;
  /** One short, child-facing line: what this world is about. */
  teaches: string;
  /** The world's motif shape (DESIGN.md §6). */
  motif: string;
  /** The curriculum module whose lessons this world hosts, when content exists. */
  moduleId?: string;
  /** Where this world's learning path lives, when it has content. */
  pathHref?: string;
};

export const neighborhoodWorlds: readonly NeighborhoodWorld[] = [
  {
    id: "hello-garden",
    order: 1,
    title: "Hello Garden",
    teaches: "Saying hello and meeting new people",
    motif: "petal",
    moduleId: meetingPeopleModule.id,
    pathHref: "/learn",
  },
  {
    id: "echo-treehouse",
    order: 2,
    title: "Echo Treehouse",
    teaches: "Listening and taking turns to talk",
    motif: "echo-ring",
    moduleId: talkingListeningModule.id,
    pathHref: "/learn/module/echo-treehouse",
  },
  {
    id: "friendship-forest",
    order: 3,
    title: "Friendship Forest",
    teaches: "Joining in and making room for friends",
    motif: "leaf",
    moduleId: makingFriendsModule.id,
    pathHref: "/learn/module/friendship-forest",
  },
  {
    id: "build-it-workshop",
    order: 4,
    title: "Build-It Workshop",
    teaches: "Working together and sharing a plan",
    motif: "brick",
    moduleId: workingTogetherModule.id,
    pathHref: "/learn/module/build-it-workshop",
  },
  {
    id: "bridge-builders-bay",
    order: 5,
    title: "Bridge Builders Bay",
    teaches: "Saying sorry and making things right",
    motif: "wave",
    moduleId: makingThingsRightModule.id,
    pathHref: "/learn/module/bridge-builders-bay",
  },
  {
    id: "thankful-kitchen",
    order: 6,
    title: "Thankful Kitchen",
    teaches: "Little kind and thankful things",
    motif: "steam-curl",
    moduleId: kindnessThanksModule.id,
    pathHref: "/learn/module/thankful-kitchen",
  },
  {
    id: "welcome-home",
    order: 7,
    title: "Welcome Home",
    teaches: "Being a good guest and a good host",
    motif: "mat-stripe",
    moduleId: guestsHostsModule.id,
    pathHref: "/learn/module/welcome-home",
  },
  {
    id: "community-town",
    order: 8,
    title: "Community Town",
    teaches: "Sharing places we all use",
    motif: "crosswalk-stripe",
    moduleId: outAndAboutModule.id,
    pathHref: "/learn/module/community-town",
  },
  {
    id: "sunny-table-cafe",
    order: 9,
    title: "Sunny Table Café",
    teaches: "Sitting down to eat together",
    motif: "sun-ray",
    moduleId: eatingTogetherModule.id,
    pathHref: "/learn/module/sunny-table-cafe",
  },
  {
    id: "pixel-plaza",
    order: 10,
    title: "Pixel Plaza",
    teaches: "Being kind on screens",
    motif: "pixel",
    moduleId: kindOnScreensModule.id,
    pathHref: "/learn/module/pixel-plaza",
  },
  {
    id: "brave-basecamp",
    order: 11,
    title: "Brave Basecamp",
    teaches: "Saying no and getting help",
    motif: "compass-diamond",
    moduleId: safeAndBraveModule.id,
    pathHref: "/learn/module/brave-basecamp",
  },
  {
    id: "world-garden",
    order: 12,
    title: "World Garden",
    teaches: "Many customs, one shared garden",
    motif: "mixed-petals",
    moduleId: manyCustomsModule.id,
    pathHref: "/learn/module/world-garden",
  },
];

const worldsByModuleId: ReadonlyMap<string, NeighborhoodWorld> = new Map(
  neighborhoodWorlds
    .filter((world) => world.moduleId !== undefined)
    .map((world) => [world.moduleId as string, world]),
);

/** The world hosting a given module, or undefined if none does. */
export function getWorldByModuleId(
  moduleId: string,
): NeighborhoodWorld | undefined {
  return worldsByModuleId.get(moduleId);
}

/**
 * Where a module's learning path lives — its world's `pathHref`, falling back
 * to `/learn` (Hello Garden's home) for anything not mapped. Used by the lesson
 * runner to send a child back to the right world's path.
 */
export function modulePathHref(moduleId: string): string {
  return getWorldByModuleId(moduleId)?.pathHref ?? "/learn";
}
