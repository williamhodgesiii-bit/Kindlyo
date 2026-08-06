# Handoff: Little Learner's Club

A social-skills learning app for children **5–9**, built on the **Kindlyo** codebase
(`williamhodgesiii-bit/Kindlyo`). This bundle is the complete design handoff for implementation.

---

## About the design files

The files in `assets/prototypes/` are **design references authored in HTML** — high-fidelity
prototypes showing intended look, layout, copy, and behavior. **They are not production code to copy
directly.** The task is to **recreate these designs in the Kindlyo codebase using its existing React
patterns, primitives, and libraries** — reusing the components it already has and adding the new ones
additively (see `docs/design/COMPONENT_STATES.md §1`). Where a prototype and this documentation ever
disagree, **the Markdown in `docs/design/` is the source of truth** (the prototypes render it live).

Open any prototype by pointing a static server at `assets/prototypes/` and loading the `.dc.html`
file in a browser (they self-load `support.js` from the same folder).

## Fidelity

**High-fidelity.** Final colors, typography, spacing, radii, motion timings, component states, and
copy are all specified to exact values. Recreate the UI faithfully using the codebase's own
component library. The one deliberate gap is **final illustration/animation surface art**, which is
placeholder (kit geometry) pending an illustrator / motion designer — see
`docs/design/ASSET_MANIFEST.md`.

---

## Where the files go in the repo

This bundle mirrors the target repository layout — drop the two top folders into the Kindlyo repo
root:

```
docs/design/
  DESIGN.md            ← tokens, module-theme tokens, responsive, naming, prohibitions
  MOTION.md            ← 8 duration + 6 easing tokens, 20-behavior contract, reduced-motion
  MODULE_WORLDS.md     ← 12 worlds, 6-beat intro formula, 26-part kit, environment contract
  CHARACTER_BIBLE.md   ← cast + Glim + the 31-state animation contract
  COMPONENT_STATES.md  ← component inventory + every state, 16 child + 14 parent screens
  ACCESSIBILITY.md     ← a11y + reduced-motion behavior
  ASSET_MANIFEST.md    ← the 6-category produced/placeholder/illustrator/motion/code/Rive split
  DESIGN_DECISIONS.md  ← visual-direction rationale + the vocabulary lock
assets/
  characters/          ← illustrator target (rig reference lives in prototypes)
  environments/        ← illustrator target (kit placeholders today)
  module-icons/        ← illustrator target (motif shapes, map nodes, particles)
  storyboards/         ← intro-frame target (thumbnails live in prototypes)
  prototypes/          ← the 8 produced HTML prototypes + support.js  ✅ present
  motion/              ← runtime-animation target — NONE produced yet (contract only)
github.md              ← repo linkage + last-sync record
```

Each `assets/*` folder has a `README.md` stating what belongs there and its current status.

---

## Final screen inventory (30 screens)

**Child lesson flow — 16** (fully specified for Hello Garden · "Saying Hello"): 01 App launch ·
02 Clubhouse home · 03 Neighborhood map · 04 Module introduction · 05 Learning path ·
06 Lesson·scene · 07 Lesson·choice · 08 Lesson·consequence · 09 Lesson·principle ·
10 Lesson·guided practice · 11 Lesson·offline mission · 12 Lesson·completion · 13 Loading ·
14 Interruption/resume · 15 Recoverable error · 16 Parent coaching prompt.

**Parent experience — 14:** Onboarding · Account welcome · Create child profile · Child selector ·
Progress (normal/empty/loading/error) · Current mission · Skills · Ready to review · Conversation
prompt · Privacy & account · Delete child profile · Delete account · Subscription · Safe return.

Per-screen components, states, layout, interactions, and data are in `docs/design/COMPONENT_STATES.md`.

---

## User-flow diagrams

**Child happy path**

```
Launch ──tap──▶ Clubhouse ──continue──▶ [Map] ──node──▶ Module intro (6 beats) ──▶ Learning path
                                                                                        │
                                                          ┌── available lesson ◀────────┘
                                                          ▼
   Lesson runner:  scene ▶ choice ▶ consequence ▶ principle ▶ guided practice ▶ mission ▶ completion
                     │        │           │                                                │
                (narration) (change    (helpful / mixed / needs-context —          "Back to Hello
                 + CC)       freely)     never a failure; go back & retry)          Garden" → path
```

