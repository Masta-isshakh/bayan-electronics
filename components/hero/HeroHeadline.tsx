import { SplitWords } from "@/components/motion/SplitWords";
import { cn } from "@/lib/cn";
import styles from "./hero.module.css";

/** Hero h1, split into words for the switch-on reveal (animated by hero.module.css). */
export function HeroHeadline({ text }: { text: string }) {
  return (
    <h1 className={cn("display", styles.headline)}>
      <SplitWords text={text} wordClassName={styles.word} />
    </h1>
  );
}
