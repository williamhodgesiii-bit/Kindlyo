# ACCESSIBILITY.md — accessibility & reduced-motion behavior

> Repository target: `docs/design/ACCESSIBILITY.md`
> Sources: every prototype's `a11y` / `reduced` fields, `Little Motions.dc.html`,
> `Design System.dc.html`. Accessibility is a design constraint here, not a retrofit — several module
> worlds exist specifically to model consent, boundaries, and communication difference.

## Non-negotiables

- **Never color alone.** The feedback trio and every status is always **icon + text label + color**.
  Map/path/skill states carry their meaning in words and shape ("Exploring · 1 of 8", "up next",
  "a little later", "locked — finish lesson 2 first").
- **Type floors.** Child-facing text never below `body-500` (19px). Parent floor `body-300` (14px).
- **Touch.** Every interactive target ≥ 44×44 with ≥ `space-2` (8px) between.
- **Contrast.** Ink `#31281C` on canvas `#FAF3E7` is high-contrast; `module.accent-strong` is the
  only accent step allowed to carry text (≥ 4.5:1 on surface); `module.accent` is non-text only
  (≥ 3:1 vs canvas). Feedback text colors are all set on their paired tints for AA body contrast.

## Structure & focus

- One `<h1>` per screen; no skipped heading levels; the heading outline stays intact.
- On **step change**, focus moves to the step region (not on first render, and never yanked
  mid-interaction). Never use `scrollIntoView` for this — use a managed focus target.
- The learning path's draft/locked/unwritten states are exposed in text + a lock icon.

## Narration, captions & the picture

- Narration carries the **situation and meaning**; the scene illustration is decorative and
  `aria-hidden`. A lesson must read completely without the picture.
- `AudioNarration` offers play / pause / replay, and **CC** toggles a live transcript (words
  highlight as read). Captions are available on every narrated step.

## Choices & forms

- Choice cards are **buttons in a labelled list**, reachable by Tab + Enter — deliberately **not
  radios**, because arrow-key semantics would commit a choice while the child is only exploring.
- Selection is conveyed by `aria-pressed` **and** a visible check — never color shift alone. A
  choice can be changed freely; other cards never dim or reflow.
- Guided practice cannot be skipped (`canAdvance=false` until a pick); the reason sits in words
  beside the disabled button, not as an error.

## Live regions & error grammar

- Consequence feedback: `role=status` / `aria-live=polite`.
- Loading announces "Loading" once via `role=status` `aria-live=polite`; the skeleton is hidden from
  assistive tech.
- Recoverable error uses `role=alert` **only because it follows a user action** — with **no big ✕,
  no blame wording, no red flood, no shake or flash.** Fatal errors route to a separate boundary.

## Communication-difference support (first-class, not a toggle afterthought)

- **Nonverbal learner mode:** a wave or a hello card is a *full* greeting — choices and prompts
  reword so no answer requires talking. Nora's picture-card language is canonical, never framed as a
  limitation.
- **Eye contact is never required, ever** — in copy, art direction, or "correct" answers.
- **No countdown timers on choices;** safety and consent choices in Brave Basecamp are never timed
  and never pressured (the calmest module in the app).

## Reduced motion

Honor OS `prefers-reduced-motion` as the default; the prototypes also expose a per-session toggle.
Implement each behavior as a `(standard, reduced)` pair — never a global animation kill-switch —
because **meaning must survive without motion**: whatever changed is always carried by text, icon,
or position. Rules:

- Every transform animation → an opacity fade ≤ 240ms.
- Celebrations → a static badge + a visible progress change (no particles).
- Idle loops, parallax, and anticipation twitches → **off entirely**.
- Character reactions → expression swaps (eyes/mouth state change; see the reduced-motion column in
  `CHARACTER_BIBLE.md`).
- Module intro → five still frames with the same narration; "travel" → a map-position change.

Per-behavior reduced equivalents are tabulated in `MOTION.md`; per-screen ones in
`COMPONENT_STATES.md`.

## Parental gate (safety, not just UX)

Any exit to the open web or a purchase sits behind the **"Ask a grown-up"** gate: a **written,
multi-step numeric answer** a young child can't tap through by accident, fully keyboard reachable.
The child area contains **no link** to account, billing, or settings.

## Safety-content review

All Brave Basecamp (safety/consent/boundaries) content, and the culture representation in World
Garden, **require qualified human review before ship.** Politeness never overrides safety, consent,
or body autonomy anywhere in the product.
