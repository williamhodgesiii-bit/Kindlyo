import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildLessonSteps } from "@/features/lessons/steps";
import { MarketingSection, type SectionTone } from "./MarketingSection";
import { SampleScenario } from "./SampleScenario";

/**
 * Sources the public sample scenario from real curriculum content.
 *
 * A server component, so the whole lesson catalogue stays out of the browser
 * bundle: only the one scene and the one principle the demo needs cross the
 * boundary as props.
 *
 * Two deliberate choices here:
 *
 * - `getLessonBySlug` is called with `canViewDrafts` passed **explicitly**.
 *   Its default is `canViewDraftContent()`, which returns true today but is
 *   documented as becoming a role check once accounts exist — at which point an
 *   anonymous visitor would stop being allowed to see drafts and this section
 *   would silently vanish. The marketing site shows draft content on purpose,
 *   with the draft badge visible, so it says so rather than inheriting an
 *   answer meant for the learning area.
 * - If the lesson or a required step is missing, this renders nothing instead
 *   of throwing. A content edit should never be able to take the homepage down.
 */

const sampleLessonSlug = "saying-hello";

export type SampleScenarioSectionProps = {
  headingId: string;
  tone?: SectionTone;
  className?: string;
};

export function SampleScenarioSection({
  headingId,
  tone,
  className,
}: SampleScenarioSectionProps) {
  const lesson = getLessonBySlug(sampleLessonSlug, true);
  if (lesson === undefined) return null;

  const steps = buildLessonSteps(lesson);
  const choiceStep = steps.find((step) => step.kind === "choice");
  const principleStep = steps.find((step) => step.kind === "principle");
  if (choiceStep === undefined || principleStep === undefined) return null;

  return (
    <MarketingSection
      headingId={headingId}
      tone={tone}
      className={className}
      title="Try the moment your child would meet"
      lead="This is a real scene from a real lesson, not a mock-up. Pick any answer and read what tends to happen next — then pick a different one. Nothing is marked right or wrong, nothing is scored, and nothing you do here is saved."
    >
      <SampleScenario
        lessonTitle={lesson.title}
        status={lesson.status}
        scene={choiceStep.scene}
        principle={principleStep.principle}
      />
    </MarketingSection>
  );
}
