"use client";

import { useCallback, useReducer, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { MissionCard } from "@/components/ui/MissionCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Heading, Text } from "@/components/ui/Typography";
import { PersonIcon } from "@/components/ui/icons";
import { meetingPeopleModule } from "@/content/modules";
import { setMissionStatus } from "@/features/lessons/progressStorage";
import { useModulePath } from "@/features/lessons/useModulePath";
import type { Family } from "@/features/profiles/useFamily";
import { maxProfiles, type ChildProfile } from "@/features/profiles/types";
import { ProfileForm } from "./ProfileForm";
import { PrototypeStorageNotice } from "./PrototypeStorageNotice";

/**
 * The parent area: profiles, progress, missions, and the controls that change
 * or undo things.
 *
 * Editorial in tone — this is the adult surface. Long measure, full sentences,
 * quiet controls, and the destructive ones (reset progress, delete profile)
 * behind the shared Dialog with an explicit confirmation, because
 * docs/PRIVACY_AND_SAFETY.md requires a parent be able to delete progress and
 * profiles and Journey 6 requires the confirmation.
 *
 * Deliberately calm: a child's progress is shown as a count and a bar, with no
 * streak, no comparison between siblings, and no "behind schedule" language.
 * Two children's cards sit side by side, which is exactly the place a
 * leaderboard would try to grow — so there are no numbers here that invite a
 * comparison beyond each child's own count.
 */

/** Bumped to re-read progress from storage after a change. */
function useProgressVersion() {
  return useReducer((version: number) => version + 1, 0);
}

function ProfilePanel({
  profile,
  family,
  onChanged,
  progressVersion,
}: {
  profile: ChildProfile;
  family: Family;
  onChanged: () => void;
  progressVersion: number;
}) {
  const [dialog, setDialog] = useState<"edit" | "reset" | "delete" | null>(
    null,
  );
  const path = useModulePath(profile.id, progressVersion);

  const missions =
    path?.lessons.filter(
      (entry) => entry.state === "complete" && entry.lesson,
    ) ?? [];

  const toggleMission = useCallback(
    (lessonId: string, done: boolean) => {
      setMissionStatus(profile.id, lessonId, done ? null : "done");
      onChanged();
    },
    [profile.id, onChanged],
  );

  return (
    <Card
      as="section"
      elevation="soft"
      aria-labelledby={`profile-${profile.id}`}
    >
      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          nickname={profile.nickname}
          {...(profile.avatarId ? { avatarId: profile.avatarId } : {})}
          size="lg"
          decorative
        />
        <div className="min-w-0 flex-1">
          <Heading level={3} id={`profile-${profile.id}`}>
            {profile.nickname}
          </Heading>
          <Text tone="secondary" size="sm">
            Ages {profile.ageBand}
          </Text>
        </div>
        <Button
          variant="secondary"
          aria-label={`Edit profile: ${profile.nickname}`}
          onClick={() => setDialog("edit")}
        >
          Edit
        </Button>
      </div>

      <ProgressBar
        className="mt-6 max-w-md"
        label={`${meetingPeopleModule.title} — lessons finished`}
        value={path?.completedCount ?? 0}
        max={path?.lessonCount ?? meetingPeopleModule.lessons.length}
        tone="calm"
      />

      <div className="mt-8">
        <Heading level={4}>Offline missions</Heading>
        {missions.length === 0 ? (
          <EmptyState
            className="mt-3"
            headingLevel={4}
            title="No missions yet"
            description="A mission appears here each time a lesson is finished — one small thing to try away from the screen."
          />
        ) : (
          <ul className="mt-3 grid gap-3">
            {missions.map((entry) => {
              const lesson = entry.lesson;
              if (!lesson) return null;
              const done = entry.missionDone === true;

              return (
                <li key={lesson.id}>
                  <MissionCard
                    status={done ? "done" : "suggested"}
                    title={lesson.title}
                    headingLevel={4}
                    description={lesson.offlineMission.parentPrompt}
                    action={
                      <Button
                        variant="secondary"
                        // Named explicitly: several missions carry the same
                        // visible label, and the lesson is what tells them
                        // apart.
                        aria-label={`${
                          done ? "Mark as not done yet" : "Mark as done"
                        }: ${lesson.title}`}
                        onClick={() => toggleMission(lesson.id, done)}
                      >
                        {done ? "Mark as not done yet" : "Mark as done"}
                      </Button>
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>

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
          onSubmit={(draft) => {
            const result = family.update(profile.id, draft);
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
        description="Finished lessons and mission notes are cleared, and the lessons lock back to the beginning. The profile itself stays."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Keep progress
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                family.resetProgress(profile.id);
                onChanged();
                setDialog(null);
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
        description="The profile and all of its progress are removed from this device. This cannot be undone."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Keep profile
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                family.remove(profile.id);
                onChanged();
                setDialog(null);
              }}
            >
              Delete profile
            </Button>
          </div>
        }
      />
    </Card>
  );
}

export function ParentDashboard({ family }: { family: Family }) {
  const [progressVersion, bumpProgress] = useProgressVersion();
  const [adding, setAdding] = useState(false);
  const atLimit = family.profiles.length >= maxProfiles;

  return (
    <PageContainer>
      <Heading level={1}>For parents</Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-prose">
        Your children&rsquo;s profiles, how they are getting on, and the
        real-world missions to try together.
      </Text>

      <PrototypeStorageNotice className="mt-6" />

      <section aria-labelledby="profiles" className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading level={2} id="profiles">
            Children
          </Heading>
          {/* With no children yet, the empty state carries the invitation
              instead — two identical buttons on one screen is one too many. */}
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
                onSubmit={(draft) => {
                  const result = family.create(draft);
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

        {family.profiles.length === 0 && !adding ? (
          <EmptyState
            className="mt-4"
            icon={<PersonIcon />}
            title="No profiles yet"
            description="Add a profile, then hand the learning area to your child."
            action={
              <Button onClick={() => setAdding(true)}>Add a child</Button>
            }
          />
        ) : (
          <div className="mt-6 grid gap-6">
            {family.profiles.map((profile) => (
              <ProfilePanel
                key={profile.id}
                profile={profile}
                family={family}
                progressVersion={progressVersion}
                onChanged={bumpProgress}
              />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
