"use client";

import { useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import type { VideoSources } from "@/content/types";
import { cn } from "@/lib/cn";
import { LoopVideo } from "./LoopVideo";

const SMALL = "(max-width: 767px)";

type AmbientVideoProps = {
  sources: VideoSources;
  /** Server-rendered image of the loop's first frame (usually the page's LCP image). */
  poster: ReactNode;
  labels: { pause: string; play: string };
  /** Must position the box (e.g. "absolute inset-0" or "relative aspect-video"). */
  className: string;
};

/** An in-page ambient film: poster, muted loop over it and — once it plays — a pause control. */
export function AmbientVideo({ sources, poster, labels, className }: AmbientVideoProps) {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <div className={cn("overflow-hidden", className)}>
      {poster}
      <LoopVideo
        sources={sources}
        mobileQuery={SMALL}
        paused={paused}
        onActive={() => setActive(true)}
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-600 ease-entrance data-[active=true]:opacity-100"
      />
      {active && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? labels.play : labels.pause}
          className="absolute end-4 bottom-4 inline-flex size-11 items-center justify-center rounded-full border border-line-strong bg-void/40 text-text transition-colors duration-300 hover:border-lumen"
        >
          {paused ? (
            <Play aria-hidden="true" strokeWidth={1.5} className="size-4" />
          ) : (
            <Pause aria-hidden="true" strokeWidth={1.5} className="size-4" />
          )}
        </button>
      )}
    </div>
  );
}
