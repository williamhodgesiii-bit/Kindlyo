import type { Metadata } from "next";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { ButtonLink } from "@/components/ui/Button";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { pageMetadata } from "@/lib/seo";

/**
 * The terms of use placeholder.
 *
 * The same reasoning as `/privacy`: generic boilerplate would assert a
 * contract, a governing law, and a limitation of liability that nobody has
 * reviewed, which is worse than admitting there is not one yet.
 *
 * The one thing this page does state substantively is the disclaimer that
 * CLAUDE.md requires — Little Learner's Club is not professional advice and the
 * curriculum has not been reviewed by specialists.
 */

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description:
    "The Little Learner's Club terms of use are being prepared and will be published before the product opens to the public. Little Learner's Club is not a substitute for professional educational, psychological, or clinical advice.",
  path: "/terms",
});

const willCover = [
  "Who may hold an account, and the responsibilities that come with it",
  "Acceptable use of the service",
  "Subscription terms, renewal, and cancellation, once there is a subscription",
  "Ownership of the curriculum and what you may do with it",
  "Limitations of liability and the governing law",
  "How the terms may change, and how you will be told",
];

export default function TermsPage() {
  return (
    <>
      <section aria-labelledby="terms-hero-heading">
        <PageContainer width="narrow">
          <Heading level={1} size="display" id="terms-hero-heading">
            Terms of use
          </Heading>
          <Text size="lg" tone="secondary" className="mt-6">
            This is a placeholder. Little Learner&apos;s Club is in private
            beta, nothing is for sale, and the formal terms have not been
            written or reviewed yet.
          </Text>

          <InlineFeedback
            tone="neutral"
            title="Not a contract"
            className="mt-8"
          >
            Nothing on this page forms an agreement or constitutes legal advice.
            Real terms will be published before Little Learner&apos;s Club is
            open to the public or takes payment from anybody.
          </InlineFeedback>
        </PageContainer>
      </section>

      <MarketingSection
        headingId="terms-disclaimer-heading"
        tone="muted"
        title="What we will say now, because it matters"
        width="narrow"
      >
        <div className="mt-8 grid gap-4">
          <InlineFeedback tone="neutral" title="Not professional advice">
            Little Learner&apos;s Club is a learning product for families. It is
            not education, psychological, therapeutic, or clinical advice, and
            it is not a substitute for support from a qualified professional. If
            you have concerns about your child&rsquo;s development or wellbeing,
            please speak to someone qualified to help.
          </InlineFeedback>
          <InlineFeedback tone="neutral" title="Draft curriculum">
            All lesson content currently in Little Learner&apos;s Club is draft.
            It has not been reviewed by educators, psychologists, or clinicians,
            and we do not describe it as validated, evidence-based, or
            expert-approved.
          </InlineFeedback>
          <InlineFeedback
            tone="neutral"
            title="A preview, not a finished product"
          >
            The learning and parent areas on this site are an early preview.
            They store data in your browser, they may change or break, and
            nothing you do in them should be treated as permanent.
          </InlineFeedback>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="terms-future-heading"
        title="What the published terms will cover"
        width="narrow"
      >
        <ul className="mt-8 grid gap-3">
          {willCover.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-secondary"
              />
              <Text as="span" className="max-w-prose">
                {item}
              </Text>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <ButtonLink href="/privacy" variant="secondary">
            Privacy policy
          </ButtonLink>
        </div>
      </MarketingSection>
    </>
  );
}
