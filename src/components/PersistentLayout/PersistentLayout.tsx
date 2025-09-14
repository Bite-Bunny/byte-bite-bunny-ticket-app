'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { MobileNavBar } from '@/components/MobileLayout/MobileNavBar'
import type { TabType } from '@/components/MobileLayout/MobileLayout'
import './PersistentLayout.css'

interface PersistentLayoutProps {
  children: React.ReactNode
}

export function PersistentLayout({ children }: PersistentLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Initialize state based on current route to prevent blinking
  const getInitialTab = (): TabType => {
    if (pathname === '/convert') return 'convert'
    if (pathname === '/inventory') return 'inventory'
    return 'home'
  }

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab)

  useEffect(() => {
    if (pathname === '/convert') {
      setActiveTab('convert')
    } else if (pathname === '/inventory') {
      setActiveTab('inventory')
    } else {
      setActiveTab('home')
    }
  }, [pathname])

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
    <div className="persistent-layout">
      <div className="persistent-layout__background" />
      <div className="persistent-layout__content">
        <div className="persistent-layout__header">
          <Image
            src="/logo.svg"
            alt="Bite Bunny Logo"
            width={99}
            height={20}
            className="persistent-layout__logo"
            priority
          />
        </div>

        <div className="persistent-layout__main">{children}</div>

        <MobileNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  )
}
