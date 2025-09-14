import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

import { Root } from '@/components/Root/Root'
import { I18nProvider } from '@/core/i18n/provider'

import '@telegram-apps/telegram-ui/dist/styles.css'
import 'normalize.css/normalize.css'
import './_assets/globals.css'

export const metadata: Metadata = {
  title: 'Bite Bunny',
  description: 'Your go-to app for managing tickets and more',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>
        <I18nProvider>
          <Root>{children}</Root>
        </I18nProvider>
      </body>
    </html>
  )
}
