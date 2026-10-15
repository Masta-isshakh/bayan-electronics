"use client";

import type { ComponentProps, FocusEvent, PointerEvent, TouchEvent } from "react";
import { Link as BaseLink, useRouter } from "./navigation-base";

/** The hrefs the site uses: a path, or { pathname, query } — what router.prefetch accepts. */
type Href = Parameters<ReturnType<typeof useRouter>["prefetch"]>[0];
type LinkProps = Omit<ComponentProps<typeof BaseLink>, "href"> & { href: Href };

/**
 * Locale-aware Link that prefetches on intent — pointer hover, keyboard focus or touch
 * start — instead of whenever it scrolls into view. Viewport prefetching fetched ~30
 * full route payloads (≈ 3 MB uncompressed) while scrolling the home page on a phone;
 * intent prefetching still starts 100–300 ms before the click lands.
 * Pass prefetch={false} to opt out entirely.
 */
export function Link({ prefetch, onPointerEnter, onFocus, onTouchStart, ...props }: LinkProps) {
  const router = useRouter();

  function warm() {
    if (prefetch === false) return;
    router.prefetch(props.href, props.locale ? { locale: props.locale } : undefined);
  }

  return (
    <BaseLink
      {...props}
      prefetch={false}
      onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
        onPointerEnter?.(event);
        warm();
      }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
        onFocus?.(event);
        warm();
      }}
      onTouchStart={(event: TouchEvent<HTMLAnchorElement>) => {
        onTouchStart?.(event);
        warm();
      }}
    />
  );
}