**System states** (branch from any lesson step): `Loading` (>300ms wait) · `Resume` (return
mid-lesson → keep going / start over) · `Recoverable error` (try again / back to clubhouse). All
non-punitive; place is always preserved.

**Parent flow**

```
Onboarding(3) ▶ Account welcome ▶ Create child profile ▶ Progress dashboard ◀─── bottom nav / rail
                                                              ├─▶ Current mission (mark practised)
                                                              ├─▶ Skills ▶ Ready to review
                                                              ├─▶ Conversation prompt
                                                              └─▶ Privacy ─▶ Delete child / Delete account
                                                                        └─▶ Subscription ─▶ [gate] payment
   Safe return ─▶ [Ask-a-grown-up gate] ─▶ parent area
```

The **parent coaching prompt** (child screen 16) surfaces in the parent area *after* a lesson, never
mid-flow.

---

## Assets & behaviors — the six-category split

Full detail in `docs/design/ASSET_MANIFEST.md`. In brief:

1. **Produced** — 8 HTML prototypes, the parametric character rig, the 26-part scenery kit.
2. **Placeholders** — kit-built scenes/landmarks, geometric module icons, storyboard thumbnails,
   placeholder pricing.
3. **Needs illustrator** — final character + Glim art (on the rig grid), 12-world environment art,
   motif shapes/particles, culture & safety scenarios (with consultants).
4. **Needs motion designer** — rigged idles/walks, per-world ambient motion, module-completion
   sequence.
5. **Claude Code can build directly** — all layout, responsive, navigation, tokens, theming, the
   31 animation states as CSS/vector state swaps, all token-built Little Motions behaviors,
   accessibility behavior.
6. **Needs Rive / a runtime** — rigged continuous character animation and rich ambient scene motion.

> **No compiled animation files were produced** (no `.riv` / Lottie / `.mp4` / sprite sheets). Motion
> is delivered as storyboards + state names + an event/trigger contract + timing/easing tokens +
> static fallbacks. Build against the static/reduced-motion baseline; layer runtime animation later.

---

## Implementation order (suggested)

1. **Tokens first** — port `DESIGN.md` (global + module theme) into the codebase's token layer;
   confirm Kindlyo's existing color/type tokens are superseded/aliased. Add Little Motions
   duration/easing tokens (`MOTION.md`).
2. **Shell & navigation** — `ChildAppShell`, `BottomNav`, parent shell + rail, routing for the 30
   screens.
3. **Learning path + map** — `NeighborhoodMap`/`MapNode`, `LearningPath`/`PathNode`, the pure
   `buildModulePath` progress logic; wire the `run` / `completion` data model.
4. **Lesson runner** — the 7 lesson steps (`SceneStage`, `ChoiceCard`, `InlineFeedback`,
   principle/practice/mission/completion) with the feedback trio and `CelebrationBurst`.
5. **Character rig** — `CharacterRig` + all 31 states as static/transition swaps (reduced-motion
   baseline); `GlimBubble`.
6. **System states** — loading / resume / recoverable error, all accessible per `ACCESSIBILITY.md`.
7. **Parent experience** — dashboard + data states, missions/skills/review/prompt, privacy + delete
   flows, subscription, and the **parental gate** + safe return.
8. **Content pass** — the remaining Hello Garden lessons, then the other 11 worlds to lesson depth.
9. **Motion & art upgrade** — swap placeholders for illustrator art; layer Rive/motion-designer
   animation on top of the working static baseline.

---

## Acceptance criteria

- All global + module tokens match `DESIGN.md` exactly; **no ad-hoc hex/spacing/radius values** ship.
- All 30 screens render on phone (<600px) and tablet (≥600px) per `COMPONENT_STATES.md`; the lesson
  reflows to two-pane on tablet; nothing scrolls horizontally at 375/768/1024; nothing below 360px.
- The feedback trio is always **icon + label + color**; **no correct/wrong/failure** state, red X,
  score, streak, grade, ranking, or countdown appears anywhere.
