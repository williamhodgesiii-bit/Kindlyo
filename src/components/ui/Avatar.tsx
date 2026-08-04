import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { PersonIcon } from "./icons";

/**
 * A child profile's visual marker.
 *
 * There is no `src` prop and there is no image element, on purpose. Child
 * profiles are a nickname and an age band only (docs/PRIVACY_AND_SAFETY.md);
 * making photographs impossible at the type level is more reliable than a rule
 * in a document.
 *
 * The tint is derived from the nickname so a child recognises their own
 * profile at a glance, and it is stable across renders and devices.
 */

export type AvatarSize = "sm" | "md" | "lg";

const sizes = {
  sm: "h-9 w-9 text-sm",
  md: "h-11 w-11 text-lg",
  lg: "h-16 w-16 text-2xl",
} satisfies Record<AvatarSize, string>;

const tints = [
  "bg-tint-clay",
  "bg-tint-sage",
  "bg-tint-honey",
  "bg-tint-sand",
] as const;

function tintFor(nickname: string): string {
  let total = 0;
  for (const character of nickname) {
    total += character.codePointAt(0) ?? 0;
  }
  // `tints` is a non-empty const tuple, but noUncheckedIndexedAccess still
  // widens the lookup, so fall back explicitly.
  return tints[total % tints.length] ?? tints[0];
}

/** First visible character, counted by code point so emoji stay intact. */
function initialFor(nickname: string): string {
  return [...nickname][0]?.toUpperCase() ?? "";
}

export type AvatarProps = ComponentPropsWithoutRef<"span"> & {
  nickname?: string;
  size?: AvatarSize;
  decorative?: boolean;
};

export function Avatar({
  nickname,
  size = "md",
  decorative = false,
  className,
  ...rest
}: AvatarProps) {
  const trimmed = nickname?.trim() ?? "";
  const initial = initialFor(trimmed);
  const hasInitial = initial !== "";

  // `decorative` is for when the nickname is already visible next to the
  // avatar; repeating it would just make screen readers say it twice.
  const labelling = decorative
    ? { "aria-hidden": true as const }
    : { role: "img", "aria-label": hasInitial ? trimmed : "Profile" };

  return (
    <span
      {...labelling}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "font-bold text-text-primary",
        sizes[size],
        hasInitial ? tintFor(trimmed) : "bg-surface-muted text-text-secondary",
        className,
      )}
      {...rest}
    >
      {hasInitial ? (
        <span aria-hidden="true">{initial}</span>
      ) : (
        <PersonIcon aria-hidden="true" />
      )}
    </span>
  );
}
