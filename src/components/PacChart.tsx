import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Area, Brush } from 'recharts'
import { usePacStore } from '../store/usePacStore'
import { useState, useMemo } from 'react'
import { Icon } from './Icon'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', { 
    style: 'currency', 
    currency: 'EUR',
    notation: value > 10000 ? 'compact' : 'standard'
  }).format(value)
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  
  const contributed = payload.find((p: any) => p.dataKey === 'contributed')?.value || 0
  const estimated = payload.find((p: any) => p.dataKey?.startsWith('estimated'))?.value || 0
  const inflationAdjusted = payload.find((p: any) => p.dataKey === 'inflationAdjusted')?.value || 0
  const gain = estimated - contributed
  const gainPercent = contributed > 0 ? ((gain / contributed) * 100).toFixed(1) : '0.0'
  const inflationGain = inflationAdjusted - contributed
  const inflationGainPercent = contributed > 0 ? ((inflationGain / contributed) * 100).toFixed(1) : '0.0'

  return (
    <div className="rounded-xl border border-gray-200 bg-white/98 backdrop-blur-md p-4 shadow-xl border-l-4 border-l-green-500">
      <div className="text-xs text-gray-600 font-bold mb-3 uppercase tracking-wide">{label}</div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-800 font-medium">Versato:</span>
          </div>
          <span className="font-bold text-blue-600">{formatCurrency(contributed)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-800 font-medium">Stimato:</span>
          </div>
          <span className="font-bold text-green-600">{formatCurrency(estimated)}</span>
        </div>
        {inflationAdjusted > 0 && (
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-800 font-medium">Potere d'acquisto:</span>
            </div>
            <span className="font-bold text-orange-600">{formatCurrency(inflationAdjusted)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex items-center justify-between gap-6">
            <span className="text-sm text-gray-800 font-semibold">💰 Guadagno nominale:</span>
            <span className={`font-bold ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gain)} ({gain >= 0 ? '+' : ''}{gainPercent}%)
            </span>
          </div>
          {inflationAdjusted > 0 && (
            <div className="flex items-center justify-between gap-6 mt-1">
              <span className="text-sm text-gray-800 font-semibold">🔥 Guadagno reale:</span>
              <span className={`font-bold ${inflationGain >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                {formatCurrency(inflationGain)} ({inflationGain >= 0 ? '+' : ''}{inflationGainPercent}%)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-12 h-6 rounded-full border-2 transition-colors ${
          checked 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500' 
            : 'bg-gray-200 border-gray-300'
        }`}>
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-0'
            }`}
            style={{ marginTop: '2px', marginLeft: '2px' }}
          />
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-800">{label}</span>
    </label>
  )
}

export function PacChart() {
  const { result, input } = usePacStore()
  const [showGross, setShowGross] = useState(false)
  
  // Memoize chart data to avoid recalculation on every render
  const data = useMemo(() => {
    const chartData = result.points.map((p) => ({
      date: p.dateLabel,
      contributed: Math.round(p.totalContributed * 100) / 100,
      estimatedNet: Math.round(p.estimatedValueNet * 100) / 100,
      estimatedGross: Math.round(p.estimatedValueGross * 100) / 100,
      inflationAdjusted: Math.round(p.estimatedValueInflationAdjusted * 100) / 100,
    }))
    
    // Debug: Verifica che i dati di inflazione siano presenti
    if (input.showInflationAdjusted && chartData.length > 10) {
      const lastPoint = chartData[chartData.length - 1]
      console.log('🔥 Debug inflazione:', {
        inflationRate: input.inflationRatePct + '%',
        lastInflationValue: lastPoint.inflationAdjusted,
        lastNetValue: lastPoint.estimatedNet,
        difference: lastPoint.estimatedNet - lastPoint.inflationAdjusted
      })
    }
    
    return chartData
  }, [result.points, input.showInflationAdjusted])

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Icon name="chart" className="text-white" />
          </div>
          <h2 className="section-title">Andamento nel Tempo</h2>
        </div>

        <div className="flex items-center gap-4">
          <Toggle
            checked={showGross}
            onChange={setShowGross}
            label="Mostra lordo"
          />
          
          {input.showInflationAdjusted && (
            <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
              🔥 Inflazione attiva ({input.inflationRatePct}%)
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-4">
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="fillEstimated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillContributed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillInflation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e2e8f0" 
                strokeOpacity={0.5}
              />
              
              <XAxis 
                dataKey="date" 
                minTickGap={30}
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              
              <YAxis 
                tickFormatter={(v) => formatCurrency(v as number)}
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                iconType="line"
              />

              <Area 
                type="monotone" 
                dataKey={showGross ? 'estimatedGross' : 'estimatedNet'} 
                name={`Capitale stimato (${showGross ? 'lordo' : 'netto'})`}
                stroke="#10b981" 
                fill="url(#fillEstimated)" 
                strokeWidth={2}
                dot={false}
                fillOpacity={0.1}
              />
              
              <Line 
                type="monotone" 
                dataKey="contributed" 
                name="Capitale versato" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                strokeDasharray="6 3"
              />
              
              <Line 
                type="monotone" 
                dataKey={showGross ? 'estimatedGross' : 'estimatedNet'} 
                name={`Capitale stimato (${showGross ? 'lordo' : 'netto'})`}
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />

              {input.showInflationAdjusted && (
                <Line 
                  type="monotone" 
                  dataKey="inflationAdjusted" 
                  name="🔥 Potere d'acquisto reale" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="8 3"
                />
              )}

              <Brush 
                dataKey="date" 
                height={30} 
                stroke="#667eea" 
                strokeWidth={2}
                fill="#f1f5f9"
                travellerWidth={10}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


    </div>
  )
}