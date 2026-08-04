import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SparkIcon } from "@/components/ui/icons";
import { MissionCard } from "@/components/ui/MissionCard";
import { Heading, Text } from "@/components/ui/Typography";
import type { Lesson } from "@/features/curriculum/schema";
import type { LessonRunState } from "@/features/lessons/lessonMachine";

/**
 * The end of the lesson.
 *
 * Warm, and quiet. No points, no streak, no confetti, no score
 * (docs/DESIGN_SYSTEM.md; CLAUDE.md principle 5) — the reward for finishing a
 * lesson about kindness should not look like a slot machine.
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
      <span
        aria-hidden="true"
        className="inline-flex text-brand-primary-strong"
      >
        <SparkIcon className="h-8 w-8" />
      </span>
      <Heading level={2} size="xl" className="mt-2">
        {lesson.completion.title}
      </Heading>
      <Text size="lg" className="mt-3 max-w-prose">
        {lesson.completion.message}
      </Text>

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
                <dt className="text-text-secondary">The hello you practised</dt>
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

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/learn" variant="primary" size="lg">
          Back to the lessons
        </ButtonLink>
        <Button variant="secondary" size="lg" onClick={onRestart}>
          Start this lesson again
        </Button>
      </div>
    </section>
  );
}
