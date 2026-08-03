import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Fail the production build on type errors rather than shipping them.
  // Next 16 no longer runs ESLint during `next build`; CI runs `npm run lint`
  // as its own step instead.
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
};

export default nextConfig;
