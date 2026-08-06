import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { INK, glim } from "./cast";

/**
 * Glim — the clubhouse lantern, and its wonder-bubble
 * (docs/design/CHARACTER_BIBLE.md, "Glim").
 *
 * A companion, not a judge: Glim can't talk, has no limbs, and never declares
 * anyone good or bad. Expression lives entirely in tilt, hop, and glow — the one
 * sanctioned glow in the system. Its `dim_rest` resting state is **never**
 * triggered by a child's choice.
 *
 * The lantern is decorative (`aria-hidden`); when Glim wonders something, the
 * `message` is the real content — an icon plus narrated text, since Glim asks
 * with a bubble rather than a voice. The question is Glim's, never a verdict on
 * the child.
 */

export type GlimState =
  "dim_rest" | "glow_notice" | "wonder_tilt" | "path_light" | "celebrate_small";

type GlimStateDef = {
  tilt: number;
  glow: number;
  eyes: "open" | "up" | "closed";
  hop?: boolean;
};

export const glimStates = {
  // Resting glow — never dims because of a choice.
  dim_rest: { tilt: 0, glow: 0.45, eyes: "open" },
  glow_notice: { tilt: -6, glow: 0.85, eyes: "open" },
  wonder_tilt: { tilt: 10, glow: 0.65, eyes: "up" },
  path_light: { tilt: -4, glow: 0.95, eyes: "open" },
  celebrate_small: { tilt: -3, glow: 1, eyes: "closed", hop: true },
} satisfies Record<GlimState, GlimStateDef>;

function Lantern({ state, size }: { state: GlimState; size: number }) {
  const s: GlimStateDef = glimStates[state];
  const glowId = useId();
  const dy = s.eyes === "up" ? -2 : 0;

  return (
    <svg
      viewBox="0 0 70 96"
      width={size}
      height={(size * 96) / 70}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className="block"
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="20%" stopColor={glim.glow} stopOpacity={1} />
          <stop offset="70%" stopColor={glim.glow} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(0 ${s.hop ? -4 : 0}) rotate(${s.tilt} 35 86.4)`}>
        {/* Handle */}
        <path
          d="M20 14 Q20 1 35 1 Q50 1 50 14"
          fill="none"
          stroke={glim.metal}
          strokeWidth={3}
        />
        {/* Body */}
        <rect
          x={8}
          y={13}
          width={54}
          height={66}
          rx={12}
          fill={glim.body}
          stroke={INK}
          strokeWidth={2}
        />
        {/* Glass */}
        <rect
          x={18}
          y={23}
          width={34}
          height={46}
          rx={8}
          fill={glim.glass}
          stroke={glim.metal}
          strokeWidth={2}
        />
        {/* Glow — the one sanctioned glow */}
        <circle
          cx={35}
          cy={40}
          r={13}
          fill={`url(#${glowId})`}
          opacity={s.glow}
        />
        {/* Eyes */}
        {s.eyes === "closed" ? (
          <>
            <rect x={26} y={42} width={7} height={2} rx={1} fill={glim.metal} />
            <rect x={37} y={42} width={7} height={2} rx={1} fill={glim.metal} />
          </>
        ) : (
          <>
            <circle cx={29} cy={42 + dy} r={2} fill={glim.metal} />
            <circle cx={41} cy={42 + dy} r={2} fill={glim.metal} />
          </>
        )}
        {/* Mouth */}
        <path
          d="M31 51 Q35 55 39 51"
          fill="none"
          stroke={glim.metal}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Base feet */}
        <rect x={16} y={80} width={12} height={8} rx={5} fill={glim.metal} />
        <rect x={42} y={80} width={12} height={8} rx={5} fill={glim.metal} />
      </g>
    </svg>
  );
}

export type GlimBubbleProps = {
  /** Glim's glow/pose state. Defaults to the resting glow. */
  state?: GlimState;
  /** The narrated wonder. When present, renders the bubble as real content. */
  message?: string;
  /** A small icon inside the bubble (decorative). */
  icon?: ReactNode;
  /** Rendered lantern width in px. */
  size?: number;
  className?: string;
};

export function GlimBubble({
  state = "dim_rest",
  message,
  icon,
  size = 72,
  className,
}: GlimBubbleProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Lantern state={state} size={size} />
      {message !== undefined ? (
        <p className="mt-2 max-w-xs rounded-lg border border-border bg-surface-muted px-4 py-3 text-text-primary">
          {icon ? (
            <span
              aria-hidden="true"
              className="mr-2 inline-flex align-[-0.15em] text-module-accent-strong"
            >
              {icon}
            </span>
          ) : null}
          {message}
        </p>
      ) : null}
    </div>
  );
}
