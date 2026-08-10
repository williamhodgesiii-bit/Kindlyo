# Decisions

This is a lightweight decision log. Each entry records a decision that shapes the
product or codebase, why it was made, and its status. Add a new entry rather than
editing history; supersede an entry by adding a newer one that references it.

Format:

```text
## NNN. Title
- Date:
- Status: accepted | superseded | proposed
- Context:
- Decision:
- Consequences:
```

---

## 001. Parent owns the account; children have no independent login

- Date: 2026-08-03
- Status: accepted
- Context: The learners are children ages 5–9. Privacy and safety require the
  minimum viable data and a clear responsible adult.
- Decision: The parent or guardian is the only account holder. Child profiles
  exist under the parent account with nicknames and age bands only. Children do
  not have credentials, email, legal names, or birth dates.
- Consequences: Simpler auth surface, stronger privacy posture, and no
  child-directed account recovery flows. See `PRIVACY_AND_SAFETY.md`.

## 002. Ship a single vertical-slice MVP: the "Meeting People" module

- Date: 2026-08-03
- Status: accepted
- Context: The central hypothesis is repeat use of short scenario-based lessons
  plus real-world missions.
- Decision: Build one complete learning journey (eight lessons in the "Meeting
  People" module) end to end rather than many shallow modules.
- Consequences: Depth over breadth; scope is fixed by `MVP_SCOPE.md`. Additional
  modules are explicitly out of scope until validated.

## 003. Modular monolith on Next.js + TypeScript

- Date: 2026-08-03
- Status: accepted
- Context: A small team building an MVP needs simple, maintainable architecture.
- Decision: Use a modular monolith (Next.js, TypeScript strict, React, Tailwind,
  PostgreSQL, Supabase or equivalent, Stripe, Vitest/RTL/Playwright). No
  microservices. Business logic lives in `features/`, not in page components.
- Consequences: Low operational overhead; clear domain boundaries. See
  `ARCHITECTURE.md`.

## 004. Curriculum is structured content, not hardcoded UI

- Date: 2026-08-03
- Status: accepted
- Context: Lessons must be reviewable, versioned, and safe to publish.
- Decision: Store lessons as structured data conforming to the model in
  `CONTENT_SCHEMA.md`. UI components render data and contain no
  curriculum-specific logic. Published content is immutable; revisions create a
  new version; completion records the version.
- Consequences: Enables a draft → reviewed → published workflow and clean
  content review. Draft content must never reach normal users.

## 005. Family subscription as the primary business model

- Date: 2026-08-03
- Status: accepted
- Context: The validation question is whether families will pay for the
  experience.
- Decision: Primary revenue is a family subscription via Stripe on the web. Other
  models (packs, workshops, licensing) are future possibilities only.
- Consequences: Billing, entitlements, and cancellation are in MVP scope
  (Phase 6). No advertising and no in-app purchases directed at children.

## 006. Safety and consent always outrank politeness

- Date: 2026-08-03
- Status: accepted
- Context: Etiquette content aimed at children carries real-world risk if it
  teaches compliance over safety.
- Decision: Lessons teach that children may say no, refuse contact, leave unsafe
  situations, interrupt in emergencies, and tell a trusted adult. Feedback avoids
  shame, moral scoring, and obedience framing.
- Consequences: Content review must check safety, consent, cultural, and
  accessibility notes on every lesson. See `CURRICULUM_PRINCIPLES.md`.

## 007. First-party, minimal analytics only

- Date: 2026-08-03
- Status: accepted
- Context: The product serves children; third-party tracking is prohibited
  without legal review.
- Decision: Collect only first-party product events (see `ANALYTICS.md`) that
  answer specific product questions. No third-party pixels, no full child names,
  no free-form child speech, no precise location.
- Consequences: Analytics is intentionally narrow and privacy-preserving.

## 008. Anonymous learning loop before accounts

- Date: 2026-08-03
- Status: accepted
- Context: The central hypothesis is repeat use of the lesson loop. Building
  authentication first delays the only thing worth validating.
- Decision: Build the lesson experience with no authentication or database
  first. Accounts, profiles, and persistence follow. Matches `ROADMAP.md`,
  where Phase 2 (learning loop) precedes Phase 3 (family accounts).
- Consequences: The loop is user-testable early. Progress is not persisted until
  the accounts slice, so early testing is single-session.

## 009. Curriculum stored as typed files; `LessonVersion` dropped for the MVP

- Date: 2026-08-03
- Status: accepted
- Context: `CONTENT_SCHEMA.md` modelled a single `Lesson` with inline
  `status`/`version`, while `ARCHITECTURE.md` listed a separate `LessonVersion`
  entity — two shapes for one concept.
- Decision: `CONTENT_SCHEMA.md` is canonical. Lessons live as typed content
  files under `src/content`, validated at build and test time, carrying their own
  `version` and `status`. `LessonVersion` is **not** implemented for the MVP.
- Consequences: Content is git-reviewable with no database dependency, and the
  contradiction is resolved. The `LessonVersion` entry in `ARCHITECTURE.md`'s
  data-entity list does not apply to the MVP. Revisit if content ever needs
  editing outside of git.

## 010. No free-form child input anywhere

- Date: 2026-08-03
- Status: accepted
- Context: Guided practice and mission completion questions implied capturing
  child responses, which `PRIVACY_AND_SAFETY.md` and `ANALYTICS.md` forbid.
- Decision: Practice and mission confirmation use taps and selections only. No
  text or audio input is collected from children anywhere in the product.
- Consequences: Removes the risk of storing child speech entirely, and suits
  five-year-olds who may not yet type. Resolves the conflict between the
  curriculum and privacy documents.

## 011. Toolchain pinned behind the newest majors

- Date: 2026-08-03
- Status: accepted
- Context: At setup, npm `latest` offered TypeScript 7 and ESLint 10, but the
  plugins bundled with `eslint-config-next@16` declare peer support only up to
  ESLint 9, and `typescript-eslint@8` requires TypeScript `<6.1.0`.
- Decision: Pin TypeScript 5.9.3 and ESLint 9.39.5 with Next.js 16, React 19,
  Tailwind 4, Vitest 4, and Playwright 1.62. Dependencies are pinned exactly
  (no `^`) for reproducible installs.
- Consequences: Zero unmet peer dependencies. Revisit when the Next.js ESLint
  plugins and `typescript-eslint` declare support for the newer majors.

## 012. Environment validation without a schema library

- Date: 2026-08-03
- Status: accepted
- Context: External input must be validated, but `CLAUDE.md` also asks us to
  avoid unnecessary dependencies.
- Decision: Hand-roll environment validation in `src/lib/env.ts` rather than add
  a schema library. It reports every problem at once, names the offending
  variable, and fails the build on malformed values.
- Consequences: One fewer dependency for a small surface. If validation needs
  grow substantially (nested config, many services), reconsider adding a library.

## 013. Base components are hand-rolled, with no class-merging dependency

- Date: 2026-08-04
- Status: accepted
- Context: The component set needs variants and a `className` passthrough. The
  usual answer is `clsx` plus `tailwind-merge`, often with `cva` and a headless
  library on top. `CLAUDE.md` asks us to avoid unnecessary dependencies, and
  decision 012 set the precedent of hand-rolling a small surface.
- Decision: No `clsx`, `tailwind-merge`, `cva`, or Radix. `src/lib/cn.ts`
  concatenates class names and drops falsy values, nothing more. Variants are
  props backed by `satisfies Record<Union, string>` lookups; `className` is
  additive and callers own layout while components own appearance.
- Consequences: Conflicting Tailwind utilities are not deduped, so `className`
  is not an override channel — documented in `docs/COMPONENTS.md`. If overrides
  become routine, add `tailwind-merge` and supersede this record.

## 014. Dialog is hand-rolled rather than the native element

- Date: 2026-08-04
- Status: accepted
- Context: A modal could use the native `<dialog>` element and get focus
  containment from the browser. But jsdom 30.0.1 implements
  `HTMLDialogElement` with only the `open` attribute reflection — no
  `showModal`, `show`, or `close` — so the behaviours that matter most (focus
  moving in, staying trapped, and returning to the trigger) would be
  unverifiable in the unit suite.
- Decision: Hand-roll `role="dialog" aria-modal="true"` with our own focus
  trap, Escape handling, focus restore, and scroll lock. Render inline rather
  than through a portal.
- Consequences: The trap is our code and is unit-tested. A Dialog must not be
  nested under a transformed or filtered ancestor; portalling is the documented
  upgrade path if that becomes a real constraint.

## 015. The palette gains accessible `-strong` variants

- Date: 2026-08-04
- Status: accepted
- Context: The provisional palette in `docs/DESIGN_SYSTEM.md` is warm and
  light. Measured against white and the `#fffaf2` background, `brand-primary`
  is 3.31:1, `brand-secondary` 3.11:1, `warning` 3.57:1, and `success` 4.18:1 —
  all below the 4.5:1 WCAG AA threshold for normal text. Every primary call to
  action in the app was affected, while the same document requires sufficient
  contrast.
- Decision: Keep the base hues for borders, tints, decorative fills, and the
  focus ring (3.18:1 against the background, above the 3:1 non-text threshold).
  Add `brand-primary-strong`, `brand-secondary-strong`, `success-strong`, and
  `warning-strong` at 5.4:1 or better, and use them wherever text is involved.
- Consequences: Filled buttons and accent labels are visibly deeper than the
  original swatches. Ratios are recorded beside the tokens so a future palette
  change can be checked against the same bar.

## 016. Toast dropped; three components deferred

- Date: 2026-08-04
- Status: accepted
- Context: `docs/DESIGN_SYSTEM.md` lists a Toast, a Lesson shell, a Story
  panel, and a Parent insight card in the initial component set.
- Decision: Ship inline feedback instead of a toast — lesson feedback should
  stay on screen beside what it describes rather than time out while a
  six-year-old is reading. Realise "Profile selector" as `ProfileCard`. Defer
  `LessonShell`, `StoryPanel`, and `ParentInsightCard` to the lesson-engine
  slice, where the content model exists to shape them.
- Consequences: The design system covers everything the lesson engine needs to
  start, without inventing two lesson components blind. Revisit a toast only
  when something genuinely transient needs announcing.

## 017. The content model gains four richer fields

- Date: 2026-08-04
- Status: accepted
- Context: The proposed model in `docs/CONTENT_SCHEMA.md` carried `principle`
  and `practicePrompt` as bare strings, and left the parent coaching prompt and
  the completion screen to the UI. Authoring lesson one showed all four to be
  too thin: `CURRICULUM_PRINCIPLES.md` requires every explanation to carry its
  context, consent, and safety qualifiers, and the brief asks for a rehearsal
  interaction rather than a sentence.
- Decision: `principle` becomes `{ title, body, points[] }`; `practicePrompt`
  becomes `practice` — a prompt plus two or more genuinely acceptable options,
  each with its own encouragement. Add `parentCoaching` and `completion` as
  authored content. `docs/CONTENT_SCHEMA.md` is updated to match rather than
  left describing something we did not build.
- Consequences: Coaching and completion copy is specific to the skill instead
  of generic UI text, and the safety qualifiers live in content where a
  reviewer can see them. The cost is four more fields to author per lesson.

## 018. Lesson content is validated at runtime, on import

- Date: 2026-08-04
- Status: accepted
- Context: Content is authored in TypeScript, so shapes are already checked at
  compile time. But the rules that matter are curriculum rules — a decision
  needs two or more options, a principle needs a context point, nothing may
  claim review without a named reviewer — and those are invisible to the type
  system. Content may also arrive from a CMS later.
- Decision: Hand-roll a validator (`src/features/curriculum/validate.ts`) and
  run it over every lesson when `src/content/lessons` is imported. Because the
  lesson pages import that registry, malformed content fails `next build`. It
  collects every issue rather than throwing on the first. No schema library:
  the surface is small and the useful rules are ours, following decisions 012
  and 013.
- Consequences: A content mistake is caught before deploy, with a path to each
  problem. There is no separate content build step to remember. The validator
  is code we maintain; if content moves to a CMS with its own schema tooling,
  revisit this.

## 019. Lesson progression is a pure reducer, and demo progress is local only

- Date: 2026-08-04
- Status: accepted
- Context: The lesson engine needs progression rules (you cannot skip a
  decision), and the slice has no database. Both could have lived in the
  renderer with `useState`.
- Decision: Progression is a pure reducer over a step list derived from
  content (`src/features/lessons/`), so the rules can be tested without
  rendering and no page can invent a different rule. `hydrated` is part of the
  machine rather than a `useState` beside it, so restoring saved progress is
  one transition. Refresh-safe progress is written to one local-storage key,
  holding only step index, option ids, and a completion timestamp — never a
  name, age, or free text — and tagged with the lesson version so a revision
  cannot silently resume into a different lesson.
- Consequences: Progression is covered by fast unit tests, and the renderer
  only decides what to draw. Local storage is scaffolding: it is per-device,
  per-browser, and shared by everyone using that device, which is acceptable
  for demo progress and not acceptable for real progress. Real progress belongs
  to a child profile in the database, and replaces this.

## 020. Draft content is visible, and labelled, until accounts exist

- Date: 2026-08-04
- Status: accepted
- Context: `docs/CONTENT_SCHEMA.md` requires that draft lessons not appear to
  normal users. Every authored lesson is draft — nothing has been reviewed by a
  qualified human — and there is no user to check against yet, so enforcing the
  rule literally would leave the lesson engine unreachable.
- Decision: `canViewDraftContent()` in `src/features/curriculum/catalog.ts`
  returns `true` for now, and every surface that shows a lesson also shows a
  `ContentStatusBadge` reading "Draft", with the longer explanation available to
  screen readers. That function is the single place the rule changes.
- Consequences: The slice is usable and honest about what it is showing. When
  accounts land, `canViewDraftContent` becomes a role check and
  `getLessonBySlug` starts returning `undefined` for drafts — which the lesson
  route already turns into a 404 through the same path as an unknown slug, so
  the URL cannot be used to probe for unreleased content.

## 021. Local progress is scoped to a child profile, in a v2 store

- Date: 2026-08-04
- Status: accepted
- Context: Decision 019 stored demo progress as a single anonymous track. The
  module now needs progress per child, and "one child's progress must never
  appear for another child" is a product rule, not a nicety. There is still no
  database and no account to hang a profile on.
- Decision: Add local child profiles (`src/features/profiles/`) — a nickname,
  an age band, an id, and a created-at date, capped at three, with the cap and
  the validation enforced in the store rather than in the form. Move lesson
  progress to a v2 key nested under the profile id, so every read and write
  takes a `profileId` first and scoping cannot be forgotten at a call site. The
  v1 key is ignored rather than migrated.
- Consequences: Profile separation is enforced by the shape of the store and
  covered by unit and end-to-end tests. Discarding v1 loses any demo progress
  from the previous build, which is the right trade for scaffolding. Local
  storage is still per-device and shared by everyone using it; the database
  slice replaces both stores, and the profile shape is deliberately close to
  what that table will hold.

## 022. Completions survive a lesson revision; runs do not

- Date: 2026-08-04
- Status: accepted
- Context: Every progress record carries the lesson version it was made
  against. Decision 019 discarded anything from a different version, which is
  right for a resumable position and wrong for a finished lesson: a typo fix
  would have erased a child's completed lessons and re-locked the rest of the
  module behind them.
- Decision: Split the two. A `run` stays version-strict — the step it points at
  may have moved, so a revision discards it and the lesson starts fresh. A
  `completion` records the version but is never invalidated by a later one.
  Replaying a lesson keeps the first completion rather than rewriting it.
- Consequences: A content edit is safe to make. The recorded version is the
  audit trail — it says which text a child actually completed — rather than a
  cache key. If a lesson is ever rewritten so substantially that old
  completions should not count, that needs a deliberate migration, not a
  version bump.

## 023. Lesson 8 is the review activity; missions are marked by the parent

- Date: 2026-08-04
- Status: accepted
- Context: The module needs a review activity and an offline-mission status.
  Both could have been new subsystems — a quiz engine, a child-facing "I did
  it" button.
- Decision: Author lesson 8 ("Review and real-world challenge", already named
  in `MVP_SCOPE.md`) as a review-shaped lesson in the ordinary content schema:
  decision scenes that revisit the earlier principles in one new story, with
  the real-world challenge as its mission. Mission status is binary and marked
  by the parent in their own area, not by the child on the completion screen.
- Consequences: No new machinery for either. The review benefits from every
  accessibility and content rule the lesson engine already enforces, and
  spaced review can be added later without unpicking it. Marking a mission
  stays with the adult who was actually there, which is also what Journey 4
  describes; a child cannot mark their own homework.

## 024. Onboarding is three steps, skippable, and shown once

- Date: 2026-08-04
- Status: accepted
- Context: A parent arriving at `/parent` for the first time previously met an
  empty dashboard and a bare form. Journey 2 asks for a short onboarding, and
  the honest privacy position — a nickname and an age band, no email, no legal
  name, no birthday, no child login — is most useful to a parent _before_ they
  type anything, not in a policy page afterwards.
- Decision: Three steps — welcome, what we ask for and what we never ask for,
  and the first child profile — gated on an `onboardedAt` timestamp in the
  family store. It can be skipped from the first screen, and the third step is
  real work rather than a "Done" button on a tour. It never reappears, not even
  when the last profile is deleted.
- Consequences: The parent area now has two faces, chosen after hydration, so
  `ParentArea` owns the family state and passes it to whichever renders. Tests
  and end-to-end specs that reach `/parent` on a fresh browser now pass through
  onboarding or seed `onboardedAt`; the seeding helper does the latter. Showing
  onboarding again after a profile deletion was considered and rejected: it
  would read as having lost the account.

## 025. Avatars are a closed set of local drawings

- Date: 2026-08-04
- Status: accepted
- Context: Children recognise their own profile faster with a picture than with
  an initial, and the brief asks for optional avatar selection. The obvious
  implementations — an upload, or a URL field — are both routes to storing a
  photograph of a child, which `docs/PRIVACY_AND_SAFETY.md` forbids without
  legal review.
- Decision: Six avatars, drawn as inline SVG from simple shapes, addressed by a
  string union (`AvatarId`). No upload, no URL, no `img` element, no `src`
  anywhere in the avatar code. Choosing one is optional and reversible: "No
  picture" is a real option in the picker, and the fallback is the nickname's
  initial.
- Consequences: A photograph cannot be represented in the type, so it cannot be
  stored by a form that forgets the rule — the same argument as `Avatar` having
  no `src` prop (decision 001's lineage). The cost is six fixed choices and a
  little hand-drawn SVG to maintain. Commissioned artwork can replace the
  drawings without touching the data model.

## 026. Prototype storage is labelled on screen, not just in the code

- Date: 2026-08-04
- Status: superseded by 034 (data now lives in the account; the on-screen notice
  says so instead)
- Context: Profiles and progress live in local storage while there is no
  database. A parent typing their child's nickname into a form has no way to
  know that, and the difference between "saved to your account" and "saved in
  this browser until you clear it" matters to them.
- Decision: Say it, in the interface, wherever a parent might enter or rely on
  data — a shared `PrototypeStorageNotice` on the dashboard and inside
  onboarding, before the first field. The storage keys say the same thing:
  `kindlyo.prototype.profiles.v1`.
- Consequences: The notice is a component rather than repeated copy, so it can
  be deleted in one place when persistence lands. Renaming the key from
  `kindlyo.demo.*` discards any profiles from the previous build, which is the
  right trade for scaffolding and consistent with decision 021.

## 027. The dashboard answers five questions and refuses to score

- Date: 2026-08-04
- Status: accepted
- Context: A parent dashboard is the most likely place in this product for
  moral scoring to appear. Every instinct of the format — a number, a
  percentage, a comparison between siblings, a streak — pulls towards telling a
  parent how good their child is, which `docs/CURRICULUM_PRINCIPLES.md`
  forbids and which we have no basis to claim anyway.
- Decision: Scope the dashboard to five explicit questions (practised, next,
  mission, context, last used) and derive all of them in one pure module,
  `childDashboard.ts`. Limit the vocabulary to a closed `PracticeStatus` union
  — practised, exploring, ready to review, not started yet — so there is
  nowhere in the type to put "good". Show one child at a time. Assert the
  absence of scoring language in both unit and end-to-end tests.
- Consequences: Adding a new dashboard fact means adding a question to that
  list deliberately, rather than dropping another number onto a card. The
  single-child view costs a click when a parent has two children, and buys the
  guarantee that no sibling comparison can render. If a future stakeholder asks
  for a percentage, this record is the argument against it.

## 028. Lessons carry a skill area; the dashboard groups by it

- Date: 2026-08-04
- Status: accepted
- Context: "What has my child practised?" is unreadable as a list of eight
  lesson titles, and a parent wants the shape rather than the inventory.
  Deriving groupings from `learningObjectives` prose would be guesswork.
- Decision: Add a required `skillArea` field to the lesson schema, as a closed
  union of six practice areas. Areas describe the skill being practised, never
  a trait of a child — there is no "polite" or "confident" member, and adding
  one would defeat the point.
- Consequences: Every lesson must declare an area, checked by the content
  validator, so a new lesson cannot quietly fall outside the summary. The six
  areas are a curriculum decision as much as a technical one and should be
  revisited when a second module is authored.

## 029. Activity is timestamped by the child's actions, not the parent's

- Date: 2026-08-04
- Status: accepted
- Context: "When did my child last use the app?" needs a clock. The obvious
  place — the completion timestamp — misses a child who opened a lesson and did
  not finish, and the obvious implementation would also tick when a parent
  marks a mission from the dashboard.
- Decision: Add `updatedAt` to each progress entry, written when the child
  plays (`writeLessonRun`, `recordCompletion`) and deliberately not when a
  parent marks a mission. Replaying a finished lesson moves the clock but
  leaves the original completion untouched, keeping decision 022 intact.
- Consequences: The answer reflects the child's use rather than the parent's
  visit. It is an additive field, so no store version bump and no lost
  prototype progress; entries written before this change simply have no
  timestamp and are omitted from recent activity.

## 030. The waitlist records to a server log until there is a database

- Date: 2026-08-05
- Status: accepted
- Context: `prompts/07-marketing-site.md` requires a working waitlist that
  validates input, and `docs/MVP_SCOPE.md` lists it in the marketing
  experience. There is no database, no auth, and no email provider in the
  repository — persistence arrives in `prompts/09-database.md`. The options
  were to add a dependency and a secret now, to ship a `mailto:` link that
  validates nothing, or to build the endpoint against a seam.
- Decision: Add `POST /api/waitlist` with hand-rolled validation shared with
  the browser form, behind a `WaitlistSink` interface. The only implementation
  writes one structured JSON line to the server log, named with the
  dot-notation event vocabulary from `docs/ANALYTICS.md`. No new dependency and
  no new secret.
- Consequences: The endpoint, its validation, and the form are all real and
  tested, and swapping in real storage is a new module plus one line in
  `getWaitlistSink`. **Log retention is not a mailing list**: this sink must be
  replaced before the site is promoted publicly, because collecting an address
  that cannot be retrieved is worse than not collecting it. The confirmation
  copy is written to match what the sink actually does. The in-memory rate
  limit is per-process and is not a security control.

## 031. Marketing navigation lives in the shared header, behind a native disclosure

- Date: 2026-08-05
- Status: accepted
- Context: The public site grew from one page to nine. The three-item header
  no longer covered it, and the alternative was a second app shell with its own
  header and footer, which would mean two sets of landmarks to keep correct
  (see the note in `ParentAppShell`).
- Decision: Keep one `SiteHeader`, give it the five marketing links plus a
  waitlist call to action, and collapse it into a native `<details>` disclosure
  below `md`. The links therefore appear twice in the markup, inside a single
  `<nav>`, with CSS choosing which copy is displayed. `SiteFooter` gains link
  groups for the legal placeholders and the two product previews, and a
  `navigation` prop that `ChildAppShell` sets to false.
- Consequences: One banner and one contentinfo per page, as before. No
  JavaScript is needed for the menu and it works with scripting unavailable.
  The duplicate list is invisible in a browser but visible to jsdom, which
  loads no CSS, so unit tests use `getAllByRole` and the real behaviour is
  pinned in `e2e/marketing.spec.ts`. A child never sees the marketing links,
  because the learning area's footer has none.

## 032. The public sample scenario composes the step views rather than reusing LessonRunner

- Date: 2026-08-05
- Status: accepted
- Context: The marketing site needs a scenario playable with no account, and
  `prompts/07-marketing-site.md` requires that it neither require nor collect
  child personal data. `LessonRunner` gates on `useFamily()`, reads saved
  progress, and writes every step to local storage — all correct for the
  learning area and all wrong for an anonymous visitor.
- Decision: Build a small `SampleScenario` client component holding two
  `useState` values and nothing else, rendering the real `ChoiceStepView` and
  `PrincipleStepView` with real authored content. `ChoiceStepView` and
  `PrincipleStepView` gain a `headingLevel` prop so they can sit inside a
  marketing section without skipping a level. A server component picks the
  scene out of the lesson so the catalogue stays out of the browser bundle.
- Consequences: A visitor sees the actual product rather than a mock-up, and
  playing it writes nothing — asserted in both the unit test and the e2e spec.
  The demo calls `getLessonBySlug(slug, true)` with the draft flag passed
  explicitly, so it keeps working when `canViewDraftContent()` becomes a role
  check; the draft badge is shown alongside, as CLAUDE.md requires.

## 033. Real parent authentication with Supabase Auth; child profiles stay local

- Date: 2026-08-05
- Status: accepted
- Context: `prompts/22-authentication.md` asks to replace the local
  parent-account prototype with real parent authentication, and to recommend an
  already-approved solution. `ARCHITECTURE.md` and decision 003 name Supabase;
  `.env.example` already carried its placeholders. The prompt also says
  explicitly **not** to migrate child profiles to the database in this task.
- Decision: Use **Supabase Auth** (`@supabase/ssr`), parent email + password
  with an emailed reset. The app depends on an `AuthGateway` interface (the seam
  pattern of decision 030), with two implementations: the Supabase gateway, and
  a local signed-cookie **development stand-in** selected only when Supabase is
  unconfigured. `/parent` and `/learn` are gated by middleware and re-checked in
  each server layout. No child login and no social login (decision 001). Child
  profiles are untouched — still local prototype storage (`PROFILES.md`). Full
  write-up in `docs/AUTH.md`.
- Consequences: The parent account is now real, but the only new stored personal
  datum is a parent email held by Supabase; no child data moves server-side. The
  service-role key is deliberately unused (least privilege). Env validation now
  requires the Supabase pair in preview/production and forbids the stand-in
  there (`assertLocalAuthAllowed`), so a fresh clone, CI, and the e2e suite still
  run offline against the stand-in exactly as the waitlist runs against its log
  sink. Errors are generic to prevent account enumeration; an in-process
  rate-limiter backs up Supabase's own and is not itself a security boundary.
  The Supabase-path code is integration-level and covered by types, the build,
  and the gateway interface rather than offline unit tests.

## 034. Family data moves to PostgreSQL behind a store seam; local storage becomes the offline stand-in

- Date: 2026-08-05
- Status: accepted
- Context: `prompts/23-database.md` asks to migrate families, child profiles,
  lesson progress, and mission completions from local browser storage to
  PostgreSQL, with every protected query scoped to the authenticated parent and
  no `familyId` or `childProfileId` ever trusted from the client. Local storage
  was always scaffolding (decisions 019, 021, 026): per-device, shared by
  everyone on the device, and unfit for real progress. Parent authentication
  already exists (decision 033); child profiles were deliberately left local
  there.
- Decision: Add five tables — `families`, `family_memberships`,
  `child_profiles`, `lesson_progress`, `mission_completions` — with database
  constraints, indexes for the family/child access patterns, and RLS policies as
  a backstop. Introduce a server-side `FamilyStore` port with a real PostgreSQL
  adapter and an in-memory stand-in, chosen by configuration exactly as the auth
  gateway is (decision 033); `assertLocalPersistenceAllowed` keeps the stand-in
  out of preview and production, where env validation now requires the database.
  A `FamilyService` is the sole authorization boundary: it resolves the parent's
  family from their user id alone, re-checks any client-supplied child id against
  that family, and answers `not-found` for anything outside it. The browser
  reaches all of this over an async `FamilyClient` (HTTP to the new routes), so
  the hooks keep their shapes and the data shapes are unchanged — the migration
  is a move, not a redesign. The in-memory stand-in reuses the prototype stores'
  own validation, so their unit tests still earn their keep. No local data is
  migrated: a one-time reset (`resetLegacyLocalData`) clears the old keys once,
  per the prompt. Subscriptions are explicitly out of scope for this task.
- Consequences: Progress is now real, private, and portable across a parent's
  devices, and cross-family access is denied and proved by authorization tests
  against the service. The PostgreSQL adapter is integration-level like the
  Supabase auth path — covered by types, the build, and the shared `FamilyStore`
  interface its in-memory sibling is tested against, not by offline unit tests,
  since there is no database in CI. The stand-in loses data on restart, which is
  right for a development convenience and is why it is barred from deployed
  environments. Supersedes the storage aspects of decisions 019, 021, and 026.

## 035. Deleting a child profile is a hard cascade, not an archive

- Date: 2026-08-05
- Status: accepted
- Context: `prompts/23-database.md` requires that deleting a child profile
  cascade or archive "safely according to a documented decision". The two
  options are a soft archive (hide the profile, keep the rows for possible undo)
  or a hard delete that removes the profile and everything under it.
- Decision: Hard delete, cascaded at the database. `child_profiles` deletes
  cascade to `lesson_progress` and `mission_completions` via `ON DELETE CASCADE`,
  and a family's `selected_profile_id` clears via `ON DELETE SET NULL`. The
  in-memory stand-in and the family client do the same in application code so
  both backends behave identically.
- Consequences: A parent's "Delete profile" removes the child's data outright,
  which is what the control says and what `docs/PRIVACY_AND_SAFETY.md`'s deletion
  right and data-minimisation posture ask for. It also preserves the prototype's
  rule that a deleted child leaves no orphaned progress behind (decision 021's
  lineage). Archive was rejected: retaining a deleted child's learning records
  for possible undo conflicts with minimising children's data, and there is no
  product need for undo here. If a recycle-bin or account-level export is ever
  wanted, it needs its own deliberate decision, not a silent softening of this
  one.

## 036. Web subscriptions on Stripe, behind seams, and off until families have tested

- Date: 2026-08-06
- Status: accepted
- Context: `prompts/10-payments.md` asks for family subscriptions and
  entitlements via Stripe: a pricing/checkout flow, webhook handling with
  verification and idempotency, subscription-state persistence, billing
  management and cancellation, and tested state helpers — never storing card
  data and keeping secrets server-side. The payments prompt also carries an
  explicit instruction that this must not be used until families have tested the
  learning experience.
- Decision: Build the foundation as the same seam pattern as auth (decision 033)
  and family data (decision 034), so nothing new is invented for payments. A
  pure `subscriptions` domain holds the state machine (Stripe status → a small
  closed set), entitlement (`hasPaidAccess`), the plan catalogue, and HMAC-SHA256
  webhook-signature verification. A `BillingGateway` port has a real Stripe
  adapter (fetch) for the two outbound calls (Checkout, Billing Portal); a
  `SubscriptionStore` port has a PostgreSQL adapter and an in-memory stand-in,
  chosen by configuration and barred from deployed environments by the shared
  `assertLocalPersistenceAllowed`. A `BillingService` is the sole authorization
  boundary, resolving the family from the user id exactly as `FamilyService`
  does. Two tables are added — `family_subscriptions` (one per family) and
  `processed_webhook_events` (the idempotency ledger) — with the same
  check-constraint-and-RLS posture as the family tables. The webhook route
  verifies the signature on the raw body before parsing, and `applyStripeEvent`
  records each event id before acting (releasing it on failure) so redeliveries
  are no-ops and retries still work. Past-due deliberately keeps access during
  Stripe's dunning grace (no punitive mid-lesson lockout); cancel-at-period-end
  keeps access until the period actually ends. The Stripe integration is
  hand-rolled rather than adding the Stripe SDK, matching the codebase's
  avoid-dependencies posture and keeping the security-critical pieces (signature,
  state machine, dispatch) pure and unit-tested offline. Billing is optional in
  every environment — including production — and defaults off: when unconfigured,
  entitlement is the free plan for everyone, checkout/portal report unavailable,
  and the app behaves exactly as before. Local development gets a dev-only
  simulator that feeds synthesised Stripe events through the real dispatcher, so
  the states can be built and reviewed with no Stripe and no card.
- Consequences: A parent can subscribe, manage billing, and cancel; state
  transitions and entitlement are proven by offline tests; card data is never
  stored and secrets stay server-only. The Stripe adapter is integration-level
  like the PostgreSQL and Supabase paths — covered by types and the shared
  interface, not offline unit tests. Because the flow is not launched, the free
  introductory lessons are not yet gated behind entitlement and lifecycle
  analytics events are left for launch, so this foundation does not change how
  the app behaves for the families currently testing it. Turning it on is four
  environment variables. See docs/BILLING.md.

## 037. The "Ask a grown-up" gate guards every exit from the child area

- Date: 2026-08-07
- Status: accepted
- Context: Design step 7 (the parent experience) requires a parental gate:
  "any exit to the open web or a purchase sits behind a written, multi-step
  numeric answer a young child can't tap through," and "the child area contains
  no link to account, billing, or settings" (docs/design/ACCESSIBILITY.md,
  COMPONENT_STATES.md §4). Until now the child shell linked straight to `/parent`
  and its wordmark linked out to the marketing site — both one-tap exits a child
  could take by accident.
- Decision: Add a `ParentalGate` — a controlled modal reusing the hand-rolled
  `Dialog` (decision 014) — that asks a small addition sum with the numbers
  spelled out in words ("what is seven plus five?") and enables Continue only
  once the numeric answer is correct. The sum is generated fresh on every open
  from a pure, injectable-RNG helper (`src/features/parental-gate/puzzle.ts`), so
  it cannot be memorised and stays deterministic in tests. A `ParentAreaExit`
  button (never a link) replaces both child→parent exits — the shell header
  ("For parents") and the profile picker ("For grown-ups") — routing to the
  parent area only after the gate is solved (`purpose: "return"`). The membership
  page opens the same gate before a live Stripe checkout (`purpose: "purchase"`).
  The child-shell wordmark now points to the Clubhouse (`/learn`) instead of the
  marketing home, removing the last open-web exit. There is no success toast: the
  navigation that follows is the confirmation (consistent with decision 016).
- Consequences: The learning area has exactly one gated way out and no path to
  account, billing, settings, or the open web. Two deliberate exceptions stay
  ungated, because no child session exists to protect at those points: the
  no-profile "First, a grown-up sets up a profile" setup CTA (the screen exists
  to route a grown-up into first-run setup), and the dev-only billing simulator
  (not a real payment). The gate is a UX barrier, not authentication — the server
  remains the sole authority for entitlement and account actions. See
  docs/COMPONENTS.md and docs/design/ACCESSIBILITY.md.

## 038. Data export and account deletion complete the parent Account screen

- Date: 2026-08-07
- Status: accepted
- Context: `docs/PRIVACY_AND_SAFETY.md` requires that parents can delete a child
  profile, delete lesson progress, **delete their account**, and **request a
  data export**. The first two shipped with the dashboard; the last two were
  unbuilt, and `/parent/account` (COMPONENT_STATES.md §4/§10, §12) was a
  placeholder stub.
- Decision: Extend the one persistence seam (decision 033) rather than add a new
  one. `FamilyStore` gains `deleteFamily(familyId)`; the PostgreSQL adapter does
  it in a single `DELETE FROM families`, relying on the `ON DELETE CASCADE`
  foreign keys (migrations 0001/0002) that already carry memberships, profiles,
  progress, missions, and the subscription row away with it — the same cascade
  `deleteProfile` uses; the in-memory stand-in drops the family storage and the
  user→family mapping to match. `FamilyService` gains `deleteAccount(user)` and a
  read-only `exportAccount(user)` that composes existing reads into one
  serialisable object; both resolve the family from the user id alone, so a
  parent can only ever export or delete their own. Two routes: `DELETE
/api/family`, and `GET /api/family/export` which streams pretty JSON with a
  `Content-Disposition: attachment`. The Account screen becomes real — a plain
  privacy statement, a link to membership, a "Download my data" link (a bare
  `<a>`, not a Next `<Link>`, so the browser handles the file — `buttonClasses`
  is now exported for exactly this), and a danger zone whose delete is guarded by
  a confirm dialog that names what goes and offers signing out as the gentler
  alternative. On confirm the client deletes, then submits a POST sign-out form,
  because the data is gone and there is nothing left to stay signed in to.
- Consequences: The four deletion/export rights are all met. Deletion is honest
  about scope: it removes everything the app stores about the family (and, in
  production, the subscription row via cascade); it does not delete the parent's
  auth login (they can sign back in to a fresh, empty account) nor cancel a live
  Stripe subscription — billing is not live in the beta, and cancellation is the
  membership page's Stripe portal. Communication/analytics preference toggles
  (COMPONENT_STATES.md §10) are deferred until there is an email or analytics
  system for a toggle to honestly control. See docs/PRIVACY_AND_SAFETY.md and
  docs/COMPONENTS.md.

## 039. The parent sections share one per-child scaffold; step 7 is complete

- Date: 2026-08-07
- Status: accepted
- Context: The Missions and Skills nav destinations were still placeholder stubs.
  Both, like the dashboard, answer questions about one child at a time and need
  the same four states — loading the family, no child yet, choosing which child,
  loading that child's figures — and all the data they show is already derived by
  the pure `buildChildDashboard`.
- Decision: Factor the shared shell into `ParentChildSection`, a client scaffold
  that owns those four states and hands each section one loaded `dashboard` for
  the child in view via a render prop; the `ChildSelector` the dashboard used
  inline is extracted so all three surfaces share it. `MissionsSection` (§6/§9)
  reuses `CurrentMission` with its mark-practised toggle and `TalkingPoints`;
  `SkillsSection` (§7/§8) reuses `SkillAreaSummary` and a new `ReadyToReview`
  panel. The reused panels gained a `headingLevel` prop (default 4, unchanged for
  the dashboard) so they sit under each page's `<h1>` without skipping a level.
  Selection stays local to each section, never the `/learn` selection, so
  glancing at Missions cannot change who the tablet thinks is learning.
- Consequences: The parent experience (step 7) is complete to the design's §4 —
  onboarding, account welcome, create/child selector, progress dashboard,
  current mission, skills, ready to review, conversation prompt, privacy &
  account, delete child, delete account, subscription, and the safe-return gate —
  with the one documented exception of the email/analytics preference toggles
  (decision 038). No new data or persistence was added; the sections are layout
  over logic that already existed and was already tested. See docs/COMPONENTS.md.

## 040. The content pass: worlds 2–12 authored and connected (handoff step 8)

- Date: 2026-08-07
- Status: accepted
- Context: The design handoff's step 8 is the content pass — the remaining Hello
  Garden lessons (already authored) and then the other eleven worlds to lesson
  depth, then wiring them so a child can actually play them. This expands past
  the single-module MVP (`docs/MVP_SCOPE.md` excludes "multiple curriculum
  modules"), so it was done only on explicit instruction, not silently. Content
  was grounded in a deep-research pass on age-5–9 social-emotional guidance
  (turn-taking, inclusion, cooperation, repair-over-forced-apology, gratitude,
  guest/host, public spaces, dining, digital citizenship, NSPCC-PANTS body
  safety, anti-bias culture); the notes echo the existing curriculum principles.
- Decision: Author eight lessons for each of worlds 2–12 (88 lessons, seven
  teaching + a review each), one file per world under `src/content/lessons/
worlds/`, using the canon cast and rotation rule (`CHARACTER_BIBLE.md`). Give
  each world one thematic `skillArea` (extending the closed union from six to
  seventeen; all lessons of a world share its area), and decouple the public
  marketing skill list from the union so the narrow MVP marketing surface does
  not grow with draft worlds. Each new module's `id` is its world slug, which is
  also its `tokens.css` theme key, so a lesson themes itself by carrying its
  `moduleId`. Add a module registry (`getModuleById`) and world↔module helpers
  (`getWorldByModuleId`, `modulePathHref`). Generalise the reachability the MVP
  built for one module: a shared `useProgress` loader, `useModulePath(module)`,
  `LearningPath({ module })`, a `/learn/module/[moduleId]` route, and a
  module-aware `LessonRunner`/`CompletionStepView` (lock check and back-links
  follow the lesson's own world). The map and the parent dashboard now span the
  whole neighborhood: `buildChildDashboard` takes every module and aggregates
  progress, skills, recent activity, the active mission, and talking points
  across worlds, while showing per-world progress.
- Consequences: All twelve worlds are playable, and the neighborhood opens "a
  little at a time" — the current world plus the one up next are reachable on the
  map, the rest read "a little later" (never locked), exactly the existing
  journey rule now that content exists behind every node. Everything stays
  `status: "draft"`; nothing claims review. Brave Basecamp (safety, consent &
  boundaries) and World Garden (culture) carry explicit safety/cultural notes
  requiring qualified specialist review before publication — the safety module is
  written PANTS-aligned, calm, non-graphic, and blame-free, and the culture
  module teaches the child's respectful stance rather than cataloguing or
  performing any culture. The `skillArea` union is now large; a future CMS or a
  reshuffle of the taxonomy is the natural next revisit (see decision 028).

## 041. `LegacyLocalDataReset` moves out of the root layout; two e2e specs updated to match shipped behaviour

- Date: 2026-08-07
- Status: accepted
- Context: `scripts/day.sh ship` does not run Playwright by default (`RUN_E2E=1`
  is opt-in), so end-to-end failures only surface in GitHub Actions, after a
  merge to `main`. CI on `main` had been red since 2026-08-05, across every
  ship since, on four specs, unnoticed until this audit. Investigating found
  two distinct causes. First, `LegacyLocalDataReset` (decision 034) lived in
  the root layout, which also wraps the public marketing pages — so it wrote
  its `kindlyo.local-data-reset.v1` marker key to local storage on an
  anonymous visitor's very first page load, breaking the sample scenario's
  "saves nothing" guarantee (decision 032) for anyone who had not opted into
  an account. Second, two `e2e/progress.spec.ts` cases had fallen out of date
  with real product changes: "creates two child profiles" assumed the shared
  `e2e-parent@example.com` fixture account was always freshly un-onboarded,
  which broke once other spec files (using the same account against the
  in-memory store) started completing onboarding first; "resumes an
  unfinished lesson" predated the `ResumeCard` "Welcome back" confirmation
  screen (the 2026-08-06 system-states work, `docs/design/COMPONENT_STATES.md`
  §14) and never accounted for it.
- Decision: Move `<LegacyLocalDataReset />` from `src/app/layout.tsx` into the
  two layouts gated behind a signed-in parent session — `src/app/parent/layout.tsx`
  and `src/app/learn/layout.tsx` — since a signed-out marketing visitor can
  never have legacy local data to clear. Give the "creates two child profiles"
  test its own throwaway account via `signInAsNewParent`, matching the
  isolation pattern already used in `profiles.spec.ts` and `account.spec.ts`.
  Update "resumes an unfinished lesson" to click through the `ResumeCard`'s
  "Keep going" button, matching the shipped resume flow.
- Consequences: All 90 Playwright specs pass locally under the same
  single-worker, two-retry configuration CI uses, alongside lint, format,
  typecheck, the unit suite, and the production build. `LegacyLocalDataReset`
  now runs once per browser on first entry to either gated area rather than on
  every anonymous page view, which is strictly narrower than before and closer
  to the original intent. No product behaviour changed for a signed-in parent.
  This does not change that `ship` still does not run e2e by default; a
  standing gap worth a deliberate follow-up so a future regression like this
  one surfaces before merge, not after.

## 042. `ship` runs the end-to-end suite by default (closing decision 041's gap)

- Date: 2026-08-07
- Status: accepted
- Context: Decision 041 fixed four Playwright specs that had been red on `main`
  since 2026-08-05 and named the root cause of their going unnoticed: `scripts/
day.sh ship` only ran the end-to-end suite when `RUN_E2E=1` was explicitly
  set, so every ship in between passed its gate while `main`'s CI was failing.
  That left the merge gate weaker than both `docs/TESTING_STRATEGY.md`, which
  lists `test:e2e` among the required checks, and the `qa-gate` agent, which
  runs it. Decision 041 flagged closing this as a deliberate follow-up.
- Decision: Invert the default. `ship` now runs `npm run test:e2e` as part of
  its verification suite unless `SKIP_E2E=1` is set, mirroring the existing
  `SKIP_CHECKS=1` opt-out and its "for emergencies" framing. The narrow escape
  hatch exists only for an environment where the Playwright browsers cannot be
  installed; it skips the single end-to-end step while keeping lint,
  format:check, typecheck, the unit suite, and the build. `RUN_E2E` is gone.
  The required-checks list in `docs/TESTING_STRATEGY.md` also regained
  `format:check`, which `ship` and CI have always run but the doc had omitted.
- Ancillary decision: `playwright.config.ts` now pins `workers: 1` everywhere,
  not just under CI. The specs share one dev server backed by a single
  in-memory store, so two workers racing on the same fixture account and
  progress state produce spurious failures (observed: seven dashboard/progress
  specs fail under multi-worker, all pass single-worker). CI already ran one
  worker; local runs used all cores. Since `ship` runs e2e outside CI, leaving
  the local default multi-worker would have made `ship` itself flaky — the
  opposite of the reliability this change is for. One worker is the correct
  default for a shared-store suite regardless of where it runs.
- Consequences: A regression like the 2026-08-05 one now stops the ship that
  introduced it, before it reaches `main`, rather than surfacing only in CI
  after merge. The merge gate, the required-checks doc, the `qa-gate` agent,
  and CI now describe the same required set. Ship is slower by the cost of the
  Playwright run, which is the intended trade; an environment without browsers
  uses `SKIP_E2E=1` and relies on CI to run e2e on the pushed branch.

## 043. Installable web app: a manifest and install metadata, no service worker

- Date: 2026-08-07
- Status: accepted
- Context: "Installable PWA where practical" is a listed MVP Platform item
  (`docs/MVP_SCOPE.md`) that was entirely unimplemented — no web app manifest,
  no `theme-color`, no `appleWebApp` metadata, no app icons. The honest reading
  of "where practical" for a privacy-first children's product is: make the app
  installable, and stop short of anything that persists family data on the
  device or invents an engagement surface.
- Decision: Add a Next `src/app/manifest.ts` Metadata Route serving
  `/manifest.webmanifest` (`name`/`short_name`/`description` from the vetted
  `@/lib/seo` copy, `display: standalone`, `start_url`/`scope`/`id` all `/`,
  `theme_color` brand `#be5136`, `background_color` canvas `#faf3e7`, `lang`
  `en-GB`, `categories: ["education"]`), two SVG icons under `public/icons`
  (an opaque `any` icon and a padded full-bleed `maskable` icon), and root
  layout install metadata (`appleWebApp` with `statusBarStyle: "default"`,
  viewport `themeColor`, an apple-touch icon, an explicit `manifest` link).
- Ancillary decision: icons are committed SVG rather than generated raster.
  It keeps the whole slice verifiable by the required checks (no runtime image
  render that lint/typecheck/test/build cannot exercise) and matches the repo's
  "draw SVG, don't commit binaries" convention (`src/app/opengraph-image.tsx`).
- Deliberately out of scope, with reasons: (1) No service worker / offline
  cache — it would persist child progress, nickname, and authenticated
  responses in on-device storage that survives the parent's deletion controls
  (`docs/PRIVACY_AND_SAFETY.md`) and could leak across accounts on a shared
  family tablet; offline is its own reviewed slice, and installability does not
  require it. (2) No `share_target`, `shortcuts`, `protocol_handlers`,
  `screenshots`, or native `related_applications` — each is scope beyond the
  MVP and a data or claim surface we do not want; `manifest.test.ts` locks
  their absence. (3) `orientation` is not set, so no mounted or assistive setup
  is forced into portrait.
- Colours in the manifest and viewport are literal hex copied from
  `src/styles/tokens.css`; a manifest cannot read CSS custom properties, so
  they carry a keep-in-sync comment, the same caveat as `opengraph-image.tsx`.
- Known limitation: SVG manifest icons install cleanly on modern Chromium and
  add-to-home-screen on iOS, but some browsers' automatic install prompt and
  iOS's home-screen rendering prefer raster PNG. Generating brand PNG icons
  (192/512/maskable/apple-touch) with visual QA is a sensible fast-follow.
- Standing concern for the roadmap (not fixed here): an installed one-tap icon
  makes it easier for a child to relaunch a parent's still-valid session and
  reach `/learn` without a grown-up initiating. `start_url: "/"` keeps the
  launch on the parent-facing home rather than a lesson, but the persistent
  session means "installed" must not be read as "supervised" — `docs/PROFILES.md`
  already says a lock a child cannot pass is no substitute for a parent nearby.
  A parent gate or session re-check on the installed app is worth a deliberate
  decision later.
- Consequences: A parent can install Kindlyo to a home screen with a branded
  icon and a standalone window, no new dependency and no third-party request
  (icons are first-party SVG). No child-facing surface changed. Unit tests
  assert the manifest shape, the colour and copy constraints, the excluded
  fields, and that each icon file exists.
