# Components

The shared component set that pages are built from. Design intent lives in
`docs/DESIGN_SYSTEM.md`; this file is the working reference for using the code.

Everything lives in `src/components/ui/` (primitives) and
`src/components/shells/` (page chrome). One PascalCase file per component, a
matching named export, no barrel file — import directly:

```tsx
import { Button } from "@/components/ui/Button";
```

Run `npm run dev` and open `/dev/gallery` to see every component in every
state. That route 404s outside development.

## Tokens

All tokens live in `src/styles/tokens.css` as a Tailwind v4 `@theme` block.
Components consume them through utilities (`bg-surface`, `text-text-secondary`,
`rounded-lg`) and never hardcode hex.

### Colour, and the `-strong` rule

The base palette is warm and light. Measured against white and against the
`#fffaf2` background, the base hues land between 3.1:1 and 4.2:1 — enough for
large text and non-text graphics, **not** enough for normal text under WCAG AA.
So the palette is split by job:

| Use                                                       | Token                                                                                |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Borders, tints, decorative fills, the focus ring          | `brand-primary`, `brand-secondary`, `success`, `warning`                             |
| Anything carrying text — a filled button, an accent label | `brand-primary-strong`, `brand-secondary-strong`, `success-strong`, `warning-strong` |

Measured ratios are recorded in `tokens.css` beside the tokens. `danger`
(4.57:1 on white) needs no strong variant. The focus ring keeps the base
`brand-primary` at 3.18:1 against the background, which clears the 3:1
non-text threshold.

If you add a colour, measure it before you commit it.

### Typography

`--text-xs` through `--text-5xl`, each with a paired line height, sized a step
above Tailwind's defaults: this interface is read by 5-to-9-year-olds, often on
a phone, often aloud by an adult beside them.

`--font-sans` is a system stack. That is a decision, not an omission — it meets
the legibility requirements at zero bytes and keeps `next build` free of a
network dependency. Swapping in a real face later is one change to `--font-sans`
plus a `next/font/local` call in the root layout.

### Elevation and motion

Two shadows only, `shadow-soft` and `shadow-lifted`, tinted with the ink colour
so they stay warm on cream. `--default-transition-duration` and
`--default-transition-timing-function` set the feel of every `transition-*`
utility. Tailwind has no `--duration-*` or `--ease-*`-by-default namespace worth
inventing tokens for here: overriding the two defaults reaches every transition
in the app, whereas a bespoke `--ease-gentle` would only apply where someone
remembered to write `ease-gentle`. Tailwind also tree-shakes theme variables
that no utility references, so an unused token generates nothing at all.

Reduced motion is handled globally in `src/styles/globals.css`. Components do
not need their own media queries — but they do need their **un-animated state
to be an acceptable resting state**, because that is what the global rule
collapses them to.

## The `className` contract

`cn()` in `src/lib/cn.ts` joins class names and drops falsy values. It is not
`tailwind-merge`: it does **not** resolve conflicting utilities. `cn("p-4",
"p-6")` emits both, and the winner is decided by Tailwind's stylesheet order,
not by argument order. Passing the caller's `className` last is for
readability, not precedence.

Conflicts are avoided structurally instead:

1. **Components own appearance** — colour, radius, border, weight, focus.
2. **Callers own layout** — margin, width, grid placement. Components never set
   these, so there is nothing to collide with.
3. **Anything designed to vary is a prop**, not a class. Reaching for
   `className="bg-…"` means the component is missing a variant. Add the variant.
4. **Last resort:** Tailwind's important modifier, `className="p-2!"`. Treat it
   as a signal that a variant is missing.

If conflicts ever become routine, add `tailwind-merge` and record it as a
decision. One dependency beats a UI that looks wrong.

## The landmark contract

`src/app/layout.tsx` renders the document and `SkipLink`, and nothing else.
The `banner`, `main`, and `contentinfo` landmarks belong to the shells, so the
child and parent surfaces can have genuinely different chrome.

Every route passes through exactly one shell:

| Route                       | Shell                                                 |
| --------------------------- | ----------------------------------------------------- |
| Every marketing page        | `ParentAppShell` via `src/app/(marketing)/layout.tsx` |
| `/learn`, `/learn/lesson/…` | `ChildAppShell` via `src/app/learn/layout.tsx`        |
| `/parent`                   | `ParentAppShell` via `src/app/parent/layout.tsx`      |
| 404, error                  | `ParentAppShell`, rendered by the page itself         |

The marketing site adds eight more routes to that first row rather than a
second shell, which is why `SiteHeader` carries the marketing navigation.
`SiteFooter` takes a `navigation` prop that `ChildAppShell` sets to `false`, so
a child never sees the marketing links — `AppShell.test.tsx` asserts the child
shell exposes no `navigation` landmark at all.

`LessonShell` is not in that table on purpose: it is chrome _inside_ `main`,
not a landmark provider, so it nests under `ChildAppShell` without adding a
second `header` or `footer`.

