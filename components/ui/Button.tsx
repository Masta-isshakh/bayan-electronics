import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ButtonVariant = "lumen" | "outline" | "quiet";

const base =
  "inline-flex min-h-12 select-none items-center justify-center gap-2 rounded-control px-5 text-sm font-medium " +
  "transition-[background-color,border-color,color,translate,scale,filter] duration-300 ease-entrance active:scale-[0.98]";

const variants: Record<ButtonVariant, string> = {
  lumen: "bg-lumen text-void hover:brightness-110",
  outline: "border border-rule-strong text-fg hover:border-fg/50 hover:bg-fg/5",
  quiet: "px-0 text-fg underline decoration-transparent decoration-2 underline-offset-[0.4em] hover:decoration-maroon",
};

export function buttonClasses(variant: ButtonVariant = "lumen", className?: string) {
  return cn(base, variants[variant], className);
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant };

/** Internal, locale-aware link styled as a button. */
export function ButtonLink({ variant = "lumen", className, ...props }: ButtonLinkProps) {
  return <Link {...props} className={buttonClasses(variant, className)} />;
}

type AnchorButtonProps = ComponentProps<"a"> & { variant?: ButtonVariant };

/** External link (WhatsApp, mailto, tel) styled as a button. */
export function AnchorButton({ variant = "lumen", className, ...props }: AnchorButtonProps) {
  return <a {...props} className={buttonClasses(variant, className)} />;
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

export function Button({ variant = "lumen", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} {...props} className={buttonClasses(variant, className)} />;
}
