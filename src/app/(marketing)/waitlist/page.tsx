import type { Metadata } from "next";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { pageMetadata } from "@/lib/seo";

/**
 * The founding-family waitlist.
 *
 * One field, one button, and a plain account of what happens to the address.
 * No countdown, no place-in-queue number, no "17 families joined today" — the
 * numbers would be invented and the urgency manufactured
 * (`prompts/07-marketing-site.md`, no dark patterns).
 */

export const metadata: Metadata = pageMetadata({
  title: "Join the waitlist",
  description:
    "Little Learner's Club is in private beta. Leave an email address to hear when founding-family places open. One field, no payment details, and no newsletter.",
  path: "/waitlist",
});

const expectations = [
  {
    title: "We write when places open",
    body: "Beta groups are small so we can talk to every family in them. That means waiting, and it means we will not pretend a place is available when it is not.",
  },
  {
    title: "Nothing is charged",
    body: "There is no payment step, no card details, and no price. Founding families take part at no cost, and pricing does not exist yet.",
  },
  {
    title: "No newsletter",
    body: "Your address is used to tell you about beta access. It is not added to a mailing list, not shared, and not sold.",
  },
];

export default function WaitlistPage() {
  return (
    <>
      <section aria-labelledby="waitlist-hero-heading">
        <PageContainer width="narrow">
          <Heading level={1} size="display" id="waitlist-hero-heading">
            Be a founding family
          </Heading>
          <Text size="lg" tone="secondary" className="mt-6">
            Little Learner&apos;s Club is in private beta and not yet open to
            the public. Leave an email address and we will let you know when the
            next group of founding families opens.
          </Text>

          <Card elevation="soft" className="mt-8">
            <WaitlistForm />
          </Card>
        </PageContainer>
      </section>

      <MarketingSection
        headingId="waitlist-expectations-heading"
        tone="muted"
        title="What joining does and does not mean"
        width="narrow"
      >
        <ul className="mt-8 grid gap-4">
          {expectations.map((expectation) => (
            <Card as="li" key={expectation.title}>
              <Heading level={3} size="sm">
                {expectation.title}
              </Heading>
              <Text tone="secondary" className="mt-2">
                {expectation.body}
              </Text>
            </Card>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        headingId="waitlist-meanwhile-heading"
        title="While you wait"
        lead="You do not need an account, or a place in the beta, to see what Little Learner's Club actually is."
        width="narrow"
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/#sample-heading" variant="secondary">
            Play a sample scenario
          </ButtonLink>
          <ButtonLink href="/curriculum" variant="secondary">
            Read the curriculum
          </ButtonLink>
          <ButtonLink href="/safety" variant="secondary">
            Read safety and privacy
          </ButtonLink>
        </div>
      </MarketingSection>
    </>
  );
}
