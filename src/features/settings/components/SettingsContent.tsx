'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useTransition } from 'react'
import { Settings, Globe, TestTube } from 'lucide-react'
import { setLocale } from '@/core/i18n/locale'
import { localesMap } from '@/core/i18n/config'
import type { Locale } from '@/core/i18n/types'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/Button'

export default function SettingsContent() {
  const t = useTranslations('settings')
  const locale = useLocale() as Locale
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLocaleChange = async (newLocale: Locale) => {
    if (newLocale === locale) return

    startTransition(async () => {
      await setLocale(newLocale)
      // Refresh the page to apply the new locale
      window.location.reload()
    })
  }

  return (
    <div className="flex flex-col p-5 gap-6">
      <div className="flex items-center gap-3 mb-2">
        <Settings className="text-white/90" size={24} />
        <h1 className="text-2xl font-semibold text-white/90">{t('title')}</h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Language Section */}
        <div className="bg-white/10 backdrop-blur-[20px] rounded-2xl p-5 border border-white/15 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-white/90" size={20} />
            <h2 className="text-lg font-medium text-white/90">
              {t('language')}
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            {localesMap.map((localeOption) => {
              const isSelected = locale === localeOption.key
              return (
                <button
                  key={localeOption.key}
                  onClick={() => handleLocaleChange(localeOption.key as Locale)}
                  disabled={isPending}
                  className={`
                    relative flex items-center justify-between px-4 py-3 rounded-xl
                    transition-all duration-200 touch-manipulation
                    ${
                      isSelected
                        ? 'bg-white/20 border-2 border-white/30'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }
                    ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span
                    className={`text-base font-medium ${
                      isSelected ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {localeOption.title}
                  </span>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white/90" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Development Section */}
        <div className="bg-white/10 backdrop-blur-[20px] rounded-2xl p-5 border border-white/15 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <TestTube className="text-white/90" size={20} />
            <h2 className="text-lg font-medium text-white/90">Development</h2>
          </div>

          <Button
            onClick={() => router.push('/test')}
            className="w-full px-4 py-3 text-sm flex items-center justify-center gap-2"
          >
            <TestTube size={18} />
            <span>View Test Page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
