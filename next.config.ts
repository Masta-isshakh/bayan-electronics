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
  // experimental.inlineCss is off on purpose: it put the 57 KB stylesheet into every page's HTML
  // and RSC payload (three copies per page, ~100 MB across 600 static pages, past Amplify's 220 MB
  // build-output limit). One cached stylesheet is cheaper.
  images: {
    // Photos are pre-built as static WebP variants (scripts/media-manifest.mjs) and mapped by
    // lib/image-loader.ts, passed as the loader in components/ui/Image.tsx and HeroPoster:
    // nothing is resized on request, every image is a CDN hit. These widths drive srcset.
    deviceSizes: imageSizes.deviceSizes,
    imageSizes: imageSizes.imageSizes,
    // Fallback only (an image rendered without the loader): media URLs carry ?v=<hash>.
    localPatterns: [{ pathname: "/media/**" }],
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
