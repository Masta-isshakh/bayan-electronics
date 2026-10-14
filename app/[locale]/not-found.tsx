import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="shell grid min-h-[85svh] content-center gap-8 pt-[var(--header-h)]">
      {/* An LED matrix that is not lit: one diode keeps trying. */}
      <svg viewBox="0 0 40 40" width="56" height="56" aria-hidden="true">
        <g fill="var(--color-line-strong)">
          <circle cx="10" cy="10" r="6" />
          <circle cx="30" cy="10" r="6" />
          <circle cx="10" cy="30" r="6" />
        </g>
        <circle cx="30" cy="30" r="6" className="animate-[flicker_4s_steps(1)_infinite] fill-lumen" />
      </svg>
      <h1 className="display text-5xl">{t("title")}</h1>
      <p className="measure text-lg text-fg-muted">{t("text")}</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">{t("home")}</ButtonLink>
        <ButtonLink href="/products" variant="outline">
          {t("products")}
        </ButtonLink>
      </div>
    </section>
  );
}
