import { QueryClient, isServer } from '@tanstack/react-query'

const staleTimeInMinutes =
  Number(process.env.NEXT_PUBLIC_QUERY_STALE_TIME_IN_MINUTES) || 2

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: staleTimeInMinutes * 60 * 1000, // 2 minutes
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}

export function hydrateQueryClient(queryClient: QueryClient) {
  if (isServer) {
    return
  }
  browserQueryClient = queryClient
}
