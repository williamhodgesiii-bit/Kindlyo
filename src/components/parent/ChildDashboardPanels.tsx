"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { MissionCard } from "@/components/ui/MissionCard";
import { ParentInsightCard } from "@/components/ui/ParentInsightCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckIcon, CompassIcon, SparkIcon } from "@/components/ui/icons";
import { Heading, Text } from "@/components/ui/Typography";
import { meetingPeopleModule } from "@/content/modules";
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

export function ProgressOverview({ dashboard }: { dashboard: ChildDashboard }) {
  const { path, lastActiveAt } = dashboard;
  const next = path.resume;

  return (
    <Card as="section" aria-labelledby="overview" elevation="soft">
      <Heading level={4} id="overview">
        Progress
      </Heading>

      <ProgressBar
        className="mt-4 max-w-md"
        label={`${meetingPeopleModule.title} — lessons practised`}
        value={path.completedCount}
        max={path.lessonCount}
        tone="calm"
      />

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
            {next?.lesson
              ? `${next.order}. ${next.title}`
              : "Every lesson has been practised"}
          </dd>
        </div>
      </dl>

      {next?.lesson ? (
        <div className="mt-6">
          <ButtonLink href="/learn" variant="secondary">
            Open the learning area
          </ButtonLink>
        </div>
      ) : null}
    </Card>
  );
}

export function SkillAreaSummary({ dashboard }: { dashboard: ChildDashboard }) {
  return (
    <Card as="section" aria-labelledby="skill-areas" elevation="soft">
      <Heading level={4} id="skill-areas">
        Skill areas
      </Heading>
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
      <Heading level={4} id="recent">
        Recent lessons
      </Heading>

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
}: {
  dashboard: ChildDashboard;
  onToggle: (lessonId: string, done: boolean) => void;
}) {
  const mission = dashboard.activeMission;

  if (mission === null) {
    return (
      <EmptyState
        headingLevel={4}
        title="No mission yet"
        description="A mission to try together appears here once a lesson is finished."
      />
    );
  }

  return (
    <section aria-labelledby="mission">
      <Heading level={4} id="mission" className="sr-only">
        Current mission
      </Heading>
      <MissionCard
        status={mission.done ? "done" : "suggested"}
        statusLabel={mission.done ? "Done" : "Try together"}
        title={mission.lesson.title}
        headingLevel={4}
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

export function TalkingPoints({ dashboard }: { dashboard: ChildDashboard }) {
  const points = dashboard.talkingPoints;

  return (
    <ParentInsightCard
      eyebrow="Worth talking about"
      headingLevel={4}
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
