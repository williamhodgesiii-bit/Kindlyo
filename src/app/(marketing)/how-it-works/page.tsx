import type { Metadata } from "next";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { SampleScenarioSection } from "@/components/marketing/SampleScenarioSection";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { ParentInsightCard } from "@/components/ui/ParentInsightCard";
import { Heading, Text } from "@/components/ui/Typography";
import { learningLoop } from "@/content/marketing/learningLoop";
import { pageMetadata } from "@/lib/seo";

/**
 * How a lesson works, at more length than the homepage has room for.
 *
 * The step list is the same `learningLoop` array the homepage renders, which is
 * itself the order `buildLessonSteps` produces — so this page cannot describe a
 * lesson shape the engine does not build.
 */

export const metadata: Metadata = pageMetadata({
  title: "How it works",
  description:
    "A Kindlyo lesson takes about five minutes: an illustrated situation, a decision with no wrong answer, what tends to happen next, why it helps somebody else, a turn to rehearse, and one small mission to try offline.",
  path: "/how-it-works",
});

const commitments = [
  {
    title: "It stops where your child stops",
    body: "Progress is saved step by step. A lesson abandoned halfway through is waiting at the same place next time, not back at the beginning.",
  },
  {
    title: "Nothing is timed",
    body: "There is no countdown, no pressure to answer quickly, and no penalty for reading a scene four times.",
  },
  {
    title: "Trying a different answer is the point",
    body: "Choices stay selectable after your child has picked one. Reading what happens with each answer is the lesson working, not a mistake being corrected.",
  },
  {
    title: "It reads aloud well",
    body: "Text is sized for a 5-to-9-year-old sharing a screen with an adult, illustrations are decorative rather than load-bearing, and nothing is communicated by colour alone.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section aria-labelledby="how-hero-heading">
        <PageContainer>
          <div className="max-w-2xl">
            <Heading level={1} size="display" id="how-hero-heading">
              A lesson takes about five minutes
            </Heading>
            <Text size="lg" tone="secondary" className="mt-6">
              Then it asks for one small thing away from the screen, which is
              the part that actually changes anything. Here is the whole shape
              of it.
            </Text>
          </div>
        </PageContainer>
      </section>

      <MarketingSection
        headingId="how-steps-heading"
        tone="muted"
        title="The seven steps of a lesson"
        lead="Every lesson follows this order. A lesson with two decisions in it produces two decision steps; nothing else moves."
      >
        <ol className="mt-8 grid gap-4">
          {learningLoop.map((step, index) => (
            <Card as="li" key={step.id}>
              <p className="text-sm font-semibold text-brand-secondary-strong">
                Step {index + 1}
              </p>
              <Heading level={3} size="sm" className="mt-2">
                {step.title}
              </Heading>
              <Text tone="secondary" className="mt-2 max-w-prose">
                {step.body}
              </Text>
              {step.parentNote ? (
                <Text size="sm" className="mt-3 max-w-prose font-semibold">
                  For the grown-up: {step.parentNote}
                </Text>
              ) : null}
            </Card>
          ))}
        </ol>
      </MarketingSection>

      <SampleScenarioSection headingId="how-sample-heading" />

      <MarketingSection
        headingId="how-commitments-heading"
        tone="muted"
        title="Things we decided not to do"
        lead="Most of what makes a lesson calm is what is missing from it."
      >
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {commitments.map((commitment) => (
            <Card as="li" key={commitment.title}>
              <Heading level={3} size="sm">
                {commitment.title}
              </Heading>
              <Text tone="secondary" className="mt-2">
                {commitment.body}
              </Text>
            </Card>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        headingId="how-parent-heading"
        title="Where you come in"
        lead="Lightly, and at a predictable moment. Parent participation should be useful without becoming another thing to manage."
      >
        <ParentInsightCard
          className="mt-8"
          headingLevel={3}
          title="About ninety seconds per lesson"
          body="You set up the profile, you get the offline mission at the same time your child does, and afterwards you can see which areas have been practised. That is the whole ask."
          points={[
            "You hold the account. Children choose a profile inside it; they never sign in.",
            "The mission comes with one sentence on how to give your child a low-stakes chance to try it.",
            "The parent view describes what was practised, never how well your child did.",
            "If a mission does not happen, nothing chases you about it.",
          ]}
          action={
            <ButtonLink href="/for-parents" variant="secondary">
              More about the parent experience
            </ButtonLink>
          }
        />
      </MarketingSection>

      <MarketingSection
        headingId="how-cta-heading"
        tone="sand"
        width="narrow"
        title="Want to try it with your own child?"
        lead="Kindlyo is in private beta. Founding families join in small groups so we can talk to everyone who takes part."
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/waitlist" size="lg">
            Join the waitlist
          </ButtonLink>
          <ButtonLink href="/curriculum" variant="secondary" size="lg">
            See the curriculum
          </ButtonLink>
        </div>
      </MarketingSection>
    </>
  );
}
