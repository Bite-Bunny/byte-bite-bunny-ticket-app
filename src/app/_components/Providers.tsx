'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import React, { PropsWithChildren } from 'react'
import { getQueryClient } from '@/shared/lib/query-client'

const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default Providers
