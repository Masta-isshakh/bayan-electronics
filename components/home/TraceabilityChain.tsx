"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";
import { useIdle } from "@/components/motion/useIdle";
import styles from "./trace.module.css";

const TraceScroll = dynamic(() => import("./TraceScroll"), { ssr: false });

export type TraceNode = { id: string; title: string; text: string };

/**
 * Supplier → … → Customer / project. The markup is complete and fully lit by default
 * (mobile, reduced motion, no JavaScript). On desktop pointer devices the section pins
 * and scroll draws the line; each node lights up and its caption appears as the line
 * reaches it. In RTL the line runs right to left.
 */
export function TraceabilityChain({ nodes, header }: { nodes: TraceNode[]; header: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const idle = useIdle();

  return (
    <div ref={root} className={styles.chain}>
      {header}
      <div className={styles.track}>
        <svg className={styles.line} aria-hidden="true">
          <line x1="0" y1="1" x2="100%" y2="1" className={styles.lineBase} />
          <line data-trace-path="" x1="0" y1="1" x2="100%" y2="1" pathLength={1} className={styles.lineLit} />
        </svg>
        <ol className={styles.nodes}>
          {nodes.map((node, index) => (
            <li key={node.id} className={styles.item}>
              <span data-trace-node="" className={styles.node} aria-hidden="true" />
              <div data-trace-caption="" className={styles.caption}>
                <span className="block text-sm text-fg-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 text-base font-medium text-fg">{node.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{node.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      {idle && <TraceScroll root={root} steps={nodes.length - 1} />}
    </div>
  );
}
