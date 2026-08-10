"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { MissionCard } from "@/components/ui/MissionCard";
import { ParentInsightCard } from "@/components/ui/ParentInsightCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  CheckIcon,
  CompassIcon,
  FlagIcon,
  MapIcon,
  ProgressIcon,
  SparkIcon,
} from "@/components/ui/icons";
import { Heading, type HeadingLevel, Text } from "@/components/ui/Typography";
import type { ReactNode } from "react";
import { modulePathHref } from "@/content/worlds";
import { skillAreaLabels } from "@/features/curriculum/schema";
import {
  practiceStatusLabels,
  type ChildDashboard,
} from "@/features/lessons/childDashboard";

/**
 * The panels of one child's dashboard.
 *
 * Every label here comes from the neutral vocabulary in `childDashboard.ts` —
 * practised, exploring, ready to review, not started yet. There is no score,
 * no grade, no percentage presented as attainment, and no word about the
 * child's character. A parent should leave this screen knowing what happened,
 * not holding a verdict on who their child is.
 *
 * Nor does anything here claim an outcome. "Practised saying hello" is a fact
 * about a lesson; "is more confident" would be a claim we have no basis for
 * and do not make (CLAUDE.md, "Content status").
 */

/** Plain-language recency. Exact timestamps help nobody read a dashboard. */
export function describeWhen(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "recently";

  const days = Math.floor(
    (new Date(now.toDateString()).getTime() -
      new Date(then.toDateString()).getTime()) /
      86_400_000,
  );

  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return "a while ago";
}

/**
 * A panel heading with a small module-accent icon beside it. The icon is
 * decorative (`aria-hidden`); the heading keeps its text and `id`, so the
 * accessible name and the heading outline are exactly as before.
 */
function PanelHeading({
  id,
  level = 4,
  icon,
  children,
}: {
  id: string;
  level?: HeadingLevel;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden="true" className="shrink-0 text-module-accent-strong">
        {icon}
      </span>
      <Heading level={level} id={id}>
        {children}
      </Heading>
    </div>
  );
}

