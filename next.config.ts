import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";
import imageSizes from "./lib/image-sizes.json";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "1",
  analyzerMode: process.env.ANALYZE_MODE === "json" ? "json" : "static",
  openAnalyzer: false,
});

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const immutable = [{ key: "Cache-Control", value: `public, max-age=${ONE_YEAR_SECONDS}, immutable` }];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Inline the (small) stylesheet into the HTML: removes a render-blocking round trip.
    inlineCss: true,
  },
  images: {
    // Photos are pre-built as static WebP variants (scripts/media-manifest.mjs) and mapped
    // by lib/image-loader.ts: nothing is resized on request, every image is a CDN hit.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: imageSizes.deviceSizes,
    imageSizes: imageSizes.imageSizes,
  },
  async headers() {
    return [
      // Media and variant URLs carry a content hash (see content/media-manifest.json).
      { source: "/media/:path*", headers: immutable },
      { source: "/_img/:path*", headers: immutable },
      // Font files carry a version in their name (e.g. arabic-sans-400.v1.woff2).
      { source: "/fonts/:path*", headers: immutable },
      { source: "/_next/static/:path*", headers: immutable },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
