"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import type { HeroVideoSources } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionQueries } from "@/lib/motion";
import { HeroLightField } from "./HeroLightField";
import { HeroVideo } from "./HeroVideo";
import styles from "./hero.module.css";

const PIN_LENGTH = "+=120%";
const FRAME_SCALE = 0.92;
const MEDIA_SHIFT_DESKTOP = -8;
const MEDIA_SHIFT_COMPACT = 10;
const CONTENT_RISE_PX = -40;
/** Content is gone before the next section reaches the headline. */
const CONTENT_FADE_SHARE = 0.3;
const SCRUB = 0.6;

// The switch-on intro plays once per page load, not on every client-side visit.
let introPlayed = false;

type HeroProps = {
  /** Server-rendered <picture> poster, or null to show the light field. */
  poster: ReactNode | null;
  video: HeroVideoSources | null;
  grainSrc: string;
  labels: { pause: string; play: string; scroll: string };
  scrollTarget: string;
  children: ReactNode;
};

export function Hero({ poster, video, grainSrc, labels, scrollTarget, children }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const [intro] = useState(() => !introPlayed);
  const [paused, setPaused] = useState(false);
  const hasMotion = Boolean(video) || !poster;

  useEffect(() => {
    introPlayed = true;
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin for 120vh; the frame shrinks into a lit, rounded panel while the
      // next section slides over it.
      mm.add(motionQueries.desktop, () => {
        const radius = getComputedStyle(document.documentElement).getPropertyValue("--radius-frame").trim();
        gsap
          .timeline({
            defaults: { ease: "none", duration: 1 },
            scrollTrigger: { trigger: root.current, start: "top top", end: PIN_LENGTH, pin: true, pinSpacing: false, scrub: SCRUB },
          })
          .to("[data-hero-frame]", { scale: FRAME_SCALE, borderRadius: radius }, 0)
          .to("[data-hero-media]", { yPercent: MEDIA_SHIFT_DESKTOP }, 0)
          .to("[data-hero-content]", { opacity: 0, y: CONTENT_RISE_PX, duration: CONTENT_FADE_SHARE }, 0)
          .to("[data-hero-edge]", { opacity: 1 }, 0);
      });

      // Touch / narrow screens: no pin, a light parallax only.
      mm.add(motionQueries.compact, () => {
        gsap.to("[data-hero-media]", {
          yPercent: MEDIA_SHIFT_COMPACT,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="hero"
      ref={root}
      className={styles.hero}
      data-hero-intro={intro ? "" : undefined}
      data-paused={paused}
      style={{ "--grain": `url(${grainSrc})` } as CSSProperties}
    >
      <div className={styles.frame} data-hero-frame="">
        <div className={styles.media} data-hero-media="">
          <div className={styles.mediaInner}>
            {poster ?? <HeroLightField />}
            {video && <HeroVideo sources={video} paused={paused} />}
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
    </section>
  );
}
