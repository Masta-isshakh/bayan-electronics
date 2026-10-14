import { getImageProps } from "next/image";
import { preload } from "react-dom";
import type { ImageAsset } from "@/content/types";
import styles from "./hero.module.css";

const PORTRAIT = "(max-width: 767px) and (orientation: portrait)";
const NOT_PORTRAIT = "(min-width: 768px), (orientation: landscape)";
const QUALITY = 70;

/**
 * The LCP element: an art-directed <picture> (portrait poster on phones, landscape
 * elsewhere) with a matching high-priority preload for each, so only one downloads.
 */
export function HeroPoster({ desktop, mobile }: { desktop: ImageAsset; mobile: ImageAsset }) {
  const common = { alt: "", sizes: "100vw", quality: QUALITY, priority: true } as const;
  const { props: mobileProps } = getImageProps({ ...common, src: mobile.src, width: mobile.width, height: mobile.height });
  const { props: desktopProps } = getImageProps({ ...common, src: desktop.src, width: desktop.width, height: desktop.height });

  preload(desktopProps.src, {
    as: "image",
    imageSrcSet: desktopProps.srcSet,
    imageSizes: "100vw",
    fetchPriority: "high",
    media: NOT_PORTRAIT,
  });
  preload(mobileProps.src, {
    as: "image",
    imageSrcSet: mobileProps.srcSet,
    imageSizes: "100vw",
    fetchPriority: "high",
    media: PORTRAIT,
  });

  return (
    <picture>
      <source media={PORTRAIT} srcSet={mobileProps.srcSet} sizes="100vw" />
      <img {...desktopProps} alt="" className={styles.poster} />
    </picture>
  );
}
