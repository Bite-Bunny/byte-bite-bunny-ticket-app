'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from './_components/Link/Link'
import { Button } from '@/shared/components/ui/Button'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="flex items-center justify-center">
          <Image
            src="/404.png"
            alt="404 Not Found"
            width={400}
            height={200}
            className="max-w-full h-auto"
            priority
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-red-600">
          {t('title')}
        </h1>

        <p className="text-white text-lg md:text-xl max-w-md mx-auto px-4">
          {t('message')}
        </p>

        <div className="pt-6 flex justify-center">
          <Link href="/">
            <Button className="px-10 py-4 rounded-xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-semibold text-lg transition-colors">
              {t('goHome')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
