import type { ComponentPropsWithoutRef } from "react";

/**
 * The small set of inline icons the design system needs.
 *
 * Hand-drawn as SVG rather than adding an icon dependency for a handful of
 * glyphs. Every icon is `aria-hidden`: icons here always sit beside real text,
 * because docs/DESIGN_SYSTEM.md forbids communicating anything by shape or
 * colour alone.
 */

type IconProps = ComponentPropsWithoutRef<"svg">;

function Icon({ children, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12.5 10 18 19.5 6.5" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

/** Used for the "helpful" feedback tone. */
export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20s-7-4.5-7-9.5A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.5c0 5-7 9.5-7 9.5Z" />
    </Icon>
  );
}

/** Used for the "mixed" tone: two things can be true at once. */
export function BalanceIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4v16M5 8h14M7.5 8 5 14h5L7.5 8ZM16.5 8 14 14h5l-2.5-6Z" />
    </Icon>
  );
}

/** Used for the "needs context" tone: it depends on the situation. */
export function CompassIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-2 4.5L8.5 15l2-4.5L15 9Z" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </Icon>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4.5 21 19H3l9-14.5Z" />
      <path d="M12 10v4M12 17h.01" />
    </Icon>
  );
}

/** Fallback avatar glyph when a profile has no nickname yet. */
export function PersonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5a7 7 0 0 1 14 0" />
    </Icon>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4.5 13.7 10l5.5 1.7-5.5 1.7L12 19l-1.7-5.6-5.5-1.7 5.5-1.7L12 4.5Z" />
    </Icon>
  );
}

/** Clubhouse / home destination. */
export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 11.5 12 4.5l8.5 7" />
      <path d="M6 10.5V19h12v-8.5" />
    </Icon>
  );
}

/** Neighborhood map destination. */
export function MapIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </Icon>
  );
}

/** Progress destination: a rising line, never a score. */
export function ProgressIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4v16h16" />
      <path d="M8 14l3-3 2 2 4-5" />
    </Icon>
  );
}

/** Missions destination: a small flag. */
export function FlagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 21V4" />
      <path d="M6 5h11l-2.5 3.5L17 12H6" />
    </Icon>
  );
}