`not-found.tsx` and `error.tsx` sit directly under the root layout, so they
supply their own shell. That is why the shells are components rather than
layout files.

**A page must never render a second `header`, `main`, or `footer`.**
`e2e/shell.spec.ts` asserts one of each and Playwright's strict mode throws on
a duplicate; `src/components/shells/AppShell.test.tsx` pins the same contract in
the unit suite so it fails in seconds instead of in a full e2e run.

`main` keeps `id="main-content"` because `SkipLink` targets it.

## Content rules the components enforce

These are product requirements from `docs/CURRICULUM_PRINCIPLES.md`,
`docs/PRIVACY_AND_SAFETY.md`, and `CLAUDE.md`, encoded so they are hard to
break by accident.

- **`ChoiceCard` has no `correct` or `incorrect` prop, and must never gain
  one.** A child's choice is not scored. Outcomes are described separately by
  `InlineFeedback` in the neutral `helpful` / `mixed` / `needs-context`
  vocabulary that mirrors `consequenceType` in `docs/CONTENT_SCHEMA.md`.
  A test asserts that no correctness wording renders.
- **No points, badges, streaks, or rankings.** `ProgressBar` states position,
  not performance; `MissionCard` labels status with a neutral word.
- **`Avatar` has no `src` prop and renders no `img`.** Child profiles are a
  nickname and an age band only. The type makes photographs impossible.
- **No free-form child input.** Nothing in this set renders an `input` or
  `textarea`; practice and mission confirmation are taps and selections only.
- **Nothing is communicated by colour alone.** Selection carries `aria-pressed`
  and a check icon; feedback carries an icon and a text title; progress carries
  a visible count; mission status carries a word.
- **No remote images.** Scene illustrations in `src/components/lesson/` are
  inline SVG built from local shapes, are always `aria-hidden`, and fall back to
  a neutral drawing for an unknown key. Content validation rejects an
  `illustrationKey` that looks like a URL.
- **Review status is shown, never implied.** `ContentStatusBadge` renders the
  real `status` from the content, and validation refuses to let a lesson claim
  review without a named reviewer and a date.

## Components

### Typography — `Heading`, `Text`

`Heading` takes `level` (semantic, 1–4) and `size` (visual) separately, so a
page never skips a heading level to get the size it wants. `size` defaults to
the one that matches `level`.

```tsx
<Heading level={2} size="sm">Not built yet</Heading>
<Text tone="secondary">Supporting copy.</Text>
```

### `Button`, `ButtonLink`

Four variants (`primary`, `secondary`, `quiet`, `danger`), two sizes. `isLoading`
sets `aria-busy`, disables the button, and **keeps the label in the DOM** so the
accessible name never changes mid-interaction. Defaults to `type="button"`.

`ButtonLink` is a separate export wrapping `next/link` with the same styling —
a control that navigates should be an anchor. There is no `asChild`.

Neither carries `"use client"`. A caller that passes `onClick` is itself the
client component.

### `IconButton`

`label` is required and `aria-label` is removed from the prop type, so an
icon-only button without an accessible name will not compile. Fixed at 44×44.

### `Card`

A surface, and nothing more. No heading, no title prop. `as` accepts
`div | article | section | li`.

### `ChoiceCard`, `ChoiceList`

Buttons inside a labelled list, reached with Tab and activated with
Enter/Space — not radios. A lesson choice is "tap this and see what happens",
not a form field to revise before submitting, and arrow-key selection would
commit a child to an outcome just by exploring.

Grouping is the caller's job: wrap the set in `ChoiceList` with a `label`.

### `ProgressBar`

`role="progressbar"` with `aria-valuenow/min/max/valuetext`, plus a visible
"3 of 8" count. Clamps out-of-range values and survives `max={0}`.

### `Avatar`, `ProfileCard`

`Avatar` derives an initial and a stable tint from the nickname, counted by
code point so an emoji nickname stays intact. `decorative` removes it from the
accessibility tree when the nickname is already visible beside it.

`ProfileCard` renders a button when given `onSelect`, a link when given `href`,
and plain information otherwise.

### `MissionCard`

Title, description, optional status and action. Content-agnostic: it knows
nothing about the curriculum.

### `Dialog` — the only client component

Hand-rolled rather than native `<dialog>`: jsdom 30 ships `HTMLDialogElement`
with only the `open` attribute reflection — no `showModal` — so a native
dialog's focus containment would be untestable in the unit suite. Ours is
tested: focus moves in on open, Tab and Shift+Tab wrap inside the panel, Escape
closes, focus returns to the trigger, and body scroll is restored.

Rendered inline rather than through a portal, so it must not be nested under a
transformed or filtered ancestor. Portalling is the upgrade path if that
becomes a constraint.

### `InlineFeedback`

Chosen over a toast deliberately: feedback in a lesson should stay on screen
next to the thing it is about, not slide away on a timer while a six-year-old
is still reading it. `role="status"` and `aria-live="polite"` for lesson tones;
`role="alert"` only for `problem`.

