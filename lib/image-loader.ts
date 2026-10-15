import type { ImageLoaderProps } from "next/image";

// "/media/products/led-panels.jpg?v=1a2b3c4d&w=1600" → name, content hash, source width.
const MEDIA = /^\/media\/(.+)\.(?:jpe?g|png)\?v=([0-9a-f]+)&w=(\d+)$/;

/**
 * next/image loader for pre-built variants. scripts/media-manifest.mjs writes every photo
 * under public/media as WebP at each configured width up to its own width, named
 * /_img/<name>.<hash>.<width>.webp — static, immutable files served straight from the CDN,
 * so no image is ever resized on request. Requests wider than the source get the source width.
 */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const match = MEDIA.exec(src);
  if (!match) return src;
  const [, name, version, sourceWidth] = match;
  return `/_img/${name}.${version}.${Math.min(width, Number(sourceWidth))}.webp`;
}
