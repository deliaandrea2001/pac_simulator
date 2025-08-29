export type ContributionFrequency = 'monthly' | 'quarterly'

export interface PacInput {
  periodicContribution: number
  frequency: ContributionFrequency
  durationMonths: number
  initialCapital: number
  annualReturnRatePct: number
  annualFeePct: number
}

export interface PacPoint {
  monthIndex: number
  dateLabel: string
  contribution: number
  totalContributed: number
  estimatedValueGross: number
  estimatedValueNet: number
}

export interface PacSummary {
  totalContributed: number
  finalGross: number
  finalNet: number
  absoluteGainGross: number
  absoluteGainNet: number
  percentGainGross: number
  percentGainNet: number
}

export interface PacResult {
  points: PacPoint[]
  summary: PacSummary
}