### `EmptyState`, `ErrorState`, `Skeleton`

First-class states, not afterthoughts — every screen needs all three.
`ErrorState` takes `live` to control whether it is an `alert`: a statically
rendered error page should not shout on every navigation, an error raised in
response to an action should. `Skeleton` hides its bars from assistive
technology and announces loading once via a `role="status"` sibling.

### `PageContainer`

The page gutter and measure. Replaces the `mx-auto max-w-5xl px-4 py-12` string
that was copied into every page.

### `ContentStatusBadge`

The review state of a piece of content, shown rather than hidden — `CLAUDE.md`
requires visible internal metadata for draft, reviewed, and published content.
The visible label is one word; the longer explanation ("Draft content, not yet
reviewed by a qualified human") is always present for screen readers and can be
shown visibly with `withDescription`. Muted, not alarming: draft is information,
not an error.

### `StoryPanel`

A scene: picture, title, narration, and optional children below. Takes the
illustration as a node rather than a key, so no curriculum vocabulary reaches
the design system. **The illustration slot is decorative by contract** — a test
asserts the panel reads identically with the picture missing.

### `ParentInsightCard`

Something addressed to the adult, rendered inside a child's screen. An eyebrow
label ("For grown-ups") and a sand tint make it obviously not addressed to the
child. Holds a paragraph and a few concrete suggestions; parent participation
should be useful but lightweight.

### `ParentalGate`, `ParentAreaExit` — the "Ask a grown-up" gate

The barrier a young child cannot tap through by accident. `ParentalGate` reuses
`Dialog` and asks a small addition sum with the numbers spelled out in words
("what is seven plus five?"); Continue enables only when the typed number is
right. The sum comes from `src/features/parental-gate/puzzle.ts`, a pure helper
that takes its randomness as an argument — fresh on every open so it cannot be
memorised, deterministic under test. It is a UX gate, not authentication; the
server stays the authority for anything it precedes. Two purposes tailor the
copy: `return` (leaving the child area) and `purchase` (before a live checkout).

`ParentAreaExit` is the visible affordance in the child area — a button, never a
one-tap link — used by the shell header ("For parents") and the profile picker
("For grown-ups"). It opens the gate and routes to `/parent` only once solved,
so the learning area holds no plain link to account, billing, settings, or the
open web (decision 037; docs/design/ACCESSIBILITY.md). There is no success
toast: the navigation that follows is the confirmation.

### Marketing components — `src/components/marketing/`

Public-site pieces, kept out of `ui/` because they carry product voice rather
than being neutral primitives. See `docs/MARKETING_SITE.md`.

- `MarketingSection` — one labelled band of a page: heading, optional lead, and
  a full-bleed tint. Every public section is labelled by its own heading so a
  long page has a usable outline.
- `SampleScenarioSection` (server) and `SampleScenario` (client) — the playable
  demo. Composes `ChoiceStepView` and `PrincipleStepView` rather than reusing
  `LessonRunner`, and **stores nothing**: no local storage, no cookie, no
  request. Tests in both suites assert that.
- `WaitlistForm` — one email field, an optional age band, and nowhere to type a
  name. Validates with the same function the route handler uses.
- `Faq` — native `<details>` disclosures, so the browser supplies the keyboard
  behaviour and the answers are reachable with scripting unavailable.
- `BetaBadge` — the private-beta label, shown beside the wordmark on every page.
- `JsonLd` — emits a schema.org block.

`ChoiceStepView` and `PrincipleStepView` gained a `headingLevel` prop so they
can be embedded in a marketing section without skipping a level.
`nextHeadingLevel` in `Typography.tsx` is the helper for a component that
renders a heading and a sub-heading at a depth its author does not know.

### `LessonShell`

Lesson chrome: title, content status, a `ProgressBar` showing position, the
current step, and a footer for navigation. Content-agnostic — it renders what
it is handed and knows nothing about scenes or choices.

It owns one behaviour: when `stepKey` changes, focus moves to the step region,
so a keyboard or screen-reader user is not left parked on a button at the
bottom of a page whose content has silently been replaced. It does **not** move
focus on first render.

The only client component here besides `Dialog`, and for the same kind of
reason: focus management needs an effect.

## What the tests do not cover

Worth knowing so nobody assumes more coverage than exists. jsdom has no layout
engine and runs no CSS, so these are verified in the gallery and by
`npm run test:e2e`, not in unit tests:

- The 44×44 target floor — element sizes are all zero in jsdom.
- Focus ring appearance and colour contrast.
- Reduced motion. `vitest.setup.ts` mocks `matchMedia` to `matches: false`
  unconditionally, and jsdom evaluates no media queries. This is why the
  skeleton's resting appearance is designed to be acceptable on its own rather
  than depending on a runtime check.
- Scroll locking actually preventing scroll. The tests assert the style is set
  and restored, not the effect.

Assert on roles, accessible names, and ARIA state. Never assert on class names:
that couples tests to styling and still passes when the CSS is broken.
