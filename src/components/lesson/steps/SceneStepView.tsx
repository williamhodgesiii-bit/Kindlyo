import { StoryPanel } from "@/components/ui/StoryPanel";
import type { LessonScene } from "@/features/curriculum/schema";
import { SceneIllustration } from "../illustrations";

/** A story beat with nothing to decide yet. */
export function SceneStepView({ scene }: { scene: LessonScene }) {
  return (
    <StoryPanel
      title={scene.title}
      narration={scene.narration}
      illustration={
        <SceneIllustration
          illustrationKey={scene.illustrationKey}
          className="h-auto w-full"
        />
      }
    />
  );
}
