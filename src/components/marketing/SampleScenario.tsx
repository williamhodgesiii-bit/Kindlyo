"use client";

import { useState } from "react";
import { ChoiceStepView } from "@/components/lesson/steps/ChoiceStepView";
import { PrincipleStepView } from "@/components/lesson/steps/PrincipleStepView";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContentStatusBadge } from "@/components/ui/ContentStatusBadge";
import { Text } from "@/components/ui/Typography";
import type {
  ContentStatus,
  LessonPrinciple,
} from "@/features/curriculum/schema";
import type { ChoiceScene } from "@/features/lessons/steps";

/**
 * A real lesson moment, playable by anyone, on the public site.
 *
 * The contract, and the reason this is a separate component rather than a
 * reused `LessonRunner`:
 *
 * - **Nothing is stored.** No local storage, no cookie, no request. The only
 *   state is the two `useState` values below, and they die with the page.
 *   `prompts/07-marketing-site.md` requires that the sample scenario neither
 *   requires nor collects child personal data, and the narrowest way to
 *   guarantee that is to have no code here that could.
 * - **No profile is involved.** `LessonRunner` gates on `useFamily()` and
 *   reads saved progress, which is right for the learning area and wrong for a
 *   visitor who has not agreed to anything.
 *
 * What it does reuse is the part worth reusing: `ChoiceStepView` and
 * `PrincipleStepView` are the same components a child sees in a real lesson,
 * rendering the same authored content. A visitor is looking at the product,
 * not at a mock-up of it.
 *
 * The draft badge is not decoration. Every lesson in the repository is draft
 * content, and CLAUDE.md requires that status be visible wherever content
 * appears rather than quietly omitted on the page trying to win somebody over.
 */

export type SampleScenarioProps = {
  lessonTitle: string;
  status: ContentStatus;
  scene: ChoiceScene;
  principle: LessonPrinciple;
};

export function SampleScenario({
  lessonTitle,
  status,
  scene,
  principle,
}: SampleScenarioProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | undefined>(
    undefined,
  );
  const [explanationShown, setExplanationShown] = useState(false);

  const hasChosen = selectedChoiceId !== undefined;

  return (
    <Card elevation="soft" className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text tone="secondary" size="sm">
          From the lesson “{lessonTitle}”
        </Text>
        <ContentStatusBadge status={status} />
      </div>

      <div className="mt-6">
        <ChoiceStepView
          scene={scene}
          selectedChoiceId={selectedChoiceId}
          onChoose={setSelectedChoiceId}
          headingLevel={3}
        />
      </div>

      {hasChosen ? (
        <div className="mt-8 border-t border-border pt-6">
          <Button
            variant="secondary"
            aria-expanded={explanationShown}
            aria-controls="sample-scenario-explanation"
            onClick={() => setExplanationShown((shown) => !shown)}
          >
            {explanationShown
              ? "Hide the explanation"
              : "Why does this help the other person?"}
          </Button>

          {explanationShown ? (
            <div id="sample-scenario-explanation" className="mt-6">
              <PrincipleStepView principle={principle} headingLevel={3} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8 border-t border-border pt-6">
        <Text tone="secondary">
          In the full lesson this is followed by a practice turn, a small
          mission to try away from the screen, and a note for the grown-up
          sitting alongside.
        </Text>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/how-it-works" variant="secondary">
            See a whole lesson
          </ButtonLink>
          <ButtonLink href="/waitlist">Join the waitlist</ButtonLink>
        </div>
      </div>
    </Card>
  );
}
