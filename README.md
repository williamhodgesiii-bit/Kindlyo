# Little Learner's Club

Little Learner's Club is a parent-guided learning platform that helps children
ages 5–9 practice kindness, communication, manners, and social confidence
through short interactive stories and real-world missions.

The parent or guardian owns the account. Children learn within a
parent-controlled session and never create independent accounts.

> **Status:** early-stage. The technical foundation, application shell, lesson
> engine, family setup, local progress system, and **real parent
> authentication** are in place — a parent signs in, onboards, creates child
> profiles, and hands over all eight "Meeting People" lessons, with per-child
> progress and lesson unlocking. Authentication is Supabase Auth
> ([`docs/AUTH.md`](docs/AUTH.md)); there is no database, payment, or analytics
> integration yet, and **child profiles and progress are still a local prototype
> kept in the browser only**. All curriculum is draft content awaiting review by
> qualified humans.

## Repository structure

```text
kindlyo/
├── .github/            Issue/PR templates and CI workflow
├── docs/               Product, curriculum, design, privacy, and technical docs
├── e2e/                Playwright end-to-end specs
├── prompts/            Ordered build-phase prompts (00–12)
├── public/             Static assets
├── src/
│   ├── app/            App Router routes, error and not-found pages
│   ├── components/     Shared UI
│   │   ├── ui/         Design system primitives
│   │   ├── lesson/     The lesson renderer and its step views
│   │   ├── path/       The learning path
│   │   ├── parent/     The parent dashboard
│   │   └── shells/     Page chrome for the child and parent surfaces
│   ├── content/        Authored curriculum (draft until humans review it)
│   ├── features/       Domain modules (business logic lives here, not in pages)
│   ├── lib/            Cross-cutting helpers, including environment validation
│   └── styles/         Design tokens and global styles
├── CLAUDE.md           Guardrails and working process for contributors and agents
├── README.md
├── .env.example        Example environment variables
└── package.json
```

## Start here

- [`CLAUDE.md`](CLAUDE.md) — product guardrails, restrictions, and the working
  process every substantial change follows.
- [`docs/`](docs) — the source of truth for what we are building and why.

## Documentation

| Document                                                  | Purpose                                                 |
| --------------------------------------------------------- | ------------------------------------------------------- |
| [PRODUCT_BRIEF.md](docs/PRODUCT_BRIEF.md)                 | What Little Learner's Club is and the problem it solves |
| [MVP_SCOPE.md](docs/MVP_SCOPE.md)                         | What is in and out of the MVP                           |
| [USER_JOURNEYS.md](docs/USER_JOURNEYS.md)                 | Primary paths through the product                       |
| [CURRICULUM_PRINCIPLES.md](docs/CURRICULUM_PRINCIPLES.md) | How lessons teach                                       |
| [CONTENT_SCHEMA.md](docs/CONTENT_SCHEMA.md)               | Structured lesson content model                         |
| [LESSON_ENGINE.md](docs/LESSON_ENGINE.md)                 | How lessons are validated and played                    |
| [PROFILES.md](docs/PROFILES.md)                           | Family setup, child profiles, and privacy               |
| [AUTH.md](docs/AUTH.md)                                   | Parent authentication and its security                  |
| [PARENT_DASHBOARD.md](docs/PARENT_DASHBOARD.md)           | What parents see, and what it never says                |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)                 | Brand, tokens, components, accessibility                |
| [PRIVACY_AND_SAFETY.md](docs/PRIVACY_AND_SAFETY.md)       | Data posture and safety rules                           |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)                   | Stack, structure, and boundaries                        |
| [ANALYTICS.md](docs/ANALYTICS.md)                         | What we measure and why                                 |
| [TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md)           | Unit, component, e2e, and auth tests                    |
| [ROADMAP.md](docs/ROADMAP.md)                             | Phased plan from discovery to validation                |
| [DECISIONS.md](docs/DECISIONS.md)                         | Decision log                                            |

## Build-phase prompts

The [`prompts/`](prompts) directory holds ordered prompts that build the MVP one
coherent slice at a time, from `00-repository-audit.md` through
`12-launch-readiness.md`. Each references the relevant docs and ends with a
verification checklist.

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Copy [`.env.example`](.env.example) to `.env.local` if you need to override
defaults. Nothing is required to run locally — `APP_ENV` defaults to `local` and
`NEXT_PUBLIC_APP_URL` to `http://localhost:3000`. Malformed values fail fast with
a named error. Keep server-only secrets out of client code; only `NEXT_PUBLIC_*`
values reach the browser.

Authentication also needs no setup locally: with Supabase unconfigured, the app
uses a non-secure, local-only development stand-in, so you can sign up and in
with any email and any 8+ character password. To use real Supabase auth locally,
or to deploy, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
— they are required in preview and production. See
[`docs/AUTH.md`](docs/AUTH.md).

### Checks

```bash
npm run lint          # ESLint, including jsx-a11y accessibility rules
npm run typecheck     # tsc --noEmit, strict mode
npm run test          # Vitest unit and component tests
npm run test:e2e      # Playwright end-to-end tests
npm run build         # Production build
npm run format        # Prettier
```

All of these run in CI on every push and pull request.

`npm run test:e2e` downloads its own browser on first use. In environments that
ship a pre-installed browser and forbid downloads, point at it instead:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium npm run test:e2e
```

### Routes

| Route              | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `/`                | Public marketing page                                |
| `/login` `/signup` | Parent sign-in and account creation                  |
| `/learn`           | Child learning area (requires a parent session)      |
| `/parent`          | Parent area (requires a parent session)              |
| `/api/health`      | Health check for uptime monitoring                   |
| `/dev/gallery`     | Component gallery (development only; 404s elsewhere) |

## Daily workflow

Work happens on dated `claude/YYYY-MM-DD` branches and ships to `main` at the
end of the day:

```bash
scripts/day.sh start              # branch from main
scripts/day.sh save "What I did"  # commit and push
scripts/day.sh ship               # verify, write CHANGELOG.md, merge to main
scripts/day.sh cleanup            # preview removal of merged, stale branches
```

`ship` refuses to release while any check is failing. See
[`docs/DAILY_WORKFLOW.md`](docs/DAILY_WORKFLOW.md) for the details and
[`CHANGELOG.md`](CHANGELOG.md) for what has shipped.

## Contributing

- File bugs and ideas using the templates in
  [`.github/ISSUE_TEMPLATE`](.github/ISSUE_TEMPLATE).
- Open pull requests against the
  [pull request template](.github/pull_request_template.md).
- Stay within the approved MVP scope. Features on the restriction list in
  `CLAUDE.md` require explicit approval.

## Content and safety

All curriculum content is **draft** until reviewed by qualified humans. Little
Learner's Club does not imply professional, educational, or clinical validation
that has not
occurred. Safety, consent, and trusted-adult guidance always take priority over
politeness. See [`docs/PRIVACY_AND_SAFETY.md`](docs/PRIVACY_AND_SAFETY.md).

Repository documentation and code do not constitute legal advice. Obtain
qualified review (COPPA, applicable privacy laws, app-store family policies,
subscription rules) before a public child-directed launch.
