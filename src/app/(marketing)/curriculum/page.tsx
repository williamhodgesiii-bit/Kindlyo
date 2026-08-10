import type { Metadata } from "next";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContentStatusBadge } from "@/components/ui/ContentStatusBadge";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { publicSkills } from "@/content/marketing/skills";
import { meetingPeopleModule } from "@/content/modules";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { pageMetadata } from "@/lib/seo";

/**
 * The curriculum, described publicly.
 *
 * The lesson list is generated from the module outline and the authored
 * content, not retyped: a lesson's title, description, and length come from the
 * lesson itself, and its review status comes from its own `status` field. That
 * means this page cannot advertise a lesson that does not exist, and cannot
 * describe draft content as reviewed.
 *
 * `getLessonBySlug` is called with `canViewDrafts` explicitly true, for the
 * reason given in `SampleScenarioSection`: the marketing site shows draft
 * content on purpose, labelled, rather than inheriting a visibility rule
 * written for the learning area.
 */

export const metadata: Metadata = pageMetadata({
  title: "Curriculum",
  description:
    "Little Learner's Club teaches social skills through situations rather than rules. The first module, Meeting People, is eight short lessons for children ages 5 to 9. All content is currently draft and has not been reviewed by qualified specialists.",
  path: "/curriculum",
});

const principles = [
  {
    title: "Situations, not rules",
    body: "A rule tells a child what to do. A situation lets them work out why it matters here and what they would want if they were the other person. Little Learner's Club teaches the second.",
  },
  {
    title: "Context is part of the lesson",
    body: "Etiquette varies by family, by culture, and by the moment. Every lesson carries the qualifiers — a greeting can be words or a wave, urgency changes what is appropriate, and different homes do things differently.",
  },
  {
    title: "Safety outranks politeness, always",
    body: "Children are told directly that they may say no, refuse physical contact, leave a situation that feels wrong, interrupt in an emergency, and find a trusted adult. No lesson teaches a child to stay polite through something unsafe.",
  },
  {
    title: "Nobody is scored",
    body: "There are no right answers to select and no marks to earn. A choice is followed by what tends to happen next, described as an observation about the situation rather than a judgement about the child.",
  },
  {
    title: "Nothing requires a particular body",
    body: "Eye contact, speech, handshakes, hugs, and sitting still are never required. Waving, nodding, and signing are taught as real greetings in their own right, not as substitutes for a better one.",
  },
];

export default function CurriculumPage() {
  const lessons = meetingPeopleModule.lessons.map((entry) => ({
    entry,
    lesson:
      entry.slug === undefined ? undefined : getLessonBySlug(entry.slug, true),
  }));

  return (
    <>
      <section aria-labelledby="curriculum-hero-heading">
        <PageContainer>
          <div className="max-w-2xl">
            <Heading level={1} size="display" id="curriculum-hero-heading">
              What Little Learner&apos;s Club teaches, and how
            </Heading>
            <Text size="lg" tone="secondary" className="mt-6">
              The first module is “{meetingPeopleModule.title}”:{" "}
              {meetingPeopleModule.description.charAt(0).toLowerCase()}
              {meetingPeopleModule.description.slice(1)}
            </Text>
            <Text size="lg" tone="secondary" className="mt-4">
              It is written for children ages 5 to 9, and it is deliberately
              narrow. One module done properly tells us more than six done
              quickly.
            </Text>
          </div>
        </PageContainer>
      </section>

      <MarketingSection
        headingId="curriculum-status-heading"
        tone="muted"
        title="Where the content stands today"
        lead="This is the part most learning products leave vague, so we would rather be plain about it."
        width="narrow"
      >
        <Card className="mt-8">
          <ContentStatusBadge status={meetingPeopleModule.status} />
          <Text className="mt-4 max-w-prose">
            Every lesson in Little Learner&apos;s Club is currently draft
            content. It was written against our published curriculum principles,
            and it has not been reviewed by educators, psychologists, or
            clinicians. We will not describe it as reviewed, evidence-based, or
            expert-approved until that review has actually happened, and the
            label on each lesson will change when it does.
          </Text>
        </Card>
      </MarketingSection>

      <MarketingSection
        headingId="curriculum-principles-heading"
        title="The principles every lesson is written against"
      >
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {principles.map((principle) => (
            <Card as="li" key={principle.title}>
              <Heading level={3} size="sm">
                {principle.title}
              </Heading>
              <Text tone="secondary" className="mt-2">
                {principle.body}
              </Text>
            </Card>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        headingId="curriculum-skills-heading"
        tone="muted"
        title="The six areas of practice"
        lead="These group the module for the parent view. They describe what is being rehearsed, not what kind of child somebody is."
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
        headingId="curriculum-lessons-heading"
        title={`The ${meetingPeopleModule.lessons.length} lessons in “${meetingPeopleModule.title}”`}
        lead="In order. Each one opens when the one before it is finished, so a child always has exactly one next thing."
      >
        <ol className="mt-8 grid gap-4">
          {lessons.map(({ entry, lesson }) => (
            <Card as="li" key={entry.order}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-secondary-strong">
                    Lesson {entry.order}
                  </p>
                  <Heading level={3} size="sm" className="mt-1">
                    {entry.title}
                  </Heading>
                </div>
                {lesson ? <ContentStatusBadge status={lesson.status} /> : null}
              </div>
              {lesson ? (
                <>
                  <Text tone="secondary" className="mt-3 max-w-prose">
                    {lesson.description}
                  </Text>
                  <Text tone="secondary" size="sm" className="mt-2">
                    About {lesson.estimatedMinutes} minutes, plus an offline
                    mission.
                  </Text>
                </>
              ) : (
                <Text tone="secondary" className="mt-3 max-w-prose">
                  Outlined but not yet written.
                </Text>
              )}
            </Card>
          ))}
        </ol>
      </MarketingSection>

      <MarketingSection
        headingId="curriculum-cta-heading"
        tone="sand"
        width="narrow"
        title="Read the rest of it for yourself"
        lead="The lesson content, the principles it is written against, and the notes on culture, accessibility, and safety are all in the open."
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/waitlist" size="lg">
            Join the waitlist
          </ButtonLink>
          <ButtonLink href="/how-it-works" variant="secondary" size="lg">
            See how a lesson works
          </ButtonLink>
        </div>
      </MarketingSection>
    </>
  );
}
