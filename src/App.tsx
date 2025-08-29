import './index.css'
import { PacForm } from './components/PacForm'
import { PacChart } from './components/PacChart'
import { PacSummary } from './components/PacSummary'
import { ExportCsv } from './components/ExportCsv'
import { ThemeToggle } from './components/ThemeToggle'
import { Icon } from './components/Icon'

function App() {
  return (
    <div className="app-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <header className="text-center py-12 mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="chart" className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Simulatore PAC
              </h1>
            </div>
            
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              Pianifica il tuo futuro finanziario con il nostro simulatore avanzato per Piani di Accumulo del Capitale. 
              Visualizza la crescita dei tuoi investimenti nel tempo.
            </p>

            <div className="flex items-center justify-center gap-4">
              <ExportCsv />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          <PacSummary />

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="lg:order-2">
              <PacChart />
            </div>

            <div className="lg:order-1">
              <PacForm />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-white/70">
          <p>© 2024 Simulatore PAC. Strumento educativo per la pianificazione finanziaria.</p>
        </footer>
      </div>
    </div>
  )
}

export default App