# Database

Where a family's data lives, and how it is kept private. The parent account
itself is `docs/AUTH.md`; this file covers the child profiles, lesson progress,
and mission completions that used to live in one browser and now belong to the
account (decision 034).

## The shape of the code

```text
supabase/
├── migrations/0001_family_persistence.sql   tables, constraints, indexes, RLS
└── seed.sql                                  a demo family for development

src/server/families/
├── store.ts          the FamilyStore port — family-scoped primitives
├── memoryStore.ts    offline stand-in (reuses the prototype stores' validation)
├── postgresStore.ts  the real adapter, on Supabase
├── index.ts          getFamilyStore() — chooses by configuration
├── service.ts        FamilyService — the authorization boundary
├── requests.ts       request-body validation for the routes
└── http.ts           shared auth + JSON helpers for the routes

src/features/families/
├── familyClient.ts        the browser's async door (HTTP + in-process stand-in)
├── memoryStorage.ts       a Map-backed Storage, off the browser
└── resetLegacyLocalData.ts  the one-time clear of old local data

src/app/api/family/**       family + profile routes
src/app/api/progress/**     lesson-progress + mission routes
```

## Tables

| Table                 | Holds                                                   |
| --------------------- | ------------------------------------------------------- |
| `families`            | the family; onboarding state; the active child          |
| `family_memberships`  | which user belongs to which family (one family per MVP) |
| `child_profiles`      | nickname, age band, optional avatar                     |
| `lesson_progress`     | one row per (child, lesson): the run and the completion |
| `mission_completions` | one row per (child, lesson): the parent-marked mission  |

Constraints mirror the app's own unions so hand-written SQL cannot widen them:
`age_band` and `avatar_id` are checked against the same closed sets, `nickname`
is length-bounded, and `(child_profile_id, lesson_id)` is unique in both
progress tables. Every child-owned table is indexed by its parent id
(`family_id` or `child_profile_id`), which is how every read reaches its rows.

The at-most-three-profiles rule is a count in the service rather than a
constraint — a `CHECK` cannot count sibling rows without a trigger, and a
trigger is more machinery than the rule earns.

## Relationships

```text
auth.users (Supabase)
     │  user_id
     ▼
family_memberships ── many ──┐
                              ▼
                          families ──1─▶ selected_profile_id ─▶ child_profiles
                              │ 1
                              ▼ many
                        child_profiles
                        │ 1            │ 1
                        ▼ many         ▼ many
                 lesson_progress  mission_completions
```

One parent → one membership → one family → up to three children → each child
has per-lesson progress and per-lesson mission marks.

## Authorization

The rule (`docs/ARCHITECTURE.md`): every protected query verifies family
membership, and a family or child id from the browser is never trusted.

- `FamilyService` is the only thing the routes call. It resolves the parent's
  family from their **user id alone** (creating it on first use) and never
  accepts a `familyId`.
- Any `childProfileId` that came from the browser is a path segment the service
  re-checks against that family before use. A profile in another family is
  indistinguishable from one that does not exist — the answer is `not-found`,
  which leaks nothing.
- Application-level scoping is the primary control, and the one the tests cover
  (`src/server/families/service.test.ts` proves parent A gets nowhere with
  parent B's real profile id). **RLS policies** on every table are the backstop
  for any other access path, tying each row to `auth.uid()` through
  `family_memberships`.

The PostgreSQL adapter uses the service-role key (which bypasses RLS), so the
service's scoping — not RLS — is what protects the hot path. That is deliberate:
it is the control the offline tests can exercise, exactly as decision 033 made
the auth gateway the tested seam.

## Deletion (decision 035)

Deleting a child profile is a **hard cascade**. `ON DELETE CASCADE` from
`child_profiles` removes the child's `lesson_progress` and `mission_completions`
atomically, and `ON DELETE SET NULL` clears any family selection pointing at
them. This matches the parent's "Delete profile" control, the deletion right in
`docs/PRIVACY_AND_SAFETY.md`, and the data-minimisation posture for children's
data. Archiving was considered and rejected — see the decision.

## The offline stand-in

There is no database in a fresh clone, in CI, or in the e2e suite, so — exactly
like the auth stand-in — the app falls back to an **in-memory family store**
when the database is not configured. It reuses the prototype stores'
(`profileStorage`, `progressStorage`) validated read/write functions over a
Map-backed `Storage`, so the three-profile cap, nickname trimming, per-child
scoping, and tampered-data handling are the same code paths the browser used.
It loses everything on restart, which is why `assertLocalPersistenceAllowed`
forbids it in preview and production, where env validation requires the database
(`SUPABASE_SERVICE_ROLE_KEY` plus the project URL).

Unit tests point the browser's `FamilyClient` at this same in-memory backing, so
the component specs still seed and assert through storage — only the async
client in between is mocked.

## Local setup

```bash
# With the Supabase CLI and a local stack:
supabase db reset      # applies migrations, then runs seed.sql

# Or against a hosted project:
supabase db push       # applies migrations only
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
to use the real database locally; leave them unset to run against the in-memory
stand-in. The seed's demo parent has no real credentials — point its `user_id`
at your own Supabase Auth user to see the demo family when you sign in.

## Migrating from the prototype

Nothing is migrated. Local prototype data was per-device scaffolding, so instead
of a fragile import the app performs a **one-time reset**
(`resetLegacyLocalData`, run once from the root layout) that clears the old
`kindlyo.prototype.profiles.v1` and `kindlyo.demo.lesson-progress.v2` keys and
marks itself done. A returning parent starts their real account clean rather
than carrying a stale device-only copy alongside it.

## Tests

- `src/server/families/service.test.ts` — the authorization tests: cross-family
  reads, updates, deletes, selection, progress, and missions are all denied;
  lazy family creation, the profile cap, first-completion-wins, and the delete
  cascade hold for a parent's own family.
- `src/app/api/family/family-api.test.ts` — the routes require a session, scope
  to the caller, deny a foreign profile id, and validate input.
- `src/features/families/resetLegacyLocalData.test.ts` — the one-time reset
  clears the old keys once and leaves later data alone.
- The PostgreSQL adapter is integration-level (decision 034) and covered by the
  types, the build, and the shared `FamilyStore` interface rather than offline
  unit tests.
