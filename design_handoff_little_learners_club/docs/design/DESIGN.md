# DESIGN.md — Storybook Geometry design system

> Repository target: `docs/design/DESIGN.md`
> Source of truth: `assets/prototypes/Design System.dc.html` (open in a browser to see every token rendered).

The approved visual system for Little Learner's Club is **Storybook Geometry**: modular vector
geometry (from direction 1c) wearing a warm cream/terracotta/sage/honey skin and a serif story
voice (1a), with a single soft touch-squish borrowed from 1b. See `DESIGN_DECISIONS.md` for the
rationale.

Everything below is either a **global token** (immutable — the brand) or a **module theme
variable** (the only sanctioned flexibility). **If it isn't a token, it doesn't ship.** A screen
that needs a value outside this file is a design-system change request, not a local override.

---

## 1. The contract

**Immutable (global):** ink/canvas/surface/paper/border neutrals, brand terracotta, the feedback
trio, Source Serif 4 + Source Sans 3, the type/space/radius scales, the 44px touch floor, the
character construction grid + skin ramp + 2px ink line, the motion timing/easing tokens and
celebration limits, the lesson/choice/narration layout, and the vocabulary
(*Practised · Exploring · Ready to review · Try together* — never a score).

**Flexible (per module world):** exactly **five variables plus content** — one accent hue in three
lightness steps (`accent`, `accent-strong`, `accent-soft`), a scene `tint` and `tint-deep`, and one
`motif` shape; plus the landmark composition, lesson content, and character wardrobe accents.
Nothing else.

---

## 2. Color

### Brand & neutrals (global, immutable)

| Token | Value | Use |
| --- | --- | --- |
| `llc.color.ink` | `#31281C` | text, outlines, icon strokes |
| `llc.color.ink-soft` | `#6E6252` | secondary text |
| `llc.color.canvas` | `#FAF3E7` | app background (elevation level 0) |
| `llc.color.surface` | `#FFFDF8` | cards, bars (level 1) |
| `llc.color.paper` | `#F0E6D2` | paper layers, offsets, scene ground band |
| `llc.color.border` | `#E4D7BF` | hairlines |
| `llc.color.brand` | `#BE5136` | primary action fill, brand moments |
| `llc.color.brand-strong` | `#A03F27` | brand as text, hover/pressed |
| `llc.color.on-brand` | `#FFFDF8` | text/icon on a filled brand surface |

### Feedback trio (global, immutable, module-independent)

Always paired with an **icon and a text label** — never color alone. There is **no fourth state and
no red** in the child app. Motion weight is identical across all three (no hierarchy of worth).

| Meaning | Text/icon | Fill |
| --- | --- | --- |
| Helpful choice | `llc.color.feedback.helpful` `#3D6B58` | `…helpful-bg` `#E3EBE6` |
| Mixed choice | `llc.color.feedback.mixed` `#8A5A1C` | `…mixed-bg` `#F6EBD3` |
| Needs more context | `llc.color.feedback.context` `#4A6076` | `…context-bg` `#E3E9EE` |

`llc.color.danger` `#A34141` exists **only in the parent area**, on destructive account actions.

### Skin ramp (global, immutable, six steps used verbatim)

`#F2C9A4` · `#E8B48A` · `#C99772` · `#B97F5C` · `#8C5A3C` · `#6B4226` → `llc.skin.1 … llc.skin.6`

### Cast colors (global — one signature per character)

`llc.cast.maya` `#B85C48` · `llc.cast.theo` `#587F70` · `llc.cast.amara` `#D8A24C` ·
`llc.cast.jun` `#5D6FAE` · `llc.cast.nora` `#5B7086` · `llc.cast.glim` `#C98F2E`.
Same warm family, no two alike, none impersonating brand or the feedback trio. Full detail in
`CHARACTER_BIBLE.md`.

### Module accent rules

- **One hue per module**, expressed as three lightness steps of the same hue.
- `accent` ≥ 3:1 against canvas (non-text use: landmarks, progress fill, play button).
- `accent-strong` ≥ 4.5:1 on surface — **the only step allowed to carry text**.
- Accents never impersonate the feedback trio or brand terracotta.
- Adjacent worlds on the neighborhood map may not share a hue family.
- Wardrobe accents are drawn from the module accent steps.
- **No gradients anywhere.** The single sanctioned exception is Glim's radial glow.

Per-world accent values are tabulated in `MODULE_WORLDS.md`.

---

## 3. Typography

Two families only. **Serif = the voice of the story** (titles, prompts, celebrations, parent
editorial headings). **Sans = everything functional.** No third typeface, ever.

- `llc.type.display` — **Source Serif 4** (weight 600 only)
- `llc.type.body` — **Source Sans 3** (400 and 600; 700 reserved for chips ≤ 12px)

### Scale (`llc.type.scale`, 6 stops)

| Token | Size / line | Face | Use |
| --- | --- | --- | --- |
| `display-800` | 40 / 46 | serif 600 | module titles, celebrations |
| `display-600` | 26 / 34 | serif 600 | screen titles, prompts |
| `body-500` | 19 / 29 | sans 400 | child narration — **never smaller** |
| `body-400` | 17 / 26 | sans 400/600 | choice labels, parent body |
| `body-300` | 14 / 21 | sans 400 | captions, parent meta — **parent floor** |
| `label-200` | 11 / 15 | sans 600, caps, +10% tracking | eyebrows, chips |

Rules: child-facing text never below `body-500`; parent floor `body-300`. No italics for children
(italic serif allowed for parent "worth talking about" quotes). Line length ≤ 26ch child, ≤ 64ch
parent. `text-wrap: pretty` everywhere. No all-caps sentences.

---

## 4. Spacing, radius, shape, elevation

