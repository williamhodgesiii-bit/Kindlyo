import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CharacterRig } from "./CharacterRig";
import { characterIds } from "./cast";
import { characterStateNames } from "./states";

describe("CharacterRig", () => {
  it("draws every character without a missing part", () => {
    for (const id of characterIds) {
      const { container, unmount } = render(<CharacterRig character={id} />);
      expect(container.querySelector("svg")).not.toBeNull();
      unmount();
    }
  });

  it("holds every one of the 31 states", () => {
    for (const state of characterStateNames) {
      const { container, unmount } = render(
        <CharacterRig character="maya" state={state} />,
      );
      expect(container.querySelector("svg")).not.toBeNull();
      unmount();
    }
  });

  it("is decorative by default", () => {
    const { container } = render(<CharacterRig character="theo" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    // The picture carries no words a reader could miss.
    expect(container.textContent).toBe("");
  });

  it("becomes a labelled image when it is the information", () => {
    const { getByRole } = render(
      <CharacterRig character="nora" state="wave" title="Nora waves hello" />,
    );
    const img = getByRole("img", { name: "Nora waves hello" });
    expect(img).not.toHaveAttribute("aria-hidden");
  });

  it("lets an expression override the state's face", () => {
    // The pose stays; only the head swaps — this must render, not throw.
    const { container } = render(
      <CharacterRig character="jun" state="listen" expression="proud" />,
    );
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
