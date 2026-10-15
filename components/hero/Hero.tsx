"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useIdle } from "@/components/motion/useIdle";
import { LoopVideo } from "@/components/media/LoopVideo";
import type { VideoSources } from "@/content/types";
import { HeroLightField } from "./HeroLightField";
import styles from "./hero.module.css";

// GSAP + ScrollTrigger load once the browser is idle, never in the critical path.
const HeroScroll = dynamic(() => import("./HeroScroll"), { ssr: false });

// Phones held upright get the portrait cut (matches HeroPoster's <picture> sources).
const PORTRAIT = "(max-width: 767px) and (orientation: portrait)";

// The switch-on intro plays once per page load, not on every client-side visit.
let introPlayed = false;

type HeroProps = {
  /** Server-rendered <picture> poster, or null to show the light field. */
  poster: ReactNode | null;
  video: VideoSources | null;
  grainSrc: string;
  labels: { pause: string; play: string; scroll: string };
  scrollTarget: string;
  children: ReactNode;
};

export function Hero({ poster, video, grainSrc, labels, scrollTarget, children }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const idle = useIdle();
  const [intro] = useState(() => !introPlayed);
  const [paused, setPaused] = useState(false);
  const hasMotion = Boolean(video) || !poster;

  useEffect(() => {
    introPlayed = true;
  }, []);

  // The wrapper is GSAP's pin spacer: supplying it means the pinned section is never
  // moved in the DOM, which would restart the CSS switch-on intro.
  return (
    <div data-hero-spacer="">
      <section
        id="hero"
        ref={root}
        className={styles.hero}
        data-hero-intro={intro ? "" : undefined}
        data-paused={paused}
        // The 2% grain is decorative: request it after first paint.
        style={idle ? ({ "--grain": `url(${grainSrc})` } as CSSProperties) : undefined}
      >
        <div className={styles.frame} data-hero-frame="">
          <div className={styles.media} data-hero-media="">
            <div className={styles.mediaInner}>
              {poster ?? <HeroLightField />}
              {video && <LoopVideo sources={video} mobileQuery={PORTRAIT} paused={paused} className={styles.video} />}
            </div>
          </div>
          <div className={styles.scrim} aria-hidden="true" />
          <div className={styles.grain} aria-hidden="true" />
          <span className={styles.strip} aria-hidden="true" />
          <span className={styles.edge} aria-hidden="true" data-hero-edge="" />
        </div>

        <div className={`shell ${styles.content}`} data-hero-content="">
          {children}
        </div>

        <a href={scrollTarget} className={styles.cue} aria-label={labels.scroll} />

        {hasMotion && (
          <button
            type="button"
            className={styles.pause}
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? labels.play : labels.pause}
          >
            {paused ? (
              <Play aria-hidden="true" strokeWidth={1.5} className="size-4" />
            ) : (
              <Pause aria-hidden="true" strokeWidth={1.5} className="size-4" />
            )}
          </button>
        )}

        {idle && <HeroScroll root={root} />}
      </section>
    </div>
  );
}
