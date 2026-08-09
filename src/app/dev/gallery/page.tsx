import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  illustrationKeyArchetypes,
  sceneArchetypes,
} from "@/components/lesson/sceneArchetypes";
import { SceneStage } from "@/components/lesson/SceneStage";
import { HeroScene } from "@/components/marketing/HeroScene";
import { ParentAppShell } from "@/components/shells/ParentAppShell";
import { Avatar } from "@/components/ui/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContentStatusBadge } from "@/components/ui/ContentStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { CloseIcon, SparkIcon } from "@/components/ui/icons";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { PageContainer } from "@/components/ui/PageContainer";
import { ParentInsightCard } from "@/components/ui/ParentInsightCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StoryPanel } from "@/components/ui/StoryPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heading, Text } from "@/components/ui/Typography";
import { avatarIds, avatarLabels } from "@/features/profiles/types";
import { isDevRouteEnabled } from "@/lib/devOnly";
import {
  ChoiceDemo,
  DialogDemo,
  ErrorStateDemo,
  MissionDemo,
  ProfileDemo,
} from "./GalleryDemos";

export const metadata: Metadata = {
  title: "Component gallery",
  robots: { index: false, follow: false },
};

/**
 * Development-only component gallery.
 *
 * A place to review every component's states side by side, including the
 * loading, empty, and error states that are easy to forget until a real user
 * hits them.
 *
 * Not product surface: it 404s outside development. Note the honest limit -
 * the gate stops the route answering, it does not strip the route's chunk from
 * a production build.
 */

