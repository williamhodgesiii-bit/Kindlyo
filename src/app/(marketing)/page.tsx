import type { Metadata } from "next";
import { Faq } from "@/components/marketing/Faq";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { SampleScenarioSection } from "@/components/marketing/SampleScenarioSection";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { ParentInsightCard } from "@/components/ui/ParentInsightCard";
import { Heading, Text } from "@/components/ui/Typography";
import { faqEntries } from "@/content/marketing/faq";
import { learningLoop } from "@/content/marketing/learningLoop";
import { publicSkills } from "@/content/marketing/skills";
import { meetingPeopleModule } from "@/content/modules";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd, organizationJsonLd } from "@/lib/structuredData";

/**
 * The public homepage.
 *
 * Written under one constraint that shapes every line: nothing here may claim
 * something we cannot support. There are no testimonials, no user counts, no
 * outcome statistics, and no suggestion that the curriculum has been reviewed
 * by specialists, because none of those exist. The internal success signals in
 * docs/PRODUCT_BRIEF.md are hypotheses and stay internal.
 *
 * Where the page can show rather than claim, it does: the sample scenario is
 * real lesson content rendered by the real lesson components, the skills grid
 * is generated from the curriculum's own skill areas, and the lesson-loop list
 * is the step order the engine actually produces.
 */

export const metadata: Metadata = pageMetadata({
  title: "Kindlyo",
  absoluteTitle: "Kindlyo — social skills practice for children ages 5 to 9",
  description:
    "Kindness is a skill and confidence takes practice. Kindlyo gives children ages 5 to 9 short, story-based lessons and real-world missions to rehearse everyday social moments. Private beta — join the founding-family waitlist.",
  path: "/",
});

