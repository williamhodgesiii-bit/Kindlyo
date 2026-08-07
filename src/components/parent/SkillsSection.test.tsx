import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { recordCompletion } from "@/features/lessons/progressStorage";
import { createProfile } from "@/features/profiles/profileStorage";
import { SkillsSection } from "./SkillsSection";

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

describe("SkillsSection", () => {
  it("prompts to add a child when there are no profiles", async () => {
    render(<SkillsSection />);
    expect(
      await screen.findByRole("heading", { name: "No profiles yet" }),
    ).toBeInTheDocument();
  });

  it("stays calm before any lesson is started", async () => {
    seedProfile("Ada");
    render(<SkillsSection />);
    expect(
      await screen.findByRole("heading", {
        name: "Ada has not started a lesson yet",
      }),
    ).toBeInTheDocument();
  });

  it("shows skill areas and offers finished lessons for review", async () => {
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    render(<SkillsSection />);

    expect(
      await screen.findByRole("heading", { name: "Skill areas" }),
    ).toBeInTheDocument();

    // The finished lesson is offered for revisiting — never re-locked.
    const review = screen.getByRole("region", { name: "Ready to review" });
    expect(within(review).getByText("Saying hello")).toBeInTheDocument();
    expect(within(review).getByText("Practised")).toBeInTheDocument();
  });
});
