import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts')

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    MOCK_INIT_AUTH: process.env.NEXT_PUBLIC_MOCK_INIT_AUTH,
  },
}

export default withNextIntl(nextConfig)
