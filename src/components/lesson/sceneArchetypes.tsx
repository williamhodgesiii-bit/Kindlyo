/**
 * Scene archetypes — the small, closed set of *places* a lesson beat can look
 * like.
 *
 * Every `LessonScene` carries an authored `illustrationKey` (e.g. `cafe-table`,
 * `home-door`, `treehouse-canopy`). Until now the lesson player ignored it and
 * drew one fixed garden scene for every beat, so a café beat and a treehouse
 * beat were visually identical. That flatness is what this module fixes: it
 * maps each key to one of a handful of generic scenery archetypes, and
 * `SceneStage` renders the archetype's landmark layer so beats stop looking the
 * same (docs/DECISIONS.md 043).
 *
 * Deliberately *scenery only*. The two cast characters and the equal-weight
 * `consequence` behaviour are unchanged, and NOTHING here reads the child's
 * choice. Archetype is a pure function of `illustrationKey` — a scene-level
 * value — so the same beat renders identically whatever the child picked. That
 * is the guarantee that keeps the picture from ever grading a choice
 * (docs/CURRICULUM_PRINCIPLES.md, "no right answer"). Character expression
 * derived from the situation is a separate, human-reviewed follow-up and is not
 * done here.
 *
 * The scenery is decorative kit geometry: built from the same primitive shapes
 * as the rest of the stage (soft far silhouettes, rounded-rect props, a 2px ink
 * outline), coloured entirely from the module theme tokens so world theming
 * still stacks on top, and carrying no text. The whole stage stays
 * `aria-hidden`; the narration beside it carries the entire situation, so no
 * archetype may be the sole source of any meaning (docs/design/ACCESSIBILITY.md).
 */

/** The closed set of scenery kinds. `gathering` is also the safe fallback. */
export const sceneArchetypes = [
  "gathering",
  "table",
  "interior",
  "doorway",
  "open-outdoor",
  "path",
  "canopy",
  "screen",
  "waterside",
  "workshop",
] as const;

export type SceneArchetype = (typeof sceneArchetypes)[number];

/** The neutral fallback: the original greeting-arch place. */
export const FALLBACK_ARCHETYPE: SceneArchetype = "gathering";

/**
 * Every authored `illustrationKey` in `src/content/**`, mapped to its scenery.
 *
 * An explicit table rather than substring inference, so a reviewer can read
 * exactly what each key looks like and a newly authored key that nobody mapped
 * fails the coverage test (sceneArchetypes.test.ts) rather than silently
 * collapsing onto the fallback in production.
 */
export const illustrationKeyArchetypes = {
  // Meeting People — Hello Garden
  "two-children-meeting": "gathering",
  "two-children-talking": "gathering",
  "group-of-children": "gathering",
  "waving-goodbye": "doorway",
  "garden-fountain": "open-outdoor",
  "garden-planters": "open-outdoor",
  "garden-table": "table",
  "art-table-morning": "table",
  // Echo Treehouse
  "treehouse-canopy": "canopy",
  "listening-leaves": "canopy",
  "two-on-cushions": "interior",
  // Friendship Forest
  "forest-clearing": "open-outdoor",
  "forest-path": "path",
  "forest-bench": "canopy",
  "forest-log": "canopy",
  // Build-it Workshop
  "workshop-table": "workshop",
  "workshop-build": "workshop",
  "workshop-tools": "workshop",
  "workshop-plank": "workshop",
  "workshop-pulley": "workshop",
  "workshop-blocks": "workshop",
  // Sunny Table Café
  "cafe-table": "table",
  "cafe-menu": "table",
  "cafe-pitcher": "table",
  // Thankful Kitchen
  "kitchen-pot": "table",
  "kitchen-shelf": "interior",
  "kitchen-jars": "interior",
  // Welcome Home
  "home-door": "doorway",
  "home-interior": "interior",
  "home-sofa": "interior",
  // Pixel Plaza
  "plaza-screen": "screen",
  "plaza-kiosk": "screen",
  // Community Town
  "town-square": "open-outdoor",
  "town-path": "path",
  "town-library": "interior",
  "town-bus": "path",
  // Bridge Builders Bay
  "bay-platform": "waterside",
  "bay-bridge": "waterside",
  "bay-boat": "waterside",
  // Brave Basecamp
  "basecamp-tent": "open-outdoor",
  "basecamp-flag": "open-outdoor",
  "basecamp-compass": "open-outdoor",
  "basecamp-board": "open-outdoor",
  "basecamp-trail": "path",
  // World Garden (culture)
  // (reuses the shared garden keys above)
} satisfies Record<string, SceneArchetype>;

