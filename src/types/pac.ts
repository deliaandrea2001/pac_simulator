export type ContributionFrequency = 'monthly' | 'biweekly' | 'quarterly'

export interface PacInput {
  periodicContribution: number
  frequency: ContributionFrequency
  durationMonths: number
  contributionDurationMonths: number
  initialCapital: number
  startAgeYears: number
  annualReturnRatePct: number
  annualFeePct: number
  inflationRatePct: number
  showInflationAdjusted: boolean
}

export interface PacPoint {
  monthIndex: number
  dateLabel: string
  ageYears: number
  contribution: number
  totalContributed: number
  estimatedValueGross: number
  estimatedValueNet: number
  estimatedValueInflationAdjusted: number
}

export interface PacSummary {
  totalContributed: number
  finalGross: number
  finalNet: number
  finalInflationAdjusted: number
  absoluteGainGross: number
  absoluteGainNet: number
  absoluteGainInflationAdjusted: number
  percentGainGross: number
  percentGainNet: number
  percentGainInflationAdjusted: number
}

export interface PacResult {
  points: PacPoint[]
  summary: PacSummary
}


