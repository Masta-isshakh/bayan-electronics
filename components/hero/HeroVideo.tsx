"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroVideoSources } from "@/content/site";
import styles from "./hero.module.css";

const IDLE_TIMEOUT_MS = 1500;
const SLOW_CONNECTIONS = new Set(["slow-2g", "2g", "3g"]);
const PORTRAIT = "(max-width: 767px) and (orientation: portrait)";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };
type PlaybackState = { ready: boolean; inView: boolean; paused: boolean; sync?: () => void };

function videoAllowed(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (connection?.saveData) return false;
  return !SLOW_CONNECTIONS.has(connection?.effectiveType ?? "");
}

/**
 * Background video, never in the critical path: no src until after window load
 * (then idle), skipped for reduced motion, Save-Data and slow connections. Fades in
 * over the poster once it is actually playing; pauses off-screen, in hidden tabs and
 * when the visitor presses pause.
 */
export function HeroVideo({ sources, paused }: { sources: HeroVideoSources; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const state = useRef<PlaybackState>({ ready: false, inView: true, paused });

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const sync = () => {
      const { ready, inView, paused: userPaused } = state.current;
      if (!ready) return;
      if (inView && !userPaused && !document.hidden) video.play().catch(() => setActive(false));
      else video.pause();
    };
    state.current.sync = sync;

    const start = () => {
      if (!videoAllowed()) return;
      const set = window.matchMedia(PORTRAIT).matches ? sources.mobile : sources.desktop;
      for (const [type, file] of [
        ["video/webm", set.webm],
        ["video/mp4", set.mp4],
      ] as const) {
        const source = document.createElement("source");
        source.type = type;
        source.src = file.src;
        video.append(source);
      }
      video.muted = true;
      video.addEventListener(
        "canplaythrough",
        () => {
          state.current.ready = true;
          sync();
        },
        { once: true },
      );
      video.load();
    };

    let idleHandle: number | undefined;
    const schedule = () => {
      idleHandle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(start, { timeout: IDLE_TIMEOUT_MS })
          : window.setTimeout(start, IDLE_TIMEOUT_MS);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        state.current.inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);

    return () => {
      window.removeEventListener("load", schedule);
      if (idleHandle !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
        window.clearTimeout(idleHandle);
      }
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [sources]);

  useEffect(() => {
    state.current.paused = paused;
    state.current.sync?.();
  }, [paused]);

  return (
    <video
      ref={ref}
      className={styles.video}
      data-active={active}
      preload="none"
      muted
      playsInline
      loop
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setActive(true)}
    />
  );
}
