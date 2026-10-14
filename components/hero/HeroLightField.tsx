import styles from "./hero.module.css";

/**
 * Mock-mode hero media: a CSS-only light field — warm and cool LED light drifting
 * over a faint diode matrix, with a slow 18 s sweep. Shipped until real video exists.
 */
export function HeroLightField() {
  return (
    <div className={styles.field} aria-hidden="true">
      <div className={styles.glowWarm} />
      <div className={styles.glowCool} />
      <div className={styles.matrix} />
      <div className={styles.lightSweep} />
    </div>
  );
}
