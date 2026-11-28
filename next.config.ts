import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static site in ./out served under /sriif-web.
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? "/sriif-web" : "";

const nextConfig: NextConfig = {
  // Static export cannot use Partial Prerendering, so these are server-build only.
  cacheComponents: !pages,
  partialPrefetching: !pages,
  ...(pages && { output: "export", basePath, trailingSlash: true }),
  images: { unoptimized: pages },
  // API routes are named route.api.ts so the static GitHub Pages export (no server) leaves them out.
  pageExtensions: pages ? ["tsx", "ts"] : ["api.ts", "tsx", "ts"],
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
