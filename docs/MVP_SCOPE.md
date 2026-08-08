# MVP Scope

## MVP objective

Deliver one complete learning journey that proves the core lesson experience.

## Included

### Marketing experience

- Homepage
- Product explanation
- Sample interactive scenario
- Email waitlist or account creation
- Pricing placeholder
- Privacy and safety explanation

### Parent experience

- Parent account
- Parent onboarding
- Create up to three child profiles
- Select a child profile
- View child progress
- View suggested offline missions

### Child experience

- Child profile selection behind a parent-controlled account
- Learning path
- Eight initial lessons
- Story screen
- Choice screen
- Consequence or feedback screen
- Principle explanation
- Practice interaction
- Offline mission
- Completion celebration
- Review lesson

### Platform

- Responsive web application
- Installable PWA where practical
- Authentication
- Database persistence
- Basic first-party analytics
- Error handling
- Accessibility
- Automated testing

> Note: "Installable PWA where practical" is delivered as a web app manifest
> plus generated icons and install metadata — enough for a supporting browser
> to offer "Add to Home Screen" and launch a branded minimal-ui window. There
> is deliberately no service worker or offline caching: caching child data
> on-device would live outside the server authorisation boundary and account
> deletion. See decision 043.

## Initial lesson module

Module title:

Meeting People

Lessons:

1. Saying hello
2. Introducing yourself
3. Remembering and using names
4. Meeting someone new
5. Joining a group
6. Listening while someone speaks
7. Leaving a conversation
8. Review and real-world challenge

## Excluded

- Native iOS application
- Native Android application
- Multiple curriculum modules
- Adult mode
- Teacher dashboard
- Classroom assignments
- Certificates
- Public achievements
- Public profiles
- Social chat
- Community features
- AI tutor
- Personalized curriculum generation
- Video streaming infrastructure
- Merchandise
- Referral program
- Complex gamification
- Multiple currencies
- Internationalization

> Note: "Multiple curriculum modules" was later authored on explicit
> instruction as the design handoff's content pass — all twelve neighborhood
> worlds now have draft lessons and are playable (decision 040). The rest of
> this exclusion list still holds.

## MVP completion criteria

The MVP is complete when a parent can:

1. Create an account.
2. Create a child profile.
3. Open the first lesson.
4. Allow the child to complete the lesson.
5. Save progress.
6. View the completed lesson in the parent dashboard.
7. Receive an offline mission.
8. Return later and continue from the correct point.
