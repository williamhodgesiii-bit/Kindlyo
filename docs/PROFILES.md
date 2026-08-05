# Profiles

How a family is set up, and what is stored about a child. The lesson machinery
lives in `LESSON_ENGINE.md`; this file covers who the lessons belong to.

**The parent account and the child profiles are now real.** A parent signs in
with an authenticated account (see `docs/AUTH.md`), and both `/parent` and
`/learn` are reachable only from that session. Child profiles and their progress
now live in the database, scoped to the parent's family and reachable only from
their session — the persistence slice replaced the local prototype store
wholesale (see `docs/DATABASE.md`). Local development without a database, CI, and
the e2e suite run against an in-memory stand-in with the same behaviour, so a
fresh clone still works offline.

## What a profile is

```ts
type ChildProfile = {
  id: string; // random, meaningless outside this browser
  nickname: string; // trimmed, 24 characters
  ageBand: "5–6" | "7–9";
  avatarId?: "fox" | "star" | "leaf" | "moon" | "boat" | "bird";
  createdAt: string;
};
```

That is the whole of it, and the type is the enforcement. There is no field for
a surname, a birthday, an email address, or a password, so those cannot be
collected by a form that forgets the rule. `avatarId` is a closed union rather
than a URL or a blob, so a photograph of a child cannot be represented at all —
see `src/components/ui/avatarArt.tsx`, which is inline SVG with no `img` element
anywhere in it.

Children never get credentials. The parent is the account holder, and the child
surface is reached from the parent's own session (decision 001).

## The shape of the code

```text
src/features/profiles/
├── types.ts            the profile, the age bands, the avatar ids
├── profileStorage.ts   validation + rules; now backs the in-memory stand-in
└── useFamily.ts        client access over the family client, hydrated on load

src/server/families/    the store, the authorization service, the routes
src/features/families/  the browser's async family client (see docs/DATABASE.md)

src/components/parent/
├── ParentArea.tsx              onboarding on a first visit, dashboard after
├── ParentOnboarding.tsx        welcome → what we collect → first child
├── ParentDashboard.tsx         profiles, progress, missions, edit/reset/delete
├── ProfileForm.tsx             the one form, for creating and editing
└── AccountStorageNotice.tsx    where the data lives, said plainly

src/components/path/LearningPath.tsx   the child-facing "who is learning?"
```

Every rule that matters — the three-profile cap, nickname trimming, valid age
bands and avatars — is enforced in `profileStorage.ts` (the validation the
in-memory store reuses) and, for the real database, in `child_profiles`
constraints and the `FamilyService`, rather than in a form, so neither
hand-edited storage nor hand-written SQL can widen them.

## The flows

| Flow           | Where                               | Confirmation          |
| -------------- | ----------------------------------- | --------------------- |
| Onboarding     | `/parent`, first visit only         | —                     |
| Create         | onboarding step 3, or "Add a child" | —                     |
| Edit           | "Edit" on a profile card            | — (Cancel discards)   |
| Select         | `/learn`                            | —                     |
| Reset progress | profile card                        | Dialog, danger button |
| Delete profile | profile card                        | Dialog, danger button |

Editing keeps the profile's id, so a rename never costs a child their progress.
Deleting a profile deletes its progress with it — an orphaned progress node
would be exactly the stale data the store promises never to resurrect.

Onboarding is shown once and can be skipped from the first screen. A parent who
later deletes their last profile does **not** see it again: they have not
un-onboarded, and being handed the welcome tour a second time reads as having
lost the account.

## Two surfaces, two voices

The same data, addressed to two different people.

**Parent screens are editorial.** Long measure, full sentences, quiet controls,
and the privacy position stated on the way in rather than linked from a footer.
An adult is deciding whether to trust us with something about their child; the
answer to that is prose, not a badge.

**Child screens are large and nearly wordless.** The profile picker is one
short question, an oversized avatar and name per child, and nothing else — no
age bands, no instructions, no secondary actions competing for a five-year-old's
attention. Its targets are far above the 44×44 minimum, and an end-to-end test
measures them, because jsdom cannot.

The way back to the parent area is always available and always a plain link —
from the child shell's header, and from the picker itself. It is not hidden
behind a gesture or a maths question: the child surface is not a walled garden,
and a lock a child cannot pass is not a substitute for a parent being nearby.

## Tests

- `profileStorage.test.ts` — create, update, select, delete, the cap, avatar
  handling, onboarding state, and the tampered-storage cases.
- `ParentOnboarding.test.tsx` — who sees onboarding, the steps, the privacy
  copy, skipping, and that it never reappears.
- `ParentDashboard.test.tsx` — create, edit, cancel, delete, reset, the limit,
  and that no field exists for a surname, birthday, or email.
- `LearningPath.test.tsx` — the picker, selection, per-child separation, and
  the route back to the grown-ups.
- `e2e/profiles.spec.ts` — the whole flow in a production build, including the
  child picker's real touch-target sizes.
