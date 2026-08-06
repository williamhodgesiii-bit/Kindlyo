/**
 * The animation-state contract — one rig, one state library, every character
 * (docs/design/CHARACTER_BIBLE.md, "Animation-state contract"). The bible's
 * prose says "31 states" but its sheet enumerates 32; the contract is to
 * implement exactly those names, so this follows the enumeration.
 *
 * The state names are engineering-stable identifiers: the rig is implemented
 * against exactly these, and **no state is ever named `correct`, `wrong`,
 * `failure`, `bad`, or `rude`** — scene feedback (`helpful/mixed/needs-context`)
 * is a property of the scene, never of a character. A test guards that.
 *
 * Each state is a set of rig parameters — body tilt, the two arm rotations
 * (and optional lengths), an open palm, a small hop — plus the expression it
 * carries and, for the record, its Little Motions token and reduced-motion
 * fallback (MOTION.md). Today these ship as static / transition swaps; the
 * reduced-motion column is the baseline, with richer continuous motion a later
 * Rive pass (CHARACTER_BIBLE.md "Implementation notes").
 */

export type Eyes = "open" | "closed" | "up" | "down";
export type Mouth =
  "small" | "smile" | "grin" | "flat" | "wobble" | "open" | "o";
export type Brows = "none" | "worry" | "raise";

/** A head-only expression: eyes, mouth, brows, blush. */
export type FacePose = {
  eyes: Eyes;
  mouth: Mouth;
  brows?: Brows;
  blush?: boolean;
};

/** A full-body pose: a face plus limb rotations and a body tilt. */
export type Pose = FacePose & {
  /** Body tilt in degrees (± small). */
  tilt: number;
  /** Left / right arm rotation in degrees. */
  rotL: number;
  rotR: number;
  /** Optional arm lengths (default 46). */
  lenL?: number;
  lenR?: number;
  /** Draw an open palm at the extended right hand (boundary / permission). */
  palm?: boolean;
  /** A small upward hop (celebration only). */
  hop?: boolean;
};

export type ExpressionName =
  | "neutral"
  | "happy"
  | "curious"
  | "uncertain"
  | "proud"
  | "gently-disappointed";

export const expressionNames = [
  "neutral",
  "happy",
  "curious",
  "uncertain",
  "proud",
  "gently-disappointed",
] as const satisfies readonly ExpressionName[];

/** The six head-only expressions (reduced motion swaps to these). */
export const expressions = {
  neutral: { eyes: "open", mouth: "small" },
  happy: { eyes: "open", mouth: "smile", blush: true },
  curious: { eyes: "up", mouth: "o", brows: "raise" },
  uncertain: { eyes: "open", mouth: "wobble", brows: "worry", blush: true },
  proud: { eyes: "closed", mouth: "grin" },
  "gently-disappointed": { eyes: "down", mouth: "flat", brows: "worry" },
} satisfies Record<ExpressionName, FacePose>;

export type StateGroup =
  | "core"
  | "locomotion"
  | "social"
  | "feeling"
  | "celebration"
  | "care"
  | "repair";

export const characterStateNames = [
  "idle",
  "idle_variant",
  "enter",
  "exit",
  "walk",
  "sit",
  "stand",
  "wave",
  "greet",
  "listen",
  "speak",
  "think",
  "notice",
  "curious",
  "uncertain",
  "encouraged",
  "disappointed_gentle",
  "relieved",
  "proud",
  "celebrate_small",
  "celebrate_module",
  "offer_object",
  "receive_object",
  "invite",
  "join_group",
  "wait_for_pause",
  "ask_permission",
  "give_space",
  "apologize",
  "accept_apology",
  "ask_for_help",
  "say_no_confidently",
] as const;

export type CharacterState = (typeof characterStateNames)[number];

export type CharacterStateDef = {
  group: StateGroup;
  pose: Pose;
  /** Little Motions token (MOTION.md). */
  token: string;
  /** What the state becomes when the viewer prefers reduced motion. */
  reducedMotion: string;
};

/**
 * The whole library. `satisfies Record<CharacterState, …>` means the contract
 * and the implementation cannot drift: adding a name without a pose, or a pose
 * without a name, is a type error.
 */
