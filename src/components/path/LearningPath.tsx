"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContentStatusBadge } from "@/components/ui/ContentStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckIcon, PersonIcon } from "@/components/ui/icons";
import { PageContainer } from "@/components/ui/PageContainer";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heading, Text } from "@/components/ui/Typography";
import { meetingPeopleModule } from "@/content/modules";
import type { PathLesson } from "@/features/lessons/moduleProgress";
import { useModulePath } from "@/features/lessons/useModulePath";
import { useFamily } from "@/features/profiles/useFamily";

/**
 * The learning path: who is learning, and where they are in the module.
 *
 * Three states before the path itself: loading (storage not read yet), no
 * profiles (send the grown-up to the parent area), and profiles-but-none-
 * selected (the picker). Journey 3 starts "Parent selects the child profile",
 * and this is that screen.
 *
 * Locked lessons render information, not a control: there is no button to
 * press and be refused. The wording is "Finish lesson N first" — a direction,
 * not a demerit — and lock state is carried by text and a muted number, never
 * by colour alone. Completed lessons stay open for replay; taking a finished
 * story away would be a punitive mechanic (docs/DESIGN_SYSTEM.md).
 */

/**
 * Wording per state. Locked reads as a direction ("Finish lesson 2 first"),
 * never as a demerit, and every state is spelled out in words as well as being
 * shown by the icon.
 */
const stateLabels = {
  complete: "Done",
  "in-progress": "In progress",
  available: "Ready to start",
  locked: "",
  unwritten: "Being written",
} satisfies Record<PathLesson["state"], string>;

const actionLabels = {
  complete: "Play again",
  "in-progress": "Continue",
  available: "Start",
} as const;

function LessonRow({ entry }: { entry: PathLesson }) {
  const stateLabel =
    entry.state === "locked"
      ? `Finish lesson ${entry.order - 1} first`
      : stateLabels[entry.state];
  const action =
    entry.state === "complete" ||
    entry.state === "in-progress" ||
    entry.state === "available"
      ? actionLabels[entry.state]
      : null;

  return (
    <Card as="li" padding="sm">
      <div className="flex flex-wrap items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted font-semibold text-text-secondary"
        >
          {entry.state === "complete" ? (
            <CheckIcon className="text-success-strong" />
          ) : (
            entry.order
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">
            <span className="sr-only">Lesson {entry.order}: </span>
            {entry.title}
          </span>
          <span className="mt-1 flex flex-wrap gap-x-2 text-sm text-text-secondary">
            <span>{stateLabel}</span>
            {entry.lesson &&
            entry.state !== "locked" &&
            entry.state !== "unwritten" ? (
              <span>
                <span aria-hidden="true">· </span>
                About {entry.lesson.estimatedMinutes} minutes
              </span>
            ) : null}
          </span>
        </span>
        {entry.lesson && action !== null ? (
          // The label names the lesson, so eight otherwise identical buttons
          // are told apart by their accessible names rather than by position.
          <ButtonLink
            href={`/learn/lesson/${entry.lesson.slug}`}
            aria-label={`${action} lesson ${entry.order}: ${entry.title}`}
            variant={entry.state === "complete" ? "secondary" : "primary"}
          >
            {action}
          </ButtonLink>
        ) : null}
      </div>
    </Card>
  );
}

export function LearningPath() {
  const family = useFamily();
  const path = useModulePath(family.selectedProfile?.id ?? null);

  if (!family.hydrated) {
    return (
      <PageContainer>
        <Skeleton variant="block" loadingLabel="Loading the learning path" />
        <Skeleton variant="text" lines={3} className="mt-6" />
      </PageContainer>
    );
  }

  if (family.profiles.length === 0) {
    return (
      <PageContainer>
        <Heading level={1}>Learn</Heading>
        <EmptyState
          className="mt-8"
          icon={<PersonIcon />}
          title="First, a grown-up sets up a profile"
          description="Ask your grown-up to create your profile in the parent area. It only needs a nickname."
          action={
            <ButtonLink href="/parent" variant="secondary">
              Go to the parent area
            </ButtonLink>
          }
        />
      </PageContainer>
    );
  }

  if (family.selectedProfile === null || path === null) {
    return (
      <PageContainer>
        <Heading level={1}>Who is learning today?</Heading>
        <Text size="lg" tone="secondary" className="mt-4 max-w-2xl">
          Pick your profile to see your lessons.
        </Text>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {family.profiles.map((profile) => (
            <li key={profile.id}>
              <ProfileCard
                nickname={profile.nickname}
                ageBand={`Ages ${profile.ageBand}`}
                onSelect={() => family.select(profile.id)}
              />
            </li>
          ))}
        </ul>
      </PageContainer>
    );
  }

  const profile = family.selectedProfile;

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading level={1}>Learn</Heading>
        <div className="flex items-center gap-2">
          <Text tone="secondary" as="span">
            Learning as{" "}
            <span className="font-semibold">{profile.nickname}</span>
          </Text>
          <Button variant="quiet" onClick={() => family.select(null)}>
            Switch
          </Button>
        </div>
      </div>

      <section
        aria-labelledby={`module-${meetingPeopleModule.id}`}
        className="mt-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={2} id={`module-${meetingPeopleModule.id}`}>
            {meetingPeopleModule.title}
          </Heading>
          <ContentStatusBadge status={meetingPeopleModule.status} />
        </div>
        <Text tone="secondary" className="mt-3 max-w-2xl">
          {meetingPeopleModule.description}
        </Text>

        <ProgressBar
          className="mt-6 max-w-md"
          label="Lessons finished"
          value={path.completedCount}
          max={path.lessonCount}
          tone="calm"
        />

        {path.resume !== null && path.resume.lesson ? (
          <div className="mt-6">
            <ButtonLink
              href={`/learn/lesson/${path.resume.lesson.slug}`}
              size="lg"
            >
              {path.resume.state === "in-progress"
                ? `Continue lesson ${path.resume.order}`
                : `Start lesson ${path.resume.order}`}
            </ButtonLink>
          </div>
        ) : (
          <Text className="mt-6 max-w-2xl">
            Every lesson is finished. You can play any of them again — or take
            the real-world challenge out into the world.
          </Text>
        )}

        <ol className="mt-8 grid gap-3">
          {path.lessons.map((entry) => (
            <LessonRow key={entry.order} entry={entry} />
          ))}
        </ol>
      </section>
    </PageContainer>
  );
}
