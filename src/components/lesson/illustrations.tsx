import type { ComponentType } from "react";

/**
 * Scene illustrations, drawn from local shapes.
 *
 * No remote images anywhere: these are inline SVG built from circles and
 * rounded rectangles, using palette tokens. That keeps the lesson free of a
 * network dependency, keeps `next build` self-contained, and means nothing
 * about a child's session is requested from a third-party host
 * (docs/PRIVACY_AND_SAFETY.md).
 *
 * They are placeholders for commissioned artwork, and they are decorative:
 * every illustration is `aria-hidden`, because the scene narration carries the
 * whole situation. Nothing in a lesson may be understandable only through the
 * picture.
 *
 * Unknown keys fall back to a neutral shape rather than throwing. A missing
 * drawing should never take the lesson down with it.
 */

type IllustrationProps = { className?: string };

const svgProps = {
  viewBox: "0 0 320 180",
  role: "presentation",
  "aria-hidden": true,
  focusable: false,
} as const;

/** A long table with brushes laid out, seen from the doorway. */
function ArtTableMorning({ className }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect width="320" height="180" rx="20" fill="var(--color-tint-honey)" />
      {/* Window light */}
      <rect
        x="26"
        y="24"
        width="72"
        height="56"
        rx="10"
        fill="var(--color-surface)"
        opacity="0.85"
      />
      {/* Table */}
      <rect
        x="34"
        y="104"
        width="252"
        height="20"
        rx="10"
        fill="var(--color-brand-accent)"
      />
      <rect
        x="58"
        y="124"
        width="12"
        height="34"
        rx="6"
        fill="var(--color-brand-accent)"
      />
      <rect
        x="250"
        y="124"
        width="12"
        height="34"
        rx="6"
        fill="var(--color-brand-accent)"
      />
      {/* A row of brushes */}
      {[0, 1, 2, 3, 4].map((index) => (
        <g key={index} transform={`translate(${120 + index * 26} 84)`}>
          <rect
            width="8"
            height="20"
            rx="4"
            fill="var(--color-brand-secondary)"
          />
          <circle cx="4" cy="-2" r="5" fill="var(--color-brand-primary)" />
        </g>
      ))}
      {/* A child at the far end of the table */}
      <circle cx="74" cy="80" r="18" fill="var(--color-brand-secondary)" />
      <rect
        x="52"
        y="100"
        width="44"
        height="24"
        rx="12"
        fill="var(--color-brand-secondary)"
      />
      {/* Paint pots */}
      <circle cx="272" cy="94" r="10" fill="var(--color-brand-primary)" />
      <circle cx="294" cy="98" r="7" fill="var(--color-success)" />
    </svg>
  );
}

/** Two children a little apart, one with a raised hand. */
function TwoChildrenMeeting({ className }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect width="320" height="180" rx="20" fill="var(--color-tint-sage)" />
      {/* Left child */}
      <circle cx="106" cy="66" r="24" fill="var(--color-brand-primary)" />
      <rect
        x="76"
        y="96"
        width="60"
        height="56"
        rx="24"
        fill="var(--color-brand-primary)"
      />
      {/* Raised hand */}
      <rect
        x="136"
        y="70"
        width="14"
        height="34"
        rx="7"
        fill="var(--color-brand-primary)"
        transform="rotate(24 143 87)"
      />
      <circle cx="154" cy="66" r="9" fill="var(--color-brand-primary)" />
      {/* Right child */}
      <circle cx="216" cy="70" r="24" fill="var(--color-brand-secondary)" />
      <rect
        x="186"
        y="100"
        width="60"
        height="52"
        rx="24"
        fill="var(--color-brand-secondary)"
      />
      {/* The space between them */}
      <circle cx="160" cy="140" r="4" fill="var(--color-surface)" />
      <circle cx="172" cy="140" r="4" fill="var(--color-surface)" />
      <circle cx="184" cy="140" r="4" fill="var(--color-surface)" />
    </svg>
  );
}

