'use client'

import Link from 'next/link'
import TelegramProvider from '@/shared/components/TelegramProvider'
import { Button } from '@/shared/components/ui/Button'

export default function HomeContent() {
  return (
    <TelegramProvider
      fallback={
        <div className="flex items-center justify-center p-4">Loading...</div>
      }
    >
      <div className="flex flex-col space-y-4 p-4">
        <div className="flex justify-end">
          <Link
            href="/test"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Test Page
          </Link>
        </div>

        <div className="flex flex-col space-y-4">
          <Button>Test Button</Button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl font-bold text-center">
            Welcome to Bite Bunny!
          </h1>
          <p className="text-gray-600 text-center">
            Your ticket management app
          </p>
        </div>
      </div>
    </TelegramProvider>
  )
}
