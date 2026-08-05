import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Where the authenticated parent session is saved.
 *
 * The `auth.setup.ts` project signs in once through the real UI and writes the
 * browser storage here; the specs that live behind the route gate load it with
 * `test.use({ storageState: STORAGE_STATE })`. Absolute, derived from this
 * file's location, so it does not depend on the working directory.
 */
const here = path.dirname(fileURLToPath(import.meta.url));

export const STORAGE_STATE = path.join(here, "..", ".auth", "parent.json");

/**
 * The offline development stand-in accepts any well-formed email and any
 * password of at least eight characters (see docs/AUTH.md), so these fixed
 * credentials are all the e2e run needs to establish a session.
 */
export const E2E_PARENT_EMAIL = "e2e-parent@example.com";
export const E2E_PARENT_PASSWORD = "e2e-password-123";
