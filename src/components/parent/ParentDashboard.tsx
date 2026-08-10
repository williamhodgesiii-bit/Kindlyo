"use client";

import { useCallback, useReducer, useState, type CSSProperties } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heading, Text } from "@/components/ui/Typography";
import { PersonIcon } from "@/components/ui/icons";
import { getFamilyClient } from "@/features/families/familyClient";
import { useChildDashboard } from "@/features/lessons/useChildDashboard";
import type { Family } from "@/features/profiles/useFamily";
import { maxProfiles, type ChildProfile } from "@/features/profiles/types";
import {
  CurrentMission,
  describeWhen,
  NothingYet,
  ProgressOverview,
  RecentActivity,
  SkillAreaSummary,
  TalkingPoints,
} from "./ChildDashboardPanels";
import { AccountStorageNotice } from "./AccountStorageNotice";
import { ChildSelector } from "./ChildSelector";
import { ProfileForm } from "./ProfileForm";

/**
 * The parent dashboard.
 *
 * One child at a time, chosen with the selector at the top, because five
 * questions answered well about one child beats five answered vaguely about
 * three — and because a screen showing every child's numbers side by side is
 * how a dashboard becomes a league table. There is no comparison between
 * siblings anywhere here, and there must not be.
 *
 * The selector is local component state, NOT the child profile selection used
 * by `/learn`. A parent glancing at how Ben got on should not silently change
 * who the tablet thinks is learning.
 *
 * Editorial in tone: this is the adult surface. The destructive controls sit
 * behind the shared Dialog with an explicit confirmation, per
 * docs/PRIVACY_AND_SAFETY.md and Journey 6.
 */

/** Bumped to re-read progress from storage after a change. */
function useProgressVersion() {
  return useReducer((version: number) => version + 1, 0);
}

function ChildPanel({
  profile,
  family,
  progressVersion,
  onChanged,
}: {
  profile: ChildProfile;
  family: Family;
  progressVersion: number;
  onChanged: () => void;
}) {
  const [dialog, setDialog] = useState<"edit" | "reset" | "delete" | null>(
    null,
  );
  const dashboard = useChildDashboard(profile.id, progressVersion);

  const toggleMission = useCallback(
    async (lessonId: string, done: boolean) => {
      await getFamilyClient().setMissionStatus(
        profile.id,
        lessonId,
        done ? null : "done",
      );
      onChanged();
    },
    [profile.id, onChanged],
  );

  return (
    <section aria-labelledby={`child-${profile.id}`} className="mt-8">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          nickname={profile.nickname}
          {...(profile.avatarId ? { avatarId: profile.avatarId } : {})}
          size="lg"
          decorative
        />
        <div className="min-w-0 flex-1">
          <Heading level={3} id={`child-${profile.id}`}>
            {profile.nickname}
          </Heading>
          <Text tone="secondary" size="sm">
            Ages {profile.ageBand}
          </Text>
          {dashboard !== null && !dashboard.isEmpty ? (
            <Text
              size="sm"
              className="mt-1 font-semibold text-module-accent-strong"
            >
              {dashboard.completedCount === 0
                ? "Just getting started"
                : `Practised ${dashboard.completedCount} lesson${
                    dashboard.completedCount === 1 ? "" : "s"
                  } so far`}
              {dashboard.lastActiveAt !== null
                ? ` · last here ${describeWhen(dashboard.lastActiveAt)}`
                : ""}
            </Text>
          ) : null}
        </div>
        <Button
          variant="secondary"
          aria-label={`Edit profile: ${profile.nickname}`}
          onClick={() => setDialog("edit")}
        >
          Edit
        </Button>
      </div>

      {dashboard === null ? (
        <Skeleton
          variant="text"
          lines={4}
          className="mt-6"
          loadingLabel={`Loading ${profile.nickname}'s progress`}
        />
      ) : dashboard.isEmpty ? (
        <NothingYet nickname={profile.nickname} />
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Progress leads full-width as the at-a-glance hero, then the
              actionable mission, then the detail panels, then the conversation.
              Each rises in on a small stagger (reduced motion collapses it). */}
          {[
            <ProgressOverview key="progress" dashboard={dashboard} />,
            <CurrentMission
              key="mission"
              dashboard={dashboard}
              onToggle={toggleMission}
            />,
            <SkillAreaSummary key="skills" dashboard={dashboard} />,
            <RecentActivity key="recent" dashboard={dashboard} />,
            <TalkingPoints key="talking" dashboard={dashboard} />,
          ].map((panel, index) => (
            <div
              key={panel.key}
              className={`llc-card-enter${
                panel.key === "progress" || panel.key === "talking"
                  ? " lg:col-span-2"
                  : ""
              }`}
              style={{ "--llc-enter-index": index } as CSSProperties}
            >
              {panel}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
        <Button
          variant="quiet"
          aria-label={`Reset progress for ${profile.nickname}`}
          onClick={() => setDialog("reset")}
        >
          Reset progress
        </Button>
        <Button
          variant="quiet"
          aria-label={`Delete profile: ${profile.nickname}`}
          onClick={() => setDialog("delete")}
        >
          Delete profile
        </Button>
      </div>

      <Dialog
        open={dialog === "edit"}
        onClose={() => setDialog(null)}
        title={`Edit ${profile.nickname}'s profile`}
      >
        <ProfileForm
          profile={profile}
          submitLabel="Save changes"
          onCancel={() => setDialog(null)}
          onSubmit={async (draft) => {
            const result = await family.update(profile.id, draft);
            if (!result.ok) {
              return { ok: false, reason: "Please enter a nickname." };
            }
            setDialog(null);
            return { ok: true };
          }}
        />
      </Dialog>

      <Dialog
        open={dialog === "reset"}
        onClose={() => setDialog(null)}
        title={`Reset ${profile.nickname}'s progress?`}
        description="Practised lessons and mission notes are cleared, and the lessons lock back to the beginning. The profile itself stays."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Keep progress
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setDialog(null);
                void family.resetProgress(profile.id).then(onChanged);
              }}
            >
              Reset progress
            </Button>
          </div>
        }
      />

      <Dialog
        open={dialog === "delete"}
        onClose={() => setDialog(null)}
        title={`Delete ${profile.nickname}'s profile?`}
        description="The profile and all of its progress are removed from your account. This cannot be undone."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Keep profile
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setDialog(null);
                void family.remove(profile.id);
              }}
            >
              Delete profile
            </Button>
          </div>
        }
      />
    </section>
  );
}

