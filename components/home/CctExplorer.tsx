"use client";

import { Image } from "@/components/ui/Image";
import { useId, useState, type CSSProperties } from "react";
import type { ImageAsset } from "@/content/types";
import styles from "./cct.module.css";

const MIN_K = 2700;
const MAX_K = 6500;
const STEP_K = 100;
const START_K = 4000;

export type CctBand = { key: string; upTo: number; name: string; uses: string };

type CctExplorerProps = {
  image: ImageAsset;
  alt: string;
  label: string;
  /** e.g. "{kelvin} kelvin, {name}" — filled in for aria-valuetext. */
  valueTemplate: string;
  typicalLabel: string;
  minLabel: string;
  maxLabel: string;
  bands: CctBand[];
};

/**
 * Relights a neutral interior from 2700 K to 6500 K. The slider sets --p (0–1);
 * CSS turns it into --cct-tint with color-mix() and applies it as a soft-light
 * overlay plus a small brightness change. A diode swatch shows the same colour.
 */
export function CctExplorer({
  image,
  alt,
  label,
  valueTemplate,
  typicalLabel,
  minLabel,
  maxLabel,
  bands,
}: CctExplorerProps) {
  const id = useId();
  const [kelvin, setKelvin] = useState(START_K);
  const progress = (kelvin - MIN_K) / (MAX_K - MIN_K);
  const band = bands.find((candidate) => kelvin <= candidate.upTo) ?? bands[bands.length - 1];
  const valueText = valueTemplate.replace("{kelvin}", String(kelvin)).replace("{name}", band.name);

  return (
    <div className={styles.explorer} style={{ "--p": progress } as CSSProperties}>
      <div className={styles.stage} data-defer="">
        <Image src={image.src} alt={alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className={styles.scene} />
        <span className={styles.tint} aria-hidden="true" />
      </div>

      <div className={styles.panel}>
        <div className="flex items-center gap-4">
          <span className={styles.diode} aria-hidden="true" />
          <p aria-hidden="true">
            <span className="display block text-5xl leading-none tabular-nums" dir="ltr">
              {kelvin}
              <span className="text-fg-muted"> K</span>
            </span>
            <span className="mt-2 block text-lg text-fg">{band.name}</span>
          </p>
        </div>

        <label htmlFor={id} className="mt-10 block text-sm font-medium text-fg">
          {label}
        </label>
        <input
          id={id}
          type="range"
          min={MIN_K}
          max={MAX_K}
          step={STEP_K}
          value={kelvin}
          onChange={(event) => setKelvin(Number(event.target.value))}
          aria-valuetext={valueText}
          className={styles.range}
        />
        <div className="flex justify-between text-sm text-fg-muted" aria-hidden="true">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>

        <dl className="mt-8 border-t border-rule pt-5">
          <dt className="text-sm text-fg-muted">{typicalLabel}</dt>
          <dd className="mt-1 text-base text-fg" aria-live="polite">
            {band.uses}
          </dd>
        </dl>
      </div>
    </div>
  );
}
