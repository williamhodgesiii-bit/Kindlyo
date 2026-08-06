"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { MotifShape } from "./motifs";

/**
 * The lesson celebration (docs/design/COMPONENT_STATES.md §12; MOTION.md
 * "Lesson completion").
 *
 * A single, gentle emission of the module motif — a calm payoff, deliberately
 * not a slot machine. It stays inside the design's hard limits: at most eight
 * particles drawn from the module motif, one emission, no loop, ≤ 600ms of
 * motion, then still; it never gates the next action. This is the sanctioned
 * celebration, distinct from the prohibited confetti rain and looping bursts
 * (DESIGN.md §9). The child can replay it by tapping "Play again"; it is never
 * auto-repeated.
 *
 * The meaning of finishing lives in the completion heading and the progress
 * change beside this — the burst is decorative and `aria-hidden`. Under reduced
 * motion the particles and the replay control drop out entirely, leaving the
 * static badge as the payoff (MOTION.md reduced-motion rules).
 */

export type CelebrationBurstProps = {
  /** The module motif shape. Defaults to Hello Garden's petal. */
  motif?: string;
  /** Sets `data-module` for standalone use; omit to inherit the ancestor theme. */
  moduleId?: string;
  className?: string;
};

const PARTICLE_COUNT = 8;

/** Eight motif particles fanned evenly outward, on a small +40ms stagger. */
const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
  const distance = index % 2 === 0 ? 52 : 40;
  return {
    index,
    x: `${Math.round(Math.cos(angle) * distance)}px`,
    y: `${Math.round(Math.sin(angle) * distance)}px`,
    rotate: `${Math.round((angle * 180) / Math.PI) + 30}deg`,
    soft: index % 2 === 0,
  };
});

export function CelebrationBurst({
  motif = "petal",
  moduleId,
  className,
}: CelebrationBurstProps) {
  // Bumping the key re-mounts the particle layer so the one-shot animation
  // replays; it never repeats on its own.
  const [burst, setBurst] = useState(0);

  return (
    <div
      data-module={moduleId}
      className={cn("flex flex-col items-center gap-3", className)}
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Static badge — the celebration ring + motif. Always present, so it is
            the whole payoff under reduced motion. Pops once, then rests. */}
        <div
          aria-hidden="true"
          className="llc-celebrate flex h-20 w-20 items-center justify-center rounded-round border-2 border-module-accent bg-module-tint text-module-accent-strong"
        >
          <MotifShape motif={motif} size={34} />
        </div>

        {/* Particle layer — one emission, removed under reduced motion. */}
        <div
          key={burst}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 motion-reduce:hidden"
        >
          {particles.map((particle) => (
            <span
              key={particle.index}
              className="absolute left-1/2 top-1/2 -ml-2 -mt-2"
            >
              <MotifShape
                motif={motif}
                size={16}
                className={cn(
                  "llc-petal",
                  particle.soft
                    ? "text-module-accent-soft"
                    : "text-module-accent",
                )}
                style={
                  {
                    "--llc-petal-x": particle.x,
                    "--llc-petal-y": particle.y,
                    "--llc-petal-r": particle.rotate,
                    "--llc-enter-index": particle.index,
                  } as React.CSSProperties
                }
              />
            </span>
          ))}
        </div>
      </div>

      {/* Replay — only meaningful when there is motion to replay, so it is
          hidden under reduced motion. Decorative action; never gates anything. */}
      <button
        type="button"
        onClick={() => setBurst((value) => value + 1)}
        // A clear stand-alone name: it is read before the completion heading,
        // and it should be obvious it replays the animation, not the lesson.
        aria-label="Play the celebration again"
        className="rounded-md px-3 py-1 text-sm font-semibold text-module-accent-strong hover:bg-module-tint motion-reduce:hidden"
      >
        Play again
      </button>
    </div>
  );
}
