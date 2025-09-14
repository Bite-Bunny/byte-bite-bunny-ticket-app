'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import './MobileLayout.css'
import { MobileNavBar } from './MobileNavBar'
import Image from 'next/image'

export type TabType = 'home' | 'convert' | 'inventory'

interface MobileLayoutProps {
  currentTab?: TabType
}

export function MobileLayout({ currentTab }: MobileLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<TabType>('home')

  useEffect(() => {
    if (currentTab) {
      setActiveTab(currentTab)
    } else {
      if (pathname === '/convert') {
        setActiveTab('convert')
      } else if (pathname === '/inventory') {
        setActiveTab('inventory')
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
      case 'convert':
        router.push('/convert')
        break
      case 'inventory':
        router.push('/inventory')
        break
    }
  }

  return (
    <div className="mobile-layout">
      <div className="mobile-layout__background" />
      <div className="mobile-layout__content">
        <div className="mobile-layout__header">
          <Image
            src="/logo.svg"
            alt="Bite Bunny Logo"
            width={99}
            height={20}
            className="mobile-layout__logo"
          />
        </div>

        <div className="mobile-layout__main">
          {/* Empty main content area */}
        </div>

        <MobileNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  )
}
