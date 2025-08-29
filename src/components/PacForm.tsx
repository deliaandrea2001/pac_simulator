import { usePacStore } from '../store/usePacStore'
import { Icon } from './Icon'
import type { ChangeEvent } from 'react'
import { z } from 'zod'
import { useState } from 'react'

const schema = z.object({
  periodicContribution: z.number().min(0),
  frequency: z.enum(['monthly', 'biweekly', 'quarterly']),
  durationMonths: z.number().int().min(1),
  contributionDurationMonths: z.number().int().min(1),
  initialCapital: z.number().min(0),
  startAgeYears: z.number().int().min(0).max(120),
  annualReturnRatePct: z.number().min(-100).max(100),
  annualFeePct: z.number().min(0).max(100),
  inflationRatePct: z.number().min(0).max(50),
  showInflationAdjusted: z.boolean(),
})

interface TooltipProps {
  content: string
  children: React.ReactNode
}

function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  )
}

function HelpIcon({ tooltip }: { tooltip: string }) {
  return (
    <Tooltip content={tooltip}>
      <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold cursor-help">
        ?
      </div>
    </Tooltip>
  )
}

export function PacForm() {
  const { input, setInput } = usePacStore()
  const [isCalculating, setIsCalculating] = useState(false)

  function handleNumber<K extends keyof typeof input>(key: K) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value)
      const next = { ...input, [key]: isNaN(value) ? 0 : value }
      const parsed = schema.safeParse(next)
      if (parsed.success) {
        setInput({ [key]: next[key] } as any)
      }
    }
  }

  function handleFrequency(e: ChangeEvent<HTMLSelectElement>) {
    const raw = e.target.value
    const value = raw === 'quarterly' ? 'quarterly' : raw === 'biweekly' ? 'biweekly' : 'monthly'
    setInput({ frequency: value })
  }

  function handleToggle(key: keyof typeof input) {
    return (checked: boolean) => {
      setInput({ [key]: checked } as any)
    }
  }

  function reset() {
    setInput({
      periodicContribution: 100,
      frequency: 'monthly',
      durationMonths: 120,
      contributionDurationMonths: 120,
      initialCapital: 0,
      startAgeYears: 30,
      annualReturnRatePct: 5,
      annualFeePct: 1,
      inflationRatePct: 2,
      showInflationAdjusted: false,
    })
  }

  async function handleCalculate() {
    setIsCalculating(true)
    // Simulate calculation
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsCalculating(false)
  }

  const durationInYears = Math.floor(input.durationMonths / 12)
  const durationRemainingMonths = input.durationMonths % 12

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Icon name="settings" className="text-white" />
        </div>
        <h2 className="section-title">Parametri di Investimento</h2>
      </div>

      <div className="space-y-6">
        {/* Basic Parameters */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="label flex items-center gap-2">
              Importo periodico (€)
              <HelpIcon tooltip="Somma che verserai ad ogni periodo (mensile o trimestrale)" />
            </label>
            <div className="relative">
              <input 
                type="number" 
                className="input has-prefix" 
                value={input.periodicContribution} 
                onChange={handleNumber('periodicContribution')} 
                min={0} 
                step={10}
                placeholder="100"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">€</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">Frequenza di versamento</label>
            <select className="input" value={input.frequency} onChange={handleFrequency}>
              <option value="biweekly">📅 Ogni due settimane</option>
              <option value="monthly">📅 Mensile</option>
              <option value="quarterly">📅 Trimestrale</option>
            </select>
          </div>
        </div>

        {/* Contribution Stop and Age */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="label flex items-center gap-2">
              Età iniziale
              <HelpIcon tooltip="La tua età di partenza: usata per mostrare l'età lungo la timeline" />
            </label>
            <input 
              type="number" 
              className="input" 
              value={input.startAgeYears}
              onChange={handleNumber('startAgeYears')}
              min={0}
              max={120}
            />
          </div>

          <div className="space-y-2">
            <label className="label flex items-center gap-2">
              Interrompi versamenti dopo (mesi)
              <HelpIcon tooltip="Durata in mesi in cui effettuerai i versamenti. Il calcolo continua anche dopo, senza ulteriori contributi." />
            </label>
            <input 
              type="number" 
              className="input" 
              value={input.contributionDurationMonths}
              onChange={handleNumber('contributionDurationMonths')}
              min={1}
              max={600}
              step={12}
            />
          </div>
        </div>

        {/* Duration Slider */}
        <div className="space-y-3">
          <label className="label flex items-center gap-2">
            Durata dell'investimento
            <HelpIcon tooltip="Per quanto tempo manterrai attivo il piano di accumulo" />
          </label>
          <div className="space-y-3">
            <input 
              type="range" 
              min={12} 
              max={600} 
              step={12} 
              value={input.durationMonths} 
              onChange={handleNumber('durationMonths')} 
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">1 anno</span>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-sm">
                {durationInYears} {durationInYears === 1 ? 'anno' : 'anni'}
                {durationRemainingMonths > 0 && ` e ${durationRemainingMonths} ${durationRemainingMonths === 1 ? 'mese' : 'mesi'}`}
              </div>
              <span className="text-sm text-gray-500">50 anni</span>
            </div>
          </div>
        </div>

        {/* Advanced Parameters */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="label flex items-center gap-2">
              Capitale iniziale (€)
              <HelpIcon tooltip="Somma che investi subito all'inizio del piano" />
            </label>
            <div className="relative">
              <input 
                type="number" 
                className="input has-prefix" 
                value={input.initialCapital} 
                onChange={handleNumber('initialCapital')} 
                min={0} 
                step={50}
                placeholder="0"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">€</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label flex items-center gap-2">
              Rendimento annuo stimato (%)
              <HelpIcon tooltip="Crescita media annua che ti aspetti dal tuo investimento" />
            </label>
            <div className="relative">
              <input 
                type="number" 
                className="input pr-8" 
                value={input.annualReturnRatePct} 
                onChange={handleNumber('annualReturnRatePct')} 
                step={0.1}
                placeholder="5.0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label flex items-center gap-2">
              Commissioni annue (%)
              <HelpIcon tooltip="Costo annuo del prodotto di investimento (TER, commissioni di gestione, etc.)" />
            </label>
            <div className="relative">
              <input 
                type="number" 
                className="input pr-8" 
                value={input.annualFeePct} 
                onChange={handleNumber('annualFeePct')} 
                min={0} 
                step={0.1}
                placeholder="1.0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label flex items-center gap-2">
              Inflazione annua (%)
              <HelpIcon tooltip="Tasso di inflazione annuo per calcolare il potere d'acquisto reale" />
            </label>
            <div className="relative">
              <input 
                type="number" 
                className="input pr-8" 
                value={input.inflationRatePct} 
                onChange={handleNumber('inflationRatePct')} 
                min={0} 
                max={50}
                step={0.1}
                placeholder="2.0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
            </div>
          </div>
        </div>

        {/* Inflation Toggle */}
        <div className="border-t border-gray-200 pt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={input.showInflationAdjusted}
              onChange={(e) => handleToggle('showInflationAdjusted')(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <Icon name="inflation" size="sm" className="text-orange-600" />
              <span className="text-sm font-semibold text-gray-800">Mostra potere d'acquisto (corretto per inflazione)</span>
              <HelpIcon tooltip="Attiva per vedere quanto varranno i tuoi soldi in termini di potere d'acquisto di oggi, considerando l'inflazione" />
            </div>
          </label>
          {input.showInflationAdjusted && (
            <p className="text-xs text-orange-600 mt-2 ml-7 font-medium">
              📊 Il grafico mostrerà una terza linea arancione con il valore reale del potere d'acquisto
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button 
            type="button" 
            className="btn btn-primary flex-1" 
            onClick={handleCalculate}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Icon name="spinner" size="sm" />
                Calcolo in corso...
              </>
            ) : (
              <>
                <Icon name="calculate" size="sm" />
                Ricalcola
              </>
            )}
          </button>
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={reset}
          >
            <Icon name="reset" size="sm" />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}