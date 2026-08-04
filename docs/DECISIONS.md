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
- Status: accepted
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
