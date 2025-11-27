//use server is required
'use server'

import { cookies } from 'next/headers'

import { defaultLocale, locales } from './config'
import type { Locale } from './types'

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE'

// Normalize locale code (e.g., 'en-US' -> 'en', 'ru-RU' -> 'ru')
const normalizeLocale = (locale?: string): Locale => {
  if (!locale) return defaultLocale

  // Extract base language code (first two characters)
  const baseLocale = locale.toLowerCase().split('-')[0] as Locale

  // Check if it's a supported locale, otherwise default to English
  return locales.includes(baseLocale) ? baseLocale : defaultLocale
}

const getLocale = async () => {
  const cookieValue = (await cookies()).get(COOKIE_NAME)?.value
  return cookieValue ? normalizeLocale(cookieValue) : defaultLocale
}

const setLocale = async (locale?: string) => {
  const normalizedLocale = normalizeLocale(locale)
  ;(await cookies()).set(COOKIE_NAME, normalizedLocale)
}

const hasLocaleCookie = async (): Promise<boolean> => {
  const cookieValue = (await cookies()).get(COOKIE_NAME)?.value
  return !!cookieValue
}

export { getLocale, setLocale, hasLocaleCookie }
