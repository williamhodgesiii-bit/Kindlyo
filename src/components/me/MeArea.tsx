"use client";

import { GlimBubble } from "@/components/character/GlimBubble";
import { MotifShape } from "@/components/lesson/motifs";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PersonIcon } from "@/components/ui/icons";
import { MissionCard } from "@/components/ui/MissionCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heading, Text } from "@/components/ui/Typography";
import { getWorldByModuleId } from "@/content/worlds";
import type { WorldLesson } from "@/features/lessons/childDashboard";
import { useChildDashboard } from "@/features/lessons/useChildDashboard";
import { useFamily } from "@/features/profiles/useFamily";

/**
 * "Me" — the child's own space, and a keepsake of what they have practised.
 *
 * This is deliberately NOT the parent dashboard, even though both read the same
 * `useChildDashboard` data. The parent screen answers "how is my child doing?";
 * this one answers, for the child, "what have I grown, and what could I do
 * next?" — warmly, with almost no reading required, and with no way to read a
 * score into it.
 *
 * The guardrails are the whole point, so they are stated here and enforced by
 * tests:
 *
 *  - The garden is *additive only*. Every practised lesson adds a flower; a
 *    flower never wilts, and nothing here shows a total, a fraction, an
 *    "X of Y", or a bar filling toward a maximum. There is nowhere for "how
 *    much is still empty" to appear (child-learning-researcher: streak-guilt
 *    and loss-aversion; safety-skeptic: denominators read as a score).
 *  - No recency. `lastActiveAt` is never shown: a child returning after two
 *    weeks sees the same warm garden as one returning after a day.
 *  - No `talkingPoints`. Replaying a child's own "it depends" choices back to
 *    them reads as "here is the thing you got wrong"; that stays on the parent
 *    screen only.
 *  - No re-celebration. The lesson-completion burst already happened once, when
 *    it was earned; this page is a rest surface, not a second reward.
 *  - Glim is a companion here, never a judge — a resting wonder, never a
 *    verdict on the child, and its glow never tracks progress.
 *
 * It mirrors `LearningPath`'s gating exactly (loading, no profiles, no
 * selection, progress loading) so a sibling's garden can never flash on a
 * shared device during a profile switch, and so it is always unambiguous whose
 * garden this is.
 */

/** The module motif + theme slug for one practised lesson's world. */
function bloomFor(worldLesson: WorldLesson): {
  themeId: string;
  motif: string;
} {
  const world = getWorldByModuleId(worldLesson.module.id);
  return {
    themeId: world?.id ?? worldLesson.module.id,
    motif: world?.motif ?? "default",
  };
}

/**
 * The garden: one flower per practised lesson, present and equal.
 *
 * Purely decorative (`aria-hidden`) and static — its meaning is carried by the
 * "Play again" list beside it, which names every lesson in words, so the garden
 * reads the same with motion off and to a screen reader. Colour comes from each
 * world's accent via `data-module`; nothing here depends on colour alone.
 */
function GardenBed({ blooms }: { blooms: readonly WorldLesson[] }) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface-muted p-6"
    >
      {blooms.map((worldLesson, index) => {
        const { themeId, motif } = bloomFor(worldLesson);
        // A little vertical variety so the bed reads as a garden, not a grid.
        // Static and decorative — no per-flower motion, no reveal.
        const lift =
          index % 3 === 0 ? "mb-2" : index % 3 === 1 ? "mb-0" : "mb-4";
        return (
          <span
            key={`${worldLesson.module.id}-${worldLesson.entry.order}`}
            data-module={themeId}
            className={`text-module-accent ${lift}`}
          >
            <MotifShape motif={motif} size={36} />
          </span>
        );
      })}
    </div>
  );
}

