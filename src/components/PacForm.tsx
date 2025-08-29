import { usePacStore } from '../store/usePacStore'
import type { ChangeEvent } from 'react'
import { z } from 'zod'
import { useRef } from 'react'

const schema = z.object({
  periodicContribution: z.number().min(0),
  frequency: z.enum(['monthly', 'quarterly']),
  durationMonths: z.number().int().min(1),
  initialCapital: z.number().min(0),
  annualReturnRatePct: z.number().min(-100).max(100),
  annualFeePct: z.number().min(0).max(100),
})

export function PacForm() {
  const { input, setInput } = usePacStore()
  const debounceRef = useRef<number | null>(null)

  function handleNumber<K extends keyof typeof input>(key: K) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value)
      const next = { ...input, [key]: isNaN(value) ? 0 : value }
      const parsed = schema.safeParse(next)
      if (!parsed.success) return
      // debounce updates for smoother interactions
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
      debounceRef.current = window.setTimeout(() => {
        setInput({ [key]: next[key] } as any)
      }, 150)
    }
  }

  function handleFrequency(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value === 'quarterly' ? 'quarterly' : 'monthly'
    setInput({ frequency: value })
  }

  function reset() {
    setInput({
      periodicContribution: 100,
      frequency: 'monthly',
      durationMonths: 120,
      initialCapital: 0,
      annualReturnRatePct: 5,
      annualFeePct: 1,
    })
  }

  return (
    <form className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <div className="section-title">Parametri</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Importo periodico (€) <span className="ml-1 text-[--color-fg-muted]" title="Somma versata ad ogni periodo">ⓘ</span></label>
            <input type="number" className="input" defaultValue={input.periodicContribution} onChange={handleNumber('periodicContribution')} min={0} step={10} />
          </div>
          <div>
            <label className="label">Frequenza</label>
            <select className="input" value={input.frequency} onChange={handleFrequency}>
              <option value="monthly">Mensile</option>
              <option value="quarterly">Trimestrale</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Durata (mesi) <span className="ml-1 text-[--color-fg-muted]" title="Numero totale di mesi">ⓘ</span></label>
            <div className="flex items-center gap-3">
              <input type="range" min={12} max={600} step={12} defaultValue={input.durationMonths} onChange={handleNumber('durationMonths')} className="w-full" />
              <div className="w-16 text-right text-sm">{input.durationMonths}</div>
            </div>
            <div className="helper">Tra 1 e 50 anni, passi annuali.</div>
          </div>
          <div>
            <label className="label">Capitale iniziale (€) <span className="ml-1 text-[--color-fg-muted]" title="Somma investita all'inizio">ⓘ</span></label>
            <input type="number" className="input" defaultValue={input.initialCapital} onChange={handleNumber('initialCapital')} min={0} step={50} />
          </div>
          <div>
            <label className="label">Rendimento annuo stimato (%) <span className="ml-1 text-[--color-fg-muted]" title="Crescita media annua">ⓘ</span></label>
            <input type="number" className="input" defaultValue={input.annualReturnRatePct} onChange={handleNumber('annualReturnRatePct')} step={0.1} />
          </div>
          <div>
            <label className="label">Commissioni annue semplici (%) <span className="ml-1 text-[--color-fg-muted]" title="Costo annuo del prodotto">ⓘ</span></label>
            <input type="number" className="input" defaultValue={input.annualFeePct} onChange={handleNumber('annualFeePct')} min={0} step={0.1} />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn btn-primary" onClick={() => {}}>Calcola</button>
          <button type="button" className="btn btn-ghost" onClick={reset}>Reset</button>
        </div>
      </div>
    </form>
  )
}


