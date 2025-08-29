import { usePacStore } from '../store/usePacStore'
import { Icon } from './Icon'
import { useMemo } from 'react'

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('it-IT', { 
    style: 'currency', 
    currency: 'EUR', 
    maximumFractionDigits: 0 
  }).format(n)
}

interface StatCardProps {
  icon: string
  label: string
  value: number
  secondaryValue?: string
  trend?: 'positive' | 'negative' | 'neutral'
}

function StatCard({ icon, label, value, secondaryValue, trend = 'neutral' }: StatCardProps) {
  const trendClass = {
    positive: 'stat-positive',
    negative: 'stat-negative', 
    neutral: ''
  }[trend]

  const TrendIcon = trend === 'positive' ? 
    () => <Icon name="trending" size="sm" className="text-green-500" /> :
    trend === 'negative' ?
    () => <Icon name="trending" size="sm" className="text-red-500 rotate-180" /> :
    null

  return (
    <div className="stat group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-lg">
            <Icon name={icon} className="text-blue-600" />
          </div>
          <div className="stat-label">{label}</div>
        </div>
        {TrendIcon && <TrendIcon />}
      </div>
      
      <div className={`stat-value ${trendClass}`}>
        {formatCurrency(value)}
      </div>
      
      {secondaryValue && (
        <div className="text-sm text-gray-500 mt-1">
          {secondaryValue}
        </div>
      )}
    </div>
  )
}

export function PacSummary() {
  const { result } = usePacStore()
  const s = result.summary

  // Memoize expensive calculations
  const { input } = usePacStore()
  const stats = useMemo(() => {
    const baseStats: StatCardProps[] = [
      {
        icon: 'wallet',
        label: 'Totale Versato',
        value: s.totalContributed,
        trend: 'neutral' as const
      },
      {
        icon: 'money',
        label: 'Capitale Finale Netto',
        value: s.finalNet,
        trend: 'positive' as const
      }
    ]

    if (input.showInflationAdjusted) {
      baseStats.push({
        icon: 'chart',
        label: 'Potere d\'Acquisto Reale',
        value: s.finalInflationAdjusted,
        secondaryValue: `${s.percentGainInflationAdjusted.toFixed(1)}% rendimento reale`,
        trend: s.absoluteGainInflationAdjusted >= 0 ? 'positive' : 'negative'
      })
    } else {
      baseStats.push({
        icon: 'chart',
        label: 'Guadagno/Perdita',
        value: s.absoluteGainNet,
        secondaryValue: `${s.percentGainNet.toFixed(1)}% di rendimento`,
        trend: s.absoluteGainNet >= 0 ? 'positive' : 'negative'
      })
    }

    return baseStats
  }, [s, input.showInflationAdjusted])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Risultati della Simulazione
        </h2>
        <p className="text-gray-700 font-medium">
          Panoramica dei tuoi investimenti nel tempo
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Additional Insights */}
      <div className="grid gap-4 sm:grid-cols-2 mt-6">
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Icon name="clock" size="sm" className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">Tempo di Raddoppio</h3>
          </div>
          <p className="text-xs text-gray-700 font-medium">
            Con un rendimento del 5% annuo, il capitale raddoppia ogni ~14 anni (regola del 72)
            {input.showInflationAdjusted && (
              <span className="block text-orange-600 mt-1">
                💡 Con inflazione del 2%, il potere d'acquisto cresce più lentamente
              </span>
            )}
          </p>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Icon name="lightning" size="sm" className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">Potenza del PAC</h3>
          </div>
          <p className="text-xs text-gray-700 font-medium">
            Investimenti regolari riducono la volatilità e sfruttano il dollar-cost averaging
          </p>
        </div>
      </div>
    </div>
  )
}