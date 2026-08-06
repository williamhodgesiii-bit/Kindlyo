# MOTION.md — Little Motions

> Repository target: `docs/design/MOTION.md`
> Source of truth: `assets/prototypes/Little Motions.dc.html` (each behavior animates live from
> these exact numbers; flip *reducedMotion* / *slowMo* there to audit).

Personality: **curious, gentle, responsive, and alive.** Every animation is built exclusively from
the eight duration tokens and six easing tokens below — no arbitrary values. Motion only ever
*decorates* meaning; what changed is always carried by text, icon, or position as well.

## Seven principles

1. **Anticipate** — a very small preparation move before a meaningful action.
2. **Respond** — immediate visual acknowledgement after a touch.
3. **Explain** — motion quiets while important narration/text is presented.
4. **Settle** — objects return calmly to rest; stillness is a feature.
5. **Encourage** — helpful feedback is warm but brief, then out of the way.
6. **Reflect** — context-dependent choices get thoughtful motion, never failure effects.
7. **Celebrate** — accomplishment feels satisfying without becoming loud or addictive.

## Tokens

### Duration (`llc.motion.*`)

| Token | ms | Use |
| --- | --- | --- |
| `touch` | 120 | press/release response |
| `ui` | 180 | small UI state changes |
| `card` | 240 | card entrance |
| `reaction` | 320 | character reaction |
| `scene` | 400 | scene transition |
| `celebrate` | 600 | lesson celebration |
| `intro` | 900 | module-introduction beat |
| `celebrate-module` | 1200 | module celebration |

### Easing (`llc.ease.*`)

| Token | cubic-bezier | Use |
| --- | --- | --- |
| `gentle-enter` | `(.22,.61,.36,1)` | things arriving — cards, panels, text |
| `gentle-exit` | `(.4,.05,.7,.4)` | things leaving, quickly and quietly |
| `soft-settle` | `(.3,1.12,.4,1)` | the 1b squish: touch, choice select (≤ 6% overshoot) |
| `curious` | `(.5,-.12,.4,1)` | anticipation: a tiny pull-back before a meaningful action |
| `playful` | `(.3,1.3,.5,1)` | celebrations and Glim **only** |
| `calm-scene` | `(.45,.05,.25,1)` | scene and route transitions |

### Hard limits

Lesson celebration ≤ 600ms of motion; module ≤ 1200ms (1.5s only with a documented reason), then
still. ≤ 8 particles drawn from the module motif shape, one emission, no loop. One celebration per
achievement, replayable by the child's tap, never auto-repeated. Audio (later) ≤ −14 LUFS, one soft
cue. Celebration never gates the next action.

## Behavior contract (20 behaviors)

Each row: trigger → the standard animation (duration · easing · transform) → its reduced-motion
equivalent. "Never" notes the failure grammar that is banned for that behavior.

| Behavior | Trigger | Standard motion | Reduced-motion |
| --- | --- | --- | --- |
| **App launch** | cold start only | `intro` 900 · `calm-scene` · 16px rise, scale .96→1, opacity 0→1; precedes narration | single 240ms fade, no rise/scale |
| **Touch feedback** | pointer-down on any interactive el | `touch` 120 · `soft-settle` · scale 1→.97→1 | instant pressed state (border/fill swap), no scale |
| **Button press** | pointer down/up on a button | `touch` 120 · `soft-settle` · scale 1→.96→1 | pressed fill swap only |
| **Choice-card entrance** | narration line finishes on a choice step | `card` 240 +60ms stagger · `gentle-enter` · 12px rise, one at a time | cards appear together in one 240ms fade |
| **Choice selection** | child taps a choice card | `ui` 180 · `soft-settle` · scale 1→1.02→1, check fades in; nothing else moves | border + check state swap |
| **Scene entrance** | step change into a new scene | `scene` 400 · `calm-scene` · 20px rise; then narration | 240ms fade, no rise |
| **Scene exit** | child confirms leaving | `card` 240 · `gentle-exit` · 14px drop | 180ms fade out |
| **Character anticipation** | just before a scripted character action | `ui` 180 · `curious` · 3px counter-lean → action | **off entirely** — action happens without wind-up |
| **Character reaction** | consequence of the child's choice begins | `reaction` 320 · `gentle-enter` · 4px shift + expression crossfade | static expression swap |
| **Helpful-choice feedback** | consequence resolved as helpful | `reaction` 320 · `gentle-enter` · chip rises 8px; one soft note | 240ms fade |
| **Mixed-choice feedback** | consequence resolved as mixed | identical motion to helpful — only icon/color/words differ | 240ms fade |
| **Needs-context feedback** | consequence resolved as needs-context | `reaction` 320 +200ms thoughtful hold · `gentle-enter` · 8px rise | 240ms fade after the same hold |
| **Principle reveal** | consequence settled; principle step begins | `scene` 400 · `calm-scene` · 12px rise; all other motion paused | 240ms fade |
| **Mission reveal** | guided practice completed | `card` 240 · `gentle-enter` · 16px rise (like a ticket) | 240ms fade |
| **Lesson completion** | final step reached, once per completion | `celebrate` 600 · `playful` · scale .8→1.05→1, ≤ 8 motif particles, then still | badge in a 240ms fade + progress text updates |
| **Module completion** | eighth lesson practised, once ever | `celebrate-module` 1200 · `playful`→`soft-settle` · landmark glow, ≤ 6px cast hop, map updates | static celebratory scene + visible map-state change |
| **Loading** | any wait > 300ms | Glim lantern glow breathes 1200ms × ≤ 3 · `calm-scene` · opacity .55↔.95, then still frame + text | static lantern + "Getting ready…" text |
| **Empty state** | screen renders with no content | `ui` 180 · `gentle-enter` · 8px rise | appears without motion |
| **Recoverable error** | a retryable failure occurs | `card` 240 · `gentle-enter` · 12px rise — an event, not an alarm | 240ms fade |
| **Parent-area transition** | grown-up gate passed | `ui` 180 · `gentle-exit`/`gentle-enter` crossfade — no character motion in the parent surface | instant swap |

## Reduced-motion rules (global)

- Every transform animation swaps to an opacity fade ≤ 240ms.
- Celebrations become a static badge + a visible progress change.
- Idle loops, parallax, and anticipation twitches switch **off entirely**.
- Character reactions become expression swaps (eyes/mouth state change).
- Meaning must survive without motion — see `ACCESSIBILITY.md`.

Honor the OS `prefers-reduced-motion` media query as the default; the prototypes also expose it as a
per-session toggle. Implement each behavior as a `(standard, reduced)` pair rather than globally
disabling animation.

## Implementation notes for Claude Code

- The prototypes drive these with the **Web Animations API** (`element.animate(keyframes, opts)`),
  reading the duration/easing tokens above. That is directly portable to the target codebase; a
  CSS-transition or Framer-Motion implementation is equally valid as long as the token values are
  preserved.
- Character *reactions and expression changes* are state swaps on the rig, not bespoke tweens — see
  the animation-state contract in `CHARACTER_BIBLE.md`.
- Anything richer than these token-built behaviors (e.g. a fully rigged idle loop or the
  module-intro landmark "wakes" ambient motion) is a **motion-designer / Rive** deliverable — see
  `ASSET_MANIFEST.md`. No compiled animation files exist yet; ship the static fallback until they
  do.