export const characterStates = {
  idle: {
    group: "core",
    pose: { tilt: 0, rotL: 6, rotR: -6, eyes: "open", mouth: "small" },
    token: "3s cycle · calm-scene",
    reducedMotion: "static",
  },
  idle_variant: {
    group: "core",
    pose: { tilt: 1, rotL: 6, rotR: -8, eyes: "open", mouth: "small" },
    token: "motion.ui · gentle-enter",
    reducedMotion: "static",
  },
  enter: {
    group: "core",
    pose: { tilt: 0, rotL: 8, rotR: -8, eyes: "open", mouth: "small" },
    token: "motion.scene · calm-scene",
    reducedMotion: "fade in",
  },
  exit: {
    group: "core",
    pose: { tilt: 0, rotL: 6, rotR: -6, eyes: "open", mouth: "small" },
    token: "motion.card · gentle-exit",
    reducedMotion: "fade out",
  },
  walk: {
    group: "locomotion",
    pose: { tilt: 0, rotL: 22, rotR: -22, eyes: "open", mouth: "small" },
    token: "per-step 400ms · calm-scene",
    reducedMotion: "position slide",
  },
  sit: {
    group: "locomotion",
    pose: { tilt: 0, rotL: 12, rotR: -12, eyes: "open", mouth: "small" },
    token: "motion.ui · soft-settle",
    reducedMotion: "state swap",
  },
  stand: {
    group: "locomotion",
    pose: { tilt: 0, rotL: 6, rotR: -6, eyes: "open", mouth: "small" },
    token: "motion.ui · soft-settle",
    reducedMotion: "state swap",
  },
  wave: {
    group: "social",
    pose: { tilt: -2, rotL: 8, rotR: -150, eyes: "open", mouth: "smile" },
    token: "motion.reaction · playful",
    reducedMotion: "static raised arm",
  },
  greet: {
    group: "social",
    pose: {
      tilt: -4,
      rotL: 8,
      rotR: -140,
      eyes: "open",
      mouth: "open",
      blush: true,
    },
    token: "motion.reaction · gentle-enter",
    reducedMotion: "expression swap",
  },
  listen: {
    group: "social",
    pose: { tilt: 5, rotL: 8, rotR: -8, eyes: "open", mouth: "small" },
    token: "motion.ui · gentle-enter",
    reducedMotion: "static listening pose",
  },
  speak: {
    group: "social",
    pose: { tilt: -2, rotL: 6, rotR: -62, eyes: "open", mouth: "open" },
    token: "per-line · gentle-enter",
    reducedMotion: "static speaking pose",
  },
  think: {
    group: "feeling",
    pose: { tilt: -4, rotL: 6, rotR: -142, eyes: "up", mouth: "o" },
    token: "motion.ui · curious",
    reducedMotion: "static thinking pose",
  },
  notice: {
    group: "feeling",
    pose: {
      tilt: -3,
      rotL: 6,
      rotR: -6,
      eyes: "up",
      mouth: "small",
      brows: "raise",
    },
    token: "motion.ui · curious",
    reducedMotion: "expression swap",
  },
  curious: {
    group: "feeling",
    pose: {
      tilt: -3,
      rotL: 10,
      rotR: -10,
      eyes: "up",
      mouth: "o",
      brows: "raise",
    },
    token: "motion.ui · curious",
    reducedMotion: "expression swap",
  },
  uncertain: {
    group: "feeling",
    pose: {
      tilt: 3,
      rotL: -16,
      rotR: 16,
      eyes: "open",
      mouth: "wobble",
      brows: "worry",
      blush: true,
    },
    token: "motion.reaction · gentle-enter",
    reducedMotion: "expression swap",
  },
  encouraged: {
    group: "feeling",
    pose: {
      tilt: -2,
      rotL: 8,
      rotR: -8,
      eyes: "open",
      mouth: "smile",
      blush: true,
    },
    token: "motion.reaction · gentle-enter",
    reducedMotion: "expression swap",
  },
  disappointed_gentle: {
    group: "feeling",
    pose: {
      tilt: 2,
      rotL: 4,
      rotR: -4,
      eyes: "down",
      mouth: "flat",
      brows: "worry",
    },
    token: "motion.reaction · gentle-exit",
    reducedMotion: "expression swap",
  },
  relieved: {
    group: "feeling",
    pose: { tilt: 0, rotL: 8, rotR: -8, eyes: "closed", mouth: "smile" },
    token: "motion.reaction · soft-settle",
    reducedMotion: "expression swap",
  },
  proud: {
    group: "feeling",
    pose: {
      tilt: -4,
      rotL: 30,
      rotR: -30,
      lenL: 38,
      lenR: 38,
      eyes: "closed",
      mouth: "grin",
    },
    token: "motion.reaction · soft-settle",
    reducedMotion: "expression swap",
  },
  celebrate_small: {
    group: "celebration",
    pose: {
      tilt: -3,
      rotL: 152,
      rotR: -152,
      eyes: "closed",
      mouth: "grin",
      hop: true,
    },
    token: "motion.celebrate · playful",
    reducedMotion: "static celebration pose + text",
  },
  celebrate_module: {
    group: "celebration",
    pose: {
      tilt: -3,
      rotL: 150,
      rotR: -150,
      eyes: "closed",
      mouth: "grin",
      hop: true,
    },
    token: "motion.celebrate-module · playful",
    reducedMotion: "static group scene + map change",
  },
  offer_object: {
    group: "care",
    pose: { tilt: -2, rotL: 6, rotR: -72, eyes: "open", mouth: "small" },
    token: "motion.reaction · gentle-enter",
    reducedMotion: "prop appears in hand",
  },
  receive_object: {
    group: "care",
    pose: { tilt: 2, rotL: -38, rotR: 38, eyes: "open", mouth: "small" },
    token: "motion.reaction · soft-settle",
    reducedMotion: "prop transfers",
  },
  invite: {
    group: "care",
    pose: { tilt: -2, rotL: 8, rotR: -84, eyes: "open", mouth: "smile" },
    token: "motion.reaction · gentle-enter",
    reducedMotion: "gesture pose",
  },
  join_group: {
    group: "care",
    pose: { tilt: -2, rotL: 8, rotR: -138, eyes: "open", mouth: "smile" },
    token: "motion.scene · calm-scene",
    reducedMotion: "position + wave pose",
  },
  wait_for_pause: {
    group: "care",
    pose: { tilt: 0, rotL: 8, rotR: -42, eyes: "open", mouth: "small" },
    token: "hold · static",
    reducedMotion: "identical (already still)",
  },
  ask_permission: {
    group: "care",
    pose: {
      tilt: 6,
      rotL: 6,
      rotR: -88,
      lenR: 34,
      eyes: "open",
      mouth: "small",
      palm: true,
    },
    token: "motion.reaction · curious",
    reducedMotion: "gesture pose",
  },
  give_space: {
    group: "care",
    pose: { tilt: 0, rotL: 6, rotR: -6, eyes: "open", mouth: "small" },
    token: "motion.ui · calm-scene",
    reducedMotion: "position shift",
  },
  apologize: {
    group: "repair",
    pose: { tilt: 10, rotL: -8, rotR: 8, eyes: "closed", mouth: "small" },
    token: "motion.reaction · gentle-enter",
    reducedMotion: "static apology pose",
  },
  accept_apology: {
    group: "repair",
    pose: { tilt: 2, rotL: 8, rotR: -8, eyes: "closed", mouth: "smile" },
    token: "motion.reaction · soft-settle",
    reducedMotion: "expression swap",
  },
  ask_for_help: {
    group: "repair",
    pose: { tilt: 0, rotL: 8, rotR: -110, eyes: "open", mouth: "small" },
    token: "motion.reaction · gentle-enter",
    reducedMotion: "gesture pose",
  },
  say_no_confidently: {
    group: "repair",
    pose: {
      tilt: 0,
      rotL: 6,
      rotR: -88,
      lenR: 34,
      eyes: "open",
      mouth: "flat",
      palm: true,
    },
    token: "motion.ui · gentle-enter",
    reducedMotion: "static boundary pose",
  },
} satisfies Record<CharacterState, CharacterStateDef>;
