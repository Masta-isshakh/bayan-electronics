import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Raw next-intl navigation APIs. Import from "@/i18n/navigation" instead, which swaps in
// the intent-prefetching Link.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
