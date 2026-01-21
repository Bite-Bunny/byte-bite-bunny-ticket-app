import { getTranslations } from 'next-intl/server'
import { TicketFeedWithData } from '@/features/ticket-feed'
import { showDailyCase, DailyCase } from '@/features/case'

async function getDailyCase(): Promise<{
  isClaimed: boolean
  daysLeft: number
}> {
  // TODO: Some api fetch in feature Hayko jan

  return {
    isClaimed: false,
    daysLeft: 2,
  }
}

export default async function HomeContent() {
  const t = await getTranslations('common')
  const dailyCase = await getDailyCase()

  return (
    <>
      <TicketFeedWithData count={30} />
      {showDailyCase(dailyCase) && <DailyCase />}
    </>
  )
}
