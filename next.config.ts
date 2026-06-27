import type { NextConfig } from "next";
// @ts-expect-error no types for next-pwa
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.instagram.com" },
      { protocol: "https", hostname: "cdninstagram.com" },
    ],
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline",
  },
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
})(nextConfig);
