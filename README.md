# Kindlyo

Kindlyo is a parent-guided learning platform that helps children ages 5–9
practice kindness, communication, manners, and social confidence through short
interactive stories and real-world missions.

The parent or guardian owns the account. Children learn within a
parent-controlled session and never create independent accounts.

> **Status:** early-stage. This repository currently contains the product
> documentation and repository scaffolding. The application foundation is set up
> via [`prompts/01-project-foundation.md`](prompts/01-project-foundation.md).

## Repository structure

```text
kindlyo/
├── .github/            Issue and pull request templates
├── docs/               Product, curriculum, design, privacy, and technical docs
├── prompts/            Ordered build-phase prompts (00–12)
├── public/             Static assets (populated during foundation setup)
├── src/                Application source (populated during foundation setup)
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

| Document | Purpose |
| --- | --- |
| [PRODUCT_BRIEF.md](docs/PRODUCT_BRIEF.md) | What Kindlyo is and the problem it solves |
| [MVP_SCOPE.md](docs/MVP_SCOPE.md) | What is in and out of the MVP |
| [USER_JOURNEYS.md](docs/USER_JOURNEYS.md) | Primary paths through the product |
| [CURRICULUM_PRINCIPLES.md](docs/CURRICULUM_PRINCIPLES.md) | How lessons teach |
| [CONTENT_SCHEMA.md](docs/CONTENT_SCHEMA.md) | Structured lesson content model |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Brand, tokens, components, accessibility |
| [PRIVACY_AND_SAFETY.md](docs/PRIVACY_AND_SAFETY.md) | Data posture and safety rules |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, structure, and boundaries |
| [ANALYTICS.md](docs/ANALYTICS.md) | What we measure and why |
| [TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md) | Unit, component, e2e, and auth tests |
| [ROADMAP.md](docs/ROADMAP.md) | Phased plan from discovery to validation |
| [DECISIONS.md](docs/DECISIONS.md) | Decision log |

## Build-phase prompts

The [`prompts/`](prompts) directory holds ordered prompts that build the MVP one
coherent slice at a time, from `00-repository-audit.md` through
`12-launch-readiness.md`. Each references the relevant docs and ends with a
verification checklist.

## Getting started

The application toolchain is not configured yet — that happens in
[`prompts/01-project-foundation.md`](prompts/01-project-foundation.md). Once it
is set up, the standard checks are:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Copy [`.env.example`](.env.example) to `.env.local` and fill in values before
running the app. Keep server-only secrets out of client code.

## Contributing

- File bugs and ideas using the templates in
  [`.github/ISSUE_TEMPLATE`](.github/ISSUE_TEMPLATE).
- Open pull requests against the
  [pull request template](.github/pull_request_template.md).
- Stay within the approved MVP scope. Features on the restriction list in
  `CLAUDE.md` require explicit approval.

## Content and safety

All curriculum content is **draft** until reviewed by qualified humans. Kindlyo
does not imply professional, educational, or clinical validation that has not
occurred. Safety, consent, and trusted-adult guidance always take priority over
politeness. See [`docs/PRIVACY_AND_SAFETY.md`](docs/PRIVACY_AND_SAFETY.md).

Repository documentation and code do not constitute legal advice. Obtain
qualified review (COPPA, applicable privacy laws, app-store family policies,
subscription rules) before a public child-directed launch.
