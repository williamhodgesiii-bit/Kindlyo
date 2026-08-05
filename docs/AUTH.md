# Authentication

How a parent signs in, and why it is built the way it is. This is the parent
account only; child profiles are covered by `PROFILES.md` and are deliberately
**not** in the database yet.

## Summary

- The parent or guardian is the only account holder (decision 001). Children
  have no login, no email, and no credentials.
- Authentication is **Supabase Auth**, email + password, with an emailed
  password reset.
- Both `/parent` and `/learn` are reachable only from a signed-in parent's
  session. The child area has no login of its own — it is entered from the
  parent's session.
- No social login is enabled (it needs separate approval).

## Options considered

| Option                              | Verdict    | Why                                                                                                                                                                                                                                                                                                          |
| ----------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Supabase Auth** (`@supabase/ssr`) | **Chosen** | Already the approved stack (decision 003, `ARCHITECTURE.md`, `.env.example`). Managed password hashing, httpOnly cookie sessions with token rotation, reset emails, endpoint rate-limits. Gives an `auth.users` store **without** us modelling app tables — so child profiles need not move to the database. |
| Auth.js / NextAuth v5               | Rejected   | Not approved; email+password is not first-class; still needs a database adapter and an email provider. More to wire and get wrong.                                                                                                                                                                           |
| Clerk / Auth0                       | Rejected   | Not approved; another vendor; hosted UI/branding fights the custom, warm design.                                                                                                                                                                                                                             |
| Hand-rolled                         | Rejected   | Rolling your own password hashing, sessions, and reset tokens for a **children's** product is exactly the risk the security posture avoids. Still needs a datastore.                                                                                                                                         |

Two dependencies were added — `@supabase/supabase-js` and `@supabase/ssr` — as
the official path for the already-approved Supabase, not a new vendor decision.

**Password vs passwordless.** The prompt allowed either "password reset or a
secure passwordless equivalent". Email + password with reset was chosen: it maps
directly to the requirements, and sign-in needs no email delivery, which keeps
local development and the end-to-end tests simple. Magic-link passwordless is a
one-call swap (`signInWithOtp`) if the team later prefers it.

## Shape of the code

The app depends on a small `AuthGateway` interface, never on Supabase directly —
the same seam pattern as the waitlist `WaitlistSink` (decision 030).

```text
src/features/auth/
├── types.ts          AuthUser, credentials, the password length rule
├── validate.ts       parseEmail / parseSignIn / parseSignUp (pure, shared with the forms)
├── errors.ts         toAuthErrorMessage — the one place a provider error becomes generic text
├── gateway.ts        the AuthGateway interface
├── supabaseGateway.ts real implementation (used whenever Supabase is configured)
├── localSession.ts   signed-cookie session for offline dev (Web Crypto HMAC)
├── localGateway.ts   the offline stand-in gateway
├── session.ts        getServerAuthGateway / getSessionUser (picks the impl by env)
└── http.ts           shared route helpers (rate-limit key, JSON responses, safe redirect)

src/lib/supabase/     server.ts (route/component client), middleware.ts (session refresh)
src/middleware.ts     the route gate for /parent and /learn
src/app/(auth)/       login, signup, forgot-password, reset-password
src/app/api/auth/     signin, signup, reset-request, update-password (JSON endpoints)
src/app/auth/         confirm (email link landing), signout (POST → redirect)
```

`getServerAuthGateway` chooses the real Supabase gateway when
`env.authConfigured` is true, and the local stand-in otherwise. Everything above
it — layouts, endpoints, middleware — only ever talks to the interface.

## Security posture

- **No account enumeration.** Sign-in, sign-up, and reset all return generic
  messages; none says whether an address has an account. Reset always shows the
  same "if that address has an account…" confirmation.
- **Sessions.** `@supabase/ssr` sets httpOnly, secure, sameSite cookies and
  rotates tokens. Server code trusts `getUser()` (revalidated against Supabase),
  never the unverified `getSession()`.
- **Least privilege.** The service-role key is **not** used in this slice; only
  the anon key and the parent's own session are needed. Only `NEXT_PUBLIC_*`
  values ever reach the browser (enforced by `src/lib/env.ts`).
- **Reset tokens** are single-use and time-limited, issued and verified by
  Supabase; `/auth/confirm` establishes the recovery session server-side before
  a new password is accepted.
- **CSRF.** Auth writes go through same-origin `fetch`/form POSTs with
  sameSite=lax cookies; sign-out is a POST, so no prefetch can end a session.
- **Open redirect.** The `redirectTo` login parameter is reduced to a
  same-origin relative path (`safeNextPath`) before use.
- **Rate limiting.** Supabase enforces its own auth-endpoint limits server-side
  (the real control). On top of that, each endpoint applies an in-process
  fixed-window limiter — honestly per-process and not a security boundary, the
  same caveat as the waitlist (decision 030).
- **Defense in depth.** The middleware gates the routes, and the `/parent` and
  `/learn` server layouts check `getUser()` again (`ARCHITECTURE.md`: every
  protected surface verifies for itself).

## Environment variables

| Variable                        | Client-safe | Used now | Rule                                                                        |
| ------------------------------- | ----------- | -------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | yes         | yes      | valid http(s) when present; **required** in preview/production; https there |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes         | yes      | non-empty when present; **required** in preview/production                  |
| `APP_ENV`                       | no          | yes      | selects the real gateway vs the local stand-in                              |
| `NEXT_PUBLIC_APP_URL`           | yes         | yes      | base for the `…/auth/confirm` email redirect                                |
| `SUPABASE_SERVICE_ROLE_KEY`     | no          | **no**   | unused this slice (least privilege); placeholder                            |
| `DATABASE_URL`                  | no          | **no**   | unused (child profiles stay local); placeholder                             |

The two Supabase values are **both-or-neither** and format-checked when present,
matching the existing "fail on malformed, fall back when absent" style of
`parseEnv`.

## Setup

### Local (default, offline)

Nothing to configure. With `APP_ENV=local` and the Supabase values unset, the
app uses the **local development stand-in**: sign up or in with any well-formed
email and any password of at least 8 characters, and the session is a signed
httpOnly cookie. It is **not secure** and exists only so a fresh clone (and CI,
and the e2e suite) runs with no network — the same spirit as the local prototype
profile store and the waitlist log sink. It cannot run in a deployed environment
(`assertLocalAuthAllowed`), and env validation requires real Supabase there.

### Local against real Supabase (optional)

1. Create a free Supabase project, or run `supabase start`.
2. Put `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
   `.env.local`.
3. In Auth → URL Configuration, add `http://localhost:3000/auth/confirm` to the
   redirect allow-list.

### Preview / production

Use a **separate** Supabase project per environment. Set the two
`NEXT_PUBLIC_` values and `APP_ENV` (`preview` or `production`) — validation now
requires them, so the build fails if they are missing. Add that origin's
`/auth/confirm` to the redirect allow-list. Keep secrets and resources separate
per environment (`ARCHITECTURE.md`).