/**
 * Resolve an illustration key to a scenery archetype.
 *
 * Total and non-throwing: an unknown or missing key falls back to the neutral
 * `gathering` place, mirroring the "unknown key → neutral drawing, never a
 * crash" contract the lesson engine already relies on
 * (docs/LESSON_ENGINE.md). It reads only the key, never any choice.
 */
export function resolveSceneArchetype(
  illustrationKey?: string,
): SceneArchetype {
  if (!illustrationKey) return FALLBACK_ARCHETYPE;
  return (
    (illustrationKeyArchetypes as Record<string, SceneArchetype>)[
      illustrationKey
    ] ?? FALLBACK_ARCHETYPE
  );
}

const INK = "var(--llc-color-ink)";
const STROKE = { stroke: INK, strokeWidth: 2 } as const;

/**
 * The landmark layer for one archetype — layer 3 of the stage's scenery
 * contract (docs/design/COMPONENT_STATES.md §06). Drawn behind the cast, in the
 * module accent with a 2px ink outline, from generic primitives so nothing
 * reads as a specific real place or a specific product. No text, no device
 * chrome, no logos, no motion.
 */
export function ArchetypeScenery({ archetype }: { archetype: SceneArchetype }) {
  switch (archetype) {
    case "table":
      // A striped market/café awning across the back.
      return (
        <g>
          <rect
            x="64"
            y="52"
            width="192"
            height="22"
            rx="8"
            fill="var(--module-accent)"
            {...STROKE}
            strokeLinejoin="round"
          />
          <line x1="112" y1="52" x2="112" y2="74" {...STROKE} />
          <line x1="160" y1="52" x2="160" y2="74" {...STROKE} />
          <line x1="208" y1="52" x2="208" y2="74" {...STROKE} />
          <rect
            x="70"
            y="74"
            width="8"
            height="74"
            rx="3"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <rect
            x="242"
            y="74"
            width="8"
            height="74"
            rx="3"
            fill="var(--module-accent)"
            {...STROKE}
          />
        </g>
      );

    case "interior":
      // A wall with a window and a framed picture: a room, not the outdoors.
      return (
        <g>
          <rect
            x="196"
            y="48"
            width="68"
            height="60"
            rx="6"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
          <line x1="230" y1="48" x2="230" y2="108" {...STROKE} />
          <line x1="196" y1="78" x2="264" y2="78" {...STROKE} />
          <rect
            x="58"
            y="56"
            width="44"
            height="34"
            rx="4"
            fill="var(--module-accent)"
            {...STROKE}
          />
        </g>
      );

    case "doorway":
      // A generic arched doorway — an empty frame, no greeting ritual implied.
      return (
        <g>
          <path
            d="M126 148 L126 84 Q126 44 160 44 Q194 44 194 84 L194 148 Z"
            fill="var(--module-accent)"
            {...STROKE}
            strokeLinejoin="round"
          />
          <path
            d="M138 148 L138 88 Q138 58 160 58 Q182 58 182 88 L182 148 Z"
            fill="var(--module-tint-deep)"
          />
          <circle
            cx="176"
            cy="104"
            r="3.5"
            fill="var(--module-accent)"
            {...STROKE}
          />
        </g>
      );

    case "open-outdoor":
      // A round tree and a soft sun: open outdoors.
      return (
        <g>
          <circle
            cx="252"
            cy="60"
            r="18"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
          <rect
            x="66"
            y="104"
            width="10"
            height="46"
            rx="3"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <circle
            cx="71"
            cy="88"
            r="26"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
        </g>
      );

    case "path":
      // A path narrowing toward the viewer, and a simple signpost.
      return (
        <g>
          <path
            d="M150 150 L172 150 L200 90 L188 90 Z"
            fill="var(--module-accent-soft)"
            opacity="0.9"
          />
          <rect
            x="238"
            y="72"
            width="8"
            height="78"
            rx="3"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <rect
            x="214"
            y="78"
            width="42"
            height="14"
            rx="4"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <rect
            x="222"
            y="96"
            width="36"
            height="12"
            rx="4"
            fill="var(--module-accent)"
            {...STROKE}
          />
        </g>
      );

    case "canopy":
      // A big tree with a small plank platform: up among the branches.
      return (
        <g>
          <rect
            x="150"
            y="86"
            width="18"
            height="64"
            rx="4"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <circle
            cx="120"
            cy="64"
            r="28"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
          <circle
            cx="160"
            cy="54"
            r="32"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
          <circle
            cx="198"
            cy="64"
            r="28"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
          <rect
            x="112"
            y="108"
            width="96"
            height="8"
            rx="3"
            fill="var(--module-accent)"
            {...STROKE}
          />
        </g>
      );

    case "screen":
      // A plain display panel on a stand. No device chrome, UI, icons, or
      // mascot — a neutral rectangle, on purpose (originality + not valorising
      // screen time).
      return (
        <g>
          <rect
            x="116"
            y="46"
            width="88"
            height="60"
            rx="8"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <rect
            x="124"
            y="54"
            width="72"
            height="44"
            rx="4"
            fill="var(--module-tint-deep)"
          />
          <rect
            x="156"
            y="106"
            width="8"
            height="20"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <ellipse
            cx="160"
            cy="130"
            rx="26"
            ry="6"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
        </g>
      );

    case "waterside":
      // A gentle water band and a small sailing boat.
      return (
        <g>
          <path
            d="M0 132 Q40 124 80 132 T160 132 T240 132 T320 132 L320 150 L0 150 Z"
            fill="var(--module-tint-deep)"
          />
          <path
            d="M118 118 L206 118 L192 134 L132 134 Z"
            fill="var(--module-accent)"
            {...STROKE}
            strokeLinejoin="round"
          />
          <line x1="162" y1="118" x2="162" y2="78" {...STROKE} />
          <path
            d="M162 80 L162 112 L196 112 Z"
            fill="var(--module-accent-soft)"
            {...STROKE}
            strokeLinejoin="round"
          />
        </g>
      );

    case "workshop":
      // A pegboard with a couple of hung tools and a sawhorse.
      return (
        <g>
          <rect
            x="198"
            y="48"
            width="64"
            height="56"
            rx="4"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
          <circle cx="214" cy="64" r="2.5" fill={INK} />
          <circle cx="246" cy="64" r="2.5" fill={INK} />
          <circle cx="230" cy="86" r="2.5" fill={INK} />
          <rect
            x="210"
            y="66"
            width="8"
            height="26"
            rx="4"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <path
            d="M242 66 L252 66 L247 92 Z"
            fill="var(--module-accent)"
            {...STROKE}
            strokeLinejoin="round"
          />
          <path
            d="M70 150 L86 112 M118 150 L102 112 M84 128 L104 128"
            {...STROKE}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );

    case "gathering":
    default:
      // The original greeting arch and bloom bushes — the neutral fallback.
      return (
        <g>
          <path
            d="M116 74 Q160 44 204 74 L204 66 Q160 36 116 66 Z"
            fill="var(--module-accent)"
            {...STROKE}
            strokeLinejoin="round"
          />
          <rect
            x="116"
            y="70"
            width="10"
            height="78"
            rx="3"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <rect
            x="194"
            y="70"
            width="10"
            height="78"
            rx="3"
            fill="var(--module-accent)"
            {...STROKE}
          />
          <circle
            cx="104"
            cy="142"
            r="16"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
          <circle
            cx="216"
            cy="142"
            r="16"
            fill="var(--module-accent-soft)"
            {...STROKE}
          />
        </g>
      );
  }
}
