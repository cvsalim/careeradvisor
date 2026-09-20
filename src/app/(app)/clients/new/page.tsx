import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ClientForm } from "@/components/clients/client-form";
import { createClientRecord } from "@/app/actions/clients";

export default async function NewClientPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-[28px] text-charcoal">
        {t.clients.newClient}
      </h1>
      <ClientForm t={t} action={createClientRecord} />
    </div>
  );
}
