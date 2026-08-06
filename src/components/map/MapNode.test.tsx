import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { NeighborhoodWorld } from "@/content/worlds";
import type {
  NeighborhoodNode,
  NeighborhoodNodeState,
} from "@/features/lessons/neighborhood";
import { MapNode } from "./MapNode";

const helloGarden: NeighborhoodWorld = {
  id: "hello-garden",
  order: 1,
  title: "Hello Garden",
  teaches: "Saying hello",
  motif: "petal",
  moduleId: "meeting-people",
  pathHref: "/learn",
};

const echoTreehouse: NeighborhoodWorld = {
  id: "echo-treehouse",
  order: 2,
  title: "Echo Treehouse",
  teaches: "Listening",
  motif: "echo-ring",
};

function node(
  world: NeighborhoodWorld,
  state: NeighborhoodNodeState,
  completed = 0,
  total = 8,
): NeighborhoodNode {
  return { world, state, completed, total };
}

function renderNode(n: NeighborhoodNode) {
  return render(<ul>{<MapNode node={n} />}</ul>);
}

describe("MapNode", () => {
  it("links a current world into its path and names its state", () => {
    renderNode(node(helloGarden, "current", 0, 8));
    const link = screen.getByRole("link", { name: /Hello Garden/ });
    expect(link).toHaveAttribute("href", "/learn");
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("renders a later world as information, not a button", () => {
    renderNode(node(echoTreehouse, "later"));
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("A little later")).toBeInTheDocument();
  });

  it("shows a completed world as done and still replayable", () => {
    renderNode(node(helloGarden, "complete", 8, 8));
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Hello Garden/ }),
    ).toBeInTheDocument();
  });

  it("greets you on the current world with a single breathe", () => {
    const { container } = renderNode(node(helloGarden, "current"));
    expect(container.querySelector(".llc-breathe-once")).not.toBeNull();
  });
});
