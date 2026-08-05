/**
 * A one-line indirection over a full-page navigation.
 *
 * Auth transitions change the session cookie, so the destination must be
 * fetched fresh from the server (where the middleware and layout re-check the
 * session) rather than served from the client router's cache. A full navigation
 * is the reliable way to guarantee that. Keeping it behind this function also
 * gives the form tests a single, easy thing to spy on.
 */
export function navigateTo(path: string): void {
  window.location.assign(path);
}
