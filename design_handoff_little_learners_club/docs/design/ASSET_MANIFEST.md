# ASSET_MANIFEST.md — what exists, what's a placeholder, who makes the rest

> Repository target: `docs/design/ASSET_MANIFEST.md`

> ⚠️ **No compiled animation files were produced.** There are **no** `.riv`, Lottie/`.json`,
> `.mp4`, or sprite-sheet exports in this handoff. What exists for motion is: **storyboards, state
> names, an event/trigger contract, timing + easing tokens, and static fallbacks.** Do not treat any
> file here as a runtime animation asset. See categories 4 and 6 below.

Assets are separated into six categories, exactly as required for handoff. Repository asset folders
(`assets/characters/`, `assets/environments/`, `assets/module-icons/`, `assets/storyboards/`,
`assets/prototypes/`, `assets/motion/`) are created in this bundle with a `README.md` each stating
what belongs there and its current status.

---

## 1. Assets already produced (in this bundle)

Interactive **HTML/vector prototypes** — design references (not production code), in
`assets/prototypes/`:

| File | What it proves |
| --- | --- |
| `Design System.dc.html` | every global + module token, rendered; the 3-world proof |
| `Little Motions.dc.html` | 7 principles + 20 behaviors, each replayable from its spec numbers |
| `Character Bible.dc.html` | 5 kids + Glim from one rig; expression, pose & Glim state sheets; 31-state library |
| `Module Worlds.dc.html` | neighborhood map, 26-part kit, all 12 six-beat storyboards + asset lists |
| `Lesson Prototype.dc.html` | full tappable Hello Garden lesson, phone + tablet, all system states |
| `Lesson Spec.dc.html` | the 16-screen engineering companion + component inventory |
| `Parent Experience.dc.html` | 14 parent screens, all data states, gate + safe return |
| `Visual Directions.dc.html` | the 3 explored directions + comparison + recommendation |

Also produced: the **parametric character rig** (reference implementation inside the Character Bible
prototype — `fig()` / `headOnly()` / `glimFig()`), and the **26-part scenery kit** as themeable
vector primitives (inside Module Worlds). These are directly portable to code.

## 2. Assets represented by placeholders (ship-blocking to *polish*, not to *build*)

The layouts ship with kit-built vector scenes marked as placeholders; final surface art is an
upgrade, not a prerequisite for a working build:

- **Scene "final art"** for every module — the prototypes label these ("final scene art:
  illustrator"). Kit geometry stands in.
- **Module landmarks** — composed from kit parts as reference; refined silhouettes are illustrator
  work. Folder: `assets/environments/`.
- **Module icons / map nodes** — currently colored geometric nodes; final iconography folder:
  `assets/module-icons/`.
- **Storyboard frames** — the six-beat intros exist as generated thumbnails inside Module Worlds;
  `assets/storyboards/` holds the spec for exported frames.
- **Pricing** — Subscription screen uses placeholder pricing; billing is not live in the beta.

## 3. Assets requiring a professional illustrator

- Final character surface detail for all 5 kids + Glim — refined **on the existing rig grid**
  (2.6 heads, 2px ink line, six-step skin ramp). Must not change proportions or construction.
  Folder: `assets/characters/`.
- Final environment art for all 12 worlds (landmark + props + far shapes), staying within the
  6-layer construction contract. Folder: `assets/environments/`.
- The 12 module motif shapes and celebration-particle art. Folder: `assets/module-icons/`.
- Culture representation in **World Garden** and safety scenarios in **Brave Basecamp** — with
  cultural / qualified-safety consultants (see `ACCESSIBILITY.md`).

## 4. Assets requiring a motion designer

Provided as **contract, not runtime files** — see `MOTION.md` and the animation-state table in
`CHARACTER_BIBLE.md`:

- Continuous character motion where the token-built version isn't enough: breathing `idle`, `walk`
  cycles, the celebration hop, `wave`/`greet` arcs.
- Per-world **ambient "landmark wakes"** motion (beat 3 of each intro) — e.g. Hello Garden blooms
  turning, Echo Treehouse leaves shimmering, Thankful Kitchen steam curls.
- The module-completion sequence (landmark glow + cast celebration + map update, ≤ 1200ms).
  Deliverables: source + exported runtime files, each with its state name, trigger, duration/easing
  token, and reduced-motion still. Folder: `assets/motion/`.

## 5. Behaviors Claude Code can implement directly

- All layout, responsive behavior (phone/tablet), navigation, and screen/state flows in
  `COMPONENT_STATES.md`.
- The full design-token system (`DESIGN.md`) and module theming (`MODULE_WORLDS.md`).
- The parametric `CharacterRig` and all 31 animation states **as CSS/vector static + transition
  state swaps** (the reduced-motion column is the guaranteed baseline).
- Every Little Motions behavior built from the duration/easing tokens via Web Animations API / CSS
  transitions (`MOTION.md`) — launch, touch/press squish, card entrance + stagger, choice select,
  scene enter/exit, all three feedbacks, principle/mission reveal, `CelebrationBurst` (≤ 8 particles),
  loading breathe, resume/error/empty.
- Accessibility behavior in `ACCESSIBILITY.md` (roles, focus management, captions, the parental gate).

## 6. Behaviors requiring Rive or another animation runtime

- Rigged continuous character animation (idles, walks, expressive multi-limb sequences) beyond
  token-built state swaps.
- Rich per-world ambient scene motion and the choreographed module-completion celebration.

Until those runtime files exist, **ship the static / reduced-motion fallback** everywhere (it is
already specified as the reduced-motion equivalent of each behavior). The app is fully functional and
accessible without any Rive layer; motion is an enhancement on top of a working, static baseline.

---

## Asset-folder map

| Folder | Contents | Status |
| --- | --- | --- |
| `assets/prototypes/` | 8 HTML prototypes + `support.js` | **produced** (category 1) |
| `assets/characters/` | final character + Glim art | illustrator (category 3); rig reference produced |
| `assets/environments/` | 12-world landmark + scene art | illustrator (3); kit placeholders (2) |
| `assets/module-icons/` | motif shapes, map-node icons, particles | illustrator (3); geometric placeholders (2) |
| `assets/storyboards/` | six-beat intro frames per world | placeholder thumbnails (2) → illustrator |
| `assets/motion/` | source + compiled runtime animation | motion designer (4/6) — **none produced yet** |
