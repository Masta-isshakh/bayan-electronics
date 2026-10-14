import type { ReactNode } from "react";

// <html> and <body> are rendered by app/[locale]/layout.tsx so lang/dir follow the locale.
// This pass-through root layout exists because app/not-found.tsx needs one.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
