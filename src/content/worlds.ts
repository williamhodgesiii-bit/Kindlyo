import { meetingPeopleModule } from "./modules";

/**
 * The Neighborhood — the twelve module worlds of the learning map
 * (docs/design/MODULE_WORLDS.md).
 *
 * A "world" is the place on the map; a "module" is the lesson content that
 * lives there. Only Hello Garden has authored content in this MVP (it is the
 * repo's `meeting-people` module — same eight greetings lessons), so it is the
 * one world with a `moduleId` and a `pathHref`. The other eleven are listed so
 * the map shows the shape of the neighborhood without pretending the lessons
 * exist — they render as "a little later", never as a demerit
 * (COMPONENT_STATES.md §03).
 *
 * `id` is the theme slug: it matches a `[data-module="…"]` block in
 * src/styles/tokens.css, so wrapping a node in `data-module={world.id}` themes
 * it with that world's accent/tint. `motif` is the world's single motif shape
 * (DESIGN.md §6). Adjacent worlds never share a hue family (MODULE_WORLDS.md §3).
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
  },
  {
    id: "friendship-forest",
    order: 3,
    title: "Friendship Forest",
    teaches: "Joining in and making room for friends",
    motif: "leaf",
  },
  {
    id: "build-it-workshop",
    order: 4,
    title: "Build-It Workshop",
    teaches: "Working together and sharing a plan",
    motif: "brick",
  },
  {
    id: "bridge-builders-bay",
    order: 5,
    title: "Bridge Builders Bay",
    teaches: "Saying sorry and making things right",
    motif: "wave",
  },
  {
    id: "thankful-kitchen",
    order: 6,
    title: "Thankful Kitchen",
    teaches: "Little kind and thankful things",
    motif: "steam-curl",
  },
  {
    id: "welcome-home",
    order: 7,
    title: "Welcome Home",
    teaches: "Being a good guest and a good host",
    motif: "mat-stripe",
  },
  {
    id: "community-town",
    order: 8,
    title: "Community Town",
    teaches: "Sharing places we all use",
    motif: "crosswalk-stripe",
  },
  {
    id: "sunny-table-cafe",
    order: 9,
    title: "Sunny Table Café",
    teaches: "Sitting down to eat together",
    motif: "sun-ray",
  },
  {
    id: "pixel-plaza",
    order: 10,
    title: "Pixel Plaza",
    teaches: "Being kind on screens",
    motif: "pixel",
  },
  {
    id: "brave-basecamp",
    order: 11,
    title: "Brave Basecamp",
    teaches: "Saying no and getting help",
    motif: "compass-diamond",
  },
  {
    id: "world-garden",
    order: 12,
    title: "World Garden",
    teaches: "Many customs, one shared garden",
    motif: "mixed-petals",
  },
];
