import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { meetingPeopleModule } from "@/content/modules";
import { recordCompletion } from "@/features/lessons/progressStorage";
import {
  createProfile,
  selectProfile,
} from "@/features/profiles/profileStorage";
import { NeighborhoodMap } from "./NeighborhoodMap";

// Same offline wiring as the learning path: the family client resolves to the
// local-storage prototype stores, and specs seed through the real helpers.
vi.mock("@/features/families/familyClient", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/families/familyClient")>();
  return {
    ...actual,
    getFamilyClient: () =>
      actual.createLocalFamilyClient(() => window.localStorage),
  };
});

function seedProfile(nickname: string): string {
  const result = createProfile(
    { nickname, ageBand: "5–6" },
    window.localStorage,
  );
  if (!result.ok) throw new Error("could not seed a profile");
  return result.profile.id;
}

function finishHelloGarden(profileId: string): void {
  for (const entry of meetingPeopleModule.lessons) {
    if (entry.slug !== undefined) {
      recordCompletion(
        profileId,
        entry.slug,
        1,
        "2026-08-04T10:00:00.000Z",
        window.localStorage,
      );
    }
  }
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("NeighborhoodMap", () => {
  it("shows all twelve worlds of the neighborhood", async () => {
    render(<NeighborhoodMap />);

    await screen.findByRole("heading", { name: "Neighborhood map" });
    expect(screen.getAllByRole("listitem")).toHaveLength(12);
    expect(screen.getByText("Hello Garden")).toBeInTheDocument();
    expect(screen.getByText("World Garden")).toBeInTheDocument();
  });

  it("starts a fresh journey with Hello Garden current and the next world up next", async () => {
    render(<NeighborhoodMap />);
    await screen.findByRole("heading", { name: "Neighborhood map" });

    // Hello Garden is the current world, linking into the learning path...
    const hello = screen.getByRole("link", { name: /Hello Garden/ });
    expect(hello).toHaveAttribute("href", "/learn");

    // ...and the world after it is reachable too: the neighborhood opens a
    // little at a time — the current world plus the one up next — with every
    // world beyond held "a little later".
    const echo = screen.getByRole("link", { name: /Echo Treehouse/ });
    expect(echo).toHaveAttribute("href", "/learn/module/echo-treehouse");
    expect(within(echo).getByText("Up next")).toBeInTheDocument();

    // Only those two are links; every world beyond is information, not a button.
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getAllByText("A little later").length).toBeGreaterThan(0);
  });

  it("never renders a world as locked or failed", async () => {
    render(<NeighborhoodMap />);
    await screen.findByRole("heading", { name: "Neighborhood map" });

    expect(screen.queryByText(/locked/i)).toBeNull();
    expect(screen.queryByText(/failed/i)).toBeNull();
  });

  it("marks Hello Garden done once every lesson is finished", async () => {
    const ada = seedProfile("Ada");
    selectProfile(ada, window.localStorage);
    finishHelloGarden(ada);

    render(<NeighborhoodMap />);
    await screen.findByRole("heading", { name: "Neighborhood map" });

    const hello = await screen.findByRole("link", { name: /Hello Garden/ });
    expect(within(hello).getByText("Done")).toBeInTheDocument();
  });
});
