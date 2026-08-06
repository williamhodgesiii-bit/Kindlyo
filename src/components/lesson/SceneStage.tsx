import { useId } from "react";
import { cn } from "@/lib/cn";
import { CharacterRig } from "@/components/character/CharacterRig";
import { motifPath } from "./motifs";

/**
 * The scene stage — a story moment built from the shared scenery kit and themed
 * by the module world (docs/design/COMPONENT_STATES.md §06/§08;
 * MODULE_WORLDS.md §2).
 *
 * It assembles the six-layer environment contract bottom-up: a `module.tint`
 * wash, `module.tint-deep` far shapes, the greeting-arch landmark and bush props
 * in the module accent with a 2px ink outline, a `paper` ground band with a 2px
 * ink top rule, two kit characters, and the module motif as light decoration.
 * Colours come entirely from the module theme tokens, so wrapping the lesson in
 * `data-module="…"` re-themes every world without touching this file; the
 * default is Hello Garden.
 *
 * This is the kit *placeholder* the handoff ships today — final per-scene
 * illustration and the rigged `CharacterRig` (with its 31 states) are the
 * illustrator / step-5 deliverables that drop in on top (ASSET_MANIFEST.md,
 * MODULE_WORLDS.md §2). The figures here are static kit geometry.
 *
 * Decorative by contract: the whole stage is `aria-hidden`, because the scene
 * narration beside it carries the entire situation. Nothing in a lesson may be
 * understandable only through the picture (docs/design/ACCESSIBILITY.md).
 *
 * The `consequence` variant reflects that the child has chosen — the near child
 * turns and raises a hello — with the *same* visual weight whatever the choice
 * was. A scene never renders a choice as good or bad (COMPONENT_STATES.md §08).
 */

export type SceneStageProps = {
  /** `scene` is the situation; `consequence` reflects that a choice was made. */
  variant?: "scene" | "consequence";
  /** The module motif shape, drifting as decoration. Defaults to Hello Garden. */
  motif?: string;
  /** Sets `data-module` for standalone use; omit to inherit the ancestor theme. */
  moduleId?: string;
  className?: string;
};

const INK = "var(--llc-color-ink)";

export function SceneStage({
  variant = "scene",
  motif = "petal",
  moduleId,
  className,
}: SceneStageProps) {
  // Unique so two stages on one page cannot share a clip path.
  const clipId = useId();
  const isConsequence = variant === "consequence";

  return (
    <div
      aria-hidden="true"
      data-module={moduleId}
      data-variant={variant}
      className={cn("llc-scene-enter", className)}
    >
      <svg
        viewBox="0 0 320 200"
        role="presentation"
        focusable="false"
        className="block h-auto w-full"
      >
        <clipPath id={clipId}>
          <rect x="0" y="0" width="320" height="200" rx="24" />
        </clipPath>

        <g clipPath={`url(#${clipId})`}>
          {/* 1 · Wash */}
          <rect
            x="0"
            y="0"
            width="320"
            height="200"
            fill="var(--module-tint)"
          />

          {/* 2 · Far shapes — soft silhouettes, no outline */}
          <ellipse
            cx="72"
            cy="152"
            rx="96"
            ry="54"
            fill="var(--module-tint-deep)"
          />
          <ellipse
            cx="252"
            cy="150"
            rx="104"
            ry="58"
            fill="var(--module-tint-deep)"
          />

          {/* 3 · Landmark & props — greeting arch + bloom bushes (accent, 2px ink) */}
          <path
            d="M116 74 Q160 44 204 74 L204 66 Q160 36 116 66 Z"
            fill="var(--module-accent)"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="116"
            y="70"
            width="10"
            height="78"
            rx="3"
            fill="var(--module-accent)"
            stroke={INK}
            strokeWidth="2"
          />
          <rect
            x="194"
            y="70"
            width="10"
            height="78"
            rx="3"
            fill="var(--module-accent)"
            stroke={INK}
            strokeWidth="2"
          />
          <circle
            cx="104"
            cy="142"
            r="16"
            fill="var(--module-accent-soft)"
            stroke={INK}
            strokeWidth="2"
          />
          <circle
            cx="216"
            cy="142"
            r="16"
            fill="var(--module-accent-soft)"
            stroke={INK}
            strokeWidth="2"
          />

          {/* 4 · Ground band — paper tone with a 2px ink top rule */}
          <rect
            x="0"
            y="150"
            width="320"
            height="50"
            fill="var(--llc-color-paper)"
          />
          <line
            x1="0"
            y1="150"
            x2="320"
            y2="150"
            stroke={INK}
            strokeWidth="2"
          />

          {/* 5 · Characters — the cast on the ground band, drawn by the
              parametric rig (step 5) and themed by their own cast colours. The
              far child watches; the near child greets a newcomer once a choice
              is made — the same warm hello whatever the choice was. */}
          <CharacterRig
            character="theo"
            state="idle"
            x={176}
            y={122}
            width={52}
            height={(52 * 152) / 132}
          />
          <CharacterRig
            character="maya"
            state={isConsequence ? "greet" : "idle"}
            x={84}
            y={110}
            width={66}
            height={(66 * 152) / 132}
          />

          {/* 6 · Motif decoration — the module shape, drifting (<= 5 instances) */}
          <g fill="var(--module-accent-soft)" opacity="0.9">
            <path
              d={motifPath(motif)}
              transform="translate(150 46) scale(1.1) rotate(-12)"
            />
            <path
              d={motifPath(motif)}
              transform="translate(176 40) scale(0.9) rotate(20)"
            />
            <path
              d={motifPath(motif)}
              transform="translate(198 54) scale(0.8) rotate(-6)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
