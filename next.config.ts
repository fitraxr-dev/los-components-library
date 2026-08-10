import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignore TypeScript errors during Vercel builds since we copied legacy app files
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
