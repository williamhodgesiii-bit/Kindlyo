import type { Metadata } from "next";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { ParentInsightCard } from "@/components/ui/ParentInsightCard";
import { Heading, Text } from "@/components/ui/Typography";
import { maxProfiles } from "@/features/profiles/types";
import { pageMetadata } from "@/lib/seo";

/**
 * The parent companion experience.
 *
 * Distinct from `/parent`, which is the product itself. This page explains what
 * that area does and what it deliberately refuses to do; that page is where a
 * parent actually works.
 *
 * The four status words are quoted exactly as the dashboard uses them
 * (docs/PARENT_DASHBOARD.md), because a parent who reads this page and then
 * opens the product should recognise what they are looking at.
 */

export const metadata: Metadata = pageMetadata({
  title: "For parents",
  description:
    "You hold the Kindlyo account and your child learns inside it. See what has been practised in four plain words, get one offline mission at a time, and never a score, a streak, or a comparison between siblings.",
  path: "/for-parents",
});

const statusWords = [
  {
    word: "Practised",
    meaning: "They have worked through this area at least once.",
  },
  {
    word: "Exploring",
    meaning: "They are partway through, or have tried more than one answer.",
  },
  {
    word: "Ready to review",
    meaning: "It has been a while, and a second pass would help it stick.",
  },
  {
    word: "Not started yet",
    meaning: "Exactly that. Not late, not behind — just not yet.",
  },
];

const refusals = [
  "No score, no grade, no percentage, and no reading age.",
  "No streak to break, and nothing that punishes a week off.",
  "No comparison between your children, or with anybody else's.",
  "No notifications engineered to pull your child back to a screen.",
  "No transcript of anything your child typed, because there is nowhere to type.",
];

export default function ForParentsPage() {
  return (
    <>
      <section aria-labelledby="parents-hero-heading">
        <PageContainer>
          <div className="max-w-2xl">
            <Heading level={1} size="display" id="parents-hero-heading">
              You hold the account. Your child learns inside it.
            </Heading>
            <Text size="lg" tone="secondary" className="mt-6">
              Kindlyo is built for a parent with about ninety seconds and no
              appetite for another dashboard to keep up with. You are not asked
              to plan a session, mark anything, or maintain a streak.
            </Text>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/waitlist" size="lg">
                Join the waitlist
              </ButtonLink>
              <ButtonLink href="/parent" variant="secondary" size="lg">
                Look around the parent area
              </ButtonLink>
            </div>
            <Text tone="secondary" size="sm" className="mt-6">
              The parent area is an early preview. It runs on this device only,
              with no account behind it yet, and nothing you enter there leaves
              your browser.
            </Text>
          </div>
        </PageContainer>
      </section>

      <MarketingSection
        headingId="parents-setup-heading"
        tone="muted"
        title="Setting up takes a minute"
        lead="Three fields, and two of them are optional."
      >
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card as="li">
            <Heading level={3} size="sm">
              A nickname
            </Heading>
            <Text tone="secondary" className="mt-2">
              Whatever your child is called at home. There is nowhere to type a
              surname, and we would rather you did not.
            </Text>
          </Card>
          <Card as="li">
            <Heading level={3} size="sm">
              An age band
            </Heading>
            <Text tone="secondary" className="mt-2">
              Five to six, or seven to nine. Not a birthday — the band only
              shapes the reading level.
            </Text>
          </Card>
          <Card as="li">
            <Heading level={3} size="sm">
              A drawn character
            </Heading>
            <Text tone="secondary" className="mt-2">
              Optional, and picked from six we drew. There is no way to upload a
              photograph of a child, by design.
            </Text>
          </Card>
        </ul>
        <Text tone="secondary" className="mt-6 max-w-prose">
          Up to {maxProfiles} children can share one account, and each keeps
          their own progress. Children choose their profile when they sit down;
          they never sign in, because they have nothing to sign in with.
        </Text>
      </MarketingSection>

      <MarketingSection
        headingId="parents-words-heading"
        title="Four words, and no numbers"
        lead="This is the entire vocabulary the parent view uses to describe an area of practice."
      >
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {statusWords.map((status) => (
            <Card as="li" key={status.word}>
              <Heading level={3} size="sm">
                {status.word}
              </Heading>
              <Text tone="secondary" className="mt-2">
                {status.meaning}
              </Text>
            </Card>
          ))}
        </ul>

        <ParentInsightCard
          className="mt-8"
          headingLevel={3}
          eyebrow="Worth talking about"
          title="The one thing we do surface"
          body="When your child picks an answer whose rightness genuinely depends on the situation — waiting to be greeted rather than going first, say — you see it. Not as a mistake they made, but as a conversation that is available to you if you want it."
          points={[
            "It tells you what the situation was and what they chose.",
            "It suggests a way in, if you would like one.",
            "It is not a flag, an alert, or a concern. Most of them are simply interesting.",
          ]}
        />
      </MarketingSection>

      <MarketingSection
        headingId="parents-refusals-heading"
        tone="muted"
        title="What the parent view will not do"
        lead="A summary of what a child practised should not quietly become a report card on who they are."
      >
        <ul className="mt-8 grid gap-3">
          {refusals.map((refusal) => (
            <li key={refusal} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-secondary"
              />
              <Text as="span" className="max-w-prose">
                {refusal}
              </Text>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        headingId="parents-control-heading"
        title="Your data, and getting rid of it"
        lead="Whatever the product ends up holding, you should be able to take it back."
      >
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <Heading level={3} size="sm">
              What we are building toward
            </Heading>
            <Text tone="secondary" className="mt-2">
              Delete a child profile, delete their progress, delete the whole
              account, and export what is held. These are commitments in our
              published privacy documentation, and the beta is where we prove
              they work.
            </Text>
          </Card>
          <Card>
            <Heading level={3} size="sm">
              Where things stand today
            </Heading>
            <Text tone="secondary" className="mt-2">
              There is no Kindlyo account yet. The preview stores profiles and
              progress in your own browser, and clearing your browser data
              removes them completely. Accounts, and the deletion and export
              tools that go with them, arrive before the beta opens.
            </Text>
          </Card>
        </div>
        <div className="mt-8">
          <ButtonLink href="/safety" variant="secondary">
            Read safety and privacy in full
          </ButtonLink>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="parents-cta-heading"
        tone="sand"
        width="narrow"
        title="Join the founding families"
        lead="Small groups, so we can actually talk to the people using it."
      >
        <div className="mt-8">
          <ButtonLink href="/waitlist" size="lg">
            Join the waitlist
          </ButtonLink>
        </div>
      </MarketingSection>
    </>
  );
}
