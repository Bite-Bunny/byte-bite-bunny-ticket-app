import { QueryClient } from '@tanstack/react-query'

const staleTimeInMinutes =
  Number(process.env.NEXT_PUBLIC_QUERY_STALE_TIME_IN_MINUTES) || 2

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: staleTimeInMinutes * 60 * 1000, // 2 minutes
        refetchOnWindowFocus: false,
        retry: 1,
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
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
