import type { ComponentType } from "react";
import type { AvatarId } from "@/features/profiles/types";

/**
 * The avatar drawings.
 *
 * Local inline SVG built from a handful of shapes, exactly like the scene
 * illustrations, and for the same three reasons: no network request from a
 * child's session, no third-party host, and nothing that could ever become a
 * photograph. There is no `img` element and no `src` anywhere in this file,
 * and there must not be (docs/PRIVACY_AND_SAFETY.md).
 *
 * Each drawing fills its box and inherits nothing: colour is set here so an
 * avatar reads the same on every surface it appears on.
 */

type ArtProps = { className?: string };

const svgProps = {
  viewBox: "0 0 48 48",
  role: "presentation",
  "aria-hidden": true,
  focusable: false,
} as const;

function Fox({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <path
        d="M10 16 L14 6 L22 12 Z M38 16 L34 6 L26 12 Z"
        fill="var(--color-brand-primary-strong)"
      />
      <circle cx="24" cy="26" r="14" fill="var(--color-brand-primary)" />
      <circle cx="19" cy="24" r="2.5" fill="var(--color-surface)" />
      <circle cx="29" cy="24" r="2.5" fill="var(--color-surface)" />
      <circle cx="24" cy="32" r="3" fill="var(--color-brand-primary-strong)" />
    </svg>
  );
}

function Star({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <path
        d="M24 6 L29 19 L43 20 L32 29 L36 42 L24 34 L12 42 L16 29 L5 20 L19 19 Z"
        fill="var(--color-brand-accent)"
      />
      <circle cx="24" cy="25" r="4" fill="var(--color-surface)" opacity="0.7" />
    </svg>
  );
}

function Leaf({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <path
        d="M24 6 C38 12 40 30 24 42 C8 30 10 12 24 6 Z"
        fill="var(--color-brand-secondary)"
      />
      <path
        d="M24 12 L24 38"
        stroke="var(--color-surface)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Moon({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle
        cx="24"
        cy="24"
        r="17"
        fill="var(--color-brand-secondary-strong)"
      />
      <circle cx="30" cy="20" r="14" fill="var(--color-tint-honey)" />
      <circle cx="14" cy="14" r="2" fill="var(--color-surface)" />
      <circle cx="12" cy="34" r="1.5" fill="var(--color-surface)" />
    </svg>
  );
}

function Boat({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M24 6 L24 26 L38 26 Z" fill="var(--color-brand-primary)" />
      <path d="M22 12 L22 26 L11 26 Z" fill="var(--color-brand-accent)" />
      <path
        d="M6 30 L42 30 L36 40 L12 40 Z"
        fill="var(--color-brand-secondary-strong)"
      />
    </svg>
  );
}

function Bird({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="26" cy="24" r="13" fill="var(--color-brand-secondary)" />
      <circle cx="16" cy="16" r="7" fill="var(--color-brand-secondary)" />
      <circle cx="14" cy="15" r="2" fill="var(--color-surface)" />
      <path d="M7 16 L13 18 L7 20 Z" fill="var(--color-brand-accent)" />
      <path
        d="M28 22 C36 20 40 28 34 32 C30 34 27 29 28 22 Z"
        fill="var(--color-brand-secondary-strong)"
      />
    </svg>
  );
}

export const avatarArt = {
  fox: Fox,
  star: Star,
  leaf: Leaf,
  moon: Moon,
  boat: Boat,
  bird: Bird,
} satisfies Record<AvatarId, ComponentType<ArtProps>>;
