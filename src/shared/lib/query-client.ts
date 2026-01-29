import { QueryClient } from '@tanstack/react-query'
import { queryCacheDefault } from '@/shared/config'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: queryCacheDefault.staleTime,
        gcTime: queryCacheDefault.gcTime,
        refetchOnWindowFocus: queryCacheDefault.refetchOnWindowFocus ?? false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

// For Next.js 15 App Router - create a new client for each request on the server
// and reuse a single client on the client side
let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: use singleton pattern to keep the same query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}
