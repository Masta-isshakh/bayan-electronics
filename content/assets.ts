// Media manifest. Paths are relative to public/media and match the filenames the
// client's image prompts use — do not rename. Sizes are the target delivery sizes;
// scripts/make-placeholders.mjs generates any missing file at that size, and real files
// report their own pixel size from the manifest (same aspect ratio, never upscaled).
import manifest from "./media-manifest.json";
import { familySlugs, sectorSlugs, type FamilySlug, type SectorSlug } from "./taxonomy";
import type { ImageAsset, MediaFile } from "./types";

type ManifestEntry = { v: string; placeholder: boolean; w?: number; h?: number };
const files: Record<string, ManifestEntry | undefined> = manifest.files;

/** URL with the content hash and, for photos, the source width lib/image-loader.ts needs. */
function versioned(path: string): string {
  const entry = files[path];
  if (!entry) return `/media/${path}`;
  return entry.w ? `/media/${path}?v=${entry.v}&w=${entry.w}` : `/media/${path}?v=${entry.v}`;
}

function img(path: string, width: number, height: number): ImageAsset {
  const entry = files[path];
  return {
    path,
    width: entry?.w ?? width,
    height: entry?.h ?? height,
    src: versioned(path),
    placeholder: entry?.placeholder ?? true,
  };
}

function media(path: string): MediaFile {
  const entry = files[path];
  return { path, src: versioned(path), available: Boolean(entry && !entry.placeholder) };
}

function bySlug<S extends string>(slugs: readonly S[], make: (slug: S) => ImageAsset): Record<S, ImageAsset> {
  return Object.fromEntries(slugs.map((slug) => [slug, make(slug)])) as Record<S, ImageAsset>;
}

export const assets = {
  hero: {
    posterDesktop: img("hero/poster-desktop.jpg", 1920, 1080),
    posterMobile: img("hero/poster-mobile.jpg", 1080, 1920),
    video: {
      desktop: { webm: media("hero/hero-desktop.webm"), mp4: media("hero/hero-desktop.mp4") },
      mobile: { webm: media("hero/hero-mobile.webm"), mp4: media("hero/hero-mobile.mp4") },
    },
  },
  home: {
    factoryOverview: img("home/factory-overview.jpg", 2400, 1600),
    qcLab: img("home/qc-lab.jpg", 2400, 1600),
    dohaNight: img("home/doha-night.jpg", 2880, 1200),
    traceabilityLabel: img("home/traceability-label.jpg", 2400, 1600),
    cctScene: img("home/cct-scene.jpg", 2400, 1500),
  },
  products: bySlug<FamilySlug>(familySlugs, (slug) => img(`products/${slug}.jpg`, 1600, 2000)),
  solutions: bySlug<SectorSlug>(sectorSlugs, (slug) => img(`solutions/${slug}.jpg`, 2400, 1600)),
  manufacturing: {
    smtLine: img("manufacturing/smt-line.jpg", 2400, 1600),
    assemblyLine: img("manufacturing/assembly-line.jpg", 2400, 1600),
    agingRacks: img("manufacturing/aging-racks.jpg", 2400, 1600),
    ipTest: img("manufacturing/ip-test.jpg", 2400, 1600),
    thermalImaging: img("manufacturing/thermal-imaging.jpg", 2400, 1600),
    calibrationBench: img("manufacturing/calibration-bench.jpg", 2400, 1600),
    warehouse: img("manufacturing/warehouse.jpg", 2400, 1600),
    engineer: img("manufacturing/engineer.jpg", 2400, 1600),
    /** Ambient film at the top of the manufacturing page (scripts/encode-video.sh). */
    line: {
      poster: img("manufacturing/line-poster.jpg", 1920, 1080),
      desktop: { webm: media("manufacturing/line-desktop.webm"), mp4: media("manufacturing/line-desktop.mp4") },
      mobile: { webm: media("manufacturing/line-mobile.webm"), mp4: media("manufacturing/line-mobile.mp4") },
    },
  },
  about: {
    factoryExterior: img("about/factory-exterior.jpg", 2880, 1620),
    team: img("about/team.jpg", 2400, 1600),
  },
  brand: {
    logo: media("brand/logo.svg"),
    logoMark: media("brand/logo-mark.svg"),
    logoWhite: media("brand/logo-white.svg"),
  },
  og: {
    default: img("og/og-default.jpg", 1200, 630),
  },
  textures: {
    noise: img("textures/noise.png", 256, 256),
  },
} as const;

/** A real image under public/media at its own pixel size (catalogue photos); null if missing. */
export function mediaImage(path: string): ImageAsset | null {
  const entry = files[path];
  return entry?.w && entry.h ? img(path, entry.w, entry.h) : null;
}

/** Every image the site expects, for the placeholder generator. */
export function listImages(node: unknown = assets): ImageAsset[] {
  if (!node || typeof node !== "object") return [];
  if ("width" in node && "path" in node) return [node as ImageAsset];
  return Object.values(node).flatMap((child) => listImages(child));
}

/** Every vector/video file the site can use, for the placeholder generator and docs. */
export function listMediaFiles(node: unknown = assets): MediaFile[] {
  if (!node || typeof node !== "object") return [];
  if ("available" in node && "path" in node) return [node as MediaFile];
  return Object.values(node).flatMap((child) => listMediaFiles(child));
}
