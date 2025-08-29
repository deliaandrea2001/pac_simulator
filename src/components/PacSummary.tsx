import { usePacStore } from '../store/usePacStore'
import { motion, useSpring, useTransform } from 'framer-motion'

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function AnimatedCurrency({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 80, damping: 18 })
  const rounded = useTransform(spring, (v) => Math.round(v))

  // update on value changes
  spring.set(value)

  return <motion.span>{useTransform(rounded, (v) => formatCurrency(v as number)).get()}</motion.span>
}

export function PacSummary() {
  const { result } = usePacStore()
  const s = result.summary

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="stat">
        <div className="stat-label">Totale versato</div>
        <div className="stat-value"><AnimatedCurrency value={s.totalContributed} /></div>
      </div>
      <div className="stat">
        <div className="stat-label">Capitale finale netto</div>
        <div className="stat-value"><AnimatedCurrency value={s.finalNet} /></div>
      </div>
      <div className="stat">
        <div className="stat-label">Guadagno/perdita stimata</div>
        <div className={`stat-value ${s.absoluteGainNet >= 0 ? 'stat-positive' : 'stat-negative'}`}>
          <AnimatedCurrency value={s.absoluteGainNet} /> ({s.percentGainNet.toFixed(1)}%)
        </div>
      </div>
    </div>
  )
}


