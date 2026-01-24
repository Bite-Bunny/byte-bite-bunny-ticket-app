import { TicketFeedWithData } from '@/features/ticket-feed'
import { showDailyCase, DailyCase } from '@/features/case'
import { CreditsNavigationButton } from './CreditsNavigationButton'

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
  const dailyCase = await getDailyCase()

  return (
    <>
      <TicketFeedWithData count={30} />
      {showDailyCase(dailyCase) && <DailyCase />}
      <CreditsNavigationButton />
    </>
  )
}
