import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/marketing/Faq";
import { HeroScene } from "@/components/marketing/HeroScene";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { SampleScenarioSection } from "@/components/marketing/SampleScenarioSection";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { faqEntries } from "@/content/marketing/faq";
import { publicSkills } from "@/content/marketing/skills";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd, organizationJsonLd } from "@/lib/structuredData";

/**
 * The public homepage — rebuilt for the Little Learner's Club look: bold and
 * short, showing more than it explains.
 *
 * The one hard constraint still holds every line: nothing here may claim
 * something we cannot support. No testimonials, no user counts, no outcome
 * statistics, no implied expert review. Where the page can show rather than
 * claim it does — the sample below is a real lesson rendered by the real lesson
 * components, and the practice grid is generated from the curriculum's own skill
 * areas.
 *
 * The "Jump into the product" band is deliberate: the learning app and the
 * parent dashboard are reachable straight from the homepage while they are
 * previews, so the whole product can be explored from one place.
 */

export const metadata: Metadata = pageMetadata({
  title: "Little Learner's Club",
  absoluteTitle:
    "Little Learner's Club — social skills practice for children ages 5 to 9",
  description:
    "Little steps to big kindness. Little Learner's Club gives children ages 5 to 9 short, story-based lessons and real-world missions to practise everyday social moments. Private beta — join the founding-family waitlist.",
  path: "/",
});

/** The three ideas that set the product apart, kept to a line each. */
const promises = [
  {
    title: "No right answers",
    body: "Every choice just shows what tends to happen next. Nothing is scored, ranked, or marked wrong.",
    tint: "bg-tint-sand",
  },
  {
    title: "Then, offline",
    body: "Each lesson ends with one small mission to try for real. That is the part that makes it stick.",
    tint: "bg-tint-sage",
  },
  {
    title: "Calm for grown-ups",
    body: "See what has been practised in four plain words. No streaks to keep alive, and no guilt.",
    tint: "bg-tint-honey",
  },
] as const;

/** Live surfaces a visitor can open right now — the header's counterparts. */
const entryPoints = [
  {
    href: "/learn",
    title: "Learning app",
    body: "Step into a lesson the way a child would.",
  },
  {
    href: "/parent",
    title: "Parent dashboard",
    body: "The calm grown-up view of what has been practised.",
  },
  {
    href: "/login",
    title: "Sign in",
    body: "Already have a founding-family account?",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      {/* The hero scene themes itself violet from this module so it reads as
          part of the same brand as the buttons and the mark. */}
      <section aria-labelledby="hero-heading" data-module="world-garden">
        <PageContainer>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
            <div className="max-w-2xl">
              <p className="inline-flex items-center rounded-round bg-tint-sand px-3 py-1 text-sm font-semibold text-brand-primary-strong">
                Social skills · ages 5–9
              </p>
              <Heading
                level={1}
                size="display"
                id="hero-heading"
                className="mt-5"
              >
                Little steps to big kindness.
              </Heading>
              <Text size="lg" tone="secondary" className="mt-6 max-w-xl">
                Five-minute, story-based lessons that help children practise
                kindness, confidence, and everyday manners — one small step at a
                time.
              </Text>

              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="#sample-heading" size="lg">
                  Try a lesson
                </ButtonLink>
                <ButtonLink href="/waitlist" variant="secondary" size="lg">
                  Join the waitlist
                </ButtonLink>
              </div>

              <Text tone="secondary" size="sm" className="mt-6">
                Free to try, right here. No account, and nothing is saved.
              </Text>
            </div>

            {/* Decorative — the copy carries the whole message. After it in the
                DOM so the buttons stay above the fold on phones. */}
            <HeroScene className="mx-auto w-full max-w-sm lg:max-w-none" />
          </div>
        </PageContainer>
      </section>

      <SampleScenarioSection headingId="sample-heading" tone="muted" />

      <MarketingSection
        headingId="promises-heading"
        title="Kind by practice, not by pressure"
      >
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {promises.map((promise) => (
            <li
              key={promise.title}
              className={cn("rounded-lg p-6", promise.tint)}
            >
              <Heading level={3} size="md">
                {promise.title}
              </Heading>
              <Text className="mt-2">{promise.body}</Text>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        headingId="skills-heading"
        title="What your child practises"
        lead="Six kinds of everyday moment from the first module, Meeting People. Each names what is being rehearsed — never what kind of child somebody is."
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

      {/* Jump into the product — the live previews, straight from the homepage. */}
      <section
        aria-labelledby="product-heading"
        className="bg-brand-primary-strong text-on-brand"
      >
        <PageContainer>
          <Heading level={2} id="product-heading" size="xl">
            Jump straight into the product
          </Heading>
          <Text size="lg" className="mt-4 max-w-prose">
            The learning app and the parent dashboard are open to explore right
            now as an early preview — no account, no waiting for a beta place.
          </Text>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {entryPoints.map((point) => (
              <li key={point.href}>
                <Link
                  href={point.href}
                  className="group flex h-full flex-col rounded-lg bg-surface p-6 text-text-primary shadow-soft hover:bg-surface-muted"
                >
                  <span className="flex items-center justify-between gap-3">
                    <Heading level={3} size="sm">
                      {point.title}
                    </Heading>
                    <span
                      aria-hidden="true"
                      className="text-xl font-bold text-brand-primary-strong"
                    >
                      →
                    </span>
                  </span>
                  <Text tone="secondary" className="mt-2">
                    {point.body}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>

      <MarketingSection
        headingId="trust-heading"
        tone="muted"
        title="Built to hold as little as possible"
        lead="No advertising. No child logins. No messaging, no feeds, no leaderboards. A nickname and an age band is the whole of what a child's profile holds."
      >
        <div className="mt-8">
          <ButtonLink href="/safety" variant="secondary">
            How safety and privacy work
          </ButtonLink>
        </div>
      </MarketingSection>

      <MarketingSection
        headingId="waitlist-heading"
        tone="sand"
        width="narrow"
        title="Be a founding family"
        lead="Beta places open in small groups. Leave an email address and we will tell you when the next group opens."
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
