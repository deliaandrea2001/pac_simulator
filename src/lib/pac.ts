import type { PacInput, PacPoint, PacResult } from '../types/pac'

function getMonthlyReturnRate(annualRatePct: number): number {
  const annualRate = annualRatePct / 100
  return Math.pow(1 + annualRate, 1 / 12) - 1
}

function getMonthlyFeeRate(annualFeePct: number): number {
  const annualFee = annualFeePct / 100
  return annualFee / 12
}

function getMonthlyInflationRate(annualInflationPct: number): number {
  const annualInflation = annualInflationPct / 100
  return Math.pow(1 + annualInflation, 1 / 12) - 1
}

function formatMonthLabel(startDate: Date, monthIndex: number): string {
  const date = new Date(startDate)
  date.setMonth(date.getMonth() + monthIndex)
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

export function simulatePac(input: PacInput, startDate = new Date()): PacResult {
  const monthlyReturn = getMonthlyReturnRate(input.annualReturnRatePct)
  const monthlyFee = getMonthlyFeeRate(input.annualFeePct)
  const monthlyInflation = getMonthlyInflationRate(input.inflationRatePct)
  const contributionInterval = input.frequency === 'monthly' ? 1 : 3

  const points: PacPoint[] = []

  let valueGross = input.initialCapital
  let valueNet = input.initialCapital
  let totalContributed = input.initialCapital
  let inflationFactor = 1 // Fattore cumulativo di inflazione

  for (let m = 0; m < input.durationMonths; m += 1) {
    const isContributionMonth = m % contributionInterval === 0
    const contribution = isContributionMonth ? input.periodicContribution : 0

    // Apply contribution at the start of the month
    valueGross += contribution
    valueNet += contribution
    totalContributed += contribution

    // Apply monthly return
    valueGross *= 1 + monthlyReturn
    valueNet *= 1 + monthlyReturn

    // Apply monthly fee (simple annual fee split monthly)
    valueNet *= 1 - monthlyFee

    // Update inflation factor (accumula l'inflazione nel tempo)
    inflationFactor *= 1 + monthlyInflation

    // Calculate inflation-adjusted value (potere d'acquisto)
    const valueInflationAdjusted = valueNet / inflationFactor

    points.push({
      monthIndex: m + 1,
      dateLabel: formatMonthLabel(startDate, m + 1),
      contribution,
      totalContributed,
      estimatedValueGross: valueGross,
      estimatedValueNet: valueNet,
      estimatedValueInflationAdjusted: valueInflationAdjusted,
    })
  }

  const last = points[points.length - 1]
  const finalGross = last ? last.estimatedValueGross : valueGross
  const finalNet = last ? last.estimatedValueNet : valueNet
  const finalInflationAdjusted = last ? last.estimatedValueInflationAdjusted : valueNet / inflationFactor

  const absoluteGainGross = finalGross - totalContributed
  const absoluteGainNet = finalNet - totalContributed
  const absoluteGainInflationAdjusted = finalInflationAdjusted - totalContributed
  const percentGainGross = totalContributed > 0 ? (absoluteGainGross / totalContributed) * 100 : 0
  const percentGainNet = totalContributed > 0 ? (absoluteGainNet / totalContributed) * 100 : 0
  const percentGainInflationAdjusted = totalContributed > 0 ? (absoluteGainInflationAdjusted / totalContributed) * 100 : 0

  return {
    points,
    summary: {
      totalContributed,
      finalGross,
      finalNet,
      finalInflationAdjusted,
      absoluteGainGross,
      absoluteGainNet,
      absoluteGainInflationAdjusted,
      percentGainGross,
      percentGainNet,
      percentGainInflationAdjusted,
    },
  }
}


