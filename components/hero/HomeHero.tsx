import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { assets } from "@/content/assets";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Hero } from "./Hero";
import { HeroHeadline } from "./HeroHeadline";
import { HeroPoster } from "./HeroPoster";
import styles from "./hero.module.css";

const proofKeys = ["made", "lab", "trace", "language"] as const;
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Resolves the hero mode from the media manifest:
 *   real poster  → poster is the LCP element; otherwise the CSS light field;
 *   video files  → layered over it once playing (site.hero.video = null disables).
 */
export async function HomeHero({ scrollTarget }: { scrollTarget: string }) {
  const t = await getTranslations("hero");
  const tc = await getTranslations("common");
  const ta = await getTranslations("a11y");

  const { posterDesktop, posterMobile } = assets.hero;
  const posterReady = !posterDesktop.placeholder && !posterMobile.placeholder;
  const video = site.hero.video;
  const videoReady =
    video !== null &&
    [video.desktop.webm, video.desktop.mp4, video.mobile.webm, video.mobile.mp4].every((file) => file.available);

  return (
    <Hero
      poster={posterReady ? <HeroPoster desktop={posterDesktop} mobile={posterMobile} /> : null}
      video={videoReady ? video : null}
      grainSrc={assets.textures.noise.src}
      labels={{ pause: ta("pauseMotion"), play: ta("playMotion"), scroll: t("scroll") }}
      scrollTarget={scrollTarget}
    >
      <HeroHeadline text={t("headline")} />
      <p className={cn(styles.subline, styles.rise)} style={delay(1050)}>
        {t("subline")}
      </p>
      <div className={cn(styles.actions, styles.rise)} style={delay(1100)}>
        <MagneticLink href="/quote" className={buttonClasses("lumen")}>
          {tc("requestQuote")}
        </MagneticLink>
        <ButtonLink href="/products" variant="outline">
          {tc("exploreProducts")}
        </ButtonLink>
      </div>
      <ul className={cn(styles.proof, styles.rise)} style={delay(1100)} aria-label={t("proofLabel")}>
        {proofKeys.map((key) => (
          <li key={key}>{t(`proof.${key}`)}</li>
        ))}
      </ul>
    </Hero>
  );
}
