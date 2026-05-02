import DecisionPanel from './DecisionPanel'
import FinancialStatements from './FinancialStatements'
import EventCard from './EventCard'
import KPIBoard from './KPIBoard'
import GameLog from './GameLog'
import TutorialPanel from './TutorialPanel'

export default function Dashboard() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <KPIBoard />
      <EventCard />
      <DecisionPanel />
      <FinancialStatements />
      <GameLog />
      <TutorialPanel />
    </section>
  )
}
