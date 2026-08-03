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
