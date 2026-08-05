/**
 * Parent authentication, as data.
 *
 * The account holder is always the parent or guardian (decision 001). There is
 * no child identity here and there must never be one: children have no
 * credentials, no email, and no login. The only personal datum this slice
 * introduces is a parent's email address, held by the auth provider.
 */

/** The signed-in parent, reduced to what the app actually needs. */
export type AuthUser = {
  id: string;
  email: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

/**
 * The result of an auth action. On failure the message is already generic and
 * safe to show a parent — it never reveals whether an email has an account (see
 * `errors.ts`).
 */
export type AuthActionResult = { ok: true } | { ok: false; message: string };

/**
 * Supabase's own minimum is 6; we ask for a little more. This is only enforced
 * when a password is *set* (sign-up, reset) — never on sign-in, where the check
 * would leak nothing useful and could reject a valid older password.
 */
export const minPasswordLength = 8;

/** A generous cap; a bcrypt-style backend truncates far below this anyway. */
export const maxPasswordLength = 200;
