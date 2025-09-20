'use client'

import useMe from '../hooks/useMe'

export default function UserData() {
  const { data: me, isLoading, error } = useMe()

  if (isLoading) {
    return <div>Loading user data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="page-content">
      <div>Welcome to Bite Bunny!</div>
      <div>
        <div>Hi, {me?.user.first_name}</div>
      </div>

      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  )
}
