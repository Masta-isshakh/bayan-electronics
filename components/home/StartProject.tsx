import { Image } from "@/components/ui/Image";
import { getTranslations } from "next-intl/server";
import { AnchorButton, ButtonLink } from "@/components/ui/Button";
import { assets } from "@/content/assets";
import { whatsappHref } from "@/lib/contact";
import { KenBurns } from "./KenBurns";

/** Full-bleed closing band: Doha at night, a slow Ken Burns scrub, two ways to start. */
export async function StartProject({ id }: { id: string }) {
  const t = await getTranslations("home.start");
  const tc = await getTranslations("common");
  const whatsapp = whatsappHref(tc("whatsAppGreeting"));

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative isolate overflow-hidden">
      <KenBurns className="absolute inset-0 -z-10">
        <Image src={assets.home.dohaNight.src} alt={t("imageAlt")} fill sizes="100vw" className="object-cover" />
      </KenBurns>
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-void via-void/70 to-void/30" aria-hidden="true" />

      <div className="shell flex min-h-[80svh] flex-col justify-end py-20 lg:py-28">
        <h2 id={`${id}-title`} className="display max-w-[16ch] text-5xl">
          {t("title")}
        </h2>
        <p className="measure mt-6 text-lg text-fg/85">{t("text")}</p>
        <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap">
          <ButtonLink href="/quote">{tc("requestQuote")}</ButtonLink>
          {whatsapp ? (
            <AnchorButton href={whatsapp} target="_blank" rel="noopener noreferrer" variant="outline">
              {tc("chatWhatsApp")}
            </AnchorButton>
          ) : (
            <ButtonLink href="/contact" variant="outline">
              {tc("contactUs")}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
