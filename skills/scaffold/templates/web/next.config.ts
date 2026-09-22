import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Requires cacheComponents; next refuses the config otherwise.
  partialPrefetching: true,
  reactCompiler: true,
  // Version-skew protection: clients on an old deployment hard-reload instead of
  // loading stale chunks. Vercel sets this at build time; elsewhere it is inert.
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
  poweredByHeader: false,
  experimental: {
    // blode-icons-react is not on Next's built-in optimizePackageImports list,
    // so name it or every icon import pulls the barrel.
    optimizePackageImports: ["blode-icons-react"],
    // Runs the React Compiler natively inside Turbopack instead of through Babel.
    // Experimental: to back out, drop this line and install
    // babel-plugin-react-compiler; reactCompiler keeps working through Babel.
    turbopackRustReactCompiler: true,
  },
};

export default nextConfig;
