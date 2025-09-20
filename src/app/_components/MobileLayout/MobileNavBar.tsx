'use client'

import { Home, RefreshCw, ShoppingBag } from 'lucide-react'
import { TabType } from './MobileLayout'
import './MobileNavBar.css'

interface MobileNavBarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: 'home' as TabType, icon: Home, label: 'Home' },
  { id: 'convert' as TabType, icon: RefreshCw, label: 'Convert' },
  { id: 'inventory' as TabType, icon: ShoppingBag, label: 'Inventory' },
]

export function MobileNavBar({ activeTab, onTabChange }: MobileNavBarProps) {
  return (
    <div className="mobile-nav-bar">
      <div className="mobile-nav-bar__container">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              className={`mobile-nav-bar__tab ${isActive ? 'mobile-nav-bar__tab--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {isActive && <div className="mobile-nav-bar__tab-background" />}

              <div className="mobile-nav-bar__tab-content">
                <Icon size={24} className="mobile-nav-bar__tab-icon" />
                <span className="mobile-nav-bar__tab-label">{tab.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
