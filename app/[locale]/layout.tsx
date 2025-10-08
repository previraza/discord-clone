import { ModalProvider } from "@/components/providers/modal-provider";
import { I18nProviderClient } from "@/i18n/client";

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  return (
    <I18nProviderClient locale={locale}>
        <ModalProvider />
        {children}
    </I18nProviderClient>
  );
}