- Product copy and stored data use only **Practised · Exploring · Ready to review · Try together**.
- Every animated behavior has a working reduced-motion pair; with `prefers-reduced-motion` set, no
  information is lost (`MOTION.md`, `ACCESSIBILITY.md`).
- Accessibility: one `<h1>`/screen, managed focus on step change, captions on narration, correct
  `role`/`aria-live` on feedback/loading/error, 44px touch targets, keyboard-reachable parental gate.
- The parental gate blocks web/purchase exits with a written multi-step answer; the child area has no
  link to account/billing/settings.
- The 31 character states + Glim states are implemented by name as at least static/transition swaps.
- Brave Basecamp safety content and World Garden culture content are flagged for human review before
  ship.

---

## Known limitations

- Only **Hello Garden → "Saying Hello"** is specified to lesson depth; the other 11 worlds are at
  storyboard + asset-list depth and each needs a content pass.
- **No compiled animation files** exist (see above); ship the static/reduced-motion baseline.
- Final **illustration** is placeholder kit geometry pending an illustrator.
- **Subscription pricing** is placeholder; billing is not live in the beta.
- `accent-strong` values are proven for 3 worlds (Hello Garden, Pixel Plaza, Brave Basecamp) and
  derived by the same rule for the rest — confirm each at implementation.
- Kindlyo primitive names in `COMPONENT_STATES.md §1` are from the design audit; reconcile against the
  current repo (use `github.md`) before wiring.

---

## Keeping this in sync (design-project reference)

This bundle was generated from the **Little Learner's Club design project** in Claude Design, which
remains the living source. `github.md` (bundle root) records the repo linkage
(`williamhodgesiii-bit/Kindlyo`, branch `main`) and the last-sync date. To refresh the handoff after
design changes, **re-run the export from the design project / `/design-sync`** rather than editing
these files by hand — the prototypes and docs regenerate together. Do not hand-rebuild this folder.

---

## READY FOR CLAUDE CODE

Only items whose specification or asset is actually present in this bundle are checked.

- [x] **Final screen inventory** — 30 screens (this README) + per-screen detail (`COMPONENT_STATES.md`)
- [x] **User-flow diagrams** — child, system-state, and parent flows (this README)
- [x] **Design tokens** — `DESIGN.md`
- [x] **Module-theme tokens** — `DESIGN.md §6` + per-world values `MODULE_WORLDS.md §3`
- [x] **Motion tokens** — `MOTION.md` (8 durations, 6 easings)
- [x] **Component states** — `COMPONENT_STATES.md`
- [x] **Character animation-state contract** — 31 states + Glim states (`CHARACTER_BIBLE.md`)
- [x] **Module environment contract** — 6-layer construction + 26-part kit (`MODULE_WORLDS.md`)
- [x] **Asset manifest** — 6-category split (`ASSET_MANIFEST.md`)
- [x] **Responsive behavior** — `DESIGN.md §7` + per-screen notes
- [x] **Accessibility behavior** — `ACCESSIBILITY.md`
- [x] **Reduced-motion behavior** — `MOTION.md` + `ACCESSIBILITY.md`
- [x] **Naming conventions** — `DESIGN.md §8`
- [x] **File-organization recommendation** — repo-mirrored layout (this README)
- [x] **Implementation order** — 9 steps (this README)
- [x] **Acceptance criteria** — (this README)
- [x] **Known limitations** — (this README + `ASSET_MANIFEST.md`)
- [x] **Produced design references** — 8 HTML prototypes + `support.js` (`assets/prototypes/`)
- [x] **Design-project reference preserved** — `github.md` + sync note (this README)
- [ ] **Compiled animation files** — *not produced.* Storyboards, state names, event contract, and
      static fallbacks are provided instead (`assets/motion/`, `MOTION.md`, `CHARACTER_BIBLE.md`).
- [ ] **Final illustration art** — *illustrator deliverable;* kit placeholders ship today
      (`assets/characters/`, `assets/environments/`, `assets/module-icons/`).
- [ ] **Content for worlds 2–12** — *pending;* specified to storyboard + asset-list depth only.
