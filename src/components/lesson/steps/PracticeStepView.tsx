import { ChoiceCard, ChoiceList } from "@/components/ui/ChoiceCard";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { Heading, Text } from "@/components/ui/Typography";
import type { LessonPractice } from "@/features/curriculum/schema";

/**
 * The rehearsal.
 *
 * Every option is a real option. There is no scoring here and no "best" way to
 * greet somebody, so each one answers with encouragement written for that
 * choice — which is also why the encouragement lives in the content rather
 * than being generated from a template.
 */

export type PracticeStepViewProps = {
  practice: LessonPractice;
  selectedOptionId: string | null;
  onPractise: (optionId: string) => void;
};

export function PracticeStepView({
  practice,
  selectedOptionId,
  onPractise,
}: PracticeStepViewProps) {
  const selected = practice.options.find(
    (option) => option.id === selectedOptionId,
  );

  return (
    <section>
      <Heading level={2}>{practice.prompt}</Heading>
      {practice.helperText ? (
        <Text tone="secondary" className="mt-3 max-w-prose">
          {practice.helperText}
        </Text>
      ) : null}

      <ChoiceList label={practice.prompt} className="mt-6">
        {practice.options.map((option, index) => (
          <ChoiceCard
            key={option.id}
            label={option.text}
            selected={option.id === selectedOptionId}
            onClick={() => onPractise(option.id)}
            className="llc-card-enter"
            style={{ "--llc-enter-index": index } as React.CSSProperties}
          />
        ))}
      </ChoiceList>

      {selected ? (
        <>
          <InlineFeedback
            key={selected.id}
            className="mt-6 llc-reaction-enter"
            tone="helpful"
            title="Nice practice"
          >
            {selected.encouragement}
          </InlineFeedback>
          <Text className="mt-4 max-w-prose">{practice.closing}</Text>
        </>
      ) : null}
    </section>
  );
}
