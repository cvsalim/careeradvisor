import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LoginForm } from "@/components/login-form";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default async function LoginPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <LoginForm t={t} />
      <LanguageSwitcher locale={locale} />
    </div>
  );
}
