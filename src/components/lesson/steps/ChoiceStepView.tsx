import { ChoiceCard, ChoiceList } from "@/components/ui/ChoiceCard";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { StoryPanel } from "@/components/ui/StoryPanel";
import {
  Heading,
  nextHeadingLevel,
  Text,
  type HeadingLevel,
} from "@/components/ui/Typography";
import { feedbackToneForConsequence } from "../consequenceTone";
import { SceneIllustration } from "../illustrations";
import type { ChoiceScene } from "@/features/lessons/steps";

/**
 * The decision, and what follows from it.
 *
 * Feedback appears in place as soon as a choice is made, and the choices stay
 * on screen and stay selectable. A child may try another one and read what
 * happens instead — that is the lesson working, not a mistake being corrected.
 *
 * Nothing here is scored, and nothing marks a choice right or wrong.
 */

export type ChoiceStepViewProps = {
  scene: ChoiceScene;
  selectedChoiceId: string | undefined;
  onChoose: (choiceId: string) => void;
  /**
   * The scene title's level. Defaults to the `h2` a lesson page wants; the
   * marketing sample nests this inside a section and passes something deeper.
   */
  headingLevel?: HeadingLevel;
};

export function ChoiceStepView({
  scene,
  selectedChoiceId,
  onChoose,
  headingLevel = 2,
}: ChoiceStepViewProps) {
  const selected = scene.choices.find(
    (choice) => choice.id === selectedChoiceId,
  );
  // Validation guarantees a prompt wherever there are choices; the fallback is
  // here so a content mistake degrades instead of rendering a blank heading.
  const prompt = scene.prompt ?? scene.title;

  return (
    <StoryPanel
      title={scene.title}
      narration={scene.narration}
      headingLevel={headingLevel}
      illustration={
        <SceneIllustration
          illustrationKey={scene.illustrationKey}
          className="h-auto w-full"
        />
      }
    >
      <Heading level={nextHeadingLevel(headingLevel)}>{prompt}</Heading>

      <ChoiceList label={prompt} className="mt-4">
        {scene.choices.map((choice) => (
          <ChoiceCard
            key={choice.id}
            label={choice.text}
            selected={choice.id === selectedChoiceId}
            onClick={() => onChoose(choice.id)}
          />
        ))}
      </ChoiceList>

      {selected ? (
        <InlineFeedback
          className="mt-6"
          tone={feedbackToneForConsequence[selected.consequenceType]}
        >
          {selected.response}
        </InlineFeedback>
      ) : (
        <Text tone="secondary" className="mt-6">
          Pick one to see what might happen next. You can try another
          afterwards.
        </Text>
      )}
    </StoryPanel>
  );
}
