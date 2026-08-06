import { describe, expect, it } from "vitest";
import type { NeighborhoodWorld } from "@/content/worlds";
import { buildNeighborhood, type WorldSummary } from "./neighborhood";

function world(order: number, id: string): NeighborhoodWorld {
  return { id, order, title: id, teaches: "", motif: "petal" };
}

const none: WorldSummary = { hasContent: false, completed: 0, total: 0 };
const started: WorldSummary = { hasContent: true, completed: 0, total: 8 };
const partway: WorldSummary = { hasContent: true, completed: 3, total: 8 };
const done: WorldSummary = { hasContent: true, completed: 8, total: 8 };

function statesOf(
  worlds: readonly NeighborhoodWorld[],
  summaries: Record<string, WorldSummary>,
) {
  return buildNeighborhood(worlds, (w) => summaries[w.id] ?? none).map(
    (n) => n.state,
  );
}

describe("buildNeighborhood", () => {
  it("puts a fresh profile in the first content world, the rest a little later", () => {
    // The MVP shape: only Hello Garden authored, and unstarted.
    const worlds = [world(1, "a"), world(2, "b"), world(3, "c")];
    expect(statesOf(worlds, { a: started })).toEqual([
      "current",
      "later",
      "later",
    ]);
  });

  it("marks a finished world complete and leaves nothing current when no content remains", () => {
    const worlds = [world(1, "a"), world(2, "b")];
    expect(statesOf(worlds, { a: done })).toEqual(["complete", "later"]);
  });

  it("advances current to the next content world once the first is complete", () => {
    const worlds = [world(1, "a"), world(2, "b"), world(3, "c")];
    expect(statesOf(worlds, { a: done, b: partway, c: started })).toEqual([
      "complete",
      "current",
      "next",
    ]);
  });

  it("does not let an unbuilt world block a later content world", () => {
    // b has no content; c does. c must still become reachable.
    const worlds = [world(1, "a"), world(2, "b"), world(3, "c")];
    expect(statesOf(worlds, { a: done, b: none, c: started })).toEqual([
      "complete",
      "later",
      "current",
    ]);
  });

  it("carries the completed/total counts through", () => {
    const worlds = [world(1, "a")];
    const [node] = buildNeighborhood(worlds, () => partway);
    expect(node).toMatchObject({ completed: 3, total: 8, state: "current" });
  });
});