export function ProgressOverview({ dashboard }: { dashboard: ChildDashboard }) {
  const { completedCount, lessonCount, resume, lastActiveAt } = dashboard;

  // Worlds the child has actually got into — ones with a finished lesson, plus
  // the world they are currently in — so the breakdown shows where they have
  // been without listing all twelve untouched.
  const started = dashboard.modules.filter(
    (m) => m.path.completedCount > 0 || m.module.id === resume?.module.id,
  );

  return (
    <Card as="section" aria-labelledby="overview" elevation="soft">
      <PanelHeading id="overview" icon={<ProgressIcon />}>
        Progress
      </PanelHeading>

      <ProgressBar
        className="mt-4 max-w-md"
        label="Lessons practised across the neighborhood"
        value={completedCount}
        max={lessonCount}
        tone="calm"
      />

      {started.length > 0 ? (
        <dl className="mt-6 grid gap-2">
          {started.map((m) => (
            <div key={m.module.id} className="flex justify-between gap-3">
              <dt className="text-sm text-text-secondary">{m.module.title}</dt>
              <dd className="text-sm font-semibold">
                {m.path.completedCount} of {m.path.lessonCount}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-text-secondary">Last used</dt>
          <dd className="mt-1 font-semibold">
            {lastActiveAt === null ? "Not yet" : describeWhen(lastActiveAt)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-text-secondary">Next up</dt>
          <dd className="mt-1 font-semibold">
            {resume?.entry.lesson
              ? `${resume.module.title} · ${resume.entry.order}. ${resume.entry.title}`
              : "Every lesson has been practised"}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        {resume?.entry.lesson ? (
          <ButtonLink
            href={modulePathHref(resume.module.id)}
            variant="secondary"
          >
            Open the learning area
          </ButtonLink>
        ) : (
          <ButtonLink href="/learn/map" variant="secondary">
            Explore the neighborhood map
          </ButtonLink>
        )}
      </div>
    </Card>
  );
}

export function SkillAreaSummary({
  dashboard,
  headingLevel = 4,
}: {
  dashboard: ChildDashboard;
  headingLevel?: HeadingLevel;
}) {
  return (
    <Card as="section" aria-labelledby="skill-areas" elevation="soft">
      <PanelHeading
        id="skill-areas"
        level={headingLevel}
        icon={<CompassIcon />}
      >
        Skill areas
      </PanelHeading>
      <Text tone="secondary" size="sm" className="mt-2 max-w-prose">
        What has been practised so far. These describe the lessons, not your
        child.
      </Text>

      <ul className="mt-4 grid gap-3">
        {dashboard.skillAreas.map((area) => (
          <li
            key={area.area}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <span className="font-semibold">{skillAreaLabels[area.area]}</span>
            <span className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">
                {area.practisedCount} of {area.lessonCount}
              </span>
              <span className="rounded-md bg-surface-muted px-3 py-1 text-sm font-semibold text-text-secondary">
                {practiceStatusLabels[area.status]}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RecentActivity({ dashboard }: { dashboard: ChildDashboard }) {
  return (
    <Card as="section" aria-labelledby="recent" elevation="soft">
      <PanelHeading id="recent" icon={<MapIcon />}>
        Recent lessons
      </PanelHeading>

      {dashboard.recent.length === 0 ? (
        <Text tone="secondary" className="mt-3">
          Nothing yet — this fills in as lessons are opened.
        </Text>
      ) : (
        <ul className="mt-4 grid gap-3">
          {dashboard.recent.map((item) => (
            <li
              key={item.lesson.id}
              className="flex flex-wrap items-center gap-3"
            >
              <span aria-hidden="true" className="text-text-secondary">
                {item.status === "practised" ? (
                  <CheckIcon className="text-success-strong" />
                ) : (
                  <CompassIcon />
                )}
              </span>
              <span className="min-w-0 flex-1 font-semibold">
                {item.lesson.title}
              </span>
              <span className="text-sm text-text-secondary">
                {practiceStatusLabels[item.status]} · {describeWhen(item.at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function CurrentMission({
  dashboard,
  onToggle,
  headingLevel = 4,
}: {
  dashboard: ChildDashboard;
  onToggle: (lessonId: string, done: boolean) => void;
  headingLevel?: HeadingLevel;
}) {
  const mission = dashboard.activeMission;

  if (mission === null) {
    return (
      <EmptyState
        headingLevel={headingLevel}
        title="No mission yet"
        description="A mission to try together appears here once a lesson is finished."
      />
    );
  }

  return (
    <section aria-labelledby="mission">
      <Heading level={headingLevel} id="mission" className="sr-only">
        Current mission
      </Heading>
      <MissionCard
        status={mission.done ? "done" : "suggested"}
        statusLabel={mission.done ? "Done" : "Try together"}
        title={mission.lesson.title}
        headingLevel={headingLevel}
        description={
          <>
            <span className="block">
              {mission.lesson.offlineMission.parentPrompt}
            </span>
            <span className="mt-3 block text-text-primary">
              Afterwards: {mission.conversationPrompt}
            </span>
          </>
        }
        action={
          <Button
            variant="secondary"
            aria-label={`${
              mission.done ? "Mark as not done yet" : "Mark as done"
            }: ${mission.lesson.title}`}
            onClick={() => onToggle(mission.lesson.id, mission.done)}
          >
            {mission.done ? "Mark as not done yet" : "Mark as done"}
          </Button>
        }
      />
    </section>
  );
}

export function TalkingPoints({
  dashboard,
  headingLevel = 4,
}: {
  dashboard: ChildDashboard;
  headingLevel?: HeadingLevel;
}) {
  const points = dashboard.talkingPoints;

  return (
    <ParentInsightCard
      eyebrow="Worth talking about"
      headingLevel={headingLevel}
      title={
        points.length === 0
          ? "Nothing flagged yet"
          : "Moments where the answer depended on the situation"
      }
      body={
        points.length === 0 ? (
          "When your child picks an option whose outcome depends on the situation, it shows up here as a conversation starter."
        ) : (
          <>
            <span className="block">
              These are not wrong answers. Your child chose an option that works
              in some situations and not others — which makes it a good thing to
              wonder about together.
            </span>
            <ul className="mt-4 grid gap-4">
              {points.map((point) => (
                <li key={`${point.lesson.id}-${point.choiceText}`}>
                  <span className="block text-sm text-text-secondary">
                    {point.lesson.title} — {point.question}
                  </span>
                  <span className="mt-1 block font-semibold">
                    They chose: {point.choiceText}
                  </span>
                  <span className="mt-1 block">
                    Try asking: {point.conversationPrompt}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )
      }
    />
  );
}

/**
 * Lessons a child has been through once (COMPONENT_STATES.md §8).
 *
 * Framed as an open invitation, never a finish line or a re-lock: going back is
 * always welcome, costs no progress, and often lands differently the second
 * time. The status word stays in the neutral vocabulary — "Practised", not a
 * grade — and there is no "again" pressure, only the offer.
 */
export function ReadyToReview({
  dashboard,
  headingLevel = 4,
}: {
  dashboard: ChildDashboard;
  headingLevel?: HeadingLevel;
}) {
  const done = dashboard.reviewable;

  return (
    <Card as="section" aria-labelledby="ready-review" elevation="soft">
      <PanelHeading id="ready-review" level={headingLevel} icon={<FlagIcon />}>
        Ready to review
      </PanelHeading>
      <Text tone="secondary" size="sm" className="mt-2 max-w-prose">
        Lessons your child has been through once. Going back is always welcome —
        revisiting never costs progress, and a second look often lands
        differently.
      </Text>

      {done.length === 0 ? (
        <Text tone="secondary" className="mt-4">
          Nothing to revisit yet — this fills in as lessons are practised.
        </Text>
      ) : (
        <ul className="mt-4 grid gap-3">
          {done.map(({ module, entry }) => (
            <li
              key={`${module.id}-${entry.order}`}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <span className="min-w-0">
                <span className="block font-semibold">{entry.title}</span>
                <span className="block text-sm text-text-secondary">
                  {module.title}
                </span>
              </span>
              <span className="rounded-md bg-surface-muted px-3 py-1 text-sm font-semibold text-text-secondary">
                {practiceStatusLabels.practised}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function NothingYet({ nickname }: { nickname: string }) {
  return (
    <EmptyState
      icon={<SparkIcon />}
      headingLevel={3}
      title={`${nickname} has not started a lesson yet`}
      description="Once a lesson is opened, this is where you will see what was practised, the mission to try together, and something to talk about."
      action={<ButtonLink href="/learn">Open the learning area</ButtonLink>}
    />
  );
}
