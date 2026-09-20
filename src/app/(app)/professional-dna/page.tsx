import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function ProfessionalDnaPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return <ModulePlaceholder title={t.nav.professionalDna} locale={locale} />;
}
