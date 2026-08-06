import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CelebrationBurst } from "./CelebrationBurst";

/**
 * The celebration is warm but bounded. These specs hold the design's hard
 * limits (docs/design/MOTION.md): at most eight motif particles, one emission,
 * a static badge that is the whole payoff under reduced motion, and a replay
 * that the child asks for rather than one that loops on its own.
 */
describe("CelebrationBurst", () => {
  it("emits no more than eight motif particles", () => {
    const { container } = render(<CelebrationBurst />);
    const particles = container.querySelectorAll(".llc-petal");
    expect(particles.length).toBeLessThanOrEqual(8);
    expect(particles.length).toBeGreaterThan(0);
  });

  it("drops the particles under reduced motion, keeping a static badge", () => {
    const { container } = render(<CelebrationBurst />);
    // The particle layer is removed when the viewer prefers reduced motion; the
    // badge (a motif shape) always renders, so the payoff survives without it.
    const particleLayer = container
      .querySelector(".llc-petal")
      ?.closest(".motion-reduce\\:hidden");
    expect(particleLayer).not.toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("keeps the particles decorative, out of the accessibility tree", () => {
    const { container } = render(<CelebrationBurst />);
    const particle = container.querySelector(".llc-petal");
    expect(particle?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("replays only when the child asks, never on a loop", async () => {
    const user = userEvent.setup();
    const { container } = render(<CelebrationBurst />);

    const replay = screen.getByRole("button", {
      name: "Play the celebration again",
    });
    // The control is real and operable — not hidden from the keyboard.
    expect(replay.closest('[aria-hidden="true"]')).toBeNull();

    await user.click(replay);
    // Still one emission's worth of particles, not an accumulating loop.
    expect(container.querySelectorAll(".llc-petal").length).toBeLessThanOrEqual(
      8,
    );
  });

  it("themes to a given module world", () => {
    const { container } = render(<CelebrationBurst moduleId="pixel-plaza" />);
    expect(
      container.querySelector('[data-module="pixel-plaza"]'),
    ).not.toBeNull();
  });
});
