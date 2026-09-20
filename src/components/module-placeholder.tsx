import type { Locale } from "@/lib/i18n/dictionaries";

export function ModulePlaceholder({
  title,
  locale,
}: {
  title: string;
  locale: Locale;
}) {
  const description =
    locale === "pt"
      ? "Este módulo ainda não foi construído."
      : "This module hasn't been built yet.";

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-[32px] leading-tight text-charcoal">
        {title}
      </h1>
      <p className="max-w-md font-editorial text-base text-text-secondary">
        {description}
      </p>
    </div>
  );
}
