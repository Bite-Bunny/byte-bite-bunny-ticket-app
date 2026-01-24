'use client'

import { useEffect, useState, useTransition, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { MobileNavBar, TabType } from '../MobileLayout'

interface PersistentLayoutProps {
  children: React.ReactNode
}

const TAB_ROUTES: Record<TabType, string> = {
  home: '/',
  convert: '/convert',
  inventory: '/inventory',
  settings: '/settings',
}

export function PersistentLayout({ children }: PersistentLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // IMPORTANT: add all new routes to the array
  // Check if current route is a known route (not 404)
  const isKnownRoute = [
    '/',
    '/convert',
    '/inventory',
    '/settings',
    '/credits',
  ].includes(pathname)

  // Initialize state based on current route to prevent blinking
  const getInitialTab = (): TabType => {
    if (pathname === '/convert') return 'convert'
    if (pathname === '/inventory') return 'inventory'
    if (pathname === '/settings') return 'settings'
    return 'home'
  }

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab)

  // Prefetch all routes on mount for instant navigation
  useEffect(() => {
    Object.values(TAB_ROUTES).forEach((route) => {
      router.prefetch(route)
    })
  }, [router])

  useEffect(() => {
    if (pathname === '/convert') {
      setActiveTab('convert')
    } else if (pathname === '/inventory') {
      setActiveTab('inventory')
    } else if (pathname === '/settings') {
      setActiveTab('settings')
    } else {
      setActiveTab('home')
    }
  }, [pathname])

  const handleTabChange = useCallback(
    (tab: TabType) => {
      // Optimistic UI update - update tab state immediately
      setActiveTab(tab)
      // Use startTransition to make navigation non-blocking
      startTransition(() => {
        router.push(TAB_ROUTES[tab])
      })
    },
    [router, startTransition],
  )

  const handleTabHover = useCallback(
    (tab: TabType) => {
      // Prefetch on hover for even faster navigation
      router.prefetch(TAB_ROUTES[tab])
    },
    [router],
  )

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
        {pathname !== '/inventory' && (
          <div className="flex justify-center items-center px-5 py-[10px] flex-shrink-0 max-sm:px-5 max-sm:py-[50px] max-sm:pb-[30px] max-h-667:px-5 max-h-667:py-10 max-h-667:pb-5">
            <Image
              src="/logo.svg"
              alt="Bite Bunny Logo"
              width={99}
              height={20}
              className="brightness-0 invert opacity-90"
              priority
            />
          </div>
        )}

        <div
          className={`flex-1 flex flex-col px-5 overflow-y-auto scrollbar-none ${
            isKnownRoute ? 'pb-[120px]' : 'pb-5'
          }`}
        >
          {children}
        </div>

        {isKnownRoute && (
          <MobileNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onTabHover={handleTabHover}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  )
}
