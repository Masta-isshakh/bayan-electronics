"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoSources } from "@/content/types";

const SLOW_CONNECTIONS = new Set(["slow-2g", "2g", "3g"]);

type NetworkInformation = { saveData?: boolean; effectiveType?: string };
type PlaybackState = { ready: boolean; inView: boolean; paused: boolean; sync?: () => void };

function videoAllowed(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (connection?.saveData) return false;
  return !SLOW_CONNECTIONS.has(connection?.effectiveType ?? "");
}

type LoopVideoProps = {
  sources: VideoSources;
  /** Media query that selects the `mobile` files. */
  mobileQuery: string;
  paused: boolean;
  className?: string;
  /** Called once the video is actually playing. */
  onActive?: () => void;
};

/**
 * Muted background loop over a server-rendered poster that shows its first frame, so the
 * fade from poster to video is invisible. Sources are attached as soon as the page has
 * loaded (the poster stays the LCP element) and playback starts at the first playable
 * frame; never for reduced motion, Save-Data or slow connections. Fades in once playing;
 * pauses off-screen, in hidden tabs and while `paused`.
 */
export function LoopVideo({ sources, mobileQuery, paused, className, onActive }: LoopVideoProps) {
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
      const set = window.matchMedia(mobileQuery).matches ? sources.mobile : sources.desktop;
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
      video.preload = "auto";
      video.addEventListener(
        "canplay",
        () => {
          state.current.ready = true;
          sync();
        },
        { once: true },
      );
      video.load();
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

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
      window.removeEventListener("load", start);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [sources, mobileQuery]);

  useEffect(() => {
    state.current.paused = paused;
    state.current.sync?.();
  }, [paused]);

  return (
    <video
      ref={ref}
      className={className}
      data-active={active}
      preload="none"
      muted
      playsInline
      loop
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => {
        setActive(true);
        onActive?.();
      }}
    />
  );
}
