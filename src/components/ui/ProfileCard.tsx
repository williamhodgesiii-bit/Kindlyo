import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Avatar } from "./Avatar";
import { CheckIcon } from "./icons";
import { Heading, type HeadingLevel } from "./Typography";

/**
 * A child profile, as shown in the parent's list and in profile selection.
 *
 * Renders a button when `onSelect` is given, a link when `href` is given, and
 * a plain card otherwise - so the same visual object can be a target or just
 * information without an interactive element that does nothing.
 *
 * Content-agnostic: `ageBand` and `meta` are caller-supplied, so this knows
 * nothing about the curriculum (docs/DECISIONS.md, record 004).
 */

export type ProfileCardProps = {
  nickname: string;
  ageBand?: string;
  meta?: ReactNode;
  onSelect?: () => void;
  href?: string;
  selected?: boolean;
  headingLevel?: HeadingLevel;
  className?: string;
};

function ProfileCardBody({
  nickname,
  ageBand,
  meta,
  selected,
  headingLevel,
}: Required<Pick<ProfileCardProps, "nickname" | "selected">> &
  Pick<ProfileCardProps, "ageBand" | "meta"> & {
    headingLevel: HeadingLevel;
  }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar nickname={nickname} size="lg" decorative />
        <div className="min-w-0">
          <Heading level={headingLevel} size="sm">
            {nickname}
          </Heading>
          {ageBand ? (
            <p className="text-sm text-text-secondary">{ageBand}</p>
          ) : null}
        </div>
        {selected ? (
          <span className="ml-auto shrink-0 text-brand-secondary-strong">
            <CheckIcon aria-hidden="true" />
            <span className="sr-only">Selected</span>
          </span>
        ) : null}
      </div>
      {meta ? <div className="mt-4">{meta}</div> : null}
    </>
  );
}

export function ProfileCard({
  nickname,
  ageBand,
  meta,
  onSelect,
  href,
  selected = false,
  headingLevel = 3,
  className,
}: ProfileCardProps) {
  const surface = cn(
    "block w-full rounded-lg border-2 p-4 text-left transition-colors",
    selected
      ? "border-brand-secondary bg-brand-secondary/10"
      : "border-border bg-surface",
    className,
  );
  const interactive = "hover:bg-surface-muted";

  const body = (
    <ProfileCardBody
      nickname={nickname}
      ageBand={ageBand}
      meta={meta}
      selected={selected}
      headingLevel={headingLevel}
    />
  );

  if (onSelect) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className={cn(surface, interactive)}
      >
        {body}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={cn(surface, interactive)}>
        {body}
      </Link>
    );
  }

  return <div className={surface}>{body}</div>;
}
