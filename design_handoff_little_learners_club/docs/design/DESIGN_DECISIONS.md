# DESIGN_DECISIONS.md — why the design is the way it is

> Repository target: `docs/design/DESIGN_DECISIONS.md`
> Source: `assets/prototypes/Visual Directions.dc.html` (three directions + comparison +
> recommendation).

## The visual direction: "Storybook Geometry"

Three full directions were explored, each shown across the same six moments (home, map, lesson
scene, choice + reaction, module completion, parent dashboard):

- **1a · Modern Storybook** — layered paper shapes, warm naturals, editorial illustration, serif
  voice. Calm, premium, timeless; strongest parent trust and accessibility; ages up well. Risk:
  reads a touch quiet to 8–9s, and texture multiplies illustration assets.
- **1b · Soft Clay Neighborhood** — rounded dimensional clay forms, soft light, tactile characters.
  Highest tactile appeal. Risk: implies 3D renders or heavy sprite sheets (highest production cost
  across 12 worlds), can read babyish/toy-like, and is hard to age up.
- **1c · Graphic Clubhouse** — clean vector geometry, confident outlines, modular scenery. Cheapest
  to animate across 12 worlds, most readable at phone size, lowest production cost, scales to any
  audience. Risk: a common genre — the shape language has to carry distinctiveness.

**Decision — a hybrid:**

- **Bones from 1c** — modular vector construction: shape-grid characters, geometric scenery kits,
  segmented progress. The reason the 12-world scope is affordable and crisp on small screens.
- **Skin from 1a** — the warmth: cream/terracotta/sage/honey palette (an evolution of the existing
  Kindlyo tokens), the Source Serif 4 display voice, layered paper depth behind hero moments, and the
  editorial parent surface that earns adult trust.
- **One thing from 1b** — the **soft squish** as the touch-response feel in Little Motions
  (`ease.soft-settle`, ≤ 6% overshoot). Tactile feedback without committing to dimensional art.

Working name: **Storybook Geometry.** Full system in `DESIGN.md`.

## Vocabulary lock (product-defining)

The app describes **lessons practised, never children judged.** The only sanctioned status words:

**Practised · Exploring · Ready to review · Try together.**

There is **no** goodness, politeness, behavior, or obedience score anywhere in the type system, and
**no** correct / wrong / failure / rude / bad state — not in copy, not in component props, not in
animation-state names, not in stored data.

## Other decisions worth carrying forward

- **Feedback is a trio, not a verdict.** Every choice resolves to *helpful / mixed / needs more
  context* — each with identical motion weight, always icon + label + color. Children can change a
  choice and see a different believable outcome; exploring is encouraged.
- **Glim is a companion, not a scorekeeper.** It wonders and lights the way; it never grades and
  never dims because of a choice. It has zero spoken dialogue (works fully narrated/captioned).
- **Everyone does everything.** Story roles (mistake-maker, helper, boundary-setter, repairer…)
  rotate across the whole cast; no character is the permanent example or the permanent problem.
- **Offline missions + parent coaching.** Learning lands in the real world; the coaching prompt
  appears in the parent area, **never mid-lesson**, so the child's flow stays calm.
- **Communication difference is first-class.** A wave or a picture card is a full answer; eye contact
  is never required; there are no countdown timers on choices.
- **Safety outranks politeness.** Brave Basecamp is the module every other one defers to; consent and
  body autonomy are never overridden by manners, and that content gets qualified human review.
- **One strict token system, five module variables.** Flexibility is deliberately confined to one
  accent hue (three steps), two scene tints, and one motif per world — so 12 worlds stay one coherent
  place and are cheap to build.
- **Reduced motion is a design pair, not a kill-switch.** Every behavior ships a `(standard,
  reduced)` pair; meaning never depends on motion.

## Repo linkage & provenance

This design was built on the **Kindlyo** codebase (`williamhodgesiii-bit/Kindlyo`, branch `main`) —
recorded in `github.md` at the bundle root. The lesson spec reuses existing Kindlyo primitives where
they exist and only adds new components additively (see `COMPONENT_STATES.md §1`). The living design
source is the Claude Design project this bundle was generated from; keep that reference so the docs
can be refreshed rather than hand-edited (see the bundle `README.md`).
