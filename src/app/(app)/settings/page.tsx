import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getOpenAiKeyStatus } from "@/app/actions/settings";
import { OpenAiKeyForm } from "@/components/settings/openai-key-form";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const { configured, maskedKey } = await getOpenAiKeyStatus();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.settings.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.settings.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 font-ui text-[13px] text-text-secondary">
        <Badge tone={configured ? "positive" : "neutral"}>
          {configured ? t.settings.configuredLabel : t.settings.notConfiguredLabel}
        </Badge>
        {configured && maskedKey && <span>{maskedKey}</span>}
      </div>

      <OpenAiKeyForm t={t} />
    </div>
  );
}
