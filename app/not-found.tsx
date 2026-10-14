import "./globals.css";
import Link from "next/link";
import { archivo } from "@/lib/fonts";

// Only reached for requests the locale middleware does not handle.
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={archivo.variable}>
      <body className="grid min-h-svh place-items-center">
        <main className="shell text-center">
          <h1 className="display text-5xl">Nothing is lit here yet.</h1>
          <p className="mt-6 text-fg-muted">
            <Link className="text-lumen underline underline-offset-4" href="/en">
              Back to the home page
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
