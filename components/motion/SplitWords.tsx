import { Fragment, type CSSProperties } from "react";

/**
 * Splits text into word spans (`.word`, with `--i` for staggering). Words only —
 * never characters: Arabic letters join, and splitting them breaks the script.
 */
export function SplitWords({ text, wordClassName = "word" }: { text: string; wordClassName?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          {index > 0 && " "}
          <span className={wordClassName} style={{ "--i": index } as CSSProperties}>
            {word}
          </span>
        </Fragment>
      ))}
    </>
  );
}
