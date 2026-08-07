"use client";

import { Avatar } from "@/components/ui/Avatar";
import type { ChildProfile } from "@/features/profiles/types";

/**
 * The one-child-at-a-time selector, shared by every parent section (dashboard,
 * missions, skills).
 *
 * A tablist, because it switches which single child is in view — never a grid of
 * children side by side. The parent area answers questions about one child at a
 * time on purpose: a screen showing every child's figures together is how a
 * dashboard becomes a league table, and this product does not compare siblings
 * (docs/design/COMPONENT_STATES.md §4).
 *
 * A single child needs no chooser, so this renders nothing below two.
 */
export function ChildSelector({
  profiles,
  selectedId,
  onSelect,
}: {
  profiles: readonly ChildProfile[];
  selectedId: string;
  onSelect: (profileId: string) => void;
}) {
  if (profiles.length < 2) return null;

  return (
    <div
      role="tablist"
      aria-label="Choose a child"
      className="flex flex-wrap gap-2"
    >
      {profiles.map((profile) => {
        const selected = profile.id === selectedId;
        return (
          <button
            key={profile.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(profile.id)}
            className={
              "inline-flex min-h-11 items-center gap-2 rounded-lg border-2 px-4 py-2 font-semibold transition-colors " +
              (selected
                ? "border-brand-secondary bg-brand-secondary/10"
                : "border-border bg-surface hover:bg-surface-muted")
            }
          >
            <Avatar
              nickname={profile.nickname}
              {...(profile.avatarId ? { avatarId: profile.avatarId } : {})}
              size="sm"
              decorative
            />
            {profile.nickname}
          </button>
        );
      })}
    </div>
  );
}
