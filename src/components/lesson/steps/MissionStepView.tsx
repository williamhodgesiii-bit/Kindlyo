import { MissionCard } from "@/components/ui/MissionCard";
import { ParentInsightCard } from "@/components/ui/ParentInsightCard";
import { Heading, Text } from "@/components/ui/Typography";
import type { OfflineMission } from "@/features/curriculum/schema";

/**
 * The offline mission — the part of the lesson that happens away from us.
 *
 * Every lesson connects to an offline behaviour (CLAUDE.md, principle 7), so
 * this step is not optional decoration at the end of a lesson; it is the
 * point of one.
 *
 * There is nothing to tick off here. Marking a mission done is a conversation
 * between a parent and a child, and it arrives with the parent dashboard; a
 * button that lets a child mark their own homework would teach the wrong
 * thing.
 */
export function MissionStepView({ mission }: { mission: OfflineMission }) {
  return (
    <section>
      <Heading level={2}>Your mission away from the screen</Heading>
      <Text tone="secondary" className="mt-3 max-w-prose">
        One small thing to try before the next lesson.
      </Text>

      <MissionCard
        className="mt-6"
        status="suggested"
        title="Try this"
        headingLevel={3}
        description={
          <>
            <span className="block text-lg text-text-primary">
              {mission.childPrompt}
            </span>
            <span className="mt-3 block">
              Afterwards: {mission.completionQuestion}
            </span>
          </>
        }
      />

      <ParentInsightCard
        className="mt-6"
        headingLevel={3}
        title="How to help"
        body={mission.parentPrompt}
      />
    </section>
  );
}
