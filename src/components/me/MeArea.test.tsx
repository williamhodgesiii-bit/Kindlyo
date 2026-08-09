import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { recordCompletion } from "@/features/lessons/progressStorage";
import {
  createProfile,
  selectProfile,
} from "@/features/profiles/profileStorage";
import { MeArea } from "./MeArea";

// Offline, the async family client resolves to the prototype stores backed by
// this browser's local storage, so these specs seed and assert through
// `window.localStorage` and mock only the client in between — the same harness
// the learning-path specs use.
vi.mock("@/features/families/familyClient", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/families/familyClient")>();
  return {
    ...actual,
    getFamilyClient: () =>
      actual.createLocalFamilyClient(() => window.localStorage),
  };
});

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

function seedProfile(nickname: string): string {
  const result = createProfile(
    { nickname, ageBand: "5–6" },
    window.localStorage,
  );
  if (!result.ok) throw new Error("could not seed a profile");
  return result.profile.id;
}

/** Complete lesson one ("Saying hello") for a child. */
function completeSayingHello(profileId: string): void {
  recordCompletion(
    profileId,
    "saying-hello",
    1,
    "2026-08-04T10:00:00.000Z",
    window.localStorage,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("before a profile exists", () => {
  it("sends the grown-up to the parent area", async () => {
    render(<MeArea />);

    expect(
      await screen.findByRole("heading", {
        name: "First, a grown-up sets up a profile",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to the parent area" }),
    ).toHaveAttribute("href", "/parent");
  });
});

describe("with a profile but none selected", () => {
  it("invites the child to pick who is learning", async () => {
    seedProfile("Ada");
    render(<MeArea />);

    expect(
      await screen.findByRole("heading", {
        name: "First, pick who is learning",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Choose your name" }),
    ).toHaveAttribute("href", "/learn");
  });
});

describe("a chosen child who has done nothing yet", () => {
  beforeEach(() => {
    const ada = seedProfile("Ada");
    selectProfile(ada, window.localStorage);
  });

  it("shows a warm invitation, not an empty tally", async () => {
    render(<MeArea />);

    expect(
      await screen.findByRole("heading", {
        name: "Your garden is ready to grow",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to your lessons" }),
    ).toHaveAttribute("href", "/learn");
  });

  it("shows no score, streak, count, or percentage", async () => {
    render(<MeArea />);
    await screen.findByText("Hi, Ada!");

    expect(
      screen.queryByText(
        /streak|points|score|rank|behind|\bof\b|%|\d+\s*\/\s*\d+/i,
      ),
    ).not.toBeInTheDocument();
  });
});

describe("a child who has practised a lesson", () => {
  let ada: string;

  beforeEach(() => {
    ada = seedProfile("Ada");
    selectProfile(ada, window.localStorage);
    completeSayingHello(ada);
  });

  it("greets the child by name with a single page heading", async () => {
    render(<MeArea />);
    await screen.findByText("Hi, Ada!");

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Hi, Ada!");
  });

  it("offers a garden flower that replays the practised lesson", async () => {
    render(<MeArea />);
    await screen.findByText("Hi, Ada!");

    const replay = screen.getByRole("link", {
      name: "Play Saying hello again",
    });
    expect(replay).toHaveAttribute("href", "/learn/lesson/saying-hello");
  });

  it("points 'keep going' at the next lesson", async () => {
    render(<MeArea />);
    await screen.findByText("Hi, Ada!");

    const next = screen.getByRole("link", {
      name: /^Start: Introducing yourself$/,
    });
    expect(next).toHaveAttribute("href", "/learn/lesson/introducing-yourself");
  });

  it("shows the child-facing mission prompt, never the grown-up one", async () => {
    render(<MeArea />);
    await screen.findByText("Hi, Ada!");

    const lesson = getLessonBySlug("saying-hello");
    if (lesson === undefined) throw new Error("fixture lesson missing");

    const mission = screen
      .getByRole("heading", { name: "Your mission" })
      .closest("section");
    expect(mission).not.toBeNull();
    expect(
      within(mission as HTMLElement).getByText(
        lesson.offlineMission.childPrompt,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(lesson.offlineMission.parentPrompt),
    ).not.toBeInTheDocument();
  });

  it("never lets a child mark a mission done from here", async () => {
    render(<MeArea />);
    await screen.findByText("Hi, Ada!");

    expect(
      screen.queryByRole("button", { name: /done|complete|finish/i }),
    ).not.toBeInTheDocument();
  });
});

describe("profile separation on a shared device", () => {
  it("shows no garden at all until a child is chosen", async () => {
    const ada = seedProfile("Ada");
    completeSayingHello(ada);
    // A profile exists and has practised a lesson, but nobody is selected.
    render(<MeArea />);

    // The picker prompt, never Ada's flowers, before a choice is made.
    expect(
      await screen.findByRole("heading", {
        name: "First, pick who is learning",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Play Saying hello again" }),
    ).not.toBeInTheDocument();
  });

  it("shows the selected child's own empty garden, not a sibling's flowers", async () => {
    const ada = seedProfile("Ada");
    const ben = seedProfile("Ben");
    completeSayingHello(ada);
    selectProfile(ben, window.localStorage);

    render(<MeArea />);
    await screen.findByText("Hi, Ben!");

    expect(
      screen.getByRole("heading", { name: "Your garden is ready to grow" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Play Saying hello again" }),
    ).not.toBeInTheDocument();
  });
});