/** Two children side by side, mid-conversation. */
function TwoChildrenTalking({ className }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect width="320" height="180" rx="20" fill="var(--color-tint-clay)" />
      {/* Left child, leaning in */}
      <circle cx="118" cy="72" r="24" fill="var(--color-brand-secondary)" />
      <rect
        x="88"
        y="102"
        width="60"
        height="52"
        rx="24"
        fill="var(--color-brand-secondary)"
      />
      {/* Right child */}
      <circle cx="202" cy="72" r="24" fill="var(--color-brand-accent)" />
      <rect
        x="172"
        y="102"
        width="60"
        height="52"
        rx="24"
        fill="var(--color-brand-accent)"
      />
      {/* Speech bubbles, one each */}
      <rect
        x="70"
        y="26"
        width="56"
        height="26"
        rx="13"
        fill="var(--color-surface)"
      />
      <rect
        x="196"
        y="30"
        width="44"
        height="22"
        rx="11"
        fill="var(--color-surface)"
      />
    </svg>
  );
}

/** A small group at work, with space at the edge for one more. */
function GroupOfChildren({ className }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect width="320" height="180" rx="20" fill="var(--color-tint-sage)" />
      {/* The group, gathered around something */}
      <circle cx="120" cy="66" r="20" fill="var(--color-brand-primary)" />
      <circle cx="168" cy="58" r="20" fill="var(--color-brand-secondary)" />
      <circle cx="214" cy="68" r="20" fill="var(--color-brand-accent)" />
      <rect
        x="96"
        y="88"
        width="144"
        height="52"
        rx="24"
        fill="var(--color-surface)"
        opacity="0.9"
      />
      {/* The thing they are making */}
      <rect
        x="132"
        y="104"
        width="72"
        height="20"
        rx="10"
        fill="var(--color-brand-accent)"
      />
      {/* One child at the edge, not yet part of it */}
      <circle cx="52" cy="112" r="16" fill="var(--color-brand-secondary)" />
      <rect
        x="34"
        y="130"
        width="36"
        height="28"
        rx="14"
        fill="var(--color-brand-secondary)"
      />
    </svg>
  );
}

/** One child heading off, hand raised back toward another. */
function WavingGoodbye({ className }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect width="320" height="180" rx="20" fill="var(--color-tint-honey)" />
      {/* A doorway */}
      <rect
        x="236"
        y="36"
        width="56"
        height="120"
        rx="10"
        fill="var(--color-surface)"
        opacity="0.85"
      />
      {/* Staying child */}
      <circle cx="96" cy="78" r="22" fill="var(--color-brand-secondary)" />
      <rect
        x="68"
        y="106"
        width="56"
        height="48"
        rx="22"
        fill="var(--color-brand-secondary)"
      />
      {/* Leaving child, turned toward the door, waving back */}
      <circle cx="204" cy="82" r="22" fill="var(--color-brand-primary)" />
      <rect
        x="178"
        y="110"
        width="52"
        height="44"
        rx="20"
        fill="var(--color-brand-primary)"
      />
      <rect
        x="162"
        y="66"
        width="12"
        height="30"
        rx="6"
        fill="var(--color-brand-primary)"
        transform="rotate(-28 168 81)"
      />
    </svg>
  );
}

/** Neutral placeholder for a key with no drawing yet. */
function PlaceholderScene({ className }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect width="320" height="180" rx="20" fill="var(--color-tint-sand)" />
      <circle cx="128" cy="86" r="26" fill="var(--color-brand-secondary)" />
      <circle cx="192" cy="86" r="26" fill="var(--color-brand-primary)" />
      <rect
        x="96"
        y="126"
        width="128"
        height="14"
        rx="7"
        fill="var(--color-surface)"
      />
    </svg>
  );
}

const illustrations: Record<string, ComponentType<IllustrationProps>> = {
  "art-table-morning": ArtTableMorning,
  "two-children-meeting": TwoChildrenMeeting,
  "two-children-talking": TwoChildrenTalking,
  "group-of-children": GroupOfChildren,
  "waving-goodbye": WavingGoodbye,
};

export const illustrationKeys = Object.keys(illustrations);

export function hasIllustration(key: string): boolean {
  return key in illustrations;
}

export type SceneIllustrationProps = {
  illustrationKey: string;
  className?: string;
};

export function SceneIllustration({
  illustrationKey,
  className,
}: SceneIllustrationProps) {
  const Drawing = illustrations[illustrationKey] ?? PlaceholderScene;
  return <Drawing className={className} />;
}
