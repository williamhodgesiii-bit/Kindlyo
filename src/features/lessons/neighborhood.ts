import type { NeighborhoodWorld } from "@/content/worlds";

/**
 * Derives one child's view of the neighborhood map: which world they are in,
 * which is up next, and which are still a little way off.
 *
 * Pure, like buildModulePath, so the journey rules live in one tested place
 * (docs/ARCHITECTURE.md, "Boundaries"). The map is never punitive: a world that
 * is out of reach reads as "a little later", never as locked or failed
 * (docs/design/COMPONENT_STATES.md §03).
 *
 * The rules:
 *
 * - A world with no authored content is always "later" ("a little later"). It
 *   does not block the worlds after it — an authoring backlog never locks a
 *   child out, the same rule buildModulePath uses for unwritten lessons.
 * - Among the worlds that DO have content: a finished one is "complete"; the
 *   first unfinished one is "current" (the world to play now); the next content
 *   world after it is "next" ("up next"); any further ones are "later".
 * - On a fresh profile with only Hello Garden authored, that is exactly: Hello
 *   Garden "current", every other world "later".
 */

export type NeighborhoodNodeState = "current" | "next" | "later" | "complete";

/** What a world's content looks like for one child. */
export type WorldSummary = {
  /** Whether the world has any authored lessons yet. */
  hasContent: boolean;
  /** Lessons finished / total written lessons (both 0 when there is no content). */
  completed: number;
  total: number;
};

export type NeighborhoodNode = {
  world: NeighborhoodWorld;
  state: NeighborhoodNodeState;
  completed: number;
  total: number;
};

export function buildNeighborhood(
  worlds: readonly NeighborhoodWorld[],
  summaryOf: (world: NeighborhoodWorld) => WorldSummary,
): NeighborhoodNode[] {
  // "before" = still looking for the current world; "atCurrent" = current found,
  // the next content world is up next; "after" = everything beyond is "later".
  let phase: "before" | "atCurrent" | "after" = "before";

  return worlds.map((world) => {
    const summary = summaryOf(world);
    const { completed, total } = summary;

    let state: NeighborhoodNodeState;
    if (!summary.hasContent) {
      // No lessons yet: a little later, but it does not block later worlds.
      state = "later";
    } else if (total > 0 && completed >= total) {
      state = "complete";
    } else if (phase === "before") {
      state = "current";
      phase = "atCurrent";
    } else if (phase === "atCurrent") {
      state = "next";
      phase = "after";
    } else {
      state = "later";
    }

    return { world, state, completed, total };
  });
}
