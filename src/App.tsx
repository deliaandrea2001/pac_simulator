import './index.css'
import { PacForm } from './components/PacForm'
import { PacChart } from './components/PacChart'
import { PacSummary } from './components/PacSummary'
import { ExportCsv } from './components/ExportCsv'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <div className="container py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Simulatore PAC</h1>
          <p className="text-sm text-[--color-fg-muted]">Calcola e visualizza il tuo piano di accumulo</p>
        </div>
        <div className="flex gap-2">
          <ExportCsv />
          <ThemeToggle />
        </div>
      </header>

      <PacSummary />
      <PacChart />
      <PacForm />
    </div>
  )
}

export default App
