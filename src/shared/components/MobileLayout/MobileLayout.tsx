'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MobileNavBar } from './MobileNavBar'
import Image from 'next/image'

export type TabType = 'home' | 'cases' | 'inventory' | 'settings'

interface MobileLayoutProps {
  currentTab?: TabType
}

export function MobileLayout({ currentTab }: MobileLayoutProps) {
  const t = useTranslations('app')
  const router = useRouter()
  const pathname = usePathname()

  // Initialize state based on current route to prevent blinking
  const getInitialTab = (): TabType => {
    if (currentTab) return currentTab
    if (pathname === '/cases') return 'cases'
    if (pathname === '/inventory') return 'inventory'
    if (pathname === '/settings') return 'settings'
    return 'home'
  }

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab)

  useEffect(() => {
    if (currentTab) {
      setActiveTab(currentTab)
    } else {
      if (pathname === '/cases') {
        setActiveTab('cases')
      } else if (pathname === '/inventory') {
        setActiveTab('inventory')
      } else if (pathname === '/settings') {
        setActiveTab('settings')
      } else {
        setActiveTab('home')
      }
    }
  }, [currentTab, pathname])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    switch (tab) {
      case 'home':
        router.push('/')
        break
      case 'cases':
        router.push('/cases')
        break
      case 'inventory':
        router.push('/inventory')
        break
      case 'settings':
        router.push('/settings')
        break
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-hidden flex flex-col z-[1]">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-background-gold via-black to-black z-[-1]"
        style={{
          background: `
               radial-gradient(at 118% 95%, rgba(255, 161, 10, 0) 0%, rgba(0, 0, 0, 0.2) 100%),
               radial-gradient(at 18% 28%, rgba(255, 9, 9, 0) 0%, rgba(255, 0, 0, 0.2) 100%),
               radial-gradient(at 58% 9%, var(--color-background-gold) 0%, #000000 100%)
             `,
        }}
      />
      <div className="relative w-full h-full flex flex-col z-[1]">
        <div className="flex justify-center items-center px-5 py-[10px] flex-shrink-0 max-sm:px-5 max-sm:py-[50px] max-sm:pb-[30px] max-h-667:px-5 max-h-667:py-10 max-h-667:pb-5">
          <Image
            src="/logo.svg"
            alt={t('logoAlt')}
            width={99}
            height={20}
            className="brightness-0 invert opacity-90"
          />
        </div>

        <div className="flex-1 flex flex-col px-5 pb-[120px] overflow-y-auto scrollbar-none">
          {/* Empty main content area */}
        </div>

        <MobileNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  )
}
