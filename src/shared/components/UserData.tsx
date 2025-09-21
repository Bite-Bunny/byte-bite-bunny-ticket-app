'use client'

import { useRawInitData } from '@telegram-apps/sdk-react'
import useMe from '../hooks/useMe'

export default function UserData() {
  const me = useMe()
  const rawData = useRawInitData()

  if (me.id === 0) {
    return <div>Loading user data...</div>
  }

  if (me.id === 0) {
    return <div>Error: </div>
  }

  return (
    <div className="flex flex-col p-4 space-y-4">
      <div>Welcome to Bite Bunny!</div>
      <div>
        <div>Coins: {me.coins}</div>
      </div>

      <div>
        <pre>{JSON.stringify(rawData, null, 2)}</pre>

        <pre>{JSON.stringify(me, null, 2)}</pre>

        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => {
            navigator.clipboard.writeText(rawData || '')
          }}
        >
          Copy raw data
        </button>
      </div>
    </div>
  )
}
