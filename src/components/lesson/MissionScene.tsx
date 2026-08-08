import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * A small decorative scene for the offline-mission step: an open doorway onto
 * a calm outdoors — "away from the screen, out into the world".
 *
 * Built from the same scenery kit and theme tokens as {@link SceneStage}
 * (docs/design/COMPONENT_STATES.md §06/§08; MODULE_WORLDS.md §2): a
 * `module.tint` wash, a `module.tint-deep` far hill, an arched doorway landmark
 * in the module accent with a 2px ink outline, and a `paper` ground band. It
 * inherits the nearest `[data-module]` ancestor's theme (the lesson shell sets
 * it), so each world's mission looks like part of that world without this file
 * knowing which world it is.
 *
 * Deliberately empty of people. The mission has not happened yet, so the
 * picture shows the invitation — a threshold to step through — and never a
 * child performing a greeting. It depicts no specific social act (no handshake,
 * no wave, no eye contact), so it can't silently prescribe one way to do the
 * thing the authored prompt leaves open (docs/CURRICULUM_PRINCIPLES.md).
 *
 * Decorative by contract: the whole scene is `aria-hidden`, inline, and local
 * (no remote asset, no network request). Every bit of meaning lives in the
 * text beside it; the picture can be removed with no loss (WCAG 1.1.1;
 * docs/PRIVACY_AND_SAFETY.md). It is static — the one gentle entrance belongs
 * to the step section around it, so there is nothing here to reduce under
 * `prefers-reduced-motion`.
 */

const INK = "var(--llc-color-ink)";

export function MissionScene({ className }: { className?: string }) {
  // Unique so two scenes on one page cannot share a clip path.
  const clipId = useId();

  return (
    <svg
      viewBox="0 0 320 120"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={cn("block h-auto w-full", className)}
    >
      <clipPath id={clipId}>
        <rect x="0" y="0" width="320" height="120" rx="20" />
      </clipPath>

      <g clipPath={`url(#${clipId})`}>
        {/* 1 · Wash — the near side of the threshold */}
        <rect x="0" y="0" width="320" height="120" fill="var(--module-tint)" />

        {/* 2 · The view through the doorway — a bright outside */}
        <rect
          x="122"
          y="20"
          width="76"
          height="70"
          rx="6"
          fill="var(--llc-color-surface)"
        />
        {/* Far hill and sun, kept within the doorway opening (x 122–198) */}
        <ellipse
          cx="160"
          cy="90"
          rx="34"
          ry="14"
          fill="var(--module-tint-deep)"
        />
        <circle cx="182" cy="40" r="9" fill="var(--module-accent-soft)" />
        {/* A small tree out in the world */}
        <rect
          x="141"
          y="58"
          width="5"
          height="18"
          rx="2"
          fill="var(--module-accent)"
        />
        <circle
          cx="143"
          cy="54"
          r="11"
          fill="var(--module-accent-soft)"
          stroke={INK}
          strokeWidth="2"
        />

        {/* 3 · Doorway landmark — posts + arched lintel (accent, 2px ink) */}
        <path
          d="M116 40 Q160 6 204 40 L204 30 Q160 -2 116 30 Z"
          fill="var(--module-accent)"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect
          x="112"
          y="34"
          width="10"
          height="56"
          rx="3"
          fill="var(--module-accent)"
          stroke={INK}
          strokeWidth="2"
        />
        <rect
          x="198"
          y="34"
          width="10"
          height="56"
          rx="3"
          fill="var(--module-accent)"
          stroke={INK}
          strokeWidth="2"
        />

        {/* 4 · Ground band — paper tone with a 2px ink top rule */}
        <rect
          x="0"
          y="90"
          width="320"
          height="30"
          fill="var(--llc-color-paper)"
        />
        <line x1="0" y1="90" x2="320" y2="90" stroke={INK} strokeWidth="2" />

        {/* 5 · Bloom bushes flanking the threshold, as on the scene stage */}
        <circle
          cx="86"
          cy="86"
          r="14"
          fill="var(--module-accent-soft)"
          stroke={INK}
          strokeWidth="2"
        />
        <circle
          cx="234"
          cy="86"
          r="14"
          fill="var(--module-accent-soft)"
          stroke={INK}
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
