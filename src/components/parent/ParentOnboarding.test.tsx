import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import {
  completeOnboarding,
  createProfile,
  readFamilyState,
} from "@/features/profiles/profileStorage";
import { ParentArea } from "./ParentArea";

/**
 * The parent's first run.
 *
 * Rendered through `ParentArea`, because "does a parent see onboarding or the
 * dashboard?" is the behaviour under test as much as the steps themselves.
 */

beforeEach(() => {
  window.localStorage.clear();
});

async function toStep(
  user: ReturnType<typeof userEvent.setup>,
  step: "how-it-works" | "first-profile",
) {
  await user.click(await screen.findByRole("button", { name: "Get started" }));
  if (step === "how-it-works") return;
  await user.click(
    screen.getByRole("button", { name: "Add your first child" }),
  );
}

describe("who sees onboarding", () => {
  it("welcomes a parent arriving for the first time", async () => {
    render(<ParentArea />);

    expect(
      await screen.findByRole("heading", { name: "Welcome to Kindlyo" }),
    ).toBeInTheDocument();
  });

  it("does not show it again once it is done", async () => {
    completeOnboarding(window.localStorage);
    render(<ParentArea />);

    expect(
      await screen.findByRole("heading", { name: "For parents" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Welcome to Kindlyo" }),
    ).toBeNull();
  });

  it("does not show it again after the last profile is deleted", async () => {
    // A parent who removes their only child has not un-onboarded; being handed
    // the welcome tour again would read as having lost their account.
    completeOnboarding(window.localStorage);
    render(<ParentArea />);

    expect(
      await screen.findByRole("heading", { name: "No profiles yet" }),
    ).toBeInTheDocument();
  });
});

describe("the steps", () => {
  it("moves forward and back through three steps", async () => {
    const user = userEvent.setup();
    render(<ParentArea />);

    expect(await screen.findByText("Step 1 of 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Get started" }));
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Add your first child" }),
    );
    expect(screen.getByText("Step 3 of 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
  });

  it("states plainly what is never asked of a child", async () => {
    const user = userEvent.setup();
    render(<ParentArea />);
    await toStep(user, "how-it-works");

    for (const item of [
      "An email address",
      "A full legal name",
      "An exact birthday",
      "A password or login of their own",
      "A photograph",
    ]) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("says the storage is a local prototype before asking for anything", async () => {
    const user = userEvent.setup();
    render(<ParentArea />);
    await toStep(user, "how-it-works");

    expect(
      screen.getByText(/Prototype — stored on this device only/),
    ).toBeInTheDocument();
  });
});

describe("the first profile", () => {
  it("creates it and lands on the dashboard", async () => {
    const user = userEvent.setup();
    render(<ParentArea />);
    await toStep(user, "first-profile");

    await user.type(screen.getByLabelText("Nickname"), "Ada");
    await user.click(screen.getByRole("radio", { name: "Ages 7–9" }));
    await user.click(screen.getByRole("button", { name: "Create profile" }));

    expect(
      screen.getByRole("heading", { name: "For parents" }),
    ).toBeInTheDocument();
    const stored = readFamilyState(window.localStorage);
    expect(stored.profiles[0]?.nickname).toBe("Ada");
    expect(stored.profiles[0]?.ageBand).toBe("7–9");
    expect(stored.onboardedAt).not.toBeNull();
  });

  it("asks for a nickname rather than saving an empty one", async () => {
    const user = userEvent.setup();
    render(<ParentArea />);
    await toStep(user, "first-profile");

    await user.click(screen.getByRole("button", { name: "Create profile" }));

    expect(screen.getByText("Please enter a nickname.")).toBeInTheDocument();
    expect(readFamilyState(window.localStorage).profiles).toHaveLength(0);
    expect(readFamilyState(window.localStorage).onboardedAt).toBeNull();
  });

  it("collects a nickname, an age band, and a picture — and nothing else", async () => {
    const user = userEvent.setup();
    render(<ParentArea />);
    await toStep(user, "first-profile");

    const fields = screen.getAllByRole("textbox");
    expect(fields).toHaveLength(1);
    expect(fields[0]).toHaveAccessibleName("Nickname");
    expect(screen.queryByLabelText(/surname|birth|email|password/i)).toBeNull();
  });
});

describe("skipping", () => {
  it("lets a parent go straight to the dashboard", async () => {
    const user = userEvent.setup();
    render(<ParentArea />);

    await user.click(
      await screen.findByRole("button", { name: "Skip for now" }),
    );

    expect(
      screen.getByRole("heading", { name: "For parents" }),
    ).toBeInTheDocument();
    expect(readFamilyState(window.localStorage).onboardedAt).not.toBeNull();
  });

  it("keeps any profiles that already existed", async () => {
    createProfile({ nickname: "Ada", ageBand: "5–6" }, window.localStorage);
    const user = userEvent.setup();
    render(<ParentArea />);

    await user.click(
      await screen.findByRole("button", { name: "Skip for now" }),
    );

    expect(screen.getByRole("heading", { name: "Ada" })).toBeInTheDocument();
  });
});
