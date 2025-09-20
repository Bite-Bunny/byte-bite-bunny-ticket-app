import type { PropsWithChildren } from 'react'
import type { Metadata, Viewport } from 'next'
import { getLocale } from 'next-intl/server'

import { I18nProvider } from '@/core/i18n/provider'

import '@telegram-apps/telegram-ui/dist/styles.css'
import 'normalize.css/normalize.css'
import './_assets/globals.css'
import { Root } from './_components/Root/Root'
import { PersistentLayout } from './_components/PersistentLayout'

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
            <PersistentLayout>{children}</PersistentLayout>
          </Root>
        </I18nProvider>
      </body>
    </html>
  )
}
