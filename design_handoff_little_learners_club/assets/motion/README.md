# assets/motion/

Source and compiled **runtime animation** for behaviors that exceed token-built CSS/WAAPI state
swaps (rigged idles/walks, per-world ambient "landmark wakes", the module-completion celebration).

> ⚠️ **No compiled animation files exist yet.** There are **no** `.riv`, Lottie/`.json`, `.mp4`, or
> sprite-sheet exports in this bundle. Do not reference a runtime animation asset from here — none is
> present.

What *is* delivered instead (sufficient to build against and to brief a motion designer):

- **Timing + easing tokens** — `../../docs/design/MOTION.md` (8 durations, 6 easings).
- **Behavior contract** — 20 behaviors with trigger, transform, and reduced-motion equivalent.
- **Character animation-state contract** — 31 named states + Glim states, each with its token and
  static/reduced fallback: `../../docs/design/CHARACTER_BIBLE.md`.
- **Storyboards** — the six-beat intros per world (`../prototypes/Module Worlds.dc.html`).
- **Static fallbacks** — the reduced-motion column of every behavior/state is the guaranteed
  baseline; the app is fully functional and accessible with **zero** runtime animation files.

**Motion-designer deliverable (category 4/6 in `../../docs/design/ASSET_MANIFEST.md`):** source +
exported runtime files, each labelled with its state name, trigger event, duration/easing token, and
reduced-motion still. Drop them here.
