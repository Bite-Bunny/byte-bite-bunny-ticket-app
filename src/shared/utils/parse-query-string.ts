export function parseQueryString<T = Record<string, any>>(query?: string): T {
  if (!query) {
    return {} as T
  }

  const params = new URLSearchParams(query)
  const result: Record<string, any> = {}

  params.forEach((value, key) => {
    try {
      // If value looks like encoded JSON, decode + parse
      if (
        value.includes('%22') ||
        value.startsWith('{') ||
        value.startsWith('[')
      ) {
        result[key] = JSON.parse(decodeURIComponent(value))
      } else {
        result[key] = decodeURIComponent(value)
      }
    } catch {
      result[key] = decodeURIComponent(value)
    }
  })

  return result as T
}
