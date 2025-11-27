'use client'

import { Home, RefreshCw, ShoppingBag, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TabType } from './MobileLayout'

interface MobileNavBarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function MobileNavBar({ activeTab, onTabChange }: MobileNavBarProps) {
  const t = useTranslations('navigation')

  const tabs = [
    { id: 'home' as TabType, icon: Home, label: t('home') },
    { id: 'convert' as TabType, icon: RefreshCw, label: t('convert') },
    { id: 'inventory' as TabType, icon: ShoppingBag, label: t('inventory') },
    { id: 'settings' as TabType, icon: Settings, label: t('settings') },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] px-5 pb-1 pt-4">
      <div
        className="flex justify-around items-center bg-white/10 backdrop-blur-[20px] rounded-3xl px-2 py-3 shadow-[-8px_32px_rgba(0,0,0,0.3)] border border-white/15"
        style={{
          boxShadow:
            '0 -8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              className={`relative flex items-center justify-center bg-none border-none cursor-pointer px-5 py-4 rounded-[18px] min-w-[70px] touch-manipulation ${
                isActive
                  ? 'bg-white/15 backdrop-blur-[10px] border border-white/10'
                  : ''
              }`}
              onClick={() => onTabChange(tab.id)}
              style={{
                WebkitTapHighlightColor: 'transparent',
                boxShadow: isActive
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  : 'none',
              }}
            >
              <div className="flex flex-col items-center gap-1.5 z-[1]">
                <Icon
                  size={24}
                  className={`stroke-[1.5] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] ${
                    isActive ? 'text-white' : 'text-white/90'
                  }`}
                />
                <span
                  className={`text-[11px] font-medium text-center tracking-[0.3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] ${
                    isActive ? 'text-white' : 'text-white/90'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
