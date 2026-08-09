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
 *
 * When the chosen option carries a `rehearsalCue`, we add a calm coda that
 * invites the child to try *that* action for real (the enactment beat — see
 * decision 044). It is deliberately buttonless and self-paced: a child gives
 * taps and selections only and never confirms an offline behaviour to the
 * screen (decisions 010, 023), so there is nothing here to press, nothing
 * gated behind it, and nothing stored. The warm encouragement and closing
 * still appear the instant a choice is made, exactly as before; the cue is
 * purely additive, and a lesson without one renders unchanged.
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

          {selected.rehearsalCue ? (
            <section
              // Its own quiet register — not the tinted feedback panel above,
              // not a choice card. Nothing to press: the invitation is the whole
              // of it, and the child moves on with the footer whenever ready.
              key={`${selected.id}-cue`}
              aria-labelledby="practice-rehearsal-heading"
              className="mt-6 llc-reaction-enter rounded-lg border border-border bg-surface-muted p-4"
            >
              <Heading
                level={3}
                size="sm"
                id="practice-rehearsal-heading"
                className="text-text-secondary"
              >
                Your turn — whenever you are ready
              </Heading>
              <Text className="mt-2 max-w-prose">{selected.rehearsalCue}</Text>
            </section>
          ) : null}

          <Text className="mt-4 max-w-prose">{practice.closing}</Text>
        </>
      ) : null}
    </section>
  );
}