export function ParentDashboard({ family }: { family: Family }) {
  const [progressVersion, bumpProgress] = useProgressVersion();
  const [adding, setAdding] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const atLimit = family.profiles.length >= maxProfiles;
  // Falls back to the first child, and recovers on its own if the child being
  // viewed is deleted.
  const viewing =
    family.profiles.find((profile) => profile.id === viewingId) ??
    family.profiles[0] ??
    null;

  return (
    <PageContainer>
      <Heading level={1}>For parents</Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-prose">
        What your children have practised, what to try next, and something to
        talk about together.
      </Text>

      <AccountStorageNotice className="mt-6" />

      <section aria-labelledby="children" className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading level={2} id="children">
            Children
          </Heading>
          {!adding && !atLimit && family.profiles.length > 0 ? (
            <Button onClick={() => setAdding(true)}>Add a child</Button>
          ) : null}
        </div>

        {atLimit ? (
          <InlineFeedback
            tone="neutral"
            className="mt-4"
            title="Three profiles is the maximum"
          >
            You can have up to {maxProfiles} child profiles. Delete one below if
            you need room for another.
          </InlineFeedback>
        ) : null}

        {adding ? (
          <Card className="mt-4">
            <Heading level={3} size="sm">
              Add a child
            </Heading>
            <div className="mt-4">
              <ProfileForm
                submitLabel="Create profile"
                onCancel={() => setAdding(false)}
                onSubmit={async (draft) => {
                  const result = await family.create(draft);
                  if (!result.ok) {
                    return {
                      ok: false,
                      reason:
                        result.reason === "limit"
                          ? `You can have up to ${maxProfiles} profiles.`
                          : "Please enter a nickname.",
                    };
                  }
                  setAdding(false);
                  return { ok: true };
                }}
              />
            </div>
          </Card>
        ) : null}

        {viewing === null ? (
          !adding ? (
            <EmptyState
              className="mt-4"
              icon={<PersonIcon />}
              title="No profiles yet"
              description="Add a profile, then hand the learning area to your child."
              action={
                <Button onClick={() => setAdding(true)}>Add a child</Button>
              }
            />
          ) : null
        ) : (
          <>
            <div className="mt-6">
              <ChildSelector
                profiles={family.profiles}
                selectedId={viewing.id}
                onSelect={setViewingId}
              />
            </div>
            <ChildPanel
              key={viewing.id}
              profile={viewing}
              family={family}
              progressVersion={progressVersion}
              onChanged={bumpProgress}
            />
          </>
        )}
      </section>
    </PageContainer>
  );
}
