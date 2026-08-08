import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChoiceStepView } from "./ChoiceStepView";
import { makeTestLesson } from "@/features/curriculum/fixtures";
import type { ChoiceScene } from "@/features/lessons/steps";

/**
 * The decision beat's picture must not grade the decision. The scene stage
 * takes only the scene's `illustrationKey`, never which choice was made, so the
 * place a child sees after choosing is identical whatever they picked — even
 * across choices whose `consequenceType` differs (helpful / mixed /
 * needs_context). This locks that in: the same choice step, re-rendered with
 * each choice selected in turn, must produce a byte-identical scene stage
 * (docs/CURRICULUM_PRINCIPLES.md, "no right answer"; docs/DECISIONS.md 043).
 */
describe("ChoiceStepView scene stage", () => {
  const scene = makeTestLesson().scenes[1] as ChoiceScene;

  function sceneStageHtml(container: HTMLElement): string {
    const stage = container.querySelector("[data-archetype]");
    expect(stage).not.toBeNull();
    return (stage as HTMLElement).outerHTML;
  }

  it("draws an identical place whichever choice was made", () => {
    const { container, rerender } = render(
      <ChoiceStepView
        scene={scene}
        selectedChoiceId={scene.choices[0]?.id}
        onChoose={() => {}}
      />,
    );
    const stages = scene.choices.map((choice) => {
      rerender(
        <ChoiceStepView
          scene={scene}
          selectedChoiceId={choice.id}
          onChoose={() => {}}
        />,
      );
      return sceneStageHtml(container);
    });

    // Every consequence type renders the same stage — no verdict in the picture.
    for (const html of stages) {
      expect(html).toBe(stages[0]);
    }
  });
});
