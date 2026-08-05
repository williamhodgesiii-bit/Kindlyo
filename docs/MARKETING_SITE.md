# Marketing Site

The public site: what it says, what it must never say, and how the pieces fit.

Corresponds to `prompts/07-marketing-site.md` and the marketing experience in
`MVP_SCOPE.md`.

## Pages

All live in the `(marketing)` route group, which wraps `ParentAppShell` because
the marketing site speaks to the parent — the account holder.

| Path            | What it is                                                                    |
| --------------- | ----------------------------------------------------------------------------- |
| `/`             | Homepage. Ten sections, one `h1`.                                             |
| `/how-it-works` | The seven steps of a lesson, plus the playable sample.                        |
| `/curriculum`   | The module, the six practice areas, the eight lessons, and the review status. |
| `/for-parents`  | The parent companion experience. **Not** `/parent`, which is the product.     |
| `/safety`       | Safety and privacy, in plain language. Accurate and current.                  |
| `/pricing`      | Placeholder. No numbers, no tiers, no offers.                                 |
| `/waitlist`     | The founding-family form.                                                     |
| `/privacy`      | Privacy policy placeholder. Not a policy.                                     |
| `/terms`        | Terms of use placeholder. Not a contract.                                     |

`/safety` and `/privacy` are deliberately different pages. The first explains
what we actually do and is true today; the second is where a reviewed legal
notice will go. Each says which it is and links to the other.

## Rules the copy is written to

These come from `CLAUDE.md` and `PRIVACY_AND_SAFETY.md`, and they are the whole
reason several sections read as lists of absences.

- **No unsupported claims.** Nothing on the site says Kindlyo has been shown to
  produce a result. The success signals in `PRODUCT_BRIEF.md` are internal
  hypotheses and do not appear.
- **No testimonials and no user numbers.** There are no quotes, no "join 4,000
  families", no place-in-queue counter, and no countdown. All of those would be
  invented.
- **No implied expert approval.** The curriculum is draft. The FAQ answers
  "has this been reviewed by educators or psychologists?" with a plain no, the
  curriculum page states it again, and every rendering of lesson content carries
  `ContentStatusBadge`.
- **Beta status is visible everywhere.** `BetaBadge` sits beside the wordmark in
  the header, so it is on every page without a dismissible banner.
- **No dark patterns.** No manufactured urgency, no pre-ticked boxes, no
  cancel-flow language, and nothing that collects more than it needs.

Where the site can show rather than claim, it does: the sample scenario is real
lesson content rendered by the real lesson components, the skills grid is
generated from `skillAreas` in the curriculum schema, and the lesson-loop list
is the step order `buildLessonSteps` actually produces.

## The sample scenario

`SampleScenarioSection` (server) → `SampleScenario` (client).

The contract, which the tests enforce:

- **Nothing is stored.** Two `useState` values and no more. No local storage, no
  cookie, no request. `SampleScenario.test.tsx` asserts
  `window.localStorage.length === 0` after a full play-through, and
  `e2e/marketing.spec.ts` asserts the same against a production build.
- **No profile is involved.** It does not use `LessonRunner`, `useLessonRun`, or
  `useFamily`. It composes `ChoiceStepView` and `PrincipleStepView` directly —
  the same components a child sees — with the same authored content.
- **The catalogue stays on the server.** The section component picks the scene
  and the principle out of the lesson and passes only those across.
- **Draft status is shown**, not omitted because the page is trying to persuade.

It calls `getLessonBySlug("saying-hello", true)`, passing the draft flag
explicitly. `canViewDraftContent()` returns true today but is documented as
becoming a role check when accounts exist; without the explicit argument this
section would silently disappear for anonymous visitors at that point. If the
lesson or a required step is missing it renders nothing rather than throwing.

## The waitlist

```
WaitlistForm ──► POST /api/waitlist ──► WaitlistSink
     │                   │
     └── parseWaitlistSubmission ──┘   (the same validator on both sides)
```

- `src/features/waitlist/validate.ts` is the single validator. The form runs it
  before fetching, so a bad address never leaves the browser and the message it
  shows cannot contradict the one the server would return.
- The submission is `{ email, ageBand? }`. There is no field for a name, and the
  validator rejects unknown fields — a form with nowhere to put a child's name
  should also be an endpoint with nowhere to put one.
- `src/features/waitlist/rateLimit.ts` is a fixed-window in-memory counter. It
  raises the cost of holding down the submit button and is not a security
  control; a real one belongs at the edge.

### The sink is a placeholder, and it is a launch blocker

`getWaitlistSink()` returns `logWaitlistSink`, which writes one JSON line to the
server log. There is no database yet (`prompts/09-database.md`).

**Before the site is promoted publicly this must be replaced with real
storage.** Log retention is not a mailing list, and collecting an address that
cannot be retrieved is worse than not collecting it. Decision 030 records this.

The confirmation copy is written to match what the sink does: it says the
address is recorded, and states the intention to be in touch. It does not
promise a message that no system currently sends.

## SEO surface

- `src/lib/seo.ts` — `pageMetadata({ title, description, path })`. Every
  marketing page builds its `metadata` export from it, which is the whole
  consistency mechanism for canonical URLs, Open Graph, and Twitter cards.
- `src/app/layout.tsx` — `metadataBase`, plus the site-wide Open Graph and
  Twitter defaults.
- `src/app/sitemap.ts` — the nine marketing routes. Lesson routes are excluded
  because they are draft and already `robots: { index: false }`; `/learn` and
  `/parent` are excluded because they are prototype surfaces.
- `src/app/robots.ts` — allow all, disallow `/api/` and `/dev/`.
- `src/app/opengraph-image.tsx` — a 1200×630 placeholder card drawn with
  `next/og` (ships with Next, no dependency). Type on the brand background, no
  illustration and no claim on it. A designed card is a separate task.
- `src/app/icon.svg` — the favicon.
- `src/lib/structuredData.ts` — `Organization` and `FAQPage` blocks. The FAQ
  block is generated from the same `faqEntries` array the page renders, so the
  two cannot drift.

All absolute URLs come from `NEXT_PUBLIC_APP_URL`. Set it correctly per
environment or the site will publish localhost canonicals.

## Navigation

One `SiteHeader` and one `SiteFooter`, shared with the parent area, so there is
never more than one `banner` or `contentinfo` on a page.

The header collapses into a native `<details>` disclosure below `md`. The links
are therefore in the markup twice inside a single `<nav>`, and CSS decides which
copy is displayed — invisible in a browser, visible to jsdom, which is why the
unit tests use `getAllByRole`. Decision 031.

`SiteFooter` takes `navigation`, which `ChildAppShell` sets to `false`: a child
working through a scenario is not shown a pricing link.

## Content sources

| File                                    | Holds                                                                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/marketing/faq.ts`          | The FAQ, rendered and emitted as structured data.                                                                                         |
| `src/content/marketing/skills.ts`       | Public descriptions keyed by `SkillArea`, with `satisfies` — a seventh area fails the typecheck until somebody writes public copy for it. |
| `src/content/marketing/learningLoop.ts` | The seven lesson steps, described for parents.                                                                                            |

## What the tests do not cover

- Visual design, spacing, and how the tinted bands read on a wide screen.
- Whether the copy is any good, or whether it converts.
- Colour contrast is inherited from the tokens rather than measured per page.
- The Open Graph image is built at build time but never rendered in a test; a
  broken card would show up as a bad social preview, not a failing check.
- Structured data is emitted but not validated against schema.org.
