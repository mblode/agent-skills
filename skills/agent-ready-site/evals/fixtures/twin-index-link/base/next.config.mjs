/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/docs/:slug*.md",
          destination: "/md/:slug*",
        },
      ],
    };
  },
};

export default nextConfig;
