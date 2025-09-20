'use client'

import { useRawInitData } from '@telegram-apps/sdk-react'
import useMe from '../hooks/useMe'

export default function UserData() {
  const { data: me, isLoading, error } = useMe()
  const rawData = useRawInitData()

  if (isLoading) {
    return <div>Loading user data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="flex flex-col p-4 space-y-4">
      <div>Welcome to Bite Bunny!</div>
      <div>
        <div>Hi, {me?.user.first_name}</div>
      </div>

      <div>
        <pre>{JSON.stringify(rawData, null, 2)}</pre>

        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => {
            navigator.clipboard.writeText(rawData || '')
          }}
        >
          Copy raw data
        </button>
      </div>

      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  )
}
