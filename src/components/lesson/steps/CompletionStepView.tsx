import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MissionCard } from "@/components/ui/MissionCard";
import { Heading, Text } from "@/components/ui/Typography";
import { modulePathHref } from "@/content/worlds";
import type { Lesson } from "@/features/curriculum/schema";
import type { LessonRunState } from "@/features/lessons/lessonMachine";
import { GlimBubble } from "@/components/character/GlimBubble";
import { CelebrationBurst } from "../CelebrationBurst";

/**
 * The end of the lesson.
 *
 * Warm, and quiet. The celebration is a single gentle emission of the module
 * motif — no points, no streak, no confetti rain, no score
 * (docs/design/COMPONENT_STATES.md §12, MOTION.md; CLAUDE.md principle 5). It
 * stays inside the design's hard limits and, under reduced motion, is just a
 * still badge and the progress change; finishing a lesson about kindness should
 * not look like a slot machine.
 *
 * The recap shows what the child chose, without ranking it. It exists so the
 * conversation afterwards has something concrete to start from, and so a
 * parent arriving late can see what happened.
 *
 * The mission is repeated here because this is the screen a child is most
 * likely to be looking at when they get up and walk away.
 */

export type CompletionStepViewProps = {
  lesson: Lesson;
  state: LessonRunState;
  onRestart: () => void;
};

export function CompletionStepView({
  lesson,
  state,
  onRestart,
}: CompletionStepViewProps) {
  const decisions = lesson.scenes.flatMap((scene) => {
    const chosenId = state.choiceBySceneId[scene.id];
    const chosen = scene.choices?.find((choice) => choice.id === chosenId);
    if (chosen === undefined) return [];
    return [
      {
        sceneId: scene.id,
        question: scene.prompt ?? scene.title,
        answer: chosen.text,
      },
    ];
  });

  const practised = lesson.practice.options.find(
    (option) => option.id === state.practiceOptionId,
  );

  return (
    <section>
      <div className="flex flex-col items-center text-center">
        <GlimBubble state="celebrate_small" />
        <CelebrationBurst moduleId={lesson.moduleId} className="mt-2" />
        <Heading level={2} size="xl" className="mt-4">
          {lesson.completion.title}
        </Heading>
        <Text size="lg" className="mt-3 max-w-prose">
          {lesson.completion.message}
        </Text>
      </div>

      {decisions.length > 0 || practised !== undefined ? (
        <Card elevation="soft" className="mt-8">
          <Heading level={3} size="sm">
            What you chose
          </Heading>
          <dl className="mt-4 grid gap-4">
            {decisions.map((decision) => (
              <div key={decision.sceneId}>
                <dt className="text-text-secondary">{decision.question}</dt>
                <dd className="mt-1 font-semibold">{decision.answer}</dd>
              </div>
            ))}
            {practised ? (
              <div>
                <dt className="text-text-secondary">What you practised</dt>
                <dd className="mt-1 font-semibold">{practised.text}</dd>
              </div>
            ) : null}
          </dl>
        </Card>
      ) : null}

      <MissionCard
        className="mt-6"
        status="suggested"
        title="Don’t forget your mission"
        headingLevel={3}
        description={lesson.offlineMission.childPrompt}
      />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink
          href={modulePathHref(lesson.moduleId)}
          variant="primary"
          size="lg"
        >
          Back to the lessons
        </ButtonLink>
        <Button variant="secondary" size="lg" onClick={onRestart}>
          Start this lesson again
        </Button>
      </div>
    </section>
  );
}
