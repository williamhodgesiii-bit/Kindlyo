# Design System

## Brand personality

- Warm
- Reassuring
- Curious
- Respectful
- Optimistic
- Contemporary
- Calmly playful

## Visual direction

Use:

- Warm neutral backgrounds
- Rounded corners
- Soft shadows used sparingly
- Clear visual hierarchy
- Friendly illustration
- Gentle movement
- Large touch targets
- Generous spacing

Avoid:

- Overstimulating animations
- Neon-heavy palettes
- Excessive badges
- Casino-like rewards
- Aggressive streak pressure
- Dense dashboards
- Corporate stock photography
- Visual imitation of Duolingo or other competitors

## Suggested initial tokens

```css
:root {
  --background: #fffaf2;
  --surface: #ffffff;
  --surface-muted: #f5eee3;
  --text-primary: #2f2925;
  --text-secondary: #6f655e;
  --brand-primary: #d96f52;
  --brand-primary-hover: #c76046;
  --brand-secondary: #6f9b8f;
  --brand-accent: #e5ad4f;
  --success: #4f876f;
  --warning: #b77b2f;
  --danger: #b95858;
  --border: #e7ddd1;

  --radius-sm: 0.5rem;
  --radius-md: 0.875rem;
  --radius-lg: 1.25rem;
  --radius-xl: 1.75rem;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
}
```

These are provisional and should be implemented as replaceable design tokens.

## Typography

Use one highly readable sans-serif family.

Requirements:

- Strong lowercase readability
- Clear distinction between similar characters
- Comfortable line height
- Large default child-interface sizing
- No decorative typefaces for body text

## Components

Initial component set:

- Button
- Icon button
- Card
- Progress indicator
- Choice card
- Dialog
- Toast
- Avatar
- Profile selector
- Lesson shell
- Story panel
- Mission card
- Parent insight card
- Empty state
- Error state
- Skeleton loader

## Accessibility requirements

- Minimum 44 by 44 pixel interactive targets
- Visible focus states
- Keyboard support
- Semantic headings
- Form labels
- Sufficient contrast
- Reduced-motion support
- Captions or transcripts for audio and video
- No information communicated only through color
