import type { Metadata } from "next";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { Card } from "@/components/ui/Card";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { pageMetadata } from "@/lib/seo";

/**
 * The pricing placeholder.
 *
 * Deliberately carries no numbers. Quoting a figure we have not decided would
 * be an unsupported claim, and a "from £X" that later moves is a dark pattern
 * whether or not it was meant as one (`prompts/07-marketing-site.md`).
 *
 * What it does describe is the shape we intend — one family subscription, from
 * docs/PRODUCT_BRIEF.md — stated as an intention rather than an offer. It also
 * commits to what the price will never be funded by, which is the part a parent
 * of a young child is actually asking about.
 */

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Little Learner's Club is in private beta and pricing is not set. The plan is one family subscription covering the whole household, with a free trial and no advertising. Founding families will hear before anything is charged.",
  path: "/pricing",
});

const intentions = [
  {
    title: "One subscription per family",
    body: "Not per child. A household with three children should not pay three times to teach them the same things.",
  },
  {
    title: "A free trial first",
    body: "Long enough to actually finish some lessons together and find out whether it fits your family, rather than long enough to forget you started.",
  },
  {
    title: "Cancel without a conversation",
    body: "Cancelling should take about as long as subscribing did, from the same place, with no retention flow in the way.",
  },
  {
    title: "Never funded by advertising",
    body: "The subscription is the business model. That is the whole reason there is no advertising to your child and no sale of personal information — those are the alternatives we ruled out.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section aria-labelledby="pricing-hero-heading">
        <PageContainer>
          <div className="max-w-2xl">
            <Heading level={1} size="display" id="pricing-hero-heading">
              We have not set a price yet
            </Heading>
            <Text size="lg" tone="secondary" className="mt-6">
              Little Learner&apos;s Club is in private beta. Nothing is for
              sale, nothing can be bought, and we would rather say that plainly
              than put a number on this page that we might change.
            </Text>
          </div>
        </PageContainer>
      </section>

      <MarketingSection
        headingId="pricing-status-heading"
        tone="muted"
        title="What is true today"
        width="narrow"
      >
        <div className="mt-8 grid gap-4">
          <InlineFeedback tone="neutral" title="No prices, no tiers, no offers">
            There is no free plan, no paid plan, and no founding-member
            discount, because none of those has been decided. Anything you read
            elsewhere quoting a Little Learner&apos;s Club price did not come
            from us.
          </InlineFeedback>
          <InlineFeedback tone="neutral" title="Nothing is charged in the beta">
            Founding families take part at no cost. If and when a subscription
            begins, we will say so first — joining the waitlist does not create
            a payment method or an obligation.
          </InlineFeedback>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="pricing-intentions-heading"
        title="What we intend, once there is something to buy"
        lead="Intentions, not commitments — but the kind we would want to be held to."
      >
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {intentions.map((intention) => (
            <Card as="li" key={intention.title}>
              <Heading level={3} size="sm">
                {intention.title}
              </Heading>
              <Text tone="secondary" className="mt-2">
                {intention.body}
              </Text>
            </Card>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        headingId="pricing-waitlist-heading"
        tone="sand"
        width="narrow"
        title="Hear it first"
        lead="Founding families on the waitlist find out what Little Learner's Club costs before anybody else, and before anything is ever charged."
      >
        <WaitlistForm className="mt-8" submitLabel="Keep me posted" />
      </MarketingSection>
    </>
  );
}
