import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  readProfileProgress,
  recordCompletion,
} from "@/features/lessons/progressStorage";
import { createProfile } from "@/features/profiles/profileStorage";
import { MissionsSection } from "./MissionsSection";

// Offline the family client resolves to the prototype store over this browser's
// local storage, so seed and assert through it and mock only the client between.
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

function finishLesson(profileId: string, lessonId: string) {
  recordCompletion(
    profileId,
    lessonId,
    1,
    "2026-08-04T10:00:00.000Z",
    window.localStorage,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("MissionsSection", () => {
  it("prompts to add a child when there are no profiles", async () => {
    render(<MissionsSection />);
    expect(
      await screen.findByRole("heading", { name: "No profiles yet" }),
    ).toBeInTheDocument();
  });

  it("stays calm before any lesson is started", async () => {
    seedProfile("Ada");
    render(<MissionsSection />);
    expect(
      await screen.findByRole("heading", {
        name: "Ada has not started a lesson yet",
      }),
    ).toBeInTheDocument();
  });

  it("shows the current mission once a lesson is finished", async () => {
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    render(<MissionsSection />);
    expect(
      await screen.findByRole("heading", { name: "Saying hello" }),
    ).toBeInTheDocument();
  });

  it("marks the mission practised and back again", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    render(<MissionsSection />);

    await user.click(
      await screen.findByRole("button", { name: /Mark as done/ }),
    );
    expect(
      readProfileProgress(ada, window.localStorage)["saying-hello"]
        ?.missionStatus,
    ).toBe("done");
    expect(await screen.findByText("Done")).toBeInTheDocument();

    await user.click(
      await screen.findByRole("button", { name: /Mark as not done yet/ }),
    );
    expect(
      readProfileProgress(ada, window.localStorage)["saying-hello"]
        ?.missionStatus,
    ).toBeUndefined();
  });
});
