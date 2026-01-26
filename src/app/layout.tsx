import type { PropsWithChildren } from 'react'
import type { Metadata, Viewport } from 'next'
import { getLocale } from 'next-intl/server'
import { Inika } from 'next/font/google'

import 'normalize.css/normalize.css'
import './globals.css'
import { Root } from '@/shared/components/Root/Root'
import { PersistentLayout } from '@/shared/components/PersistentLayout'
import Providers from '@/shared/components/Providers'
import { I18nProvider } from '@/core/i18n/provider'

const inika = Inika({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-inika',
})

export const metadata: Metadata = {
  title: 'Bite Bunny',
  description: 'Your go-to app for managing tickets and more',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_API_URL || 'https://api.bbt-tg.xyz',
  ),
  openGraph: {
    title: 'Bite Bunny',
    description: 'Your go-to app for managing tickets and more',
    type: 'website',
  },
  // Optimize for performance
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#886403',
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body id="root" className={inika.className}>
        <I18nProvider>
          <Root>
            <PersistentLayout>
              <Providers>{children}</Providers>
            </PersistentLayout>
          </Root>
        </I18nProvider>
      </body>
    </html>
  )
}
