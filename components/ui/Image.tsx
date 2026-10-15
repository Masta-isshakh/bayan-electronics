"use client";

import NextImage, { type ImageProps } from "next/image";
import imageLoader from "@/lib/image-loader";

/**
 * next/image with the pre-built variant loader (lib/image-loader.ts). The loader is passed
 * here rather than through `images.loaderFile`, which Turbopack does not apply to server
 * components in Next 15.5. Use this for every photo; a src the loader does not recognise is
 * served unchanged.
 */
export function Image(props: ImageProps) {
  return <NextImage loader={imageLoader} {...props} />;
}
