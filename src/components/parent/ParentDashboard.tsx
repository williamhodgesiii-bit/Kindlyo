"use client";

import { useCallback, useId, useReducer, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { MissionCard } from "@/components/ui/MissionCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heading, Text } from "@/components/ui/Typography";
import { Avatar } from "@/components/ui/Avatar";
import { PersonIcon } from "@/components/ui/icons";
import { meetingPeopleModule } from "@/content/modules";
import { setMissionStatus } from "@/features/lessons/progressStorage";
import { useModulePath } from "@/features/lessons/useModulePath";
import { useFamily } from "@/features/profiles/useFamily";
import {
  ageBands,
  maxNicknameLength,
  maxProfiles,
  type AgeBand,
  type ChildProfile,
} from "@/features/profiles/types";

/**
 * The parent area: profiles, progress, missions, and the controls that undo
 * things.
 *
 * The destructive controls — reset progress, delete profile — sit behind the
 * shared Dialog with an explicit confirmation, because
 * docs/PRIVACY_AND_SAFETY.md requires a parent be able to delete progress and
 * profiles, and Journey 6 requires the confirmation.
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

function CreateProfileForm({
  onCreate,
  atLimit,
}: {
  onCreate: (nickname: string, ageBand: AgeBand) => { ok: boolean };
  atLimit: boolean;
}) {
  const nicknameId = useId();
  const [nickname, setNickname] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBand>(ageBands[0] ?? "5–6");
  const [error, setError] = useState<string | null>(null);

  if (atLimit) {
    return (
      <InlineFeedback tone="neutral" title="Three profiles is the maximum">
        You can create up to {maxProfiles} child profiles. Delete one below if
        you need room for another.
      </InlineFeedback>
    );
  }

  return (
    <form
      className="grid gap-4 sm:max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        const result = onCreate(nickname, ageBand);
        if (!result.ok) {
          setError("Please enter a nickname.");
          return;
        }
        setNickname("");
        setError(null);
      }}
    >
      <div>
        <label htmlFor={nicknameId} className="block font-semibold">
          Nickname
        </label>
        <Text tone="secondary" size="sm" className="mt-1">
          A first name or nickname is all we store. No surname, no birthday.
        </Text>
        <input
          id={nicknameId}
          name="nickname"
          value={nickname}
          maxLength={maxNicknameLength}
          autoComplete="off"
          onChange={(event) => setNickname(event.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2 text-base"
        />
      </div>

      <fieldset>
        <legend className="font-semibold">Age</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {ageBands.map((band) => (
            <label
              key={band}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2"
            >
              <input
                type="radio"
                name="ageBand"
                value={band}
                checked={ageBand === band}
                onChange={() => setAgeBand(band)}
                className="h-auto w-auto min-h-0 min-w-0"
              />
              Ages {band}
            </label>
          ))}
        </div>
      </fieldset>

      {error ? (
        <InlineFeedback tone="problem" title="That did not save">
          {error}
        </InlineFeedback>
      ) : null}

      <div>
        <Button type="submit">Add profile</Button>
      </div>
    </form>
  );
}

function ProfilePanel({
  profile,
  onChanged,
  onDelete,
  onReset,
  progressVersion,
}: {
  profile: ChildProfile;
  onChanged: () => void;
  onDelete: (profileId: string) => void;
  onReset: (profileId: string) => void;
  progressVersion: number;
}) {
  const [confirming, setConfirming] = useState<"reset" | "delete" | null>(null);
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
      <div className="flex flex-wrap items-center gap-3">
        <Avatar nickname={profile.nickname} size="lg" decorative />
        <div className="min-w-0">
          <Heading level={3} id={`profile-${profile.id}`}>
            {profile.nickname}
          </Heading>
          <Text tone="secondary" size="sm">
            Ages {profile.ageBand}
          </Text>
        </div>
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
          onClick={() => setConfirming("reset")}
        >
          Reset progress
        </Button>
        <Button
          variant="quiet"
          aria-label={`Delete profile: ${profile.nickname}`}
          onClick={() => setConfirming("delete")}
        >
          Delete profile
        </Button>
      </div>

      <Dialog
        open={confirming === "reset"}
        onClose={() => setConfirming(null)}
        title={`Reset ${profile.nickname}'s progress?`}
        description="Finished lessons and mission notes are cleared, and the lessons lock back to the beginning. The profile itself stays."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirming(null)}>
              Keep progress
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onReset(profile.id);
                setConfirming(null);
              }}
            >
              Reset progress
            </Button>
          </div>
        }
      />

      <Dialog
        open={confirming === "delete"}
        onClose={() => setConfirming(null)}
        title={`Delete ${profile.nickname}'s profile?`}
        description="The profile and all of its progress are removed from this device. This cannot be undone."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirming(null)}>
              Keep profile
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete(profile.id);
                setConfirming(null);
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

export function ParentDashboard() {
  const family = useFamily();
  const [progressVersion, bumpProgress] = useProgressVersion();

  if (!family.hydrated) {
    return (
      <PageContainer>
        <Skeleton variant="block" loadingLabel="Loading your family" />
        <Skeleton variant="text" lines={3} className="mt-6" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Heading level={1}>For parents</Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-2xl">
        Your children&rsquo;s profiles, how they are getting on, and the
        real-world missions to try together.
      </Text>

      <InlineFeedback
        tone="neutral"
        className="mt-6"
        title="Stored on this device"
      >
        Profiles and progress are kept in this browser only while we build.
        There are no accounts yet, and nothing is sent anywhere.
      </InlineFeedback>

      <section aria-labelledby="add-profile" className="mt-10">
        <Heading level={2} id="add-profile">
          Add a child profile
        </Heading>
        <div className="mt-4">
          <CreateProfileForm
            atLimit={family.profiles.length >= maxProfiles}
            onCreate={(nickname, ageBand) => family.create(nickname, ageBand)}
          />
        </div>
      </section>

      <section aria-labelledby="profiles" className="mt-12">
        <Heading level={2} id="profiles">
          Profiles
        </Heading>

        {family.profiles.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={<PersonIcon />}
            title="No profiles yet"
            description="Add a profile above, then hand the learning area to your child."
          />
        ) : (
          <div className="mt-4 grid gap-6">
            {family.profiles.map((profile) => (
              <ProfilePanel
                key={profile.id}
                profile={profile}
                progressVersion={progressVersion}
                onChanged={bumpProgress}
                onDelete={(profileId) => {
                  family.remove(profileId);
                  bumpProgress();
                }}
                onReset={(profileId) => {
                  family.resetProgress(profileId);
                  bumpProgress();
                }}
              />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
