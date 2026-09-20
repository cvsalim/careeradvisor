import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ClientForm } from "@/components/clients/client-form";
import { updateClientRecord } from "@/app/actions/clients";

export default async function ClientBasicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const boundAction = updateClientRecord.bind(null, id);

  return <ClientForm t={t} action={boundAction} defaultValues={client} />;
}
