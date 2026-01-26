import type { DailyCaseData } from '../types'

/**
 * Determines if the daily case should be shown to the user
 * @param dailyCase - The daily case data
 * @returns true if the daily case should be displayed
 */
export function showDailyCase(dailyCase: DailyCaseData): boolean {
  return dailyCase.daysLeft > 0 && !dailyCase.isClaimed
}
