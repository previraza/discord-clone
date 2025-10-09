import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from '@/components/providers/theme-provider'
import '@/app/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Poppins } from 'next/font/google'
import { ModalProvider } from '@/components/providers/modal-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { I18nProviderClient } from '@/i18n/client'
import { getI18n } from '@/i18n/server'
import { cn } from '@/lib/utils'

// Load Poppins font with specific weights
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()
  return {
    title: t('layout.title'),
    description: t('layout.description'),
  }
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  const t = await getI18n()
  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <head>
          <meta name="apple-mobile-web-app-title" content={t('layout.title')} />
          <meta
            name="google-site-verification"
            content="aHfl2qQoUMINMiWMdSU3y2XatWuB3RECA5xw8tafs18"
          />
        </head>
        <body
          className={cn(
            'antialiased',
            'dark:bg-[#313338] bg-white',
            poppins.className,
          )}
        >
          <NuqsAdapter>
            <I18nProviderClient locale={locale}>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                disableTransitionOnChange
                storageKey="discord-theme"
              >
                <ModalProvider />
                <SocketProvider>
                  <QueryProvider>{children}</QueryProvider>
                </SocketProvider>
              </ThemeProvider>
            </I18nProviderClient>
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  )
}
