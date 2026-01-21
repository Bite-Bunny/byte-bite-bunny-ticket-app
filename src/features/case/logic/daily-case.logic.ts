import type { DailyCase } from '../types'

/**
 * Determines if the daily case should be shown to the user
 * @param dailyCase - The daily case data
 * @returns true if the daily case should be displayed
 */
export function showDailyCase(dailyCase: DailyCase): boolean {
  return dailyCase.daysLeft > 0 && !dailyCase.isClaimed
}