const privacyPromises = [
  "No advertising, anywhere, and no third-party advertising code.",
  "No child logins, no child email addresses, no public profiles.",
  "No messaging between children, no feed, no leaderboard.",
  "No precise location, no contacts, no voice recordings, no face data.",
  "A nickname and an age band is the whole of what a child profile holds.",
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      <section aria-labelledby="hero-heading">
        <PageContainer>
          <div className="max-w-2xl">
            <Heading level={1} size="display" id="hero-heading">
              Kindness is a skill. Confidence takes practice.
            </Heading>
            <Text size="lg" tone="secondary" className="mt-6">
              Some social moments are only hard the first time — walking into a
              room where everyone already knows each other, asking to join a
              game, working out how to leave a conversation. Kindlyo gives
              children ages 5 to 9 somewhere to have that first time early,
              where nothing is riding on it.
            </Text>
            <Text size="lg" tone="secondary" className="mt-4">
              Five minutes of story on screen, one small thing to try offline
              afterwards, and a grown-up who knows what to ask about at dinner.
            </Text>

            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/waitlist" size="lg">
                Join the founding-family waitlist
              </ButtonLink>
              <ButtonLink href="#sample-heading" variant="secondary" size="lg">
                Try a scenario first
              </ButtonLink>
            </div>

            <Text tone="secondary" size="sm" className="mt-6">
              Kindlyo is in private beta and not yet open to the public. The
              scenario below needs no account and saves nothing.
            </Text>
          </div>
        </PageContainer>
      </section>

      <SampleScenarioSection headingId="sample-heading" tone="muted" />

      <MarketingSection
        headingId="skills-heading"
        title="What your child practises"
        lead="The first module, Meeting People, works through six areas of practice. They describe what is being rehearsed — never what kind of child somebody is."
      >
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {publicSkills.map((skill) => (
            <Card as="li" key={skill.area}>
              <Heading level={3} size="sm">
                {skill.label}
              </Heading>
              <Text tone="secondary" className="mt-2">
                {skill.description}
              </Text>
            </Card>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        headingId="loop-heading"
        tone="muted"
        title="How one lesson goes"
        lead="Every lesson follows the same shape, so a child always knows where they are in it and can stop partway without losing their place."
      >
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {learningLoop.map((step, index) => (
            <Card as="li" key={step.id}>
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
        <div className="mt-8">
          <ButtonLink href="/how-it-works" variant="secondary">
            See it in more detail
          </ButtonLink>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="parents-heading"
        title="What you get, without another thing to keep up with"
        lead="Kindlyo is built for a parent who has about ninety seconds. You are not asked to plan a session, mark anything, or keep a streak alive."
      >
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4">
            <Card>
              <Heading level={3} size="sm">
                What has actually been practised
              </Heading>
              <Text tone="secondary" className="mt-2">
                Your view uses four words and no numbers: practised, exploring,
                ready to review, and not started yet. There is no score, no
                percentage, no streak, and no comparison between siblings.
              </Text>
            </Card>
            <Card>
              <Heading level={3} size="sm">
                Something worth talking about
              </Heading>
              <Text tone="secondary" className="mt-2">
                When your child picks an answer that genuinely depends on the
                situation, you see it — framed as a conversation to have, not a
                mistake to correct.
              </Text>
            </Card>
            <Card>
              <Heading level={3} size="sm">
                One mission at a time
              </Heading>
              <Text tone="secondary" className="mt-2">
                Each lesson suggests a single small thing to try in the real
                world, with a sentence on how to set it up. Doing it is the
                point; ticking it off is optional.
              </Text>
            </Card>
          </div>

          <ParentInsightCard
            headingLevel={3}
            eyebrow="A note on tone"
            title="Confidence and consideration, not obedience"
            body="Kindlyo does not teach children to do as they are told. It teaches them to notice how a situation might feel from somebody else's side, and to decide from there."
            points={[
              "Choices are never marked right or wrong — the lesson shows what tends to follow from each one.",
              "Etiquette is taught as varying by family, culture, and situation, not as a fixed list of rules.",
              "Politeness never outranks safety, consent, or a child's say over their own body.",
              "No shame, no punishment, no public ranking, and no moral scoring of a child.",
            ]}
            action={
              <ButtonLink href="/for-parents" variant="secondary">
                More for parents
              </ButtonLink>
            }
          />
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="curriculum-heading"
        tone="muted"
        title="Situations, not a list of rules"
        lead={`The first module is “${meetingPeopleModule.title}”: ${meetingPeopleModule.lessons.length} short lessons about noticing other people, starting a conversation, and leaving one kindly.`}
      >
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <Heading level={3} size="sm">
              Written to published principles
            </Heading>
            <Text tone="secondary" className="mt-2">
              Every lesson names the cultural, accessibility, and safety
              considerations it was written against. Nothing requires eye
              contact, speaking, or physical touch, and every lesson states that
              a child may decline to be touched.
            </Text>
          </Card>
          <Card>
            <Heading level={3} size="sm">
              Draft until somebody qualified says otherwise
            </Heading>
            <Text tone="secondary" className="mt-2">
              All of the content on this site is draft. It has not been reviewed
              by educators, psychologists, or clinicians, and we label it as
              draft wherever it appears rather than describing it as validated.
            </Text>
          </Card>
        </div>
        <div className="mt-8">
          <ButtonLink href="/curriculum" variant="secondary">
            Read the curriculum approach
          </ButtonLink>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="safety-heading"
        title="What we do not build, and what we do not collect"
        lead="The safest way to not misuse a child's data is to never hold it. Most of this list is about things that do not exist in the product."
      >
        <ul className="mt-8 grid gap-3">
          {privacyPromises.map((promise) => (
            <li key={promise} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-secondary"
              />
              <Text as="span" className="max-w-prose">
                {promise}
              </Text>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ButtonLink href="/safety" variant="secondary">
            Read how safety and privacy work
          </ButtonLink>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="waitlist-heading"
        tone="sand"
        width="narrow"
        title="Be a founding family"
        lead="Beta places open in small groups so we can talk to every family that joins. Leave an email address and we will tell you when the next group opens."
      >
        <WaitlistForm className="mt-8" />
      </MarketingSection>

      <MarketingSection
        headingId="faq-heading"
        title="Questions parents ask"
        width="narrow"
      >
        <JsonLd data={faqJsonLd(faqEntries)} />
        <Faq entries={faqEntries} className="mt-8" />
      </MarketingSection>
    </>
  );
}
