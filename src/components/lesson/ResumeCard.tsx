import { GlimBubble } from "@/components/character/GlimBubble";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

/**
 * Coming back to a lesson already in progress (docs/design/COMPONENT_STATES.md
 * §14).
 *
 * Nothing decides for the child. Glim brightens a welcome, the saved place is
 * named in plain words ("step 3 of 7"), and two equal choices are offered:
 * "Keep going" returns to the saved step, "Start over" begins again with the
 * answers cleared. A stale or older-version run never reaches here — it simply
 * starts fresh, with no scary message.
 */

export type ResumeCardProps = {
  lessonTitle: string;
  /** 1-based saved position, for display. */
  stepNumber: number;
  stepCount: number;
  onKeepGoing: () => void;
  onStartOver: () => void;
};

export function ResumeCard({
  lessonTitle,
  stepNumber,
  stepCount,
  onKeepGoing,
  onStartOver,
}: ResumeCardProps) {
  return (
    <PageContainer width="narrow">
      <div className="llc-card-enter flex flex-col items-center gap-4 text-center">
        <GlimBubble state="glow_notice" />
        <Heading level={1} size="lg">
          Welcome back
        </Heading>
        <Text size="lg" className="max-w-prose">
          You were partway through “{lessonTitle}” — on step {stepNumber} of{" "}
          {stepCount}. Would you like to keep going, or start it again from the
          beginning?
        </Text>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={onKeepGoing}>
            Keep going
          </Button>
          <Button variant="secondary" size="lg" onClick={onStartOver}>
            Start over
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
