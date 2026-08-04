import type { FeedbackTone } from "@/components/ui/InlineFeedback";
import type { ConsequenceType } from "@/features/curriculum/schema";

/**
 * Maps a content `consequenceType` onto a feedback tone.
 *
 * A one-to-one mapping, and it must stay one: there is no "correct" tone to
 * map onto, because docs/CURRICULUM_PRINCIPLES.md rules out marking a child's
 * choice right or wrong. `satisfies Record<ConsequenceType, …>` means adding a
 * consequence type without deciding how it reads is a type error.
 */
export const feedbackToneForConsequence = {
  helpful: "helpful",
  mixed: "mixed",
  needs_context: "needs-context",
} satisfies Record<ConsequenceType, FeedbackTone>;
