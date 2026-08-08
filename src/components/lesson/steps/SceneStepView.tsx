import { StoryPanel } from "@/components/ui/StoryPanel";
import type { LessonScene } from "@/features/curriculum/schema";
import { SceneStage } from "../SceneStage";

/** A story beat with nothing to decide yet. */
export function SceneStepView({ scene }: { scene: LessonScene }) {
  return (
    <StoryPanel
      title={scene.title}
      narration={scene.narration}
      illustration={
        <SceneStage key={scene.id} illustrationKey={scene.illustrationKey} />
      }
    />
  );
}