**Space** — 4px base, tokens `space-1..16`: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.
`space-3` inside chips · `space-4` card padding · `space-6` between cards · `space-8` section gaps ·
`space-12` tablet gutters · `space-16` hero breathing room. Sibling groups use **flex/grid + gap**,
never per-item margins. Touch targets ≥ 44×44 with ≥ `space-2` between (`llc.size.touch` = 44px).

**Radius** (`llc.radius`, 5 stops): `sm 8` chips · `md 12` buttons · `lg 16` cards ·
`xl 24` scene panels · `round` heads/map nodes/play button. Nesting rule: child radius = parent
radius − parent padding, clamped to the scale. **Full circles are reserved** for character heads,
map nodes, and the play button — never buttons.

**Elevation**
- Level 0 — canvas cream (app floor).
- Level 1 — surface card: 1px border + `llc.shadow.soft` (two layers, ink 4–6%: `0 1px 2px` /
  `0 4px 12px`).
- Level 2 — `llc.elevation.paper`: a solid `paper` layer offset **+6px x/y** behind the card. One
  per screen, hero moments only.
- Overlay — scrim `ink 40%`, dialog at level 1.

No hard-black shadows, no glows (except Glim), no stacked level-2s, no borderless floating cards.

---

## 5. Illustration & icon rules (summary)

Full character contract lives in `CHARACTER_BIBLE.md`; environment construction in
`MODULE_WORLDS.md`. In short:

- **Characters:** circle head · rounded-block body · capsule limbs, all on a 4px grid; kids 2.6
  heads tall, adults 3.4, Glim 1.6; eyes at ~45% of head height; 2px ink outline on every character
  and foreground prop; background scenery is outline-free. Emotion lives in eyes + brows + mouth +
  pose — never face distortion. Poses are limb rotations + a ±4° body tilt; no squash beyond 6%
  (that budget belongs to Little Motions).
- **Environments:** every scene is built from six layers — wash (`tint`) → far shapes (`tint-deep`,
  no outline) → landmark & props (accent + soft, 2px ink) → ground band (`paper`, 2px ink top rule)
  → characters → UI (never inside the scene). Max 3 accent-hue elements per scene.
- **Icons:** 24px grid, 2px ink stroke, rounded caps/joins, ≤ 2 shapes each. Active = filled with
  module accent (nav) or brand (global) **plus a label — never icon-only**. No emoji.

---

## 6. Module theme variables (the only theme surface)

Set once per module world, consumed everywhere. Names are stable; per-world values in
`MODULE_WORLDS.md`.

| Variable | Use |
| --- | --- |
| `module.accent` | landmark, progress fill, play button, wardrobe A. ≥ 3:1 vs canvas |
| `module.accent-strong` | the only accent step allowed on text. ≥ 4.5:1 on surface |
| `module.accent-soft` | secondary props, motif decoration, wardrobe B |
| `module.tint` | scene-panel wash (layer 1) |
| `module.tint-deep` | far silhouettes (layer 2) |
| `module.motif` | enum: `petal | leaf | pixel | compass | brick | steam | …` — one per module |
| `module.landmark` | kit-part composition reference — authored per module, not per screen |

**Example — Hello Garden theme**

```
module.accent:        #587F70
module.accent-strong: #3F6A5D
module.accent-soft:   #9DB8AC
module.tint:          #E7EEE7
module.tint-deep:     #D5E2D6
module.motif:         petal
```

---

## 7. Responsive behavior

- **Breakpoints:** `phone` < 600px — single column, bottom nav, one action in view.
  `tablet` ≥ 600px — the lesson uses a **two-pane split** (scene ‖ interaction); chrome gets wider
  gutters (`space-12`). The parent dashboard gains a **left rail** and a two-column grid.
- No layout below 360px. Nothing scrolls horizontally at 375 / 768 / 1024.
- Art scales; it does not re-compose between phone and tablet.
- One `<h1>` per screen, no skipped heading levels; focus moves to the step region on step change.

---

## 8. Naming conventions

- **Design tokens:** dotted namespace `llc.<group>.<name>` (e.g. `llc.color.brand-strong`,
  `llc.motion.card`, `llc.skin.3`). Module theme uses the `module.*` prefix. Map these to whatever
  the codebase already uses (CSS custom properties `--llc-color-brand`, a TS token object, etc.) —
  keep the leaf names identical so this doc stays the reference.
- **Motion tokens:** `llc.motion.<category>` (durations) and `llc.ease.<name>` (curves). See
  `MOTION.md`.
- **Components:** `PascalCase` (`ChoiceCard`, `NeighborhoodMap`). Reuse the existing Kindlyo
  primitives by their current names; new components are additive — see `COMPONENT_STATES.md`.
- **Animation states:** `snake_case` verbs/adjectives (`wait_for_pause`, `say_no_confidently`).
  See `CHARACTER_BIBLE.md`. **Never** name anything `correct`, `wrong`, `fail`, `bad`, or `rude`.
- **Vocabulary (product copy + data):** *Practised · Exploring · Ready to review · Try together*.
  No goodness / politeness / behavior / obedience score exists anywhere in the type system.

---

## 9. Prohibited patterns

Red X marks, failure screens, buzzers · "correct / wrong / failed / rude" labels · points, scores,
grades, streaks, rankings · confetti rain, looping celebrations, > 1.2s of celebration motion ·
screen shake, flashing, motion competing with narration · characters mocking mistakes or dramatic
sadness · countdown timers on choices · hard-black drop shadows · neon or saturated full-bleed
backgrounds · gradients (except Glim's glow) · more than one accent hue per module · circles as
button shapes · icon-only controls without labels · information carried by color alone · ad-hoc hex
values.
