"use client";

import { type ReactNode, useReducer, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heading } from "@/components/ui/Typography";
import { PersonIcon } from "@/components/ui/icons";
import type { ChildDashboard } from "@/features/lessons/childDashboard";
import { useChildDashboard } from "@/features/lessons/useChildDashboard";
import type { ChildProfile } from "@/features/profiles/types";
import { useFamily } from "@/features/profiles/useFamily";
import { ChildSelector } from "./ChildSelector";

/**
 * The shell every per-child parent section shares: Missions and Skills, and the
 * shape of the dashboard too.
 *
 * It owns the four states those sections all have — loading the family, no child
 * yet, choosing which child, loading that child's figures — so each section only
 * writes what is unique to it, given one loaded `dashboard` for the child in
 * view. Selection is local to the section (not the `/learn` selection), so a
 * parent glancing at Missions never changes who the tablet thinks is learning,
 * exactly as the dashboard behaves.
 *
 * `onChanged` re-reads the current child's dashboard in place after a write (a
 * mission mark), keeping the same child rather than blanking to a switch.
 */
export function ParentChildSection({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: (context: {
    dashboard: ChildDashboard;
    profile: ChildProfile;
    onChanged: () => void;
  }) => ReactNode;
}) {
  const family = useFamily();
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [revision, bump] = useReducer((value: number) => value + 1, 0);

  // Falls back to the first child, and recovers on its own if the child being
  // viewed is removed. Null only when there are no profiles at all.
  const viewing =
    family.profiles.find((profile) => profile.id === viewingId) ??
    family.profiles[0] ??
    null;

  // Called unconditionally (null-safe) so the hook order never changes.
  const dashboard = useChildDashboard(viewing?.id ?? null, revision);

  return (
    <PageContainer>
      <Heading level={1}>{title}</Heading>
      {intro}

      {!family.hydrated ? (
        <Skeleton
          variant="block"
          className="mt-8"
          loadingLabel={`Loading ${title.toLowerCase()}`}
        />
      ) : viewing === null ? (
        <EmptyState
          className="mt-8"
          icon={<PersonIcon />}
          title="No profiles yet"
          description="Add a child on the dashboard, then hand the learning area over — this fills in as they practise."
          action={<ButtonLink href="/parent">Go to the dashboard</ButtonLink>}
        />
      ) : (
        <>
          <div className="mt-6">
            <ChildSelector
              profiles={family.profiles}
              selectedId={viewing.id}
              onSelect={setViewingId}
            />
          </div>

          {dashboard === null ? (
            <Skeleton
              variant="text"
              lines={4}
              className="mt-8"
              loadingLabel={`Loading ${viewing.nickname}'s ${title.toLowerCase()}`}
            />
          ) : dashboard.isEmpty ? (
            <NotStartedYet nickname={viewing.nickname} title={title} />
          ) : (
            children({ dashboard, profile: viewing, onChanged: bump })
          )}
        </>
      )}
    </PageContainer>
  );
}

/** The calm empty state before a child has opened any lesson. */
function NotStartedYet({
  nickname,
  title,
}: {
  nickname: string;
  title: string;
}) {
  return (
    <EmptyState
      className="mt-8"
      icon={<PersonIcon />}
      title={`${nickname} has not started a lesson yet`}
      description={`${title} fill in as ${nickname} practises. Open the learning area to make a start together.`}
      action={<ButtonLink href="/learn">Open the learning area</ButtonLink>}
    />
  );
}
