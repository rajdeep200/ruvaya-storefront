import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Only /mock-image (the mock-mode placeholder generator) needs query
    // strings on a local image path; everything else stays unaffected.
    localPatterns: [{ pathname: "/mock-image" }, { pathname: "/assets/**" }],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
