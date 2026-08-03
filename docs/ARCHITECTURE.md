# Architecture

## Initial architecture goal

Use a simple modular monolith.

Do not create microservices.

## Suggested stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- PostgreSQL
- Supabase for database and authentication, or an equivalent managed service
- Stripe for web subscriptions
- Vitest
- React Testing Library
- Playwright
- Vercel or equivalent hosting

## Application areas

```text
/
├── marketing
├── login
├── onboarding
├── parent
│   ├── dashboard
│   ├── children
│   └── settings
└── learn
    ├── profile-selection
    ├── path
    └── lesson/[lessonSlug]
```

## Domain modules

* Accounts
* Families
* Child profiles
* Curriculum
* Lesson delivery
* Progress
* Offline missions
* Subscriptions
* Analytics

## Boundaries

Business logic should not live directly inside page components.

Prefer:

```text
src/
├── app/
├── components/
├── features/
│   ├── accounts/
│   ├── families/
│   ├── curriculum/
│   ├── lessons/
│   ├── progress/
│   └── subscriptions/
├── lib/
├── server/
├── styles/
└── content/
```

## Data entities

* User
* Family
* FamilyMembership
* ChildProfile
* Module
* Lesson
* LessonVersion
* LessonProgress
* MissionCompletion
* Subscription
* AnalyticsEvent

## Authorization principles

* Every child profile belongs to a family.
* Every protected query must verify family membership.
* Never trust a family or child identifier supplied by the browser.
* Database access should be scoped to the authenticated parent.
* Administrative curriculum publishing requires a separate permission.

## Initial deployment environments

* Local
* Preview
* Production

Each environment must use separate secrets and database resources.
