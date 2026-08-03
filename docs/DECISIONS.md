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
