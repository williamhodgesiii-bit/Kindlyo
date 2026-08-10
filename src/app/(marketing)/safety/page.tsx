import type { Metadata } from "next";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { pageMetadata } from "@/lib/seo";

/**
 * Safety and privacy, explained for parents.
 *
 * The plain-language explainer. `/privacy` is the legal document placeholder,
 * and the two link to each other so neither pretends to be the other.
 *
 * Everything here is drawn from docs/PRIVACY_AND_SAFETY.md and
 * docs/CURRICULUM_PRINCIPLES.md. Where a commitment is not yet implemented, the
 * page says so rather than describing an intention in the present tense.
 */

export const metadata: Metadata = pageMetadata({
  title: "Safety and privacy",
  description:
    "How Little Learner's Club protects children ages 5 to 9: no advertising, no child logins, no messaging between children, no public profiles, and the minimum data we can manage. Politeness never overrides a child's safety or consent.",
  path: "/safety",
});

const neverCollected = [
  "A child's full legal name",
  "A birth date — we store an age band instead",
  "A child's email address or password",
  "Photographs of a child",
  "Precise location",
  "Contacts or address books",
  "Voice recordings or voiceprints",
  "Face data or facial analysis",
  "Free-form text a child typed, because there is nowhere to type it",
];

const neverBuilt = [
  "Advertising of any kind, and no third-party advertising code",
  "Behavioural advertising or profiling for advertising",
  "Sale of personal information",
  "Public child profiles",
  "Messaging between children",
  "Social feeds, public leaderboards, or public achievements",
  "An AI chat companion for children",
];

const safetyRules = [
  "A child may say no, and may refuse to be touched — including hugs and handshakes.",
  "A child may leave a situation that feels unsafe, without being polite about it first.",
  "A child may interrupt in an emergency.",
  "A child may ask for help, and may tell a trusted adult.",
  "No lesson asks for eye contact, speech, or physical contact as the price of being kind.",
];

export default function SafetyPage() {
  return (
    <>
      <section aria-labelledby="safety-hero-heading">
        <PageContainer>
          <div className="max-w-2xl">
            <Heading level={1} size="display" id="safety-hero-heading">
              Safety and privacy
            </Heading>
            <Text size="lg" tone="secondary" className="mt-6">
              Little Learner&apos;s Club is used by children, so the interesting
              question is not what we protect but what we decided never to hold
              or build in the first place. Most of this page is a list of
              absences.
            </Text>
          </div>
        </PageContainer>
      </section>

      <MarketingSection
        headingId="safety-priority-heading"
        tone="muted"
        title="Politeness never outranks safety"
        lead="This is the line we care most about getting right, so it is stated inside the lessons themselves and not only here."
      >
        <ul className="mt-8 grid gap-3">
          {safetyRules.map((rule) => (
            <li key={rule} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-secondary"
              />
              <Text as="span" className="max-w-prose">
                {rule}
              </Text>
            </li>
          ))}
        </ul>
        <Text tone="secondary" className="mt-6 max-w-prose">
          A social-skills product that taught children to stay polite through
          something that frightened them would be worse than no product at all.
          Every lesson carries its own safety notes for exactly this reason.
        </Text>
      </MarketingSection>

      <MarketingSection
        headingId="safety-account-heading"
        title="Who has an account"
        lead="One answer: the parent or guardian. Children are not users of Little Learner's Club in the account sense, and cannot be."
      >
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <Heading level={3} size="sm">
              No child credentials
            </Heading>
            <Text tone="secondary" className="mt-2">
              Children have no email address, no password, and no login of their
              own. A child profile is chosen from inside the grown-up&rsquo;s
              account, on a device the grown-up already controls.
            </Text>
          </Card>
          <Card>
            <Heading level={3} size="sm">
              The minimum, and no more
            </Heading>
            <Text tone="secondary" className="mt-2">
              A child profile holds a nickname, an age band, and optionally one
              of six characters we drew. That is the whole record. The product
              has no field for anything else.
            </Text>
          </Card>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="safety-not-collected-heading"
        tone="muted"
        title="What we never collect about a child"
      >
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <Heading level={3} size="sm">
              Not collected
            </Heading>
            <ul className="mt-4 grid gap-2">
              {neverCollected.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-primary"
                  />
                  <Text as="span" className="max-w-prose">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading level={3} size="sm">
              Not built
            </Heading>
            <ul className="mt-4 grid gap-2">
              {neverBuilt.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-primary"
                  />
                  <Text as="span" className="max-w-prose">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="safety-analytics-heading"
        title="What we do measure"
        lead="First-party product events, so we can tell whether Little Learner's Club is any use. Nothing is shared with an advertising network, because there is no advertising."
      >
        <Card className="mt-8">
          <Text className="max-w-prose">
            The events we record are things like: an account was created, a
            lesson was started, a lesson was finished, a mission was marked as
            done. They tell us whether families come back and which lessons
            stall — not what a particular child said or did.
          </Text>
          <Text tone="secondary" className="mt-4 max-w-prose">
            We do not store free-form responses from children, because the
            product never asks a child to write anything.
          </Text>
        </Card>
      </MarketingSection>

      <MarketingSection
        headingId="safety-honest-heading"
        tone="muted"
        title="Where we actually are"
        lead="It would be easy to write this page in the present tense throughout. Here is what is true today."
        width="narrow"
      >
        <div className="mt-8 grid gap-4">
          <InlineFeedback tone="neutral" title="No accounts yet">
            Little Learner&apos;s Club is in private beta and there is no
            account system. The preview on this site keeps profiles and progress
            in your own browser. Clearing your browser data removes them
            entirely.
          </InlineFeedback>
          <InlineFeedback
            tone="neutral"
            title="Deletion and export are planned"
          >
            Deleting a profile, deleting progress, deleting an account, and
            exporting your data are commitments in our published documentation.
            They are built alongside accounts, before the beta opens.
          </InlineFeedback>
          <InlineFeedback tone="neutral" title="Not yet legally reviewed">
            Before Little Learner&apos;s Club is available to the public, its
            handling of children&rsquo;s data will be reviewed by qualified
            counsel against COPPA, applicable state and international privacy
            law, and app-store family policies. That review has not happened
            yet, and nothing in our documentation is legal advice.
          </InlineFeedback>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="safety-cta-heading"
        title="The formal documents"
        lead="Both are placeholders while the product is in private beta, and both say so plainly rather than borrowing somebody else's boilerplate."
        width="narrow"
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/privacy" variant="secondary">
            Privacy policy
          </ButtonLink>
          <ButtonLink href="/terms" variant="secondary">
            Terms of use
          </ButtonLink>
        </div>
      </MarketingSection>
    </>
  );
}
