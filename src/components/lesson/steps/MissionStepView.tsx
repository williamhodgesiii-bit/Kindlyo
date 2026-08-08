import { MissionCard } from "@/components/ui/MissionCard";
import { ParentInsightCard } from "@/components/ui/ParentInsightCard";
import { Heading, Text } from "@/components/ui/Typography";
import type { OfflineMission } from "@/features/curriculum/schema";
import { MissionScene } from "../MissionScene";

/**
 * The offline mission — the part of the lesson that happens away from us.
 *
 * Every lesson connects to an offline behaviour (CLAUDE.md, principle 7), so
 * this step is not optional decoration at the end of a lesson; it is the
 * point of one.
 *
 * The screen reads as three plain beats, sequenced by audience and by time so
 * a child's working memory only ever holds the part meant for them
 * (coherence + signalling, Mayer): first the one thing to try, on its own, as
 * a low-text invitation with a decorative "out into the world" scene; then a
 * grown-up note on how to help; then, last, a thing to talk about together
 * *afterwards*. The conversation question used to sit inside the child's card
 * as "Afterwards: …"; it lives in the grown-up region now, because to a young
 * child a prominent "what happened?" reads as a quiz to pass rather than a
 * chat to have.
 *
 * There is nothing to tick off here, and there is no control that lets a child
 * mark their own mission done — marking a mission done is a conversation
 * between a parent and a child, and it lives in the parent area (decisions 023,
 * 029). A button that let a child log their own homework would teach the wrong
 * thing, and turning a small kindness into a task to complete for a reward is
 * exactly the framing this product avoids (principle 5). So the step carries no
 * status tick, no reward, and no tappable target at all.
 */
export function MissionStepView({ mission }: { mission: OfflineMission }) {
  return (
    <section className="llc-mission-enter">
      <Heading level={2}>Your mission away from the screen</Heading>
      <Text tone="secondary" className="mt-3 max-w-prose">
        One small thing to try before the next lesson.
      </Text>

      {/* Beat 1 — the one thing, child-facing, on its own. The decorative
          scene anchors the child's invitation, not the grown-up notes below. */}
      <MissionCard
        className="mt-6"
        status="suggested"
        title="Try this"
        headingLevel={3}
        description={
          <>
            <MissionScene className="mb-4 max-w-md" />
            <span className="block text-lg text-text-primary">
              {mission.childPrompt}
            </span>
          </>
        }
      />

      {/* Beat 2 — for the grown-up: how to help set it up. */}
      <ParentInsightCard
        className="mt-6"
        headingLevel={3}
        title="How to help"
        body={mission.parentPrompt}
      />

      {/* Beat 3 — for the grown-up, and for later: a thing to talk about once
          the mission has actually happened. Framed as a shared conversation,
          never a checkpoint the child has to answer. */}
      <ParentInsightCard
        className="mt-4"
        headingLevel={3}
        eyebrow="Afterwards, together"
        title="Something to talk about"
        body={mission.completionQuestion}
      />
    </section>
  );
}
