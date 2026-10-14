import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "1" });

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const immutable = [{ key: "Cache-Control", value: `public, max-age=${ONE_YEAR_SECONDS}, immutable` }];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: ONE_YEAR_SECONDS,
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
    qualities: [60, 70, 75],
    // Media URLs carry a ?v=<content hash> (see content/media-manifest.json), so
    // replacing a file under public/media busts every cache layer.
    localPatterns: [{ pathname: "/media/**" }],
  },
  async headers() {
    return [
      { source: "/media/:path*", headers: immutable },
      { source: "/_next/static/:path*", headers: immutable },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