export function MeArea() {
  const family = useFamily();
  const profileId = family.selectedProfile?.id ?? null;
  const dashboard = useChildDashboard(profileId);

  // Storage not read yet.
  if (!family.hydrated) {
    return (
      <PageContainer>
        <Skeleton variant="block" loadingLabel="Loading your space" />
        <Skeleton variant="text" lines={3} className="mt-6" />
      </PageContainer>
    );
  }

  // No profiles at all — send the grown-up to set one up (same words as the
  // learning path, so the child meets one consistent message).
  if (family.profiles.length === 0) {
    return (
      <PageContainer>
        <Heading level={1}>Me</Heading>
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

  // Profiles exist, but nobody is chosen — the picker lives on the clubhouse
  // home, so point there rather than duplicating it.
  if (family.selectedProfile === null) {
    return (
      <PageContainer>
        <Heading level={1}>Me</Heading>
        <EmptyState
          className="mt-8"
          icon={<PersonIcon />}
          title="First, pick who is learning"
          description="Choose your name, then your garden will show up here."
          action={
            <ButtonLink href="/learn" variant="secondary">
              Choose your name
            </ButtonLink>
          }
        />
      </PageContainer>
    );
  }

  const profile = family.selectedProfile;

  // A child is chosen, but their progress is still loading.
  if (dashboard === null) {
    return (
      <PageContainer>
        <Skeleton variant="block" loadingLabel="Loading your space" />
        <Skeleton variant="text" lines={3} className="mt-6" />
      </PageContainer>
    );
  }

  const greeting = (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar
        nickname={profile.nickname}
        {...(profile.avatarId ? { avatarId: profile.avatarId } : {})}
        size="lg"
        decorative
      />
      <Heading level={1} size="display">
        Hi, {profile.nickname}!
      </Heading>
    </div>
  );

  const glim = (
    <GlimBubble
      className="mt-6"
      state="wonder_tilt"
      message="I wonder what you’ll grow next?"
    />
  );

  // Nothing practised or started yet — an invitation, never "you have done
  // nothing". No metrics of any kind on this screen.
  if (dashboard.isEmpty) {
    return (
      <PageContainer>
        {greeting}
        {glim}
        <EmptyState
          className="mt-8"
          title="Your garden is ready to grow"
          description="Finish your first lesson and your first flower will bloom right here."
          action={
            <ButtonLink href="/learn" size="lg">
              Go to your lessons
            </ButtonLink>
          }
        />
      </PageContainer>
    );
  }

  const resumeLesson = dashboard.resume?.entry.lesson ?? null;
  const resumeInProgress = dashboard.resume?.entry.state === "in-progress";

  return (
    <PageContainer>
      {greeting}
      {glim}

      {/* Keep going — one open door, never a demand. */}
      <section aria-labelledby="me-next-heading" className="mt-10">
        <Heading level={2} id="me-next-heading">
          Keep going
        </Heading>
        {resumeLesson !== null ? (
          <div className="mt-4">
            <ButtonLink
              href={`/learn/lesson/${resumeLesson.slug}`}
              size="lg"
              aria-label={`${resumeInProgress ? "Keep going" : "Start"}: ${resumeLesson.title}`}
            >
              {resumeInProgress ? "Keep going" : "Start the next one"}
            </ButtonLink>
          </div>
        ) : (
          <Text className="mt-4 max-w-prose">
            You have played every lesson. Pick any flower below to play it again
            whenever you like.
          </Text>
        )}
      </section>

      {/* The current mission — a reminder only. Marking it done is a chat
          between a child and a grown-up, and it lives in the parent area. */}
      {dashboard.activeMission !== null ? (
        <section aria-labelledby="me-mission-heading" className="mt-10">
          <Heading level={2} id="me-mission-heading">
            Your mission
          </Heading>
          <Text tone="secondary" className="mt-2 max-w-prose">
            One small thing to try away from the screen.
          </Text>
          <MissionCard
            className="mt-4"
            status="suggested"
            title="Try this"
            headingLevel={3}
            description={
              dashboard.activeMission.lesson.offlineMission.childPrompt
            }
          />
        </section>
      ) : null}

      {/* The garden — what you have grown. */}
      <section aria-labelledby="me-garden-heading" className="mt-10">
        <Heading level={2} id="me-garden-heading">
          Your garden
        </Heading>

        {dashboard.reviewable.length > 0 ? (
          <>
            <Text tone="secondary" className="mt-2 max-w-prose">
              A flower for every lesson you have practised. Visit any of them
              again — it is always yours to play.
            </Text>
            <GardenBed blooms={dashboard.reviewable} />
            <ul className="mt-4 grid gap-3">
              {dashboard.reviewable.map((worldLesson) => {
                const lesson = worldLesson.entry.lesson;
                if (lesson === undefined) return null;
                return (
                  <Card as="li" key={lesson.id} padding="sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="min-w-0 flex-1 font-semibold">
                        {lesson.title}
                      </span>
                      <ButtonLink
                        href={`/learn/lesson/${lesson.slug}`}
                        variant="secondary"
                        aria-label={`Play ${lesson.title} again`}
                      >
                        Play again
                      </ButtonLink>
                    </div>
                  </Card>
                );
              })}
            </ul>
          </>
        ) : (
          // Started but nothing finished yet: a seedling, not an empty plot.
          <Text className="mt-4 max-w-prose">
            Your first flower grows when you finish a lesson. You are on your
            way.
          </Text>
        )}
      </section>
    </PageContainer>
  );
}
