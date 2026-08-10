"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { SceneStage } from "@/components/lesson/SceneStage";
import { Text } from "@/components/ui/Typography";
import { neighborhoodWorlds } from "@/content/worlds";
import { cn } from "@/lib/cn";

/**
 * The interactive homepage centrepiece — a visitor drives the product's *own*
 * scene engine across the whole neighbourhood.
 *
 * Every world (docs/design/MODULE_WORLDS.md; `src/content/worlds.ts`) is a place
 * a child already knows — a café table, a treehouse, a front door. Choosing one
 * re-themes and re-places the real `SceneStage` (the same component a lesson
 * draws) to that world and names, in the world's own child-facing line, the
 * kind of moment it turns into a short rehearsal. It shows the promise —
 * "situations, not a list of rules" — instead of claiming it, and it is a
 * preview of the actual app, not a marketing one-off.
 *
 * Calm by contract, because this is a children's product:
 *
 * - **Decorative picture, meaning in words.** The scene is `aria-hidden` (its
 *   own contract); the caption carries what changed, in an `aria-live="polite"`
 *   region so a screen-reader hears it. Nothing is understandable only through
 *   the illustration.
 * - **Real radio-group semantics.** Roving `tabIndex`, arrow / Home / End keys,
 *   `aria-checked`, 44px targets. Selection is shown by a dot and weight, never
 *   colour alone.
 * - **Gentle, meaningful motion only.** The one movement is the scene's own
 *   one-shot `llc-scene-enter` rise-and-fade, replayed when the place genuinely
 *   changes; the global reduced-motion rule collapses it to the final frame.
 *   No loop, no parallax, no pointer-follow, no reward burst.
 * - **Tokens only.** The frame and chips theme themselves from each world's
 *   `[data-module]` tokens — no raw hex, no gradients (DESIGN_SYSTEM.md).
 */

/**
 * One representative authored scene key per world, chosen so each reads as a
 * different *place* (its archetype landmark — docs/DECISIONS.md 044). Keys are
 * real content keys from `illustrationKeyArchetypes`; an unmapped one would only
 * fall back to the neutral gathering place, never break.
 */
const PLACE_KEY: Record<string, string> = {
  "hello-garden": "two-children-meeting",
  "echo-treehouse": "treehouse-canopy",
  "friendship-forest": "forest-path",
  "build-it-workshop": "workshop-table",
  "bridge-builders-bay": "bay-bridge",
  "thankful-kitchen": "kitchen-shelf",
  "welcome-home": "home-door",
  "community-town": "town-square",
  "sunny-table-cafe": "cafe-table",
  "pixel-plaza": "plaza-screen",
  "brave-basecamp": "basecamp-tent",
  "world-garden": "two-children-talking",
};

const moments = neighborhoodWorlds.map((world) => ({
  id: world.id,
  title: world.title,
  teaches: world.teaches,
  motif: world.motif,
  illustrationKey: PLACE_KEY[world.id] ?? "two-children-meeting",
}));

export type MomentExplorerProps = {
  className?: string;
};

export function MomentExplorer({ className }: MomentExplorerProps) {
  const [selectedId, setSelectedId] = useState(moments[0]!.id);
  const captionId = useId();
  const groupRef = useRef<HTMLDivElement>(null);

  const selectedIndex = Math.max(
    0,
    moments.findIndex((moment) => moment.id === selectedId),
  );
  const selected = moments[selectedIndex]!;

  function selectAt(index: number, moveFocus: boolean) {
    const next = (index + moments.length) % moments.length;
    setSelectedId(moments[next]!.id);
    if (moveFocus) {
      const radios =
        groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      radios?.[next]?.focus();
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        selectAt(selectedIndex + 1, true);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        selectAt(selectedIndex - 1, true);
        break;
      case "Home":
        event.preventDefault();
        selectAt(0, true);
        break;
      case "End":
        event.preventDefault();
        selectAt(moments.length - 1, true);
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={cn(
        "grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12",
        className,
      )}
    >
      {/* The living preview — themed frame, decorative scene. */}
      <div
        data-module={selected.id}
        className="overflow-hidden rounded-3xl border-2 bg-surface p-2 shadow-sm"
        style={{ borderColor: "var(--module-accent)" }}
      >
        {/* Keyed so a real change of place replays the scene's own gentle
            entrance; reduced motion collapses it to the final frame. */}
        <div key={selected.id} className="llc-scene-enter">
          <SceneStage
            illustrationKey={selected.illustrationKey}
            motif={selected.motif}
          />
        </div>
      </div>

      <div>
        <p id={captionId} aria-live="polite" className="min-h-[3.5rem]">
          <span className="text-lg font-semibold text-text-primary">
            {selected.title}
          </span>
          <span className="text-lg text-text-secondary">
            {" — "}
            {selected.teaches}.
          </span>
        </p>

        <div
          ref={groupRef}
          role="radiogroup"
          aria-label="Choose a place to preview"
          aria-describedby={captionId}
          onKeyDown={onKeyDown}
          className="mt-4 flex flex-wrap gap-2"
        >
          {moments.map((moment, index) => {
            const isSelected = moment.id === selectedId;
            return (
              <button
                key={moment.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                data-module={isSelected ? moment.id : undefined}
                onClick={() => selectAt(index, false)}
                style={
                  isSelected
                    ? {
                        borderColor: "var(--module-accent)",
                        backgroundColor: "var(--module-tint)",
                      }
                    : undefined
                }
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isSelected
                    ? "font-semibold text-text-primary"
                    : "border-border bg-surface text-text-secondary hover:border-brand-secondary hover:text-text-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isSelected ? "" : "opacity-0",
                  )}
                  style={
                    isSelected
                      ? { backgroundColor: "var(--module-accent)" }
                      : undefined
                  }
                />
                {moment.title}
              </button>
            );
          })}
        </div>

        <Text tone="secondary" size="sm" className="mt-5 max-w-prose">
          Each place is a small module of short lessons. A child practises one
          everyday moment at a time — notice someone, choose what to do, see
          what tends to follow, then one small thing to try away from the
          screen.
        </Text>
      </div>
    </div>
  );
}
