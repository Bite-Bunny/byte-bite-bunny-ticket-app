import type { PropsWithChildren } from 'react'
import type { Metadata, Viewport } from 'next'
import { getLocale } from 'next-intl/server'

import 'normalize.css/normalize.css'
import './globals.css'
import { Root } from '@/shared/components/Root/Root'
import { PersistentLayout } from '@/shared/components/PersistentLayout'
import Providers from '@/shared/components/Providers'
import { I18nProvider } from '@/core/i18n/provider'

export const metadata: Metadata = {
  title: 'Bite Bunny',
  description: 'Your go-to app for managing tickets and more',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
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
