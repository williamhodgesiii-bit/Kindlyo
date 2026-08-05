import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildLessonSteps } from "@/features/lessons/steps";
import type { ChoiceScene } from "@/features/lessons/steps";
import { SampleScenario } from "./SampleScenario";

/**
 * The public demo, tested against the real lesson it ships with rather than a
 * fixture: if the authored content stops having a choice scene, this should
 * fail here rather than render an empty section on the homepage.
 */

function sampleParts() {
  const lesson = getLessonBySlug("saying-hello", true);
  if (lesson === undefined) throw new Error("the sample lesson is missing");

  const steps = buildLessonSteps(lesson);
  const choice = steps.find((step) => step.kind === "choice");
  const principle = steps.find((step) => step.kind === "principle");
  if (choice === undefined || principle === undefined) {
    throw new Error("the sample lesson has no decision to demonstrate");
  }

  return { lesson, scene: choice.scene, principle: principle.principle };
}

function renderSample() {
  const { lesson, scene, principle } = sampleParts();
  render(
    <SampleScenario
      lessonTitle={lesson.title}
      status={lesson.status}
      scene={scene}
      principle={principle}
    />,
  );
  return { lesson, scene, principle };
}

function choiceButton(scene: ChoiceScene, index: number) {
  const choice = scene.choices[index];
  if (choice === undefined) throw new Error("the sample scene lost a choice");
  return { choice, button: screen.getByRole("button", { name: choice.text }) };
}

describe("SampleScenario", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the scene and every choice before anything is picked", () => {
    const { scene } = renderSample();

    expect(
      screen.getByRole("heading", { name: scene.title }),
    ).toBeInTheDocument();
    for (const choice of scene.choices) {
      expect(
        screen.getByRole("button", { name: choice.text }),
      ).toBeInTheDocument();
    }
  });

  it("shows what tends to happen after a choice", async () => {
    const user = userEvent.setup();
    const { scene } = renderSample();

    const { choice, button } = choiceButton(scene, 0);
    await user.click(button);

    expect(screen.getByText(choice.response)).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("lets a visitor try a different answer and read that one instead", async () => {
    const user = userEvent.setup();
    const { scene } = renderSample();

    const first = choiceButton(scene, 0);
    const second = choiceButton(scene, 1);

    await user.click(first.button);
    await user.click(second.button);

    expect(screen.getByText(second.choice.response)).toBeInTheDocument();
    expect(screen.queryByText(first.choice.response)).not.toBeInTheDocument();
    expect(second.button).toHaveAttribute("aria-pressed", "true");
  });

  it("marks no choice as correct or incorrect", async () => {
    const user = userEvent.setup();
    const { scene } = renderSample();

    await user.click(choiceButton(scene, 0).button);

    expect(screen.queryByText(/correct|incorrect|wrong answer/i)).toBeNull();
  });

  it("reveals the explanation only when asked, and hides it again", async () => {
    const user = userEvent.setup();
    const { scene, principle } = renderSample();

    expect(screen.queryByText(principle.body)).not.toBeInTheDocument();

    await user.click(choiceButton(scene, 0).button);
    const reveal = screen.getByRole("button", {
      name: /why does this help/i,
    });
    expect(reveal).toHaveAttribute("aria-expanded", "false");

    await user.click(reveal);
    expect(screen.getByText(principle.body)).toBeInTheDocument();
    for (const point of principle.points) {
      expect(screen.getByText(point)).toBeInTheDocument();
    }

    await user.click(screen.getByRole("button", { name: /hide the/i }));
    expect(screen.queryByText(principle.body)).not.toBeInTheDocument();
  });

  it("labels the content as draft rather than implying it is reviewed", () => {
    const { lesson } = renderSample();

    expect(lesson.status).toBe("draft");
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(
      screen.getByText(/not yet reviewed by a qualified human/i),
    ).toBeInTheDocument();
  });

  it("stores nothing at all", async () => {
    const user = userEvent.setup();
    const { scene } = renderSample();

    await user.click(choiceButton(scene, 0).button);
    await user.click(
      screen.getByRole("button", { name: /why does this help/i }),
    );
    await user.click(choiceButton(scene, 1).button);

    // prompts/07-marketing-site.md: the sample scenario must not require or
    // collect child personal data. Playing it through must leave no trace.
    expect(window.localStorage.length).toBe(0);
    expect(document.cookie).toBe("");
  });
});
