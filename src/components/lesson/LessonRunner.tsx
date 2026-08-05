"use client";

import { LessonShell } from "@/components/shells/LessonShell";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ContentStatusBadge } from "@/components/ui/ContentStatusBadge";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heading, Text } from "@/components/ui/Typography";
import type { Lesson } from "@/features/curriculum/schema";
import { useLessonRun, type LessonRun } from "@/features/lessons/useLessonRun";
import { useModulePath } from "@/features/lessons/useModulePath";
import { useFamily } from "@/features/profiles/useFamily";
import { ChoiceStepView } from "./steps/ChoiceStepView";
import { CoachingStepView } from "./steps/CoachingStepView";
import { CompletionStepView } from "./steps/CompletionStepView";
import { MissionStepView } from "./steps/MissionStepView";
import { PracticeStepView } from "./steps/PracticeStepView";
import { PrincipleStepView } from "./steps/PrincipleStepView";
import { SceneStepView } from "./steps/SceneStepView";

/**
 * The lesson renderer.
 *
 * Reusable across every lesson. It is handed a `Lesson` and switches on the
 * *kind* of step, never on which lesson or which scene it happens to be —
 * there is no `if (lesson.slug === …)` here and there must not be
 * (docs/CONTENT_SCHEMA.md, "Rules"). Adding lesson two means authoring
 * content, not editing this file.
 *
 * Progression rules live in the reducer behind `useLessonRun`, so this
 * component only decides what to draw.
 */

function StepView({ run }: { run: LessonRun }) {
  const { step } = run;

  switch (step.kind) {
    case "scene":
      return <SceneStepView scene={step.scene} />;
    case "choice":
      return (
        <ChoiceStepView
          scene={step.scene}
          selectedChoiceId={run.selectedChoiceId}
          onChoose={run.choose}
        />
      );
    case "principle":
      return <PrincipleStepView principle={step.principle} />;
    case "practice":
      return (
        <PracticeStepView
          practice={step.practice}
          selectedOptionId={run.state.practiceOptionId}
          onPractise={run.practise}
        />
      );
    case "mission":
      return <MissionStepView mission={step.mission} />;
    case "coaching":
      return <CoachingStepView coaching={step.coaching} />;
    case "completion":
      return (
        <CompletionStepView
          lesson={run.lesson}
          state={run.state}
          onRestart={run.restart}
        />
      );
  }
}

/** Why "Next" is unavailable, said kindly rather than as an error. */
function waitingHint(run: LessonRun): string | null {
  if (run.canAdvance) return null;
  if (run.step.kind === "choice") return "Choose one to carry on.";
  if (run.step.kind === "practice") return "Pick the one you would use.";
  return null;
}

function LoadingLesson() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <Skeleton variant="block" loadingLabel="Loading your lesson" />
      <Skeleton variant="text" lines={3} className="mt-6" />
    </div>
  );
}

/** A calm full-page notice with one way onward. Not an error state. */
function LessonNotice({
  title,
  message,
  actionLabel,
}: {
  title: string;
  message: string;
  actionLabel: string;
}) {
  return (
    <PageContainer width="narrow">
      <Heading level={1} size="lg">
        {title}
      </Heading>
      <Text size="lg" className="mt-4 max-w-prose">
        {message}
      </Text>
      <div className="mt-8">
        <ButtonLink href="/learn" size="lg">
          {actionLabel}
        </ButtonLink>
      </div>
    </PageContainer>
  );
}

/**
 * The gate in front of a lesson: who is learning, and is this lesson open for
 * them yet? Both answers come from the server, so they are only knowable after
 * the family and this child's progress have loaded — until then, the same
 * skeleton the lesson itself uses.
 */
export function LessonRunner({ lesson }: { lesson: Lesson }) {
  const family = useFamily();
  const profileId = family.selectedProfile?.id ?? null;
  const path = useModulePath(profileId);

  if (!family.hydrated) return <LoadingLesson />;

  if (family.selectedProfile === null) {
    return (
      <LessonNotice
        title="Who is learning?"
        message="Pick your profile first, so your progress goes to the right place."
        actionLabel="Choose a profile"
      />
    );
  }

  // Profile chosen, but its progress is still loading.
  if (path === null) return <LoadingLesson />;

  const entry = path.lessons.find(
    (pathLesson) => pathLesson.lesson?.id === lesson.id,
  );

  if (entry?.state === "locked") {
    return (
      <LessonNotice
        title="Not this one yet"
        message={`This lesson opens after lesson ${entry.order - 1}. Finish that one first, then come back — it will be waiting.`}
        actionLabel="Back to your lessons"
      />
    );
  }

  return <LessonPlayer lesson={lesson} profileId={family.selectedProfile.id} />;
}

function LessonPlayer({
  lesson,
  profileId,
}: {
  lesson: Lesson;
  profileId: string;
}) {
  const run = useLessonRun(lesson, profileId);

  // Saved progress is read after mount, so until then we do not know which
  // step to draw. Showing a placeholder beats flashing step one at a child who
  // was halfway through.
  if (!run.hydrated) return <LoadingLesson />;

  const hint = waitingHint(run);
  const isLastStep = run.step.kind === "completion";

  return (
    <LessonShell
      lessonTitle={lesson.title}
      stepKey={run.step.id}
      stepNumber={run.stepNumber}
      stepCount={run.stepCount}
      status={<ContentStatusBadge status={lesson.status} />}
      footer={
        isLastStep ? null : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button
              variant="quiet"
              onClick={run.back}
              disabled={!run.canGoBack}
            >
              Back
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              {hint ? (
                <Text tone="secondary" size="sm">
                  {hint}
                </Text>
              ) : null}
              <Button size="lg" onClick={run.next} disabled={!run.canAdvance}>
                Next
              </Button>
            </div>
          </div>
        )
      }
    >
      <StepView run={run} />
    </LessonShell>
  );
}
