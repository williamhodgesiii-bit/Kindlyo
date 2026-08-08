import { CharacterRig } from "@/components/character/CharacterRig";
import { cn } from "@/lib/cn";

/**
 * The marketing homepage hero illustration.
 *
 * Decorative by contract. The whole scene is `aria-hidden` with a
 * `role="presentation"` SVG and `focusable="false"` — the hero `<h1>` and its
 * copy carry the entire meaning, and nothing here may be understandable only
 * through the picture (docs/design/ACCESSIBILITY.md; the same contract every
 * SVG in this repo follows). It adds no accessible name, no tab stop, and no
 * text baked into the artwork, so it can never smuggle in a claim the copy does
 * not make (docs/MARKETING_SITE.md, "show, never claim").
 *
 * It is built in the product's own visual language — the "Storybook Geometry"
 * recipe used by the lesson `SceneStage`: a flat `module.tint` wash, softer
 * `module.tint-deep` far shapes, an accent landmark and bloom bushes carrying a
 * 2px `llc.color.ink` outline, a `paper` ground band, and the real cast drawn
 * by the shared `CharacterRig`. Colours are tokens only (no raw hex, no
 * gradients — the system forbids both except Glim's glow), so the scene themes
 * itself from `src/styles/tokens.css` and matches the app a visitor is about to
 * meet rather than being a throwaway marketing one-off.
 *
 * The greeting is a **wave**, never a handshake, hug, or locked eye contact:
 * the curriculum (and the copy on this very page) promises that nothing
 * requires touch or eye contact, so the hero must not depict the opposite. The
 * two figures use different skin-ramp steps and hair, echoing the cast's
 * inclusivity without making a documentary claim about who uses Kindlyo.
 *
 * Motion is a single one-shot entrance (`.llc-scene-enter`: a 20px rise + fade,
 * `both` fill so it rests visible without JS). There is no loop, no parallax,
 * no SMIL, and no pointer-follow — a marketing hero has no functional reason to
 * keep moving, and the global reduced-motion rule in `globals.css` collapses
 * the one entrance to its final, fully-visible frame for anyone who asks.
 *
 * Appearance is owned here; the caller owns layout and size via `className`
 * (docs/COMPONENTS.md).
 */

const INK = "var(--llc-color-ink)";

export type HeroSceneProps = {
  className?: string;
};

export function HeroScene({ className }: HeroSceneProps) {
  return (
    <div aria-hidden="true" className={cn("llc-scene-enter", className)}>
      <svg
        viewBox="0 0 400 260"
        role="presentation"
        focusable="false"
        className="block h-auto w-full"
      >
        {/* 1 · Wash */}
        <rect
          x="0"
          y="0"
          width="400"
          height="260"
          rx="24"
          fill="var(--module-tint)"
        />

        {/* Warm light — a single flat disc, no gradient, no glow, no loop */}
        <circle
          cx="330"
          cy="66"
          r="40"
          fill="var(--module-accent-soft)"
          opacity="0.55"
        />

        {/* 2 · Far shapes — soft rolling ground, no outline */}
        <ellipse
          cx="96"
          cy="214"
          rx="150"
          ry="72"
          fill="var(--module-tint-deep)"
        />
        <ellipse
          cx="318"
          cy="212"
          rx="150"
          ry="78"
          fill="var(--module-tint-deep)"
        />

        {/* 3 · Landmark — a home threshold (arch + posts) and bloom bushes,
            accent with a 2px ink outline */}
        <path
          d="M150 120 Q200 70 250 120 L250 108 Q200 58 150 108 Z"
          fill="var(--module-accent)"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect
          x="150"
          y="116"
          width="12"
          height="80"
          rx="4"
          fill="var(--module-accent)"
          stroke={INK}
          strokeWidth="2"
        />
        <rect
          x="238"
          y="116"
          width="12"
          height="80"
          rx="4"
          fill="var(--module-accent)"
          stroke={INK}
          strokeWidth="2"
        />
        <circle
          cx="128"
          cy="188"
          r="20"
          fill="var(--module-accent-soft)"
          stroke={INK}
          strokeWidth="2"
        />
        <circle
          cx="276"
          cy="188"
          r="20"
          fill="var(--module-accent-soft)"
          stroke={INK}
          strokeWidth="2"
        />

        {/* 4 · Ground band — paper tone with a 2px ink top rule */}
        <rect
          x="0"
          y="196"
          width="400"
          height="64"
          fill="var(--llc-color-paper)"
        />
        <line x1="0" y1="196" x2="400" y2="196" stroke={INK} strokeWidth="2" />

        {/* 5 · The cast — two friends waving hello. Different skin and hair;
            a wave, not a touch. */}
        <CharacterRig
          character="maya"
          state="wave"
          x={78}
          y={98}
          width={96}
          height={(96 * 152) / 132}
        />
        <CharacterRig
          character="theo"
          state="wave"
          x={250}
          y={110}
          width={84}
          height={(84 * 152) / 132}
        />

        {/* 6 · A few still blooms — decoration, never a drifting reward loop */}
        <g fill="var(--module-accent-soft)" opacity="0.9">
          <Bloom x={112} y={150} scale={0.9} />
          <Bloom x={292} y={148} scale={1} />
          <Bloom x={200} y={60} scale={0.8} />
        </g>
      </svg>
    </div>
  );
}

/** A small five-petal bloom, drawn locally so the hero owns no lesson code. */
function Bloom({ x, y, scale }: { x: number; y: number; scale: number }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-6"
          rx="3.2"
          ry="6"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle cx="0" cy="0" r="2.6" fill="var(--module-accent)" />
    </g>
  );
}
