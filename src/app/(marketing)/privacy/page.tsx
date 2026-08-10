import type { Metadata } from "next";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { ButtonLink } from "@/components/ui/Button";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { pageMetadata } from "@/lib/seo";

/**
 * The privacy policy placeholder.
 *
 * Deliberately not a policy. Pasting a generic children's privacy notice here
 * would be worse than an honest placeholder: it would describe processing that
 * does not happen, name rights against a company structure that does not exist
 * yet, and imply a legal review that has not taken place
 * (docs/PRIVACY_AND_SAFETY.md, "Legal note").
 *
 * `/safety` is the page that actually explains our data posture, and it is
 * accurate. This page's job is to say what is missing and why.
 */

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "The Little Learner's Club formal privacy policy is being prepared and will be published before the product opens to the public. Our current data practices are described in plain language on the safety and privacy page.",
  path: "/privacy",
});

const willCover = [
  "What personal information is collected, from whom, and why",
  "The legal bases for processing, where they apply",
  "How long each kind of record is kept",
  "Which processors handle data on our behalf",
  "How to access, correct, export, or delete your family's data",
  "How verifiable parental consent is obtained",
  "How to contact us or complain, and to which supervisory authority",
];

export default function PrivacyPage() {
  return (
    <>
      <section aria-labelledby="privacy-hero-heading">
        <PageContainer width="narrow">
          <Heading level={1} size="display" id="privacy-hero-heading">
            Privacy policy
          </Heading>
          <Text size="lg" tone="secondary" className="mt-6">
            This is a placeholder, not a policy. Little Learner&apos;s Club is
            in private beta and the formal privacy notice has not been written
            or reviewed yet.
          </Text>

          <InlineFeedback
            tone="neutral"
            title="Not a legal document"
            className="mt-8"
          >
            Nothing on this page is a privacy notice, a contract, or legal
            advice. When a real policy exists it will replace this page, and it
            will be published before Little Learner&apos;s Club is open to the
            public or holds any family&rsquo;s data on a server.
          </InlineFeedback>
        </PageContainer>
      </section>

      <MarketingSection
        headingId="privacy-today-heading"
        tone="muted"
        title="What happens to data today"
        lead="Short, because there is very little of it."
        width="narrow"
      >
        <div className="mt-8 grid gap-4">
          <InlineFeedback
            tone="neutral"
            title="The preview stays in your browser"
          >
            The learning and parent areas on this site have no account behind
            them. Child profiles and lesson progress are stored in your own
            browser&rsquo;s local storage on this device, and are not sent
            anywhere. Clearing your browser data deletes them.
          </InlineFeedback>
          <InlineFeedback tone="neutral" title="The waitlist stores one thing">
            If you join the waitlist we record the email address you typed, an
            optional age band, and when you submitted it — so we can contact you
            about beta access. Nothing else about you or your child is
            collected, and it is never sold.
          </InlineFeedback>
          <InlineFeedback tone="neutral" title="No tracking on this site">
            This site sets no advertising cookies, loads no third-party
            advertising or analytics scripts, and does not build a profile of
            you across other sites.
          </InlineFeedback>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="privacy-future-heading"
        title="What the published policy will cover"
        lead="Written and reviewed by qualified counsel before the product opens, not by us in a hurry."
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
          <ButtonLink href="/safety" variant="secondary">
            How safety and privacy work today
          </ButtonLink>
        </div>
      </MarketingSection>
    </>
  );
}