function Section({
  title,
  intent,
  children,
}: {
  title: string;
  intent: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-border pt-8">
      <Heading level={2}>{title}</Heading>
      <Text tone="secondary" className="mt-1">
        {intent}
      </Text>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * One representative authored illustrationKey per scenery archetype, so the
 * gallery reviews the real `SceneStage` archetype set (docs/DECISIONS.md
 * 044/046) instead of a second, parallel drawing system.
 */
const archetypeSamples = sceneArchetypes.map((archetype) => {
  const keys = Object.keys(
    illustrationKeyArchetypes,
  ) as (keyof typeof illustrationKeyArchetypes)[];
  const illustrationKey =
    keys.find((key) => illustrationKeyArchetypes[key] === archetype) ?? "";
  return { archetype, illustrationKey };
});

export default function GalleryPage() {
  if (!isDevRouteEnabled()) {
    notFound();
  }

  return (
    <ParentAppShell>
      <PageContainer>
        <Heading level={1}>Component gallery</Heading>
        <Text size="lg" tone="secondary" className="mt-4 max-w-2xl">
          Development only. Every component below is rendered in its default and
          edge states. Tab through the page to check that focus is always
          visible, and re-check with reduced motion enabled.
        </Text>

        <Section
          title="Typography"
          intent="Heading level is semantic; size is visual. They are set separately so a page never skips a level to get the size it wants."
        >
          <div className="space-y-3">
            <Heading level={2} size="display">
              Display heading
            </Heading>
            <Heading level={2} size="xl">
              Extra large heading
            </Heading>
            <Heading level={2} size="lg">
              Large heading
            </Heading>
            <Heading level={2} size="md">
              Medium heading
            </Heading>
            <Heading level={2} size="sm">
              Small heading
            </Heading>
            <Text size="lg">Large body text, used on child surfaces.</Text>
            <Text>Base body text.</Text>
            <Text tone="secondary">Secondary body text.</Text>
          </div>
        </Section>

        <Section
          title="Button"
          intent="Four variants, two sizes. Loading keeps the label so the accessible name never changes mid-interaction."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="quiet">Quiet</Button>
            <Button variant="danger">Danger</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading>Saving</Button>
            <ButtonLink href="/dev/gallery">Button link</ButtonLink>
          </div>
        </Section>

        <Section
          title="IconButton"
          intent="Icon-only, so the label is required by the prop type. Fixed at 44 by 44."
        >
          <div className="flex flex-wrap items-center gap-3">
            <IconButton label="Close" icon={<CloseIcon />} />
            <IconButton
              label="Highlight"
              icon={<SparkIcon />}
              variant="solid"
            />
            <IconButton label="Disabled" icon={<CloseIcon />} disabled />
          </div>
        </Section>

        <Section title="Card" intent="A surface, and nothing more.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <Text>Flat card</Text>
            </Card>
            <Card elevation="soft">
              <Text>Soft shadow</Text>
            </Card>
            <Card padding="sm">
              <Text>Small padding</Text>
            </Card>
          </div>
        </Section>

        <Section
          title="ChoiceCard"
          intent="Selection is shown by aria-pressed and a check icon as well as colour. There is no correct or incorrect state, by design."
        >
          <ChoiceDemo />
        </Section>

        <Section
          title="ProgressBar"
          intent="Position, not performance. The visible count means progress is never conveyed by fill width alone."
        >
          <div className="space-y-6">
            <ProgressBar label="Module progress" value={3} max={8} />
            <ProgressBar label="Calm tone" value={6} max={8} tone="calm" />
            <ProgressBar label="Not started" value={0} max={8} />
            <ProgressBar label="Complete" value={8} max={8} />
          </div>
        </Section>

        <Section
          title="Avatar"
          intent="Nickname and age band only. There is no image element and no src prop, so a photograph is impossible."
        >
          <div className="flex flex-wrap items-center gap-4">
            <Avatar nickname="Robin" size="sm" />
            <Avatar nickname="Sam" />
            <Avatar nickname="Ada" size="lg" />
            <Avatar size="lg" />
          </div>
        </Section>

        <Section
          title="Avatar pictures"
          intent="Six drawings, addressed by id. Inline SVG only — there is no img element and no src prop anywhere, so a photograph of a child cannot be stored."
        >
          <div className="flex flex-wrap items-end gap-4">
            {avatarIds.map((id) => (
              <figure key={id} className="text-center">
                <Avatar nickname={avatarLabels[id]} avatarId={id} size="lg" />
                <figcaption className="mt-2 text-sm text-text-secondary">
                  {avatarLabels[id]}
                </figcaption>
              </figure>
            ))}
            <figure className="text-center">
              <Avatar nickname="Robin" size="lg" />
              <figcaption className="mt-2 text-sm text-text-secondary">
                No picture
              </figcaption>
            </figure>
          </div>
        </Section>

        <Section
          title="ProfileCard"
          intent="Renders as a button, a link, or plain information depending on what it is given."
        >
          <ProfileDemo />
        </Section>

        <Section
          title="MissionCard"
          intent="Status is an icon plus a word. No points, badges, or streaks."
        >
          <MissionDemo />
        </Section>

        <Section
          title="Dialog"
          intent="Focus moves in on open, is trapped while open, and returns to the trigger on close. Escape closes."
        >
          <DialogDemo />
        </Section>

        <Section
          title="InlineFeedback"
          intent="The first three tones mirror the content model's helpful, mixed, and needs_context outcomes. Every tone carries an icon and a text title."
        >
          <div className="space-y-3">
            <InlineFeedback tone="helpful">
              That could help Maya know you want to join in.
            </InlineFeedback>
            <InlineFeedback tone="mixed">
              That might work, and it might leave someone waiting.
            </InlineFeedback>
            <InlineFeedback tone="needs-context">
              Different situations can need different responses.
            </InlineFeedback>
            <InlineFeedback tone="neutral">
              You can always ask for a moment before answering.
            </InlineFeedback>
            <InlineFeedback tone="problem">
              We could not save that just now.
            </InlineFeedback>
          </div>
        </Section>

        <Section
          title="ContentStatusBadge"
          intent="Review state, shown rather than hidden. Draft is information, not an error, so it is muted rather than alarming."
        >
          <div className="flex flex-wrap items-center gap-3">
            <ContentStatusBadge status="draft" />
            <ContentStatusBadge status="reviewed" />
            <ContentStatusBadge status="published" />
            <ContentStatusBadge status="draft" withDescription />
          </div>
        </Section>

        <Section
          title="StoryPanel"
          intent="A scene: picture, title, narration. The illustration is decorative — the narration must read the same without it."
        >
          <StoryPanel
            title="The first morning at art club"
            narration="Maya is already at the long table, laying out paintbrushes. She looks up when you come in."
            illustration={<SceneStage illustrationKey="art-table-morning" />}
          />
        </Section>

        <Section
          title="ParentInsightCard"
          intent="Addressed to the adult, inside a child's screen. Visually distinct so nobody has to work out who it is for."
        >
          <ParentInsightCard
            title="How to help"
            body="Children copy greetings long before they can explain them."
            points={[
              "Greet someone in front of your child, then say what you did.",
              "Let them pick the form. A wave counts.",
            ]}
          />
        </Section>

        <Section
          title="Scene stage — scenery archetypes"
          intent="Every authored illustrationKey resolves to one of ten generic places (docs/DECISIONS.md 044); the stage renders that place, themed by the module world. Local shapes only, aria-hidden, and an unknown key falls back to the neutral gathering place rather than throwing."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {archetypeSamples.map(({ archetype, illustrationKey }) => (
              <figure key={archetype}>
                <SceneStage illustrationKey={illustrationKey} />
                <figcaption className="mt-2 text-sm text-text-secondary">
                  {archetype} · <code>{illustrationKey}</code>
                </figcaption>
              </figure>
            ))}
            <figure key="fallback">
              <SceneStage illustrationKey="no-such-key" />
              <figcaption className="mt-2 text-sm text-text-secondary">
                gathering (fallback) · <code>no-such-key</code>
              </figcaption>
            </figure>
          </div>
        </Section>

        <Section
          title="Marketing hero scene"
          intent="The homepage hero illustration. Decorative (aria-hidden), token-themed, no gradients; two friends waving hello — a wave, never a handshake. Watch the single one-shot entrance, and confirm it rests fully visible under an emulated reduced-motion preference."
        >
          <div className="max-w-md">
            <HeroScene />
          </div>
        </Section>

        <Section
          title="Empty, error, and loading states"
          intent="First-class variants, not afterthoughts. Every screen needs all three."
        >
          <div className="space-y-4">
            <EmptyState
              title="No missions yet"
              description="Missions appear here once your child finishes their first lesson."
              action={<Button variant="secondary">Browse lessons</Button>}
            />
            <ErrorStateDemo />
            <Card>
              <Skeleton variant="text" lines={3} />
            </Card>
            <Card>
              <div className="flex items-center gap-4">
                <Skeleton variant="circle" className="w-auto" />
                <Skeleton variant="text" lines={2} />
              </div>
            </Card>
          </div>
        </Section>
      </PageContainer>
    </ParentAppShell>
  );
}
