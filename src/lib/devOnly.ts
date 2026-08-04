/**
 * Gate for development-only routes.
 *
 * The component gallery exists so we can review states side by side while
 * building. It is not product surface, so it must not answer in preview or
 * production deployments.
 *
 * Note the honest limitation: this makes the route return 404, it does not
 * remove the route's chunk from `next build` output.
 */
export function isDevRouteEnabled(
  nodeEnv: string | undefined = process.env.NODE_ENV,
): boolean {
  return nodeEnv === "development";
}
