/**
 * The cast — five children and Glim, one parametric rig
 * (docs/design/CHARACTER_BIBLE.md).
 *
 * Every figure is the same rig with different inputs: a skin ramp step, a hair
 * style, a signature `llc.cast.*` colour, and one accessory. Pose and expression
 * are separate inputs (see `states.ts`), so this file is only *who* a character
 * is, never *what they are doing*.
 *
 * Colours use the design tokens wherever the system defines one — cast colours,
 * the six-step skin ramp, ink, and the neutral bottoms all resolve to
 * `src/styles/tokens.css`. The few values the token system does not name (the
 * dark hair browns and the soft blush tints) live here as the character art
 * palette: placeholders at final proportions that a human illustrator refines
 * without touching the grid (CHARACTER_BIBLE.md, ASSET_MANIFEST.md). They are
 * kept in this one module rather than scattered through the components.
 */

export const characterIds = ["maya", "theo", "amara", "jun", "nora"] as const;

export type CharacterId = (typeof characterIds)[number];

export type HairStyle = "buns" | "curly" | "braids" | "fringe" | "bob";

export type CharacterDef = {
  id: CharacterId;
  name: string;
  age: number;
  hair: HairStyle;
  /** Signature top colour — a cast token. */
  cast: string;
  /** Skin, a step of the shared ramp token. */
  skin: string;
  /** Hair colour (character art palette). */
  hairColor: string;
  /** Soft blush/echo tint (character art palette). */
  soft: string;
  /** The one accessory slot, which may take the module accent in scenes. */
  accessory: string;
};

/** Shared rig colours (tokens). */
export const INK = "var(--llc-color-ink)";
export const LEG = "var(--llc-color-ink-soft)";
export const SURFACE = "var(--llc-color-surface)";

export const characters: Record<CharacterId, CharacterDef> = {
  maya: {
    id: "maya",
    name: "Maya",
    age: 8,
    hair: "buns",
    cast: "var(--llc-cast-maya)",
    skin: "var(--llc-skin-3)",
    hairColor: "#4a2e1d",
    soft: "#e8c4b8",
    accessory: "hair ties",
  },
  theo: {
    id: "theo",
    name: "Theo",
    age: 6,
    hair: "curly",
    cast: "var(--llc-cast-theo)",
    skin: "var(--llc-skin-1)",
    hairColor: "#2e2218",
    soft: "#b9cdc4",
    accessory: "glasses frames",
  },
  amara: {
    id: "amara",
    name: "Amara",
    age: 9,
    hair: "braids",
    cast: "var(--llc-cast-amara)",
    skin: "var(--llc-skin-6)",
    hairColor: "#1f1712",
    soft: "#f0ddb8",
    accessory: "braid beads",
  },
  jun: {
    id: "jun",
    name: "Jun",
    age: 7,
    hair: "fringe",
    cast: "var(--llc-cast-jun)",
    skin: "var(--llc-skin-2)",
    hairColor: "#191410",
    soft: "#c2cae8",
    accessory: "cowlick clip",
  },
  nora: {
    id: "nora",
    name: "Nora",
    age: 5,
    hair: "bob",
    cast: "var(--llc-cast-nora)",
    skin: "var(--llc-skin-4)",
    // The one hair colour the ramp already names.
    hairColor: "var(--llc-skin-5)",
    soft: "#c3ceda",
    accessory: "card lanyard",
  },
};

/**
 * Glim — the clubhouse lantern (companion, not judge). No limbs; expression is
 * tilt, hop, and glow only. The body is the Glim cast token; the brass metal and
 * the warm glow are Glim's own palette (the single sanctioned glow in the
 * system), kept here beside the cast.
 */
export const glim = {
  body: "var(--llc-cast-glim)",
  glass: SURFACE,
  /** Brass metal — cap, base, and the dot eyes/mouth. */
  metal: "#8a5a1c",
  /** The warm lantern glow (the only sanctioned glow). */
  glow: "#f6dfad",
};
