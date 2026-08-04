import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

/**
 * Public marketing route.
 *
 * Copy is intentionally modest: we describe what the product does without
 * implying expert validation that has not happened.
 */

const steps = [
  {
    title: "A short story",
    body: "Your child meets a familiar everyday situation.",
  },
  {
    title: "A choice to make",
    body: "They decide what to do and see how it might land for the other person.",
  },
  {
    title: "A real-world mission",
    body: "You get one small thing to try together offline.",
  },
] as const;

export default function HomePage() {
  return (
    <PageContainer>
      <section className="max-w-2xl">
        <Heading level={1} size="display">
          Everyday kindness, practiced together
        </Heading>
        <Text size="lg" tone="secondary" className="mt-6">
          Kindlyo helps children ages 5 to 9 build social confidence through
          short, story-based lessons and real-world missions they can try
          offline with you.
        </Text>
        <Text size="lg" tone="secondary" className="mt-4">
          Parents hold the account. Children learn alongside you, with no ads,
          no public profiles, and no messaging.
        </Text>

        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/learn" size="lg">
            Preview the learning area
          </ButtonLink>
          <ButtonLink href="/parent" variant="secondary" size="lg">
            For parents
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="how-it-works" className="mt-16">
        <Heading level={2} id="how-it-works">
          How a lesson works
        </Heading>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Card as="li" key={step.title}>
              <p className="text-sm font-semibold text-brand-secondary-strong">
                Step {index + 1}
              </p>
              <Heading level={3} size="sm" className="mt-2">
                {step.title}
              </Heading>
              <Text tone="secondary" className="mt-2">
                {step.body}
              </Text>
            </Card>
          ))}
        </ol>
      </section>
    </PageContainer>
  );
}
