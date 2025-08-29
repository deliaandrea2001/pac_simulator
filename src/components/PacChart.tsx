import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Area, Brush } from 'recharts'
import { usePacStore } from '../store/usePacStore'
import { useState } from 'react'

function Currency({ value }: { value: number }) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const contributed = payload.find((p: any) => p.dataKey === 'contributed')?.value
  const estimated = payload.find((p: any) => p.dataKey?.startsWith('estimated'))?.value
  return (
    <div className="rounded-lg border border-[--color-border] bg-[--color-surface] p-3 shadow-md">
      <div className="text-xs text-[--color-fg-muted]">{label}</div>
      <div className="text-sm">Capitale versato: <strong>{Currency({ value: contributed })}</strong></div>
      <div className="text-sm">Capitale stimato: <strong>{Currency({ value: estimated })}</strong></div>
    </div>
  )
}

export function PacChart() {
  const { result } = usePacStore()
  const [showGross, setShowGross] = useState(false)
  const data = result.points.map((p) => ({
    date: p.dateLabel,
    contributed: Math.round(p.totalContributed * 100) / 100,
    estimatedNet: Math.round(p.estimatedValueNet * 100) / 100,
    estimatedGross: Math.round(p.estimatedValueGross * 100) / 100,
  }))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="section-title">Andamento nel tempo</div>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={showGross} onChange={(e) => setShowGross(e.target.checked)} />
          Mostra lordo
        </label>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={24} />
            <YAxis tickFormatter={(v) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v as number)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <defs>
              <linearGradient id="fillEstimated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-positive)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-positive)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillContributed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent-600)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-accent-600)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey={showGross ? 'estimatedGross' : 'estimatedNet'} name={`Capitale stimato (${showGross ? 'lordo' : 'netto'})`} stroke="var(--color-positive)" fill="url(#fillEstimated)" strokeWidth={2.25} dot={false} isAnimationActive animationDuration={600} />
            <Line type="monotone" dataKey="contributed" name="Capitale versato" stroke="var(--color-accent-600)" dot={false} strokeWidth={2.25} isAnimationActive animationDuration={800} />
            <Brush dataKey="date" height={20} stroke="var(--color-border)" travellerWidth={8} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


