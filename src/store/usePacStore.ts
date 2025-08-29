import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PacInput, PacResult } from '../types/pac'
import { simulatePac } from '../lib/pac'

export interface PacState {
  input: PacInput
  result: PacResult
  setInput: (partial: Partial<PacInput>) => void
  recompute: () => void
}

const defaultInput: PacInput = {
  periodicContribution: 100,
  frequency: 'monthly',
  durationMonths: 12 * 10,
  initialCapital: 0,
  annualReturnRatePct: 5,
  annualFeePct: 1,
  inflationRatePct: 2,
  showInflationAdjusted: false,
}

export const usePacStore = create<PacState>()(
  persist(
    (set, get) => ({
      input: defaultInput,
      result: simulatePac(defaultInput),
      setInput: (partial) => {
        const next = { ...get().input, ...partial }
        set({ input: next, result: simulatePac(next) })
      },
      recompute: () => {
        const current = get().input
        set({ result: simulatePac(current) })
      },
    }),
    { name: 'pac-simulator' }
  )
)


