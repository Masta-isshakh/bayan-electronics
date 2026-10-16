import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { resolveLegacy } from "./lib/legacy";

const localeRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // URLs of the previous WordPress site: redirect to the new page, or 410 for its spam.
  const legacy = resolveLegacy(request.nextUrl.pathname);
  if (legacy && "gone" in legacy) {
    return new NextResponse("Gone", {
      status: 410,
      headers: { "X-Robots-Tag": "noindex", "Cache-Control": "public, max-age=86400" },
    });
  }
  if (legacy) return NextResponse.redirect(new URL(legacy.redirect, request.url), 301);
  return localeRouting(request);
}

export const config = {
  // Skip API routes, Next internals, static media and any path with a file extension.
  matcher: ["/((?!api|_next|_vercel|media|_img|.*\\..*).*)"],
};
