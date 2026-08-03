# Analytics

## Purpose

Analytics should answer product questions, not collect data merely because it is
available.

## Initial questions

- Do parents finish onboarding?
- Do children begin the first lesson?
- Do they finish it?
- Do they return?
- Which lessons cause abandonment?
- Do parents view offline missions?
- Do families report mission completion?
- Does parent dashboard usage correlate with child retention?

## Event naming

Use lowercase dot notation.

Examples:

- `account.created`
- `onboarding.completed`
- `child_profile.created`
- `lesson.started`
- `lesson.choice_selected`
- `lesson.completed`
- `mission.viewed`
- `mission.completed`
- `dashboard.viewed`
- `subscription.checkout_started`
- `subscription.activated`
- `subscription.cancelled`

## Event rules

Each event must document:

- Purpose
- Trigger
- Properties
- Data sensitivity
- Retention period

Do not include:

- Full child names
- Free-form child speech
- Raw authentication tokens
- Payment card data
- Precise location
