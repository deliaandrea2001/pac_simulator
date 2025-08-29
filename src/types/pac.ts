export type ContributionFrequency = 'monthly' | 'quarterly'

export interface PacInput {
  periodicContribution: number
  frequency: ContributionFrequency
  durationMonths: number
  initialCapital: number
  annualReturnRatePct: number
  annualFeePct: number
  inflationRatePct: number
  showInflationAdjusted: boolean
}

export interface PacPoint {
  monthIndex: number
  dateLabel: string
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


