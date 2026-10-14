"use client";

import Image from "next/image";
import { AnimatePresence, m } from "motion/react";
import { Link } from "@/i18n/navigation";
import { MotionScope } from "@/components/motion/MotionScope";
import { DURATION, EASE_ENTRANCE } from "@/lib/motion";
import type { NavFamily, NavFeature, NavLabels } from "./nav";

type MegaPanelProps = {
  id: string;
  open: boolean;
  families: NavFamily[];
  feature: NavFeature;
  onNavigate: () => void;
  labels: Pick<NavLabels, "productsIntro" | "allProducts">;
};

/** Products mega panel: eleven families in three columns plus one featured family. Loaded lazily. */
export default function MegaPanel({ id, open, families, feature, onNavigate, labels }: MegaPanelProps) {
  return (
    <MotionScope>
      <AnimatePresence>
        {open && (
          <m.div
            id={id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.ui, ease: EASE_ENTRANCE }}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-surface lg:block"
          >
            <div className="shell grid grid-cols-12 gap-10 py-10">
              <div className="col-span-8">
                <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
                  <p className="text-sm text-fg-muted">{labels.productsIntro}</p>
                  <Link
                    href="/products"
                    onClick={onNavigate}
                    className="text-sm font-medium text-lumen hover:underline"
                  >
                    {labels.allProducts}
                  </Link>
                </div>
                <ul className="mt-4 grid grid-flow-col grid-cols-3 grid-rows-4 gap-x-6 gap-y-1">
                  {families.map((family) => (
                    <li key={family.slug}>
                      <Link
                        href={`/products/${family.slug}`}
                        onClick={onNavigate}
                        className="block rounded-control px-3 py-2.5 transition-colors hover:bg-surface-2"
                      >
                        <span className="block text-sm font-medium text-fg">{family.name}</span>
                        <span className="mt-0.5 line-clamp-1 text-sm text-fg-muted">{family.descriptor}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={feature.href}
                onClick={onNavigate}
                className="group relative col-span-4 block aspect-[4/3] overflow-hidden rounded-media border border-line"
              >
                <Image
                  src={feature.image.src}
                  alt={feature.alt}
                  fill
                  sizes="(min-width: 1440px) 420px, 30vw"
                  className="object-cover transition-transform duration-700 ease-entrance group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-linear-to-t from-void/90 via-void/30 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block text-base font-medium text-fg">{feature.title}</span>
                  <span className="mt-1 block text-sm text-fg-muted">{feature.text}</span>
                </span>
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </MotionScope>
  );
}
